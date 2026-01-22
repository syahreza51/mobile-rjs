import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormGondola = ({ data, setData, styles, requestPermission }) => {
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
        title="1. Spesifikasi Gondola"
        left={p => <List.Icon {...p} icon="window-maximize" />}
      >
        <TextInput
          label="Merk / Model"
          value={data.merkModel}
          onChangeText={t => setData({ ...data, merkModel: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Panjang Platform (m)"
          value={data.platformLength}
          onChangeText={t => setData({ ...data, platformLength: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="2. Penggantung & Wire Rope"
        left={p => <List.Icon {...p} icon="Link" />}
      >
        {renderCheckItem('Kondisi Arm / Parapet Clamp', 'chkSuspension')}
        {renderCheckItem(
          'Counter Weight (Beban Penyeimbang)',
          'chkCounterWeight',
        )}
        {renderCheckItem('Wire Rope Utama & Keselamatan', 'chkWireRope')}
        {renderCheckItem('Klip Penjepit (Wire Clip)', 'chkWireClip')}
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="3. Mesin & Safety Device"
        left={p => <List.Icon {...p} icon="engine" />}
      >
        {renderCheckItem('Motor Hoist (Kiri & Kanan)', 'chkHoistMotor')}
        {renderCheckItem('Block Stop / Safety Lock', 'chkSafetyLock')}
        {renderCheckItem('Limit Switch Atas', 'chkLimitSwitch')}
        {renderCheckItem('Fungsi Rem Manual', 'chkManualBrake')}
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
