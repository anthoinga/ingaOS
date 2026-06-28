export const COLORS = {
  background: '#f2f2f2',
  tileBg: '#e8e8e8',
  text: '#3d3d3d',
  textMuted: '#adacb1',
  white: '#ffffff',
  spotifyGreen: '#3FC56E',
  black: '#000000',
} as const;

export const SPACING = {
  containerPadding: 8,
  tilePaddingX: 40,
  tilePaddingY: 24,
  tileGap: 8,
  tileRadius: 12,
  spacerHeight: 19,
  headerHeight: 36,
  footerHeight: 60,
  pillRadius: 20,
  pillPaddingX: 8,
  pillPaddingY: 10,
} as const;

export const TILE_SIZES = {
  large: {
    height: 484,
    minHeight: 480,
  },
  small: {
    height: 343,
    minHeight: 340,
  },
} as const;

export const TYPOGRAPHY = {
  fonts: {
    logo: "'Monofett', sans-serif",
    code: "'Fira Code', monospace",
    mono: "'Fira Mono', monospace",
    body: "'Montserrat', sans-serif",
  },
  sizes: {
    logo: 24,
    heading: 16,
    subheading: 15,
    body: 14,
    small: 10,
  },
} as const;

export const SHADOWS = {
  tile: '0px 4px 8.6px 0px rgba(0,0,0,0.1)',
  text: '0px 0px 2px rgba(0,0,0,0.4)',
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;
