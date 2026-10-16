import api from './api';

export const masterPromptService = {
  async generateMasterPrompt(payload) {
    const res = await api.post('/master-prompts/generate', payload);
    return res.data?.masterPrompt;
  },

  async getMasterPrompts(params = {}) {
    const res = await api.get('/master-prompts', { params });
    return res.data;
  },

  async getMasterPromptById(id) {
    const res = await api.get(`/master-prompts/${id}`);
    return res.data?.masterPrompt;
  },

  async updateMasterPrompt(id, payload) {
    const res = await api.patch(`/master-prompts/${id}`, payload);
    return res.data?.masterPrompt;
  },

  async deleteMasterPrompt(id) {
    const res = await api.delete(`/master-prompts/${id}`);
    return res;
  },

  async duplicateMasterPrompt(id) {
    const res = await api.post(`/master-prompts/${id}/duplicate`);
    return res.data?.masterPrompt;
  },

  async generateScriptFromPrompt(id) {
    const res = await api.post(`/master-prompts/${id}/generate-script`);
    return res.data;
  },
};
