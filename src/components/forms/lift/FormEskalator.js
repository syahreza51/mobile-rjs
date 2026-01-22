import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormEskalator = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: IDENTITAS & TEKNIS */}
      <List.Accordion
        title="1. Spesifikasi Eskalator"
        left={p => <List.Icon {...p} icon="stairs" color="#8b5cf6" />}
      >
        <TextInput
          label="Merk / Pabrikan"
          value={data.merk}
          onChangeText={t => setData({ ...data, merk: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Sudut Kemiringan (°)"
          keyboardType="numeric"
          placeholder="Contoh: 30 atau 35"
          value={data.kemiringan}
          onChangeText={t => setData({ ...data, kemiringan: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kecepatan Nominal (m/s)"
          keyboardType="numeric"
          value={data.speed}
          onChangeText={t => setData({ ...data, speed: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Lebar Step (mm)"
          keyboardType="numeric"
          value={data.lebarStep}
          onChangeText={t => setData({ ...data, lebarStep: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: KOMPONEN MEKANIK (STEP & HANDRAIL) */}
      <List.Accordion
        title="2. Anak Tangga & Pegangan"
        left={p => <List.Icon {...p} icon="human-handsup" color="#8b5cf6" />}
      >
        <Text style={styles.subTitleSection}>Kondisi Step (Anak Tangga):</Text>
        <Checkbox.Item
          label="Step / Pallet (Tidak Retak/Gompel)"
          status={data.chkStep === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkStep')}
          mode="android"
        />
        <Checkbox.Item
          label="Celah Antar Step (Sesuai Standar)"
          status={data.chkStepGap === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkStepGap')}
          mode="android"
        />
        <Checkbox.Item
          label="Comb Plate (Gigi Sisir) Tidak Patah"
          status={data.chkCombPlate === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkCombPlate')}
          mode="android"
        />

        <Text style={styles.subTitleSection}>Handrail (Pegangan Tangan):</Text>
        <Checkbox.Item
          label="Kondisi Karet Handrail (Mulus)"
          status={data.chkHandrail === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkHandrail')}
          mode="android"
        />
        <Checkbox.Item
          label="Kecepatan Handrail (Sinkron dgn Step)"
          status={data.chkHandrailSync === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkHandrailSync')}
          mode="android"
        />
        <Checkbox.Item
          label="Inlet Guard (Pelindung Tangan Masuk)"
          status={data.chkInletGuard === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkInletGuard')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: SISTEM SAFETY SENSOR */}
      <List.Accordion
        title="3. Perangkat Pengaman (Safety Devices)"
        left={p => <List.Icon {...p} icon="shield-sync" color="#8b5cf6" />}
      >
        <Checkbox.Item
          label="Emergency Stop Button (Atas & Bawah)"
          status={data.chkEStop === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEStop')}
          mode="android"
        />
        <Checkbox.Item
          label="Skirt Deflector (Bulu Sikat Samping)"
          status={data.chkSkirtBrush === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSkirtBrush')}
          mode="android"
        />
        <Checkbox.Item
          label="Step Sag Device (Sensor Step Turun)"
          status={data.chkStepSag === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkStepSag')}
          mode="android"
        />
        <Checkbox.Item
          label="Broken Chain Sensor (Sensor Rantai Putus)"
          status={data.chkChainSensor === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkChainSensor')}
          mode="android"
        />
        <Checkbox.Item
          label="Comb Plate Safety Switch"
          status={data.chkCombSwitch === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkCombSwitch')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: PENERANGAN & RAMBU */}
      <List.Accordion
        title="4. Indikator & Lingkungan"
        left={p => <List.Icon {...p} icon="alert-octagon" color="#8b5cf6" />}
      >
        <Checkbox.Item
          label="Lampu Step (Step Light) Hijau"
          status={data.chkStepLight === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkStepLight')}
          mode="android"
        />
        <Checkbox.Item
          label="Rambu Peringatan (Safety Signs)"
          status={data.chkSigns === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSigns')}
          mode="android"
        />
        <Checkbox.Item
          label="Demarcation Line (Garis Kuning Step)"
          status={data.chkYellowLine === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkYellowLine')}
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
