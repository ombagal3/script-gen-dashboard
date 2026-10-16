import api from './api';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.token) {
      localStorage.setItem('scriptflow_token', res.data.token);
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('scriptflow_token', res.data.token);
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network error on logout
    } finally {
      localStorage.removeItem('scriptflow_token');
    }
  },

  async getMe() {
    return await api.get('/auth/me');
  },

  async updatePreferences(preferences) {
    return await api.patch('/auth/preferences', preferences);
  },

  getToken() {
    return localStorage.getItem('scriptflow_token');
  },
};
