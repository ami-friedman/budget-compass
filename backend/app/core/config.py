"""Application configuration loaded from environment variables."""

from functools import lru_cache
import logging
import os
from pathlib import Path

from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    service_name: str = "budget-compass"
    version: str = "v0"
    environment: str = "local"
    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "budget_compass"
    db_user: str = "root"
    db_password: str = ""

    model_config = SettingsConfigDict(env_prefix="BC_", env_file=".env")

    @property
    def database_url(self) -> str:
        password = quote_plus(self.db_password)
        return (
            "mysql+pymysql://"
            f"{self.db_user}:{password}@{self.db_host}:{self.db_port}/{self.db_name}"
        )


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    env_file = Settings.model_config.get("env_file", ".env")
    env_path = Path(env_file)
    logger.info(
        "Settings load: cwd=%s env_file=%s exists=%s",
        os.getcwd(),
        env_path,
        env_path.exists()
    )
    return settings
