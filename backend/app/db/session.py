"""Database engine and session management."""

import logging
from collections.abc import Generator

from sqlalchemy.engine import Engine
from sqlmodel import Session, create_engine
from urllib.parse import quote_plus

from app.core.config import Settings, get_settings

logger = logging.getLogger(__name__)


def build_engine(settings: Settings) -> Engine:
    """Build the SQLModel engine from settings."""
    logger.info(
        "DB connection details: user=%s url=%s",
        settings.db_user,
        settings.database_url.replace(quote_plus(settings.db_password), "***")
        if settings.db_password
        else settings.database_url,
    )
    return create_engine(settings.database_url, pool_pre_ping=True)


def get_engine() -> Engine:
    """Return a configured SQLModel engine."""
    settings = get_settings()
    return build_engine(settings)


def get_session() -> Generator[Session, None, None]:
    """Provide a database session for request scope."""
    engine = get_engine()
    with Session(engine) as session:
        yield session
