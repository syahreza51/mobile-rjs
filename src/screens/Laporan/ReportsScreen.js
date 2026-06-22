import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text, Surface, Searchbar, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { reportService } from '../../services/report-service';
import ScreenHeader from '../../components/ui/ScreenHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { colors, radius, spacing, shadow } from '../../theme';

function ProjectCard({ item, onPress }) {
  const clientName = item.purchase_order?.client?.name || item.client_name || 'Klien';
  const poCode =
    item.purchase_order?.internal_po_code ||
    item.purchase_order?.po_number ||
    item.po_number ||
    '-';
  const reportCount = item.reports?.length || item.total_reports || 0;
  const objectCount = item.objects?.length || item.total_objects || 0;

  return (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.cardTop}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="file-document-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.cardMain}>
          <Text style={styles.clientName} numberOfLines={1}>
            {clientName}
          </Text>
          <Text style={styles.meta}>PO: {poCode}</Text>
          <Text style={styles.meta}>
            {objectCount} alat · {reportCount} dokumen
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textLight} />
      </View>
      <Button mode="contained-tonal" compact onPress={onPress} icon="eye-outline">
        Lihat Laporan
      </Button>
    </Surface>
  );
}

export default function ReportsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadData = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        const result = await reportService.getProjects({
          page: pageNum,
          search: query || undefined,
        });
        setItems(prev => (append ? [...prev, ...result.items] : result.items));
        setPage(result.currentPage);
        setLastPage(result.lastPage);
      } catch (error) {
        Alert.alert(
          'Gagal',
          error.response?.data?.message || 'Tidak dapat memuat daftar laporan.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [query],
  );

  useFocusEffect(
    useCallback(() => {
      loadData(1, false);
    }, [loadData]),
  );

  useEffect(() => {
    if (!query && items.length === 0) return;
    setLoading(true);
    loadData(1, false);
  }, [query]);

  const onSearch = () => {
    setLoading(true);
    setQuery(search.trim());
  };

  const loadMore = () => {
    if (loadingMore || page >= lastPage) return;
    setLoadingMore(true);
    loadData(page + 1, true);
  };

  if (loading && items.length === 0) {
    return <LoadingScreen message="Memuat daftar laporan..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Laporan Proyek"
        subtitle="Preview dokumen read-only"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchWrap}>
        <Searchbar
          placeholder="Cari nama klien..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSearch}
          onIconPress={onSearch}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ProjectCard
            item={item}
            onPress={() => navigation.navigate('ReportDetail', { inspectionId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData(1, false);
            }}
            colors={[colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <Text style={styles.footerText}>Memuat...</Text>
          ) : page < lastPage ? (
            <Text style={styles.footerText}>Geser untuk muat lebih banyak</Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="file-search-outline"
            title="Belum ada laporan"
            description="Proyek dengan dokumen laporan akan muncul di sini."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  searchbar: { backgroundColor: colors.surface, borderRadius: radius.md },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMain: { flex: 1 },
  clientName: { fontSize: 15, fontWeight: '800', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    paddingVertical: spacing.md,
  },
});
