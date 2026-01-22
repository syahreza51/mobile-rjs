import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormMotorDiesel = ({
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
      {/* SEKSI 1: SPESIFIKASI ENGINE */}
      <List.Accordion
        title="1. Spesifikasi Motor Diesel"
        left={p => <List.Icon {...p} icon="engine" color="#0ea5e9" />}
      >
        <TextInput
          label="Merk & Tipe Engine"
          value={data.merkEngine}
          onChangeText={t => setData({ ...data, merkEngine: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Daya Output (kVA / kW)"
          keyboardType="numeric"
          value={data.dayaOutput}
          onChangeText={t => setData({ ...data, dayaOutput: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Putaran Mesin (RPM)"
          keyboardType="numeric"
          value={data.rpm}
          onChangeText={t => setData({ ...data, rpm: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Nomor Seri / Engine No."
          value={data.noSeriEngine}
          onChangeText={t => setData({ ...data, noSeriEngine: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: SISTEM MEKANIK & TRANSMISI */}
      <List.Accordion
        title="2. Kondisi Mekanik & Proteksi"
        left={p => <List.Icon {...p} icon="tools" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Pelindung Bagian Berputar (Belt/Coupling)"
          status={data.chkRotatingGuard === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRotatingGuard')}
          mode="android"
        />
        <Checkbox.Item
          label="Isolasi Pipa Gas Buang (Muffler)"
          status={data.chkMufflerInsulation === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMufflerInsulation')}
          mode="android"
        />
        <Checkbox.Item
          label="Kondisi Dudukan Mesin (Mounting)"
          status={data.chkMounting === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMounting')}
          mode="android"
        />
        <Checkbox.Item
          label="Tidak Ada Kebocoran Oli/Bahan Bakar"
          status={data.chkNoLeak === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkNoLeak')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: PARAMETER OPERASIONAL & KONTROL */}
      <List.Accordion
        title="3. Parameter & Sistem Kontrol"
        left={p => <List.Icon {...p} icon="gauge" color="#0ea5e9" />}
      >
        <TextInput
          label="Tekanan Oli (Bar/Psi)"
          keyboardType="numeric"
          value={data.oilPressure}
          onChangeText={t => setData({ ...data, oilPressure: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Suhu Air Pendingin (°C)"
          keyboardType="numeric"
          value={data.coolantTemp}
          onChangeText={t => setData({ ...data, coolantTemp: t })}
          mode="outlined"
          style={styles.input}
        />
        <Checkbox.Item
          label="Over Speed Device (Berfungsi)"
          status={data.chkOverSpeed === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkOverSpeed')}
          mode="android"
        />
        <Checkbox.Item
          label="Fungsi Emergency Stop"
          status={data.chkEStop === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEStop')}
          mode="android"
        />
        <Checkbox.Item
          label="Baterai Aki & Dinamo Starter"
          status={data.chkBattery === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBattery')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: TANGKI BAHAN BAKAR & APD */}
      <List.Accordion
        title="4. Tangki Bahan Bakar & Lingkungan"
        left={p => <List.Icon {...p} icon="gas-station" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Tangki Harian (Bebas Rembesan)"
          status={data.chkFuelTank === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkFuelTank')}
          mode="android"
        />
        <Checkbox.Item
          label="Ventilasi Ruang Diesel Memadai"
          status={data.chkVentilation === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkVentilation')}
          mode="android"
        />
        <Checkbox.Item
          label="Tersedia Ear Protector (Area Bising)"
          status={data.chkEarProtection === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEarProtection')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="5. Dokumentasi Foto"
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
