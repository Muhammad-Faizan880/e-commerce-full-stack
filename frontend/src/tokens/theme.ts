/**
 * Design Tokens for Copenhagen E-Commerce
 * Palette: Olive Green, Off-White, Black/Charcoal with Scandinavian Minimalism
 */

export const tokens = {
  colors: {
    // Olive Green Primary Tokens
    olive: {
      50: '#f5f6f3',
      100: '#e6ebe0',
      200: '#d0dac6',
      300: '#b0c2a2',
      400: '#8ca37b',
      500: '#6b825a',
      600: '#4e5f41', // Copenhagen Signature Olive
      700: '#3e4c34', // Hover Olive
      800: '#343e2c',
      900: '#2c3526',
      950: '#171c13',
    },
    // Off-White Neutral Tokens
    offwhite: {
      base: '#f7f6f2',
      card: '#f1efe8',
      hover: '#ebe8df',
      surface: '#faf9f5',
      border: '#e3dfd4',
      borderMuted: '#ece8de',
    },
    // Black & Charcoal Typography Tokens
    black: {
      pure: '#000000',
      copen: '#141414',
      charcoal: '#262626',
      muted: '#666666',
      subtle: '#8c8c8c',
    },
    // Accent Sand / Almond
    almond: {
      light: '#f5eee6',
      base: '#dfd3c3',
      dark: '#bda387',
    },
  },
  fonts: {
    serif: 'Cormorant Garamond, Playfair Display, serif',
    sans: 'Inter, system-ui, sans-serif',
  },
  radii: {
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  transitions: {
    default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export type DesignTokens = typeof tokens;

