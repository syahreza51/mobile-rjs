import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, IconButton, Surface } from 'react-native-paper';
import { pickPhoto } from '../lib/image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, radius, spacing } from '../theme';

export default function DocumentationSection({ attachments, onChange }) {
  const items = attachments || [];

  const updateAttachment = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const addRow = () => onChange([...items, { url: '', caption: '' }]);

  const removeRow = index => {
    onChange(items.filter((_, i) => i !== index));
  };

  const pickImage = index => {
    pickPhoto(uri => updateAttachment(index, 'url', uri));
  };

  return (
    <View>
      <View style={styles.header}>
        <MaterialCommunityIcons name="camera-outline" size={22} color={colors.primary} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Dokumentasi Lapangan</Text>
          <Text style={styles.subtitle}>
            Unggah minimal 2 foto temuan beserta keterangannya.
          </Text>
        </View>
      </View>

      {items.map((item, index) => (
        <Surface key={index} style={styles.card} elevation={1}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>Foto {index + 1}</Text>
            <IconButton
              icon="close"
              size={18}
              onPress={() => removeRow(index)}
              style={styles.removeBtn}
            />
          </View>
          <TouchableOpacity style={styles.photoBox} onPress={() => pickImage(index)}>
            {item.url ? (
              <Image source={{ uri: item.url }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialCommunityIcons
                  name="image-plus"
                  size={32}
                  color={colors.textLight}
                />
                <Text style={styles.photoPlaceholderText}>Ketuk — Kamera / Galeri</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            mode="outlined"
            dense
            label="Keterangan Foto"
            placeholder="Jelaskan kondisi yang terlihat..."
            value={item.caption || ''}
            onChangeText={v => updateAttachment(index, 'caption', v)}
            style={styles.caption}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />
        </Surface>
      ))}

      <Button
        mode="outlined"
        icon="camera-plus"
        onPress={addRow}
        style={styles.addBtn}
        textColor={colors.primary}
      >
        Tambah Dokumentasi Foto
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  card: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardLabel: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  removeBtn: { margin: -8 },
  photoBox: {
    height: 180,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceMuted,
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { alignItems: 'center', gap: spacing.sm },
  photoPlaceholderText: { color: colors.textLight, fontSize: 13 },
  caption: { backgroundColor: colors.surface },
  addBtn: { borderStyle: 'dashed', borderRadius: radius.md },
});
