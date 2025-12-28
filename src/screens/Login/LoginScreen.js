import React from 'react';
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
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import { db } from '../../services/db-service'; // Import koneksi db
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    const result = db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password], // Pastikan Anda punya state email & password
    );

    if (result.rows.length > 0) {
      const user = result.rows.item(0);

      // SIMPAN DATA LOGIN KE STORAGE
      await AsyncStorage.setItem('userToken', 'active');
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      navigation.replace('MainApp');
    } else {
      Alert.alert('Gagal', 'Email atau Password salah.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                Sistem Inspeksi Digital (Inspector)
              </Text>
            </View>

            {/* Form Area */}
            <View style={styles.form}>
              <CustomInput
                label="Email Address"
                placeholder="masukkan email anda"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <CustomInput
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text
                style={[styles.forgotText, isTablet && styles.footerTextTablet]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, isTablet && styles.loginBtnTablet]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.loginBtnText,
                  isTablet && styles.loginBtnTextTablet,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text
                style={[styles.footerText, isTablet && styles.footerTextTablet]}
              >
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.registerText,
                    isTablet && styles.footerTextTablet,
                  ]}
                >
                  Register
                </Text>
              </TouchableOpacity>
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
    backgroundColor: '#f8fafc', // slate-50
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 5, // Shadow untuk Android
    // shadowColor: '#000', // Shadow untuk iOS
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
  },
  logoWrapperTablet: {
    width: 140,
    height: 140,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#1e293b', // Slate 800
    textAlign: 'center',
  },
  titleTablet: {
    fontSize: 36,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 8,
  },
  subtitleTablet: {
    fontSize: 20,
  },
  form: {
    width: '100%',
  },
  forgotBtn: {
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  forgotText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: '#2563eb',
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
  },
  loginBtnTablet: {
    paddingVertical: 24,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginBtnTextTablet: {
    fontSize: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: 32,
  },
  footerText: {
    color: '#64748b',
  },
  footerTextTablet: {
    fontSize: 18,
  },
  registerText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
