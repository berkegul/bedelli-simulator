import { create } from 'zustand';
import { GUNLER, gunGetir } from '../content';
import { ESYALAR } from '../content/esyalar';
import type { Scene } from '../engine/types';
import { type TelefonDurumu } from '../content/telefon';
import type { Store } from './tipler';
import { ilkDurum } from './ilkDurum';
import { telefonDurumu } from './yardimcilar';
import { akisDilimi } from './dilimler/akis';
import { avluDilimi } from './dilimler/avlu';
import { ekonomiDilimi } from './dilimler/ekonomi';
import { telefonDilimi } from './dilimler/telefon';

export type { AktifGorusme, Ekran, Panel, Sonuc, Store } from './tipler';

/**
 * Oyunun bütün durumu tek store'da, eylemler dilimlere bölünmüş:
 *  akis    → gün, blok, sahne, mini oyun, kayıt yükleme
 *  telefon → rehber, arama, görüşme
 *  ekonomi → panel, alışveriş, eşya, tepsi
 *  avlu    → muhabbet, sigara, izmarit, dinlenme
 * Dilimlerin paylaştığı yardımcılar (uygulaEtki, persist…) yardimcilar.ts'te.
 */
export const useGame = create<Store>((set, get) => ({
  ekran: 'acilis',
  hazir: false,
  kayitVar: false,
  ...ilkDurum,
  ...akisDilimi(set, get),
  ...telefonDilimi(set, get),
  ...ekonomiDilimi(set, get),
  ...avluDilimi(set, get),
}));

/**
 * Panelin koşul değerlendirmesi için durum görüntüsü. Bileşen zaten
 * useGame ile abone olduğu için her render'da güncel okunur.
 */
export function telefonDurumuOku(): TelefonDurumu {
  return telefonDurumu(() => useGame.getState());
}

export function aktifSahne(): Scene | undefined {
  const { gun, blokIndex, sahneIndex } = useGame.getState();
  return gunGetir(gun)?.blocks[blokIndex]?.scenes[sahneIndex];
}

export const TOPLAM_YAZILI_GUN = GUNLER.length;
export const TUM_ESYALAR = ESYALAR;
