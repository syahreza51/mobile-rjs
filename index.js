/**
 * @format
 */
import 'react-native-gesture-handler'; // Tambahkan ini di baris paling atas
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
