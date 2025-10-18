// Defines the base URL for all API requests.
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * A simple fetch wrapper for making API calls.
 * @param {string} endpoint - The API endpoint to call (e.g., '/datasets/upload').
 * @param {object} options - The options for the fetch request (method, headers, body, etc.).
 * @returns {Promise<any>} The JSON response from the API.
 */
export const api = async (endpoint, options = {}) => {
  // Construct the full URL.
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers.
  const headers = {
    ...options.headers,
  };

  // If the body is not FormData, stringify it as JSON.
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  // Make the fetch request.
  const response = await fetch(url, { ...options, headers });

  // Handle non-OK responses.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || 'An unknown API error occurred.');
  }

  // Return the parsed JSON response.
  return response.json();
};

