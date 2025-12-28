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
} from 'react-native';
import {
  Text,
  Card,
  IconButton,
  useTheme,
  Chip,
  ActivityIndicator,
  Button, // Pastikan Button diimport
} from 'react-native-paper';
import { db } from '../../services/db-service';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RiwayatScreen({ navigation }) {
  const theme = useTheme();
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
    'ELEVATOR',
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
            console.error('Gagal parse JSON pada ID:', item.id);
          }

          rows.push({
            dbId: item.id || Date.now() + i, // Fallback ID agar flatlist tidak blank
            createdAt: item.created_at || '-',
            bidang: item.bidang || parsedData.bidang || 'PAPA',
            ...parsedData,
          });
        }
      }

      setDataRiwayat(rows);
      if (selectedBidang === 'SEMUA') {
        setFilteredData(rows);
      } else {
        const filtered = rows.filter(item => item.bidang === selectedBidang);
        setFilteredData(filtered);
      }
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBidang]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  const filterByBidang = bidang => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedBidang(bidang);
    if (bidang === 'SEMUA') {
      setFilteredData(dataRiwayat);
    } else {
      setFilteredData(dataRiwayat.filter(item => item.bidang === bidang));
    }
  };

  const handleDelete = item => {
    Alert.alert('Hapus Data', 'Yakin ingin menghapus laporan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          db.execute('DELETE FROM inspections WHERE id = ?', [item.dbId]);
          loadData(); // Refresh data setelah hapus
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const statusColor =
      item.statusKelayakan === 'LAYAK' ? '#16a34a' : '#dc2626';

    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('DetailRiwayat', { data: item })}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text
                variant="titleMedium"
                style={styles.companyName}
                numberOfLines={1}
              >
                {item.pemilik || item.namaPerusahaan || 'Tanpa Nama'}
              </Text>
              <Text variant="bodySmall" style={styles.dateText}>
                {item.tanggalInput || item.createdAt}
              </Text>
            </View>
            <Chip mode="flat" style={styles.bidangChip}>
              {item.bidang}
            </Chip>
          </View>

          <View style={styles.infoRow}>
            <IconButton
              icon="map-marker"
              size={16}
              style={styles.icon}
              iconColor="#64748b"
            />
            <Text variant="bodySmall" style={{ color: '#64748b' }}>
              {item.lokasiUnit || item.alamat || 'Lokasi tidak tersedia'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <IconButton
              icon="tag"
              size={16}
              style={styles.icon}
              iconColor="#64748b"
            />
            <Text variant="bodySmall" style={{ color: '#1e293b' }}>
              {item.subAlat || 'Alat'} - {item.noSeri || '-'}
            </Text>
          </View>

          {item.statusKelayakan && (
            <Text style={[styles.statusText, { color: statusColor }]}>
              ● {item.statusKelayakan}
            </Text>
          )}
        </Card.Content>

        <Card.Actions style={styles.cardActions}>
          <Button
            onPress={() => navigation.navigate('DetailRiwayat', { data: item })}
          >
            Detail
          </Button>
          <IconButton
            icon="delete-outline"
            iconColor="#ef4444"
            onPress={() => handleDelete(item)}
          />
        </Card.Actions>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton
          icon="menu"
          iconColor="white"
          onPress={() => navigation.openDrawer()}
        />
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Riwayat
        </Text>
      </View>

      <View style={styles.filterBar}>
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
              style={styles.filterChip}
            >
              {bidang}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {loading && dataRiwayat.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.dbId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadData} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Tidak ada data</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontWeight: 'bold' },
  filterBar: { backgroundColor: 'white', paddingVertical: 8, elevation: 2 },
  filterScroll: { paddingHorizontal: 10 },
  filterChip: { marginRight: 5 },
  listContent: { padding: 10 },
  card: { marginBottom: 10, backgroundColor: 'white' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  companyName: { fontWeight: 'bold' },
  dateText: { color: '#64748b', fontSize: 10 },
  bidangChip: { height: 24 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
    marginBottom: -10,
  },
  icon: { marginRight: -5 },
  statusText: { fontSize: 11, fontWeight: 'bold', marginTop: 10 },
  cardActions: { borderTopWidth: 0.5, borderTopColor: '#f1f5f9' },
  center: { flex: 1, justifyContent: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
});
