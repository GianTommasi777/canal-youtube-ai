from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Idea, Video, VideoMetric
from app.schemas.dashboard import DashboardSummary


def get_dashboard_summary(db: Session) -> DashboardSummary:
    inactive_statuses = ("published", "analyzed", "discarded")
    latest_metric_ids = (
        select(func.max(VideoMetric.id).label("id"))
        .group_by(VideoMetric.video_id)
        .subquery()
    )
    total_views = db.scalar(
        select(func.coalesce(func.sum(VideoMetric.views), 0)).where(
            VideoMetric.id.in_(select(latest_metric_ids.c.id))
        )
    )

    return DashboardSummary(
        total_ideas=db.scalar(select(func.count(Idea.id))) or 0,
        active_ideas=db.scalar(
            select(func.count(Idea.id)).where(Idea.status.not_in(inactive_statuses))
        )
        or 0,
        produced_videos=db.scalar(select(func.count(Video.id))) or 0,
        published_videos=db.scalar(
            select(func.count(Video.id)).where(Video.status == "published")
        )
        or 0,
        total_views=total_views or 0,
    )
