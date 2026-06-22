import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, radius } from '../../theme';

export default function EmptyState({
  icon = 'clipboard-text-outline',
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.btn}
          buttonColor={colors.primary}
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: 80,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  btn: { marginTop: spacing.xl, borderRadius: radius.md },
});
