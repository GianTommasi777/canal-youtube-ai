from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Idea, Script, VisualPrompt
from app.schemas.ideas import IdeaCreate


def list_ideas(db: Session) -> list[Idea]:
    return list(db.scalars(select(Idea).order_by(Idea.updated_at.desc())).all())


def get_idea_or_404(db: Session, idea_id: int, include_script: bool = False) -> Idea:
    query = select(Idea).where(Idea.id == idea_id)
    if include_script:
        query = query.options(
            selectinload(Idea.script)
            .selectinload(Script.visual_prompts)
            .selectinload(VisualPrompt.assets)
        )
    idea = db.scalar(query)
    if idea is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Idea not found")
    return idea


def create_idea(db: Session, payload: IdeaCreate) -> Idea:
    idea = Idea(**payload.model_dump(mode="json"))
    db.add(idea)
    db.commit()
    db.refresh(idea)
    return idea
