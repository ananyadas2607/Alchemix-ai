from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "Modern Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # Database
    DATABASE_URL: str
    
    # CORS - Allow both development and production URLs
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://alchemix-ai.vercel.app"
    ]
    
    OPENAI_API_KEY: str
    ANTHROPIC_API_KEY: str
    
    class Config:
        env_file = ".env"
        extra = "allow"

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()
