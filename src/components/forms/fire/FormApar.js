import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormApar = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      <List.Accordion
        title="1. Identitas APAR"
        left={p => <List.Icon {...p} icon="tag" color="#ef4444" />}
      >
        <TextInput
          label="Nomor Tabung"
          value={data.noTabung}
          onChangeText={t => setData({ ...data, noTabung: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Jenis Media (Powder/CO2/Foam)"
          value={data.mediaApar}
          onChangeText={t => setData({ ...data, mediaApar: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas (Kg)"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Masa Berlaku Media (Expired)"
          placeholder="MM/YYYY"
          value={data.expDate}
          onChangeText={t => setData({ ...data, expDate: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="2. Pemeriksaan Kondisi Fisik"
        left={p => <List.Icon {...p} icon="eye" color="#ef4444" />}
      >
        <Checkbox.Item
          label="Tekanan (Manometer di Area Hijau)"
          status={data.chkPressure === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPressure')}
          mode="android"
        />
        <Checkbox.Item
          label="Pin Pengaman & Segel"
          status={data.chkSeal === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSeal')}
          mode="android"
        />
        <Checkbox.Item
          label="Selang / Hose (Tidak Retak)"
          status={data.chkHose === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkHose')}
          mode="android"
        />
        <Checkbox.Item
          label="Kondisi Tabung (Tidak Berkarat)"
          status={data.chkTabung === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkTabung')}
          mode="android"
        />
        <Checkbox.Item
          label="Pemasangan (Tinggi 1.2m dari Lantai)"
          status={data.chkPosisi === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPosisi')}
          mode="android"
        />
        <Checkbox.Item
          label="Tanda Pemasangan APAR (Segitiga)"
          status={data.chkSign === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSign')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="3. Dokumentasi Foto"
        left={p => <List.Icon {...p} icon="camera" />}
      >
        <PhotoManager
          photos={data.dokumentasi || []}
          onPhotosChange={n => setData({ ...data, dokumentasi: n })}
          requestPermission={requestPermission}
        />
      </List.Accordion>
    </View>
  );
};
