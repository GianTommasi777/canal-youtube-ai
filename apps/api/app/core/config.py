from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def default_database_url() -> str:
    database_path = (repository_root() / "data" / "canal_youtube_ai.db").as_posix()
    return f"sqlite:///{database_path}"


def repository_root() -> Path:
    config_path = Path(__file__).resolve()
    return config_path.parents[4] if len(config_path.parents) > 4 else Path.cwd()


class Settings(BaseSettings):
    app_name: str = "Canal YouTube AI API"
    app_env: str = "development"
    app_debug: bool = True
    database_url: str = ""
    cors_origins: str = "http://localhost:3000"
    seed_demo_data: bool = True
    assets_directory: str = ""
    max_asset_size_mb: int = 100

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def resolved_database_url(self) -> str:
        return self.database_url or default_database_url()

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def resolved_assets_directory(self) -> Path:
        if self.assets_directory:
            return Path(self.assets_directory).resolve()
        return (repository_root() / "content" / "assets").resolve()

    @property
    def max_asset_size_bytes(self) -> int:
        return self.max_asset_size_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
