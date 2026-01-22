import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormEvakuasiSuppression = ({
  data,
  setData,
  styles,
  requestPermission,
}) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: SARANA EVAKUASI */}
      <List.Accordion
        title="1. Sarana Evakuasi & Exit"
        left={p => <List.Icon {...p} icon="exit-run" color="#ef4444" />}
      >
        <Checkbox.Item
          label="Lampu Darurat (Emergency Light) Menyala"
          status={data.chkEmergencyLight === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEmergencyLight')}
          mode="android"
        />
        <Checkbox.Item
          label="Penunjuk Arah EXIT (Exit Sign) Menyala"
          status={data.chkExitSign === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkExitSign')}
          mode="android"
        />
        <Checkbox.Item
          label="Jalur Evakuasi Bebas Hambatan"
          status={data.chkPathClear === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPathClear')}
          mode="android"
        />
        <Checkbox.Item
          label="Pintu Darurat (Emergency Door) Berfungsi"
          status={data.chkDoor === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkDoor')}
          mode="android"
        />
        <Checkbox.Item
          label="Denah Evakuasi Terpasang"
          status={data.chkMap === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMap')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: GAS SUPPRESSION SYSTEM (CO2/FM200) */}
      <List.Accordion
        title="2. Gas Suppression (Server/Panel)"
        left={p => <List.Icon {...p} icon="gas-cylinder" color="#ef4444" />}
      >
        <TextInput
          label="Nama Ruangan (Contoh: Server Room)"
          value={data.ruangGas}
          onChangeText={t => setData({ ...data, ruangGas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tekanan Tabung Gas (Bar/Psi)"
          keyboardType="numeric"
          value={data.pressGas}
          onChangeText={t => setData({ ...data, pressGas: t })}
          mode="outlined"
          style={styles.input}
        />
        <Checkbox.Item
          label="Manual Release Station (Kondisi Aman)"
          status={data.chkManualRelease === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkManualRelease')}
          mode="android"
        />
        <Checkbox.Item
          label="Aborting Switch (Fungsi Normal)"
          status={data.chkAbortSwitch === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkAbortSwitch')}
          mode="android"
        />
        <Checkbox.Item
          label="Kerapihan Ruangan (Pintu Rapat/Seal)"
          status={data.chkSealing === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSealing')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: DOKUMENTASI */}
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
