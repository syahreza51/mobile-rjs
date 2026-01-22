import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Text, IconButton, List, Surface } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Palet Warna Standar K3 agar konsisten
const SAFETY_COLORS = {
  primary: '#0055A4', // Safety Blue
  background: '#F2F4F7',
  textDark: '#1E293B',
};

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
    {
      id: 'MNL',
      title: 'Manlift / Scissor Lift',
      route: 'InputPapa',
      icon: 'hoop-house',
    },
    {
      id: 'GDL',
      title: 'Gondola',
      route: 'InputPapa',
      icon: 'window-maximize',
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
    {
      id: 'EVS',
      title: 'Evakuasi & Suppression',
      route: 'InputFire',
      icon: 'run-fast',
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
    { id: 'TNR', title: 'Tanur/Furnace', route: 'InputPtp', icon: 'fire' },
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
    {
      id: 'TVL',
      title: 'Ban Berjalan (Travelator)',
      route: 'InputElevator',
      icon: 'walk',
    },
    {
      id: 'DMB',
      title: 'Lift Pelayan (Dumbwaiter)',
      route: 'InputElevator',
      icon: 'room-service',
    },
  ],
};

export default function PilihSubBidangScreen({ route, navigation }) {
  const { bidangId, bidangTitle } = route.params;
  const subItems = SUB_DATA[bidangId] || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={SAFETY_COLORS.primary}
      />

      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: SAFETY_COLORS.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={26}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerTextWrapper}>
          <Text variant="titleLarge" style={styles.headerTitle}>
            {bidangTitle}
          </Text>
          <Text style={styles.headerSub}>Pilih Spesifikasi Alat / Objek</Text>
        </View>
      </View>

      <FlatList
        data={subItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Surface style={styles.listItem} elevation={1}>
            <List.Item
              title={item.title}
              titleStyle={styles.itemTitle}
              description={`Kode Alat: ${item.id}`}
              descriptionStyle={styles.itemDesc}
              left={props => (
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={SAFETY_COLORS.primary}
                  />
                </View>
              )}
              right={props => (
                <IconButton
                  icon="chevron-right"
                  iconColor="#CBD5E1"
                  style={{ alignSelf: 'center' }}
                />
              )}
              onPress={() =>
                navigation.navigate(item.route, {
                  subAlat: item.title,
                  code: item.id,
                })
              }
            />
          </Surface>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SAFETY_COLORS.background },
  header: {
    paddingTop: 40,
    paddingBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  headerTextWrapper: { marginLeft: 5 },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 0.5,
  },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  listContent: { padding: 16, paddingBottom: 30 },
  listItem: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemTitle: {
    fontWeight: '700',
    color: SAFETY_COLORS.textDark,
    fontSize: 16,
  },
  itemDesc: { fontSize: 11, color: '#94A3B8' },
  iconWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    alignSelf: 'center',
  },
});
