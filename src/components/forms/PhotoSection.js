import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button, Text, List } from 'react-native-paper';
import { launchCamera } from 'react-native-image-picker';

export const PhotoSection = ({
  label,
  imageUri,
  onPhotoTaken,
  requestPermission,
}) => {
  const handleCamera = async () => {
    // 1. PANGGIL FUNGSI IZIN TERLEBIH DAHULU
    const hasPermission = await requestPermission();

    if (!hasPermission) {
      Alert.alert(
        'Izin Ditolak',
        'Aplikasi tidak bisa membuka kamera tanpa izin Anda.',
      );
      return;
    }

    // 2. JIKA DIIZINKAN, BARU BUKA KAMERA
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.assets && response.assets.length > 0) {
        onPhotoTaken(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <Button
            icon="camera-retake"
            onPress={handleCamera}
            mode="contained-tonal"
            style={styles.btn}
          >
            Ganti Foto
          </Button>
        </View>
      ) : (
        <TouchableOpacity style={styles.placeholder} onPress={handleCamera}>
          <List.Icon icon="camera" color="#94a3b8" />
          <Text style={{ color: '#94a3b8', fontSize: 12 }}>
            Ambil Foto Dokumentasi
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10, width: '100%' },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#334155',
  },
  placeholder: {
    width: '100%',
    height: 120,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  previewContainer: { width: '100%', alignItems: 'center' },
  preview: { width: '100%', height: 250, borderRadius: 12, marginBottom: 8 },
  btn: { width: '100%', borderRadius: 8 },
});
