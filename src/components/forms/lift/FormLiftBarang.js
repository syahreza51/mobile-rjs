import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormLiftBarang = ({
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
      {/* SEKSI 1: DATA IDENTITAS UNIT */}
      <List.Accordion
        title="1. Identitas & Kapasitas Barang"
        left={p => (
          <List.Icon {...p} icon="package-variant-closed" color="#8b5cf6" />
        )}
      >
        <TextInput
          label="Merk / Pabrikan"
          value={data.merk}
          onChangeText={t => setData({ ...data, merk: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Angkut Maksimum (Kg)"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Dimensi Sangkar (P x L x T)"
          placeholder="Contoh: 2m x 2m x 2.5m"
          value={data.dimensi}
          onChangeText={t => setData({ ...data, dimensi: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: KONSTRUKSI SANGKAR & PINTU */}
      <List.Accordion
        title="2. Konstruksi & Pintu Luar"
        left={p => <List.Icon {...p} icon="door-closed" color="#8b5cf6" />}
      >
        <Text style={styles.subTitleSection}>Struktur Sangkar:</Text>
        <Checkbox.Item
          label="Lantai Sangkar (Kuat/Tidak Berlubang)"
          status={data.chkLantai === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLantai')}
          mode="android"
        />
        <Checkbox.Item
          label="Dinding Sangkar (Kokoh/Rapat)"
          status={data.chkDinding === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkDinding')}
          mode="android"
        />

        <Text style={styles.subTitleSection}>Pintu & Interlock:</Text>
        <Checkbox.Item
          label="Interlock Pintu Luar (Mechanic/Electric)"
          status={data.chkInterlock === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkInterlock')}
          mode="android"
        />
        <Checkbox.Item
          label="Pintu Sangkar (Gate) Menutup Rapat"
          status={data.chkGate === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkGate')}
          mode="android"
        />
        <Checkbox.Item
          label="Locking Device (Pengunci Saat Jalan)"
          status={data.chkLocking === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLocking')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: SISTEM PENGANGKAT (HOISTING) */}
      <List.Accordion
        title="3. Mesin & Tali Baja (Wire Rope)"
        left={p => <List.Icon {...p} icon="weight-lifter" color="#8b5cf6" />}
      >
        <Checkbox.Item
          label="Wire Rope (Tidak Ada Kawat Putus/Karat)"
          status={data.chkWireRope === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkWireRope')}
          mode="android"
        />
        <Checkbox.Item
          label="Kekencangan Tali Baja (Seimbang)"
          status={data.chkRopeTension === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRopeTension')}
          mode="android"
        />
        <Checkbox.Item
          label="Drum / Sheave (Alur Kabel Tidak Aus)"
          status={data.chkDrum === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkDrum')}
          mode="android"
        />
        <Checkbox.Item
          label="Rem Mesin (Brake) Pakem saat Beban Full"
          status={data.chkBrake === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBrake')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: ALAT PENGAMAN (SAFETY DEVICES) */}
      <List.Accordion
        title="4. Alat Pengaman Khusus"
        left={p => <List.Icon {...p} icon="shield-check" color="#8b5cf6" />}
      >
        <Checkbox.Item
          label="Safety Gear (Jepit Rel saat Putus Tali)"
          status={data.chkSafetyGear === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSafetyGear')}
          mode="android"
        />
        <Checkbox.Item
          label="Limit Switch (Batas Atas & Bawah)"
          status={data.chkLimitSwitch === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLimitSwitch')}
          mode="android"
        />
        <Checkbox.Item
          label="Sensor Overload (Deteksi Kelebihan)"
          status={data.chkOverload === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkOverload')}
          mode="android"
        />
        <Checkbox.Item
          label="Tombol Emergency Stop (Aktif)"
          status={data.chkEStop === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEStop')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 5: DOKUMENTASI & CATATAN */}
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
