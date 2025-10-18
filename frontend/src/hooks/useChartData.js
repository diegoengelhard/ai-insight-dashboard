import { useState } from 'react';
import { getChartData as apiGetChartData } from '../lib/api/charts';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage fetching data for a single chart.
 */
export const useChartData = () => {
  // State for API call status.
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  // State to store the formatted chart data.
  const [chartData, setChartData] = useState(null);
  // State for error message.
  const [error, setError] = useState(null);

  /**
   * Function to trigger fetching chart data.
   * @param {object} params - The parameters for the chart data request.
   */
  const fetchChartData = async (params) => {
    // Reset states.
    setStatus('loading');
    setChartData(null);
    setError(null);
    // Note: We don't show a toast here as this might be called frequently.

    try {
      // Call the API function.
      const response = await apiGetChartData(params);
      // Update state on success.
      setChartData(response);
      setStatus('success');
    } catch (err) {
      // Update state on error.
      const errorMessage = err.message || 'Failed to fetch chart data.';
      setError(errorMessage);
      setStatus('error');
      toast.error(`Chart Error: ${errorMessage}`);
    }
  };

  // Expose state and the fetch function.
  return { status, chartData, error, fetchChartData };
};
