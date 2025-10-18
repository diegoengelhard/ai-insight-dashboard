import { useEffect, useCallback, useRef } from 'react';
import { useUploadDataset } from '../../hooks/useUploadDataset';
import DropZone from '../../components/molecules/DropZone';

/**
 * The first main section of the application for uploading datasets.
 * @param {{
 * onUploadSuccess: (datasetId: string) => void
 * }} props
 */
const DragAndDropSection = ({ onUploadSuccess }) => {
  // Use the custom hook to handle the upload logic and state.
  const { upload, status, data } = useUploadDataset();
  const lastHandledIdRef = useRef(null);

  // Handle the file when it's accepted by the DropZone.
  const handleFileAccepted = useCallback((file) => {
    if (file) upload(file);
  }, [upload]);

  // Effect to call onUploadSuccess once per datasetId (prevents re-run loops).
  useEffect(() => {
    if (status === 'success' && data?.datasetId && lastHandledIdRef.current !== data.datasetId) {
      lastHandledIdRef.current = data.datasetId;
      onUploadSuccess(data.datasetId);
    }
  }, [status, data, onUploadSuccess]);

  return (
    <section aria-labelledby="upload-heading">
      <h2 id="upload-heading" className="sr-only">
        File Upload
      </h2>
      <DropZone
        onFileAccepted={handleFileAccepted}
        isLoading={status === 'loading'}
      />
    </section>
  );
};

export default DragAndDropSection;