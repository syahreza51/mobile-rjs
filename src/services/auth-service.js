import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api-client';
import { STORAGE_KEYS } from '../config/api';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    const { access_token, user } = response.data;

    if (user?.role !== 'office') {
      throw new Error('Akun ini bukan akun inspector/office.');
    }

    const permissions = user.permissions || [];
    if (!permissions.includes('manage-inspection')) {
      throw new Error('Akun tidak memiliki akses inspeksi lapangan.');
    }

    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return { token: access_token, user };
  },

  logout: async () => {
    try {
      await apiClient.post('/logout');
    } catch (_) {
      // ignore network errors on logout
    }
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
  },

  getMe: async () => {
    const response = await apiClient.get('/me');
    const user = response.data.user || response.data;
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  getStoredUser: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },

  getStoredToken: async () => {
    return AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};
