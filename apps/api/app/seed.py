from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Idea, Script, Video, VideoMetric, VisualPrompt


def seed_demo_data(db: Session) -> None:
    if db.scalar(select(Idea.id).limit(1)) is not None:
        return

    ideas = [
        Idea(
            title="La ciudad que duerme bajo el hielo",
            concept="Documental breve sobre una ciudad ficticia preservada bajo un glaciar.",
            niche="Historia especulativa",
            status="prompts_ready",
            hook="En 2147, el hielo devolvió una ciudad que nadie recordaba.",
        ),
        Idea(
            title="7 tecnologías que parecían magia",
            concept="Recorrido visual por inventos cotidianos anticipados por la ciencia ficción.",
            niche="Tecnología",
            status="selected",
            hook="Tu teléfono habría sido evidencia de brujería hace apenas dos siglos.",
        ),
        Idea(
            title="Por qué soñamos con Marte",
            concept="Ensayo sobre la fascinación cultural y científica por Marte.",
            niche="Espacio",
            status="backlog",
            hook="Antes de pisar Marte, llevamos siglos inventándolo.",
        ),
    ]
    db.add_all(ideas)
    db.flush()

    script = Script(
        idea_id=ideas[0].id,
        full_script=(
            "En 2147, un equipo de climatólogos detectó líneas imposibles bajo el hielo. "
            "No eran grietas: eran avenidas. La expedición reveló una ciudad completa, "
            "silenciosa y preservada, cuyo origen todavía divide a los investigadores."
        ),
        duration_target_seconds=180,
        final_question="¿Qué historia crees que quedó congelada allí?",
    )
    db.add(script)
    db.flush()
    db.add_all(
        [
            VisualPrompt(
                script_id=script.id,
                scene_number=1,
                scene_description="Plano aéreo del glaciar al amanecer.",
                prompt_text="Cinematic aerial glacier, blue hour, hidden geometric lines, 16:9",
            ),
            VisualPrompt(
                script_id=script.id,
                scene_number=2,
                scene_description="La expedición encuentra una avenida congelada.",
                prompt_text="Explorers above an ancient frozen avenue, volumetric light, cinematic",
            ),
        ]
    )

    video = Video(
        idea_id=ideas[0].id,
        title=ideas[0].title,
        youtube_url="https://youtube.com/watch?v=demo",
        local_file_path="content/renders/ciudad-bajo-el-hielo.mp4",
        status="published",
        publish_date=date.today(),
    )
    db.add(video)
    db.flush()
    db.add(
        VideoMetric(
            video_id=video.id,
            views=12480,
            likes=934,
            comments=87,
            subscribers_gained=146,
            average_view_duration=132,
            retention_percentage=73.4,
        )
    )
    db.commit()
