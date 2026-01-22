import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormBoiler = ({ data, setData, styles, requestPermission }) => {
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
        title="1. Spesifikasi Teknis"
        left={p => <List.Icon {...p} icon="water-boiler" />}
      >
        <TextInput
          label="Merk / Buatan"
          value={data.merkModel}
          onChangeText={t => setData({ ...data, merkModel: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Ton/Jam"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tekanan Kerja (kg/cm²)"
          keyboardType="numeric"
          value={data.workingPressure}
          onChangeText={t => setData({ ...data, workingPressure: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Suhu Desain (°C)"
          keyboardType="numeric"
          value={data.tempDesain}
          onChangeText={t => setData({ ...data, tempDesain: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="2. Perlengkapan Pengaman"
        left={p => <List.Icon {...p} icon="shield-alert" />}
      >
        {renderCheckItem('Safety Valve (Katup Pengaman)', 'chkSafetyValve')}
        {renderCheckItem('Gelas Duga (Water Level Gauge)', 'chkWaterLevel')}
        {renderCheckItem('Manometer (Pressure Gauge)', 'chkManometer')}
        {renderCheckItem('Plug Pelebur (Fusible Plug)', 'chkFusiblePlug')}
        {renderCheckItem('Sistem Alarm High-Low Water', 'chkAlarmBoiler')}
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="3. Badan & Sistem Pipa"
        left={p => <List.Icon {...p} icon="pipe" />}
      >
        {renderCheckItem('Kondisi Kulit Badan (Shell)', 'chkShellCondition')}
        {renderCheckItem('Kondisi Lorong Api (Furnace)', 'chkFurnace')}
        {renderCheckItem('Sistem Pembuangan (Blowdown)', 'chkBlowdown')}
        {renderCheckItem('Sistem Air Umpan (Feed Water)', 'chkFeedWater')}
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="4. Dokumentasi Foto"
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
