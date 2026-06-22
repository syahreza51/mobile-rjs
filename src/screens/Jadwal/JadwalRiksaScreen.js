import React, { useState, useCallback, useEffect } from 'react';

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

  Button,

  Divider,

  Surface,

  Searchbar,

} from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useFocusEffect } from '@react-navigation/native';

import { inspectionService } from '../../services/inspection-service';

import {

  getObjectDisplayInfo,

  formatBidangLabel,

} from '../../lib/inspection-object';



import ScreenHeader from '../../components/ui/ScreenHeader';

import EmptyState from '../../components/ui/EmptyState';

import LoadingScreen from '../../components/ui/LoadingScreen';

import StatusChip from '../../components/ui/StatusChip';

import { colors, radius, spacing } from '../../theme';



const STATUS_FILTERS = [

  { value: 'all', label: 'Semua' },

  { value: 'scheduled', label: 'Terjadwal' },

  { value: 'in_progress', label: 'Berjalan' },

  { value: 'completed', label: 'Selesai' },

];



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



function ObjectCard({ obj, onPress }) {

  const info = getObjectDisplayInfo(obj);

  const bidang = formatBidangLabel(info);



  return (

    <Surface style={styles.objectCard} elevation={1}>

      <View style={styles.objectTop}>

        <View style={styles.objectIconWrap}>

          <MaterialCommunityIcons

            name="wrench-clock"

            size={22}

            color={colors.primary}

          />

        </View>

        <View style={styles.objectMain}>

          <Text style={styles.objectName}>{info.name}</Text>

          <View style={styles.tagRow}>

            <View style={styles.tag}>

              <MaterialCommunityIcons

                name="domain"

                size={13}

                color={colors.primary}

              />

              <Text style={styles.tagLabel}>Bidang</Text>

              <Text style={styles.tagValue}>{bidang}</Text>

            </View>

            {info.subSector ? (

              <View style={styles.tag}>

                <MaterialCommunityIcons

                  name="shape-outline"

                  size={13}

                  color={colors.accent}

                />

                <Text style={styles.tagLabel}>Sub</Text>

                <Text style={styles.tagValue}>{info.subSector}</Text>

              </View>

            ) : null}

          </View>

          {info.location ? (

            <View style={styles.locationRow}>

              <MaterialCommunityIcons

                name="map-marker-outline"

                size={14}

                color={colors.textMuted}

              />

              <Text style={styles.locationText}>{info.location}</Text>

            </View>

          ) : null}

        </View>

      </View>



      <View style={styles.objectFooter}>

        <StatusChip status={obj.status_uji} />

        <Button

          mode="contained"

          compact

          buttonColor={colors.primary}

          onPress={onPress}

          icon={obj.status_uji === 'completed' ? 'eye' : 'play'}

        >

          {obj.status_uji === 'completed' ? 'Lihat' : 'Mulai Riksa'}

        </Button>

      </View>

    </Surface>

  );

}



export default function JadwalRiksaScreen({ navigation }) {

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [inspections, setInspections] = useState([]);

  const [search, setSearch] = useState('');

  const [query, setQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [total, setTotal] = useState(0);



  const loadData = useCallback(

    async (pageNum = 1, append = false) => {

      try {

        const result = await inspectionService.getMyInspections({

          page: pageNum,

          search: query || undefined,

          status: statusFilter === 'all' ? undefined : statusFilter,

        });

        setInspections(prev =>

          append ? [...prev, ...result.items] : result.items,

        );

        setPage(result.currentPage);

        setLastPage(result.lastPage);

        setTotal(result.total);

      } catch (error) {

        Alert.alert(

          'Gagal',

          error.response?.data?.message || 'Tidak dapat memuat jadwal.',

        );

      } finally {

        setLoading(false);

        setRefreshing(false);

        setLoadingMore(false);

      }

    },

    [query, statusFilter],

  );



  useFocusEffect(

    useCallback(() => {

      loadData(1, false);

    }, [loadData]),

  );



  useEffect(() => {

    setLoading(true);

    loadData(1, false);

  }, [query, statusFilter]);



  const onRefresh = () => {

    setRefreshing(true);

    loadData(1, false);

  };



  const onSearch = () => {

    setLoading(true);

    setQuery(search.trim());

  };



  const onFilterChange = value => {

    setStatusFilter(value);

    setLoading(true);

  };



  const loadMore = () => {

    if (loadingMore || page >= lastPage) return;

    setLoadingMore(true);

    loadData(page + 1, true);

  };



  const startInspection = objectId => {

    navigation.navigate('Execution', { objectId });

  };



  if (loading && inspections.length === 0) {

    return <LoadingScreen message="Memuat jadwal penugasan..." />;

  }



  return (

    <SafeAreaView style={styles.container}>

      <ScreenHeader

        title="Jadwal Riksa Uji"

        subtitle={`${total || inspections.length} penugasan`}

        onBack={() => navigation.goBack()}

      />



      <View style={styles.filtersWrap}>

        <Searchbar

          placeholder="Cari klien, PO, atau alat..."

          value={search}

          onChangeText={setSearch}

          onSubmitEditing={onSearch}

          onIconPress={onSearch}

          style={styles.searchbar}

        />

        <ScrollView

          horizontal

          showsHorizontalScrollIndicator={false}

          contentContainerStyle={styles.chipRow}

        >

          {STATUS_FILTERS.map(f => (

            <Chip

              key={f.value}

              selected={statusFilter === f.value}

              onPress={() => onFilterChange(f.value)}

              style={styles.filterChip}

            >

              {f.label}

            </Chip>

          ))}

        </ScrollView>

      </View>



      <ScrollView

        contentContainerStyle={styles.content}

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={onRefresh}

            colors={[colors.primary]}

          />

        }

        onScroll={({ nativeEvent }) => {

          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

          const nearBottom =

            layoutMeasurement.height + contentOffset.y >= contentSize.height - 80;

          if (nearBottom) loadMore();

        }}

        scrollEventThrottle={200}

      >

        <Text variant="titleMedium" style={styles.sectionTitle}>

          Penugasan Inspeksi

        </Text>



        {inspections.length === 0 ? (

          <EmptyState

            icon="calendar-blank-outline"

            title="Belum ada penugasan"

            description="Penugasan inspeksi dari office akan muncul di sini."

          />

        ) : (

          inspections.map(insp => (

            <Card key={insp.id} style={styles.scheduleCard}>

              <Card.Content>

                <View style={styles.cardHeader}>

                  <Text variant="titleLarge" style={styles.companyName}>

                    {insp.client_name}

                  </Text>

                  <Chip mode="flat" style={{ backgroundColor: colors.primaryLight }}>

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

                  <IconButton

                    icon="file-document"

                    size={20}

                    style={styles.iconInfo}

                  />

                  <Text variant="bodyMedium">PO: {insp.po_number}</Text>

                </View>



                {insp.sub_sectors?.length > 0 ? (

                  <View style={styles.subSectorSummary}>

                    <Text style={styles.summaryLabel}>Ruang lingkup uji:</Text>

                    <View style={styles.summaryChips}>

                      {insp.sub_sectors.map((sub, idx) => (

                        <Chip key={idx} compact style={styles.summaryChip}>

                          {sub.name} ({sub.qty})

                        </Chip>

                      ))}

                    </View>

                  </View>

                ) : null}



                {insp.progress ? (

                  <Text style={styles.progressText}>

                    Progress: {insp.progress.completed}/{insp.progress.total}{' '}

                    alat ({insp.progress.percentage}%)

                  </Text>

                ) : null}



                <Divider style={styles.divider} />

                <Text style={styles.objectsTitle}>

                  Daftar Alat ({(insp.objects || []).length})

                </Text>



                {(insp.objects || []).map(obj => (

                  <ObjectCard

                    key={obj.id}

                    obj={obj}

                    onPress={() => startInspection(obj.id)}

                  />

                ))}

              </Card.Content>

            </Card>

          ))

        )}



        {loadingMore ? (

          <Text style={styles.footerText}>Memuat penugasan berikutnya...</Text>

        ) : page < lastPage ? (

          <Text style={styles.footerText}>Geser ke bawah untuk muat lebih banyak</Text>

        ) : null}

      </ScrollView>

    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: colors.background },

  filtersWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },

  searchbar: { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.sm },

  chipRow: { gap: 8, paddingBottom: spacing.xs },

  filterChip: { marginRight: 4 },

  content: { padding: spacing.lg, paddingTop: 0, paddingBottom: 40 },

  sectionTitle: { marginBottom: spacing.md, color: colors.textMuted, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },

  scheduleCard: {

    marginBottom: spacing.md,

    backgroundColor: colors.surface,

    borderRadius: radius.lg,

    borderWidth: 1,

    borderColor: colors.border,

  },

  cardHeader: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

    marginBottom: 10,

  },

  companyName: { flex: 1, fontWeight: 'bold', color: colors.text },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: -10 },

  iconInfo: { marginLeft: -10 },

  subSectorSummary: { marginTop: 10 },

  summaryLabel: {

    fontSize: 12,

    fontWeight: '700',

    color: colors.textMuted,

    marginBottom: 6,

  },

  summaryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  summaryChip: { backgroundColor: colors.primarySoft },

  progressText: {

    fontSize: 12,

    color: colors.primary,

    fontWeight: '700',

    marginTop: 10,

  },

  divider: { marginVertical: 12 },

  objectsTitle: { fontWeight: '700', color: colors.textSecondary, marginBottom: 10 },

  objectCard: {

    backgroundColor: colors.surfaceMuted,

    borderRadius: radius.md,

    padding: 14,

    marginBottom: 10,

    borderWidth: 1,

    borderColor: colors.border,

  },

  objectTop: { flexDirection: 'row', gap: 12 },

  objectIconWrap: {

    width: 44,

    height: 44,

    borderRadius: 12,

    backgroundColor: colors.primarySoft,

    justifyContent: 'center',

    alignItems: 'center',

  },

  objectMain: { flex: 1 },

  objectName: {

    fontWeight: '800',

    fontSize: 15,

    color: colors.text,

    marginBottom: 8,

  },

  tagRow: { gap: 6 },

  tag: {

    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 4,

    backgroundColor: colors.surface,

    borderRadius: radius.sm,

    paddingHorizontal: 8,

    paddingVertical: 5,

    borderWidth: 1,

    borderColor: colors.border,

  },

  tagLabel: {

    fontSize: 10,

    fontWeight: '700',

    color: colors.textLight,

    textTransform: 'uppercase',

  },

  tagValue: {

    fontSize: 12,

    fontWeight: '600',

    color: colors.textSecondary,

    flexShrink: 1,

  },

  locationRow: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    marginTop: 8,

  },

  locationText: { fontSize: 11, color: colors.textMuted, flex: 1 },

  objectFooter: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 12,

    paddingTop: 10,

    borderTopWidth: 1,

    borderTopColor: colors.border,

  },

  footerText: {

    textAlign: 'center',

    fontSize: 12,

    color: colors.textMuted,

    paddingVertical: spacing.md,

  },

});

