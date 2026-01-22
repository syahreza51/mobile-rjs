import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormMesinPress = ({
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
      {/* SEKSI 1: SPESIFIKASI TEKNIS */}
      <List.Accordion
        title="1. Spesifikasi Mesin"
        left={p => <List.Icon {...p} icon="tray-arrow-down" color="#0ea5e9" />}
      >
        <TextInput
          label="Merk & Tipe Mesin"
          value={data.merkMesin}
          onChangeText={t => setData({ ...data, merkMesin: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Tekan (Ton)"
          keyboardType="numeric"
          value={data.kapasitasTon}
          onChangeText={t => setData({ ...data, kapasitasTon: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Sistem Penggerak (Mekanik/Hidrolik/Pneumatik)"
          value={data.sistemPenggerak}
          onChangeText={t => setData({ ...data, sistemPenggerak: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: SISTEM SAFETY & SENSOR */}
      <List.Accordion
        title="2. Sistem Keamanan & Proteksi"
        left={p => <List.Icon {...p} icon="shield-home" color="#0ea5e9" />}
      >
        <Text style={styles.subTitleSection}>Sistem Proteksi Jari:</Text>
        <Checkbox.Item
          label="Safety Light Curtain (Sensor Cahaya)"
          status={data.chkLightCurtain === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLightCurtain')}
          mode="android"
        />
        <Checkbox.Item
          label="Two-Hand Control (Kontrol 2 Tangan)"
          status={data.chkTwoHand === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkTwoHand')}
          mode="android"
        />
        <Checkbox.Item
          label="Safety Guard / Pagar Pelindung Side"
          status={data.chkSafetyGuard === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSafetyGuard')}
          mode="android"
        />

        <Text style={styles.subTitleSection}>Mekanisme Darurat:</Text>
        <Checkbox.Item
          label="Emergency Stop (Mudah Dijangkau)"
          status={data.chkEStop === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEStop')}
          mode="android"
        />
        <Checkbox.Item
          label="Fungsi Rem & Kopling (Clutch)"
          status={data.chkClutch === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkClutch')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: KONDISI STRUKTUR & DIES */}
      <List.Accordion
        title="3. Struktur & Cetakan (Dies)"
        left={p => <List.Icon {...p} icon="hammer-wrench" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Kondisi Ram & Slide (Tidak Goyang)"
          status={data.chkRam === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRam')}
          mode="android"
        />
        <Checkbox.Item
          label="Kekencangan Baut Pengikat Dies"
          status={data.chkDiesBolt === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkDiesBolt')}
          mode="android"
        />
        <Checkbox.Item
          label="Sistem Pelumasan Otomatis"
          status={data.chkLube === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLube')}
          mode="android"
        />
        <Checkbox.Item
          label="Kebocoran Oli/Udara (Oil/Air Leak)"
          status={data.chkLeak === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLeak')}
          mode="android"
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
