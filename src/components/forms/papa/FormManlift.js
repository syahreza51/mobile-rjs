import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormManlift = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  const renderCheckItem = (label, key) => (
    <Checkbox.Item
      label={label}
      status={data[key] === 'MS' ? 'checked' : 'unchecked'}
      onPress={() => toggleCondition(key)}
      mode="android"
    />
  );

  return (
    <View>
      <List.Accordion
        title="1. Spesifikasi Alat"
        left={p => <List.Icon {...p} icon="crane" />}
      >
        <TextInput
          label="Merk / Model"
          value={data.merkModel}
          onChangeText={t => setData({ ...data, merkModel: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Serial Number"
          value={data.sn}
          onChangeText={t => setData({ ...data, sn: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Max. Working Height (m)"
          keyboardType="numeric"
          value={data.workingHeight}
          onChangeText={t => setData({ ...data, workingHeight: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Max. Capacity (Kg)"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="2. Struktur & Mekanisme"
        left={p => <List.Icon {...p} icon="Wall" />}
      >
        {renderCheckItem(
          'Kondisi Gunting (Scissor Arms) / Boom',
          'chkStructure',
        )}
        {renderCheckItem('Cylinder Hydraulic & Hose', 'chkHydraulic')}
        {renderCheckItem('Kondisi Chassis & Roda', 'chkChassis')}
        {renderCheckItem('Platform & Railing (Pagar Pengaman)', 'chkPlatform')}
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="3. Safety & Control"
        left={p => <List.Icon {...p} icon="shield-check" />}
      >
        {renderCheckItem('Emergency Stop (Atas & Bawah)', 'chkEmergency')}
        {renderCheckItem('Tilt Sensor / Alarm Kemiringan', 'chkTiltSensor')}
        {renderCheckItem(
          'Lowering System (Turun Darurat)',
          'chkEmergencyLowering',
        )}
        {renderCheckItem('Fungsi Brake (Rem)', 'chkBrake')}
        {renderCheckItem('Pothole Protection System', 'chkPothole')}
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="7. Dokumentasi Foto"
        left={p => <List.Icon {...p} icon="camera-burst" />}
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
