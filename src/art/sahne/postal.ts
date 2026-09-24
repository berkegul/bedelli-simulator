import { C } from '../../theme/palette';
import type { SpriteDef } from '../../ui/PixelSprite';
import type { Piksel } from '../../ui/sahne/doku';

/** Postal parlatma sahnesinin eşyası: boya, fırça, sünger, bez. */
const P: Record<string, string> = {
  '.': '',
  k: C.ink,
  b: '#4A3524', // tahta sap
  B: '#35261A',
  f: '#2A2620', // fırça kılı
  F: '#3E3A32',
  y: '#C9A24A', // sünger
  Y: '#9E7C30',
  w: '#B3A88C', // bez
  W: '#8E846C',
  m: C.brass,
  M: '#9C7A18',
  d: '#1E1C16', // boya
  s: '#1A160E', // gölge
};

const s = (rows: string[]): SpriteDef => ({ palette: P, rows });

/** Kapağı açık boya kutusu: içinde parlak siyah krem. */
export const BOYA_ACIK = s([
  '..kkkkkkkk..',
  '.kMmmmmmmMk.',
  'kmkddddddkmk',
  'kmdddFdddddk',
  'kmkddddddkmk',
  '.kMmmmmmmMk.',
  '..kkkkkkkk..',
  '...ssssss...',
]);

/** Postal fırçası, yan yatmış. */
export const FIRCA = s([
  '..........kkkk',
  '.kkkkkkkkkbbBk',
  'kbbbbbbbbbbbBk',
  'kBBBBBBBBBBBk.',
  '.fFfFfFfFfFk..',
  '.fffffffffff..',
  '..ssssssssss..',
]);

export const SUNGER = s([
  '.kkkkkkk.',
  'kyyyyyyYk',
  'kyYyyyYyk',
  'kyyyyyyYk',
  '.kkkkkkk.',
  '..sssss..',
]);

/** Setin yoksa: yırtık fanila parçası. */
export const BEZ = s([
  '..kkk.kkk...',
  '.kwwwkwwwk..',
  'kwwWwwwWwwk.',
  'kwWwwwwwwWwk',
  '.kwwWwwwwwk.',
  '..kkwwkkkk..',
  '....kk......',
  '..sssssss...',
]);

/**
 * Yere serilmiş gazete: sütunlar, manşet bloğu, fotoğraf karesi, köşesi
 * kıvrık. Hücre cinsinden, (x, y) sol üst.
 */
export function gazete(x: number, y: number, w: number, h: number): Piksel[] {
  const out: Piksel[] = [
    { x: x + 1, y: y + 1, w, h, c: '#000', o: 0.25 },
    { x, y, w, h, c: '#CFC6AC' },
    { x, y, w: 1, h, c: '#B9B096' },
    { x, y: y + h - 1, w, h: 1, c: '#B9B096' },
  ];
  // Manşet
  out.push({ x: x + 2, y: y + 2, w: Math.round(w * 0.6), h: 2, c: '#3A3630' });
  const sutun = Math.max(6, Math.floor((w - 4) / 4));
  for (let c = 0; c < 4; c++) {
    const sx = x + 2 + c * sutun;
    for (let r = y + 6; r < y + h - 2; r += 2) {
      const uz = sutun - 2 - ((r + c) % 3 === 0 ? 2 : 0);
      if (sx + uz < x + w - 1) out.push({ x: sx, y: r, w: uz, h: 1, c: '#8A8272' });
    }
  }
  // Fotoğraf karesi
  out.push({ x: x + w - sutun - 2, y: y + 6, w: sutun - 1, h: 5, c: '#6E6858' });
  // Kıvrık köşe
  out.push(
    { x: x + w - 3, y, w: 3, h: 1, c: '#E0D8C0' },
    { x: x + w - 2, y: y + 1, w: 2, h: 1, c: '#E0D8C0' },
  );
  return out;
}

/** Ranzanın altı: demir ayaklar, yay telleri, sarkan battaniye kenarı. */
export function ranzaAlti(w: number, h: number): Piksel[] {
  const out: Piksel[] = [];
  // Battaniye kenarı ve yatak altı gölgesi
  out.push({ x: 0, y: 0, w, h, c: '#141209', o: 0.55 });
  out.push({ x: 0, y: 0, w, h: 2, c: '#4E5330' }, { x: 0, y: 2, w, h: 1, c: '#3A3F24' });
  for (let x = 0; x < w; x += 4) out.push({ x, y: 3, w: 2, h: 1, c: '#4E5330' });
  // Yay telleri
  for (let x = 2; x < w; x += 3) out.push({ x, y: 4, w: 1, h: 1, c: '#5A5E62', o: 0.6 });
  // Demir ayaklar
  for (const ax of [3, w - 5]) {
    out.push({ x: ax, y: 0, w: 2, h, c: '#5A5E62' }, { x: ax, y: 0, w: 1, h, c: '#7C8189' });
    out.push({ x: ax - 1, y: h - 1, w: 4, h: 1, c: '#3A3D40' });
  }
  return out;
}
