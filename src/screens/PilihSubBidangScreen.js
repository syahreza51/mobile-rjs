import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Text, IconButton, List, useTheme, Surface } from 'react-native-paper';

// Data Sub-Bidang (Contoh)
const SUB_DATA = {
  PAPA: [
    { id: 'FKL', title: 'Forklift', route: 'InputPapa', icon: 'forklift' },
    {
      id: 'MCR',
      title: 'Mobile Crane',
      route: 'InputPapa',
      icon: 'truck-check',
    },
    { id: 'TCR', title: 'Tower Crane', route: 'InputPapa', icon: 'crane' },
    { id: 'OCR', title: 'Overhead Crane', route: 'InputPapa', icon: 'bridge' },
    { id: 'EXC', title: 'Excavator', route: 'InputPapa', icon: 'excavator' },
    {
      id: 'PHS',
      title: 'Passenger Hoist',
      route: 'InputPapa',
      icon: 'elevator-vertical',
    },
    {
      id: 'BCV',
      title: 'Belt Conveyor',
      route: 'InputPapa',
      icon: 'ray-start-arrow',
    },
  ],
  PUBT: [
    {
      id: 'BLR',
      title: 'Boiler (Ketel Uap)',
      route: 'InputPubt',
      icon: 'water-boiler',
    },
    {
      id: 'BJT',
      title: 'Bejana Tekan',
      route: 'InputPubt',
      icon: 'tanker-truck',
    },
    {
      id: 'TKT',
      title: 'Tangki Timbun (BBM/Kimia)',
      route: 'InputPubt',
      icon: 'database',
    },
    {
      id: 'PPD',
      title: 'Pesawat Pendingin',
      route: 'InputPubt',
      icon: 'fridge-outline',
    },
  ],
  LISTRIK: [
    {
      id: 'ILR',
      title: 'Instalasi Listrik Ruangan',
      route: 'InputListrik',
      icon: 'home-lightning-bolt',
    },
    {
      id: 'PNL',
      title: 'Panel-Panel Listrik',
      route: 'InputListrik',
      icon: 'door-closed-lock',
    },
    {
      id: 'GND',
      title: 'Sistem Grounding',
      route: 'InputListrik',
      icon: 'earth',
    },
    {
      id: 'PTR',
      title: 'Penangkal Petir',
      route: 'InputListrik',
      icon: 'lightning-bolt',
    },
  ],
  FIRE: [
    {
      id: 'APR',
      title: 'APAR (Alat Pemadam Api Ringan)',
      route: 'InputFire',
      icon: 'fire-extinguisher',
    },
    {
      id: 'HYD',
      title: 'Sistem Hydrant',
      route: 'InputFire',
      icon: 'fire-hydrant',
    },
    {
      id: 'SPR',
      title: 'Sistem Sprinkler',
      route: 'InputFire',
      icon: 'sprinkler-variant',
    },
    {
      id: 'FAS',
      title: 'Fire Alarm System',
      route: 'InputFire',
      icon: 'bell-ring',
    },
  ],
  PTP: [
    {
      id: 'MPK',
      title: 'Mesin Perkakas (Bubut/Frais)',
      route: 'InputPtp',
      icon: 'lathe',
    },
    {
      id: 'MPS',
      title: 'Mesin Press',
      route: 'InputPtp',
      icon: 'tray-arrow-down',
    },
    { id: 'MDS', title: 'Motor Diesel', route: 'InputPtp', icon: 'engine' },
    { id: 'TRB', title: 'Turbin', route: 'InputPtp', icon: 'fan' },
    {
      id: 'GEN',
      title: 'Genset',
      route: 'InputPtp',
      icon: 'generator-portable',
    },
  ],
  LIFT: [
    {
      id: 'LPN',
      title: 'Lift Penumpang',
      route: 'InputElevator',
      icon: 'elevator-passenger',
    },
    {
      id: 'LBG',
      title: 'Lift Barang',
      route: 'InputElevator',
      icon: 'package-variant-closed',
    },
    {
      id: 'ESK',
      title: 'Tangga Berjalan (Eskalator)',
      route: 'InputElevator',
      icon: 'stairs',
    },
  ],
};

export default function PilihSubBidangScreen({ route, navigation }) {
  const { bidangId, bidangTitle } = route.params;
  const theme = useTheme();
  const subItems = SUB_DATA[bidangId] || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <View>
          <Text variant="titleLarge" style={styles.headerTitle}>
            {bidangTitle}
          </Text>
          <Text style={styles.headerSub}>Pilih Jenis Alat/Objek</Text>
        </View>
      </View>

      <FlatList
        data={subItems}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <Surface style={styles.listItem} elevation={1}>
            <List.Item
              title={item.title}
              titleStyle={{ fontWeight: 'bold' }}
              left={props => (
                <List.Icon
                  {...props}
                  icon="tools"
                  color={theme.colors.primary}
                />
              )}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() =>
                navigation.navigate(item.route, { subAlat: item.title })
              }
            />
          </Surface>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontWeight: 'bold' },
  headerSub: { color: '#e2e8f0', fontSize: 12 },
  listItem: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
});
