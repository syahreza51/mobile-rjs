import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormTangkiTimbun = ({
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
      <List.Accordion
        title="1. Spesifikasi Tangki"
        left={p => <List.Icon {...p} icon="database" />}
      >
        <TextInput
          label="Media Simpan (BBM/Kimia)"
          value={data.mediaSimpan}
          onChangeText={t => setData({ ...data, mediaSimpan: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas (Liter/m³)"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Material Tangki"
          value={data.material}
          onChangeText={t => setData({ ...data, material: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="2. Struktur & Keselamatan"
        left={p => <List.Icon {...p} icon="shield-home" />}
      >
        <Text style={styles.subTitleSection}>Area Penimbunan</Text>
        {renderCheckItem('Tanggul Pengaman (Bundwall)', 'chkBundwall')}
        {renderCheckItem('Kondisi Pondasi (Sinking?)', 'chkPondasi')}

        <Text style={styles.subTitleSection}>Sistem Pengaman</Text>
        {renderCheckItem('Sistem Pembumian (Grounding)', 'chkGrounding')}
        {renderCheckItem(
          'Ventilasi / Pernafasan (Breather Valve)',
          'chkVentilasi',
        )}
        {renderCheckItem('Alat Ukur Level (Level Gauge)', 'chkLevelGauge')}
        {renderCheckItem('Sistem Pemadam / Foam System', 'chkHydrantTangki')}
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="3. Dokumentasi Foto"
        left={p => <List.Icon {...p} icon="camera" />}
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
