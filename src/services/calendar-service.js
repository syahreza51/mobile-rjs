import apiClient from './api-client';

export const calendarService = {
  getEvents: async (year, month) => {
    const response = await apiClient.get('/office/calendar', {
      params: { year, month },
    });
    return response.data?.data;
  },
};
