import axios from 'axios';

// Create Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/students',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Helper to format error message from backend
export const getErrorMessage = (error) => {
  if (!error.response) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return 'Unable to connect to the server. Please verify your network connection or make sure the server is online.';
    }
    return error.message || 'An unexpected network error occurred.';
  }

  const { data, status } = error.response;

  // Spring Boot ErrorResponse { status, message, timestamp }
  if (data && typeof data === 'object' && data.message) {
    return data.message;
  }

  // Validation error map: { field: "error message" }
  if (data && typeof data === 'object' && !data.message) {
    const fieldErrors = Object.values(data);
    if (fieldErrors.length > 0) {
      return fieldErrors.join(', ');
    }
  }

  if (typeof data === 'string') {
    return data;
  }

  switch (status) {
    case 400:
      return 'Invalid request data. Please check the entered fields.';
    case 404:
      return 'The requested student was not found.';
    case 409:
      return 'A student with this email already exists.';
    case 500:
      return 'Internal server error occurred. Please try again later.';
    default:
      return `Request failed with status code ${status}.`;
  }
};

export default apiClient;
