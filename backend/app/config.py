from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # --- General Application Settings ---
    APP_NAME: str = "Dashboard AI API"
    DEBUG: bool = True

    # --- Temporary File Storage Settings ---
    # Defines the base directory for temporary file uploads.
    # Using pathlib.Path ensures cross-platform compatibility for file paths.
    # The '.resolve()' method provides the absolute path, which is safer for
    # file operations.
    TEMP_STORAGE_PATH: Path = Path("/tmp/dashboard_ai_uploads").resolve()

    # --- File Upload Limits ---
    # Sets the maximum allowed file size in bytes.
    # Example: 20 * 1024 * 1024 corresponds to 20 MB. This is a critical
    # security and performance measure to prevent excessively large uploads
    # from overwhelming the server.
    MAX_FILE_SIZE_BYTES: int = 20 * 1024 * 1024 # 20 MB

    class Config:
        """
        Pydantic configuration class.
        Specifies the name of the .env file to load settings from.
        """
        env_file = ".env"
        env_file_encoding = "utf-8"

# Create a single, importable instance of the settings.
# This instance will be used throughout the application to access configuration
# values, ensuring consistency.
settings = Settings()