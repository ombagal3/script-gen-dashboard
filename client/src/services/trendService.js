import api from './api';

export const trendService = {
  async getKPIs() {
    const res = await api.get('/trends/kpis');
    return res.data;
  },

  async getSourceStatuses() {
    const res = await api.get('/trends/sources/status');
    return res.data?.sources || [];
  },

  async getTrends(params = {}) {
    const res = await api.get('/trends', { params });
    return res.data;
  },

  async getTrendById(id) {
    const res = await api.get(`/trends/${id}`);
    return res.data?.trend;
  },

  async researchTrends(payload) {
    const res = await api.post('/trends/research', payload);
    return res.data;
  },

  async getResearchHistory(params = {}) {
    const res = await api.get('/trends/research-history', { params });
    return res.data;
  },

  async getResearchById(id) {
    const res = await api.get(`/trend-research/${id}`);
    return res.data?.research;
  },

  async analyzeTrend(id) {
    const res = await api.post(`/trends/${id}/analyze`);
    return res.data?.trend;
  },

  async toggleSaveTrend(id) {
    const res = await api.post(`/trends/${id}/toggle-save`);
    return res.data?.trend;
  },

  async importTrend(payload) {
    const res = await api.post('/trends/import', payload);
    return res.data?.trend;
  },

  async deleteTrend(id) {
    const res = await api.delete(`/trends/${id}`);
    return res;
  },
};
