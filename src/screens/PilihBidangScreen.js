import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Text, useTheme, Surface, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

// Palet Warna Standar K3 agar konsisten dengan Dashboard
const SAFETY_COLORS = {
  primary: '#0055A4', // Safety Blue
  warning: '#F9D71C', // Safety Yellow
  success: '#009639', // Safety Green
  danger: '#C8102E', // Safety Red
  background: '#F2F4F7',
};

const DATA_BIDANG = [
  {
    id: '1',
    title: 'PAPA',
    sub: 'Angkat & Angkut',
    icon: 'crane',
    color: '#0055A4', // Safety Blue
    description: 'Forklift, Crane, Excavator',
  },
  {
    id: '2',
    title: 'PUBT',
    sub: 'Uap & Bejana Tekan',
    icon: 'gas-cylinder',
    color: '#C8102E', // Safety Red
    description: 'Boiler, Kompresor, Tangki',
  },
  {
    id: '3',
    title: 'LISTRIK',
    sub: 'Instalasi & Petir',
    icon: 'transmission-tower',
    color: '#E65100', // Deep Orange
    description: 'Panel, Genset, Petir',
  },
  {
    id: '4',
    title: 'FIRE',
    sub: 'Sistem Kebakaran',
    icon: 'fire-hydrant',
    color: '#EA580C', // Safety Orange
    description: 'APAR, Hydrant, Alarm',
  },
  {
    id: '5',
    title: 'PTP',
    sub: 'Tenaga & Produksi',
    icon: 'cog-refresh',
    color: '#546E7A', // Industrial Grey
    description: 'Mesin Produksi, Perkakas',
  },
  {
    id: '6',
    title: 'LIFT',
    sub: 'Elevator Eskalator',
    icon: 'elevator-passenger',
    color: '#009639', // Safety Green
    description: 'Lift Barang, Escalator',
  },
];

export default function PilihBidangScreen({ navigation }) {
  const theme = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardWrapper}
      onPress={() =>
        navigation.navigate('PilihSubBidang', {
          bidangId: item.title,
          bidangTitle: item.sub,
        })
      }
    >
      <Surface style={styles.card} elevation={2}>
        {/* Dekorasi lingkaran transparan di pojok */}
        <View
          style={[
            styles.circleDecor,
            { backgroundColor: item.color, opacity: 0.08 },
          ]}
        />

        {/* Icon Section dengan Background Soft */}
        <View
          style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={42}
            color={item.color}
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, { color: item.color }]}>
            {item.title}
          </Text>
          <Text style={styles.cardSub}>{item.sub}</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>

        {/* Accent Bar di bagian bawah kartu */}
        <View style={[styles.bottomBar, { backgroundColor: item.color }]} />
      </Surface>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={SAFETY_COLORS.primary}
      />

      {/* Header Modern */}
      <View style={[styles.header, { backgroundColor: SAFETY_COLORS.primary }]}>
        <View style={styles.headerTopRow}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.headerTextWrapper}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Modul Inspeksi
            </Text>
            <Text style={styles.headerSubtitle}>
              Pilih kategori bidang riksa uji K3
            </Text>
          </View>
        </View>
      </View>

      {/* Grid List */}
      <FlatList
        data={DATA_BIDANG}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={{ height: 15 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF7',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextWrapper: {
    marginLeft: 5,
  },
  headerTitle: {
    color: 'white',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },
  cardWrapper: {
    width: cardWidth,
    margin: 8,
  },
  card: {
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
    height: 210,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  circleDecor: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
  },
  cardTitle: {
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
  cardSub: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '800',
  },
  descriptionText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 4,
    opacity: 0.8,
  },
});
