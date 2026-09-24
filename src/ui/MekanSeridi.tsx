import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { PixelSprite } from './PixelSprite';
import { Golge, Nefes, Sahne, type DuvarTuru, type ZeminTuru } from './sahne';
import { PixelText } from './PixelText';

const TABAN_YUKSEKLIK = 150;
const TABAN_ZEMIN = 26;

type Oge = {
  sprite: SpriteKey;
  olcek: number;
  x: number;
  taban?: number;
  /** Arka plandaki öğeler soluk: derinlik hissi buradan geliyor. */
  arka?: boolean;
};
type Mekan = {
  ad: string;
  ic: boolean;
  /** Arkada duran isimsiz kalabalık; koğuş 28 kişilik, üç asker göstermek yalan. */
  kalabalik?: number;
  /** Sağ üstte yazan mevcut — metin "yirmi sekiz kişi" derken göz de görsün. */
  mevcut?: string;
  ogeler: Oge[];
  /** Zemin dokusu; verilmezse iç mekânda karo, dışarıda toprak. */
  zemin?: ZeminTuru;
  /** İç mekân duvarı; verilmezse badana + lambri. */
  duvar?: DuvarTuru;
};

/** Mekâna göre zemin: içtima betonda, eğitim poligonda, yemekhane karoda. */
const ZEMIN_TURU: Record<string, ZeminTuru> = {
  kantin: 'karo',
  ankesor: 'beton',
  carsi: 'asfalt',
  nizamiye: 'asfalt',
  ictima: 'beton',
  'aksam-ictima': 'beton',
  toren: 'beton',
  'egitim-sabah': 'poligon',
  talim: 'toprak',
  mintika: 'toprak',
  serbest: 'toprak',
  veda: 'toprak',
  ziyaret: 'cim',
  camasir: 'beton',
  ders: 'parke',
  evrak: 'parke',
};

/** Canlı sprite'lar: gölge alıyor, nefes alıyor. */
const CANLI = /^(asker|cavus|sivil|oturan)/;

/**
 * Her bloğun geçtiği yerin ince bir kesiti. Oyuncu gün boyunca aynı metin
 * kutusuna bakmak yerine nerede olduğunu görüyor: yemekhane, içtima alanı,
 * koğuş. İç mekanlarda gökyüzü yok, duvar var.
 */
const MEKANLAR: Record<string, Mekan> = {
  // Sevkten önceki sabah, askerî malzemecinin önü (çarşı ekranı).
  carsi: {
    ad: 'Çarşı',
    ic: false,
    kalabalik: 3,
    ogeler: [
      { sprite: 'agac', olcek: 2, x: 6 },
      { sprite: 'kantinBina', olcek: 3, x: 38 },
      { sprite: 'agac', olcek: 2, x: 84 },
    ],
  },
  nizamiye: {
    ad: 'Nizamiye',
    ic: false,
    kalabalik: 8,
    mevcut: 'SEVKİYAT',
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 30 },
      { sprite: 'agac', olcek: 2, x: 8 },
      { sprite: 'bayrak', olcek: 2, x: 78 },
    ],
  },
  kalkis: {
    ad: 'Koğuş',
    ic: true,
    kalabalik: 22,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 2, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 62, taban: TABAN_ZEMIN + 34, arka: true },
      { sprite: 'ranzaDaginik', olcek: 2, x: 0 },
      { sprite: 'ranzaToplu', olcek: 2, x: 26 },
      { sprite: 'asker', olcek: 2, x: 55 },
      { sprite: 'cavus', olcek: 2, x: 84 },
    ],
  },
  kogus: {
    ad: 'Koğuş',
    ic: true,
    kalabalik: 22,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 2, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 62, taban: TABAN_ZEMIN + 34, arka: true },
      { sprite: 'ranzaToplu', olcek: 2, x: 0 },
      { sprite: 'ranzaToplu', olcek: 2, x: 26 },
      { sprite: 'postal', olcek: 2, x: 54 },
      { sprite: 'camasirTorbasi', olcek: 2, x: 68 },
      { sprite: 'asker', olcek: 2, x: 86 },
    ],
  },
  mintika: {
    ad: 'Avlu — mıntıka',
    ic: false,
    kalabalik: 14,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 34, taban: TABAN_ZEMIN + 26, arka: true },
      { sprite: 'agac', olcek: 2, x: 4 },
      { sprite: 'askerSirt', olcek: 2, x: 40 },
      { sprite: 'asker', olcek: 2, x: 62 },
      { sprite: 'postal', olcek: 2, x: 86 },
    ],
  },
  denetim: {
    ad: 'Koğuş — denetim',
    ic: true,
    kalabalik: 22,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 2, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 62, taban: TABAN_ZEMIN + 34, arka: true },
      { sprite: 'ranzaToplu', olcek: 2, x: 0 },
      { sprite: 'ranzaToplu', olcek: 2, x: 26 },
      { sprite: 'asker', olcek: 2, x: 54 },
      { sprite: 'askerEmre', olcek: 2, x: 69 },
      { sprite: 'cavus', olcek: 2, x: 86 },
    ],
  },
  ders: {
    ad: 'Sınıf',
    ic: true,
    kalabalik: 20,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'hedefTahtasi', olcek: 2, x: 4, taban: TABAN_ZEMIN + 26, arka: true },
      { sprite: 'pencere', olcek: 2, x: 78, taban: TABAN_ZEMIN + 34, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 2, x: 2, taban: TABAN_ZEMIN + 2 },
      { sprite: 'yemekhaneMasa', olcek: 2, x: 30, taban: TABAN_ZEMIN + 2 },
      { sprite: 'askerSirt', olcek: 2, x: 8, taban: TABAN_ZEMIN + 12 },
      { sprite: 'askerSirt', olcek: 2, x: 34, taban: TABAN_ZEMIN + 12 },
      { sprite: 'cavus', olcek: 2, x: 58 },
      { sprite: 'defter', olcek: 2, x: 88 },
    ],
  },
  ictima: {
    ad: 'İçtima alanı',
    ic: false,
    kalabalik: 34,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 30, taban: TABAN_ZEMIN + 26, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 22, taban: TABAN_ZEMIN + 22, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 30, taban: TABAN_ZEMIN + 22, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 38, taban: TABAN_ZEMIN + 22, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 46, taban: TABAN_ZEMIN + 22, arka: true },
      { sprite: 'bayrak', olcek: 2, x: 4 },
      { sprite: 'asker', olcek: 2, x: 32 },
      { sprite: 'askerEmre', olcek: 2, x: 48 },
      { sprite: 'askerSerkan', olcek: 2, x: 64 },
      { sprite: 'cavus', olcek: 2, x: 86 },
    ],
  },
  'aksam-ictima': {
    ad: 'İçtima alanı',
    ic: false,
    kalabalik: 34,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'bayrak', olcek: 2, x: 6 },
      { sprite: 'askerTolga', olcek: 2, x: 36 },
      { sprite: 'asker', olcek: 2, x: 52 },
      { sprite: 'cavus', olcek: 2, x: 82 },
    ],
  },
  kahvalti: {
    ad: 'Yemekhane',
    ic: true,
    kalabalik: 26,
    mevcut: 'SIRA VAR',
    ogeler: [
      { sprite: 'tepsiBandi', olcek: 2, x: 46, taban: TABAN_ZEMIN + 32, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 52, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 64, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 76, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'pencere', olcek: 2, x: 8, taban: TABAN_ZEMIN + 40, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 0, taban: TABAN_ZEMIN + 2 },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 36, taban: TABAN_ZEMIN + 2 },
      { sprite: 'asker', olcek: 2, x: 74 },
      { sprite: 'askerEmre', olcek: 2, x: 88 },
    ],
  },
  ogle: {
    ad: 'Yemekhane',
    ic: true,
    kalabalik: 26,
    mevcut: 'SIRA VAR',
    ogeler: [
      { sprite: 'tepsiBandi', olcek: 2, x: 46, taban: TABAN_ZEMIN + 32, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 52, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 64, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 76, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'pencere', olcek: 2, x: 8, taban: TABAN_ZEMIN + 40, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 0, taban: TABAN_ZEMIN + 2 },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 36, taban: TABAN_ZEMIN + 2 },
      { sprite: 'askerTolga', olcek: 2, x: 74 },
      { sprite: 'asker', olcek: 2, x: 88 },
    ],
  },
  'aksam-yemek': {
    ad: 'Yemekhane',
    ic: true,
    kalabalik: 26,
    mevcut: 'SIRA VAR',
    ogeler: [
      { sprite: 'tepsiBandi', olcek: 2, x: 46, taban: TABAN_ZEMIN + 32, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 52, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 64, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 76, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'pencere', olcek: 2, x: 8, taban: TABAN_ZEMIN + 40, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 0, taban: TABAN_ZEMIN + 2 },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 36, taban: TABAN_ZEMIN + 2 },
      { sprite: 'askerSerkan', olcek: 2, x: 74 },
      { sprite: 'asker', olcek: 2, x: 88 },
    ],
  },
  'egitim-sabah': {
    ad: 'Eğitim sahası',
    ic: false,
    kalabalik: 20,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'agac', olcek: 2, x: 20, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'agac', olcek: 2, x: 60, taban: TABAN_ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 34, taban: TABAN_ZEMIN + 22, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 42, taban: TABAN_ZEMIN + 22, arka: true },
      { sprite: 'engel', olcek: 2, x: 2, taban: TABAN_ZEMIN + 2 },
      { sprite: 'hedefTahtasi', olcek: 2, x: 42 },
      { sprite: 'asker', olcek: 2, x: 72 },
      { sprite: 'cavus', olcek: 2, x: 88 },
    ],
  },
  talim: {
    ad: 'Talim alanı',
    ic: false,
    kalabalik: 16,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'hedefTahtasi', olcek: 2, x: 6 },
      { sprite: 'tufek', olcek: 2, x: 36, taban: TABAN_ZEMIN + 8 },
      { sprite: 'asker', olcek: 2, x: 72 },
      { sprite: 'cavus', olcek: 2, x: 88 },
    ],
  },
  serbest: {
    ad: 'Avlu',
    ic: false,
    kalabalik: 10,
    ogeler: [
      { sprite: 'kantinBina', olcek: 2, x: 4 },
      { sprite: 'agac', olcek: 2, x: 48 },
      { sprite: 'ankesor', olcek: 1, x: 70 },
      { sprite: 'askerEmre', olcek: 2, x: 84 },
    ],
  },
  // Kantin içi: tezgâh, arkada raflar, sırada bekleyenler.
  kantin: {
    ad: 'Kantin',
    ic: true,
    kalabalik: 8,
    mevcut: 'SIRA',
    duvar: 'tugla',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 4, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 70, taban: TABAN_ZEMIN + 34, arka: true },
      { sprite: 'sigara', olcek: 2, x: 12, taban: TABAN_ZEMIN + 40 },
      { sprite: 'atistirmalik', olcek: 2, x: 22, taban: TABAN_ZEMIN + 40 },
      { sprite: 'enerjiIcecegi', olcek: 2, x: 32, taban: TABAN_ZEMIN + 40 },
      { sprite: 'kontor', olcek: 2, x: 42, taban: TABAN_ZEMIN + 40 },
      { sprite: 'sivil', olcek: 2, x: 26, taban: TABAN_ZEMIN + 12 },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 14, taban: TABAN_ZEMIN - 2 },
      { sprite: 'asker', olcek: 2, x: 62 },
      { sprite: 'askerSerkan', olcek: 2, x: 80 },
    ],
  },
  // Ankesör başı: akşam kuyruğu, kulübe, kontör kartı.
  ankesor: {
    ad: 'Ankesör',
    ic: false,
    kalabalik: 6,
    mevcut: 'KUYRUK',
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 50, taban: TABAN_ZEMIN + 26, arka: true },
      { sprite: 'agac', olcek: 2, x: 4 },
      { sprite: 'ankesor', olcek: 3, x: 24 },
      { sprite: 'asker', olcek: 2, x: 42 },
      { sprite: 'askerTolga', olcek: 2, x: 58 },
      { sprite: 'askerEmre', olcek: 2, x: 72 },
      { sprite: 'askerSirt', olcek: 2, x: 88 },
    ],
  },
  // 7. gün pazar düzeni: çamaşır yıkanıp ipe asılıyor.
  camasir: {
    ad: 'Çamaşırhane önü',
    ic: false,
    kalabalik: 8,
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 44, taban: TABAN_ZEMIN + 26, arka: true },
      { sprite: 'camasirTorbasi', olcek: 2, x: 8 },
      { sprite: 'sabun', olcek: 2, x: 24 },
      { sprite: 'askerTolga', olcek: 2, x: 40 },
      { sprite: 'corap', olcek: 2, x: 62 },
      { sprite: 'agac', olcek: 2, x: 80 },
    ],
  },
  // 26. gün yemin: bölük sırada, aileler arkada tribünde.
  toren: {
    ad: 'Tören alanı',
    ic: false,
    kalabalik: 40,
    mevcut: 'BÖLÜK + AİLELER',
    ogeler: [
      { sprite: 'sivil', olcek: 1, x: 18, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'sivil', olcek: 1, x: 26, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'sivil', olcek: 1, x: 60, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'sivil', olcek: 1, x: 70, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'bayrak', olcek: 3, x: 4 },
      { sprite: 'askerSirt', olcek: 2, x: 28 },
      { sprite: 'askerSirt', olcek: 2, x: 42 },
      { sprite: 'askerSirt', olcek: 2, x: 56 },
      { sprite: 'cavus', olcek: 2, x: 84 },
    ],
  },
  // Törenden sonra ailelerle görüşme: avlunun ağaç altı.
  ziyaret: {
    ad: 'Ziyaret alanı',
    ic: false,
    kalabalik: 16,
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 56, taban: TABAN_ZEMIN + 26, arka: true },
      { sprite: 'agac', olcek: 2, x: 4 },
      { sprite: 'bank', olcek: 2, x: 20 },
      { sprite: 'sivil', olcek: 2, x: 44 },
      { sprite: 'asker', olcek: 2, x: 58 },
      { sprite: 'askerTolga', olcek: 2, x: 84 },
    ],
  },
  // 28. gün: bölük yazıcısının odası, terhis evrakı.
  evrak: {
    ad: 'Bölük yazıcısı',
    ic: true,
    kalabalik: 6,
    mevcut: 'KUYRUK',
    ogeler: [
      { sprite: 'pencere', olcek: 2, x: 70, taban: TABAN_ZEMIN + 34, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 2, x: 30, taban: TABAN_ZEMIN + 2 },
      { sprite: 'defter', olcek: 2, x: 38, taban: TABAN_ZEMIN + 22 },
      { sprite: 'kunye', olcek: 2, x: 52, taban: TABAN_ZEMIN + 22 },
      { sprite: 'asker', olcek: 2, x: 4 },
      { sprite: 'cavus', olcek: 2, x: 84 },
    ],
  },
  // 28. gün: avluda vedalaşma, üçü bir arada.
  veda: {
    ad: 'Avlu',
    ic: false,
    kalabalik: 10,
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 30, taban: TABAN_ZEMIN + 26, arka: true },
      { sprite: 'agac', olcek: 2, x: 4 },
      { sprite: 'askerEmre', olcek: 2, x: 34 },
      { sprite: 'asker', olcek: 2, x: 50 },
      { sprite: 'askerTolga', olcek: 2, x: 64 },
      { sprite: 'askerSerkan', olcek: 2, x: 80 },
    ],
  },
  'son-yoklama': {
    ad: 'Koğuş',
    ic: true,
    kalabalik: 22,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 2, taban: TABAN_ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 62, taban: TABAN_ZEMIN + 34, arka: true },
      { sprite: 'ranzaToplu', olcek: 2, x: 0 },
      { sprite: 'ranzaToplu', olcek: 2, x: 26 },
      { sprite: 'askerTolga', olcek: 2, x: 54 },
      { sprite: 'asker', olcek: 2, x: 69 },
      { sprite: 'cavus', olcek: 2, x: 86 },
    ],
  },
};

export function mekanBul(blokId: string): Mekan | undefined {
  const anahtar = blokId.replace(/^d\d+-/, '');
  const mekan = MEKANLAR[anahtar];
  // Aynı kapı son gün ters yönde: sevkiyat değil terhis, kalabalık aileler.
  if (mekan && anahtar === 'nizamiye' && blokId.startsWith('d28-'))
    return { ...mekan, mevcut: 'TERHİS', kalabalik: 14 };
  return mekan;
}

/** Kalabalık her karede aynı yerde dursun diye sabit, tohumlu dağınıklık. */
const dagitim = (i: number) => {
  const n = Math.sin(i * 12.9898) * 43758.5453;
  return n - Math.floor(n);
};

const KALABALIK_YUKSEKLIK = 46;

/**
 * Arkadaki isimsiz kalabalık. Tek tek sprite basmak yerine tek SVG'de
 * siluet: yirmi sekiz kişilik koğuşta üç asker görünmesin diye var, ama
 * öndeki adı olan askerlerle yarışmasın diye soluk ve detaysız.
 */
function Kalabalik({ adet, en, ic, k }: { adet: number; en: number; ic: boolean; k: number }) {
  if (!en || adet <= 0) return null;

  const arkaAdet = Math.ceil(adet * 0.55);
  const satirlar = [
    { adet: arkaAdet, u: 2 * k, taban: (KALABALIK_YUKSEKLIK - 24) * k, opaklik: ic ? 0.4 : 0.35 },
    {
      adet: adet - arkaAdet,
      u: 2 * k,
      taban: (KALABALIK_YUKSEKLIK - 12) * k,
      opaklik: ic ? 0.62 : 0.55,
    },
  ];

  return (
    <Svg width={en} height={KALABALIK_YUKSEKLIK * k}>
      {satirlar.map((satir, si) =>
        Array.from({ length: satir.adet }, (_, i) => {
          const u = satir.u;
          const bosluk = (en - 2 * u) / Math.max(1, satir.adet);
          const kayma = dagitim(si * 97 + i) * bosluk * 0.6;
          const x = Math.round(u + i * bosluk + kayma);
          const y = satir.taban - 10 * u;
          const uniforma = si === 0 ? '#4E5330' : '#6E7444';

          return (
            <React.Fragment key={`${si}-${i}`}>
              <Rect
                x={x + u}
                y={y}
                width={2 * u}
                height={2 * u}
                fill="#9A7852"
                opacity={satir.opaklik}
              />
              <Rect
                x={x}
                y={y + 2 * u}
                width={4 * u}
                height={5 * u}
                fill={uniforma}
                opacity={satir.opaklik}
              />
              <Rect
                x={x}
                y={y + 7 * u}
                width={u}
                height={3 * u}
                fill="#4A3524"
                opacity={satir.opaklik}
              />
              <Rect
                x={x + 3 * u}
                y={y + 7 * u}
                width={u}
                height={3 * u}
                fill="#4A3524"
                opacity={satir.opaklik}
              />
            </React.Fragment>
          );
        }),
      )}
    </Svg>
  );
}

type Props = {
  blokId: string;
  saat: string;
  /**
   * Tam sayı büyütme. Oyun ekranında uzun telefonlarda 2: sahne 300 nokta,
   * sprite'lar iki kat. Tam sayı olması pikselleri keskin tutuyor.
   */
  carpan?: number;
  /** Kenardan kenara çizimde çerçeve yok. */
  cercevesiz?: boolean;
  /** Köşedeki mekân adı ve mevcut etiketleri gizli (menü sahnesi). */
  etiketsiz?: boolean;
  /** Sahnenin üstüne serilen içerik (menüde başlık). */
  children?: React.ReactNode;
  /** Ek yükseklik (nokta): gökyüzüne ya da duvara eklenir, zemin aynı kalır. */
  ekYukseklik?: number;
};

/** İç mekân: sabah erken ve gece loş, gündüz pencereden ışık. */
function icLosluk(saat: string) {
  const s = Number(saat.split(':')[0]);
  if (s >= 21 || s < 6) return 0.35;
  if (s < 7 || s >= 19) return 0.18;
  return 0.06;
}

export function MekanSeridi({
  blokId,
  saat,
  carpan = 1,
  cercevesiz,
  etiketsiz,
  children,
  ekYukseklik = 0,
}: Props) {
  const mekan = mekanBul(blokId);
  const anahtar = blokId.replace(/^d\d+-/, '');
  const k = Math.max(1, Math.round(carpan));
  const YUKSEKLIK = TABAN_YUKSEKLIK * k + Math.max(0, Math.round(ekYukseklik / (2 * k)) * 2 * k);
  const ZEMIN = TABAN_ZEMIN * k;
  // Kalabalık piksel hesabıyla diziliyor; genişliği ölçmeden çizilemez.
  const [en, setEn] = useState(0);
  if (!mekan) return null;

  return (
    <View
      onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
      style={{
        height: YUKSEKLIK,
        borderWidth: cercevesiz ? 0 : BORDER,
        borderBottomWidth: BORDER,
        borderColor: C.ink,
        backgroundColor: mekan.ic ? '#2B2719' : '#232016',
        overflow: 'hidden',
      }}
    >
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <Sahne
          yukseklik={YUKSEKLIK}
          u={2 * k}
          zemin={ZEMIN_TURU[anahtar] ?? (mekan.ic ? 'karo' : 'toprak')}
          zeminOrani={(TABAN_ZEMIN * k) / YUKSEKLIK}
          duvar={mekan.ic ? (mekan.duvar ?? 'badana') : undefined}
          saat={saat}
          losluk={mekan.ic ? icLosluk(saat) : 0}
          lambalar={
            mekan.ic
              ? [
                  { x: 28, y: 18, yaricap: 26 },
                  { x: 74, y: 18, yaricap: 26 },
                ]
              : []
          }
          vinyet={false}
          tohum={anahtar.length}
        >
          {/* Kalabalık dekorun önünde, adı olan askerlerin arkasında duruyor */}
          {!!mekan.kalabalik && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: ZEMIN + 2 * k,
                height: KALABALIK_YUKSEKLIK * k,
              }}
            >
              <Kalabalik adet={mekan.kalabalik} en={en} ic={mekan.ic} k={k} />
            </View>
          )}

          {mekan.ogeler.map((o, i) => {
            const tanim = sprite(o.sprite);
            const canli = CANLI.test(o.sprite) && !o.arka;
            const px = o.olcek * k;
            const genislik = tanim.rows[0]?.length ?? 8;
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: `${o.x}%`,
                  bottom: (o.taban ?? TABAN_ZEMIN - 4) * k - (canli ? px : 0),
                  alignItems: 'center',
                }}
              >
                {canli ? (
                  <>
                    <Nefes u={px} gecikme={(i * 230) % 700}>
                      <PixelSprite sprite={tanim} scale={px} />
                    </Nefes>
                    <View style={{ marginTop: -px }}>
                      <Golge genislik={Math.round(genislik * 0.75)} u={px} />
                    </View>
                  </>
                ) : (
                  <PixelSprite sprite={tanim} scale={px} opacity={o.arka ? 0.5 : 1} />
                )}
              </View>
            );
          })}
        </Sahne>
      </View>

      {!etiketsiz && (
        <View
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            backgroundColor: C.ink,
            paddingHorizontal: 5,
            paddingVertical: 1,
          }}
        >
          <PixelText font="command" size="small" color={C.brass}>
            {mekan.ad.toLocaleUpperCase('tr-TR')}
          </PixelText>
        </View>
      )}

      {!etiketsiz && mekan.mevcut && (
        <View
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: C.ink,
            paddingHorizontal: 5,
            paddingVertical: 1,
          }}
        >
          <PixelText font="command" size="small" color={C.canvasDim}>
            {mekan.mevcut}
          </PixelText>
        </View>
      )}
      {children}
    </View>
  );
}
