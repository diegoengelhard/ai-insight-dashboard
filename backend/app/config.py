from pydantic_settings import BaseSettings
from pathlib import Path
import tempfile
from typing import Optional

class Settings(BaseSettings):
    # App configuration
    APP_NAME: str = "Dashboard AI API"
    
    # Storage configuration
    TEMP_STORAGE_PATH: Path = Path(tempfile.gettempdir()) / "dashboard_ai_uploads"
    MAX_FILE_SIZE_BYTES: int = 20 * 1024 * 1024  # 20 MB

    # --- NEW: OpenAI API Configuration ---
    OPENAI_API_KEY: Optional[str] = None

    # Frontend (Prod) CORS origin
    PROD_FRONTEND_URL: Optional[str] = None

    class Config:
        # This tells pydantic-settings to load variables from a .env file.
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = "ignore"

# Singleton instance of the settings
settings = Settings()