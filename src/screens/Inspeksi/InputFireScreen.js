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

// Import Komponen dari Central Registry
import {
  FormRegistry,
  FormDataUmum,
  FormCatatan,
} from '../../components/forms';

export default function InputFireScreen({ route, navigation }) {
  const { subAlat } = route.params;

  // State awal disesuaikan dengan key 'pemilik' di FormDataUmum
  const [form, setForm] = useState({
    pemilik: '', // Perubahan dari namaPerusahaan ke pemilik
    alamat: '',
    lokasiUnit: '',
    statusKelayakan: 'LAYAK',
    bidang: 'FIRE',
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

  // Izin Akses Kamera
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          // Update untuk Android 13+ menggunakan READ_MEDIA_IMAGES jika perlu
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

  const handleSave = async () => {
    // Validasi menggunakan field 'pemilik'
    if (!form.pemilik) {
      Alert.alert('Peringatan', 'Nama Pemilik / Perusahaan wajib diisi');
      return;
    }

    try {
      const payload = {
        ...form,
        bidang: 'FIRE',
        createdAt: new Date().toISOString(),
      };

      await db.execute(
        'INSERT INTO inspections (bidang, data, created_at) VALUES (?, ?, ?)',
        ['FIRE', JSON.stringify(payload), new Date().toISOString()],
      );

      Alert.alert('Sukses', `Laporan ${subAlat} Berhasil Disimpan`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan data: ' + error.message);
    }
  };

  // Pilih form teknis berdasarkan subAlat
  const SelectedForm = FormRegistry[subAlat];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner Merah */}
      <View style={styles.headerBanner}>
        <Text variant="headlineSmall" style={styles.titleHeader}>
          Inspeksi {subAlat}
        </Text>
        <Text style={styles.bidangTag}>BIDANG PROTEKSI KEBAKARAN</Text>
      </View>

      {/* Bagian I: Data Umum */}
      <List.Accordion
        title="I. DATA UMUM"
        expanded={expanded.umum}
        onPress={() => setExpanded({ ...expanded, umum: !expanded.umum })}
        left={p => <List.Icon {...p} icon="office-building" color="#ef4444" />}
        style={styles.accordion}
      >
        <Card style={styles.innerCard}>
          <Card.Content>
            <FormDataUmum
              data={form}
              setData={setForm}
              styles={styles}
              subAlat={subAlat}
              bidang="FIRE" // Prop krusial agar form tampil ringkas (hanya APAR/Hydrant)
            />
          </Card.Content>
        </Card>
      </List.Accordion>

      {/* Bagian II: Data Teknis Pemadam */}
      <List.Accordion
        title="II. PEMERIKSAAN TEKNIS"
        expanded={expanded.teknis}
        onPress={() => setExpanded({ ...expanded, teknis: !expanded.teknis })}
        left={p => (
          <List.Icon {...p} icon="fire-extinguisher" color="#ef4444" />
        )}
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

      {/* Bagian III: Kesimpulan Laporan */}
      <List.Accordion
        title="III. CATATAN & KESIMPULAN"
        expanded={expanded.catatan}
        onPress={() => setExpanded({ ...expanded, catatan: !expanded.catatan })}
        left={p => <List.Icon {...p} icon="clipboard-check" color="#ef4444" />}
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
        buttonColor="#ef4444"
      >
        SIMPAN LAPORAN {subAlat.toUpperCase()}
      </Button>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

// ... styles tetap sama seperti sebelumnya
