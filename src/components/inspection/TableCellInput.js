import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, Checkbox, IconButton, Button } from 'react-native-paper';
import { pickPhoto } from '../../lib/image-picker';

export default function TableCellInput({ type = 'text', value, onChange }) {
  switch (type) {
    case 'checkbox':
    case 'radio':
      return (
        <View style={styles.center}>
          <Checkbox
            status={value ? 'checked' : 'unchecked'}
            onPress={() => onChange(!value)}
          />
        </View>
      );

    case 'number':
      return (
        <TextInput
          mode="flat"
          dense
          keyboardType="numeric"
          value={String(value ?? '')}
          onChangeText={onChange}
          style={styles.cellInput}
          underlineColor="transparent"
        />
      );

    case 'photo':
      return value ? (
        <View style={styles.photoWrap}>
          <Image source={{ uri: value }} style={styles.photoThumb} />
          <View style={styles.photoActions}>
            <IconButton icon="camera" size={16} onPress={() => pickPhoto(onChange)} />
            <IconButton
              icon="close-circle"
              size={20}
              iconColor="#C8102E"
              onPress={() => onChange('')}
            />
          </View>
        </View>
      ) : (
        <Button mode="outlined" compact onPress={() => pickPhoto(onChange)} icon="camera">
          Foto
        </Button>
      );

    default:
      return (
        <TextInput
          mode="flat"
          dense
          multiline
          value={String(value ?? '')}
          onChangeText={onChange}
          style={styles.cellInput}
          underlineColor="transparent"
        />
      );
  }
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  cellInput: { backgroundColor: 'transparent', fontSize: 14, minHeight: 44 },
  photoWrap: { alignItems: 'center', padding: 4 },
  photoActions: { flexDirection: 'row', alignItems: 'center' },
  photoThumb: { width: 80, height: 80, borderRadius: 8 },
});
