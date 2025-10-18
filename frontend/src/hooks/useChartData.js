import { useState, useCallback } from 'react';
import { getChartData as apiGetChartData } from '../lib/api/charts';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage fetching data for a single chart.
 */
export const useChartData = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Fetch chart data (memoized) to avoid effect loops.
   */
  const fetchChartData = useCallback(async (params) => {
    setStatus('loading');
    setChartData(null);
    setError(null);

    try {
      const response = await apiGetChartData(params);
      setChartData(response);
      setStatus('success');
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch chart data.';
      setError(errorMessage);
      setStatus('error');
      toast.error(`Chart Error: ${errorMessage}`);
    }
  }, []);

  return { status, chartData, error, fetchChartData };
};
