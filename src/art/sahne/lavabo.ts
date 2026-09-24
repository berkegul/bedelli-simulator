import { C } from '../../theme/palette';
import type { SpriteDef } from '../../ui/PixelSprite';
import { hash, type Piksel } from '../../ui/sahne/doku';

/** Lavabo sırası: fayans, ayna, floresan, lavabo, musluk, jilet. */

/**
 * Koğuş lavabosunun fayansı: beyaz kare fayans, gri derz, belden aşağısı
 * yeşil fayans şerit. Yer yer çatlak ve kararmış derz.
 */
export function fayans(w: number, h: number, tohum = 7): Piksel[] {
  const out: Piksel[] = [{ x: 0, y: 0, w, h, c: '#BDBAA6' }];
  const f = 5;
  const yesilY = Math.round(h * 0.72);
  out.push({ x: 0, y: yesilY, w, h: h - yesilY, c: '#4F6A4E' });
  for (let y = 0; y < h; y += f)
    out.push({ x: 0, y, w, h: 1, c: y >= yesilY ? '#3A4E3A' : '#8E8B7A' });
  for (let x = 0; x < w; x += f) out.push({ x, y: 0, w: 1, h, c: '#8E8B7A', o: 0.8 });
  for (let i = 0; i < Math.floor((w * h) / 120); i++) {
    const x = Math.floor(hash(i, 1, tohum) * w);
    const y = Math.floor(hash(i, 2, tohum) * yesilY);
    out.push({ x, y, w: 1, h: 1, c: '#D0CDB9' });
  }
  // Çatlak: tek fayansta kırık çizgi
  const cx = Math.floor(w * 0.12);
  for (let k = 0; k < 4; k++) out.push({ x: cx + k, y: 6 + k + (k % 2), w: 1, h: 1, c: '#7A776A' });
  return out;
}

/**
 * Ayna: metal çerçeve, koyu cam, çapraz ışık yansıması, köşelerde buğu.
 * Cam içindeki alan (yüzün durduğu yer) boş bırakılmıyor; yüz sprite'ı
 * saydam kenarlı, arkasında cam görünüyor.
 */
export function ayna(x: number, y: number, w: number, h: number): Piksel[] {
  const out: Piksel[] = [
    { x: x + 1, y: y + 1, w, h, c: '#000', o: 0.3 },
    { x, y, w, h, c: '#6E737A' },
    { x, y, w, h: 1, c: '#9CA1A8' },
    { x, y, w: 1, h, c: '#9CA1A8' },
    { x: x + 2, y: y + 2, w: w - 4, h: h - 4, c: '#3C474B' },
  ];
  // Yansıma şeritleri
  for (let i = 0; i < h - 4; i++) {
    const sx = x + 2 + Math.round((w - 4) * 0.62) + Math.round(i * 0.35);
    if (sx + 3 < x + w - 2) out.push({ x: sx, y: y + 2 + i, w: 3, h: 1, c: '#5A686C', o: 0.7 });
    const sx2 = sx + 5;
    if (sx2 + 1 < x + w - 2) out.push({ x: sx2, y: y + 2 + i, w: 1, h: 1, c: '#5A686C', o: 0.5 });
  }
  // Buğu: alt köşelerde soluk bulut
  for (let j = 0; j < 5; j++) {
    const uz = 7 - j;
    out.push(
      { x: x + 2, y: y + h - 3 - j, w: uz + 2, h: 1, c: '#9AA4A4', o: 0.22 },
      { x: x + w - 4 - uz, y: y + h - 3 - j, w: uz + 2, h: 1, c: '#9AA4A4', o: 0.18 },
    );
  }
  return out;
}

/** Floresan: uç tutucular, beyaz tüp. */
export function floresan(x: number, y: number, w: number): Piksel[] {
  return [
    { x: x - 1, y, w: 2, h: 3, c: '#5E6368' },
    { x: x + w - 1, y, w: 2, h: 3, c: '#5E6368' },
    { x: x + 1, y: y + 1, w: w - 2, h: 1, c: '#F2F4EA' },
    { x: x + 1, y: y + 2, w: w - 2, h: 1, c: '#C9CFC4' },
  ];
}

/** Porselen lavabo kenarı ve musluk. */
export function lavabo(x: number, y: number, w: number, h: number): Piksel[] {
  const mx = x + Math.round(w / 2);
  return [
    { x: x + 1, y: y + 2, w, h, c: '#000', o: 0.3 },
    { x, y: y + 1, w, h: h - 1, c: '#D6D2C2' },
    { x, y: y + 1, w, h: 1, c: '#EEEADA' },
    { x: x + 3, y: y + 3, w: w - 6, h: Math.max(1, h - 5), c: '#A8A494' },
    { x: x + 4, y: y + 4, w: w - 8, h: Math.max(1, h - 7), c: '#8E8A7C' },
    { x: mx - 1, y: y + h - 3, w: 2, h: 1, c: '#3A3A36' },
    // Musluk: gövde, ağız, iki başlık
    { x: mx - 1, y: y - 3, w: 2, h: 4, c: '#9CA1A8' },
    { x: mx - 1, y: y - 3, w: 5, h: 1, c: '#B8BCC2' },
    { x: mx + 3, y: y - 2, w: 1, h: 2, c: '#7C8189' },
    { x: mx - 5, y: y - 2, w: 3, h: 2, c: '#7C8189' },
    { x: mx + 5, y: y - 2, w: 3, h: 2, c: '#7C8189' },
    // Damla
    { x: mx + 3, y: y + 2, w: 1, h: 1, c: '#9FC0D0', o: 0.8 },
  ];
}

/** Jilet, parmağın ucunda: çelik ağız, siyah sap. */
export const JILET: SpriteDef = {
  palette: { '.': '', k: C.ink, g: '#B8C0C8', G: '#7C8189', b: '#2A2A28', B: '#4A4A46' },
  rows: [
    'kkkkkkkkkk',
    'kggggggggk',
    'kGGGGGGGGk',
    'kkkkbbkkkk',
    '....bB....',
    '....bB....',
    '....bB....',
    '....bB....',
    '....kk....',
  ],
};
