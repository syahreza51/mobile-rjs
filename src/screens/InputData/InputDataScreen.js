import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image as RNImage,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  useTheme,
  Divider,
  List,
  RadioButton,
  IconButton,
} from 'react-native-paper';
import { db } from '../../services/db-service';

export default function InputDataScreen({ navigation }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState('bidang1');
  const [formData, setFormData] = useState({});
  const [photos, setPhotos] = useState({}); // Untuk menyimpan URI foto

  // --- MOCK DATA 6 BIDANG (Berdasarkan Laporan Forklift RJS) ---
  const MOCK_FIELDS = [
    {
      id: 'bidang1',
      title: 'I. Data Umum Perusahaan',
      icon: 'office-building',
      childs: [
        {
          label: 'Pemilik / Penanggung Jawab',
          key: 'pemilik',
          placeholder: 'PT. Wiguna Lestari Nusa',
        },
        { label: 'Alamat', key: 'alamat', placeholder: 'Jl. Raya Cirebon...' },
        {
          label: 'Lokasi Unit',
          key: 'lokasi_unit',
          placeholder: 'Area Pabrik',
        },
        { label: 'Nama Operator', key: 'operator', placeholder: 'Andi' },
      ],
    },
    {
      id: 'bidang2',
      title: 'II. Data Teknis Pesawat',
      icon: 'engine',
      childs: [
        {
          label: 'Pabrik Pembuat',
          key: 'pabrikan',
          placeholder: 'Toyota Industries',
        },
        {
          label: 'Model / Type',
          key: 'model',
          placeholder: 'Toyota / 62-8FD30',
        },
        {
          label: 'Nomor Seri / No. Unit',
          key: 'no_seri',
          placeholder: '608FDJ35 / F-02',
        },
        { label: 'Kapasitas (SWL)', key: 'kapasitas', placeholder: '3000 Kg' },
        { label: 'Tahun Pembuatan', key: 'tahun', placeholder: '2023' },
      ],
    },
    {
      id: 'bidang3',
      title: 'III. Pemeriksaan Visual & Kondisi',
      icon: 'camera',
      childs: [
        { label: 'Kondisi Rangka / Chassis', key: 'rangka', type: 'visual' },
        { label: 'Tiang Angkat (Mast)', key: 'mast', type: 'visual' },
        { label: 'Garpu (Forks)', key: 'forks', type: 'visual' },
        { label: 'Rantai Angkat', key: 'rantai', type: 'visual' },
      ],
    },
    {
      id: 'bidang4',
      title: 'IV. Sistem Penggerak & Ban',
      icon: 'tire',
      childs: [
        { label: 'Motor Diesel / Penggerak', key: 'motor', type: 'visual' },
        { label: 'Kondisi Ban Depan/Belakang', key: 'ban', type: 'visual' },
        { label: 'Sistem Rem', key: 'rem', type: 'visual' },
      ],
    },
    {
      id: 'bidang5',
      title: 'V. Pengujian Dinamis',
      icon: 'run-fast',
      childs: [
        {
          label: 'Uji Angkat Beban (Kg)',
          key: 'uji_angkat',
          placeholder: '2500 Kg',
        },
        { label: 'Fungsi Hidrolik Tilt/Lift', key: 'hidrolik', type: 'choice' },
        { label: 'Safety Device (Sirine/Lamp)', key: 'safety', type: 'choice' },
      ],
    },
    {
      id: 'bidang6',
      title: 'VI. Kesimpulan & Saran',
      icon: 'check-decagram',
      childs: [
        {
          label: 'Hasil Akhir',
          key: 'kesimpulan',
          placeholder: 'MEMENUHI SYARAT K3',
        },
        {
          label: 'Saran / Rekomendasi',
          key: 'saran',
          placeholder: 'Lakukan pemeriksaan berkala...',
          multiline: true,
        },
      ],
    },
  ];

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleTakePhoto = key => {
    // Simulasi pengambilan gambar
    Alert.alert('Kamera', `Membuka kamera untuk dokumentasi ${key}...`);
    setPhotos({ ...photos, [key]: 'https://via.placeholder.com/150' });
  };

  const handleSaveToLocal = () => {
    console.log('Tombol diklik');

    // 1. Validasi minimal: Cek apakah formData ada isinya
    if (!formData || Object.keys(formData).length === 0 || !formData.pemilik) {
      Alert.alert(
        'Data Kosong',
        'Silakan isi minimal Nama Pemilik (Bidang I) sebelum menyimpan.',
      );
      setExpanded('bidang1');
      return;
    }

    try {
      console.log('Data yang akan disimpan:', formData);

      // 2. Stringify data
      // Kita tambahkan juga data foto ke dalam JSON agar ikut tersimpan
      const fullData = {
        ...formData,
        photos: photos, // Simpan referensi URI foto
      };
      const dataString = JSON.stringify(fullData);

      // 3. Eksekusi SQL
      // Pastikan nama tabel adalah 'inspections' (sesuai App.js)
      // Gunakan try-catch khusus untuk eksekusi
      const result = db.execute('INSERT INTO inspections (data) VALUES (?)', [
        dataString,
      ]);

      // 4. Cek hasil eksekusi
      // Pada quick-sqlite, result mengembalikan object { rowsAffected, insertId }
      if (result && result.rowsAffected > 0) {
        Alert.alert(
          'Sukses Tersimpan',
          'Laporan berhasil disimpan ke database lokal.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form atau pindah ke Riwayat
                navigation.navigate('MainApp', { screen: 'Riwayat' });
              },
            },
          ],
        );
      } else {
        throw new Error('Gagal menyisipkan data ke database.');
      }
    } catch (error) {
      console.error('CRITICAL SQLITE ERROR:', error);

      // Jika error karena tabel tidak ada, ingatkan user untuk restart/reinstall
      if (error.message.includes('no such table')) {
        Alert.alert(
          'Database Error',
          'Tabel database tidak ditemukan. Silakan hapus (uninstall) aplikasi dan install kembali untuk mereset database.',
        );
      } else {
        Alert.alert('Gagal Simpan', 'Detail Error: ' + error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Form */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <View>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Form Inspeksi Forklift
          </Text>
          <Text style={styles.headerSubtitle}>
            Input Data & Dokumentasi Visual
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <List.Section>
          {MOCK_FIELDS.map(field => (
            <List.Accordion
              key={field.id}
              title={field.title}
              left={props => <List.Icon {...props} icon={field.icon} />}
              expanded={expanded === field.id}
              onPress={() =>
                setExpanded(expanded === field.id ? null : field.id)
              }
              style={styles.accordion}
            >
              <Card style={styles.cardInner}>
                <Card.Content>
                  {field.childs.map(child => (
                    <View key={child.key} style={styles.inputWrapper}>
                      <Text style={styles.label}>{child.label}</Text>

                      {/* Tipe 1: Dokumentasi Visual (Radio + Kamera) */}
                      {child.type === 'visual' ? (
                        <View>
                          <View style={styles.radioGroup}>
                            <View style={styles.radioItem}>
                              <RadioButton
                                value="Baik"
                                status={
                                  formData[child.key] === 'Baik'
                                    ? 'checked'
                                    : 'unchecked'
                                }
                                onPress={() =>
                                  handleInputChange(child.key, 'Baik')
                                }
                              />
                              <Text>Baik</Text>
                            </View>
                            <View style={styles.radioItem}>
                              <RadioButton
                                value="Buruk"
                                status={
                                  formData[child.key] === 'Buruk'
                                    ? 'checked'
                                    : 'unchecked'
                                }
                                onPress={() =>
                                  handleInputChange(child.key, 'Buruk')
                                }
                              />
                              <Text>Buruk</Text>
                            </View>
                          </View>

                          <View style={styles.photoArea}>
                            {photos[child.key] ? (
                              <View style={styles.previewBox}>
                                <RNImage
                                  source={{ uri: photos[child.key] }}
                                  style={styles.imagePreview}
                                />
                                <IconButton
                                  icon="close-circle"
                                  iconColor="red"
                                  onPress={() =>
                                    setPhotos({ ...photos, [child.key]: null })
                                  }
                                />
                              </View>
                            ) : (
                              <Button
                                icon="camera"
                                mode="outlined"
                                onPress={() => handleTakePhoto(child.key)}
                                style={styles.btnCamera}
                              >
                                Ambil Foto
                              </Button>
                            )}
                          </View>
                          <Divider style={styles.divider} />
                        </View>
                      ) : child.type === 'choice' ? (
                        /* Tipe 2: Hanya Pilihan */
                        <View style={styles.radioGroup}>
                          <View style={styles.radioItem}>
                            <RadioButton
                              value="OK"
                              status={
                                formData[child.key] === 'OK'
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onPress={() => handleInputChange(child.key, 'OK')}
                            />
                            <Text>OK</Text>
                          </View>
                          <View style={styles.radioItem}>
                            <RadioButton
                              value="Not OK"
                              status={
                                formData[child.key] === 'Not OK'
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onPress={() =>
                                handleInputChange(child.key, 'Not OK')
                              }
                            />
                            <Text>Not OK</Text>
                          </View>
                        </View>
                      ) : (
                        /* Tipe 3: Text Input */
                        <TextInput
                          mode="outlined"
                          placeholder={child.placeholder}
                          value={formData[child.key]}
                          onChangeText={val =>
                            handleInputChange(child.key, val)
                          }
                          multiline={child.multiline}
                          numberOfLines={child.multiline ? 3 : 1}
                          dense
                          style={styles.textInput}
                        />
                      )}
                    </View>
                  ))}
                </Card.Content>
              </Card>
            </List.Accordion>
          ))}
        </List.Section>

        <Button
          mode="contained"
          onPress={() => handleSaveToLocal()}
          style={styles.saveButton}
          icon="content-save-check"
          contentStyle={{ height: 50 }}
        >
          SIMPAN LAPORAN
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginLeft: -10, marginRight: 5 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  headerSubtitle: { color: '#dbeafe', fontSize: 12 },
  scrollContent: { paddingBottom: 30 },
  accordion: { backgroundColor: 'white', marginBottom: 2, elevation: 1 },
  cardInner: {
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 0,
    borderLeftWidth: 5,
    borderLeftColor: '#2563eb',
  },
  inputWrapper: { marginBottom: 12 },
  label: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textInput: { backgroundColor: 'white' },
  radioGroup: { flexDirection: 'row', gap: 15, marginVertical: 5 },
  radioItem: { flexDirection: 'row', alignItems: 'center' },
  photoArea: { marginTop: 8 },
  btnCamera: { borderStyle: 'dashed', borderRadius: 8 },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 5,
  },
  imagePreview: { width: 60, height: 45, borderRadius: 5 },
  divider: { marginTop: 15, height: 1, backgroundColor: '#e2e8f0' },
  saveButton: { margin: 20, borderRadius: 12, elevation: 4 },
});
