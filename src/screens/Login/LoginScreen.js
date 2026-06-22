import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  Snackbar,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { authService } from '../../services/auth-service';
import { AuthContext } from '../../../App';
import { colors, radius, spacing } from '../../theme';

function getFriendlyErrorMessage(error) {
  const raw =
    error.response?.data?.message ||
    error.message ||
    'Gagal masuk. Periksa email dan password Anda.';

  if (
    raw.includes('SQLSTATE') ||
    raw.includes('Access denied') ||
    raw.includes('Connection')
  ) {
    return 'Server sedang bermasalah. Pastikan backend aktif lalu coba lagi.';
  }

  if (error.response?.status === 401 || raw === 'Invalid credentials') {
    return 'Email atau password salah. Silakan coba lagi.';
  }

  if (raw.includes('manage-inspection') || raw.includes('inspector')) {
    return 'Akun ini belum memiliki akses inspeksi lapangan.';
  }

  return raw;
}

export default function LoginScreen() {
  const { signIn } = React.useContext(AuthContext);
  const { width, height } = useWindowDimensions();
  const isTablet = width > 600;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Mohon isi email dan password terlebih dahulu.');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await authService.login(email.trim(), password);
      signIn(token, user);
    } catch (e) {
      const message = getFriendlyErrorMessage(e);
      setErrorMessage(message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.background}>
        <View
          style={[
            styles.decorCircle,
            styles.decorCircleTop,
            { width: width * 0.9, height: width * 0.9 },
          ]}
        />
        <View
          style={[
            styles.decorCircle,
            styles.decorCircleBottom,
            { width: width * 0.55, height: width * 0.55 },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: height * 0.92 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Surface
            style={[
              styles.card,
              { maxWidth: isTablet ? 440 : '100%' },
            ]}
            elevation={3}
          >
            <View style={styles.badge}>
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color={colors.accent}
              />
              <Text style={styles.badgeText}>Inspector App</Text>
            </View>

            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/logo/logo.png')}
                style={styles.logoImage}
              />
            </View>

            <Text style={styles.greeting}>Selamat datang 👋</Text>
            <Text style={styles.title}>Riksa Jaya Swastika</Text>
            <Text style={styles.subtitle}>
              Masuk untuk mulai inspeksi lapangan hari ini
            </Text>

            {errorMessage ? (
              <Surface style={styles.errorBanner} elevation={0}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={20}
                  color={colors.danger}
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </Surface>
            ) : null}

            <View style={styles.form}>
              <TextInput
                mode="outlined"
                label="Email"
                placeholder="nama@perusahaan.com"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                left={<TextInput.Icon icon="email-outline" />}
                style={styles.input}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                disabled={loading}
              />

              <TextInput
                mode="outlined"
                label="Password"
                placeholder="Masukkan password"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPassword(prev => !prev)}
                    forceTextInputFocus={false}
                  />
                }
                style={styles.input}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                disabled={loading}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              disabled={loading}
              loading={loading}
              style={styles.loginBtn}
              contentStyle={styles.loginBtnContent}
              labelStyle={styles.loginBtnLabel}
              buttonColor={colors.primary}
            >
              {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
            </Button>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color={colors.textMuted}
              />
              <Text style={styles.infoText}>
                Gunakan akun office dengan akses inspeksi lapangan
              </Text>
            </View>
          </Surface>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 PT. Riksa Jaya Swastika</Text>
            <Text style={styles.versionText}>v2.2.0 · Terhubung ke API</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible && !!errorMessage}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={styles.snackbar}
        action={{
          label: 'Tutup',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {errorMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex1: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.12,
  },
  decorCircleTop: {
    backgroundColor: colors.primary,
    top: -120,
    right: -80,
  },
  decorCircleBottom: {
    backgroundColor: colors.accent,
    bottom: 40,
    left: -60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
  },
  badge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.3,
  },
  logoWrapper: {
    width: 88,
    height: 88,
    alignSelf: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  logoImage: {
    width: '72%',
    height: '72%',
    resizeMode: 'contain',
  },
  greeting: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    flex: 1,
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  form: {
    gap: 4,
  },
  input: {
    backgroundColor: colors.surface,
    marginBottom: 4,
  },
  loginBtn: {
    marginTop: 16,
    borderRadius: radius.md,
  },
  loginBtnContent: {
    paddingVertical: 6,
  },
  loginBtnLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  footer: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 8,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  versionText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  snackbar: {
    backgroundColor: colors.primaryDark,
  },
});
