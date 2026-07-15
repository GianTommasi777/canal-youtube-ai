from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


ALLOWED_UPLOADS: dict[str, tuple[str, set[str]]] = {
    "image/jpeg": ("image", {".jpg", ".jpeg"}),
    "image/png": ("image", {".png"}),
    "image/webp": ("image", {".webp"}),
    "image/gif": ("image", {".gif"}),
    "video/mp4": ("video", {".mp4"}),
    "video/webm": ("video", {".webm"}),
    "video/quicktime": ("video", {".mov"}),
    "audio/mpeg": ("audio", {".mp3"}),
    "audio/wav": ("audio", {".wav"}),
    "audio/x-wav": ("audio", {".wav"}),
    "audio/ogg": ("audio", {".ogg"}),
    "audio/mp4": ("audio", {".m4a"}),
}


@dataclass
class StoredAsset:
    asset_type: str
    relative_path: str
    mime_type: str
    file_size_bytes: int
    original_filename: str


class AssetStorage:
    def __init__(self) -> None:
        self.root = settings.resolved_assets_directory
        self.root.mkdir(parents=True, exist_ok=True)

    async def save(self, upload: UploadFile, prompt_id: int) -> StoredAsset:
        filename = Path(upload.filename or "").name
        mime_type = (upload.content_type or "").lower()
        extension = Path(filename).suffix.lower()
        upload_spec = ALLOWED_UPLOADS.get(mime_type)
        if upload_spec is None or extension not in upload_spec[1]:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Unsupported file type or extension",
            )

        scene_directory = self.root / f"scene-{prompt_id}"
        scene_directory.mkdir(parents=True, exist_ok=True)
        destination = scene_directory / f"{uuid4().hex}{extension}"
        size = 0
        first_chunk = b""

        try:
            with destination.open("wb") as output:
                while chunk := await upload.read(1024 * 1024):
                    if not first_chunk:
                        first_chunk = chunk[:32]
                    size += len(chunk)
                    if size > settings.max_asset_size_bytes:
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail=(
                                f"File exceeds the {settings.max_asset_size_mb} MB limit"
                            ),
                        )
                    output.write(chunk)
            if size == 0 or not valid_signature(mime_type, first_chunk):
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail="File content does not match its declared type",
                )
        except Exception:
            destination.unlink(missing_ok=True)
            raise
        finally:
            await upload.close()

        relative_path = destination.relative_to(self.root).as_posix()
        return StoredAsset(
            asset_type=upload_spec[0],
            relative_path=f"content/assets/{relative_path}",
            mime_type=mime_type,
            file_size_bytes=size,
            original_filename=filename,
        )

    def delete(self, file_path: str) -> None:
        normalized_path = file_path.replace("\\", "/")
        prefix = "content/assets/"
        if not normalized_path.startswith(prefix):
            return
        target = (self.root / normalized_path.removeprefix(prefix)).resolve()
        if self.root not in target.parents:
            return
        target.unlink(missing_ok=True)
        if target.parent != self.root:
            try:
                target.parent.rmdir()
            except OSError:
                pass


def valid_signature(mime_type: str, data: bytes) -> bool:
    signatures = {
        "image/jpeg": lambda value: value.startswith(b"\xff\xd8\xff"),
        "image/png": lambda value: value.startswith(b"\x89PNG\r\n\x1a\n"),
        "image/gif": lambda value: value.startswith((b"GIF87a", b"GIF89a")),
        "image/webp": lambda value: value.startswith(b"RIFF") and value[8:12] == b"WEBP",
        "video/webm": lambda value: value.startswith(b"\x1a\x45\xdf\xa3"),
        "audio/mpeg": lambda value: value.startswith(b"ID3") or value.startswith(b"\xff"),
        "audio/wav": lambda value: value.startswith(b"RIFF") and value[8:12] == b"WAVE",
        "audio/x-wav": lambda value: value.startswith(b"RIFF") and value[8:12] == b"WAVE",
        "audio/ogg": lambda value: value.startswith(b"OggS"),
    }
    if mime_type in {"video/mp4", "video/quicktime", "audio/mp4"}:
        return len(data) >= 12 and data[4:8] == b"ftyp"
    validator = signatures.get(mime_type)
    return validator(data) if validator else False


asset_storage = AssetStorage()
