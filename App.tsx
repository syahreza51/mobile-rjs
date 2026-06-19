import React, {
  useEffect,
  useState,
  createContext,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { STORAGE_KEYS } from './src/config/api';
import { authService } from './src/services/auth-service';

import LoginScreen from './src/screens/Login/LoginScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import Sidebar from './src/components/Sidebar';
import JadwalRiksaScreen from './src/screens/Jadwal/JadwalRiksaScreen';
import RiwayatScreen from './src/screens/Riwayat/RiwayatScreen';
import ExecutionScreen from './src/screens/Inspeksi/ExecutionScreen';

export const AuthContext = createContext(null);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563eb',
    secondaryContainer: '#dbeafe',
  },
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <Sidebar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="DashboardHome" component={DashboardScreen} />
      <Drawer.Screen name="Riwayat" component={RiwayatScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  const authContext = useMemo(
    () => ({
      user,
      signIn: async (token, userData) => {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
        if (userData) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER,
            JSON.stringify(userData),
          );
          setUser(userData);
        }
        setUserToken(token);
      },
      signOut: async () => {
        await authService.logout();
        setUserToken(null);
        setUser(null);
      },
    }),
    [user],
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await authService.getStoredToken();
        const storedUser = await authService.getStoredUser();
        if (token) {
          setUserToken(token);
          setUser(storedUser);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {userToken === null ? (
              <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
              <>
                <Stack.Screen name="MainApp" component={DrawerNavigator} />
                <Stack.Screen
                  name="JadwalRiksa"
                  component={JadwalRiksaScreen}
                />
                <Stack.Screen
                  name="Execution"
                  component={ExecutionScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
}
