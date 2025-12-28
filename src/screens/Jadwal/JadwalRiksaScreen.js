import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import {
  Text,
  Card,
  Chip,
  IconButton,
  useTheme,
  Badge,
  Button,
} from 'react-native-paper';

export default function JadwalRiksaScreen({ navigation }) {
  const theme = useTheme();

  // Mock Data Jadwal
  const JADWAL_DATA = [
    {
      id: '1',
      perusahaan: 'PT. Wiguna Lestari Nusa',
      tanggal: '15 Okt 2025',
      lokasi: 'Cirebon',
      jenis: 'Forklift',
      status: 'Ready',
    },
    {
      id: '2',
      perusahaan: 'PT. Indocement Tunggal Prakarsa',
      tanggal: '16 Okt 2025',
      lokasi: 'Bogor',
      jenis: 'Bejana Tekan',
      status: 'Pending',
    },
    {
      id: '3',
      perusahaan: 'PT. Maju Jaya Swastika',
      tanggal: '17 Okt 2025',
      lokasi: 'Jakarta',
      jenis: 'Lift & Escalator',
      status: 'Ready',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Jadwal Riksa Uji
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Agenda Inspeksi Terdekat
        </Text>

        {JADWAL_DATA.map(item => (
          <Card key={item.id} style={styles.scheduleCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge" style={styles.companyName}>
                  {item.perusahaan}
                </Text>
                <Chip
                  mode="flat"
                  style={{
                    backgroundColor:
                      item.status === 'Ready' ? '#dcfce7' : '#fef9c3',
                  }}
                  textStyle={{
                    color: item.status === 'Ready' ? '#166534' : '#854d0e',
                    fontSize: 11,
                  }}
                >
                  {item.status}
                </Chip>
              </View>

              <View style={styles.infoRow}>
                <IconButton icon="calendar" size={20} style={styles.iconInfo} />
                <Text variant="bodyMedium">{item.tanggal}</Text>
              </View>

              <View style={styles.infoRow}>
                <IconButton
                  icon="map-marker"
                  size={20}
                  style={styles.iconInfo}
                />
                <Text variant="bodyMedium">{item.lokasi}</Text>
              </View>

              <View style={styles.infoRow}>
                <IconButton icon="crane" size={20} style={styles.iconInfo} />
                <Text variant="bodyMedium">Bidang: {item.jenis}</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained-tonal"
                onPress={() =>
                  navigation.navigate('InputData', { company: item.perusahaan })
                }
              >
                Mulai Riksa
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  content: { padding: 20 },
  sectionTitle: { marginBottom: 15, color: '#64748b', fontWeight: 'bold' },
  scheduleCard: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  companyName: { flex: 1, fontWeight: 'bold', color: '#1e293b' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: -10 },
  iconInfo: { marginLeft: -10 },
});
