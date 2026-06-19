import apiClient from './api-client';

export const inspectionService = {
  getMyInspections: async (params = {}) => {
    const response = await apiClient.get('/office/inspections', {
      params: { assigned_to_me: 1, limit: 50, ...params },
    });
    return response.data?.data?.data || [];
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
