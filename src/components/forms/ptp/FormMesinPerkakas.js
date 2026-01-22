import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormMesinPerkakas = ({
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
      {/* SEKSI 1: IDENTITAS MESIN */}
      <List.Accordion
        title="1. Identitas Mesin"
        left={p => <List.Icon {...p} icon="engine-outline" color="#0ea5e9" />}
      >
        <TextInput
          label="Nama/Fungsi Mesin"
          placeholder="Contoh: Mesin Bubut Horizontal / Milling"
          value={data.namaMesin}
          onChangeText={t => setData({ ...data, namaMesin: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Merk & Tipe"
          value={data.merkMesin}
          onChangeText={t => setData({ ...data, merkMesin: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas / Daya (kW/HP)"
          keyboardType="numeric"
          value={data.kapasitasMesin}
          onChangeText={t => setData({ ...data, kapasitasMesin: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: PENGAMAN MEKANIK (SAFETY GUARDING) */}
      <List.Accordion
        title="2. Sistem Pengaman & Transmisi"
        left={p => <List.Icon {...p} icon="shield-cog" color="#0ea5e9" />}
      >
        <Text style={styles.subTitleSection}>Pelindung Bahaya:</Text>
        <Checkbox.Item
          label="Tutup Pelindung Transmisi (V-Belt/Gear)"
          status={data.chkGuardTransmisi === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkGuardTransmisi')}
          mode="android"
        />
        <Checkbox.Item
          label="Pelindung Chuck (Chuck Guard)"
          status={data.chkChuckGuard === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkChuckGuard')}
          mode="android"
        />
        <Checkbox.Item
          label="Pelindung Serpihan (Splatter Guard)"
          status={data.chkSplatter === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSplatter')}
          mode="android"
        />
        <Checkbox.Item
          label="Kondisi Tool Post / Dudukan Pisau"
          status={data.chkToolPost === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkToolPost')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: SISTEM KONTROL & KELISTRIKAN */}
      <List.Accordion
        title="3. Kontrol & Kelistrikan"
        left={p => <List.Icon {...p} icon="lightning-bolt" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Tombol Emergency Stop (Berfungsi)"
          status={data.chkEStop === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEStop')}
          mode="android"
        />
        <Checkbox.Item
          label="Sakelar On/Off (Kondisi Baik)"
          status={data.chkSwitch === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSwitch')}
          mode="android"
        />
        <Checkbox.Item
          label="Grounding Body Mesin"
          status={data.chkGroundingMesin === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkGroundingMesin')}
          mode="android"
        />
        <Checkbox.Item
          label="Lampu Penerangan Mesin"
          status={data.chkLamp === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLamp')}
          mode="android"
        />
        <Checkbox.Item
          label="Rem Kaki / Foot Brake (Jika Ada)"
          status={data.chkFootBrake === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkFootBrake')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: LINGKUNGAN & APD */}
      <List.Accordion
        title="4. Lingkungan Kerja & APD"
        left={p => <List.Icon {...p} icon="account-hard-hat" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Kebersihan dari Bram / Serpihan"
          status={data.chkBersihBram === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBersihBram')}
          mode="android"
        />
        <Checkbox.Item
          label="Lantai Tidak Licin (Bebas Oli)"
          status={data.chkLantai === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLantai')}
          mode="android"
        />
        <Checkbox.Item
          label="Tersedia SOP di Dekat Mesin"
          status={data.chkSop === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSop')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="5. Dokumentasi Foto"
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
