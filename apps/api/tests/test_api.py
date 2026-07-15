import os
import shutil
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

test_database = Path(tempfile.gettempdir()) / "canal_youtube_ai_test.db"
test_assets = Path(tempfile.gettempdir()) / "canal_youtube_ai_test_assets"
test_database.unlink(missing_ok=True)
shutil.rmtree(test_assets, ignore_errors=True)
os.environ["APP_ENV"] = "test"
os.environ["DATABASE_URL"] = f"sqlite:///{test_database.as_posix()}"
os.environ["SEED_DEMO_DATA"] = "false"
os.environ["ASSETS_DIRECTORY"] = str(test_assets)

from app.core.database import engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_database():
    yield
    engine.dispose()
    test_database.unlink(missing_ok=True)
    shutil.rmtree(test_assets, ignore_errors=True)


def test_health():
    with TestClient(app) as client:
        response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_ideas():
    with TestClient(app) as client:
        response = client.get("/api/ideas")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_complete_editorial_flow():
    with TestClient(app) as client:
        idea_response = client.post(
            "/api/ideas",
            json={
                "title": "Idea de integración",
                "concept": "Concepto creado para verificar el flujo editorial completo.",
                "niche": "Pruebas",
                "hook": "Un hook verificable.",
                "status": "backlog",
            },
        )
        assert idea_response.status_code == 201
        idea_id = idea_response.json()["id"]

        status_response = client.patch(
            f"/api/ideas/{idea_id}/status", json={"status": "selected"}
        )
        assert status_response.status_code == 200
        assert status_response.json()["status"] == "selected"

        update_response = client.patch(
            f"/api/ideas/{idea_id}",
            json={"hook": "Hook actualizado", "niche": "Pruebas editoriales"},
        )
        assert update_response.status_code == 200
        assert update_response.json()["hook"] == "Hook actualizado"

        script_response = client.post(
            f"/api/ideas/{idea_id}/scripts",
            json={
                "full_script": "Este es un guion suficientemente largo para validar el endpoint.",
                "duration_target_seconds": 90,
                "final_question": "¿Funciona el flujo?",
            },
        )
        assert script_response.status_code == 201
        script_id = script_response.json()["id"]

        script_update_response = client.patch(
            f"/api/scripts/{script_id}",
            json={"duration_target_seconds": 120},
        )
        assert script_update_response.status_code == 200
        assert script_update_response.json()["duration_target_seconds"] == 120

        prompt_response = client.post(
            f"/api/scripts/{script_id}/visual-prompts",
            json={
                "scene_number": 1,
                "scene_description": "Escena de prueba",
                "prompt_text": "Cinematic test scene, 16:9",
            },
        )
        assert prompt_response.status_code == 201
        prompt_id = prompt_response.json()["id"]

        asset_response = client.post(
            f"/api/visual-prompts/{prompt_id}/assets",
            json={
                "name": "Imagen principal",
                "asset_type": "image",
                "file_path": "content/assets/integration-scene.png",
                "source": "manual",
                "status": "ready",
            },
        )
        assert asset_response.status_code == 201
        asset_id = asset_response.json()["id"]

        asset_update_response = client.patch(
            f"/api/assets/{asset_id}", json={"status": "approved"}
        )
        assert asset_update_response.status_code == 200
        assert asset_update_response.json()["status"] == "approved"

        uploaded_bytes = b"\x89PNG\r\n\x1a\n" + (b"\x00" * 64)
        upload_response = client.post(
            f"/api/visual-prompts/{prompt_id}/assets/upload",
            data={"name": "Imagen subida", "source": "integration-test"},
            files={"file": ("scene.png", uploaded_bytes, "image/png")},
        )
        assert upload_response.status_code == 201
        uploaded_asset = upload_response.json()
        uploaded_asset_id = uploaded_asset["id"]
        assert uploaded_asset["mime_type"] == "image/png"
        assert uploaded_asset["file_size_bytes"] == len(uploaded_bytes)
        assert uploaded_asset["original_filename"] == "scene.png"
        assert uploaded_asset["is_uploaded"] is True
        assert uploaded_asset["media_url"].startswith("/media/assets/scene-")

        media_response = client.get(uploaded_asset["media_url"])
        assert media_response.status_code == 200
        assert media_response.content == uploaded_bytes

        invalid_upload_response = client.post(
            f"/api/visual-prompts/{prompt_id}/assets/upload",
            files={"file": ("notes.txt", b"not media", "text/plain")},
        )
        assert invalid_upload_response.status_code == 415

        uploaded_path_update_response = client.patch(
            f"/api/assets/{uploaded_asset_id}",
            json={"file_path": "content/assets/moved.png"},
        )
        assert uploaded_path_update_response.status_code == 422

        prompt_update_response = client.patch(
            f"/api/scripts/visual-prompts/{prompt_id}",
            json={"scene_description": "Escena actualizada"},
        )
        assert prompt_update_response.status_code == 200

        detail_response = client.get(f"/api/ideas/{idea_id}")
        assert detail_response.status_code == 200
        assert len(detail_response.json()["script"]["visual_prompts"]) == 1
        detail_assets = detail_response.json()["script"]["visual_prompts"][0][
            "assets"
        ]
        assert any(asset["status"] == "approved" for asset in detail_assets)
        assert any(asset["is_uploaded"] is True for asset in detail_assets)

        delete_upload_response = client.delete(f"/api/assets/{uploaded_asset_id}")
        assert delete_upload_response.status_code == 204
        assert client.get(uploaded_asset["media_url"]).status_code == 404

        video_response = client.post(
            "/api/videos",
            json={
                "idea_id": idea_id,
                "title": "Vídeo de integración",
                "local_file_path": "content/renders/integration.mp4",
                "status": "ready_to_publish",
                "publish_date": "2026-06-20",
            },
        )
        assert video_response.status_code == 201
        assert video_response.json()["publish_date"] == "2026-06-20"
        video_id = video_response.json()["id"]

        video_update_response = client.patch(
            f"/api/videos/{video_id}", json={"status": "published"}
        )
        assert video_update_response.status_code == 200
        assert video_update_response.json()["status"] == "published"

        metric_response = client.post(
            f"/api/videos/{video_id}/metrics",
            json={
                "views": 100,
                "likes": 10,
                "comments": 2,
                "subscribers_gained": 3,
                "average_view_duration": 45,
                "retention_percentage": 50,
            },
        )
        assert metric_response.status_code == 201

        metrics_response = client.get("/api/metrics")
        assert metrics_response.status_code == 200
        assert any(item["video_id"] == video_id for item in metrics_response.json())
