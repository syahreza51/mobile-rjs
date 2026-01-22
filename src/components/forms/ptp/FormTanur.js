import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormTanur = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: DATA IDENTITAS & SPESIFIKASI */}
      <List.Accordion
        title="1. Identitas & Kapasitas"
        left={p => <List.Icon {...p} icon="factory" color="#0ea5e9" />}
      >
        <TextInput
          label="Merk & Model Tanur"
          value={data.merkTanur}
          onChangeText={t => setData({ ...data, merkTanur: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tipe (Induksi/Arc/Gas/Oven)"
          value={data.tipeTanur}
          onChangeText={t => setData({ ...data, tipeTanur: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Suhu Kerja Maksimum (°C)"
          keyboardType="numeric"
          value={data.tempMax}
          onChangeText={t => setData({ ...data, tempMax: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tekanan Kerja (bila ada - Bar)"
          keyboardType="numeric"
          value={data.workingPress}
          onChangeText={t => setData({ ...data, workingPress: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: KONDISI STRUKTUR & ISOLASI */}
      <List.Accordion
        title="2. Struktur & Dinding Tanur"
        left={p => <List.Icon {...p} icon="wall" color="#0ea5e9" />}
      >
        <Text style={styles.subTitleSection}>Kondisi Fisik:</Text>
        <Checkbox.Item
          label="Refraktori (Batu Tahan Api) Tidak Retak"
          status={data.chkRefractory === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRefractory')}
          mode="android"
        />
        <Checkbox.Item
          label="Isolasi Panas (Insulation) Luar Baik"
          status={data.chkInsulation === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkInsulation')}
          mode="android"
        />
        <Checkbox.Item
          label="Pintu Tanur Menutup Rapat (Seal)"
          status={data.chkDoorSeal === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkDoorSeal')}
          mode="android"
        />
        <Checkbox.Item
          label="Struktur Rangka & Engsel Kuat"
          status={data.chkStructure === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkStructure')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: SISTEM PEMBAKARAN & ENERGI */}
      <List.Accordion
        title="3. Sistem Burner / Pemanas"
        left={p => <List.Icon {...p} icon="fire-circle" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Pilot Burner / Igniter (Berfungsi)"
          status={data.chkIgniter === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkIgniter')}
          mode="android"
        />
        <Checkbox.Item
          label="Flame Detector (Sensor Api) Aktif"
          status={data.chkFlameDet === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkFlameDet')}
          mode="android"
        />
        <Checkbox.Item
          label="Saluran Bahan Bakar (Tidak Bocor)"
          status={data.chkFuelLine === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkFuelLine')}
          mode="android"
        />
        <Checkbox.Item
          label="Cerobong Asap (Exhaust) Bebas Sumbatan"
          status={data.chkExhaust === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkExhaust')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: SISTEM KONTROL & EMERGENCY */}
      <List.Accordion
        title="4. Kontrol, Sensor & Safety"
        left={p => <List.Icon {...p} icon="shield-alert" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Automatic Temperature Control (Uji)"
          status={data.chkTempControl === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkTempControl')}
          mode="android"
        />
        <Checkbox.Item
          label="Over-Temperature Limit Switch"
          status={data.chkOverTemp === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkOverTemp')}
          mode="android"
        />
        <Checkbox.Item
          label="Safety Shut-off Valve (Fuel)"
          status={data.chkShutOff === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkShutOff')}
          mode="android"
        />
        <Checkbox.Item
          label="Interlock Kipas Sirkulasi / Purging"
          status={data.chkPurging === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPurging')}
          mode="android"
        />
        <Checkbox.Item
          label="Tombol Emergency Stop"
          status={data.chkEStop === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEStop')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 5: LINGKUNGAN & APD KHUSUS */}
      <List.Accordion
        title="5. Lingkungan Kerja & APD"
        left={p => <List.Icon {...p} icon="account-alert" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Area Sekitar Bebas Bahan Mudah Terbakar"
          status={data.chkEnvironment === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEnvironment')}
          mode="android"
        />
        <Checkbox.Item
          label="Tersedia Baju Tahan Panas / Apron"
          status={data.chkApdPanas === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkApdPanas')}
          mode="android"
        />
        <Checkbox.Item
          label="Ventilasi Area Tanur Memadai"
          status={data.chkVentilasi === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkVentilasi')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="6. Dokumentasi Foto"
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
