import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormMobileCrane = ({
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
      {/* --- 1. SPESIFIKASI TEKNIS MOBILE CRANE --- */}
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
          label="Kapasitas Maksimum (Ton)"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Panjang Boom Maksimum (m)"
          keyboardType="numeric"
          value={data.panjangBoom}
          onChangeText={t => setData({ ...data, panjangBoom: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* --- 2. CHASSIS & OUTRIGGERS --- */}
      <List.Accordion
        title="2. Carrier & Outriggers"
        left={p => <List.Icon {...p} icon="truck-check" />}
      >
        {renderCheckItem('Kondisi Rangka / Chassis', 'chkChassis')}
        {renderCheckItem('Sistem Outrigger (Jack & Beam)', 'chkOutrigger')}
        {renderCheckItem('Alas Kaki Outrigger (Pads)', 'chkOutriggerPads')}
        {renderCheckItem('Leveling Gauges (Waterpass)', 'chkWaterpass')}
        {renderCheckItem('Kondisi Ban & Baut Roda', 'chkWheels')}
      </List.Accordion>

      <Divider />

      {/* --- 3. STRUKTUR BOOM & MEKANISME ANGKAT --- */}
      <List.Accordion
        title="3. Boom & Hoist Mechanism"
        left={p => <List.Icon {...p} icon="bridge" />}
      >
        <Text style={styles.subTitleSection}>Boom Section</Text>
        {renderCheckItem('Kondisi Telescopic Boom', 'chkBoom')}
        {renderCheckItem('Wear Pad Boom', 'chkWearPad')}

        <Text style={styles.subTitleSection}>Wire Rope & Winch</Text>
        {renderCheckItem('Seling Utama (Main Wire Rope)', 'chkMainWinch')}
        {renderCheckItem('Seling Bantu (Aux Wire Rope)', 'chkAuxWinch')}
        {renderCheckItem('Drum Winch & Brake', 'chkDrumWinch')}

        <Text style={styles.subTitleSection}>Hook Block</Text>
        {renderCheckItem('Hook & Safety Latch', 'chkHook')}
        {renderCheckItem('Sheaves (Pulley)', 'chkSheaves')}
      </List.Accordion>

      <Divider />

      {/* --- 4. SAFETY DEVICES (KRUSIAL UNTUK CRANE) --- */}
      <List.Accordion
        title="4. Perangkat Keselamatan"
        left={p => <List.Icon {...p} icon="shield-check" />}
      >
        {renderCheckItem('LMI (Load Moment Indicator)', 'chkLMI')}
        {renderCheckItem('Anti-Two Block (A2B) System', 'chkA2B')}
        {renderCheckItem('Boom Angle Indicator', 'chkBoomAngle')}
        {renderCheckItem('Limit Switch Hoist', 'chkLimitSwitch')}
        {renderCheckItem('Anemometer (Wind Speed)', 'chkAnemometer')}
      </List.Accordion>

      <Divider />

      {/* --- 5. SISTEM HIDROLIK & ENGINE --- */}
      <List.Accordion
        title="5. Hydraulic & Engine"
        left={p => <List.Icon {...p} icon="hydraulic-oil-level" />}
      >
        {renderCheckItem('Pompa & Motor Hidrolik', 'chkHydraulicPump')}
        {renderCheckItem('Hose & Pipanisasi (Kebocoran)', 'chkHydraulicHose')}
        {renderCheckItem('Control Valve / Levers', 'chkControlValve')}
        {renderCheckItem('Slewing Mechanism (Swing)', 'chkSlewing')}
        {renderCheckItem('Oli Mesin & Pendingin', 'chkEngineSystem')}
      </List.Accordion>

      <Divider />

      {/* --- 6. DOKUMENTASI FOTO MOBILE CRANE --- */}
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
