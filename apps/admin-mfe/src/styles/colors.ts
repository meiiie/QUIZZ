// VMU Official Color Palette - Vietnam Maritime University
export const colors = {
  // Primary colors - VMU Official Blue
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d6ff',
    300: '#a5b8ff',
    400: '#8190ff',
    500: '#003e80', // VMU Primary Blue
    600: '#002d5c',
    700: '#001f3f',
    800: '#001122',
    900: '#000811',
  },
  
  // Secondary colors - VMU Ocean Blue
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#00a0e3', // VMU Secondary Blue
    600: '#0080b3',
    700: '#006080',
    800: '#00404d',
    900: '#002026',
  },
  
  // Accent colors - VMU Gold
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#ffc20e', // VMU Gold
    600: '#e6a500',
    700: '#cc8f00',
    800: '#b37a00',
    900: '#996600',
  },
  
  // VMU Neutral colors
  neutral: {
    50: '#ffffff', // VMU White
    100: '#f5f5f5', // VMU Gray
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#666666', // VMU Text Light
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#333333', // VMU Text
  },
  
  // Status colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  info: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
} as const;

// VMU Semantic color mapping
export const semanticColors = {
  background: {
    primary: colors.neutral[50], // VMU White
    secondary: colors.neutral[100], // VMU Gray
    tertiary: colors.neutral[200],
    elevated: colors.neutral[50], // VMU White
  },
  
  text: {
    primary: colors.neutral[900], // VMU Text
    secondary: colors.neutral[500], // VMU Text Light
    tertiary: colors.neutral[400],
    inverse: colors.neutral[50], // VMU White
  },
  
  border: {
    primary: colors.neutral[200],
    secondary: colors.neutral[300],
    focus: colors.primary[500], // VMU Primary
  },
  
  surface: {
    primary: colors.neutral[50], // VMU White
    secondary: colors.neutral[100], // VMU Gray
    tertiary: colors.neutral[200],
  },
  
  // VMU Specific colors
  vmu: {
    primary: colors.primary[500], // #003e80
    secondary: colors.secondary[500], // #00a0e3
    accent: colors.accent[500], // #ffc20e
    white: colors.neutral[50], // #ffffff
    gray: colors.neutral[100], // #f5f5f5
    text: colors.neutral[900], // #333333
    textLight: colors.neutral[500], // #666666
    shadow: 'rgba(0, 62, 128, 0.1)',
    overlay: 'rgba(0, 62, 128, 0.8)',
  },
} as const;
