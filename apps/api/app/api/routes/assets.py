from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import SceneAsset, VisualPrompt
from app.schemas.assets import SceneAssetCreate, SceneAssetRead, SceneAssetUpdate

router = APIRouter()


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
    db.delete(asset)
    db.commit()
