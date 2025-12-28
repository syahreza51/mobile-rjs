import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const MENU_ITEMS = [
  { name: 'Beranda', icon: '🏠', screen: 'Dashboard' },
  { name: 'Input Inspeksi', icon: '📝', screen: 'InputData' },
  { name: 'Riwayat Penjualan', icon: '📜', screen: 'History' },
  { name: 'Laporan', icon: '📊', screen: 'Reports' },
  { name: 'Pengaturan', icon: '⚙️', screen: 'Settings' },
];

export default function Sidebar({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Bagian Profil (Seperti di Gambar) */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>KC</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Andi Inspector</Text>
          <Text style={styles.userRole}>Petugas Lapangan</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* List Menu */}
      <View style={styles.menuList}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileSection: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#a88d7d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  userInfo: { marginLeft: 15 },
  userName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  userRole: { color: '#888', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  menuList: { paddingHorizontal: 10 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  menuIcon: { fontSize: 20, marginRight: 15 },
  menuLabel: { fontSize: 15, color: '#444', fontWeight: '500' },
});
