import api from './api';

export const methodService = {
  async getMethods() {
    const res = await api.get('/methods');
    return res.data?.methods || [];
  },

  async getMethodById(id) {
    const res = await api.get(`/methods/${id}`);
    return res.data?.method;
  },

  async createMethod(methodData) {
    const res = await api.post('/methods', methodData);
    return res.data?.method;
  },

  async updateMethod(id, methodData) {
    const res = await api.patch(`/methods/${id}`, methodData);
    return res.data?.method;
  },

  async deleteMethod(id) {
    const res = await api.delete(`/methods/${id}`);
    return res;
  },
};
