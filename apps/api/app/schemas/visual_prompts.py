from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.assets import SceneAssetRead


class VisualPromptCreate(BaseModel):
    scene_number: int = Field(gt=0)
    scene_description: str = Field(min_length=3)
    prompt_text: str = Field(min_length=3)


class VisualPromptUpdate(BaseModel):
    scene_number: int | None = Field(default=None, gt=0)
    scene_description: str | None = Field(default=None, min_length=3)
    prompt_text: str | None = Field(default=None, min_length=3)


class VisualPromptRead(VisualPromptCreate):
    id: int
    script_id: int
    created_at: datetime
    assets: list[SceneAssetRead] = []

    model_config = ConfigDict(from_attributes=True)
