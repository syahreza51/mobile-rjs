import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormInstalasiListrik = ({
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
      {/* SEKSI 1: DATA IDENTITAS INSTALASI */}
      <List.Accordion
        title="1. Spesifikasi Instalasi"
        left={p => (
          <List.Icon {...p} icon="information-outline" color="#eab308" />
        )}
      >
        <TextInput
          label="Sumber Listrik (PLN/Genset/Solar)"
          value={data.sumberListrik}
          onChangeText={t => setData({ ...data, sumberListrik: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tegangan Terukur (V)"
          placeholder="Contoh: 228V"
          keyboardType="numeric"
          value={data.tegangan}
          onChangeText={t => setData({ ...data, tegangan: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Total Beban Terpasang (Watt/kVA)"
          keyboardType="numeric"
          value={data.bebanWatt}
          onChangeText={t => setData({ ...data, bebanWatt: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: PEMERIKSAAN VISUAL (KONDISI FISIK) */}
      <List.Accordion
        title="2. Pemeriksaan Visual"
        left={p => <List.Icon {...p} icon="eye" color="#eab308" />}
      >
        <Checkbox.Item
          label="Kondisi Kabel (Tidak Terkelupas/Getas)"
          status={data.chkKabel === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkKabel')}
          mode="android"
        />
        <Checkbox.Item
          label="Kerapihan Jalur (Trunking/Tray/Conduit)"
          status={data.chkRapih === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRapih')}
          mode="android"
        />
        <Checkbox.Item
          label="Kondisi Saklar & Stop Kontak (Tidak Hangus)"
          status={data.chkAksesories === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkAksesories')}
          mode="android"
        />
        <Checkbox.Item
          label="Pemasangan Label & Tanda Bahaya"
          status={data.chkLabel === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLabel')}
          mode="android"
        />
        <Checkbox.Item
          label="Penerangan Darurat (Emergency Light)"
          status={data.chkEmergencyLight === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEmergencyLight')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: PENGUJIAN TEKNIS (K3) */}
      <List.Accordion
        title="3. Pengujian Teknis & Proteksi"
        left={p => <List.Icon {...p} icon="hammer-wrench" color="#eab308" />}
      >
        <TextInput
          label="Nilai Tahanan Isolasi (MΩ)"
          placeholder="Min 0.5 MΩ (PUIL)"
          keyboardType="numeric"
          value={data.isolasiOhm}
          onChangeText={t => setData({ ...data, isolasiOhm: t })}
          mode="outlined"
          style={styles.input}
        />

        <Text style={styles.subTitleSection}>Uji Proteksi:</Text>
        <Checkbox.Item
          label="Fungsi ELCB/RCD (30mA / 300mA)"
          status={data.chkElcbFungsi === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkElcbFungsi')}
          mode="android"
        />
        <Checkbox.Item
          label="Sistem Pembumian (Grounding) Terhubung"
          status={data.chkGroundingInstalasi === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkGroundingInstalasi')}
          mode="android"
        />
        <Checkbox.Item
          label="Polaritas Kabel (L-N-E) Benar"
          status={data.chkPolaritas === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPolaritas')}
          mode="android"
        />
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
