import apiClient from './api-client';

export const inspectionService = {
  getMyInspections: async (params = {}) => {
    const response = await apiClient.get('/office/inspections', {
      params: { assigned_to_me: 1, limit: 20, ...params },
    });
    const payload = response.data?.data;
    const items = payload?.data || payload || [];
    return {
      items: Array.isArray(items) ? items : [],
      currentPage: payload?.current_page || 1,
      lastPage: payload?.last_page || 1,
      total: payload?.total || (Array.isArray(items) ? items.length : 0),
    };
  },

  getExecutionData: async inspectionObjectId => {
    const response = await apiClient.get(
      `/office/inspections/execution/${inspectionObjectId}`,
    );
    return response.data.data;
  },

  saveExecution: async (inspectionObjectId, payload) => {
    const response = await apiClient.post(
      `/office/inspections/execution/${inspectionObjectId}/save`,
      payload,
    );
    return response.data;
  },
};
