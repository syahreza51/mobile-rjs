import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  IconButton,
  useTheme,
  Button,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { inspectionService } from '../../services/inspection-service';

const STATUS_COLORS = {
  draft: { bg: '#fef9c3', text: '#854d0e', label: 'Draft' },
  completed: { bg: '#dcfce7', text: '#166534', label: 'Selesai' },
  failed: { bg: '#fee2e2', text: '#991b1b', label: 'Gagal' },
  default: { bg: '#dbeafe', text: '#1e40af', label: 'Siap' },
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getObjectStatusStyle(status) {
  return STATUS_COLORS[status] || STATUS_COLORS.default;
}

export default function JadwalRiksaScreen({ navigation }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inspections, setInspections] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const data = await inspectionService.getMyInspections();
      setInspections(data);
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Tidak dapat memuat jadwal.',
      );
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

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const startInspection = objectId => {
    navigation.navigate('Execution', { objectId });
  };

  if (loading && inspections.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0055A4" />
        <Text style={styles.loadingText}>Memuat jadwal...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Jadwal Riksa Uji
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Penugasan Inspeksi
        </Text>

        {inspections.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Belum ada penugasan inspeksi.</Text>
          </View>
        ) : (
          inspections.map(insp => (
            <Card key={insp.id} style={styles.scheduleCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text variant="titleLarge" style={styles.companyName}>
                    {insp.client_name}
                  </Text>
                  <Chip mode="flat" style={{ backgroundColor: '#dbeafe' }}>
                    {insp.status}
                  </Chip>
                </View>

                <View style={styles.infoRow}>
                  <IconButton icon="calendar" size={20} style={styles.iconInfo} />
                  <Text variant="bodyMedium">
                    {formatDate(insp.schedule_date)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <IconButton
                    icon="map-marker"
                    size={20}
                    style={styles.iconInfo}
                  />
                  <Text variant="bodyMedium">{insp.location || '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <IconButton icon="file-document" size={20} style={styles.iconInfo} />
                  <Text variant="bodyMedium">PO: {insp.po_number}</Text>
                </View>

                {insp.progress ? (
                  <Text style={styles.progressText}>
                    Progress: {insp.progress.completed}/{insp.progress.total} alat (
                    {insp.progress.percentage}%)
                  </Text>
                ) : null}

                <Divider style={styles.divider} />
                <Text style={styles.objectsTitle}>Daftar Alat</Text>

                {(insp.objects || []).map(obj => {
                  const st = getObjectStatusStyle(obj.status_uji);
                  const objectName =
                    obj.master_object?.name ||
                    obj.masterObject?.name ||
                    `Alat #${obj.id}`;
                  const subSector =
                    obj.master_object?.sub_sector?.name ||
                    obj.masterObject?.subSector?.name ||
                    '';

                  return (
                    <View key={obj.id} style={styles.objectRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.objectName}>{objectName}</Text>
                        {subSector ? (
                          <Text style={styles.subSector}>{subSector}</Text>
                        ) : null}
                      </View>
                      <Chip
                        compact
                        style={{ backgroundColor: st.bg }}
                        textStyle={{ color: st.text, fontSize: 10 }}
                      >
                        {st.label}
                      </Chip>
                      <Button
                        mode="contained-tonal"
                        compact
                        onPress={() => startInspection(obj.id)}
                      >
                        {obj.status_uji === 'completed' ? 'Lihat' : 'Riksa'}
                      </Button>
                    </View>
                  );
                })}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#64748B' },
  header: {
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { marginBottom: 15, color: '#64748b', fontWeight: 'bold' },
  scheduleCard: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  companyName: { flex: 1, fontWeight: 'bold', color: '#1e293b' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: -10 },
  iconInfo: { marginLeft: -10 },
  progressText: {
    fontSize: 12,
    color: '#0055A4',
    fontWeight: '700',
    marginTop: 8,
  },
  divider: { marginVertical: 12 },
  objectsTitle: { fontWeight: '700', color: '#475569', marginBottom: 8 },
  objectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  objectName: { fontWeight: '700', fontSize: 14, color: '#1E293B' },
  subSector: { fontSize: 11, color: '#64748B' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#94A3B8', fontSize: 15 },
});
