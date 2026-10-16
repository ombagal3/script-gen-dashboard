import api from './api';

export const contentStrategyService = {
  // Get active strategy profile
  getActiveStrategy: async () => {
    const response = await api.get('/content-strategy/active');
    return response.data?.strategy;
  },

  // Get all strategy profiles (multi-brand)
  getAllStrategies: async () => {
    const response = await api.get('/content-strategy');
    return response.data?.strategies || [];
  },

  // Create a new strategy profile
  createStrategy: async (data) => {
    const response = await api.post('/content-strategy', data);
    return response.data?.strategy;
  },

  // Update existing strategy
  updateStrategy: async (id, data) => {
    const response = await api.patch(`/content-strategy/${id}`, data);
    return response.data?.strategy;
  },

  // Set active strategy profile
  setActiveStrategy: async (id) => {
    const response = await api.post(`/content-strategy/${id}/set-active`);
    return response.data?.strategy;
  },

  // Delete strategy
  deleteStrategy: async (id) => {
    const response = await api.delete(`/content-strategy/${id}`);
    return response;
  },
};
