import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { db } from '../../services/db-service';
import {
  FormRegistry,
  FormDataUmum,
  FormCatatan,
} from '../../components/forms';

export default function InputElevatorScreen({ route, navigation }) {
  // subAlat dikirim dari menu (contoh: 'Lift Penumpang', 'Tangga Berjalan (Eskalator)')
  const { subAlat } = route.params || { subAlat: 'Lift Penumpang' };

  // State utama untuk menampung seluruh data inspeksi
  const [data, setData] = useState({
    pemilik: '', // Field wajib di FormDataUmum
    alamat: '',
    lokasiUnit: '',
    dokumentasi: [],
    catatan: '',
    tglPemeriksaan: new Date().toLocaleDateString('id-ID'),
  });

  // Ambil komponen form yang sesuai dari registry
  const DynamicForm = FormRegistry[subAlat];

  const handleSave = async () => {
    // Validasi disesuaikan dengan key 'pemilik' di FormDataUmum
    if (!data.pemilik) {
      Alert.alert(
        'Peringatan',
        'Mohon isi Nama Pemilik / Pengguna di Data Umum',
      );
      return;
    }

    const payload = {
      bidang: 'LIFT',
      subAlat: subAlat,
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      await db.execute(
        'INSERT INTO inspections (bidang, data, created_at) VALUES (?, ?, ?)',
        ['LIFT', JSON.stringify(payload), new Date().toISOString()],
      );

      Alert.alert('Sukses', `Laporan ${subAlat} Berhasil Disimpan`, [
        { text: 'OK', onPress: () => navigation.navigate('MainApp') },
      ]);
    } catch (err) {
      console.error('Save Error:', err);
      Alert.alert('Error', 'Gagal menyimpan data ke database');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.headerTitle}>
        Inspeksi {subAlat}
      </Text>

      {/* SEKSI 1: DATA UMUM (Disesuaikan dengan Bidang LIFT) */}
      <Card style={styles.card}>
        <Card.Content>
          <FormDataUmum
            data={data}
            setData={setData}
            styles={styles}
            subAlat={subAlat}
            bidang="LIFT" // Memberitahu komponen untuk menampilkan field spesifik LIFT
          />
        </Card.Content>
      </Card>

      {/* SEKSI 2: FORM DINAMIS (Rincian Teknis Lift/Eskalator) */}
      <Card style={styles.card}>
        <Card.Content>
          {DynamicForm ? (
            <DynamicForm
              data={data}
              setData={setData}
              styles={styles}
              requestPermission={() => {}}
            />
          ) : (
            <Text
              style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}
            >
              Form {subAlat} tidak ditemukan di Registry.
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* SEKSI 3: CATATAN & REKOMENDASI */}
      <Card style={styles.card}>
        <Card.Content>
          <FormCatatan data={data} setData={setData} styles={styles} />
        </Card.Content>
      </Card>

      {/* TOMBOL AKSI */}
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
    color: '#8b5cf6',
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
    color: '#6d28d9',
  },
  saveButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
});
