import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormPenangkalPetir = ({
  data,
  setData,
  styles,
  requestPermission,
}) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: SPESIFIKASI SISTEM */}
      <List.Accordion
        title="1. Spesifikasi Sistem"
        left={p => <List.Icon {...p} icon="lightning-bolt" color="#eab308" />}
      >
        <TextInput
          label="Merk / Tipe Head (Splitzen)"
          placeholder="Contoh: Viking / Kurn / Thomas"
          value={data.jenisPetir}
          onChangeText={t => setData({ ...data, jenisPetir: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tinggi Mast / Pole (Meter)"
          keyboardType="numeric"
          value={data.tinggiMast}
          onChangeText={t => setData({ ...data, tinggiMast: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Radius Proteksi (Meter)"
          keyboardType="numeric"
          value={data.radius}
          onChangeText={t => setData({ ...data, radius: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Jenis Kabel Penyalur"
          placeholder="Contoh: NYY 1x70mm / Coaxial"
          value={data.jenisKabelPenyalur}
          onChangeText={t => setData({ ...data, jenisKabelPenyalur: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: KONDISI FISIK & INSTALASI */}
      <List.Accordion
        title="2. Kondisi Fisik (Visual)"
        left={p => <List.Icon {...p} icon="eye-check" color="#eab308" />}
      >
        <Checkbox.Item
          label="Kondisi Air Terminal (Tidak Korosi)"
          status={data.chkSplitzen === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSplitzen')}
          mode="android"
        />
        <Checkbox.Item
          label="Kekencangan Klem Sambungan"
          status={data.chkKlem === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkKlem')}
          mode="android"
        />
        <Checkbox.Item
          label="Kondisi Isolator Mast"
          status={data.chkIsolator === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkIsolator')}
          mode="android"
        />
        <Checkbox.Item
          label="Integritas Down Conductor (Kabel)"
          status={data.chkKabelPenyalur === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkKabelPenyalur')}
          mode="android"
        />
        <Checkbox.Item
          label="Kondisi Bak Kontrol & Joint Test"
          status={data.chkBakKontrol === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBakKontrol')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: HASIL PENGUKURAN TEKNIS */}
      <List.Accordion
        title="3. Pengukuran & Proteksi"
        left={p => <List.Icon {...p} icon="calculator" color="#eab308" />}
      >
        <TextInput
          label="Nilai Tahanan Pembumian (Ω)"
          placeholder="Wajib < 5 Ohm"
          keyboardType="numeric"
          value={data.nilaiOhm}
          onChangeText={t => setData({ ...data, nilaiOhm: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Counter Petir (Angka Terakhir)"
          keyboardType="numeric"
          value={data.lightningCounter}
          onChangeText={t => setData({ ...data, lightningCounter: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kondisi Cuaca Saat Tes"
          placeholder="Cerah / Hujan"
          value={data.cuaca}
          onChangeText={t => setData({ ...data, cuaca: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: DOKUMENTASI FOTO */}
      <List.Accordion
        title="4. Dokumentasi Foto"
        left={p => <List.Icon {...p} icon="camera" />}
      >
        <PhotoManager
          photos={data.dokumentasi || []}
          onPhotosChange={newPhotos =>
            setData({ ...data, dokumentasi: newPhotos })
          }
          requestPermission={requestPermission}
        />
      </List.Accordion>
    </View>
  );
};
