import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, IconButton, useTheme, Surface } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
// Padding horizontal grid adalah 12 * 2 = 24. Margin antar kartu 8 * 2 = 16 per kolom.
const cardWidth = (width - 48) / 2;

const DATA_BIDANG = [
  {
    id: '1',
    title: 'PAPA',
    sub: 'Angkat & Angkut',
    icon: 'crane',
    color: '#2563eb',
    route: 'PilihSubBidang', // Diarahkan ke Sub-Bidang terlebih dahulu
  },
  {
    id: '2',
    title: 'PUBT',
    sub: 'Uap & Bejana Tekan',
    icon: 'hydro-power',
    color: '#dc2626',
    route: 'PilihSubBidang',
  },
  {
    id: '3',
    title: 'LISTRIK',
    sub: 'Instalasi & Petir',
    icon: 'lightning-bolt',
    color: '#d97706',
    route: 'PilihSubBidang',
  },
  {
    id: '4',
    title: 'FIRE',
    sub: 'Sistem Kebakaran',
    icon: 'fire-extinguisher',
    color: '#ea580c',
    route: 'PilihSubBidang',
  },
  {
    id: '5',
    title: 'PTP',
    sub: 'Tenaga & Produksi',
    icon: 'engine-outline',
    color: '#7c3aed',
    route: 'PilihSubBidang',
  },
  {
    id: '6',
    title: 'LIFT',
    sub: 'Elevator Eskalator',
    icon: 'elevator-passenger',
    color: '#059669',
    route: 'PilihSubBidang',
  },
];

export default function PilihBidangScreen({ navigation }) {
  const theme = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.cardWrapper}
      onPress={() =>
        navigation.navigate('PilihSubBidang', {
          bidangId: item.title, // Mengirim ID (Contoh: 'PAPA')
          bidangTitle: item.sub, // Mengirim Judul Lengkap
        })
      }
    >
      <Surface style={styles.card} elevation={2}>
        {/* Lingkaran Ikon dengan Opacity Warna */}
        <View
          style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={38}
            color={item.color}
          />
        </View>

        <Text style={[styles.cardTitle, { color: item.color }]}>
          {item.title}
        </Text>
        <Text style={styles.cardSub}>{item.sub}</Text>

        {/* Dekorasi kecil di pojok kartu */}
        <View style={[styles.badge, { backgroundColor: item.color }]} />
      </Surface>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>
          Pilih Bidang Inspeksi
        </Text>
      </View>

      <FlatList
        data={DATA_BIDANG}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    paddingHorizontal: 10,
  },
  headerTitle: { color: 'white', fontWeight: 'bold' },
  grid: {
    padding: 12,
    paddingBottom: 30,
  },
  cardWrapper: {
    width: cardWidth,
    margin: 8,
  },
  card: {
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
    height: 190, // Menyamakan tinggi semua kartu
    justifyContent: 'center',
  },
  iconContainer: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.8,
  },
  cardSub: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
    paddingHorizontal: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 45,
    height: 45,
    borderBottomLeftRadius: 45,
    opacity: 0.1,
  },
});
