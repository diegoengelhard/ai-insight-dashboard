import { useState } from 'react';
import { getSuggestions as apiGetSuggestions } from '../lib/api/analysis';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage fetching AI-generated suggestions.
 */
export const useSuggestions = () => {
  // State for API call status.
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  // State to store the list of suggestions.
  const [suggestions, setSuggestions] = useState([]);
  // State for error message.
  const [error, setError] = useState(null);

  /**
   * Function to trigger fetching suggestions.
   * @param {string} datasetId - The ID of the dataset to analyze.
   */
  const fetchSuggestions = async (datasetId) => {
    // Prevent fetching if no ID is provided.
    if (!datasetId) return;

    // Reset states and show loading indicator.
    setStatus('loading');
    setSuggestions([]);
    setError(null);
    toast.loading('Generating AI suggestions...');

    try {
      // Call the API function.
      const response = await apiGetSuggestions(datasetId);
      // Update state on success.
      setSuggestions(response);
      setStatus('success');
      toast.dismiss();
      toast.success('Suggestions generated!');
    } catch (err) {
      // Update state on error.
      const errorMessage = err.message || 'Failed to fetch suggestions.';
      setError(errorMessage);
      setStatus('error');
      toast.dismiss();
      toast.error(`Error: ${errorMessage}`);
    }
  };

  // Expose state and the fetch function.
  return { status, suggestions, error, fetchSuggestions };
};
