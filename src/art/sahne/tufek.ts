import { C } from '../../theme/palette';
import { hash, type Piksel } from '../../ui/sahne/doku';

/**
 * Silah sökme masası: yandan G3 (MKE yapımı piyade tüfeği), branda üstünde.
 * Tüfek elle yerleştirilmiş dikdörtgenlerden kuruluyor: gövde, el kundağı,
 * namlu, kabza sabit; sökülen altı parça ayrı çiziliyor ki yerinden
 * kalkıp masaya dizilebilsin. Koordinatlar hücre cinsinden (sprite pikseli).
 */

const K = C.ink;
const M1 = '#2C2F33'; // koyu metal
const M2 = '#474C52';
const M3 = '#6E757C'; // parlak kenar
const O1 = '#3E4530'; // kundak (koyu yeşil polimer)
const O2 = '#535C3C';
const O3 = '#68724A';

type Kutu = { x: number; y: number; w: number; h: number };

/** Koyu hatlı dolu kutu, üst kenarında ışık. */
function kutu(k: Kutu, dolgu: string, isik?: string): Piksel[] {
  const out: Piksel[] = [
    { ...k, c: K },
    { x: k.x + 1, y: k.y + 1, w: Math.max(1, k.w - 2), h: Math.max(1, k.h - 2), c: dolgu },
  ];
  if (isik && k.w > 2 && k.h > 2) out.push({ x: k.x + 1, y: k.y + 1, w: k.w - 2, h: 1, c: isik });
  return out;
}

export type ParcaAdi =
  'Şarjör' | 'Kurma kolu' | 'Mekanizma kapağı' | 'Mekanizma' | 'Geri getirici yay' | 'Dipçik';

export type Parca = {
  ad: ParcaAdi;
  /** Takılıyken sol üst köşesi (tüfek koordinatı). */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Parçanın kendi (0,0) tabanlı pikselleri. */
  piksel: Piksel[];
};

function dipcik(): Parca {
  const w = 25;
  const piksel: Piksel[] = [];
  for (let x = 0; x < w; x++) {
    const h = Math.round(14 - (6 * x) / (w - 1));
    piksel.push({ x, y: 0, w: 1, h, c: K });
    if (x > 0 && x < w - 1) {
      piksel.push({ x, y: 1, w: 1, h: Math.max(1, h - 2), c: x < 3 ? '#1E1E1A' : O2 });
      piksel.push({ x, y: 1, w: 1, h: 1, c: x < 3 ? '#2A2A24' : O3 });
      if (x > 4 && x % 5 === 0) piksel.push({ x, y: h - 4, w: 1, h: 2, c: O1 });
    }
  }
  // Kayış halkası
  piksel.push({ x: 8, y: 11, w: 3, h: 1, c: M3 });
  return { ad: 'Dipçik', x: 0, y: 6, w, h: 14, piksel };
}

function yay(): Parca {
  const w = 9;
  const piksel: Piksel[] = [{ x: 0, y: 0, w, h: 3, c: K }];
  for (let x = 1; x < w - 1; x++) piksel.push({ x, y: 1, w: 1, h: 1, c: x % 2 ? M3 : M1 });
  return { ad: 'Geri getirici yay', x: 20, y: 9, w, h: 3, piksel };
}

function mekanizma(): Parca {
  const w = 18;
  return {
    ad: 'Mekanizma',
    x: 34,
    y: 8,
    w,
    h: 4,
    piksel: [
      ...kutu({ x: 0, y: 0, w, h: 4 }, M2, M3),
      { x: 3, y: 1, w: 4, h: 2, c: M1 },
      { x: 12, y: 1, w: 2, h: 2, c: M3 },
    ],
  };
}

function kapak(): Parca {
  const w = 28;
  const piksel = kutu({ x: 0, y: 0, w, h: 4 }, M1, M2);
  for (let x = 3; x < w - 2; x += 4) piksel.push({ x, y: 2, w: 2, h: 1, c: M2 });
  return { ad: 'Mekanizma kapağı', x: 30, y: 4, w, h: 4, piksel };
}

function kurmaKolu(): Parca {
  return {
    ad: 'Kurma kolu',
    x: 64,
    y: 1,
    w: 4,
    h: 6,
    piksel: [
      ...kutu({ x: 1, y: 0, w: 3, h: 3 }, M3),
      { x: 1, y: 3, w: 2, h: 3, c: K },
      { x: 2, y: 3, w: 1, h: 3, c: M2 },
    ],
  };
}

function sarjor(): Parca {
  const piksel: Piksel[] = [];
  for (let i = 0; i < 14; i++) {
    const kay = Math.round(i * 0.4);
    piksel.push({ x: kay, y: i, w: 9, h: 1, c: K });
    piksel.push({ x: kay + 1, y: i, w: 7, h: 1, c: i % 3 === 1 ? M2 : M1 });
  }
  piksel.push({ x: 5, y: 13, w: 9, h: 1, c: K });
  return { ad: 'Şarjör', x: 44, y: 16, w: 14, h: 14, piksel };
}

/** Sökme sırasındaki sıra değil, çizim sırası: arkadaki önce. */
export const PARCALAR: Parca[] = [yay(), dipcik(), mekanizma(), kapak(), kurmaKolu(), sarjor()];

export const TUFEK_EN = 120;
export const TUFEK_BOY = 31;

/** Sökülmeyen iskelet: gövde, el kundağı, namlu, arpacık, gez, kabza, tetik. */
export function tufekIskeleti(): Piksel[] {
  const out: Piksel[] = [];
  // Gövde; ortada fişek atma yuvası (mekanizma buradan görünür)
  out.push(...kutu({ x: 26, y: 7, w: 37, h: 10 }, M2, M3));
  out.push({ x: 33, y: 8, w: 20, h: 4, c: '#15161A' });
  for (const rx of [28, 56, 60]) out.push({ x: rx, y: 14, w: 1, h: 1, c: M3 });
  // Gez tamburu
  out.push(...kutu({ x: 26, y: 3, w: 4, h: 5 }, M1, M3));
  // El kundağı: havalandırma delikleri
  out.push(...kutu({ x: 62, y: 6, w: 25, h: 10 }, O2, O3));
  for (let x = 65; x < 85; x += 3) out.push({ x, y: 9, w: 1, h: 4, c: O1 });
  // Namlu, arpacık, alev gizleyen
  out.push({ x: 86, y: 9, w: 27, h: 3, c: K }, { x: 86, y: 10, w: 26, h: 1, c: M2 });
  out.push(...kutu({ x: 103, y: 4, w: 4, h: 6 }, M1));
  out.push(...kutu({ x: 112, y: 8, w: 7, h: 5 }, M1, M2));
  for (let x = 114; x < 118; x += 2) out.push({ x, y: 10, w: 1, h: 1, c: '#0E0F12' });
  // Kabza: geriye yatık
  for (let i = 0; i < 11; i++) {
    const x = Math.round(33 - i * 0.45);
    out.push(
      { x, y: 16 + i, w: 7, h: 1, c: K },
      { x: x + 1, y: 16 + i, w: 5, h: 1, c: i % 4 === 2 ? O1 : O2 },
    );
  }
  out.push({ x: 28, y: 27, w: 7, h: 1, c: K });
  // Tetik korkuluğu ve tetik
  out.push({ x: 40, y: 16, w: 1, h: 5, c: K }, { x: 40, y: 20, w: 5, h: 1, c: K });
  out.push({ x: 41, y: 17, w: 1, h: 2, c: M3 });
  return out;
}

/**
 * Masa: tahta döşeme üstünde yağ lekeli yeşil branda, dikiş izi, köşede
 * yağdanlık ve temizlik bezi. (w, h) hücre.
 */
export function silahMasasi(w: number, h: number, tahta: Piksel[]): Piksel[] {
  const out: Piksel[] = [...tahta];
  const b = { x: 2, y: 2, w: w - 4, h: h - 4 };
  out.push({ x: b.x + 1, y: b.y + 1, w: b.w, h: b.h, c: '#000', o: 0.3 });
  out.push({ ...b, c: '#565A3A' });
  for (let i = 0; i < Math.floor((b.w * b.h) / 25); i++) {
    const x = b.x + Math.floor(hash(i, 1, 41) * b.w);
    const y = b.y + Math.floor(hash(i, 2, 41) * b.h);
    out.push({ x, y, w: 1, h: 1, c: hash(i, 3, 41) < 0.5 ? '#4E5234' : '#5E6242' });
  }
  // Dikiş: kenardan bir hücre içeride kesikli
  for (let x = b.x + 1; x < b.x + b.w - 1; x += 3) {
    out.push(
      { x, y: b.y + 1, w: 2, h: 1, c: '#6E7250' },
      { x, y: b.y + b.h - 2, w: 2, h: 1, c: '#6E7250' },
    );
  }
  // Yağ lekeleri
  for (const [lx, ly, r] of [
    [Math.round(w * 0.3), Math.round(h * 0.45), 4],
    [Math.round(w * 0.7), Math.round(h * 0.75), 3],
  ]) {
    for (let j = -r; j <= r; j++) {
      const yari = Math.round(r * 1.6 * Math.sqrt(1 - (j / (r + 1)) ** 2));
      out.push({ x: lx - yari, y: ly + j, w: 2 * yari, h: 1, c: '#2A2A1C', o: 0.35 });
    }
  }
  return out;
}
