"""Create the initial editorial schema.

Revision ID: 0001_initial
Revises:
"""

from typing import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    existing = set(sa.inspect(op.get_bind()).get_table_names())

    if "ideas" not in existing:
        op.create_table(
            "ideas",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("title", sa.String(240), nullable=False),
            sa.Column("concept", sa.Text(), nullable=False),
            sa.Column("niche", sa.String(120), nullable=False),
            sa.Column("status", sa.String(40), nullable=False),
            sa.Column("hook", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        )
        op.create_index("ix_ideas_title", "ideas", ["title"])
        op.create_index("ix_ideas_niche", "ideas", ["niche"])
        op.create_index("ix_ideas_status", "ideas", ["status"])

    if "scripts" not in existing:
        op.create_table(
            "scripts",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("idea_id", sa.Integer(), sa.ForeignKey("ideas.id"), nullable=False),
            sa.Column("full_script", sa.Text(), nullable=False),
            sa.Column("duration_target_seconds", sa.Integer(), nullable=False),
            sa.Column("final_question", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        )
        op.create_index("ix_scripts_idea_id", "scripts", ["idea_id"], unique=True)

    if "visual_prompts" not in existing:
        op.create_table(
            "visual_prompts",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("script_id", sa.Integer(), sa.ForeignKey("scripts.id"), nullable=False),
            sa.Column("scene_number", sa.Integer(), nullable=False),
            sa.Column("scene_description", sa.Text(), nullable=False),
            sa.Column("prompt_text", sa.Text(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        )
        op.create_index("ix_visual_prompts_script_id", "visual_prompts", ["script_id"])

    if "videos" not in existing:
        op.create_table(
            "videos",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("idea_id", sa.Integer(), sa.ForeignKey("ideas.id"), nullable=False),
            sa.Column("title", sa.String(240), nullable=False),
            sa.Column("youtube_url", sa.String(500), nullable=True),
            sa.Column("local_file_path", sa.String(500), nullable=True),
            sa.Column("status", sa.String(40), nullable=False),
            sa.Column("publish_date", sa.Date(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        )
        op.create_index("ix_videos_idea_id", "videos", ["idea_id"])
        op.create_index("ix_videos_status", "videos", ["status"])

    if "video_metrics" not in existing:
        op.create_table(
            "video_metrics",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("video_id", sa.Integer(), sa.ForeignKey("videos.id"), nullable=False),
            sa.Column("views", sa.Integer(), nullable=False),
            sa.Column("likes", sa.Integer(), nullable=False),
            sa.Column("comments", sa.Integer(), nullable=False),
            sa.Column("subscribers_gained", sa.Integer(), nullable=False),
            sa.Column("average_view_duration", sa.Integer(), nullable=True),
            sa.Column("retention_percentage", sa.Float(), nullable=True),
            sa.Column("checked_at", sa.DateTime(timezone=True), nullable=False),
        )
        op.create_index("ix_video_metrics_video_id", "video_metrics", ["video_id"])


def downgrade() -> None:
    for table in ["video_metrics", "videos", "visual_prompts", "scripts", "ideas"]:
        if table in set(sa.inspect(op.get_bind()).get_table_names()):
            op.drop_table(table)
