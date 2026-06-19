import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { AuthContext } from '../../App';

const MENU_ITEMS = [
  { name: 'Beranda', icon: '🏠', screen: 'DashboardHome' },
  { name: 'Jadwal Riksa', icon: '📅', action: 'JadwalRiksa', stack: true },
  { name: 'Riwayat', icon: '📜', screen: 'Riwayat' },
];

export default function Sidebar({ navigation }) {
  const { user, signOut } = React.useContext(AuthContext);

  const navigateTo = item => {
    if (item.stack) {
      navigation.getParent()?.navigate(item.action);
    } else {
      navigation.navigate(item.screen);
    }
    navigation.closeDrawer();
  };

  const initials = (user?.name || 'IN')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Inspector'}</Text>
          <Text style={styles.userRole}>
            {user?.position || 'Petugas Lapangan'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.menuList}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigateTo(item)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutItem} onPress={() => signOut()}>
        <Text style={styles.menuIcon}>🚪</Text>
        <Text style={[styles.menuLabel, { color: '#C8102E' }]}>Keluar</Text>
      </TouchableOpacity>
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
    backgroundColor: '#0055A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  userInfo: { marginLeft: 15 },
  userName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  userRole: { color: '#888', fontSize: 12, textTransform: 'capitalize' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  menuList: { paddingHorizontal: 10, flex: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  menuIcon: { fontSize: 20, marginRight: 15 },
  menuLabel: { fontSize: 15, color: '#444', fontWeight: '500' },
});
