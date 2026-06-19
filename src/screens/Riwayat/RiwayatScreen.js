import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
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
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { inspectionService } from '../../services/inspection-service';

const SAFETY_COLORS = {
  primary: '#0055A4',
  background: '#F2F4F7',
  success: '#009639',
  danger: '#C8102E',
};

function flattenCompletedObjects(inspections) {
  const rows = [];
  inspections.forEach(insp => {
    (insp.objects || []).forEach(obj => {
      if (['completed', 'failed', 'done'].includes(obj.status_uji)) {
        rows.push({
          id: obj.id,
          objectName:
            obj.master_object?.name ||
            obj.masterObject?.name ||
            `Alat #${obj.id}`,
          subSector:
            obj.master_object?.sub_sector?.name ||
            obj.masterObject?.subSector?.name ||
            '-',
          clientName: insp.client_name,
          location: insp.location || '-',
          scheduleDate: insp.schedule_date,
          status: obj.status_uji,
          inspectionId: insp.id,
        });
      }
    });
  });
  return rows.sort(
    (a, b) => new Date(b.scheduleDate || 0) - new Date(a.scheduleDate || 0),
  );
}

export default function RiwayatScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dataRiwayat, setDataRiwayat] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const inspections = await inspectionService.getMyInspections();
      setDataRiwayat(flattenCompletedObjects(inspections));
    } catch (error) {
      console.error('Gagal ambil riwayat:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData]),
  );

  const renderItem = ({ item }) => {
    const isPass = item.status === 'completed';
    const statusColor = isPass ? SAFETY_COLORS.success : SAFETY_COLORS.danger;

    return (
      <Card style={styles.card} elevation={2}>
        <View style={[styles.cardAccent, { backgroundColor: statusColor }]} />
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.companyName}>
                {item.clientName}
              </Text>
              <Text style={styles.dateText}>
                {item.objectName} • {item.subSector}
              </Text>
            </View>
            <Chip
              textStyle={styles.chipText}
              style={[
                styles.bidangChip,
                { backgroundColor: SAFETY_COLORS.primary + '15' },
              ]}
            >
              {item.status}
            </Chip>
          </View>

          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={14}
              color="#64748B"
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </Card.Content>

        <Card.Actions style={styles.cardActions}>
          <Button
            mode="text"
            compact
            textColor={SAFETY_COLORS.primary}
            onPress={() =>
              navigation.navigate('Execution', { objectId: item.id })
            }
            icon="eye-outline"
          >
            Lihat / Edit
          </Button>
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
        <View style={{ width: 48 }} />
      </Surface>

      {loading && dataRiwayat.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={SAFETY_COLORS.primary} />
          <Text style={{ marginTop: 10, color: '#64748B' }}>
            Memuat riwayat...
          </Text>
        </View>
      ) : (
        <FlatList
          data={dataRiwayat}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadData();
              }}
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
              <Text style={styles.emptyText}>Belum ada inspeksi selesai</Text>
              <Button
                mode="contained"
                style={{ marginTop: 20 }}
                onPress={() => navigation.navigate('JadwalRiksa')}
              >
                Lihat Jadwal
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  locationText: { color: '#64748B', fontSize: 11, marginLeft: 6, flex: 1 },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 8,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', marginTop: 15, fontSize: 16 },
});
