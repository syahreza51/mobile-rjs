import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  Button,
  Text,
  Card,
  List,
  TextInput,
  HelperText,
  Divider,
  RadioButton,
} from 'react-native-paper';
import { db } from '../../services/db-service';
// Import Komponen Form
import { FormDataUmum } from '../../components/forms/FormDataUmum';
import { FormForklift } from '../../components/forms/FormForklift';

// --- 1. PINDAHKAN FORM CATATAN KE ATAS AGAR TIDAK ERROR (HOISTING) ---
const FormCatatan = ({ data, setData, styles }) => (
  <View style={styles.catatanContainer}>
    <View style={styles.statusBox}>
      <Text style={styles.statusLabel}>KESIMPULAN AKHIR:</Text>
      <RadioButton.Group
        onValueChange={value => setData({ ...data, statusKelayakan: value })}
        value={data.statusKelayakan || 'LAYAK'}
      >
        <View style={styles.radioRow}>
          <View
            style={[
              styles.radioItem,
              data.statusKelayakan === 'LAYAK' && styles.radioActiveLayak,
            ]}
          >
            <RadioButton value="LAYAK" color="#16a34a" />
            <Text
              style={
                data.statusKelayakan === 'LAYAK'
                  ? styles.textActive
                  : styles.textInactive
              }
            >
              LAYAK
            </Text>
          </View>
          <View
            style={[
              styles.radioItem,
              data.statusKelayakan === 'TIDAK LAYAK' && styles.radioActiveTidak,
            ]}
          >
            <RadioButton value="TIDAK LAYAK" color="#dc2626" />
            <Text
              style={
                data.statusKelayakan === 'TIDAK LAYAK'
                  ? styles.textActive
                  : styles.textInactive
              }
            >
              TIDAK LAYAK
            </Text>
          </View>
        </View>
      </RadioButton.Group>
    </View>

    <Divider style={{ marginVertical: 15 }} />

    <View style={styles.inputGroup}>
      <TextInput
        label="Temuan / Kerusakan"
        multiline
        numberOfLines={4}
        value={data.temuan}
        onChangeText={t => setData({ ...data, temuan: t })}
        mode="outlined"
        style={[styles.input, styles.textArea]}
        outlineStyle={styles.inputOutline}
      />
    </View>

    <View style={styles.inputGroup}>
      <TextInput
        label="Saran / Rekomendasi"
        multiline
        numberOfLines={4}
        value={data.saran}
        onChangeText={t => setData({ ...data, saran: t })}
        mode="outlined"
        style={[styles.input, styles.textArea]}
        outlineStyle={styles.inputOutline}
      />
    </View>
  </View>
);

export default function InputPapaScreen({ route, navigation }) {
  const { subAlat } = route.params;

  // Update state awal agar RadioButton punya nilai default
  const [form, setForm] = useState({
    pemilik: '',
    alamat: '',
    lokasiUnit: '',
    merkModel: '',
    noSeri: '',
    kapasitas: '',
    statusKelayakan: 'LAYAK', // Default value
    temuan: '',
    saran: '',
  });

  const fillDummyData = () => {
    setForm({
      pemilik: 'PT. Maju Jaya Sejahtera',
      alamat: 'Jl. Industri No. 45, Kawasan MM2100, Bekasi',
      lokasiUnit: 'Gudang Logistik Blok C',
      merkModel: 'Toyota 8FD30',
      noSeri: '7FD45-123456-ABC',
      kapasitas: '3000 Kg',
      tinggiAngkat: '5000 mm',
      jenisPenggerak: 'Motor Diesel',
      tahunPembuatan: '2022',
      statusKelayakan: 'LAYAK',
      temuan:
        'Kondisi unit secara visual sangat baik, ban masih tebal, rantai mast tidak ada retakan.',
      saran: 'Lanjutkan perawatan rutin sesuai jadwal 250 jam kerja.',
    });
    Alert.alert('Dummy Loaded', 'Data simulasi berhasil dimasukkan ke form.');
  };

  const [expanded, setExpanded] = useState({
    umum: true,
    teknis: false,
    catatan: false,
  });

  // Fungsi Izin Kamera
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Izin Kamera',
            message: 'Aplikasi membutuhkan izin kamera untuk foto dokumentasi.',
            buttonNeutral: 'Nanti',
            buttonNegative: 'Batal',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handlePress = section => {
    setExpanded({ ...expanded, [section]: !expanded[section] });
  };

  const renderSelectedForm = () => {
    switch (subAlat) {
      case 'Forklift':
        return (
          <FormForklift
            data={form}
            setData={setForm}
            styles={styles}
            requestPermission={requestCameraPermission}
          />
        );
      default:
        return (
          <View style={styles.devContainer}>
            <Text>Form {subAlat} belum tersedia.</Text>
          </View>
        );
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        bidang: 'PAPA',
        subAlat: subAlat,
        tglInspeksi: new Date().toLocaleDateString('id-ID'),
      };

      // Pastikan ada 3 kolom (bidang, data, created_at)
      // dan 3 tanda tanya (?, ?, ?)
      await db.execute(
        'INSERT INTO inspections (bidang, data, created_at) VALUES (?, ?, ?)',
        ['PAPA', JSON.stringify(payload), new Date().toISOString()],
      );

      Alert.alert('Berhasil', 'Data masuk ke riwayat!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      // Jika error "no such column", coba jalankan Reset DB atau ganti nama tabel
      Alert.alert('Error Database', error.message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.titleHeader}>
        Inspeksi {subAlat}
      </Text>

      {/* SECTION 1: DATA UMUM */}
      <List.Accordion
        title="I. DATA UMUM"
        left={props => (
          <List.Icon {...props} icon="office-building" color="#2563eb" />
        )}
        expanded={expanded.umum}
        onPress={() => handlePress('umum')}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>
            <FormDataUmum
              data={form}
              setData={setForm}
              styles={styles}
              subAlat={subAlat}
            />
          </Card.Content>
        </Card>
      </List.Accordion>

      <View style={styles.spacer} />

      {/* SECTION 2: DATA TEKNIS */}
      <List.Accordion
        title="II. DATA TEKNIS & CHECKLIST"
        left={props => <List.Icon {...props} icon="tools" color="#2563eb" />}
        expanded={expanded.teknis}
        onPress={() => handlePress('teknis')}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>{renderSelectedForm()}</Card.Content>
        </Card>
      </List.Accordion>

      <View style={styles.spacer} />

      {/* SECTION 3: CATATAN */}
      <List.Accordion
        title="III. CATATAN & KESIMPULAN"
        left={props => (
          <List.Icon {...props} icon="note-text" color="#2563eb" />
        )}
        expanded={expanded.catatan}
        onPress={() => handlePress('catatan')}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>
            <FormCatatan data={form} setData={setForm} styles={styles} />
          </Card.Content>
        </Card>
      </List.Accordion>
      <Button
        mode="outlined"
        onPress={fillDummyData}
        style={{ marginHorizontal: 20, marginTop: 10, borderColor: '#2563eb' }}
      >
        ISI DATA SIMULASI (DUMMY)
      </Button>
      <Button
        mode="contained"
        icon="content-save-check"
        onPress={handleSave}
        style={styles.saveButton}
      >
        SIMPAN LAPORAN
      </Button>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  titleHeader: {
    padding: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  accordion: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 5,
  },
  accordionTitle: { fontWeight: 'bold', color: '#1e293b' },
  innerCard: {
    margin: 10,
    backgroundColor: 'white',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  input: { marginBottom: 12, backgroundColor: 'white' },
  spacer: { height: 2 },
  saveButton: {
    margin: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    elevation: 4,
  },
  saveButtonLabel: { fontWeight: 'bold', fontSize: 16 },
  subTitle: { fontWeight: 'bold', color: '#475569', marginBottom: 10 },
  statusBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#475569',
    marginBottom: 10,
    textAlign: 'center',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  radioActiveLayak: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  radioActiveTidak: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  textActive: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  textInactive: {
    color: '#64748b',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  inputOutline: {
    borderRadius: 8,
    borderColor: '#cbd5e1',
  },
});
