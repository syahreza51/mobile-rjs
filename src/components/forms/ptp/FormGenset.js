import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormGenset = ({ data, setData, styles, requestPermission }) => {
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  return (
    <View>
      {/* SEKSI 1: IDENTITAS UNIT GENSET */}
      <List.Accordion
        title="1. Identitas Unit Genset"
        left={p => <List.Icon {...p} icon="generator-mobile" color="#0ea5e9" />}
      >
        <TextInput
          label="Merk & Kapasitas (kVA)"
          placeholder="Contoh: Cummins 500 kVA"
          value={data.merkKapasitas}
          onChangeText={t => setData({ ...data, merkKapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tipe Generator"
          placeholder="Contoh: Stamford / Leroy Somer"
          value={data.tipeGen}
          onChangeText={t => setData({ ...data, tipeGen: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tegangan Output (V) & Fasa"
          placeholder="Contoh: 380V / 3 Phase"
          value={data.voltagePhase}
          onChangeText={t => setData({ ...data, voltagePhase: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: SISTEM PENGAMAN ELEKTRIKAL */}
      <List.Accordion
        title="2. Pengaman & Panel Kontrol"
        left={p => <List.Icon {...p} icon="lightning-bolt" color="#0ea5e9" />}
      >
        <Checkbox.Item
          label="Grounding Frame & Netral (Pembumian)"
          status={data.chkGrounding === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkGrounding')}
          mode="android"
        />
        <Checkbox.Item
          label="Circuit Breaker (MCCB/ACB) Berfungsi"
          status={data.chkBreaker === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBreaker')}
          mode="android"
        />
        <Checkbox.Item
          label="Fungsi ATS / AMF (Auto Transfer)"
          status={data.chkAts === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkAts')}
          mode="android"
        />
        <Checkbox.Item
          label="Kondisi Terminal Kabel (Kencang/Rapi)"
          status={data.chkTerminals === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkTerminals')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: PENGUJIAN OPERASIONAL (RUNNING TEST) */}
      <List.Accordion
        title="3. Parameter Operasional"
        left={p => <List.Icon {...p} icon="gauge" color="#0ea5e9" />}
      >
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            label="Frekuensi (Hz)"
            keyboardType="numeric"
            value={data.frequency}
            onChangeText={t => setData({ ...data, frequency: t })}
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            label="Jam Kerja (Hour Meter)"
            keyboardType="numeric"
            value={data.hourMeter}
            onChangeText={t => setData({ ...data, hourMeter: t })}
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
          />
        </View>
        <Checkbox.Item
          label="Sistem Pendingin (Radiator/Coolant)"
          status={data.chkRadiator === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRadiator')}
          mode="android"
        />
        <Checkbox.Item
          label="Exhaust System (Tidak Bocor/Hitam)"
          status={data.chkExhaust === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkExhaust')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: LINGKUNGAN RUANG GENSET */}
      <List.Accordion
        title="4. Kondisi Ruang Genset (Power House)"
        left={p => (
          <List.Icon {...p} icon="home-lightning-bolt" color="#0ea5e9" />
        )}
      >
        <Checkbox.Item
          label="Peredam Suara (Soundproof) / Canopy"
          status={data.chkSoundproof === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSoundproof')}
          mode="android"
        />
        <Checkbox.Item
          label="Penerangan Ruang Memadai"
          status={data.chkLamp === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLamp')}
          mode="android"
        />
        <Checkbox.Item
          label="Tersedia APAR CO2/Powder di Dekat Unit"
          status={data.chkApar === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkApar')}
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
