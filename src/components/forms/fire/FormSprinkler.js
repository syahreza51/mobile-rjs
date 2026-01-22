import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormSprinkler = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: SPESIFIKASI HEAD SPRINKLER */}
      <List.Accordion
        title="1. Spesifikasi Head Sprinkler"
        left={p => <List.Icon {...p} icon="sprinkler" color="#ef4444" />}
      >
        <TextInput
          label="Jenis Head (Pendent/Upright/Sidewall)"
          value={data.jenisHead}
          onChangeText={t => setData({ ...data, jenisHead: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Suhu Aktivasi (°C)"
          placeholder="Contoh: 68°C (Merah)"
          value={data.suhuAktivasi}
          onChangeText={t => setData({ ...data, suhuAktivasi: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Jumlah Head Terpasang (Estimasi)"
          keyboardType="numeric"
          value={data.jumlahHead}
          onChangeText={t => setData({ ...data, jumlahHead: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: PEMERIKSAAN VISUAL HEAD & PIPA */}
      <List.Accordion
        title="2. Kondisi Fisik Jaringan"
        left={p => <List.Icon {...p} icon="pipe" color="#ef4444" />}
      >
        <Checkbox.Item
          label="Head Bersih (Tanpa Cat/Debu Tebal)"
          status={data.chkHeadClean === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkHeadClean')}
          mode="android"
        />
        <Checkbox.Item
          label="Bulb Gelas Utuh (Tidak Pecah)"
          status={data.chkBulb === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBulb')}
          mode="android"
        />
        <Checkbox.Item
          label="Pipa Jaringan (Tidak Bocor/Korosi)"
          status={data.chkPipa === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPipa')}
          mode="android"
        />
        <Checkbox.Item
          label="Gantungan Pipa (Hanger) Kokoh"
          status={data.chkHanger === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkHanger')}
          mode="android"
        />
        <Checkbox.Item
          label="Jarak Tumpukan Barang (> 45cm)"
          status={data.chkClearance === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkClearance')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: KONTROL VALVE & INSTRUMEN */}
      <List.Accordion
        title="3. Alarm Check Valve (ACV)"
        left={p => <List.Icon {...p} icon="form-select" color="#ef4444" />}
      >
        <TextInput
          label="Tekanan Pipa Utama (Bar)"
          keyboardType="numeric"
          value={data.pressUtama}
          onChangeText={t => setData({ ...data, pressUtama: t })}
          mode="outlined"
          style={styles.input}
        />
        <Checkbox.Item
          label="Main Control Valve (Posisi Terbuka)"
          status={data.chkMcvOpen === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMcvOpen')}
          mode="android"
        />
        <Checkbox.Item
          label="Water Motor Gong (Berfungsi)"
          status={data.chkWmg === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkWmg')}
          mode="android"
        />
        <Checkbox.Item
          label="Flow Switch (Koneksi ke Fire Alarm)"
          status={data.chkFlowSwitch === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkFlowSwitch')}
          mode="android"
        />
        <Checkbox.Item
          label="Lemari Head Cadangan & Kunci"
          status={data.chkSpareHead === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSpareHead')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: DOKUMENTASI */}
      <List.Accordion
        title="4. Dokumentasi Foto"
        left={p => <List.Icon {...p} icon="camera" />}
      >
        <PhotoManager
          photos={data.dokumentasi || []}
          onPhotosChange={n => setData({ ...data, dokumentasi: n })}
          requestPermission={requestPermission}
        />
      </List.Accordion>
    </View>
  );
};
