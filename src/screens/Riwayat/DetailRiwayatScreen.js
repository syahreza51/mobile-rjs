import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Card,
  Divider,
  List,
  Avatar,
  Appbar,
  Chip,
} from 'react-native-paper';

export default function DetailRiwayatScreen({ route, navigation }) {
  const data = route.params?.data || {};
  const bidang = data.bidang?.toUpperCase();

  // Helper Warna
  const getStatusColor = status => (status === 'LAYAK' ? '#22c55e' : '#ef4444');

  // --- Komponen Detail Spesifik per Bidang ---

  const RenderDetailPAPA = () => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        II. Spesifikasi & Teknis PAPA
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Kapasitas:</Text>
        <Text style={styles.value}>{data.kapasitas || '-'} Kg</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Tinggi Angkat:</Text>
        <Text style={styles.value}>{data.tinggiAngkat || '-'} m</Text>
      </View>
      <Divider style={styles.divider} />
      <Text variant="titleMedium" style={styles.sectionTitle}>
        III. Hasil Pengukuran
      </Text>
      <View style={styles.measureBox}>
        <View style={styles.measureItem}>
          <Text style={styles.measureLabel}>Grounding</Text>
          <Text
            style={[
              styles.measureValue,
              { color: parseFloat(data.grounding) > 5 ? '#ef4444' : '#22c55e' },
            ]}
          >
            {data.grounding || '0'} Ω
          </Text>
        </View>
        <View style={styles.measureItem}>
          <Text style={styles.measureLabel}>Kebisingan</Text>
          <Text
            style={[
              styles.measureValue,
              {
                color: parseFloat(data.kebisingan) > 85 ? '#f97316' : '#22c55e',
              },
            ]}
          >
            {data.kebisingan || '0'} dB
          </Text>
        </View>
      </View>
    </>
  );

  const RenderDetailListrik = () => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        II. Teknis Instalasi Listrik
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Tahanan Isolasi:</Text>
        <Text style={styles.value}>{data.tahananIsolasi || '-'} MΩ</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Tegangan:</Text>
        <Text style={styles.value}>{data.tegangan || '-'} Volt</Text>
      </View>
    </>
  );

  // --- Main Render ---

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Appbar.Header style={{ backgroundColor: '#2563eb' }}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Detail ${bidang || 'Laporan'}`} color="white" />
      </Appbar.Header>

      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Avatar.Icon
              size={48}
              icon={bidang === 'PAPA' ? 'crane' : 'flash'}
              style={{ backgroundColor: '#dbeafe' }}
              color="#2563eb"
            />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text variant="titleLarge" style={styles.companyName}>
                {data.pemilik || data.namaPerusahaan || 'Tanpa Nama'}
              </Text>
              <Text variant="bodySmall">
                {data.tanggalInput || data.createdAt}
              </Text>
            </View>
            <Chip textStyle={{ fontSize: 10 }}>{bidang}</Chip>
          </View>

          <Card.Content>
            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              I. Identitas Objek
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Sub Alat:</Text>
              <Text style={styles.value}>{data.subAlat || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Merk/Model:</Text>
              <Text style={styles.value}>{data.merkModel || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>No. Seri:</Text>
              <Text style={styles.value}>{data.noSeri || '-'}</Text>
            </View>

            <Divider style={styles.divider} />

            {/* Render konten berdasarkan BIDANG */}
            {bidang === 'PAPA' && <RenderDetailPAPA />}
            {bidang === 'LISTRIK' && <RenderDetailListrik />}
            {/* Tambahkan bidang lain di sini jika sudah ada formnya */}

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              IV. Kesimpulan & Saran
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(data.statusKelayakan) + '20',
                },
              ]}
            >
              <Text
                style={{
                  color: getStatusColor(data.statusKelayakan),
                  fontWeight: 'bold',
                }}
              >
                STATUS: {data.statusKelayakan || 'BELUM DINILAI'}
              </Text>
            </View>

            <List.Accordion
              title="Temuan Pemeriksaan"
              left={props => <List.Icon {...props} icon="magnify" />}
            >
              <Text style={styles.longText}>
                {data.temuan || 'Tidak ada temuan.'}
              </Text>
            </List.Accordion>

            <List.Accordion
              title="Saran Perbaikan"
              left={props => <List.Icon {...props} icon="lightbulb-outline" />}
            >
              <Text style={styles.longText}>
                {data.saran || 'Tidak ada saran.'}
              </Text>
            </List.Accordion>
          </Card.Content>
        </Card>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  card: { borderRadius: 16, backgroundColor: 'white', paddingBottom: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  companyName: { fontWeight: 'bold', color: '#1e293b' },
  sectionTitle: { fontWeight: 'bold', color: '#2563eb', marginBottom: 10 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: { color: '#64748b', fontSize: 14 },
  value: { fontWeight: '600', color: '#1e293b', fontSize: 14 },
  divider: { marginVertical: 12, height: 1 },
  measureBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  measureItem: { alignItems: 'center' },
  measureLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  measureValue: { fontSize: 22, fontWeight: 'bold' },
  statusBadge: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  longText: {
    padding: 15,
    color: '#475569',
    lineHeight: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
});
