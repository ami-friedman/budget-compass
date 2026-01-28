"""FastAPI application entrypoint."""

import logging

from fastapi import FastAPI

from app.api.router import api_router
from app.db.init_db import init_db
from app.core.config import Settings, get_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or get_settings()

    logging.basicConfig(level=logging.INFO)

    app = FastAPI(
        title=resolved_settings.service_name,
        version=resolved_settings.version,
    )
    app.include_router(api_router)

    @app.on_event("startup")
    def on_startup() -> None:
        init_db()

    return app


app = create_app()
