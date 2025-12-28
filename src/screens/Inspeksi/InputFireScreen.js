import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Checkbox, Card } from 'react-native-paper';
import { db } from '../../services/db-service';

export default function InputFireScreen({ route, navigation }) {
  const { subAlat } = route.params;

  const [form, setForm] = useState({
    namaPerusahaan: '',
    jenisAlat: 'Forklift',
    noSeri: '',
    kondisiGarpu: false,
    kondisiMast: false,
    sistemRem: false,
    ujiBeban: '',
  });

  const handleSave = () => {
    const payload = { bidang: 'FIRE', ...form };
    db.execute('INSERT INTO inspections (bidang, data) VALUES (?, ?)', [
      'FIRE',
      JSON.stringify(payload),
    ]);
    Alert.alert('Sukses', 'Data FIRE Tersimpan', [
      { text: 'OK', onPress: () => navigation.navigate('MainApp') },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Form Inspeksi: {subAlat}
      </Text>
      <TextInput
        label="Nama Perusahaan"
        value={form.namaPerusahaan}
        onChangeText={t => setForm({ ...form, namaPerusahaan: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Nomor Seri Alat"
        value={form.noSeri}
        onChangeText={t => setForm({ ...form, noSeri: t })}
        mode="outlined"
        style={styles.input}
      />

      <Card style={styles.card}>
        <Card.Title title="Kondisi Alat Damkar" />
        <Checkbox.Item
          label="Tekanan APAR (Area Hijau)"
          status={form.apar ? 'checked' : 'unchecked'}
          onPress={() => setForm({ ...form, apar: !form.apar })}
        />
        <Checkbox.Item
          label="Selang Hydrant Tidak Bocor"
          status={form.hydrant ? 'checked' : 'unchecked'}
          onPress={() => setForm({ ...form, hydrant: !form.hydrant })}
        />
        <Checkbox.Item
          label="Panel Fire Alarm Normal"
          status={form.alarm ? 'checked' : 'unchecked'}
          onPress={() => setForm({ ...form, alarm: !form.alarm })}
        />
      </Card>

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Simpan Laporan PAPA
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5' },
  title: { marginBottom: 20, fontWeight: 'bold', color: '#3b82f6' },
  input: { marginBottom: 12 },
  card: { marginBottom: 20 },
  button: { marginTop: 10, marginBottom: 40 },
});
