import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormDumbwaiter = ({
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
      {/* SEKSI 1: DATA UNIT */}
      <List.Accordion
        title="1. Identitas & Kapasitas"
        left={p => <List.Icon {...p} icon="room-service" color="#8b5cf6" />}
      >
        <TextInput
          label="Merk / Pabrikan"
          value={data.merk}
          onChangeText={t => setData({ ...data, merk: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Beban (Kg)"
          keyboardType="numeric"
          placeholder="Contoh: 100 atau 250"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Jumlah Lantai Pelayanan"
          keyboardType="numeric"
          value={data.lantai}
          onChangeText={t => setData({ ...data, lantai: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: PINTU & SANGKAR */}
      <List.Accordion
        title="2. Keamanan Pintu & Sangkar"
        left={p => <List.Icon {...p} icon="door-closed" color="#8b5cf6" />}
      >
        <Checkbox.Item
          label="Interlock Pintu (Listrik & Mekanik)"
          status={data.chkInterlock === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkInterlock')}
          mode="android"
        />
        <Checkbox.Item
          label="Pintu Tidak Bisa Dibuka saat Jalan"
          status={data.chkDoorLock === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkDoorLock')}
          mode="android"
        />
        <Checkbox.Item
          label="Kebersihan Interior Sangkar"
          status={data.chkClean === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkClean')}
          mode="android"
        />
        <Checkbox.Item
          label="Tanda 'Dilarang Masuk / Orang'"
          status={data.chkSign === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSign')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: MESIN PENGGERAK */}
      <List.Accordion
        title="3. Sistem Pengangkat"
        left={p => <List.Icon {...p} icon="engine" color="#8b5cf6" />}
      >
        <Checkbox.Item
          label="Kondisi Wire Rope / Rantai"
          status={data.chkRope === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRope')}
          mode="android"
        />
        <Checkbox.Item
          label="Limit Switch (Batas Atas/Bawah)"
          status={data.chkLimit === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLimit')}
          mode="android"
        />
        <Checkbox.Item
          label="Rem Mesin Berfungsi Baik"
          status={data.chkBrake === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBrake')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

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
