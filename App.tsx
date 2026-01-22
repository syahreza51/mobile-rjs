import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { initDatabase } from './src/services/db-service';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import Screens (Sama seperti sebelumnya)
import LoginScreen from './src/screens/Login/LoginScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import Sidebar from './src/components/Sidebar';
import JadwalRiksaScreen from './src/screens/Jadwal/JadwalRiksaScreen';
import RiwayatScreen from './src/screens/Riwayat/RiwayatScreen';
import DetailRiwayatScreen from './src/screens/Riwayat/DetailRiwayatScreen';
import PilihBidangScreen from './src/screens/PilihBidangScreen';
import PilihSubBidangScreen from './src/screens/PilihSubBidangScreen';
import InputPapaScreen from './src/screens/Inspeksi/InputPapaScreen';
import InputPubtScreen from './src/screens/Inspeksi/InputPubtScreen';
import InputListrikScreen from './src/screens/Inspeksi/InputListrikScreen';
import InputFireScreen from './src/screens/Inspeksi/InputFireScreen';
import InputPtpScreen from './src/screens/Inspeksi/InputPtpScreen';
import InputElevatorScreen from './src/screens/Inspeksi/InputElevatorScreen';

// BUAT CONTEXT UNTUK AUTH
export const AuthContext = createContext<any>(null);

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
  const [userToken, setUserToken] = useState<string | null>(null);

  // Fungsi Login & Logout yang bisa dipanggil dari screen mana saja
  const authContext = useMemo(
    () => ({
      signIn: async (token: string) => {
        setUserToken(token);
      },
      signOut: async () => {
        await AsyncStorage.multiRemove(['userToken', 'userData']);
        setUserToken(null);
      },
    }),
    [],
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        initDatabase();
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
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
                <Stack.Screen name="RiwayatScreen" component={RiwayatScreen} />
                <Stack.Screen
                  name="DetailRiwayat"
                  component={DetailRiwayatScreen}
                  options={{ headerShown: true, title: 'Detail Laporan' }}
                />
                <Stack.Screen
                  name="PilihBidang"
                  component={PilihBidangScreen}
                />
                <Stack.Screen
                  name="PilihSubBidang"
                  component={PilihSubBidangScreen}
                />
                <Stack.Screen name="InputPapa" component={InputPapaScreen} />
                <Stack.Screen name="InputPubt" component={InputPubtScreen} />
                <Stack.Screen
                  name="InputListrik"
                  component={InputListrikScreen}
                />
                <Stack.Screen name="InputFire" component={InputFireScreen} />
                <Stack.Screen name="InputPtp" component={InputPtpScreen} />
                <Stack.Screen
                  name="InputElevator"
                  component={InputElevatorScreen}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
}
