import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Button, Text, Card, List } from 'react-native-paper';
import { db } from '../../services/db-service';

// Import Komponen Form dari Central Registry
import {
  FormRegistry,
  FormDataUmum,
  FormCatatan,
} from '../../components/forms';

export default function InputListrikScreen({ route, navigation }) {
  const { subAlat } = route.params;

  // State disesuaikan agar sinkron dengan FormDataUmum (menggunakan 'pemilik')
  const [form, setForm] = useState({
    pemilik: '',
    alamat: '',
    lokasiUnit: '',
    statusKelayakan: 'LAYAK',
    bidang: 'LISTRIK',
    subAlat: subAlat,
    dokumentasi: [],
    temuan: '',
    saran: '',
    tglPemeriksaan: new Date().toLocaleDateString('id-ID'),
  });

  const [expanded, setExpanded] = useState({
    umum: true,
    teknis: true,
    catatan: false,
  });

  // Fungsi Izin Kamera & Galeri
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        return (
          granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  // Handler Simpan Data khusus LISTRIK
  const handleSave = async () => {
    // Validasi field 'pemilik' (bukan namaPerusahaan)
    if (!form.pemilik) {
      Alert.alert(
        'Peringatan',
        'Mohon isi Nama Pemilik / Pengguna di Data Umum',
      );
      return;
    }

    try {
      const payload = {
        ...form,
        bidang: 'LISTRIK',
        createdAt: new Date().toISOString(),
      };

      await db.execute(
        'INSERT INTO inspections (bidang, data, created_at) VALUES (?, ?, ?)',
        ['LISTRIK', JSON.stringify(payload), new Date().toISOString()],
      );

      Alert.alert('Berhasil', `Laporan ${subAlat} berhasil disimpan!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal simpan data: ' + error.message);
    }
  };

  // Ambil form dinamis berdasarkan subAlat
  const SelectedForm = FormRegistry[subAlat];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBanner}>
        <Text variant="headlineSmall" style={styles.titleHeader}>
          Inspeksi {subAlat}
        </Text>
        <Text style={styles.bidangTag}>BIDANG LISTRIK & PETIR</Text>
      </View>

      {/* Bagian I: Data Umum (Disesuaikan dengan bidang LISTRIK) */}
      <List.Accordion
        title="I. DATA UMUM"
        expanded={expanded.umum}
        onPress={() => setExpanded({ ...expanded, umum: !expanded.umum })}
        left={p => <List.Icon {...p} icon="office-building" color="#eab308" />}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>
            <FormDataUmum
              data={form}
              setData={setForm}
              styles={styles}
              subAlat={subAlat}
              bidang="LISTRIK" // Penting untuk filter field (Sumber daya/Daya)
            />
          </Card.Content>
        </Card>
      </List.Accordion>

      {/* Bagian II: Data Teknis Listrik */}
      <List.Accordion
        title="II. DATA TEKNIS & PENGUKURAN"
        expanded={expanded.teknis}
        onPress={() => setExpanded({ ...expanded, teknis: !expanded.teknis })}
        left={p => <List.Icon {...p} icon="flash-circle" color="#eab308" />}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>
            {SelectedForm ? (
              <SelectedForm
                data={form}
                setData={setForm}
                styles={styles}
                requestPermission={requestCameraPermission}
              />
            ) : (
              <Text style={styles.emptyText}>
                Form {subAlat} belum terdaftar di Registry.
              </Text>
            )}
          </Card.Content>
        </Card>
      </List.Accordion>

      {/* Bagian III: Catatan & Kesimpulan */}
      <List.Accordion
        title="III. CATATAN & KESIMPULAN"
        expanded={expanded.catatan}
        onPress={() => setExpanded({ ...expanded, catatan: !expanded.catatan })}
        left={p => <List.Icon {...p} icon="check-decagram" color="#eab308" />}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>
            <FormCatatan data={form} setData={setForm} styles={styles} />
          </Card.Content>
        </Card>
      </List.Accordion>

      <Button
        mode="contained"
        icon="lightning-bolt"
        onPress={handleSave}
        style={styles.saveButton}
        buttonColor="#eab308"
        textColor="#000" // Kontras hitam di atas kuning
      >
        SIMPAN LAPORAN {subAlat.toUpperCase()}
      </Button>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

// Styles tetap sama dengan kode Anda sebelumnya
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerBanner: {
    backgroundColor: 'white',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  titleHeader: { fontWeight: 'bold', color: '#1e293b' },
  bidangTag: {
    fontSize: 10,
    color: '#eab308',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  accordion: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  innerCard: {
    margin: 10,
    backgroundColor: 'white',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  input: { marginBottom: 12, backgroundColor: 'white' },
  saveButton: { margin: 20, paddingVertical: 8, borderRadius: 12 },
  emptyText: { textAlign: 'center', padding: 20, color: '#64748b' },
  subTitleSection: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#eab308',
  },
});
