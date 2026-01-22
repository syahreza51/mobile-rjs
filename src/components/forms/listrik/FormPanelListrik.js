import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormPanelListrik = ({
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
      {/* SEKSI 1: IDENTITAS & KOMPONEN VISUAL */}
      <List.Accordion
        title="1. Komponen & Visual"
        left={p => <List.Icon {...p} icon="door-closed-lock" color="#eab308" />}
      >
        <TextInput
          label="Nama Panel (Contoh: LVMDP / SDP)"
          value={data.namaPanel}
          onChangeText={t => setData({ ...data, namaPanel: t })}
          mode="outlined"
          style={styles.input}
        />
        <Checkbox.Item
          label="Fungsi MCB / MCCB / Breaker"
          status={data.chkMCB === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMCB')}
          mode="android"
        />
        <Checkbox.Item
          label="Fungsi ELCB / RCD"
          status={data.chkELCB === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkELCB')}
          mode="android"
        />
        <Checkbox.Item
          label="Kekencangan Terminal Kabel"
          status={data.chkTerminal === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkTerminal')}
          mode="android"
        />
        <Checkbox.Item
          label="Ketersediaan Single Line Diagram"
          status={data.chkSLD === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSLD')}
          mode="android"
        />
        <Checkbox.Item
          label="Kebersihan & Kerapihan Dalam Panel"
          status={data.chkBersih === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBersih')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: PENGUKURAN BEBAN (AMPERE) */}
      <List.Accordion
        title="2. Pengukuran Beban Arus (Ampere)"
        left={p => (
          <List.Icon
            {...p}
            icon="chart-bell-curve-cumulative"
            color="#eab308"
          />
        )}
      >
        <Text style={[styles.statusLabel, { marginTop: 10 }]}>
          Arus Tiap Fasa:
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            label="R (A)"
            placeholder="0"
            keyboardType="numeric"
            value={data.arusR}
            onChangeText={t => setData({ ...data, arusR: t })}
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            label="S (A)"
            placeholder="0"
            keyboardType="numeric"
            value={data.arusS}
            onChangeText={t => setData({ ...data, arusS: t })}
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            label="T (A)"
            placeholder="0"
            keyboardType="numeric"
            value={data.arusT}
            onChangeText={t => setData({ ...data, arusT: t })}
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
          />
        </View>
        <TextInput
          label="N / Netral (A)"
          keyboardType="numeric"
          value={data.arusN}
          onChangeText={t => setData({ ...data, arusN: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: THERMOGRAPHY (SUHU) */}
      <List.Accordion
        title="3. Pemeriksaan Suhu (Thermography)"
        left={p => <List.Icon {...p} icon="thermometer" color="#eab308" />}
      >
        <TextInput
          label="Suhu Terminal Utama (°C)"
          placeholder="Normal < 40°C"
          keyboardType="numeric"
          value={data.suhuTerminal}
          onChangeText={t => setData({ ...data, suhuTerminal: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Suhu Kabel Utama (°C)"
          keyboardType="numeric"
          value={data.suhuKabel}
          onChangeText={t => setData({ ...data, suhuKabel: t })}
          mode="outlined"
          style={styles.input}
        />
        <Text
          style={{
            fontSize: 12,
            color: '#64748b',
            fontStyle: 'italic',
            paddingHorizontal: 10,
          }}
        >
          *Gunakan infrared thermometer untuk mengecek hotspot pada sambungan
          baut.
        </Text>
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
