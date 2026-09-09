/** Her ölçü 4px pixel grid'ine oturur — yarım pixel yok, bulanıklık yok. */
export const SP = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Pixel estetiğinde yuvarlatma yok. Tek istisna yok — sıfır. */
export const RADIUS = 0;

/** Panel kenarlığı kalınlığı; 2px pixel grid'de görünür kalır. */
export const BORDER = 2;

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
