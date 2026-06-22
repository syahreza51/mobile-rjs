import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Surface, Button, Divider, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../../App';
import { authService } from '../../services/auth-service';
import { API_BASE_URL } from '../../config/api';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { colors, radius, spacing, shadow } from '../../theme';

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '-'}</Text>
      </View>
    </View>
  );
}

export default function ProfilScreen({ navigation }) {
  const { user, signOut, updateUser } = React.useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pwdVisible, setPwdVisible] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [changingPwd, setChangingPwd] = React.useState(false);

  const initials = (user?.name || 'IN')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari aplikasi?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);
  };

  const handleRefreshProfile = async () => {
    setRefreshing(true);
    try {
      const freshUser = await authService.refreshSession();
      if (freshUser && updateUser) {
        await updateUser(freshUser);
      }
      Alert.alert('Berhasil', 'Profil diperbarui dari server.');
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Tidak dapat memperbarui profil.',
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validasi', 'Semua field password wajib diisi.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Validasi', 'Password baru minimal 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validasi', 'Konfirmasi password tidak cocok.');
      return;
    }
    setChangingPwd(true);
    try {
      await authService.changePassword(currentPassword, newPassword, confirmPassword);
      setPwdVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Berhasil', 'Password berhasil diperbarui.');
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Password lama tidak sesuai.',
      );
    } finally {
      setChangingPwd(false);
    }
  };

  const apiLabel = __DEV__ ? 'Development' : 'Production';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Profil Saya"
        subtitle="Informasi akun inspector"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Surface style={styles.profileCard} elevation={2}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Inspector'}</Text>
          <Text style={styles.role}>
            {(user?.position || 'inspector').replace(/_/g, ' ')}
          </Text>
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="shield-account"
              size={14}
              color={colors.primary}
            />
            <Text style={styles.badgeText}>Petugas Inspeksi Lapangan</Text>
          </View>
        </Surface>

        <Surface style={styles.section} elevation={1}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>
          <Divider style={styles.divider} />
          <InfoRow icon="email-outline" label="Email" value={user?.email} />
          <InfoRow
            icon="badge-account-outline"
            label="Posisi"
            value={user?.position}
          />
          <InfoRow icon="domain" label="Peran" value={user?.role} />
        </Surface>

        <Surface style={styles.section} elevation={1}>
          <Text style={styles.sectionTitle}>Keamanan</Text>
          <Divider style={styles.divider} />
          <Button
            mode="outlined"
            icon="lock-reset"
            onPress={() => setPwdVisible(true)}
            style={styles.actionBtn}
          >
            Ganti Password
          </Button>
          <Button
            mode="text"
            icon="refresh"
            loading={refreshing}
            onPress={handleRefreshProfile}
            style={styles.actionBtn}
          >
            Segarkan Profil
          </Button>
        </Surface>

        <Surface style={styles.section} elevation={1}>
          <Text style={styles.sectionTitle}>Aplikasi</Text>
          <Divider style={styles.divider} />
          <InfoRow icon="cellphone" label="Versi" value="RJS Mobile v2.2.0" />
          <InfoRow icon="api" label="Mode" value={apiLabel} />
          <InfoRow icon="cloud-outline" label="Server API" value={API_BASE_URL} />
        </Surface>

        <Button
          mode="contained"
          onPress={handleLogout}
          buttonColor={colors.dangerSoft}
          textColor={colors.danger}
          style={styles.logoutBtn}
          icon="logout"
        >
          Keluar dari Akun
        </Button>
      </ScrollView>

      <Modal visible={pwdVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <Surface style={styles.modalCard} elevation={4}>
            <Text style={styles.modalTitle}>Ganti Password</Text>
            <TextInput
              label="Password saat ini"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.pwdInput}
            />
            <TextInput
              label="Password baru"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.pwdInput}
            />
            <TextInput
              label="Konfirmasi password baru"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.pwdInput}
            />
            <View style={styles.modalActions}>
              <Button onPress={() => setPwdVisible(false)}>Batal</Button>
              <Button mode="contained" loading={changingPwd} onPress={handleChangePassword}>
                Simpan
              </Button>
            </View>
          </Surface>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingBottom: 40 },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: colors.primary },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  role: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  divider: { marginVertical: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  infoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  logoutBtn: { marginTop: spacing.sm, borderRadius: radius.md },
  actionBtn: { marginBottom: spacing.sm, borderRadius: radius.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  pwdInput: { marginBottom: spacing.sm, backgroundColor: colors.surface },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
