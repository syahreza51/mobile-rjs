import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormOverheadCrane = ({
  data,
  setData,
  styles,
  requestPermission,
}) => {
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
      {/* --- 1. SPESIFIKASI TEKNIS --- */}
      <List.Accordion
        title="1. Spesifikasi Pesawat"
        left={p => <List.Icon {...p} icon="bridge" />}
      >
        <TextInput
          label="Merk / Model Hoist"
          value={data.merkModel}
          onChangeText={t => setData({ ...data, merkModel: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas (Ton)"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Span (Lebar Bentangan) - m"
          keyboardType="numeric"
          value={data.spanLength}
          onChangeText={t => setData({ ...data, spanLength: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tinggi Angkat (m)"
          keyboardType="numeric"
          value={data.tinggiAngkat}
          onChangeText={t => setData({ ...data, tinggiAngkat: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* --- 2. STRUKTUR RANGKA & RUNWAY --- */}
      <List.Accordion
        title="2. Structure & Runway"
        left={p => <List.Icon {...p} icon="tray-full" />}
      >
        {renderCheckItem('Kondisi Main Girder (Balok Utama)', 'chkGirder')}
        {renderCheckItem('End Carriage & Roda Jalan', 'chkEndCarriage')}
        {renderCheckItem('Rel Runway & Stopper', 'chkRunway')}
        {renderCheckItem('Baut Sambungan & Sambungan Las', 'chkJoints')}
      </List.Accordion>

      <Divider />

      {/* --- 3. MEKANISME HOIST & TROLLEY --- */}
      <List.Accordion
        title="3. Hoist & Trolley Mechanism"
        left={p => <List.Icon {...p} icon="cog-transfer" />}
      >
        <Text style={styles.subTitleSection}>Wire Rope & Drum</Text>
        {renderCheckItem('Kondisi Wire Rope (Seling)', 'chkWireRope')}
        {renderCheckItem('Rope Guide (Pemandu Tali)', 'chkRopeGuide')}
        {renderCheckItem('Drum Hoist & Terminal Seling', 'chkDrum')}

        <Text style={styles.subTitleSection}>Hook Block</Text>
        {renderCheckItem('Hook, Safety Latch & Bearing', 'chkHook')}
        {renderCheckItem('Pulley Hoist (Sheaves)', 'chkSheaves')}
      </List.Accordion>

      <Divider />

      {/* --- 4. SISTEM KELISTRIKAN & SAFETY --- */}
      <List.Accordion
        title="4. Electric & Safety Devices"
        left={p => <List.Icon {...p} icon="flash" />}
      >
        {renderCheckItem('Limit Switch Up/Down', 'chkLimitUpDown')}
        {renderCheckItem('Limit Switch Long/Cross Travel', 'chkLimitTravel')}
        {renderCheckItem('Fungsi Emergency Stop', 'chkEmergency')}
        {renderCheckItem('Kondisi Pendant / Remote Control', 'chkControl')}
        {renderCheckItem('Sistem Kabel Festoon / Busbar', 'chkFestoon')}
        {renderCheckItem('Rem Hoist (Brake Mechanism)', 'chkBrake')}
      </List.Accordion>

      <Divider />

      {/* --- 5. DOKUMENTASI FOTO --- */}
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
