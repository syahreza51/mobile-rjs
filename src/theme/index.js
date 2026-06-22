export const colors = {
  primary: '#0055A4',
  primaryDark: '#003D75',
  primaryLight: '#DBEAFE',
  primarySoft: '#EFF6FF',
  accent: '#009639',
  accentLight: '#DCFCE7',
  warning: '#F59E0B',
  warningSoft: '#FFFBEB',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  background: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  online: '#22C55E',
  offline: '#F87171',
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const shadow = {
  card: {
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
};

export const paperTheme = {
  roundness: radius.md,
  colors: {
    primary: colors.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: colors.primarySoft,
    onPrimaryContainer: colors.primaryDark,
    secondary: colors.accent,
    secondaryContainer: colors.accentLight,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceMuted,
    outline: colors.border,
    error: colors.danger,
  },
};
