from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.seed import seed_demo_data


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.app_env == "test":
        Base.metadata.create_all(bind=engine)
    if settings.seed_demo_data:
        with SessionLocal() as db:
            seed_demo_data(db)
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="API local para gestionar el flujo de producción de un canal de YouTube con IA.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
settings.resolved_assets_directory.mkdir(parents=True, exist_ok=True)
app.mount(
    "/media/assets",
    StaticFiles(directory=settings.resolved_assets_directory),
    name="scene-assets",
)
app.include_router(api_router, prefix="/api")


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "environment": settings.app_env}
