from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Script, VisualPrompt
from app.schemas.scripts import ScriptRead, ScriptUpdate
from app.schemas.visual_prompts import (
    VisualPromptCreate,
    VisualPromptRead,
    VisualPromptUpdate,
)

router = APIRouter()


@router.patch("/{script_id}", response_model=ScriptRead)
def update_script(
    script_id: int, payload: ScriptUpdate, db: Session = Depends(get_db)
):
    script = db.get(Script, script_id)
    if script is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Script not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(script, field, value)
    db.commit()
    db.refresh(script)
    return script


@router.post(
    "/{script_id}/visual-prompts",
    response_model=VisualPromptRead,
    status_code=status.HTTP_201_CREATED,
)
def create_visual_prompt(
    script_id: int, payload: VisualPromptCreate, db: Session = Depends(get_db)
):
    script = db.get(Script, script_id)
    if script is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Script not found")

    visual_prompt = VisualPrompt(script_id=script_id, **payload.model_dump())
    db.add(visual_prompt)
    db.commit()
    db.refresh(visual_prompt)
    return visual_prompt


@router.patch("/visual-prompts/{prompt_id}", response_model=VisualPromptRead)
def update_visual_prompt(
    prompt_id: int, payload: VisualPromptUpdate, db: Session = Depends(get_db)
):
    visual_prompt = db.get(VisualPrompt, prompt_id)
    if visual_prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visual prompt not found"
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(visual_prompt, field, value)
    db.commit()
    db.refresh(visual_prompt)
    return visual_prompt


@router.delete("/visual-prompts/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_visual_prompt(prompt_id: int, db: Session = Depends(get_db)):
    visual_prompt = db.get(VisualPrompt, prompt_id)
    if visual_prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visual prompt not found"
        )
    db.delete(visual_prompt)
    db.commit()
