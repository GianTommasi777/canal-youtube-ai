from datetime import date, datetime, timezone
from urllib.parse import quote

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Idea(Base):
    __tablename__ = "ideas"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(240), index=True)
    concept: Mapped[str] = mapped_column(Text)
    niche: Mapped[str] = mapped_column(String(120), index=True)
    status: Mapped[str] = mapped_column(String(40), default="backlog", index=True)
    hook: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )

    script: Mapped["Script | None"] = relationship(
        back_populates="idea", cascade="all, delete-orphan", uselist=False
    )
    videos: Mapped[list["Video"]] = relationship(back_populates="idea")


class Script(Base):
    __tablename__ = "scripts"

    id: Mapped[int] = mapped_column(primary_key=True)
    idea_id: Mapped[int] = mapped_column(ForeignKey("ideas.id"), unique=True, index=True)
    full_script: Mapped[str] = mapped_column(Text)
    duration_target_seconds: Mapped[int] = mapped_column(Integer)
    final_question: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    idea: Mapped["Idea"] = relationship(back_populates="script")
    visual_prompts: Mapped[list["VisualPrompt"]] = relationship(
        back_populates="script",
        cascade="all, delete-orphan",
        order_by="VisualPrompt.scene_number",
    )


class VisualPrompt(Base):
    __tablename__ = "visual_prompts"

    id: Mapped[int] = mapped_column(primary_key=True)
    script_id: Mapped[int] = mapped_column(ForeignKey("scripts.id"), index=True)
    scene_number: Mapped[int] = mapped_column(Integer)
    scene_description: Mapped[str] = mapped_column(Text)
    prompt_text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    script: Mapped["Script"] = relationship(back_populates="visual_prompts")
    assets: Mapped[list["SceneAsset"]] = relationship(
        back_populates="visual_prompt",
        cascade="all, delete-orphan",
        order_by="SceneAsset.created_at",
    )


class SceneAsset(Base):
    __tablename__ = "scene_assets"

    id: Mapped[int] = mapped_column(primary_key=True)
    visual_prompt_id: Mapped[int] = mapped_column(
        ForeignKey("visual_prompts.id"), index=True
    )
    name: Mapped[str] = mapped_column(String(240))
    asset_type: Mapped[str] = mapped_column(String(40), index=True)
    file_path: Mapped[str] = mapped_column(String(500))
    source: Mapped[str | None] = mapped_column(String(120), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="planned", index=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    mime_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    file_size_bytes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    visual_prompt: Mapped["VisualPrompt"] = relationship(back_populates="assets")

    @property
    def media_url(self) -> str | None:
        normalized_path = self.file_path.replace("\\", "/")
        prefix = "content/assets/"
        if not normalized_path.startswith(prefix):
            return None
        return f"/media/assets/{quote(normalized_path.removeprefix(prefix))}"

    @property
    def is_uploaded(self) -> bool:
        return self.mime_type is not None


class Video(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(primary_key=True)
    idea_id: Mapped[int] = mapped_column(ForeignKey("ideas.id"), index=True)
    title: Mapped[str] = mapped_column(String(240))
    youtube_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    local_file_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="editing", index=True)
    publish_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    idea: Mapped["Idea"] = relationship(back_populates="videos")
    metrics: Mapped[list["VideoMetric"]] = relationship(
        back_populates="video",
        cascade="all, delete-orphan",
        order_by="VideoMetric.checked_at.desc()",
    )


class VideoMetric(Base):
    __tablename__ = "video_metrics"

    id: Mapped[int] = mapped_column(primary_key=True)
    video_id: Mapped[int] = mapped_column(ForeignKey("videos.id"), index=True)
    views: Mapped[int] = mapped_column(Integer, default=0)
    likes: Mapped[int] = mapped_column(Integer, default=0)
    comments: Mapped[int] = mapped_column(Integer, default=0)
    subscribers_gained: Mapped[int] = mapped_column(Integer, default=0)
    average_view_duration: Mapped[int | None] = mapped_column(Integer, nullable=True)
    retention_percentage: Mapped[float | None] = mapped_column(Float, nullable=True)
    checked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    video: Mapped["Video"] = relationship(back_populates="metrics")
