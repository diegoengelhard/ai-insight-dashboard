import { api } from './client';

/**
 * Uploads a dataset file to the backend.
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<{datasetId: string, filename: string}>} The response from the API.
 */
export const uploadDataset = (file) => {
  // Create a FormData object to send the file.
  const formData = new FormData();
  formData.append('file', file);

  // Use the api client to make the POST request.
  return api('/datasets/upload', {
    method: 'POST',
    body: formData,
  });
};
