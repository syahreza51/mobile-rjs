import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Divider, List, Text } from 'react-native-paper';
import { PhotoManager } from '../shared/PhotoManager';

export const FormLiftPenumpang = ({
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
      {/* SEKSI 1: DATA TEKNIS MENDALAM */}
      <List.Accordion
        title="1. Spesifikasi Teknis & Identitas"
        left={p => <List.Icon {...p} icon="information" color="#8b5cf6" />}
      >
        <TextInput
          label="Merk & Pabrikan"
          value={data.merk}
          onChangeText={t => setData({ ...data, merk: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Nomor Objek (No. Seri)"
          value={data.noSeri}
          onChangeText={t => setData({ ...data, noSeri: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas Angkut (Kg/Orang)"
          placeholder="Contoh: 1000kg / 15 Orang"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kecepatan (m/s)"
          keyboardType="numeric"
          value={data.speed}
          onChangeText={t => setData({ ...data, speed: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tipe Penggerak (Traction/Hydraulic)"
          value={data.tipeDrive}
          onChangeText={t => setData({ ...data, tipeDrive: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 2: RUANG MESIN (MACHINE ROOM) */}
      <List.Accordion
        title="2. Ruang Mesin (Pusat Kendali)"
        left={p => <List.Icon {...p} icon="cog-box" color="#8b5cf6" />}
      >
        <Text style={styles.subTitleSection}>Mesin & Governor:</Text>
        <Checkbox.Item
          label="Governor (Kecepatan Trip Sesuai)"
          status={data.chkGovernor === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkGovernor')}
          mode="android"
        />
        <Checkbox.Item
          label="Sistem Rem (Clearance Lining & Per)"
          status={data.chkBrake === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBrake')}
          mode="android"
        />
        <Checkbox.Item
          label="Wire Rope (Kawat Baja) - Tidak Aus"
          status={data.chkRope === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkRope')}
          mode="android"
        />
        <Checkbox.Item
          label="Pulley / Sheave (Tidak Retak/Aus)"
          status={data.chkSheave === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSheave')}
          mode="android"
        />

        <Text style={styles.subTitleSection}>Elektrikal Panel:</Text>
        <Checkbox.Item
          label="Main Switch & Fuse (Berfungsi)"
          status={data.chkMainSwitch === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkMainSwitch')}
          mode="android"
        />
        <Checkbox.Item
          label="E-Stop di Ruang Mesin"
          status={data.chkEStopMR === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEStopMR')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 3: SANGKAR & PINTU (CAR & LANDING) */}
      <List.Accordion
        title="3. Kereta Sangkar & Pintu"
        left={p => (
          <List.Icon {...p} icon="elevator-passenger" color="#8b5cf6" />
        )}
      >
        <Text style={styles.subTitleSection}>Pintu (Doors):</Text>
        <Checkbox.Item
          label="Interlock Pintu Luar (Mechanic/Electric)"
          status={data.chkInterlock === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkInterlock')}
          mode="android"
        />
        <Checkbox.Item
          label="Door Sensor / Safety Shoe (Reopen)"
          status={data.chkDoorSafety === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkDoorSafety')}
          mode="android"
        />
        <Checkbox.Item
          label="Kondisi Sill (Rel Pintu) Bersih"
          status={data.chkSill === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSill')}
          mode="android"
        />

        <Text style={styles.subTitleSection}>Interior Sangkar:</Text>
        <Checkbox.Item
          label="Emergency Call & Alarm (Aktif)"
          status={data.chkAlarm === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkAlarm')}
          mode="android"
        />
        <Checkbox.Item
          label="Lampu Darurat (Menyala saat Mati Listrik)"
          status={data.chkEmerLight === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkEmerLight')}
          mode="android"
        />
        <Checkbox.Item
          label="Load Cell (Indikator Overload)"
          status={data.chkOverload === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkOverload')}
          mode="android"
        />
        <Checkbox.Item
          label="Plat Kapasitas & Petunjuk Penggunaan"
          status={data.chkPlate === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPlate')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 4: HOISTWAY & PIT */}
      <List.Accordion
        title="4. Hoistway & Pit (Celah Bawah)"
        left={p => (
          <List.Icon {...p} icon="arrow-down-bold-box" color="#8b5cf6" />
        )}
      >
        <Checkbox.Item
          label="Limit Switch (Final Limit Atas/Bawah)"
          status={data.chkLimit === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkLimit')}
          mode="android"
        />
        <Checkbox.Item
          label="Buffer (Peredam Hidrolik/Spring)"
          status={data.chkBuffer === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkBuffer')}
          mode="android"
        />
        <Checkbox.Item
          label="Safety Gear (Jepit Rel) - Uji Fungsi"
          status={data.chkSafetyGear === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkSafetyGear')}
          mode="android"
        />
        <Checkbox.Item
          label="Kebersihan Pit (Bebas Air/Sampah)"
          status={data.chkPit === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPit')}
          mode="android"
        />
        <Checkbox.Item
          label="Penerangan Hoistway & Pit"
          status={data.chkPitLight === 'MS' ? 'checked' : 'unchecked'}
          onPress={() => toggleCondition('chkPitLight')}
          mode="android"
        />
      </List.Accordion>

      <Divider />

      {/* SEKSI 5: PENGUJIAN BEBAN (LOAD TEST) */}
      <List.Accordion
        title="5. Catatan Pengujian"
        left={p => <List.Icon {...p} icon="weight" color="#8b5cf6" />}
      >
        <TextInput
          label="Hasil Uji Rem (Full Load)"
          placeholder="MS / TMS"
          value={data.ujiRem}
          onChangeText={t => setData({ ...data, ujiRem: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Hasil Uji ARD (Auto Rescue)"
          placeholder="Berfungsi / Tidak"
          value={data.ujiArd}
          onChangeText={t => setData({ ...data, ujiArd: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      <List.Accordion
        title="6. Dokumentasi Foto"
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
