import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormPassengerHoist = ({
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
        title="1. Spesifikasi Unit"
        left={p => <List.Icon {...p} icon="elevator-passenger" />}
      >
        <TextInput
          label="Merk / Model"
          value={data.merkModel}
          onChangeText={t => setData({ ...data, merkModel: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Angkut (Orang/Kg)"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kecepatan Angkat (m/min)"
          keyboardType="numeric"
          value={data.speed}
          onChangeText={t => setData({ ...data, speed: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Jumlah Mast Section (Tinggi)"
          keyboardType="numeric"
          value={data.jumlahMast}
          onChangeText={t => setData({ ...data, jumlahMast: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* --- 2. RACK & PINION (STRUKTUR) --- */}
      <List.Accordion
        title="2. Mast, Rack & Pinion"
        left={p => <List.Icon {...p} icon="format-list-bulleted-type" />}
      >
        {renderCheckItem(
          'Kondisi Mast Section & Baut Sambungan',
          'chkMastSection',
        )}
        {renderCheckItem('Keausan Gigi Rack (Rel Gigi)', 'chkRackGear')}
        {renderCheckItem(
          'Keausan Pinion Gear (Gigi Penggerak)',
          'chkPinionGear',
        )}
        {renderCheckItem(
          'Kondisi Wall Tie (Pengikat ke Bangunan)',
          'chkWallTie',
        )}
        {renderCheckItem('Kondisi Base Frame & Enclosure', 'chkBaseFrame')}
      </List.Accordion>

      <Divider />

      {/* --- 3. SAFETY DEVICES (KRUSIAL) --- */}
      <List.Accordion
        title="3. Perangkat Keselamatan"
        left={p => <List.Icon {...p} icon="shield-alert" />}
      >
        {renderCheckItem(
          'Safety Device / Governor (Centrifugal Brake)',
          'chkSafetyDevice',
        )}
        {renderCheckItem('Limit Switch (Top & Bottom)', 'chkLimitSwitch')}
        {renderCheckItem(
          'Door Interlock (Pintu Kabin & Ground)',
          'chkDoorInterlock',
        )}
        {renderCheckItem('Emergency Stop Button', 'chkEmergencyStop')}
        {renderCheckItem('Overload Sensor (Alarm Beban Lebih)', 'chkOverload')}
        {renderCheckItem('Final Limit Switch (Mekanis)', 'chkFinalLimit')}
      </List.Accordion>

      <Divider />

      {/* --- 4. KABIN & SISTEM PENGGERAK --- */}
      <List.Accordion
        title="4. Cage & Drive Unit"
        left={p => <List.Icon {...p} icon="engine" />}
      >
        {renderCheckItem('Kondisi Motor & Gearbox', 'chkMotorDrive')}
        {renderCheckItem('Fungsi Rem Magnetik (Brake)', 'chkMagneticBrake')}
        {renderCheckItem('Kondisi Roda Guide (Guide Roller)', 'chkGuideRoller')}
        {renderCheckItem(
          'Sistem Kabel Power (Trailing Cable)',
          'chkTrailingCable',
        )}
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
