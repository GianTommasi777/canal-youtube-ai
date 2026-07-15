"""Add assets associated with visual prompt scenes.

Revision ID: 0002_scene_assets
Revises: 0001_initial
"""

from typing import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002_scene_assets"
down_revision: str | None = "0001_initial"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    if "scene_assets" in set(sa.inspect(op.get_bind()).get_table_names()):
        return
    op.create_table(
        "scene_assets",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "visual_prompt_id",
            sa.Integer(),
            sa.ForeignKey("visual_prompts.id"),
            nullable=False,
        ),
        sa.Column("name", sa.String(240), nullable=False),
        sa.Column("asset_type", sa.String(40), nullable=False),
        sa.Column("file_path", sa.String(500), nullable=False),
        sa.Column("source", sa.String(120), nullable=True),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_scene_assets_visual_prompt_id", "scene_assets", ["visual_prompt_id"])
    op.create_index("ix_scene_assets_asset_type", "scene_assets", ["asset_type"])
    op.create_index("ix_scene_assets_status", "scene_assets", ["status"])


def downgrade() -> None:
    if "scene_assets" in set(sa.inspect(op.get_bind()).get_table_names()):
        op.drop_table("scene_assets")
