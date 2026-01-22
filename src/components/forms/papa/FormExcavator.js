import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormExcavator = ({ data, setData, styles, requestPermission }) => {
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
        title="1. Spesifikasi Alat"
        left={p => <List.Icon {...p} icon="excavator" />}
      >
        <TextInput
          label="Merk / Tipe"
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
          label="Kapasitas Bucket (m³)"
          keyboardType="numeric"
          value={data.kapasitasBucket}
          onChangeText={t => setData({ ...data, kapasitasBucket: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Hour Meter (HM)"
          keyboardType="numeric"
          value={data.hourMeter}
          onChangeText={t => setData({ ...data, hourMeter: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* --- 2. SISTEM HIDROLIK --- */}
      <List.Accordion
        title="2. Hydraulic System"
        left={p => <List.Icon {...p} icon="water-pump" />}
      >
        {renderCheckItem('Kondisi Pompa Hidrolik', 'chkHydraulicPump')}
        {renderCheckItem(
          'Kebocoran Silinder (Boom, Arm, Bucket)',
          'chkCylinderLeak',
        )}
        {renderCheckItem('Kondisi Selang (Hose) & Fitting', 'chkHoses')}
        {renderCheckItem('Kualitas & Level Oli Hidrolik', 'chkHydraulicOil')}
        {renderCheckItem('Control Valve & Lever', 'chkControlValve')}
      </List.Accordion>

      <Divider />

      {/* --- 3. ATTACHMENT & STRUKTUR --- */}
      <List.Accordion
        title="3. Attachment & Structure"
        left={p => <List.Icon {...p} icon="Vector-selection" />}
      >
        {renderCheckItem('Kondisi Bucket & Tooth (Kuku)', 'chkBucket')}
        {renderCheckItem('Kondisi Linkage & Pin Bushing', 'chkPinBushing')}
        {renderCheckItem(
          'Struktur Boom & Arm (Retak/Las)',
          'chkBoomArmStructure',
        )}
        {renderCheckItem('Slewing Bearing & Motor Swing', 'chkSwingMechanism')}
      </List.Accordion>

      <Divider />

      {/* --- 4. UNDERCARRIAGE / TRACK --- */}
      <List.Accordion
        title="4. Undercarriage"
        left={p => <List.Icon {...p} icon="go-kart-track" />}
      >
        {renderCheckItem('Track Shoe & Link Assembly', 'chkTrackLink')}
        {renderCheckItem('Idler & Track Roller', 'chkRollers')}
        {renderCheckItem('Sprocket & Final Drive', 'chkSprocket')}
        {renderCheckItem('Tegangan Track (Track Tension)', 'chkTrackTension')}
      </List.Accordion>

      <Divider />

      {/* --- 5. SAFETY & ENGINE --- */}
      <List.Accordion
        title="5. Safety Devices & Engine"
        left={p => <List.Icon {...p} icon="engine-outline" />}
      >
        {renderCheckItem('Fungsi Safety Lock Lever', 'chkSafetyLock')}
        {renderCheckItem('Kaca Kabin & Spion', 'chkMirrors')}
        {renderCheckItem('Lampu Kerja & Rotary Light', 'chkLights')}
        {renderCheckItem('Alarm Mundur (Back-up Alarm)', 'chkAlarm')}
        {renderCheckItem('Kondisi Mesin & Emisi Gas Buang', 'chkEngine')}
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
