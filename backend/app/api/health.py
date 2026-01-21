"""Health endpoint."""

from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings

health_router = APIRouter()


@health_router.get("/health")
def health(settings: Settings = Depends(get_settings)) -> dict[str, str]:
    return {
        "status": "ok",
        "service": settings.service_name,
        "version": settings.version,
    }

