from fastapi import APIRouter

from app.api.routes import assets, dashboard, ideas, metrics, scripts, videos

api_router = APIRouter()
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(ideas.router, prefix="/ideas", tags=["ideas"])
api_router.include_router(scripts.router, prefix="/scripts", tags=["scripts"])
api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(assets.router, tags=["assets"])
