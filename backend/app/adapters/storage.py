import shutil
import logging
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FileStorageAdapter:
    """
    Handles all direct interactions with the file system for storing and
    retrieving dataset files and their metadata.
    """
    def __init__(self, base_path: Path, max_file_size_bytes: int):
        self.base_path = base_path
        self.max_file_size_bytes = max_file_size_bytes
        self.base_path.mkdir(parents=True, exist_ok=True)
        logger.info(f"Storage initialized at: {self.base_path.resolve()}")

    def save_dataset_file(self, dataset_id: str, file: UploadFile) -> Path:
        """Saves an uploaded file to a dedicated directory, validating its size."""
        dataset_path = self.base_path / dataset_id
        dataset_path.mkdir(exist_ok=True)
        file_extension = Path(file.filename).suffix
        file_location = dataset_path / f"data{file_extension}"
        total_bytes_written = 0
        try:
            with open(file_location, "wb") as f:
                while chunk := file.file.read(8192): # Read in chunks
                    total_bytes_written += len(chunk)
                    if total_bytes_written > self.max_file_size_bytes:
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail=f"File size exceeds the limit of {self.max_file_size_bytes / 1024 / 1024:.2f} MB"
                        )
                    f.write(chunk)
            logger.info(f"Successfully saved file for dataset '{dataset_id}' at {file_location}")
            return file_location
        except Exception as e:
            logger.error(f"Failed to save file for dataset '{dataset_id}'. Cleaning up. Error: {e}")
            if dataset_path.exists():
                shutil.rmtree(dataset_path) # Clean up partial uploads
            raise e

    def save_manifest(self, dataset_id: str, manifest_data: dict):
        """Saves a JSON manifest file with dataset metadata."""
        dataset_path = self.base_path / dataset_id
        manifest_location = dataset_path / "manifest.json"
        try:
            with open(manifest_location, "w") as f:
                json.dump(manifest_data, f, indent=4)
            logger.info(f"Manifest saved for dataset '{dataset_id}'")
        except Exception as e:
            logger.error(f"Failed to save manifest for dataset '{dataset_id}'. Error: {e}")
            if dataset_path.exists():
                shutil.rmtree(dataset_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not save dataset metadata."
            )

    # --- MÉTODO AÑADIDO ---
    def get_dataset_filepath(self, dataset_id: str) -> Path:
        """
        Reads the manifest for a given dataset to find the path of its data file.
        """
        manifest_path = self.base_path / dataset_id / "manifest.json"
        if not manifest_path.exists():
            raise FileNotFoundError(f"Manifest for dataset '{dataset_id}' not found.")

        with open(manifest_path, "r") as f:
            manifest = json.load(f)

        file_path_str = manifest.get("storagePath")
        if not file_path_str:
            raise FileNotFoundError(f"storagePath not found in manifest for dataset '{dataset_id}'.")

        file_path = Path(file_path_str)
        if not file_path.exists():
             raise FileNotFoundError(f"Data file for dataset '{dataset_id}' not found at path: {file_path}")

        return file_path


# --- Singleton Instance Initialization ---
from ..config import settings

storage_adapter = FileStorageAdapter(
    base_path=settings.TEMP_STORAGE_PATH,
    max_file_size_bytes=settings.MAX_FILE_SIZE_BYTES
)
