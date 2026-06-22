import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { inspectionService } from '../../services/inspection-service';
import {
  getObjectDisplayInfo,
  formatBidangLabel,
} from '../../lib/inspection-object';
import ScreenHeader from '../../components/ui/ScreenHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingScreen from '../../components/ui/LoadingScreen';
import StatusChip from '../../components/ui/StatusChip';
import { colors, radius, spacing, shadow } from '../../theme';

function flattenCompletedObjects(inspections) {
  const rows = [];
  inspections.forEach(insp => {
    (insp.objects || []).forEach(obj => {
      if (['completed', 'failed', 'done'].includes(obj.status_uji)) {
        const info = getObjectDisplayInfo(obj);
        rows.push({
          id: obj.id,
          objectName: info.name,
          subSector: info.subSector || '-',
          bidang: formatBidangLabel(info),
          clientName: insp.client_name,
          location: info.location || insp.location || '-',
          scheduleDate: insp.schedule_date,
          status: obj.status_uji,
        });
      }
    });
  });
  return rows.sort(
    (a, b) => new Date(b.scheduleDate || 0) - new Date(a.scheduleDate || 0),
  );
}

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

function HistoryCard({ item, onPress }) {
  const isPass = ['completed', 'done'].includes(item.status);

  return (
    <Surface style={styles.card} elevation={2}>
      <View style={[styles.accent, { backgroundColor: isPass ? colors.accent : colors.danger }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons
              name={isPass ? 'check-decagram' : 'alert-circle-outline'}
              size={24}
              color={isPass ? colors.accent : colors.danger}
            />
          </View>
          <View style={styles.cardMain}>
            <Text style={styles.objectName} numberOfLines={1}>
              {item.objectName}
            </Text>
            <Text style={styles.clientName} numberOfLines={1}>
              {item.clientName}
            </Text>
          </View>
          <StatusChip status={item.status} />
        </View>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="domain" size={14} color={colors.primary} />
          <Text style={styles.metaText}>{item.bidang}</Text>
        </View>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="shape-outline" size={14} color={colors.accent} />
          <Text style={styles.metaText}>{item.subSector}</Text>
        </View>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{formatDate(item.scheduleDate)}</Text>
        </View>

        <Button
          mode="contained-tonal"
          icon="eye-outline"
          onPress={onPress}
          style={styles.viewBtn}
          compact
        >
          Lihat Detail
        </Button>
      </View>
    </Surface>
  );
}

export default function RiwayatScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dataRiwayat, setDataRiwayat] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const result = await inspectionService.getMyInspections({ limit: 50 });
      setDataRiwayat(flattenCompletedObjects(result.items));
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Tidak dapat memuat riwayat.',
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

  if (loading && dataRiwayat.length === 0) {
    return <LoadingScreen message="Memuat riwayat inspeksi..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Riwayat Inspeksi"
        subtitle={`${dataRiwayat.length} pekerjaan selesai`}
        onMenu={() => navigation.openDrawer()}
      />

      <FlatList
        data={dataRiwayat}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            onPress={() =>
              navigation.getParent()?.navigate('Execution', {
                objectId: item.id,
              })
            }
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-check-outline"
            title="Belum ada inspeksi selesai"
            description="Pekerjaan yang sudah diselesaikan akan muncul di sini."
            actionLabel="Lihat Jadwal Kerja"
            onAction={() => navigation.getParent()?.navigate('JadwalRiksa')}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  accent: { height: 4 },
  cardBody: { padding: spacing.lg },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMain: { flex: 1 },
  objectName: { fontSize: 16, fontWeight: '800', color: colors.text },
  clientName: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  metaText: { flex: 1, fontSize: 12, color: colors.textSecondary },
  viewBtn: { marginTop: spacing.md, borderRadius: radius.sm },
});
