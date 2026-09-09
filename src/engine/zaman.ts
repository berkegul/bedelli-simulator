import type { TimeBlock } from './types';

/** '06:30' -> 390. Gece yarısından beri geçen dakika. */
export function dakikaya(saat: string): number {
  const [s, d] = saat.split(':').map(Number);
  return (s || 0) * 60 + (d || 0);
}

/** 390 -> '06:30'. Gün aşımı sarar, geriye gitmez. */
export function saate(dakika: number): string {
  const t = ((Math.round(dakika) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

/** Bloğun süresi; gece yarısını aşan bloklar (23:00 → 00:30) da doğru çıkar. */
export function blokSuresi(blok: TimeBlock): number {
  const bas = dakikaya(blok.from);
  const bit = dakikaya(blok.to);
  return bit >= bas ? bit - bas : bit + 1440 - bas;
}

/**
 * Sahne sayacı saate çevriliyor: blok kendi süresini sahnelerine bölüyor.
 * Böylece "40 dakika bekledin" dendiğinde üstteki saat de kıpırdıyor —
 * eskiden blok aralığı sabit yazıyordu ve zaman hiç akmıyor gibiydi.
 */
export function sahneSaati(blok: TimeBlock, sahneIndex: number): number {
  const bas = dakikaya(blok.from);
  const sure = blokSuresi(blok);
  const adet = Math.max(1, blok.scenes.length);
  // Son sahne bloğun sonunda değil biraz öncesinde bitsin: bitiş saati
  // bir sonraki bloğun başlangıcı, orada olmak henüz erken.
  const adim = sure / (adet + 1);
  return bas + Math.round(adim * sahneIndex);
}

/** Blok bitişine dayanmış saati bir tık geride tutar; taşma okunmuyor. */
export function blokSonu(blok: TimeBlock): number {
  return dakikaya(blok.from) + Math.max(1, blokSuresi(blok) - 1);
}

/** Kalan süre insan diliyle: '35 dk', '1 sa 10 dk'. */
export function kalanSure(dakika: number): string {
  const kalan = Math.max(0, Math.round(dakika));
  if (kalan < 60) return `${kalan} dk`;
  const sa = Math.floor(kalan / 60);
  const dk = kalan % 60;
  return dk ? `${sa} sa ${dk} dk` : `${sa} sa`;
}
