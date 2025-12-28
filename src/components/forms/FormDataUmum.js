import React from 'react';
import { View } from 'react-native';
import { TextInput, Divider, Text } from 'react-native-paper';

export const FormDataUmum = ({ data, setData, styles, subAlat }) => {
  return (
    <View>
      <TextInput
        label="1. Pemilik / Pengguna"
        value={data.pemilik}
        onChangeText={t => setData({ ...data, pemilik: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="2. Alamat"
        value={data.alamat}
        multiline
        onChangeText={t => setData({ ...data, alamat: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="3. Penanggung Jawab"
        value={data.pj}
        onChangeText={t => setData({ ...data, pj: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="4. Lokasi Unit"
        value={data.lokasiUnit}
        onChangeText={t => setData({ ...data, lokasiUnit: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="5. Jenis Pesawat"
        value={subAlat}
        editable={false}
        mode="outlined"
        style={[styles.input, { backgroundColor: '#e2e8f0' }]}
      />
      <TextInput
        label="6. Merk / Model"
        value={data.merkModel}
        onChangeText={t => setData({ ...data, merkModel: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="7. No. Seri"
        value={data.noSeri}
        onChangeText={t => setData({ ...data, noSeri: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="8. Perusahaan Pembuat"
        value={data.pabrikan}
        onChangeText={t => setData({ ...data, pabrikan: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="9. Lokasi / Tahun Buat"
        value={data.tahunBuat}
        onChangeText={t => setData({ ...data, tahunBuat: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="10. Kapasitas"
        value={data.kapasitas}
        onChangeText={t => setData({ ...data, kapasitas: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="11. Digunakan Untuk"
        value={data.peruntukan}
        onChangeText={t => setData({ ...data, peruntukan: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="12. Klasifikasi (Stationer/Portable)"
        value={data.klasifikasi}
        onChangeText={t => setData({ ...data, klasifikasi: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="13. No. Izin Pemakaian"
        value={data.noIzin}
        onChangeText={t => setData({ ...data, noIzin: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="14. Nama Operator"
        value={data.operator}
        onChangeText={t => setData({ ...data, operator: t })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="15. Data Riwayat"
        value={data.riwayat}
        onChangeText={t => setData({ ...data, riwayat: t })}
        mode="outlined"
        style={styles.input}
      />
    </View>
  );
};
