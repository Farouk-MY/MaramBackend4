from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI MongoDB Auth"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "fastapi_mongo"

    # Email settings
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    MAIL_FROM_NAME: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    TEMPLATE_FOLDER: str = "app/templates"

    class Config:
        env_file = ".env"
        case_sensitive = True
        populate_by_name = True  # Updated for Pydantic v2

settings = Settings()
