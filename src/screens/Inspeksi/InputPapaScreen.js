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

export default function InputPapaScreen({ route, navigation }) {
  const { subAlat } = route.params;

  // State konsisten menggunakan 'pemilik' untuk validasi universal
  const [form, setForm] = useState({
    pemilik: '',
    alamat: '',
    lokasiUnit: '',
    statusKelayakan: 'LAYAK',
    bidang: 'PAPA',
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
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    // Validasi field 'pemilik' agar sinkron dengan FormDataUmum
    if (!form.pemilik) {
      Alert.alert(
        'Peringatan',
        'Mohon isi Nama Pemilik / Perusahaan di Data Umum',
      );
      return;
    }

    try {
      const payload = {
        ...form,
        bidang: 'PAPA',
        createdAt: new Date().toISOString(),
      };

      await db.execute(
        'INSERT INTO inspections (bidang, data, created_at) VALUES (?, ?, ?)',
        ['PAPA', JSON.stringify(payload), new Date().toISOString()],
      );

      Alert.alert('Berhasil', `Laporan ${subAlat} berhasil disimpan!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan data: ' + error.message);
    }
  };

  const SelectedForm = FormRegistry[subAlat];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBanner}>
        <Text variant="headlineSmall" style={styles.titleHeader}>
          Inspeksi {subAlat}
        </Text>
        <Text style={styles.bidangTag}>BIDANG PESAWAT ANGKAT & ANGKUT</Text>
      </View>

      {/* Bagian I: Data Umum (Disesuaikan untuk PAPA) */}
      <List.Accordion
        title="I. DATA UMUM"
        expanded={expanded.umum}
        onPress={() => setExpanded({ ...expanded, umum: !expanded.umum })}
        left={p => <List.Icon {...p} icon="office-building" color="#2563eb" />}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>
            <FormDataUmum
              data={form}
              setData={setForm}
              styles={styles}
              subAlat={subAlat}
              bidang="PAPA" // Menampilkan detail manufaktur & kapasitas
            />
          </Card.Content>
        </Card>
      </List.Accordion>

      {/* Bagian II: Data Teknis & Checklist Dinamis */}
      <List.Accordion
        title="II. DATA TEKNIS & CHECKLIST"
        expanded={expanded.teknis}
        onPress={() => setExpanded({ ...expanded, teknis: !expanded.teknis })}
        left={p => <List.Icon {...p} icon="tools" color="#2563eb" />}
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
                Formulir untuk {subAlat} belum dikonfigurasi.
              </Text>
            )}
          </Card.Content>
        </Card>
      </List.Accordion>

      {/* Bagian III: Kesimpulan Laporan */}
      <List.Accordion
        title="III. CATATAN & KESIMPULAN"
        expanded={expanded.catatan}
        onPress={() => setExpanded({ ...expanded, catatan: !expanded.catatan })}
        left={p => <List.Icon {...p} icon="note-text" color="#2563eb" />}
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
        icon="content-save-check"
        onPress={handleSave}
        style={styles.saveButton}
        labelStyle={{ fontWeight: 'bold' }}
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
    elevation: 2,
  },
  titleHeader: { fontWeight: 'bold', color: '#1e293b' },
  bidangTag: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  accordion: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  innerCard: {
    margin: 10,
    backgroundColor: 'white',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  input: { marginBottom: 12, backgroundColor: 'white' },
  saveButton: {
    margin: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    elevation: 4,
  },
  emptyText: { textAlign: 'center', padding: 20, color: '#64748b' },
  // Shared Styles
  catatanContainer: { paddingVertical: 5 },
  statusBox: { backgroundColor: '#f1f5f9', padding: 12, borderRadius: 10 },
  statusLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 10,
  },
  radioRow: { flexDirection: 'row', justifyContent: 'space-around' },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  radioActiveLayak: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  radioActiveTidak: { borderColor: '#dc2626', backgroundColor: '#fef2f2' },
  textActive: { fontWeight: 'bold', color: '#1e293b' },
  textInactive: { color: '#64748b' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  inputOutline: { borderRadius: 8, borderColor: '#cbd5e1' },
  subTitleSection: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#2563eb',
  },
});
