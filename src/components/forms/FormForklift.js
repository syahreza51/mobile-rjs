import React from 'react';
import { View } from 'react-native';
import { TextInput, Checkbox, Text, Divider, List } from 'react-native-paper';
import { PhotoSection } from './PhotoSection';

export const FormForklift = ({ data, setData, styles, requestPermission }) => {
  // Fungsi helper untuk checklist (MS = Memenuhi Syarat, TMS = Tidak Memenuhi Syarat)
  const toggleCondition = key => {
    setData({ ...data, [key]: data[key] === 'MS' ? 'TMS' : 'MS' });
  };

  const renderCheckItem = (label, key) => (
    <Checkbox.Item
      label={label}
      status={data[key] === 'MS' ? 'checked' : 'unchecked'}
      onPress={() => toggleCondition(key)}
      mode="android"
    />
  );

  return (
    <View>
      {/* --- 1. SPESIFIKASI TEKNIS --- */}
      <List.Accordion
        title="1. Spesifikasi Pesawat"
        left={p => <List.Icon {...p} icon="engine" />}
      >
        <TextInput
          label="Merk / Model"
          value={data.merkModel}
          onChangeText={t => setData({ ...data, merkModel: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Serial Number"
          value={data.sn}
          onChangeText={t => setData({ ...data, sn: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Kapasitas (Kg)"
          keyboardType="numeric"
          value={data.kapasitas}
          onChangeText={t => setData({ ...data, kapasitas: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tinggi Angkat (mm)"
          keyboardType="numeric"
          value={data.tinggiAngkat}
          onChangeText={t => setData({ ...data, tinggiAngkat: t })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Tekanan Hydraulic (Bar)"
          keyboardType="numeric"
          value={data.pressHydraulic}
          onChangeText={t => setData({ ...data, pressHydraulic: t })}
          mode="outlined"
          style={styles.input}
        />
      </List.Accordion>

      <Divider />

      {/* --- 2. CHASSIS & BODI --- */}
      <List.Accordion
        title="2. Kerangka & Bodi"
        left={p => <List.Icon {...p} icon="truck-cargo-container" />}
      >
        {renderCheckItem('Kondisi Rangka (Retak/Korosi)', 'chkChassisRetak')}
        {renderCheckItem('Atap Pelindung (Overhead Guard)', 'chkOHG')}
        {renderCheckItem('Counterweight (Pemberat)', 'chkWeight')}
        {renderCheckItem('Kursi & Sabuk Pengaman', 'chkKursi')}
        {renderCheckItem('Tangga Pijakan', 'chkTangga')}
      </List.Accordion>

      <Divider />

      {/* --- 3. TIANG ANGKAT & GARPU (FORKS) --- */}
      <List.Accordion
        title="3. Mast, Chain & Forks"
        left={p => <List.Icon {...p} icon="format-vertical-align-top" />}
      >
        <Text style={styles.subTitleSection}>Garpu (Forks)</Text>
        {renderCheckItem('Kondisi Garpu (Retak/Aus)', 'chkForksRetak')}
        {renderCheckItem('Pengunci Garpu (Stopper)', 'chkForksLock')}

        <Text style={styles.subTitleSection}>Tiang & Rantai</Text>
        {renderCheckItem('Kondisi Mast / Tiang', 'chkMast')}
        {renderCheckItem('Rantai Pengangkat (Chain)', 'chkChain')}
        {renderCheckItem('Pelumasan Rantai', 'chkLubeChain')}
      </List.Accordion>

      <Divider />

      {/* --- 4. SISTEM KEMUDI & RODA --- */}
      <List.Accordion
        title="4. Steering & Tyres"
        left={p => <List.Icon {...p} icon="steering" />}
      >
        <Text style={styles.subTitleSection}>Roda (Ban)</Text>
        {renderCheckItem('Kondisi Ban Depan', 'chkBaneDepan')}
        {renderCheckItem('Kondisi Ban Belakang', 'chkBaneBelakang')}
        {renderCheckItem('Baut Roda (Kencang)', 'chkBautRoda')}

        <Text style={styles.subTitleSection}>Kemudi</Text>
        {renderCheckItem('Fungsi Stir / Orbitrol', 'chkStir')}
        {renderCheckItem('King Pin & Bushing', 'chkKingPin')}
      </List.Accordion>

      <Divider />

      {/* --- 5. SISTEM ENGINE & TRANSMISI --- */}
      <List.Accordion
        title="5. Engine & Power Train"
        left={p => <List.Icon {...p} icon="cog" />}
      >
        {renderCheckItem('Oli Mesin & Filter', 'chkOliMesin')}
        {renderCheckItem('Sistem Pendingin (Radiator)', 'chkRadiator')}
        {renderCheckItem('Transmisi (Maju/Mundur)', 'chkTransmisi')}
        {renderCheckItem('Rem Utama (Service Brake)', 'chkRemUtama')}
        {renderCheckItem('Rem Parkir (Parking Brake)', 'chkRemParkir')}
      </List.Accordion>

      <Divider />

      {/* --- 6. OPERASIONAL & KELISTRIKAN --- */}
      <List.Accordion
        title="6. Operasional & Listrik"
        left={p => <List.Icon {...p} icon="play-circle" />}
      >
        {renderCheckItem('Dynamo Stater', 'chkStater')}
        {renderCheckItem('Lampu Depan & Belakang', 'chkLampu')}
        {renderCheckItem('Lampu Rotary & Sirine', 'chkRotary')}
        {renderCheckItem('Klakson & Alarm Mundur', 'chkKlakson')}
        {renderCheckItem('Indikator Panel Dashbor', 'chkPanel')}
      </List.Accordion>

      <Divider />

      {/* --- 7. DOKUMENTASI FOTO --- */}
      <List.Accordion
        title="7. Dokumentasi Foto"
        left={p => <List.Icon {...p} icon="camera-burst" />}
      >
        <View style={{ padding: 10 }}>
          <PhotoSection
            label="Foto Tampak Depan Alat"
            imageUri={data.fotoDepan}
            onPhotoTaken={uri => setData({ ...data, fotoDepan: uri })}
            requestPermission={requestPermission}
          />
          <PhotoSection
            label="Foto Samping / Nameplate"
            imageUri={data.fotoNamePlate}
            onPhotoTaken={uri => setData({ ...data, fotoNamePlate: uri })}
            requestPermission={requestPermission}
          />
          <PhotoSection
            label="Foto Garpu / Fork Detail"
            imageUri={data.fotoGarpu}
            onPhotoTaken={uri => setData({ ...data, fotoGarpu: uri })}
            requestPermission={requestPermission}
          />
          <PhotoSection
            label="Foto Ruang Mesin"
            imageUri={data.fotoMesin}
            onPhotoTaken={uri => setData({ ...data, fotoMesin: uri })}
            requestPermission={requestPermission}
          />
        </View>
      </List.Accordion>
    </View>
  );
};
