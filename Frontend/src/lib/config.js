// Define the base URL for your backend API
// It uses the environment variable if available, otherwise defaults to localhost:8000
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Export all the API endpoints used in your application
export const API_ENDPOINTS = {
  base: API_BASE_URL, // This is the missing piece that caused the JSON error!
  
  // Auth Endpoints
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/register`,
  me: `${API_BASE_URL}/api/me`,
  
  // Template Endpoints
  templates: `${API_BASE_URL}/api/templates`,
  
  // Other Endpoints
  snippets: `${API_BASE_URL}/api/snippets`,
  export: `${API_BASE_URL}/api/export`,
  health: `${API_BASE_URL}/health`
};