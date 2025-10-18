import { api } from './client';

/**
 * Fetches the aggregated data for a specific chart.
 * @param {object} params - The parameters for the chart data request.
 * @param {string} params.datasetId - The ID of the dataset.
 * @param {string} params.chart_type - The type of chart.
 * @param {string} params.x_axis - The column for the x-axis.
 * @param {string} params.y_axis - The column for the y-axis.
 * @param {string} params.aggregation - The aggregation function.
 * @returns {Promise<object>} The chart data series.
 */
export const getChartData = (params) => {
  // Use the api client to make the POST request.
  return api('/charts/data', {
    method: 'POST',
    body: params,
  });
};