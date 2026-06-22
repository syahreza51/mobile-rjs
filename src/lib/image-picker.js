import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const PICKER_OPTIONS = {
  mediaType: 'photo',
  includeBase64: true,
  quality: 0.7,
  maxWidth: 1600,
  maxHeight: 1600,
};

function assetToUri(asset) {
  if (!asset) return null;
  if (asset.base64) {
    return `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`;
  }
  return asset.uri || null;
}

function runPicker(launcher, onPicked) {
  launcher(PICKER_OPTIONS, res => {
    if (res.didCancel || res.errorCode) return;
    const uri = assetToUri(res.assets?.[0]);
    if (uri) onPicked(uri);
  });
}

/** Tampilkan pilihan Kamera atau Galeri — default lapangan pakai kamera */
export function pickPhoto(onPicked, { preferCamera = true } = {}) {
  const openCamera = () => runPicker(launchCamera, onPicked);
  const openGallery = () => runPicker(launchImageLibrary, onPicked);

  if (preferCamera) {
    Alert.alert('Ambil Foto', 'Pilih sumber foto dokumentasi', [
      { text: 'Kamera', onPress: openCamera },
      { text: 'Galeri', onPress: openGallery },
      { text: 'Batal', style: 'cancel' },
    ]);
    return;
  }

  openGallery();
}

export function pickPhotoFromGallery(onPicked) {
  runPicker(launchImageLibrary, onPicked);
}

export function pickPhotoFromCamera(onPicked) {
  runPicker(launchCamera, onPicked);
}
