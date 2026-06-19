import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import { authService } from '../../services/auth-service';
import { AuthContext } from '../../../App';

const SAFETY_COLORS = {
  primary: '#0055A4',
  textDark: '#1E293B',
  textLight: '#64748B',
  background: '#F8FAFC',
};

export default function LoginScreen() {
  const { signIn } = React.useContext(AuthContext);
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Peringatan', 'Email dan Password harus diisi.');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await authService.login(email.trim(), password);
      signIn(token, user);
    } catch (e) {
      const message =
        e.response?.data?.message ||
        e.message ||
        'Email atau password salah.';
      Alert.alert('Gagal Login', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={SAFETY_COLORS.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { maxWidth: isTablet ? 500 : '100%' }]}>
            <View style={styles.header}>
              <View
                style={[
                  styles.logoWrapper,
                  isTablet && styles.logoWrapperTablet,
                ]}
              >
                <Image
                  source={require('../../assets/logo/logo.png')}
                  style={styles.logoImage}
                />
              </View>

              <Text style={[styles.title, isTablet && styles.titleTablet]}>
                Riksa Jaya Swastika
              </Text>
              <Text
                style={[styles.subtitle, isTablet && styles.subtitleTablet]}
              >
                Inspector Digital System
              </Text>
            </View>

            <View style={styles.form}>
              <CustomInput
                label="Email Inspector"
                placeholder="nama@email.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                returnKeyType="next"
              />

              <CustomInput
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.loginBtn,
                isTablet && styles.loginBtnTablet,
                { opacity: loading ? 0.7 : 1 },
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.loginBtnText,
                  isTablet && styles.loginBtnTextTablet,
                ]}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2025 PT. Riksa Jaya Swastika
              </Text>
              <Text style={styles.versionText}>v2.2.0 API Connected</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SAFETY_COLORS.background,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  logoWrapperTablet: {
    width: 160,
    height: 160,
  },
  logoImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 25,
    color: SAFETY_COLORS.textDark,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titleTablet: {
    fontSize: 38,
  },
  subtitle: {
    color: SAFETY_COLORS.textLight,
    fontSize: 15,
    marginTop: 5,
    fontWeight: '500',
  },
  subtitleTablet: {
    fontSize: 20,
  },
  form: {
    width: '100%',
  },
  loginBtn: {
    backgroundColor: SAFETY_COLORS.primary,
    marginTop: 35,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: SAFETY_COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginBtnTablet: {
    paddingVertical: 24,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginBtnTextTablet: {
    fontSize: 24,
  },
  footer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  footerText: {
    color: SAFETY_COLORS.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  versionText: {
    color: '#CBD5E1',
    fontSize: 10,
    marginTop: 4,
  },
});
