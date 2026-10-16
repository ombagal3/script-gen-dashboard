import api from './api';

export const productAutoScriptService = {
  /**
   * Generates Product AutoScript: research → trending videos → creative analysis → master prompt → script & shooting directions
   */
  async generateAutoScript(payload) {
    const response = await api.post('/product-autoscript/generate', payload);
    return response.data;
  },

  /**
   * Fetches user defaults for market, language, and platform from saved strategy
   */
  async getDefaults() {
    const response = await api.get('/product-autoscript/defaults');
    return response.data;
  },

  /**
   * Fetches paginated history of past Product AutoScript jobs
   */
  async getHistory(params = {}) {
    const response = await api.get('/product-autoscript/history', { params });
    return response.data;
  },

  /**
   * Fetches a single Product AutoScript job by ID
   */
  async getById(id) {
    const response = await api.get(`/product-autoscript/${id}`);
    return response.data.autoScript;
  },

  /**
   * Regenerates 3 fresh hooks and recommended hook
   */
  async regenerateHook(autoScriptId) {
    const response = await api.post('/product-autoscript/regenerate-hook', { autoScriptId });
    return response.data;
  },

  /**
   * Generates an alternative creative angle for the product
   */
  async generateAlternativeAngle(autoScriptId) {
    const response = await api.post('/product-autoscript/alternative-angle', { autoScriptId });
    return response.data;
  },
};
