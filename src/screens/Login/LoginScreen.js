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
import { db } from '../../services/db-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../App';

const SAFETY_COLORS = {
  primary: '#0055A4',
  textDark: '#1E293B',
  textLight: '#64748B',
  background: '#F8FAFC',
};

export default function LoginScreen({ navigation }) {
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
      const result = db.execute(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
      );

      if (result.rows.length > 0) {
        const user = result.rows.item(0);
        await AsyncStorage.setItem('userToken', 'active');
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        // Panggil fungsi signIn dari App.tsx
        signIn('active');
      } else {
        Alert.alert('Gagal', 'Email atau Password salah.');
      }
    } catch (e) {
      Alert.alert('Error', 'DB Error');
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
            {/* Logo Area */}
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

            {/* Form Area */}
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
                // Fungsi Enter: tekan enter di keyboard langsung login
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>

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

            {/* Copyright / Footer Info */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2025 PT. Riksa Jaya Swastika
              </Text>
              <Text style={styles.versionText}>v2.1.0 Build Production</Text>
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
  forgotBtn: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  forgotText: {
    color: SAFETY_COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
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
