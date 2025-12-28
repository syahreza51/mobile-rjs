import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

const CustomInput = ({ label, ...props }) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isTablet && styles.labelTablet]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isTablet && styles.inputTablet]}
        placeholderTextColor="#cbd5e1"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: '#475569', // slate-600
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  labelTablet: {
    fontSize: 18,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    color: '#1e293b', // slate-800
    fontSize: 16,
    // Shadow untuk Android
    elevation: 2,
  },
  inputTablet: {
    padding: 20,
    fontSize: 20,
  },
});

export default CustomInput;
