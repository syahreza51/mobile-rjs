import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { db } from '../../services/db-service';
import {
  FormRegistry,
  FormDataUmum,
  FormCatatan,
} from '../../components/forms';

export default function InputPtpScreen({ route, navigation }) {
  // Mengambil subAlat dari navigasi (contoh: 'Genset' atau 'Mesin Press')
  const { subAlat } = route.params || { subAlat: 'Motor Diesel' };

  // Inisialisasi State Data agar sinkron dengan FormDataUmum
  const [data, setData] = useState({
    pemilik: '', // Field wajib untuk validasi
    alamat: '',
    lokasiUnit: '',
    dokumentasi: [],
    catatan: '',
    tglPemeriksaan: new Date().toLocaleDateString('id-ID'),
  });

  // Ambil Komponen Form dari Registry berdasarkan nama subAlat
  const DynamicForm = FormRegistry[subAlat];

  const handleSave = async () => {
    // Validasi menggunakan field 'pemilik' sesuai update FormDataUmum
    if (!data.pemilik) {
      Alert.alert(
        'Peringatan',
        'Mohon isi Nama Pemilik / Pengguna di Data Umum',
      );
      return;
    }

    const payload = {
      bidang: 'PTP',
      subAlat: subAlat,
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      await db.execute(
        'INSERT INTO inspections (bidang, data, created_at) VALUES (?, ?, ?)',
        ['PTP', JSON.stringify(payload), new Date().toISOString()],
      );

      Alert.alert('Sukses', `Laporan ${subAlat} berhasil disimpan`, [
        { text: 'OK', onPress: () => navigation.goBack() }, // Menggunakan goBack agar kembali ke menu sebelumnya
      ]);
    } catch (err) {
      console.error('PTP Save Error:', err);
      Alert.alert('Error', 'Gagal menyimpan data ke database');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.headerTitle}>
        Inspeksi {subAlat}
      </Text>

      {/* 1. DATA UMUM (Disesuaikan untuk PTP) */}
      <Card style={styles.card}>
        <Card.Content>
          <FormDataUmum
            data={data}
            setData={setData}
            styles={styles}
            subAlat={subAlat}
            bidang="PTP" // Memunculkan field Merk, No Seri, Kapasitas, dan No Izin
          />
        </Card.Content>
      </Card>

      {/* 2. FORM DINAMIS (Berdasarkan subAlat yang dipilih) */}
      <Card style={styles.card}>
        <Card.Content>
          {DynamicForm ? (
            <DynamicForm
              data={data}
              setData={setData}
              styles={styles}
              requestPermission={() => {}} // Anda bisa menghubungkan ke requestCameraPermission jika perlu
            />
          ) : (
            <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>
              Form untuk {subAlat} belum tersedia di Registry.
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* 3. CATATAN & REKOMENDASI */}
      <Card style={styles.card}>
        <Card.Content>
          <FormCatatan data={data} setData={setData} styles={styles} />
        </Card.Content>
      </Card>

      {/* TOMBOL SIMPAN */}
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        icon="content-save-check"
      >
        Simpan Laporan {subAlat}
      </Button>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
  },
  headerTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#0ea5e9', // Warna Biru khas PTP (Sky Blue)
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  subTitleSection: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#0ea5e9',
  },
  saveButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
});
