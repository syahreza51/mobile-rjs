import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { colors, radius, spacing } from '../../theme';

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  onMenu,
  rightElement,
  light = true,
}) {
  return (
    <View style={styles.wrap}>
      <StatusBar
        barStyle={light ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      <View style={styles.inner}>
        {onMenu ? (
          <IconButton
            icon="menu"
            iconColor="#fff"
            size={24}
            onPress={onMenu}
            style={styles.iconBtn}
          />
        ) : onBack ? (
          <IconButton
            icon="arrow-left"
            iconColor="#fff"
            size={24}
            onPress={onBack}
            style={styles.iconBtn}
          />
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightElement || <View style={styles.iconPlaceholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  iconBtn: { margin: 0 },
  iconPlaceholder: { width: 48 },
  titleWrap: { flex: 1, paddingHorizontal: spacing.xs },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});
