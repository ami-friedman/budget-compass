"""Database initialization helpers."""

from sqlalchemy import text
from sqlalchemy.engine import make_url
from sqlmodel import SQLModel, create_engine

from app.db.session import get_engine


def init_db() -> None:
    """Ensure database exists and create all tables."""
    engine = get_engine()
    with engine.connect() as connection:
            connection.execute(
                text(
                    "CREATE DATABASE IF NOT EXISTS"
                    f" `{engine.url.database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                )
            )
            connection.commit()
        

    SQLModel.metadata.create_all(engine)
