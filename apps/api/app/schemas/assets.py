from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class AssetType(str, Enum):
    image = "image"
    video = "video"
    audio = "audio"
    other = "other"


class AssetStatus(str, Enum):
    planned = "planned"
    ready = "ready"
    approved = "approved"
    rejected = "rejected"


class SceneAssetCreate(BaseModel):
    name: str = Field(min_length=2, max_length=240)
    asset_type: AssetType
    file_path: str = Field(min_length=3, max_length=500)
    source: str | None = Field(default=None, max_length=120)
    status: AssetStatus = AssetStatus.planned
    notes: str | None = None


class SceneAssetUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=240)
    asset_type: AssetType | None = None
    file_path: str | None = Field(default=None, min_length=3, max_length=500)
    source: str | None = Field(default=None, max_length=120)
    status: AssetStatus | None = None
    notes: str | None = None


class SceneAssetRead(SceneAssetCreate):
    id: int
    visual_prompt_id: int
    mime_type: str | None = None
    file_size_bytes: int | None = None
    original_filename: str | None = None
    media_url: str | None = None
    is_uploaded: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
