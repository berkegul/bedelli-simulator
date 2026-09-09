/**
 * İki aile, net roller:
 *  - Jersey 10 (sert, kondens bitmap): komutlar, saatler, sayaçlar, başlıklar.
 *    Türkçe glyph'leri tam. Kısa ve yüksek sesli metin için.
 *  - Pixelify Sans: anlatı ve tüm gövde metni. Uzun Türkçe cümlelerde okunur.
 *
 * Not: Silkscreen denendi ve elendi — Ğ ğ İ ı Ş ş glyph'leri yok.
 */
export const FONT = {
  command: 'Jersey10_400Regular',
  body: 'PixelifySans_400Regular',
  bodyMed: 'PixelifySans_500Medium',
  bodySemi: 'PixelifySans_600SemiBold',
  bodyBold: 'PixelifySans_700Bold',
} as const;

/** Pixel fontlar tam sayı boyutlarda keskin kalır; ölçek buna göre. */
export const SIZE = {
  micro: 11,
  small: 13,
  body: 16,
  lead: 19,
  h3: 24,
  h2: 32,
  h1: 44,
  display: 64,
} as const;

/** Jersey 10'un x-height'i düşük — aynı optik boyut için ~1.35x gerekiyor. */
export const COMMAND_SCALE = 1.35;

export const LINE = {
  tight: 1.1,
  snug: 1.25,
  body: 1.55,
  loose: 1.7,
} as const;
