import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Checkbox,
  Card,
  Divider,
} from 'react-native-paper';
import { db } from '../../services/db-service';

export default function InputPtpScreen({ route, navigation }) {
  const { subAlat } = route.params || { subAlat: 'Motor Diesel' };

  const [form, setForm] = useState({
    // DATA UMUM
    pemilik: 'PT. SUN STAR PRIMA MOTOR',
    alamat: 'Jl. Raya Tajur No. 62, Pakuan, Kec. Bogor Selatan, Kota Bogor',
    lokasiUnit: 'Ruang Genset',
    merkModel: 'Cummins / 6BT5.9-G2',
    noSeri: '78727510',
    kapasitas: '100 kVA',

    // DATA TEKNIS - ENGINE
    engineMerk: 'Cummins / 6BT5.9-G2',
    engineTahun: '2018',
    engineDaya: '100 kVA',
    engineSilinder: '6',

    // DATA TEKNIS - GENERATOR
    genMerk: 'Stamford / UC.I274C14',
    genNoSeri: 'X18I383516',
    genTegangan: '380 V',
    genFrekuensi: '50 Hz',
    genPutaran: '1500 rpm',

    // CHECKLIST RIKSA UJI (Kondisi Baik/Buruk)
    kondisiPondasi: true,
    kondisiTangkiHarian: true,
    kondisiOli: true,
    kondisiAccu: true,
    kondisiRadiator: true,
    kondisiKipas: true,
    kondisiMuffler: true,

    // HASIL PENGUKURAN
    grounding: '19', // Nilai Ohm
    kebisingan: '85', // Nilai dB
    pencahayaan: '78', // Nilai Lux
  });

  const handleSave = () => {
    // Gabungkan semua data ke dalam satu objek payload
    const payload = {
      bidang: 'PTP',
      subAlat: subAlat,
      ...form,
      tglInspeksi: new Date().toLocaleDateString('id-ID'),
      timestamp: new Date().getTime(),
    };

    try {
      // Pastikan query ini sesuai dengan struktur tabel Anda
      // Jika tabel Anda hanya punya kolom (id, created_at, data), gunakan query bawah ini:
      db.execute('INSERT INTO inspections (data) VALUES (?)', [
        JSON.stringify(payload),
      ]);

      Alert.alert('Sukses', `Laporan ${subAlat} Berhasil Disimpan`, [
        { text: 'OK', onPress: () => navigation.navigate('MainApp') },
      ]);
    } catch (err) {
      console.error('Detail Error Simpan:', err);
      Alert.alert('Error', 'Gagal menyimpan: ' + err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Form Riksa Uji {subAlat}
      </Text>

      {/* SEKSI 1: DATA UMUM */}
      <Card style={styles.card}>
        <Card.Title title="I. DATA UMUM" />
        <Card.Content>
          <TextInput
            label="Pemilik / Pengguna"
            value={form.pemilik}
            onChangeText={t => setForm({ ...form, pemilik: t })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Lokasi Unit"
            value={form.lokasiUnit}
            onChangeText={t => setForm({ ...form, lokasiUnit: t })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Nomor Seri"
            value={form.noSeri}
            onChangeText={t => setForm({ ...form, noSeri: t })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Kapasitas (kVA)"
            value={form.kapasitas}
            keyboardType="numeric"
            onChangeText={t => setForm({ ...form, kapasitas: t })}
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* SEKSI 2: DATA TEKNIS ENGINE */}
      <Card style={styles.card}>
        <Card.Title title="II. DATA TEKNIS ENGINE" />
        <Card.Content>
          <TextInput
            label="Merk / Model Engine"
            value={form.engineMerk}
            onChangeText={t => setForm({ ...form, engineMerk: t })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Jumlah Silinder"
            value={form.engineSilinder}
            keyboardType="numeric"
            onChangeText={t => setForm({ ...form, engineSilinder: t })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Daya Engine"
            value={form.engineDaya}
            onChangeText={t => setForm({ ...form, engineDaya: t })}
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* SEKSI 3: CHECKLIST KOMPONEN */}
      <Card style={styles.card}>
        <Card.Title title="III. CHECKLIST KOMPONEN" />
        <Card.Content>
          <Checkbox.Item
            label="Pondasi Dasar (Baik)"
            status={form.kondisiPondasi ? 'checked' : 'unchecked'}
            onPress={() =>
              setForm({ ...form, kondisiPondasi: !form.kondisiPondasi })
            }
          />
          <Checkbox.Item
            label="Sistem Pelumasan / Oli (Baik)"
            status={form.kondisiOli ? 'checked' : 'unchecked'}
            onPress={() => setForm({ ...form, kondisiOli: !form.kondisiOli })}
          />
          <Checkbox.Item
            label="Sistem Pendingin / Radiator (Baik)"
            status={form.kondisiRadiator ? 'checked' : 'unchecked'}
            onPress={() =>
              setForm({ ...form, kondisiRadiator: !form.kondisiRadiator })
            }
          />
          <Checkbox.Item
            label="Sistem Bahan Bakar (Baik)"
            status={form.kondisiTangkiHarian ? 'checked' : 'unchecked'}
            onPress={() =>
              setForm({
                ...form,
                kondisiTangkiHarian: !form.kondisiTangkiHarian,
              })
            }
          />
          <Checkbox.Item
            label="Kutub Baterai / Accu (Baik)"
            status={form.kondisiAccu ? 'checked' : 'unchecked'}
            onPress={() => setForm({ ...form, kondisiAccu: !form.kondisiAccu })}
          />
        </Card.Content>
      </Card>

      {/* SEKSI 4: HASIL PENGUKURAN */}
      <Card style={styles.card}>
        <Card.Title title="IV. HASIL PENGUKURAN" />
        <Card.Content>
          <TextInput
            label="Resistansi Pembumian (Ohm)"
            value={form.grounding}
            placeholder="Max 5 Ohm"
            keyboardType="numeric"
            onChangeText={t => setForm({ ...form, grounding: t })}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Affix text="Ω" />}
          />
          <TextInput
            label="Tingkat Kebisingan (dB)"
            value={form.kebisingan}
            keyboardType="numeric"
            onChangeText={t => setForm({ ...form, kebisingan: t })}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Affix text="dB" />}
          />
          <TextInput
            label="Intensitas Cahaya (Lux)"
            value={form.pencahayaan}
            keyboardType="numeric"
            onChangeText={t => setForm({ ...form, pencahayaan: t })}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Affix text="Lux" />}
          />
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Simpan Laporan Motor Diesel
      </Button>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f1f5f9' },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#7c3aed',
    textAlign: 'center',
  },
  card: { marginBottom: 15, borderRadius: 12 },
  input: { marginBottom: 10, backgroundColor: 'white' },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#7c3aed',
  },
});
