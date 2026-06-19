import { Platform } from 'react-native';

// Android emulator: 10.0.2.2 → host machine localhost
// iOS simulator: localhost
// Physical device: ganti dengan IP LAN komputer dev (mis. 192.168.x.x)
const DEV_HOST = Platform.select({
  android: '10.0.2.2',
  ios: 'localhost',
  default: '127.0.0.1',
});

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:8000/api`
  : 'https://api.riksajayaswastika.co.id/api';

export const STORAGE_KEYS = {
  TOKEN: 'userToken',
  USER: 'userData',
};
