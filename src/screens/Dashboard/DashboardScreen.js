import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../../App';
import { inspectionService } from '../../services/inspection-service';
import {
  syncPendingDrafts,
  getPendingDraftCount,
} from '../../services/sync-service';
import { getObjectDisplayInfo, formatBidangLabel } from '../../lib/inspection-object';
import { colors, radius, spacing, shadow } from '../../theme';

function computeStats(inspections) {
  let totalObjects = 0;
  let pending = 0;
  let completed = 0;

  inspections.forEach(insp => {
    (insp.objects || []).forEach(obj => {
      totalObjects += 1;
      if (['completed', 'failed', 'done'].includes(obj.status_uji)) {
        completed += 1;
      } else {
        pending += 1;
      }
    });
  });

  return {
    total: totalObjects || inspections.length,
    pending,
    completed,
  };
}

function getPendingPreview(inspections, limit = 3) {
  const items = [];
  for (const insp of inspections) {
    for (const obj of insp.objects || []) {
      if (!['completed', 'failed', 'done'].includes(obj.status_uji)) {
        const info = getObjectDisplayInfo(obj);
        items.push({
          objectId: obj.id,
          clientName: insp.client_name || 'Klien',
          objectName: info.name,
          subSector: info.subSector,
          bidang: formatBidangLabel(info),
          location: info.location || insp.location || '-',
          scheduleDate: insp.schedule_date,
        });
        if (items.length >= limit) return items;
      }
    }
  }
  return items;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}

export default function DashboardScreen({ navigation }) {
  const { user } = React.useContext(AuthContext);
  const { width } = useWindowDimensions();

  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [pendingPreview, setPendingPreview] = useState([]);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const refreshPendingSync = useCallback(() => {
    setPendingSyncCount(getPendingDraftCount());
  }, []);

  const loadData = useCallback(async () => {
    try {
      const result = await inspectionService.getMyInspections({ limit: 50 });
      const inspections = result.items;
      setStats(computeStats(inspections));
      setPendingPreview(getPendingPreview(inspections));
      setLastSync(new Date());
      refreshPendingSync();
    } catch (error) {
      Alert.alert(
        'Gagal memuat',
        error.response?.data?.message || 'Tidak dapat memuat data dashboard.',
      );
    }
  }, [refreshPendingSync]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      if (connected) {
        syncPendingDrafts()
          .then(() => refreshPendingSync())
          .catch(() => {});
      }
    });
    return () => unsubscribe();
  }, [refreshPendingSync]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    if (isConnected) {
      await syncPendingDrafts().catch(() => {});
    }
    await loadData();
    setRefreshing(false);
  };

  const handleSync = async () => {
    if (!isConnected) {
      Alert.alert('Offline', 'Hubungkan internet untuk sinkronisasi draft.');
      return;
    }
    setRefreshing(true);
    try {
      const result = await syncPendingDrafts();
      refreshPendingSync();
      await loadData();
      if (result.synced > 0 && result.failed === 0) {
        Alert.alert('Berhasil', `${result.synced} draft berhasil disinkronkan.`);
      } else if (result.synced > 0) {
        Alert.alert(
          'Sebagian Berhasil',
          `${result.synced} tersinkron, ${result.failed} gagal.`,
        );
      } else if (result.failed > 0) {
        Alert.alert('Gagal', result.errors[0]?.message || 'Sinkronisasi gagal.');
      } else {
        Alert.alert('Info', 'Tidak ada draft yang perlu disinkronkan.');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const userName = user?.name?.split(' ')[0] || 'Inspector';
  const statCardWidth = (width - 56) / 3;

  const QUICK_ACTIONS = [
    {
      id: 'jadwal',
      title: 'Jadwal Hari Ini',
      icon: 'calendar-today',
      color: colors.primary,
      screen: 'JadwalRiksa',
      stack: true,
    },
    {
      id: 'lanjut',
      title: 'Lanjutkan Kerja',
      icon: 'play-circle-outline',
      color: colors.accent,
      screen: 'JadwalRiksa',
      stack: true,
      badge: stats.pending > 0 ? stats.pending : null,
    },
    {
      id: 'riwayat',
      title: 'Riwayat',
      icon: 'history',
      color: '#6366F1',
      screen: 'Riwayat',
      stack: false,
    },
    {
      id: 'sync',
      title: 'Sinkronkan',
      icon: 'cloud-sync-outline',
      color: colors.warning,
      action: 'sync',
      badge: pendingSyncCount > 0 ? pendingSyncCount : null,
    },
  ];

  const MAIN_MENUS = [
    {
      id: 1,
      title: 'Jadwal Kerja',
      desc: 'Daftar penugasan riksa uji lapangan',
      icon: 'calendar-clock',
      color: colors.primary,
      screen: 'JadwalRiksa',
      stack: true,
    },
    {
      id: 2,
      title: 'Riwayat Inspeksi',
      desc: 'Pekerjaan yang sudah diselesaikan',
      icon: 'clipboard-text-clock',
      color: '#6366F1',
      screen: 'Riwayat',
      stack: false,
    },
    {
      id: 3,
      title: 'Kalender',
      desc: 'Jadwal riksa & renewal sertifikat',
      icon: 'calendar-month-outline',
      color: '#0EA5E9',
      screen: 'Kalender',
      stack: true,
    },
    {
      id: 4,
      title: 'Laporan Proyek',
      desc: 'Preview dokumen read-only',
      icon: 'file-document-outline',
      color: '#6366F1',
      screen: 'Reports',
      stack: true,
    },
    {
      id: 5,
      title: 'Panduan Lapangan',
      desc: 'Checklist K3 & alur kerja inspeksi',
      icon: 'book-open-page-variant',
      color: colors.accent,
      screen: 'Panduan',
      stack: true,
    },
    {
      id: 6,
      title: 'Profil Saya',
      desc: 'Informasi akun inspector',
      icon: 'account-circle-outline',
      color: '#0EA5E9',
      screen: 'Profil',
      stack: true,
    },
  ];

  const handleQuickAction = item => {
    if (item.action === 'sync') {
      handleSync();
      return;
    }
    if (item.stack) {
      navigation.getParent()?.navigate(item.screen);
    } else {
      navigation.navigate(item.screen);
    }
  };

  const handleMenuPress = item => {
    if (item.stack) {
      navigation.getParent()?.navigate(item.screen);
    } else {
      navigation.navigate(item.screen);
    }
  };

  const openNavigation = () => navigation.openDrawer();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={openNavigation} style={styles.menuBtn}>
            <MaterialCommunityIcons name="menu" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.brandText}>RJS Inspector</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isConnected ? colors.online : colors.danger },
                ]}
              />
              <Text style={styles.statusLabel}>
                {isConnected ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.getParent()?.navigate('Profil')}
            style={styles.avatarBtn}
          >
            <MaterialCommunityIcons
              name="account-hard-hat"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.subGreeting}>
          {pendingSyncCount > 0
            ? `${pendingSyncCount} draft menunggu sinkronisasi`
            : stats.pending > 0
              ? `Ada ${stats.pending} pekerjaan menunggu diselesaikan`
              : 'Semua pekerjaan sudah selesai hari ini'}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsRow}>
          {[
            { label: 'Total Alat', value: stats.total, icon: 'shield-check', color: colors.primary },
            { label: 'Pending', value: stats.pending, icon: 'clock-outline', color: '#E65100' },
            { label: 'Selesai', value: stats.completed, icon: 'check-circle', color: colors.accent },
          ].map((stat, i) => (
            <Surface
              key={i}
              style={[styles.statCard, { width: statCardWidth }]}
              elevation={2}
            >
              <MaterialCommunityIcons
                name={stat.icon}
                size={22}
                color={stat.color}
              />
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Surface>
          ))}
        </View>

        {pendingSyncCount > 0 ? (
          <TouchableOpacity onPress={handleSync} activeOpacity={0.85}>
            <Surface style={styles.syncBanner} elevation={1}>
              <MaterialCommunityIcons
                name="cloud-upload-outline"
                size={22}
                color={colors.warning}
              />
              <View style={styles.syncBannerText}>
                <Text style={styles.syncBannerTitle}>
                  {pendingSyncCount} draft belum tersinkron
                </Text>
                <Text style={styles.syncBannerDesc}>
                  Ketuk untuk mengirim ke server
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#CBD5E1"
              />
            </Surface>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickItem}
              onPress={() => handleQuickAction(item)}
              activeOpacity={0.75}
            >
              <Surface style={styles.quickCard} elevation={1}>
                {item.badge ? (
                  <View style={styles.quickBadge}>
                    <Text style={styles.quickBadgeText}>{item.badge}</Text>
                  </View>
                ) : null}
                <View
                  style={[
                    styles.quickIcon,
                    { backgroundColor: item.color + '15' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={26}
                    color={item.color}
                  />
                </View>
                <Text style={styles.quickTitle}>{item.title}</Text>
              </Surface>
            </TouchableOpacity>
          ))}
        </View>

        {pendingPreview.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Prioritas Berikutnya</Text>
              <TouchableOpacity
                onPress={() => navigation.getParent()?.navigate('JadwalRiksa')}
              >
                <Text style={styles.seeAll}>Lihat semua</Text>
              </TouchableOpacity>
            </View>

            {pendingPreview.map((item, index) => (
              <Surface key={index} style={styles.previewCard} elevation={1}>
                <View style={styles.previewTop}>
                  <View style={styles.previewIcon}>
                    <MaterialCommunityIcons
                      name="wrench-clock"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.previewInfo}>
                    <Text style={styles.previewClient}>{item.clientName}</Text>
                    <Text style={styles.previewObject}>{item.objectName}</Text>
                    <Text style={styles.previewMeta}>
                      {item.bidang}
                      {item.subSector ? ` · ${item.subSector}` : ''}
                    </Text>
                    <Text style={styles.previewMeta}>
                      {item.location} · {formatDate(item.scheduleDate)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.previewBtn}
                  onPress={() =>
                    navigation.getParent()?.navigate('Execution', {
                      objectId: item.objectId,
                    })
                  }
                >
                  <Text style={styles.previewBtnText}>Mulai Inspeksi</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </Surface>
            ))}
          </>
        ) : null}

        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Menu Utama</Text>
        {MAIN_MENUS.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.8}
          >
            <Surface style={styles.menuCard} elevation={1}>
              <View
                style={[
                  styles.menuIconWrap,
                  { backgroundColor: item.color + '12' },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={26}
                  color={item.color}
                />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#CBD5E1"
              />
            </Surface>
          </TouchableOpacity>
        ))}

        <Surface style={styles.k3Banner} elevation={0}>
          <MaterialCommunityIcons
            name="shield-alert-outline"
            size={22}
            color={colors.warning}
          />
          <Text style={styles.k3Text}>
            Utamakan Keselamatan dan Kesehatan Kerja di setiap lokasi inspeksi
          </Text>
        </Surface>

        {lastSync ? (
          <Text style={styles.syncText}>
            Terakhir sinkron:{' '}
            {lastSync.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        ) : null}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 28,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { alignItems: 'center' },
  brandText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4, marginRight: 5 },
  statusLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  userName: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 2 },
  subGreeting: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  scroll: { flex: 1, paddingHorizontal: spacing.xl },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -18,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  statValue: { fontSize: 22, fontWeight: '900', marginTop: 6 },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 2,
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: spacing.md,
  },
  syncBannerText: { flex: 1 },
  syncBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  syncBannerDesc: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickItem: { width: '48%', marginBottom: 12 },
  quickCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  quickBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  quickBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  previewTop: { flexDirection: 'row', marginBottom: 12 },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewInfo: { flex: 1 },
  previewClient: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  previewObject: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  previewMeta: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  previewBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  menuIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  menuDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  k3Banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: 14,
    marginTop: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    gap: 10,
  },
  k3Text: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 17 },
  syncText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 14,
  },
});
