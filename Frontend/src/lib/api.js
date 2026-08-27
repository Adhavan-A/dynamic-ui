const API_URL = 'http://localhost:8000';

export const authAPI = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('username', data.username);
    return data;
  },

  register: async (username, password) => {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }
    return await response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');

    const response = await fetch(`${API_URL}/api/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Not authenticated');
    return await response.json();
  }
};

export const templatesAPI = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/api/templates`, { headers });
    if (!response.ok) throw new Error('Failed to fetch templates');
    return await response.json();
  },
  
  create: async (templateData) => {
    const token = localStorage.getItem('token');
    const headers = { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_URL}/api/templates`, {
      method: 'POST',
      headers,
      body: JSON.stringify(templateData),
    });
    if (!response.ok) throw new Error('Failed to save template');
    return await response.json();
  },
  
  delete: async (id) => {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/api/templates/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete template');
    return await response.json();
  }
};