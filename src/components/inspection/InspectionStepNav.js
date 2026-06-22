import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, radius, spacing } from '../../theme';

function StepIcon({ index, total }) {
  if (index === 0) return 'wrench';
  if (index === total - 2) return 'camera';
  if (index === total - 1) return 'clipboard-text';
  return 'format-list-checks';
}

export default function InspectionStepNav({
  tabs,
  activeStep,
  onStepChange,
  incompleteSteps = [],
}) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  if (isTablet) {
    return (
      <Surface style={styles.sidebar} elevation={2}>
        <Text style={styles.sidebarTitle}>DAFTAR PEMERIKSAAN</Text>
        {tabs.map((tab, index) => {
          const isActive = activeStep === index;
          const hasIssue = incompleteSteps.includes(index);
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
              onPress={() => onStepChange(index)}
            >
              <MaterialCommunityIcons
                name={StepIcon(index, tabs.length)}
                size={18}
                color={isActive ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.sidebarLabel,
                  isActive && styles.sidebarLabelActive,
                ]}
                numberOfLines={2}
              >
                {tab.label}
              </Text>
              {hasIssue ? <View style={styles.issueDot} /> : null}
            </TouchableOpacity>
          );
        })}
      </Surface>
    );
  }

  const activeTab = tabs[activeStep];

  return (
    <View style={styles.mobileNav}>
      <Text style={styles.stepCounter}>
        BAGIAN {activeStep + 1} DARI {tabs.length}
      </Text>
      <Text style={styles.activeTitle}>
        {activeTab?.shortLabel || activeTab?.label}
      </Text>

      <View style={styles.dotsRow}>
        {tabs.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeStep === index && styles.dotActive,
              incompleteSteps.includes(index) && styles.dotIssue,
            ]}
          />
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {tabs.map((tab, index) => (
          <Chip
            key={tab.id}
            selected={activeStep === index}
            onPress={() => onStepChange(index)}
            style={styles.chip}
            textStyle={styles.chipText}
            showSelectedOverlay
          >
            {tab.shortLabel || tab.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  sidebarItemActive: {
    backgroundColor: colors.primarySoft,
    borderLeftColor: colors.primary,
  },
  sidebarLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sidebarLabelActive: { color: colors.primary, fontWeight: '700' },
  issueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
  },
  mobileNav: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepCounter: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  activeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
    marginBottom: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  dotIssue: { backgroundColor: '#F59E0B' },
  chipScroll: { gap: 8, paddingBottom: 4 },
  chip: { marginRight: 0 },
  chipText: { fontSize: 12 },
});
