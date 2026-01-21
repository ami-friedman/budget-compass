"""Application configuration loaded from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    service_name: str = "budget-compass"
    version: str = "v0"
    environment: str = "local"

    model_config = SettingsConfigDict(env_prefix="BC_")


@lru_cache
def get_settings() -> Settings:
    return Settings()

