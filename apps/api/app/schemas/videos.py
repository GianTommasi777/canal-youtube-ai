from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import WorkflowStatus
from app.schemas.metrics import VideoMetricRead


class VideoCreate(BaseModel):
    idea_id: int
    title: str = Field(min_length=3, max_length=240)
    youtube_url: str | None = None
    local_file_path: str | None = None
    status: WorkflowStatus = WorkflowStatus.editing
    publish_date: date | None = None


class VideoUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=240)
    youtube_url: str | None = None
    local_file_path: str | None = None
    status: WorkflowStatus | None = None
    publish_date: date | None = None


class VideoRead(VideoCreate):
    id: int
    created_at: datetime
    metrics: list[VideoMetricRead] = []

    model_config = ConfigDict(from_attributes=True)
