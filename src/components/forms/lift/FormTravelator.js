import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormTravelator = ({
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
      {/* SEKSI 1: SPESIFIKASI UNIT */}
      <List.Accordion
        title="1. Identitas & Spesifikasi"
        left={p => <List.Icon {...p} icon="walk" color="#8b5cf6" />}
      >
        <TextInput
          label="Merk / Pabrikan"
          value={data.merk}
          onChangeText={t => setData({ ...data, merk: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Panjang Lintasan (m)"
          keyboardType="numeric"
          value={data.panjang}
          onChangeText={t => setData({ ...data, panjang: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Angkut (Orang/Jam)"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: PALLET & HANDRAIL */}
      <List.Accordion
        title="2. Komponen Pallet & Handrail"
        left={p => <List.Icon {...p} icon="reproduction" color="#8b5cf6" />}
      >
        <Text style={styles.subTitleSection}>Pallet (Lintasan Injak):</Text>
        <Checkbox.Item
          label="Pallet Datar (Tidak Retak/Gompel)"
          status={data.chkPallet === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPallet')}
          mode="android"
        />
        <Checkbox.Item
          label="Alur Pallet (Groove) Bersih"
          status={data.chkGroove === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkGroove')}
          mode="android"
        />
        <Checkbox.Item
          label="Gigi Sisir (Comb Plate) Utuh"
          status={data.chkComb === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkComb')}
          mode="android"
        />

        <Text style={styles.subTitleSection}>Handrail:</Text>
        <Checkbox.Item
          label="Kecepatan Handrail Sinkron"
          status={data.chkSync === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSync')}
          mode="android"
        />
        <Checkbox.Item
          label="Inlet Guard (Proteksi Tangan)"
          status={data.chkInlet === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkInlet')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: SAFETY DEVICE & SENSOR */}
      <List.Accordion
        title="3. Sistem Pengaman"
        left={p => <List.Icon {...p} icon="shield-check" color="#8b5cf6" />}
      >
        <Checkbox.Item
          label="Tombol Emergency Stop"
          status={data.chkEStop === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEStop')}
          mode="android"
        />
        <Checkbox.Item
          label="Skirt Deflector (Bulu Sikat Samping)"
          status={data.chkSkirt === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSkirt')}
          mode="android"
        />
        <Checkbox.Item
          label="Sensor Pallet Amblas (Pallet Sag)"
          status={data.chkSag === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSag')}
          mode="android"
        />
        <Checkbox.Item
          label="Rem Otomatis (Automatic Brake)"
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
