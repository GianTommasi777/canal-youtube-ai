from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import WorkflowStatus
from app.schemas.scripts import ScriptRead


class IdeaCreate(BaseModel):
    title: str = Field(min_length=3, max_length=240)
    concept: str = Field(min_length=3)
    niche: str = Field(min_length=2, max_length=120)
    hook: str | None = None
    status: WorkflowStatus = WorkflowStatus.backlog


class IdeaStatusUpdate(BaseModel):
    status: WorkflowStatus


class IdeaUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=240)
    concept: str | None = Field(default=None, min_length=3)
    niche: str | None = Field(default=None, min_length=2, max_length=120)
    hook: str | None = None
    status: WorkflowStatus | None = None


class IdeaRead(IdeaCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IdeaDetail(IdeaRead):
    script: ScriptRead | None = None
