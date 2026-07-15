from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Video, VideoMetric
from app.schemas.metrics import MetricListItem

router = APIRouter()


@router.get("", response_model=list[MetricListItem])
def list_metrics(db: Session = Depends(get_db)):
    rows = db.execute(
        select(VideoMetric, Video.title)
        .join(Video)
        .order_by(VideoMetric.checked_at.desc())
    ).all()
    return [
        MetricListItem.model_validate(
            {**metric.__dict__, "video_title": video_title}
        )
        for metric, video_title in rows
    ]
