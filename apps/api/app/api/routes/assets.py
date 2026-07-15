from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import SceneAsset, VisualPrompt
from app.schemas.assets import SceneAssetCreate, SceneAssetRead, SceneAssetUpdate
from app.services.asset_storage import asset_storage

router = APIRouter()


@router.post(
    "/visual-prompts/{prompt_id}/assets/upload",
    response_model=SceneAssetRead,
    status_code=status.HTTP_201_CREATED,
)
async def upload_scene_asset(
    prompt_id: int,
    file: UploadFile = File(...),
    name: str | None = Form(default=None),
    source: str | None = Form(default="upload"),
    notes: str | None = Form(default=None),
    db: Session = Depends(get_db),
):
    if db.get(VisualPrompt, prompt_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visual prompt not found"
        )
    stored = await asset_storage.save(file, prompt_id)
    asset = SceneAsset(
        visual_prompt_id=prompt_id,
        name=name.strip() if name and name.strip() else stored.original_filename,
        asset_type=stored.asset_type,
        file_path=stored.relative_path,
        source=source,
        status="ready",
        notes=notes,
        mime_type=stored.mime_type,
        file_size_bytes=stored.file_size_bytes,
        original_filename=stored.original_filename,
    )
    db.add(asset)
    try:
        db.commit()
        db.refresh(asset)
    except Exception:
        db.rollback()
        asset_storage.delete(stored.relative_path)
        raise
    return asset


@router.post(
    "/visual-prompts/{prompt_id}/assets",
    response_model=SceneAssetRead,
    status_code=status.HTTP_201_CREATED,
)
def create_scene_asset(
    prompt_id: int, payload: SceneAssetCreate, db: Session = Depends(get_db)
):
    if db.get(VisualPrompt, prompt_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visual prompt not found"
        )
    values = payload.model_dump()
    values["asset_type"] = payload.asset_type.value
    values["status"] = payload.status.value
    asset = SceneAsset(visual_prompt_id=prompt_id, **values)
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.patch("/assets/{asset_id}", response_model=SceneAssetRead)
def update_scene_asset(
    asset_id: int, payload: SceneAssetUpdate, db: Session = Depends(get_db)
):
    asset = db.get(SceneAsset, asset_id)
    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Scene asset not found"
        )
    if (
        asset.is_uploaded
        and payload.file_path is not None
        and payload.file_path != asset.file_path
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The path of an uploaded asset cannot be changed",
        )
    values = payload.model_dump(exclude_unset=True)
    if payload.asset_type is not None:
        values["asset_type"] = payload.asset_type.value
    if payload.status is not None:
        values["status"] = payload.status.value
    for field, value in values.items():
        setattr(asset, field, value)
    db.commit()
    db.refresh(asset)
    return asset


@router.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scene_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.get(SceneAsset, asset_id)
    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Scene asset not found"
        )
    file_path = asset.file_path if asset.is_uploaded else None
    db.delete(asset)
    db.commit()
    if file_path:
        asset_storage.delete(file_path)
