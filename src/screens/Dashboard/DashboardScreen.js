import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, Avatar, IconButton, Surface } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../../App';

const { width } = Dimensions.get('window');

// Palet Warna Standar K3 (Safety Colors)
const SAFETY_COLORS = {
  primary: '#0055A4', // Safety Blue (Mandatory/Informasi)
  warning: '#F9D71C', // Safety Yellow (Waspada/Caution)
  success: '#009639', // Safety Green (Aman/Safe Condition)
  danger: '#C8102E', // Safety Red (Bahaya/Stop)
  background: '#F2F4F7', // Abu-abu muda bersih
  textDark: '#1E293B',
  textLight: '#BBDEFB',
};

export default function DashboardScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(true);
  const auth = React.useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari sesi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (auth && auth.signOut) {
                await auth.signOut();
              } else {
                // Fallback jika context gagal (Silent Error Fix)
                console.error('AuthContext tidak ditemukan');
                await AsyncStorage.multiRemove(['userToken', 'userData']);
                // Force reset jika context tidak tersedia
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            } catch (error) {
              console.error('Error saat logout:', error);
            }
          },
        },
      ],
    );
  };

  const QUICK_STATS = [
    {
      label: 'Total Riksa',
      value: '124',
      icon: 'shield-check',
      color: SAFETY_COLORS.primary,
    },
    { label: 'Pending', value: '8', icon: 'alert-decagram', color: '#E65100' }, // Orange Warning
    {
      label: 'Selesai',
      value: '42',
      icon: 'check-circle',
      color: SAFETY_COLORS.success,
    },
  ];

  const MENU_DATA = [
    {
      id: 1,
      title: 'Input Data',
      icon: 'clipboard-edit-outline',
      desc: 'Mulai Inspeksi Baru',
      screen: 'PilihBidang',
      color: SAFETY_COLORS.primary,
    },
    {
      id: 2,
      title: 'Jadwal Kerja',
      icon: 'calendar-clock',
      desc: 'Antrean Riksa Uji',
      screen: 'JadwalRiksa',
      color: '#546E7A',
    },
    {
      id: 3,
      title: 'Riwayat',
      icon: 'database-search',
      desc: 'Cek data tersimpan',
      screen: 'Riwayat',
      color: '#455A64',
    },
    {
      id: 4,
      title: 'Laporan PDF',
      icon: 'file-pdf-box',
      desc: 'Grafik & Statistik',
      screen: 'Laporan',
      color: SAFETY_COLORS.danger,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={SAFETY_COLORS.primary}
      />

      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: SAFETY_COLORS.primary }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoAndTitleContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/logo/logo.png')}
                style={styles.logoImage}
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>RIKSA JAYA</Text>
              <Text style={styles.headerSubtitle}>SWASTIKA K3 SYSTEM</Text>
            </View>
          </View>

          <Surface style={styles.statusBadge} elevation={0}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: isConnected
                    ? '#4ADE80'
                    : SAFETY_COLORS.danger,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: isConnected ? '#4ADE80' : '#FFCDD2' },
              ]}
            >
              {isConnected ? 'Sistem Online' : 'Offline'}
            </Text>
          </Surface>
        </View>

        <View style={styles.profileSection}>
          <View>
            <Text style={styles.greetingText}>Inspector On Duty,</Text>
            <Text style={styles.userNameText}>Andi Inspector</Text>
          </View>
          <Avatar.Image
            size={60}
            source={{ uri: 'https://i.pravatar.cc/300' }}
            style={styles.avatar}
          />
        </View>

        {/* Stats Section Overlay */}
        <View style={styles.statsContainer}>
          {QUICK_STATS.map((stat, index) => (
            <Surface key={index} style={styles.statCard} elevation={2}>
              <IconButton
                icon={stat.icon}
                iconColor={stat.color}
                size={26}
                style={styles.statIcon}
              />
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Surface>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuGrid}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Modul Pemeriksaan</Text>
            <IconButton icon="dots-vertical" size={20} />
          </View>

          {MENU_DATA.map(item => (
            <Card
              key={item.id}
              style={styles.menuCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuRow}>
                <View
                  style={[
                    styles.menuIconWrapper,
                    { backgroundColor: item.color + '10' },
                  ]}
                >
                  <IconButton
                    icon={item.icon}
                    iconColor={item.color}
                    size={28}
                  />
                </View>
                <View style={styles.menuTextContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#B0BEC5"
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Safety Banner */}
        <Surface style={styles.safetyBanner} elevation={1}>
          <IconButton
            icon="bullhorn-variant"
            iconColor={SAFETY_COLORS.primary}
            size={22}
          />
          <Text style={styles.safetyText}>
            Utamakan Keselamatan dan Kesehatan Kerja
          </Text>
        </Surface>

        {/* Footer */}
        <View style={styles.footerSection}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color={SAFETY_COLORS.danger}
            />
            <Text style={styles.logoutText}>Keluar Sesi</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>
            RJS Mobile v2.1.0 • Technical Support
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SAFETY_COLORS.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  logoAndTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  logoWrapper: {
    width: 45,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoImage: { width: 35, height: 35, resizeMode: 'contain' },
  headerTitle: {
    color: 'white',
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: SAFETY_COLORS.textLight,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  greetingText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 },
  userNameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  avatar: { backgroundColor: '#fff', elevation: 5 },
  statsContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 3.2,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIcon: { margin: 0 },
  statValue: { fontWeight: '900', fontSize: 20 },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: 'bold',
    marginTop: 2,
  },
  scrollContent: { marginTop: 65, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SAFETY_COLORS.textDark,
  },
  menuGrid: { marginBottom: 20 },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 22,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuIconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContent: { flex: 1, paddingLeft: 18 },
  menuTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: SAFETY_COLORS.textDark,
  },
  menuDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 15,
    marginBottom: 25,
    borderLeftWidth: 6,
    borderLeftColor: SAFETY_COLORS.warning,
  },
  safetyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    fontStyle: 'italic',
    flex: 1,
  },
  footerSection: { alignItems: 'center', marginTop: 10 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },
  logoutText: {
    color: SAFETY_COLORS.danger,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  versionText: { color: '#94A3B8', fontSize: 11, marginTop: 15 },
});
