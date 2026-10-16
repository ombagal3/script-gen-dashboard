import api from './api';

export const autopilotService = {
  // Trigger on-demand Autopilot research & synthesis scan
  runScan: async (payload = {}) => {
    const response = await api.post('/autopilot/scan', payload);
    return response.data;
  },

  // Get daily briefs
  getDailyBriefs: async (params = {}) => {
    const response = await api.get('/autopilot/briefs', { params });
    return response.data?.briefs || [];
  },

  // Get single brief by ID
  getBriefById: async (id) => {
    const response = await api.get(`/autopilot/briefs/${id}`);
    return response.data?.brief;
  },

  // Update brief status (1-click transition)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/autopilot/briefs/${id}/status`, { status });
    return response.data?.brief;
  },

  // Update brief content/notes
  updateBrief: async (id, data) => {
    const response = await api.patch(`/autopilot/briefs/${id}`, data);
    return response.data?.brief;
  },

  // Get research job audit logs
  getJobHistory: async () => {
    const response = await api.get('/autopilot/jobs');
    return response.data?.jobs || [];
  },

  // Log performance feedback for a published video
  logPerformance: async (briefId, metrics) => {
    const response = await api.post(`/performance/${briefId}`, metrics);
    return response.data;
  },

  // Get overall performance feedback summary
  getPerformanceSummary: async () => {
    const response = await api.get('/performance/summary');
    return response.data;
  },
};
