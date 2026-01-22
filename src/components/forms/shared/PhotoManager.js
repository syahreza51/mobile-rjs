import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, TextInput, Card, IconButton, Text } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const PhotoManager = ({ photos, onPhotosChange, requestPermission }) => {
  const addPhoto = () => {
    const newPhotos = [...(photos || []), { uri: null, note: '' }];
    onPhotosChange(newPhotos);
  };

  const removePhoto = index => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const handleUpdate = (index, field, value) => {
    const newPhotos = [...photos];
    newPhotos[index][field] = value;
    onPhotosChange(newPhotos);
  };

  const pickImage = async (index, type) => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const options = { mediaType: 'photo', quality: 0.7 };
    const result =
      type === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

    if (result.assets && result.assets.length > 0) {
      handleUpdate(index, 'uri', result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {photos?.map((item, index) => (
        <Card key={index} style={styles.card}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.imageBox}
              onPress={() => pickImage(index, 'library')}
            >
              {item.uri ? (
                <Image source={{ uri: item.uri }} style={styles.image} />
              ) : (
                <IconButton icon="image-plus" size={30} />
              )}
            </TouchableOpacity>

            <View style={styles.inputArea}>
              <TextInput
                label={`Keterangan Foto ${index + 1}`}
                value={item.note}
                onChangeText={t => handleUpdate(index, 'note', t)}
                mode="flat"
                dense
                style={styles.textInput}
              />
              <View style={styles.actionRow}>
                <Button
                  icon="camera"
                  onPress={() => pickImage(index, 'camera')}
                >
                  Kamera
                </Button>
                <IconButton
                  icon="delete"
                  iconColor="#dc2626"
                  onPress={() => removePhoto(index)}
                />
              </View>
            </View>
          </View>
        </Card>
      ))}

      <Button
        mode="outlined"
        icon="plus"
        onPress={addPhoto}
        style={styles.addButton}
      >
        Tambah Foto Dokumentasi
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 5 },
  card: { marginBottom: 10, backgroundColor: '#fff', padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  imageBox: {
    width: 80,
    height: 80,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  inputArea: { flex: 1, marginLeft: 10 },
  textInput: { backgroundColor: 'transparent', fontSize: 13 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  addButton: { marginTop: 10, borderStyle: 'dashed' },
});
