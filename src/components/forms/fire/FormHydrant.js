import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormHydrant = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: IDENTITAS & LOKASI */}
      <List.Accordion
        title="1. Identitas & Lokasi"
        left={p => (
          <List.Icon {...p} icon="map-marker-radius" color="#ef4444" />
        )}
      >
        <TextInput
          label="Kode / No. Pillar Hydrant"
          placeholder="Contoh: HYD-EXT-01"
          value={data.noHydrant}
          onChangeText={t => setData({ ...data, noHydrant: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Lokasi (Area/Zona)"
          value={data.lokasiHydrant}
          onChangeText={t => setData({ ...data, lokasiHydrant: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Reservoir (m3)"
          keyboardType="numeric"
          value={data.kapasitasAir}
          onChangeText={t => setData({ ...data, kapasitasAir: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: KONDISI BOX & AKSESORIS */}
      <List.Accordion
        title="2. Kelengkapan Box & Aksesoris"
        left={p => <List.Icon {...p} icon="toolbox" color="#ef4444" />}
      >
        <Text style={styles.subTitleSection}>Kondisi Komponen:</Text>
        <Checkbox.Item
          label="Kondisi Box (Tidak Korosi/Rusak)"
          status={data.chkBox === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBox')}
          mode="android"
        />
        <Checkbox.Item
          label="Selang (Hose) - Kondisi Kering & Baik"
          status={data.chkHoseHydrant === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkHoseHydrant')}
          mode="android"
        />
        <Checkbox.Item
          label="Nozzle (Variabel/Jet) Tersedia"
          status={data.chkNozzle === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkNozzle')}
          mode="android"
        />
        <Checkbox.Item
          label="Hydrant Valve / Kran (Mudah Diputar)"
          status={data.chkValve === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkValve')}
          mode="android"
        />
        <Checkbox.Item
          label="Kunci Hydrant (Spanner Wrench)"
          status={data.chkKunci === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkKunci')}
          mode="android"
        />
        <Checkbox.Item
          label="Hose Rack / Rak Selang Rapi"
          status={data.chkRack === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRack')}
          mode="android"
        />
        <Checkbox.Item
          label="Siamese Connection (Kondisi Baik)"
          status={data.chkSiamese === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSiamese')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: PENGUJIAN POMPA & TEKANAN */}
      <List.Accordion
        title="3. Pengujian Pompa & Tekanan"
        left={p => <List.Icon {...p} icon="gauge" color="#ef4444" />}
      >
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            label="Statik (Bar)"
            keyboardType="numeric"
            value={data.staticPressure}
            onChangeText={t => setData({ ...data, staticPressure: t })}
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            label="Aliran (Bar)"
            keyboardType="numeric"
            value={data.flowPressure}
            onChangeText={t => setData({ ...data, flowPressure: t })}
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        <Text style={styles.subTitleSection}>Status Pompa (Auto/Manual):</Text>
        <Checkbox.Item
          label="Jockey Pump (Penjaga Tekanan)"
          status={data.chkJockey === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkJockey')}
          mode="android"
        />
        <Checkbox.Item
          label="Main Electric Pump (Utama)"
          status={data.chkMainPump === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMainPump')}
          mode="android"
        />
        <Checkbox.Item
          label="Diesel Pump (Cadangan Darurat)"
          status={data.chkDieselPump === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkDieselPump')}
          mode="android"
        />
        <TextInput
          label="Level Air Reservoir (%)"
          keyboardType="numeric"
          value={data.levelAir}
          onChangeText={t => setData({ ...data, levelAir: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: DOKUMENTASI FOTO */}
      <List.Accordion
        title="4. Dokumentasi Foto"
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
