from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.visual_prompts import VisualPromptRead


class ScriptCreate(BaseModel):
    full_script: str = Field(min_length=20)
    duration_target_seconds: int = Field(gt=0, le=7200)
    final_question: str | None = None


class ScriptUpdate(BaseModel):
    full_script: str | None = Field(default=None, min_length=20)
    duration_target_seconds: int | None = Field(default=None, gt=0, le=7200)
    final_question: str | None = None


class ScriptRead(ScriptCreate):
    id: int
    idea_id: int
    created_at: datetime
    visual_prompts: list[VisualPromptRead] = []

    model_config = ConfigDict(from_attributes=True)
