from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.models import Idea, Video, VideoMetric
from app.schemas.metrics import VideoMetricCreate, VideoMetricRead
from app.schemas.videos import VideoCreate, VideoRead, VideoUpdate

router = APIRouter()


@router.post("", response_model=VideoRead, status_code=status.HTTP_201_CREATED)
def create_video(payload: VideoCreate, db: Session = Depends(get_db)):
    if db.get(Idea, payload.idea_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Idea not found")
    values = payload.model_dump()
    values["status"] = payload.status.value
    video = Video(**values)
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


@router.get("", response_model=list[VideoRead])
def list_videos(db: Session = Depends(get_db)):
    query = select(Video).options(selectinload(Video.metrics)).order_by(Video.created_at.desc())
    return list(db.scalars(query).all())


@router.patch("/{video_id}", response_model=VideoRead)
def update_video(
    video_id: int, payload: VideoUpdate, db: Session = Depends(get_db)
):
    video = db.get(Video, video_id)
    if video is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
    values = payload.model_dump(exclude_unset=True)
    if payload.status is not None:
        values["status"] = payload.status.value
    for field, value in values.items():
        setattr(video, field, value)
    db.commit()
    db.refresh(video)
    return video


@router.post(
    "/{video_id}/metrics",
    response_model=VideoMetricRead,
    status_code=status.HTTP_201_CREATED,
)
def create_metric(
    video_id: int, payload: VideoMetricCreate, db: Session = Depends(get_db)
):
    if db.get(Video, video_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
    values = payload.model_dump()
    values["checked_at"] = values["checked_at"] or datetime.now(timezone.utc)
    metric = VideoMetric(video_id=video_id, **values)
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return metric
