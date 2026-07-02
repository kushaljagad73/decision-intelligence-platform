from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "Decision Intelligence Platform"
    app_version: str = "1.0.0"
    debug: bool = True

    database_url: str = "sqlite+aiosqlite:///./decision_intel.db"
    redis_url: str = "redis://localhost:6379/0"

    google_project_id: Optional[str] = None
    google_location: str = "us-central1"
    gemini_model: str = "gemini-2.0-flash-001"
    embedding_model: str = "text-embedding-004"

    vector_store_path: str = "./chroma_db"
    max_context_length: int = 8192
    temperature: float = 0.2

    secret_key: str = "dev-secret-key-change-in-production"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
