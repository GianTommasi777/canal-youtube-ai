from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Script
from app.schemas.ideas import (
    IdeaCreate,
    IdeaDetail,
    IdeaRead,
    IdeaStatusUpdate,
    IdeaUpdate,
)
from app.schemas.scripts import ScriptCreate, ScriptRead
from app.services.ideas import create_idea, get_idea_or_404, list_ideas

router = APIRouter()


@router.post("", response_model=IdeaRead, status_code=status.HTTP_201_CREATED)
def create(payload: IdeaCreate, db: Session = Depends(get_db)):
    return create_idea(db, payload)


@router.get("", response_model=list[IdeaRead])
def list_all(db: Session = Depends(get_db)):
    return list_ideas(db)


@router.get("/{idea_id}", response_model=IdeaDetail)
def detail(idea_id: int, db: Session = Depends(get_db)):
    return get_idea_or_404(db, idea_id, include_script=True)


@router.patch("/{idea_id}/status", response_model=IdeaRead)
def update_status(idea_id: int, payload: IdeaStatusUpdate, db: Session = Depends(get_db)):
    idea = get_idea_or_404(db, idea_id)
    idea.status = payload.status.value
    db.commit()
    db.refresh(idea)
    return idea


@router.patch("/{idea_id}", response_model=IdeaRead)
def update(idea_id: int, payload: IdeaUpdate, db: Session = Depends(get_db)):
    idea = get_idea_or_404(db, idea_id)
    for field, value in payload.model_dump(exclude_unset=True, mode="json").items():
        setattr(idea, field, value)
    db.commit()
    db.refresh(idea)
    return idea


@router.post(
    "/{idea_id}/scripts", response_model=ScriptRead, status_code=status.HTTP_201_CREATED
)
def create_script(idea_id: int, payload: ScriptCreate, db: Session = Depends(get_db)):
    idea = get_idea_or_404(db, idea_id, include_script=True)
    if idea.script:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This idea already has a script",
        )
    script = Script(idea_id=idea_id, **payload.model_dump())
    idea.status = "scripting"
    db.add(script)
    db.commit()
    db.refresh(script)
    return script
