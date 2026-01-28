"""Application configuration loaded from environment variables."""

from functools import lru_cache

from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


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
    return Settings()
