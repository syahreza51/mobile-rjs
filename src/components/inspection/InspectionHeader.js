import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar, IconButton } from 'react-native-paper';
import {
  AUTO_SAVE_LABELS,
  formatSavedTime,
} from '../../hooks/useAutoSaveDraft';
import { colors, radius } from '../../theme';

export default function InspectionHeader({
  navigation,
  clientName,
  objectName,
  location,
  statusUji,
  progress,
  isConnected,
  autoSaveStatus = 'idle',
  lastSavedAt,
}) {
  const statusLabel = {
    draft: 'Draft',
    completed: 'Selesai',
    failed: 'Gagal',
    in_progress: 'Berjalan',
  };

  const autoSave = AUTO_SAVE_LABELS[autoSaveStatus] || AUTO_SAVE_LABELS.idle;
  const autoSaveText =
    autoSaveStatus === 'saved' && lastSavedAt
      ? `${autoSave.label} · ${formatSavedTime(lastSavedAt)}`
      : autoSaveStatus === 'queued'
        ? 'Tersimpan lokal · akan disinkronkan'
        : autoSave.label;

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <IconButton
          icon="arrow-left"
          iconColor="#fff"
          size={22}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.titleWrap}>
          <Text style={styles.clientName} numberOfLines={1}>
            {clientName || 'Inspeksi Lapangan'}
          </Text>
          <Text style={styles.objectName} numberOfLines={1}>
            {objectName}
            {location ? ` · ${location}` : ''}
          </Text>
        </View>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isConnected ? colors.online : colors.offline },
              ]}
            />
            <Text style={styles.badgeText}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
          {statusUji ? (
            <View style={[styles.badge, styles.statusBadge]}>
              <Text style={styles.badgeText}>
                {statusLabel[statusUji] || statusUji}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {autoSaveStatus !== 'idle' ? (
        <View style={styles.autoSaveRow}>
          <View
            style={[styles.autoSaveDot, { backgroundColor: autoSave.color }]}
          />
          <Text style={[styles.autoSaveText, { color: autoSave.color }]}>
            {autoSaveText}
          </Text>
        </View>
      ) : null}

      <View style={styles.progressWrap}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>Progress Inspeksi</Text>
          <Text style={styles.progressPct}>
            {Math.round((progress || 0) * 100)}%
          </Text>
        </View>
        <ProgressBar
          progress={progress}
          color={colors.online}
          style={styles.progressBar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingBottom: 14,
    paddingHorizontal: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrap: { flex: 1, paddingRight: 8 },
  clientName: { color: '#fff', fontWeight: '800', fontSize: 17 },
  objectName: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  badges: { alignItems: 'flex-end', gap: 4, paddingRight: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadge: { backgroundColor: 'rgba(255,255,255,0.22)' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  autoSaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
    gap: 6,
  },
  autoSaveDot: { width: 7, height: 7, borderRadius: 4 },
  autoSaveText: { fontSize: 11, fontWeight: '600' },
  progressWrap: { paddingHorizontal: 16, marginTop: 8 },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  progressPct: { color: '#fff', fontSize: 11, fontWeight: '700' },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
