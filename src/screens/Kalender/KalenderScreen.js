import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { calendarService } from '../../services/calendar-service';
import ScreenHeader from '../../components/ui/ScreenHeader';
import LoadingScreen from '../../components/ui/LoadingScreen';
import EmptyState from '../../components/ui/EmptyState';
import { colors, radius, spacing, shadow } from '../../theme';

const TYPE_META = {
  inspection: { label: 'Riksa Uji', color: colors.primary, icon: 'calendar-check' },
  renewal: { label: 'Renewal', color: '#E65100', icon: 'certificate-outline' },
};

function formatDayLabel(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return dateStr;
  }
}

function EventRow({ event }) {
  const meta = TYPE_META[event.type] || TYPE_META.inspection;

  return (
    <Surface style={styles.eventCard} elevation={1}>
      <View style={[styles.eventAccent, { backgroundColor: meta.color }]} />
      <View style={styles.eventBody}>
        <View style={styles.eventTop}>
          <View style={[styles.eventIcon, { backgroundColor: meta.color + '15' }]}>
            <MaterialCommunityIcons name={meta.icon} size={20} color={meta.color} />
          </View>
          <View style={styles.eventMain}>
            <Chip compact style={[styles.typeChip, { backgroundColor: meta.color + '18' }]}>
              {meta.label}
            </Chip>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
        </View>
      </View>
    </Surface>
  );
}

export default function KalenderScreen({ navigation }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calendar, setCalendar] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const data = await calendarService.getEvents(year, month);
      setCalendar(data);
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Tidak dapat memuat kalender.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [year, month]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData]),
  );

  const shiftMonth = delta => {
    let nextMonth = month + delta;
    let nextYear = year;
    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    } else if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    setYear(nextYear);
    setMonth(nextMonth);
    setLoading(true);
  };

  const events = calendar?.events || [];
  const grouped = events.reduce((acc, ev) => {
    const key = ev.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();

  if (loading && !calendar) {
    return <LoadingScreen message="Memuat kalender..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Kalender"
        subtitle="Jadwal riksa & renewal sertifikat"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.monthBar}>
        <TouchableOpacity onPress={() => shiftMonth(-1)} style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.monthCenter}>
          <Text style={styles.monthLabel}>{calendar?.month_label || `${month}/${year}`}</Text>
          <Text style={styles.monthSummary}>
            {calendar?.summary?.inspection_count || 0} riksa ·{' '}
            {calendar?.summary?.renewal_count || 0} renewal
          </Text>
        </View>
        <TouchableOpacity onPress={() => shiftMonth(1)} style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

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
        {dates.length === 0 ? (
          <EmptyState
            icon="calendar-blank-outline"
            title="Tidak ada agenda"
            description="Tidak ada jadwal riksa atau renewal pada bulan ini."
          />
        ) : (
          dates.map(dateKey => (
            <View key={dateKey} style={styles.dayGroup}>
              <Text style={styles.dayTitle}>{formatDayLabel(dateKey)}</Text>
              {grouped[dateKey].map(ev => (
                <EventRow key={ev.id} event={ev} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthCenter: { flex: 1, alignItems: 'center' },
  monthLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  monthSummary: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  content: { padding: spacing.lg, paddingBottom: 40 },
  dayGroup: { marginBottom: spacing.lg },
  dayTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  eventAccent: { height: 3 },
  eventBody: { padding: spacing.md },
  eventTop: { flexDirection: 'row', gap: spacing.md },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventMain: { flex: 1 },
  typeChip: { alignSelf: 'flex-start', marginBottom: 6 },
  eventTitle: { fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 20 },
});
