import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import {
  Text,
  Divider,
  List,
  Avatar,
  Appbar,
  Surface,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SAFETY_COLORS = {
  primary: '#0055A4',
  success: '#009639',
  danger: '#C8102E',
  warning: '#E65100',
  background: '#F2F4F7',
};

// --- HELPER COMPONENTS ---

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const MeasureBox = ({ items }) => (
  <View style={styles.measureBox}>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <View style={styles.measureItem}>
          <Text style={styles.measureLabel}>{item.label}</Text>
          <Text
            style={[
              styles.measureValue,
              {
                color:
                  parseFloat(item.value) > item.limit
                    ? item.reverse
                      ? SAFETY_COLORS.success
                      : SAFETY_COLORS.danger
                    : item.reverse
                    ? SAFETY_COLORS.danger
                    : SAFETY_COLORS.success,
              },
            ]}
          >
            {item.value || '0'}
            <Text style={styles.unit}> {item.unit}</Text>
          </Text>
        </View>
        {index < items.length - 1 && <View style={styles.verticalDivider} />}
      </React.Fragment>
    ))}
  </View>
);

// --- SUB-KOMPONEN PER BIDANG ---

const RenderDetailPAPA = ({ data }) => (
  <>
    <Text variant="titleSmall" style={styles.sectionTitle}>
      II. DATA TEKNIS PAPA
    </Text>
    <InfoRow label="Kapasitas Angkat" value={`${data.kapasitas} Kg`} />
    <InfoRow label="Tinggi Angkat Max" value={`${data.tinggiAngkat} M`} />
    <Divider style={styles.divider} />
    <Text variant="titleSmall" style={styles.sectionTitle}>
      III. HASIL PENGUKURAN
    </Text>
    <MeasureBox
      items={[
        { label: 'Grounding', value: data.grounding, unit: 'Ω', limit: 5 },
        { label: 'Kebisingan', value: data.kebisingan, unit: 'dB', limit: 85 },
      ]}
    />
  </>
);

const RenderDetailListrik = ({ data }) => (
  <>
    <Text variant="titleSmall" style={styles.sectionTitle}>
      II. DATA TEKNIS INSTALASI
    </Text>
    <InfoRow label="Tahanan Isolasi" value={`${data.tahananIsolasi} MΩ`} />
    <InfoRow label="Tegangan Kerja" value={`${data.tegangan} Volt`} />
    <Divider style={styles.divider} />
    <Text variant="titleSmall" style={styles.sectionTitle}>
      III. HASIL PENGUKURAN
    </Text>
    <MeasureBox
      items={[
        { label: 'Grounding', value: data.grounding, unit: 'Ω', limit: 5 },
      ]}
    />
  </>
);

const RenderDetailPUBT = ({ data }) => (
  <>
    <Text variant="titleSmall" style={styles.sectionTitle}>
      II. DATA TEKNIS PUBT
    </Text>
    <InfoRow label="Tekanan Desain" value={`${data.tekananDesain} Bar`} />
    <InfoRow label="Temperatur Desain" value={`${data.tempDesain} °C`} />
    <InfoRow label="Fluida" value={data.fluida} />
  </>
);

const RenderDetailFire = ({ data }) => (
  <>
    <Text variant="titleSmall" style={styles.sectionTitle}>
      II. DATA PROTEKSI KEBAKARAN
    </Text>
    <InfoRow label="Jenis Media" value={data.jenisMedia} />
    <InfoRow label="Tekanan Kerja" value={`${data.tekanan} Bar`} />
  </>
);

const RenderDetailPTP = ({ data }) => (
  <>
    <Text variant="titleSmall" style={styles.sectionTitle}>
      II. DATA TEKNIS PRODUKSI
    </Text>
    <InfoRow label="Daya Terpasang" value={`${data.daya} KW`} />
    <InfoRow label="Putaran (RPM)" value={data.rpm} />
  </>
);

const RenderDetailElevator = ({ data }) => (
  <>
    <Text variant="titleSmall" style={styles.sectionTitle}>
      II. DATA ELEVATOR & ESCALATOR
    </Text>
    <InfoRow label="Kapasitas Orang" value={`${data.kapasitasOrang} Org`} />
    <InfoRow label="Jumlah Lantai" value={data.lantai} />
  </>
);

// --- MAIN SCREEN ---

export default function DetailRiwayatScreen({ route, navigation }) {
  const data = route.params?.data || {};
  const bidang = data.bidang?.toUpperCase();

  const getStatusColor = status =>
    status === 'LAYAK' ? SAFETY_COLORS.success : SAFETY_COLORS.danger;

  const getBidangIcon = () => {
    const icons = {
      PAPA: 'crane',
      LISTRIK: 'flash-circle',
      PUBT: 'tank',
      FIRE: 'fire-extinguisher',
      PTP: 'engine-outline',
      ELEVATOR: 'elevator-passenger',
    };
    return icons[bidang] || 'file-document';
  };

  const renderTeknisContent = () => {
    switch (bidang) {
      case 'PAPA':
        return <RenderDetailPAPA data={data} />;
      case 'LISTRIK':
        return <RenderDetailListrik data={data} />;
      case 'PUBT':
        return <RenderDetailPUBT data={data} />;
      case 'FIRE':
        return <RenderDetailFire data={data} />;
      case 'PTP':
        return <RenderDetailPTP data={data} />;
      case 'ELEVATOR':
        return <RenderDetailElevator data={data} />;
      default:
        return (
          <Text style={{ fontStyle: 'italic' }}>
            Informasi teknis tidak tersedia.
          </Text>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: SAFETY_COLORS.background }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={SAFETY_COLORS.primary}
      />

      <Appbar.Header style={{ backgroundColor: SAFETY_COLORS.primary }}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={`Laporan Detail ${bidang}`}
          color="white"
          titleStyle={{ fontWeight: 'bold' }}
        />
      </Appbar.Header>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Surface style={styles.card} elevation={2}>
          <View style={styles.cardHeader}>
            <Avatar.Icon
              size={50}
              icon={getBidangIcon()}
              style={{ backgroundColor: SAFETY_COLORS.primary + '15' }}
              color={SAFETY_COLORS.primary}
            />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text variant="titleLarge" style={styles.companyName}>
                {data.pemilik || data.namaPerusahaan || 'Tanpa Nama'}
              </Text>
              <View style={styles.dateRow}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={14}
                  color="#64748B"
                />
                <Text style={styles.dateText}>
                  {' '}
                  {data.tanggalInput || data.createdAt}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.contentPadding}>
            {/* Status Section */}
            <View style={styles.statusSection}>
              <View
                style={[
                  styles.statusLine,
                  { backgroundColor: getStatusColor(data.statusKelayakan) },
                ]}
              />
              <View style={styles.statusContent}>
                <Text style={styles.statusLabel}>KESIMPULAN AKHIR</Text>
                <Text
                  style={[
                    styles.statusValue,
                    { color: getStatusColor(data.statusKelayakan) },
                  ]}
                >
                  {data.statusKelayakan || 'PENDING'}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Bagian I: Identitas Umum */}
            <Text variant="titleSmall" style={styles.sectionTitle}>
              I. IDENTITAS OBJEK
            </Text>
            <InfoRow label="Jenis Alat" value={data.subAlat} />
            <InfoRow label="Merk / Model" value={data.merkModel} />
            <InfoRow label="No. Seri / Kode" value={data.noSeri} />

            <Divider style={styles.divider} />

            {/* Bagian II & III: Dinamis Sesuai Bidang */}
            {renderTeknisContent()}

            <Divider style={styles.divider} />

            {/* Bagian IV: Temuan & Saran */}
            <Text variant="titleSmall" style={styles.sectionTitle}>
              IV. TEMUAN & SARAN
            </Text>

            <List.Accordion
              title="Temuan Lapangan"
              titleStyle={styles.accordionTitle}
              left={props => (
                <List.Icon
                  {...props}
                  icon="eye-outline"
                  color={SAFETY_COLORS.primary}
                />
              )}
              style={styles.accordion}
            >
              <View style={styles.longTextContainer}>
                <Text style={styles.longText}>
                  {data.temuan || 'Tidak ada temuan khusus.'}
                </Text>
              </View>
            </List.Accordion>

            <List.Accordion
              title="Saran Perbaikan"
              titleStyle={styles.accordionTitle}
              left={props => (
                <List.Icon
                  {...props}
                  icon="wrench-outline"
                  color={SAFETY_COLORS.warning}
                />
              )}
              style={styles.accordion}
            >
              <View style={styles.longTextContainer}>
                <Text style={styles.longText}>
                  {data.saran || 'Pemeliharaan rutin sesuai manual book.'}
                </Text>
              </View>
            </List.Accordion>
          </View>
        </Surface>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Sistem Sertifikasi Digital Swastika K3
          </Text>
          <Text style={styles.footerText}>Dokumen ini sah secara digital</Text>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  card: { borderRadius: 16, backgroundColor: 'white', overflow: 'hidden' },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  companyName: { fontWeight: 'bold', color: '#1E293B', fontSize: 18 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dateText: { color: '#64748B', fontSize: 12 },
  contentPadding: { padding: 20 },
  statusSection: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 5,
  },
  statusLine: { width: 6 },
  statusContent: { padding: 12 },
  statusLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusValue: { fontSize: 18, fontWeight: '900' },
  sectionTitle: {
    fontWeight: 'bold',
    color: SAFETY_COLORS.primary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: { color: '#64748B', fontSize: 14 },
  value: { fontWeight: '700', color: '#1E293B', fontSize: 14 },
  divider: { marginVertical: 18, height: 1, backgroundColor: '#F1F5F9' },
  measureBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    paddingVertical: 15,
  },
  measureItem: { flex: 1, alignItems: 'center' },
  verticalDivider: { width: 1, height: '60%', backgroundColor: '#E2E8F0' },
  measureLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  measureValue: { fontSize: 22, fontWeight: 'bold' },
  unit: { fontSize: 12, color: '#94A3B8' },
  accordion: { backgroundColor: 'white', paddingHorizontal: 0 },
  accordionTitle: { fontSize: 14, fontWeight: '600', color: '#334155' },
  longTextContainer: {
    padding: 15,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginBottom: 10,
  },
  longText: { color: '#475569', lineHeight: 20, fontSize: 13 },
  footer: { marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic' },
});
