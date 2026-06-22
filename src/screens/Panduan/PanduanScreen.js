import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { colors, radius, spacing, shadow } from '../../theme';

const CHECKLIST_ITEMS = [
  {
    icon: 'hard-hat',
    color: colors.primary,
    title: 'APD Lengkap',
    desc: 'Pastikan helm, sepatu safety, rompi, dan APD khusus bidang sudah dipakai.',
  },
  {
    icon: 'clipboard-check-outline',
    color: colors.accent,
    title: 'Cek Dokumen',
    desc: 'Bawa surat tugas, identitas petugas, dan referensi standar uji yang relevan.',
  },
  {
    icon: 'camera-outline',
    color: '#7C3AED',
    title: 'Dokumentasi Foto',
    desc: 'Ambil foto kondisi alat sebelum, saat, dan setelah pemeriksaan.',
  },
  {
    icon: 'map-marker-radius',
    color: colors.danger,
    title: 'Verifikasi Lokasi',
    desc: 'Pastikan nama klien, lokasi, dan objek alat sesuai jadwal penugasan.',
  },
  {
    icon: 'wifi-strength-off',
    color: colors.warning,
    title: 'Mode Offline',
    desc: 'Isi formulir tetap bisa dilanjutkan; sinkronkan saat koneksi kembali stabil.',
  },
  {
    icon: 'alert-octagon-outline',
    color: colors.danger,
    title: 'Temuan Bahaya',
    desc: 'Catat temuan K3 kritis segera dan laporkan ke supervisor jika diperlukan.',
  },
];

const WORKFLOW_STEPS = [
  'Buka Jadwal Kerja → pilih penugasan hari ini',
  'Pilih objek alat yang akan diinspeksi',
  'Isi formulir pemeriksaan sesuai sub-bidang',
  'Lampirkan foto dokumentasi',
  'Simpan & selesaikan inspeksi',
  'Cek Riwayat untuk memastikan data tersimpan',
];

export default function PanduanScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Panduan Lapangan"
        subtitle="Checklist K3 & alur kerja"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={styles.hero} elevation={1}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={32}
              color={colors.primary}
            />
          </View>
          <Text style={styles.heroTitle}>Checklist Sebelum Inspeksi</Text>
          <Text style={styles.heroDesc}>
            Panduan singkat untuk memastikan inspeksi lapangan berjalan aman dan
            sesuai prosedur.
          </Text>
        </Surface>

        {CHECKLIST_ITEMS.map((item, index) => (
          <Surface key={index} style={styles.checkItem} elevation={1}>
            <View
              style={[
                styles.checkIcon,
                { backgroundColor: item.color + '15' },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={item.color}
              />
            </View>
            <View style={styles.checkContent}>
              <Text style={styles.checkTitle}>{item.title}</Text>
              <Text style={styles.checkDesc}>{item.desc}</Text>
            </View>
          </Surface>
        ))}

        <Surface style={styles.workflow} elevation={1}>
          <Text style={styles.workflowTitle}>Alur Kerja Inspeksi</Text>
          {WORKFLOW_STEPS.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Surface>

        <Surface style={styles.tipBanner} elevation={0}>
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={22}
            color={colors.warning}
          />
          <Text style={styles.tipText}>
            Utamakan keselamatan kerja. Hentikan inspeksi jika kondisi lokasi
            tidak aman.
          </Text>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingBottom: 40 },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  heroDesc: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  checkItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  checkIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkContent: { flex: 1 },
  checkTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  checkDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 17,
  },
  workflow: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  workflowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumberText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 19 },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    gap: 10,
  },
  tipText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 17 },
});
