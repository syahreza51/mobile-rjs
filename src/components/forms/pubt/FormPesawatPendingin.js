import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormPesawatPendingin = ({
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
        title="1. Data Unit Pendingin"
        left={p => <List.Icon {...p} icon="fridge-outline" />}
      >
        <TextInput
          label="Jenis Refrigeran (Freon/Ammonia)"
          value={data.jenisGas}
          onChangeText={t => setData({ ...data, jenisGas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Pendingin (PK/Ton Ref)"
          value={data.kapasitasPK}
          onChangeText={t => setData({ ...data, kapasitasPK: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="2. Pemeriksaan Komponen"
        left={p => <List.Icon {...p} icon="snowflake" />}
      >
        {renderCheckItem('Kondisi Kompresor', 'chkKompresor')}
        {renderCheckItem('Kondisi Kondensor', 'chkKondensor')}
        {renderCheckItem('Kondisi Evaporator', 'chkEvaporator')}
        {renderCheckItem('Uji Kebocoran Gas (Leak Test)', 'chkLeakTest')}
        {renderCheckItem('Fungsi Thermostat', 'chkThermostat')}
        {renderCheckItem('Oil Separator', 'chkOilSeparator')}
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
