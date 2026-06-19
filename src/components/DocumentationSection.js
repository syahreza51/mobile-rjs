import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';

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
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true, quality: 0.7 },
      res => {
        if (res.didCancel || res.errorCode) return;
        const asset = res.assets?.[0];
        if (!asset) return;
        const uri = asset.base64
          ? `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;
        updateAttachment(index, 'url', uri);
      },
    );
  };

  return (
    <View>
      <Text style={styles.title}>Dokumentasi Lapangan</Text>
      <Text style={styles.subtitle}>
        Unggah minimal 2 foto temuan beserta keterangannya.
      </Text>

      {items.map((item, index) => (
        <View key={index} style={styles.card}>
          <IconButton
            icon="close"
            size={18}
            onPress={() => removeRow(index)}
            style={styles.removeBtn}
          />
          <TouchableOpacity style={styles.photoBox} onPress={() => pickImage(index)}>
            {item.url ? (
              <Image source={{ uri: item.url }} style={styles.photo} />
            ) : (
              <Text style={styles.photoPlaceholder}>Ketuk untuk pilih foto</Text>
            )}
          </TouchableOpacity>
          <TextInput
            mode="outlined"
            dense
            label="Keterangan Foto"
            value={item.caption || ''}
            onChangeText={v => updateAttachment(index, 'caption', v)}
            style={styles.caption}
          />
        </View>
      ))}

      <Button mode="outlined" icon="camera-plus" onPress={addRow} style={styles.addBtn}>
        Tambah Dokumentasi Foto
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '800', color: '#0055A4', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  card: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  removeBtn: { alignSelf: 'flex-end', margin: -8 },
  photoBox: {
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { color: '#94A3B8', fontSize: 13 },
  caption: { backgroundColor: '#fff' },
  addBtn: { borderStyle: 'dashed' },
});
