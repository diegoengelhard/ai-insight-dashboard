import { api } from './client';

/**
 * Fetches AI-generated suggestions for a given dataset ID.
 * @param {string} datasetId - The ID of the dataset.
 * @returns {Promise<Array<object>>} A list of suggestion objects.
 */
export const getSuggestions = (datasetId) => {
  // Use the api client to make the POST request.
  return api('/analysis/suggestions', {
    method: 'POST',
    body: { datasetId },
  });
};
