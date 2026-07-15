"""Add metadata for physically uploaded scene assets.

Revision ID: 0003_uploaded_asset_metadata
Revises: 0002_scene_assets
"""

from typing import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0003_uploaded_asset_metadata"
down_revision: str | None = "0002_scene_assets"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    columns = {
        column["name"]
        for column in sa.inspect(op.get_bind()).get_columns("scene_assets")
    }
    with op.batch_alter_table("scene_assets") as batch_op:
        if "mime_type" not in columns:
            batch_op.add_column(sa.Column("mime_type", sa.String(120), nullable=True))
        if "file_size_bytes" not in columns:
            batch_op.add_column(sa.Column("file_size_bytes", sa.Integer(), nullable=True))
        if "original_filename" not in columns:
            batch_op.add_column(
                sa.Column("original_filename", sa.String(255), nullable=True)
            )


def downgrade() -> None:
    columns = {
        column["name"]
        for column in sa.inspect(op.get_bind()).get_columns("scene_assets")
    }
    with op.batch_alter_table("scene_assets") as batch_op:
        for column in ["original_filename", "file_size_bytes", "mime_type"]:
            if column in columns:
                batch_op.drop_column(column)
