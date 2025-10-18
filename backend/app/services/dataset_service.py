import hashlib
import uuid
from datetime import datetime, timezone
from fastapi import UploadFile, HTTPException, status
from pathlib import Path

# Make sure to import the storage_adapter correctly
from ..adapters.storage import storage_adapter

# Define the set of allowed file extensions for quick validation.
ALLOWED_EXTENSIONS = {".csv", ".xlsx"}


# THIS IS THE FUNCTION THE CONTROLLER IS LOOKING FOR
def process_new_dataset(file: UploadFile) -> dict:
    """
    Processes an uploaded file, validates it, saves it, and creates a manifest.
    """
    # --- 1. Validate File Extension ---
    file_extension = _get_validated_file_extension(file.filename)
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"File type '{file_extension}' is not supported. Please upload a CSV or XLSX file."
        )

    # --- 2. Generate Unique ID and Calculate Hash ---
    dataset_id = str(uuid.uuid4())
    # The file pointer needs to be reset after reading for the hash calculation,
    # so that the next read (for saving) starts from the beginning.
    file_content = file.file.read()
    file.file.seek(0)
    file_hash = hashlib.sha256(file_content).hexdigest()

    try:
        # --- 3. Save the Data File using the Storage Adapter ---
        saved_file_path = storage_adapter.save_dataset_file(dataset_id, file)

        # --- 4. Create and Save the Manifest ---
        manifest_data = {
            "datasetId": dataset_id,
            "originalFilename": file.filename,
            "fileExtension": file_extension,
            "storagePath": str(saved_file_path),
            "fileSizeBytes": saved_file_path.stat().st_size,
            "datasetHash_sha256": file_hash,
            "status": "uploaded",
            "uploadedAt_utc": datetime.now(timezone.utc).isoformat(),
            "profilingResults": None,
            "suggestionResults": None,
        }
        storage_adapter.save_manifest(dataset_id, manifest_data)

        # --- 5. Return Success Response Data ---
        return {
            "datasetId": dataset_id,
            "filename": file.filename
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while processing the file: {str(e)}"
        )


def _get_validated_file_extension(filename: str) -> str:
    """A helper function to safely extract a lowercase file extension."""
    if not filename:
        return ""
    # Using Path(filename).suffix is safer than splitting by '.'
    return Path(filename).suffix.lower()