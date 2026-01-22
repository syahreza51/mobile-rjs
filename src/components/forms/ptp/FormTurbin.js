import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormTurbin = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: IDENTITAS TURBIN */}
      <List.Accordion
        title="1. Spesifikasi Turbin"
        left={p => <List.Icon {...p} icon="fan" color="#0ea5e9" />}
      >
        <TextInput
          label="Merk & Model Turbin"
          value={data.merkTurbin}
          onChangeText={t => setData({ ...data, merkTurbin: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Daya (MW/HP)"
          keyboardType="numeric"
          value={data.kapasitasDaya}
          onChangeText={t => setData({ ...data, kapasitasDaya: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kecepatan Putar (RPM)"
          keyboardType="numeric"
          value={data.rpmTurbin}
          onChangeText={t => setData({ ...data, rpmTurbin: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tekanan Kerja Inlet (Bar/Psi)"
          keyboardType="numeric"
          value={data.pressInlet}
          onChangeText={t => setData({ ...data, pressInlet: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: SISTEM PENGAMAN & KONTROL */}
      <List.Accordion
        title="2. Sistem Pengaman & Governor"
        left={p => <List.Icon {...p} icon="shield-cog" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Main Stop Valve (MSV) Berfungsi"
          status={data.chkMsv === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMsv')}
          mode="android"
        />
        <Checkbox.Item
          label="Over Speed Trip Device (Uji Mekanik)"
          status={data.chkOverspeedTrip === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkOverspeedTrip')}
          mode="android"
        />
        <Checkbox.Item
          label="Sistem Governor (Pengatur Beban)"
          status={data.chkGovernor === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkGovernor')}
          mode="android"
        />
        <Checkbox.Item
          label="Emergency Trip Button (Fungsi)"
          status={data.chkETrip === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkETrip')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: SISTEM PELUMASAN & MONITORING */}
      <List.Accordion
        title="3. Pelumasan & Parameter Teknis"
        left={p => <List.Icon {...p} icon="oil" color="#0ea5e9" />}
      >
        <TextInput
          label="Suhu Bearing (°C)"
          keyboardType="numeric"
          value={data.bearingTemp}
          onChangeText={t => setData({ ...data, bearingTemp: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Level Getaran (Vibration) - mm/s"
          keyboardType="numeric"
          value={data.vibrationLevel}
          onChangeText={t => setData({ ...data, vibrationLevel: t })}
          mode="outlined"
          style={styles.input}
        />
        <Checkbox.Item
          label="Lube Oil Pump (Auxiliary & Emergency)"
          status={data.chkLubePump === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLubePump')}
          mode="android"
        />
        <Checkbox.Item
          label="Oil Cooler (Kondisi Pendinginan)"
          status={data.chkOilCooler === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkOilCooler')}
          mode="android"
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
          onPhotosChange={n => setData({ ...data, dokumentasi: n })}
          requestPermission={requestPermission}
        />
      </List.Accordion>
    </View>
  );
};
