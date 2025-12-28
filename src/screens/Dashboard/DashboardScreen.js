import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert, // Tambahkan Alert
} from 'react-native';
import { Text, Card, Avatar, IconButton, useTheme } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Tambahkan AsyncStorage

export default function DashboardScreen({ navigation }) {
  const theme = useTheme();
  const [isConnected, setIsConnected] = useState(true);

  // Logika cek koneksi internet
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Logout
  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Hapus token login
              await AsyncStorage.removeItem('userToken');
              // Reset navigasi ke layar Login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error saat logout:', error);
            }
          },
        },
      ],
    );
  };

  const MENU_DATA = [
    {
      id: 1,
      title: 'Input Data',
      icon: 'clipboard-edit',
      desc: 'Mulai Inspeksi Baru',
      screen: 'PilihBidang',
    },
    {
      id: 5,
      title: 'Jadwal Riksa Uji',
      icon: 'calendar-clock',
      desc: 'Daftar Antrean Inspeksi',
      screen: 'JadwalRiksa',
    },
    {
      id: 2,
      title: 'Riwayat',
      icon: 'history',
      desc: 'Lihat data tersimpan',
      screen: 'Riwayat',
    },
    {
      id: 3,
      title: 'Laporan',
      icon: 'chart-bar',
      desc: 'Grafik & Statistik',
      screen: 'Laporan',
    },
    {
      id: 4,
      title: 'Pengaturan',
      icon: 'cog',
      desc: 'Konfigurasi Aplikasi',
      screen: 'Settings',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoAndTitleContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/logo/logo.png')}
                style={styles.logoImage}
              />
            </View>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Riksa Jaya Swastika
            </Text>
          </View>

          <View style={styles.connectionIndicator}>
            <IconButton
              icon={isConnected ? 'wifi' : 'wifi-off'}
              iconColor={isConnected ? '#4ade80' : '#ef4444'}
              size={20}
              style={{ margin: 0 }}
            />
            <Text
              style={[
                styles.connectionText,
                { color: isConnected ? '#4ade80' : '#ef4444' },
              ]}
            >
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text variant="bodyLarge" style={styles.welcomeText}>
            Selamat Datang,
          </Text>
          <Text variant="headlineMedium" style={styles.userName}>
            Andi Inspector
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Menu Utama */}
        {MENU_DATA.map(item => (
          <Card
            key={item.id}
            style={styles.card}
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            <Card.Title
              title={item.title}
              subtitle={item.desc}
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon={item.icon}
                  style={{ backgroundColor: '#eff6ff' }}
                  color={theme.colors.primary}
                />
              )}
              right={props => <IconButton {...props} icon="chevron-right" />}
            />
          </Card>
        ))}

        {/* Tombol Logout di paling bawah */}
        <Card style={[styles.card, styles.logoutCard]} onPress={handleLogout}>
          <Card.Title
            title="Keluar"
            titleStyle={{ color: '#ef4444', fontWeight: 'bold' }}
            subtitle="Logout dari akun Anda"
            left={props => (
              <Avatar.Icon
                {...props}
                icon="logout"
                style={{ backgroundColor: '#fee2e2' }}
                color="#ef4444"
              />
            )}
          />
        </Card>

        {/* Spacing bawah agar tidak mepet */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 15,
  },
  logoAndTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoWrapper: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 3,
  },
  logoImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingRight: 10,
  },
  connectionText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  welcomeSection: { paddingHorizontal: 20, marginTop: 20 },
  welcomeText: { color: '#bfdbfe' },
  userName: { color: 'white', fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20, marginTop: -25 },
  card: { marginBottom: 12, backgroundColor: 'white' },
  logoutCard: {
    borderWidth: 1,
    borderColor: '#fecaca', // Garis tipis merah muda
    marginTop: 10,
  },
});
