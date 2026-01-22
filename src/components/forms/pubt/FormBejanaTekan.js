import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, List, Divider } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormBejanaTekan = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  const renderCheckItem = (label, key) => (
    <Checkbox.Item label={label} status={data[key] === 'MS' ? 'checked' : 'unchecked'} onPress={() => toggleCondition(key)} mode="android" />
  );

  return (
    <View>
      <List.Accordion title="1. Identitas Bejana" left={p => <List.Icon {...p} icon="tanker-truck" />}>
        <TextInput label="Jenis Media (Angin/Gas/Liquid)" value={data.media} onChangeText={t => setData({ ...data, media: t })} mode="outlined" style={styles.input} />
        <TextInput label="Volume (Liter/m³)" value={data.volume} onChangeText={t => setData({ ...data, volume: t })} mode="outlined" style={styles.input} />
        <TextInput label="Tekanan Uji (Hydrotest)" keyboardType="numeric" value={data.testPressure} onChangeText={t => setData({ ...data, testPressure: t })} mode="outlined" style={styles.input} />
      </List.Accordion>

      <Divider />

      <List.Accordion title="2. Pemeriksaan Visual & Safety" left={p => <List.Icon {...p} icon="magnify" />}>
        {renderCheckItem('Safety Valve / Rupture Disc', 'chkSafetyDevice')}
        {renderCheckItem('Drain Valve (Katup Pembuang)', 'chkDrainValve')}
        {renderCheckItem('Kondisi Karat / Korosi', 'chkCorrosion')}
        {renderCheckItem('Sambungan Las (Welding Joint)', 'chkWelding')}
        {renderCheckItem('Saddle / Kaki Penyangga', 'chkSupport')}
      </List.Accordion>

      <Divider />

      <List.Accordion title="3. Dokumentasi Foto" left={p => <List.Icon {...p} icon="camera" />}>
        <PhotoManager 
          photos={data.dokumentasi || []} 
          onPhotosChange={(newPhotos) => setData({ ...data, dokumentasi: newPhotos })}
          requestPermission={requestPermission}
        />
      </List.Accordion>
    </View>
  );
};