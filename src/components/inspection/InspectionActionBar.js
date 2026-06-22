import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../theme';

export default function InspectionActionBar({
  activeStep,
  totalSteps,
  saving,
  onPrev,
  onNext,
  onSaveDraft,
  onSubmit,
}) {
  const insets = useSafeAreaInsets();
  const isLastStep = activeStep >= totalSteps - 1;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Button
        mode="outlined"
        disabled={activeStep === 0 || saving}
        onPress={onPrev}
        style={styles.btn}
        contentStyle={styles.btnContent}
      >
        Sebelumnya
      </Button>

      <Button
        mode="contained"
        onPress={isLastStep ? onSubmit : onNext}
        loading={saving && isLastStep}
        disabled={saving}
        buttonColor={isLastStep ? colors.accent : colors.primary}
        style={[styles.btn, styles.primaryBtn]}
        contentStyle={styles.btnContent}
        icon={isLastStep ? 'check-circle' : 'arrow-right'}
      >
        {isLastStep ? 'Selesai' : 'Lanjut'}
      </Button>

      <IconButton
        icon="content-save-outline"
        mode="outlined"
        size={22}
        disabled={saving}
        onPress={onSaveDraft}
        style={styles.saveIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  btn: { flex: 1, borderRadius: radius.md },
  primaryBtn: { flex: 1.3 },
  btnContent: { paddingVertical: 4 },
  saveIcon: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    margin: 0,
  },
});
