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

export default function InputPubtScreen({ route, navigation }) {
  const { subAlat } = route.params;

  // State awal disesuaikan dengan key 'pemilik' di FormDataUmum
  const [form, setForm] = useState({
    pemilik: '',
    alamat: '',
    lokasiUnit: '',
    statusKelayakan: 'LAYAK',
    bidang: 'PUBT',
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

  // Handler Simpan Data ke SQLite khusus PUBT
  const handleSave = async () => {
    // Validasi field 'pemilik' sesuai update FormDataUmum
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
        bidang: 'PUBT',
        createdAt: new Date().toISOString(),
      };

      await db.execute(
        'INSERT INTO inspections (bidang, data, created_at) VALUES (?, ?, ?)',
        ['PUBT', JSON.stringify(payload), new Date().toISOString()],
      );

      Alert.alert('Berhasil', `Laporan ${subAlat} berhasil disimpan!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal simpan: ' + error.message);
    }
  };

  // Ambil form dinamis (FormBoiler, FormBejanaTekan, dll)
  const SelectedForm = FormRegistry[subAlat];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBanner}>
        <Text variant="headlineSmall" style={styles.titleHeader}>
          Inspeksi {subAlat}
        </Text>
        <Text style={styles.bidangTag}>BIDANG UAP BEJANA TEKAN</Text>
      </View>

      {/* Bagian I: Data Umum (Cerdas: Filter Bidang PUBT) */}
      <List.Accordion
        title="I. DATA UMUM"
        expanded={expanded.umum}
        onPress={() => setExpanded({ ...expanded, umum: !expanded.umum })}
        left={p => <List.Icon {...p} icon="office-building" color="#dc2626" />}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>
            <FormDataUmum
              data={form}
              setData={setForm}
              styles={styles}
              subAlat={subAlat}
              bidang="PUBT" // Menampilkan Merk, No Seri, Pabrikan, Kapasitas, & Riwayat
            />
          </Card.Content>
        </Card>
      </List.Accordion>

      {/* Bagian II: Data Teknis PUBT */}
      <List.Accordion
        title="II. DATA TEKNIS & PEMERIKSAAN"
        expanded={expanded.teknis}
        onPress={() => setExpanded({ ...expanded, teknis: !expanded.teknis })}
        left={p => <List.Icon {...p} icon="engine-outline" color="#dc2626" />}
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
                Form {subAlat} belum tersedia di Registry.
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
        left={p => <List.Icon {...p} icon="clipboard-check" color="#dc2626" />}
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
        icon="shield-check"
        onPress={handleSave}
        style={styles.saveButton}
        buttonColor="#dc2626"
      >
        SIMPAN LAPORAN {subAlat.toUpperCase()}
      </Button>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

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
    color: '#dc2626',
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
    color: '#dc2626',
  },
});
