from pydantic import Field
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    BASE_URL: str = Field(..., env="BASE_URL")
    LOG_API: Optional[str] = Field(default=None, env="LOG_API")
    LOG_PROJECT_ID: Optional[str] = Field(default=None, env="LOG_PROJECT_ID")
    REDIS_URL: str = Field(..., env="REDIS_URL")
    SENTRY_DSN: Optional[str] = Field(default=None, env="SENTRY_DSN")
    MONGO_URI: str = Field(..., env="MONGO_URI")
    MONGO_DB: str = Field("intel", env="MONGO_DB")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()