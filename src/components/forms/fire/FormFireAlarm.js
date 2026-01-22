import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormFireAlarm = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: PANEL KENDALI (MCFA) */}
      <List.Accordion
        title="1. Main Control Fire Alarm (MCFA)"
        left={p => (
          <List.Icon {...p} icon="monitor-dashboard" color="#ef4444" />
        )}
      >
        <TextInput
          label="Merk & Tipe Panel"
          placeholder="Contoh: Hooseki / Hong Chang / Simplex"
          value={data.merkPanel}
          onChangeText={t => setData({ ...data, merkPanel: t })}
          mode="outlined"
          style={styles.input}
        />
        <Checkbox.Item
          label="Status Panel 'Normal' (Bebas Fault/Trouble)"
          status={data.chkStatusNormal === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkStatusNormal')}
          mode="android"
        />
        <Checkbox.Item
          label="Baterai Cadangan (Back-up Battery)"
          status={data.chkBaterai === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBaterai')}
          mode="android"
        />
        <Checkbox.Item
          label="Fungsi Lampu Indikator & Buzzer Panel"
          status={data.chkIndikator === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkIndikator')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: PERANGKAT INISIASI (DETEKTOR & MCP) */}
      <List.Accordion
        title="2. Detektor & Manual Station"
        left={p => <List.Icon {...p} icon="smoke-detector" color="#ef4444" />}
      >
        <Text style={styles.subTitleSection}>Uji Fungsi Perangkat:</Text>
        <Checkbox.Item
          label="Smoke Detector (Uji Asap)"
          status={data.chkSmokeDet === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSmokeDet')}
          mode="android"
        />
        <Checkbox.Item
          label="Heat Detector (Uji Panas)"
          status={data.chkHeatDet === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkHeatDet')}
          mode="android"
        />
        <Checkbox.Item
          label="Manual Call Point (Break Glass/Push)"
          status={data.chkMCP === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMCP')}
          mode="android"
        />
        <Checkbox.Item
          label="Kebersihan Head Detektor"
          status={data.chkBersihDet === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBersihDet')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: PERANGKAT OUTPUT (NOTIFIKASI) */}
      <List.Accordion
        title="3. Notifikasi & Output"
        left={p => <List.Icon {...p} icon="bell-ring" color="#ef4444" />}
      >
        <Checkbox.Item
          label="Alarm Bell / Sirine Terdengar Jelas"
          status={data.chkBell === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBell')}
          mode="android"
        />
        <Checkbox.Item
          label="Indicator Lamp (Nyala Merah)"
          status={data.chkLamp === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLamp')}
          mode="android"
        />
        <Checkbox.Item
          label="Interlock ke Lift/Fan/Pompa (Jika Ada)"
          status={data.chkInterlock === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkInterlock')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: DOKUMENTASI */}
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
