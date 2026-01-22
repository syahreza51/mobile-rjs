import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormTowerCrane = ({
  data,
  setData,
  styles,
  requestPermission,
}) => {
  // Fungsi helper checklist (MS = Memenuhi Syarat, TMS = Tidak Memenuhi Syarat)
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
      {/* --- 1. SPESIFIKASI TEKNIS TOWER CRANE --- */}
      <List.Accordion
        title="1. Spesifikasi Pesawat"
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
          label="Max. Jib Length (Meter)"
          keyboardType="numeric"
          value={data.jibLength}
          onChangeText={t => setData({ ...data, jibLength: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Max. Capacity (Ton)"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* --- 2. PONDASI & MAST SECTION --- */}
      <List.Accordion
        title="2. Foundation & Mast Section"
        left={p => <List.Icon {...p} icon="pillar" />}
      >
        {renderCheckItem('Kondisi Fix Fixing Angle / Pondasi', 'chkFoundation')}
        {renderCheckItem(
          'Baut Sambungan Mast (High Strength Bolt)',
          'chkMastBolts',
        )}
        {renderCheckItem('Kondisi Struktur Mast Section', 'chkMastStructure')}
        {renderCheckItem('Tangga & Platform Istirahat', 'chkLadder')}
        {renderCheckItem('Verticality (Kelurusan Tower)', 'chkVerticality')}
      </List.Accordion>

      <Divider />

      {/* --- 3. SLEWING & CABIN --- */}
      <List.Accordion
        title="3. Slewing, Cabin & Jib"
        left={p => <List.Icon {...p} icon="T-handle" />}
      >
        <Text style={styles.subTitleSection}>Slewing & Jib</Text>
        {renderCheckItem('Motor Slewing & Gearbox', 'chkSlewingMotor')}
        {renderCheckItem('Kondisi Struktur Jib (Main Jib)', 'chkJibStructure')}
        {renderCheckItem('Counter Jib & Counter Weight', 'chkCounterWeight')}

        <Text style={styles.subTitleSection}>Trolley & Winch</Text>
        {renderCheckItem('Mekanisme Trolley (Maju/Mundur)', 'chkTrolley')}
        {renderCheckItem('Winch Hoist (Tromol Gulungan)', 'chkHoistWinch')}
      </List.Accordion>

      <Divider />

      {/* --- 4. SAFETY DEVICES (SANGAT VITAL) --- */}
      <List.Accordion
        title="4. Perangkat Keselamatan"
        left={p => <List.Icon {...p} icon="alert-decagram" />}
      >
        {renderCheckItem('Load Moment Limiter', 'chkLoadLimiter')}
        {renderCheckItem('Overhoist Limit Switch (A2B)', 'chkA2B')}
        {renderCheckItem('Trolley Limit Switch', 'chkTrolleyLimit')}
        {renderCheckItem('Slewing Limit Switch', 'chkSlewingLimit')}
        {renderCheckItem('Anemometer (Kecepatan Angin)', 'chkAnemometer')}
        {renderCheckItem('Lampu Aviasi (Aviation Light)', 'chkAviationLight')}
      </List.Accordion>

      <Divider />

      {/* --- 5. TALI KAWAT BAJA (WIRE ROPE) --- */}
      <List.Accordion
        title="5. Wire Rope & Hook"
        left={p => <List.Icon {...p} icon="Kabaddi" />}
      >
        {renderCheckItem('Kondisi Wire Rope Hoist', 'chkWireRope')}
        {renderCheckItem('Kondisi Wire Rope Trolley', 'chkTrolleyRope')}
        {renderCheckItem('Hook Block & Safety Latch', 'chkHookBlock')}
        {renderCheckItem('Pulley / Sheaves', 'chkSheaves')}
      </List.Accordion>

      <Divider />

      {/* --- 6. DOKUMENTASI FOTO --- */}
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
