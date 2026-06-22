import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text, Surface, Chip, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { reportService } from '../../services/report-service';
import ScreenHeader from '../../components/ui/ScreenHeader';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { colors, radius, spacing, shadow } from '../../theme';

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

function ReportRow({ report }) {
  const statusColor =
    report.status === 'published' || report.status === 'done'
      ? colors.accent
      : colors.warning;

  return (
    <Surface style={styles.reportCard} elevation={0}>
      <View style={styles.reportTop}>
        <MaterialCommunityIcons name="file-pdf-box" size={22} color={colors.primary} />
        <View style={styles.reportMain}>
          <Text style={styles.reportType}>{(report.type || 'DOKUMEN').toUpperCase()}</Text>
          <Text style={styles.reportNumber}>
            {report.document_number || 'Nomor belum diisi'}
          </Text>
          {report.object?.name ? (
            <Text style={styles.reportObject}>{report.object.name}</Text>
          ) : null}
        </View>
        <Chip compact style={{ backgroundColor: statusColor + '20' }}>
          {report.status || 'draft'}
        </Chip>
      </View>
      <View style={styles.reportMeta}>
        <Text style={styles.metaText}>Terbit: {formatDate(report.issue_date)}</Text>
        <Text style={styles.metaText}>Kadaluarsa: {formatDate(report.expiry_date)}</Text>
      </View>
    </Surface>
  );
}

export default function ReportDetailScreen({ navigation, route }) {
  const inspectionId = route.params?.inspectionId;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detail, setDetail] = useState(null);

  const loadData = useCallback(async () => {
    if (!inspectionId) return;
    try {
      const data = await reportService.getProjectDetail(inspectionId);
      setDetail(data);
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Tidak dapat memuat detail laporan.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [inspectionId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData]),
  );

  if (loading && !detail) {
    return <LoadingScreen message="Memuat detail laporan..." />;
  }

  const clientName =
    detail?.purchase_order?.client?.name || detail?.client?.name || 'Klien';
  const reports = detail?.reports || [];
  const objects = detail?.objects || detail?.inspection_objects || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Detail Laporan"
        subtitle={clientName}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
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
      >
        <Surface style={styles.summaryCard} elevation={1}>
          <Text style={styles.summaryTitle}>Ringkasan Proyek</Text>
          <Divider style={styles.divider} />
          <Text style={styles.summaryRow}>
            No. Inspeksi: {detail?.inspection_no || '-'}
          </Text>
          <Text style={styles.summaryRow}>Klien: {clientName}</Text>
          <Text style={styles.summaryRow}>
            Jadwal: {formatDate(detail?.schedule_date)}
          </Text>
          <Text style={styles.summaryRow}>
            {objects.length} alat · {reports.length} dokumen
          </Text>
          <View style={styles.readOnlyBadge}>
            <MaterialCommunityIcons name="eye-outline" size={16} color={colors.primary} />
            <Text style={styles.readOnlyText}>Mode baca saja — tidak dapat mengubah dokumen</Text>
          </View>
        </Surface>

        <Text style={styles.sectionTitle}>Daftar Dokumen</Text>
        {reports.length === 0 ? (
          <Surface style={styles.emptyBox} elevation={0}>
            <Text style={styles.emptyText}>Belum ada dokumen laporan untuk proyek ini.</Text>
          </Surface>
        ) : (
          reports.map(report => <ReportRow key={report.id} report={report} />)
        )}

        {objects.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
              Unit Diinspeksi
            </Text>
            {objects.map(obj => {
              const name =
                obj.object?.name ||
                obj.master_object?.name ||
                obj.object_k3?.name ||
                'Unit';
              return (
                <Surface key={obj.id} style={styles.objectRow} elevation={0}>
                  <Text style={styles.objectName}>{name}</Text>
                  <Text style={styles.objectStatus}>{obj.status_uji || '-'}</Text>
                </Surface>
              );
            })}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  summaryTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  divider: { marginVertical: spacing.md },
  summaryRow: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  readOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: colors.primarySoft,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  readOnlyText: { flex: 1, fontSize: 11, color: colors.primary, fontWeight: '600' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  reportCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  reportMain: { flex: 1 },
  reportType: { fontSize: 11, fontWeight: '800', color: colors.primary },
  reportNumber: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 2 },
  reportObject: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  reportMeta: { marginTop: spacing.sm, paddingLeft: 30 },
  metaText: { fontSize: 11, color: colors.textMuted },
  emptyBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  objectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  objectName: { fontSize: 13, fontWeight: '600', color: colors.text, flex: 1 },
  objectStatus: { fontSize: 11, color: colors.textMuted, textTransform: 'capitalize' },
});
