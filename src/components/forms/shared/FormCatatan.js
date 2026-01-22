import React from 'react';
import { View } from 'react-native';
import { Text, TextInput, Divider, RadioButton } from 'react-native-paper';

export const FormCatatan = ({ data, setData, styles }) => {
  return (
    <View style={styles.catatanContainer}>
      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>KESIMPULAN AKHIR:</Text>
        <RadioButton.Group
          onValueChange={value => setData({ ...data, statusKelayakan: value })}
          value={data.statusKelayakan || 'LAYAK'}
        >
          <View style={styles.radioRow}>
            <View
              style={[
                styles.radioItem,
                data.statusKelayakan === 'LAYAK' && styles.radioActiveLayak,
              ]}
            >
              <RadioButton value="LAYAK" color="#16a34a" />
              <Text
                style={
                  data.statusKelayakan === 'LAYAK'
                    ? styles.textActive
                    : styles.textInactive
                }
              >
                LAYAK
              </Text>
            </View>
            <View
              style={[
                styles.radioItem,
                data.statusKelayakan === 'TIDAK LAYAK' &&
                  styles.radioActiveTidak,
              ]}
            >
              <RadioButton value="TIDAK LAYAK" color="#dc2626" />
              <Text
                style={
                  data.statusKelayakan === 'TIDAK LAYAK'
                    ? styles.textActive
                    : styles.textInactive
                }
              >
                TIDAK LAYAK
              </Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>

      <Divider style={{ marginVertical: 15 }} />

      <TextInput
        label="Temuan / Kerusakan"
        multiline
        numberOfLines={4}
        value={data.temuan}
        onChangeText={t => setData({ ...data, temuan: t })}
        mode="outlined"
        style={[styles.input, styles.textArea]}
        outlineStyle={styles.inputOutline}
      />

      <TextInput
        label="Saran / Rekomendasi"
        multiline
        numberOfLines={4}
        value={data.saran}
        onChangeText={t => setData({ ...data, saran: t })}
        mode="outlined"
        style={[styles.input, styles.textArea]}
        outlineStyle={styles.inputOutline}
      />
    </View>
  );
};
