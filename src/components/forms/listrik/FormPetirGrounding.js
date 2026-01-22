import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormPetirGrounding = ({
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
      {/* SEKSI 1: IDENTITAS GROUNDING */}
      <List.Accordion
        title="1. Informasi Titik Grounding"
        left={p => (
          <List.Icon {...p} icon="map-marker-radius" color="#eab308" />
        )}
      >
        <TextInput
          label="Lokasi / Nama Titik (Contoh: Bak Kontrol Mesin A)"
          value={data.lokasiGrounding}
          onChangeText={t => setData({ ...data, lokasiGrounding: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Jenis Elektroda (Batang/Pita/Plat)"
          placeholder="Contoh: Rod / Copper Rod"
          value={data.jenisElektroda}
          onChangeText={t => setData({ ...data, jenisElektroda: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Alat Ukur (Earth Tester)"
          placeholder="Merk & Tipe"
          value={data.alatUkur}
          onChangeText={t => setData({ ...data, alatUkur: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: HASIL PENGUKURAN */}
      <List.Accordion
        title="2. Hasil Pengukuran (Ohm)"
        left={p => <List.Icon {...p} icon="lightning-bolt" color="#eab308" />}
      >
        <TextInput
          label="Nilai Tahanan Pembumian (Ω)"
          placeholder="Standar PUIL < 5 Ohm"
          keyboardType="numeric"
          value={data.nilaiOhm}
          onChangeText={t => setData({ ...data, nilaiOhm: t })}
          mode="outlined"
          style={styles.input}
        />
        <Text
          style={{
            fontSize: 12,
            color: '#dc2626',
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          *Untuk peralatan elektronik sensitif (Server/IT), disarankan &lt; 1
          Ohm.
        </Text>
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: PEMERIKSAAN FISIK */}
      <List.Accordion
        title="3. Pemeriksaan Kondisi Fisik"
        left={p => <List.Icon {...p} icon="magnify" color="#eab308" />}
      >
        <Checkbox.Item
          label="Kondisi Kabel Penghubung (BC/G)"
          status={data.chkConductor === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkConductor')}
          mode="android"
        />
        <Checkbox.Item
          label="Kekencangan Sambungan (Schoen/Bolt)"
          status={data.chkSambungan === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSambungan')}
          mode="android"
        />
        <Checkbox.Item
          label="Bak Kontrol (Bersih & Mudah Akses)"
          status={data.chkBakKontrol === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBakKontrol')}
          mode="android"
        />
        <Checkbox.Item
          label="Label Penomoran Titik Grounding"
          status={data.chkLabel === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLabel')}
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
          onPhotosChange={newPhotos =>
            setData({ ...data, dokumentasi: newPhotos })
          }
          requestPermission={requestPermission}
        />
      </List.Accordion>
    </View>
  );
};
