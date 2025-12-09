from pydantic import Field
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    BASE_URL: str = Field(..., env="BASE_URL")
    LOG_API: Optional[str] = Field(default=None, env="LOG_API")
    LOG_PROJECT_ID: Optional[str] = Field(default=None, env="LOG_PROJECT_ID")
    SENTRY_DSN: Optional[str] = Field(default=None, env="SENTRY_DSN")
    MONGO_URI: str = Field(..., env="MONGO_URI")
    MONGO_DB: str = Field("intel", env="MONGO_DB")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60 * 24 * 8, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    JWT_SECRET: str = Field(..., env="JWT_SECRET")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()