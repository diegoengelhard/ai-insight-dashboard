import { useState } from 'react';
import { uploadDataset as apiUploadDataset } from '../lib/api/datasets';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage the dataset upload process.
 * It handles the state for loading, success (data), and errors.
 */
export const useUploadDataset = () => {
  // State to track the status of the API call.
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  // State to store the response data on success.
  const [data, setData] = useState(null);
  // State to store the error message on failure.
  const [error, setError] = useState(null);

  /**
   * Function to trigger the file upload.
   * @param {File} file - The file to upload.
   */
  const upload = async (file) => {
    // Reset states and set status to loading.
    setStatus('loading');
    setData(null);
    setError(null);
    toast.loading('Uploading file...');

    try {
      // Call the API function.
      const response = await apiUploadDataset(file);
      // Update state on success.
      setData(response);
      setStatus('success');
      toast.dismiss();
      toast.success(`File "${response.filename}" uploaded successfully!`);
    } catch (err) {
      // Update state on error.
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(errorMessage);
      setStatus('error');
      toast.dismiss();
      toast.error(`Upload failed: ${errorMessage}`);
    }
  };

  // Expose the state and the upload function to the component.
  return { status, data, error, upload };
};
