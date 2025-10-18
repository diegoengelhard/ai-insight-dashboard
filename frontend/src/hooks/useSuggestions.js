import { useState, useCallback, useRef } from 'react';
import { getSuggestions as apiGetSuggestions } from '../lib/api/analysis';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage fetching AI-generated suggestions.
 */
export const useSuggestions = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  // Avoid duplicate toasts/requests if same datasetId is requested consecutively.
  const lastIdRef = useRef(null);

  /**
   * Fetch suggestions for a datasetId (memoized).
   */
  const fetchSuggestions = useCallback(async (datasetId) => {
    if (!datasetId) return;
    if (lastIdRef.current === datasetId && status === 'success') return;
    lastIdRef.current = datasetId;

    setStatus('loading');
    setSuggestions([]);
    setError(null);
    toast.loading('Generando sugerencias con IA...');

    try {
      const response = await apiGetSuggestions(datasetId);
      setSuggestions(response);
      setStatus('success');
      toast.dismiss();
      toast.success('¡Sugerencias listas!');
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch suggestions.';
      setError(errorMessage);
      setStatus('error');
      toast.dismiss();
      toast.error(`Error: ${errorMessage}`);
    }
  }, [status]);

  return { status, suggestions, error, fetchSuggestions };
};