import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

export const FormDataUmum = ({ data, setData, styles, subAlat, bidang }) => {
  // Fungsi helper untuk update state
  const updateField = (key, value) => setData({ ...data, [key]: value });

  return (
    <View>
      <TextInput
        label="1. Pemilik / Pengguna"
        value={data.pemilik}
        onChangeText={t => updateField('pemilik', t)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="2. Alamat"
        value={data.alamat}
        multiline
        onChangeText={t => updateField('alamat', t)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="3. Lokasi Unit"
        value={data.lokasiUnit}
        onChangeText={t => updateField('lokasiUnit', t)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="4. Jenis Pesawat"
        value={subAlat}
        editable={false}
        mode="outlined"
        style={[styles.input, { backgroundColor: '#f1f5f9' }]}
      />

      {/* FIELD DINAMIS BERDASARKAN BIDANG */}

      {/* Bidang Berat: LIFT, PTP, PAPA, PUBT butuh detail manufaktur */}
      {(bidang === 'LIFT' ||
        bidang === 'PTP' ||
        bidang === 'PAPA' ||
        bidang === 'PUBT') && (
        <>
          <TextInput
            label="5. Merk / Model"
            value={data.merkModel}
            onChangeText={t => updateField('merkModel', t)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="6. No. Seri"
            value={data.noSeri}
            onChangeText={t => updateField('noSeri', t)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="7. Kapasitas"
            value={data.kapasitas}
            onChangeText={t => updateField('kapasitas', t)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="8. No. Izin Pemakaian (SIA/SIO)"
            value={data.noIzin}
            onChangeText={t => updateField('noIzin', t)}
            mode="outlined"
            style={styles.input}
          />
        </>
      )}

      {/* Khusus Bidang FIRE (APAR / Hydrant) - Form lebih simpel */}
      {bidang === 'FIRE' && (
        <>
          <TextInput
            label="5. Kode / Nomor APAR/Hydrant"
            value={data.noSeri}
            onChangeText={t => updateField('noSeri', t)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="6. Media (Powder/CO2/Air)"
            value={data.media}
            onChangeText={t => updateField('media', t)}
            mode="outlined"
            style={styles.input}
          />
        </>
      )}

      {/* Khusus LISTRIK */}
      {bidang === 'LISTRIK' && (
        <>
          <TextInput
            label="5. Sumber Daya (PLN/Genset)"
            value={data.sumberDaya}
            onChangeText={t => updateField('sumberDaya', t)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="6. Daya Tersambung (kVA)"
            value={data.daya}
            onChangeText={t => updateField('daya', t)}
            mode="outlined"
            style={styles.input}
          />
        </>
      )}

      {/* Field Penutup yang umum untuk semua */}
      <TextInput
        label="Penanggung Jawab Lapangan"
        value={data.pj}
        onChangeText={t => updateField('pj', t)}
        mode="outlined"
        style={styles.input}
      />
    </View>
  );
};
