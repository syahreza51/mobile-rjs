import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Text, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../App';
import { colors, radius, spacing } from '../theme';

const MENU_ITEMS = [
  { name: 'Beranda', icon: 'home-variant-outline', screen: 'DashboardHome', stack: false },
  { name: 'Jadwal Kerja', icon: 'calendar-clock', screen: 'JadwalRiksa', stack: true },
  { name: 'Kalender', icon: 'calendar-month-outline', screen: 'Kalender', stack: true },
  { name: 'Laporan', icon: 'file-document-outline', screen: 'Reports', stack: true },
  { name: 'Riwayat Inspeksi', icon: 'history', screen: 'Riwayat', stack: false },
  { name: 'Panduan Lapangan', icon: 'book-open-page-variant', screen: 'Panduan', stack: true },
  { name: 'Profil Saya', icon: 'account-circle-outline', screen: 'Profil', stack: true },
];

export default function Sidebar({ navigation, state }) {
  const { user, signOut } = React.useContext(AuthContext);
  const activeRoute = state?.routeNames?.[state?.index] || 'DashboardHome';

  const navigateTo = item => {
    if (item.stack) {
      navigation.getParent()?.navigate(item.screen);
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
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/logo/logo.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.brand}>RJS Inspector</Text>
            <Text style={styles.brandSub}>Lapangan K3</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Inspector'}
            </Text>
            <Text style={styles.userRole} numberOfLines={1}>
              {(user?.position || 'petugas lapangan').replace(/_/g, ' ')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.menuList}>
        <Text style={styles.menuSection}>Menu Utama</Text>
        {MENU_ITEMS.map((item, index) => {
          const isActive = activeRoute === item.screen;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigateTo(item)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIconWrap,
                  isActive && styles.menuIconWrapActive,
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={isActive ? colors.primary : colors.textMuted}
                />
              </View>
              <Text
                style={[styles.menuLabel, isActive && styles.menuLabelActive]}
              >
                {item.name}
              </Text>
              {isActive ? (
                <View style={styles.activeDot} />
              ) : (
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={colors.textLight}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            navigation.closeDrawer();
            signOut();
          }}
        >
          <MaterialCommunityIcons name="logout" size={20} color={colors.danger} />
          <Text style={styles.logoutLabel}>Keluar dari Akun</Text>
        </TouchableOpacity>
        <Text style={styles.version}>RJS Mobile v2.2.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logo: { width: 32, height: 32, resizeMode: 'contain' },
  brand: { color: '#fff', fontSize: 18, fontWeight: '800' },
  brandSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.primary, fontWeight: '800', fontSize: 16 },
  userInfo: { marginLeft: spacing.md, flex: 1 },
  userName: { fontWeight: '800', fontSize: 15, color: '#fff' },
  userRole: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  menuList: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  menuSection: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  menuItemActive: { backgroundColor: colors.primarySoft },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuIconWrapActive: { backgroundColor: '#fff' },
  menuLabel: { flex: 1, fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
  menuLabelActive: { color: colors.primary, fontWeight: '700' },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  logoutLabel: { fontSize: 14, color: colors.danger, fontWeight: '700' },
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textLight,
    marginTop: spacing.md,
  },
});
