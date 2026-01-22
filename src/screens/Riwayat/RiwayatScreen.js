import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  RefreshControl,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  Text,
  Card,
  IconButton,
  Chip,
  ActivityIndicator,
  Button,
  Surface,
} from 'react-native-paper';
import { db } from '../../services/db-service';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SAFETY_COLORS = {
  primary: '#0055A4',
  background: '#F2F4F7',
  success: '#009639',
  danger: '#C8102E',
  warning: '#E65100',
};

export default function RiwayatScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBidang, setSelectedBidang] = useState('SEMUA');

  const DAFTAR_BIDANG = [
    'SEMUA',
    'PAPA',
    'PUBT',
    'LISTRIK',
    'FIRE',
    'PTP',
    'LIFT',
  ];

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const result = db.execute('SELECT * FROM inspections ORDER BY id DESC');
      const rows = [];

      if (result && result.rows) {
        for (let i = 0; i < result.rows.length; i++) {
          const item = result.rows.item(i);
          let parsedData = {};
          try {
            parsedData = item.data ? JSON.parse(item.data) : {};
          } catch (e) {
            console.error('Error parse ID:', item.id);
          }

          rows.push({
            dbId: item.id || Date.now() + i,
            createdAt: item.created_at || '-',
            bidang: item.bidang || parsedData.bidang || 'PAPA',
            ...parsedData,
          });
        }
      }
      setDataRiwayat(rows);
      applyFilter(selectedBidang, rows);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBidang]);

  const applyFilter = (bidang, fullData) => {
    if (bidang === 'SEMUA') {
      setFilteredData(fullData);
    } else {
      setFilteredData(fullData.filter(item => item.bidang === bidang));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  const filterByBidang = bidang => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedBidang(bidang);
    applyFilter(bidang, dataRiwayat);
  };

  const handleDelete = item => {
    Alert.alert(
      'Hapus Riwayat',
      'Data ini akan dihapus permanen dari database lokal.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            db.execute('DELETE FROM inspections WHERE id = ?', [item.dbId]);
            loadData();
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => {
    const isLayak = item.statusKelayakan === 'LAYAK';
    const statusColor = isLayak ? SAFETY_COLORS.success : SAFETY_COLORS.danger;

    return (
      <Card
        style={styles.card}
        elevation={2}
        onPress={() => navigation.navigate('DetailRiwayat', { data: item })}
      >
        <View style={[styles.cardAccent, { backgroundColor: statusColor }]} />
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.companyName}>
                {item.pemilik || item.namaPerusahaan || 'Objek Tanpa Nama'}
              </Text>
              <Text style={styles.dateText}>
                <MaterialCommunityIcons name="calendar-clock" size={12} />{' '}
                {item.tanggalInput || item.createdAt}
              </Text>
            </View>
            <Chip
              textStyle={styles.chipText}
              style={[
                styles.bidangChip,
                { backgroundColor: SAFETY_COLORS.primary + '15' },
              ]}
            >
              {item.bidang}
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>JENIS ALAT</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {item.subAlat || 'Alat K3'}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>STATUS KELAYAKAN</Text>
              <Text style={[styles.statusValue, { color: statusColor }]}>
                {isLayak ? 'BERFUNGSI BAIK' : 'BUTUH PERBAIKAN'}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={14}
              color="#64748B"
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.lokasiUnit || item.alamat || 'Lokasi tidak terekam'}
            </Text>
          </View>
        </Card.Content>

        <Card.Actions style={styles.cardActions}>
          <Button
            mode="text"
            compact
            textColor={SAFETY_COLORS.primary}
            onPress={() => navigation.navigate('DetailRiwayat', { data: item })}
            icon="file-find-outline"
          >
            Lihat Detail
          </Button>
          <IconButton
            icon="trash-can-outline"
            iconColor="#94A3B8"
            size={20}
            onPress={() => handleDelete(item)}
          />
        </Card.Actions>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={SAFETY_COLORS.primary}
      />

      <Surface
        style={[styles.header, { backgroundColor: SAFETY_COLORS.primary }]}
        elevation={4}
      >
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Riwayat Inspeksi</Text>
        <IconButton icon="magnify" iconColor="white" onPress={() => {}} />
      </Surface>

      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {DAFTAR_BIDANG.map(bidang => (
            <Chip
              key={bidang}
              selected={selectedBidang === bidang}
              onPress={() => filterByBidang(bidang)}
              style={[
                styles.filterChip,
                selectedBidang === bidang && {
                  backgroundColor: SAFETY_COLORS.primary,
                },
              ]}
              selectedColor="white"
              showSelectedOverlay
            >
              {bidang}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {loading && dataRiwayat.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={SAFETY_COLORS.primary} />
          <Text style={{ marginTop: 10, color: '#64748B' }}>
            Memuat riwayat...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.dbId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadData}
              colors={[SAFETY_COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="clipboard-text-search-outline"
                size={80}
                color="#CBD5E1"
              />
              <Text style={styles.emptyText}>Belum ada data riwayat</Text>
              <Button
                mode="contained"
                style={{ marginTop: 20 }}
                onPress={() => navigation.navigate('PilihBidang')}
              >
                Mulai Inspeksi
              </Button>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SAFETY_COLORS.background },
  header: {
    paddingTop: StatusBar.currentHeight || 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  filterSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
    elevation: 2,
  },
  filterScroll: { paddingHorizontal: 15 },
  filterChip: { marginRight: 8, height: 35 },
  listContent: { padding: 15, paddingBottom: 30 },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardAccent: { height: 4, width: '100%' },
  cardContent: { paddingTop: 15 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  companyName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#1E293B',
    marginBottom: 2,
  },
  dateText: { color: '#64748B', fontSize: 11 },
  bidangChip: { borderRadius: 8, height: 28 },
  chipText: { fontSize: 10, fontWeight: 'bold', color: SAFETY_COLORS.primary },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoCol: { flex: 1 },
  infoLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '700',
    marginTop: 2,
  },
  statusValue: { fontSize: 13, fontWeight: '900', marginTop: 2 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  locationText: { color: '#64748B', fontSize: 11, marginLeft: 6, flex: 1 },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', marginTop: 15, fontSize: 16 },
});
