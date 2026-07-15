from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VideoMetricCreate(BaseModel):
    views: int = Field(default=0, ge=0)
    likes: int = Field(default=0, ge=0)
    comments: int = Field(default=0, ge=0)
    subscribers_gained: int = Field(default=0, ge=0)
    average_view_duration: int | None = Field(default=None, ge=0)
    retention_percentage: float | None = Field(default=None, ge=0, le=100)
    checked_at: datetime | None = None


class VideoMetricRead(VideoMetricCreate):
    id: int
    video_id: int
    checked_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MetricListItem(VideoMetricRead):
    video_title: str
