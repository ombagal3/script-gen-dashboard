import api from './api';

export const scriptService = {
  async getScripts(params = {}) {
    const res = await api.get('/scripts', { params });
    return res.data;
  },

  async getScriptById(id) {
    const res = await api.get(`/scripts/${id}`);
    return res.data?.script;
  },

  async createScript(scriptData) {
    const res = await api.post('/scripts', scriptData);
    return res.data?.script;
  },

  async updateScript(id, scriptData) {
    const res = await api.patch(`/scripts/${id}`, scriptData);
    return res.data?.script;
  },

  async deleteScript(id) {
    const res = await api.delete(`/scripts/${id}`);
    return res;
  },

  async duplicateScript(id) {
    const res = await api.post(`/scripts/${id}/duplicate`);
    return res.data?.script;
  },

  async generateScript(payload) {
    const res = await api.post('/scripts/generate', payload);
    return res.data;
  },

  async generateVariation(payload) {
    const res = await api.post('/scripts/generate-variation', payload);
    return res.data?.script;
  },

  async regenerateSection(payload) {
    const res = await api.post('/scripts/regenerate-section', payload);
    return res.data;
  },
};
