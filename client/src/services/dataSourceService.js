import api from './api';

export const dataSourceService = {
  // Get all data sources
  getDataSources: async () => {
    const response = await api.get('/data-sources');
    return response.data?.sources || [];
  },

  // Test single data source connection
  testSource: async (providerId, customConfig = null) => {
    const response = await api.post(`/data-sources/${providerId}/test`, customConfig || {});
    return response;
  },

  // Sync data source on-demand
  syncSource: async (providerId) => {
    const response = await api.post(`/data-sources/${providerId}/sync`);
    return response;
  },

  // Configure API key or token
  configureSource: async (providerId, config) => {
    const response = await api.post(`/data-sources/${providerId}/configure`, config);
    return response;
  },

  // Disconnect source
  disconnectSource: async (providerId) => {
    const response = await api.delete(`/data-sources/${providerId}`);
    return response;
  },
};
