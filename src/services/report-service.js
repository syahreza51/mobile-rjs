import apiClient from './api-client';

export const reportService = {
  getProjects: async (params = {}) => {
    const response = await apiClient.get('/office/reports', {
      params: { page: 1, limit: 15, ...params },
    });
    const payload = response.data?.data;
    return {
      items: payload?.data || [],
      currentPage: payload?.current_page || 1,
      lastPage: payload?.last_page || 1,
      total: payload?.total || 0,
    };
  },

  getProjectDetail: async inspectionId => {
    const response = await apiClient.get(`/office/reports/${inspectionId}`);
    return response.data?.data;
  },
};
