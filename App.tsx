import React, {

  useEffect,

  useState,

  createContext,

  useMemo,

} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { PaperProvider, MD3LightTheme } from 'react-native-paper';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { STORAGE_KEYS } from './src/config/api';

import { authService } from './src/services/auth-service';

import { initDatabase } from './src/services/offline-sync-service';

import { colors, paperTheme } from './src/theme';

import LoadingScreen from './src/components/ui/LoadingScreen';



import LoginScreen from './src/screens/Login/LoginScreen';

import DashboardScreen from './src/screens/Dashboard/DashboardScreen';

import Sidebar from './src/components/Sidebar';

import JadwalRiksaScreen from './src/screens/Jadwal/JadwalRiksaScreen';

import RiwayatScreen from './src/screens/Riwayat/RiwayatScreen';

import ExecutionScreen from './src/screens/Inspeksi/ExecutionScreen';

import ProfilScreen from './src/screens/Profil/ProfilScreen';

import PanduanScreen from './src/screens/Panduan/PanduanScreen';

import KalenderScreen from './src/screens/Kalender/KalenderScreen';

import ReportsScreen from './src/screens/Laporan/ReportsScreen';

import ReportDetailScreen from './src/screens/Laporan/ReportDetailScreen';



export const AuthContext = createContext(null);



const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();



const theme = {

  ...MD3LightTheme,

  roundness: paperTheme.roundness,

  colors: {

    ...MD3LightTheme.colors,

    ...paperTheme.colors,

  },

};



function DrawerNavigator() {

  return (

    <Drawer.Navigator

      drawerContent={props => <Sidebar {...props} />}

      screenOptions={{

        headerShown: false,

        drawerStyle: { width: 288, backgroundColor: colors.surface },

        overlayColor: 'rgba(15, 23, 42, 0.45)',

        drawerType: 'front',

      }}

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

      updateUser: async (userData) => {

        if (userData) {

          await AsyncStorage.setItem(

            STORAGE_KEYS.USER,

            JSON.stringify(userData),

          );

          setUser(userData);

        }

      },

    }),

    [user],

  );



  useEffect(() => {

    initDatabase();

    const checkLoginStatus = async () => {

      try {

        const token = await authService.getStoredToken();

        const storedUser = await authService.getStoredUser();

        if (token) {

          setUserToken(token);

          setUser(storedUser);

          try {

            const freshUser = await authService.refreshSession();

            if (freshUser) setUser(freshUser);

          } catch (_) {

            // keep cached user when offline or token expired

          }

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

      <SafeAreaProvider>

        <LoadingScreen message="Memuat RJS Inspector..." />

      </SafeAreaProvider>

    );

  }



  return (

    <SafeAreaProvider>

      <AuthContext.Provider value={authContext}>

        <PaperProvider theme={theme}>

          <NavigationContainer>

            <Stack.Navigator

              screenOptions={{

                headerShown: false,

                animation: 'slide_from_right',

              }}

            >

              {userToken === null ? (

                <Stack.Screen name="Login" component={LoginScreen} />

              ) : (

                <>

                  <Stack.Screen name="MainApp" component={DrawerNavigator} />

                  <Stack.Screen

                    name="JadwalRiksa"

                    component={JadwalRiksaScreen}

                  />

                  <Stack.Screen name="Profil" component={ProfilScreen} />

                  <Stack.Screen name="Panduan" component={PanduanScreen} />

                  <Stack.Screen name="Kalender" component={KalenderScreen} />

                  <Stack.Screen name="Reports" component={ReportsScreen} />

                  <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />

                  <Stack.Screen

                    name="Execution"

                    component={ExecutionScreen}

                  />

                </>

              )}

            </Stack.Navigator>

          </NavigationContainer>

        </PaperProvider>

      </AuthContext.Provider>

    </SafeAreaProvider>

  );

}


