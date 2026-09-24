/**
 * Koğuş çizimleri: yatak toplama, giyinme ve yatma hazırlığı için. Genel
 * sprite'lar src/art/sprites.ts'te; buradakiler yalnızca bu üç mini oyunun
 * sahnesi. Palet oyunun paletiyle aynı aile: ranza demiri gri-yeşil, asker
 * battaniyesi haki-gri, çarşaf kirli beyaz.
 */
import type { SpriteDef } from '../../ui/PixelSprite';
import { hash, type Piksel } from '../../ui/sahne/doku';

const DEMIR = '#6B6E62';
const DEMIR_AC = '#8A8D80';
const DEMIR_KOYU = '#3F4238';
const KENAR = '#16150E';
const CARSAF = '#C9C2A8';
const CARSAF_GOLGE = '#A9A28A';
const CARSAF_AC = '#DDD6BD';
const YASTIK = '#D8D1B8';
const YASTIK_GOLGE = '#B2AA91';
const BATTANIYE = '#5E6547';
const BATTANIYE_KOYU = '#4A5037';
const BATTANIYE_AC = '#737A58';
const SERIT = '#8E8F74';

export type YatakDurumu = {
  /** Tamamlanan kat sayısı (0–3). */
  kat: number;
  /** 0 düzgün, 1 darmadağın. Başarısız katlar buruşukluğu artırıyor. */
  burusuk: number;
};

/**
 * Tepeden (3/4) ranza: demir çerçeve, şilte, yastık, battaniye. Uzun kenar
 * yatay, baş solda. Katlar ilerledikçe: 1. katta çarşaf kıvrımı battaniyenin
 * üstüne döner, 2. katta ön kenar şilteye sıkıştırılır (sarkan etek düzelir),
 * 3. katta yastık köşeli. Buruşukluk battaniyede kırışık izi olarak kalır.
 *
 * `x, y` hücre cinsinden sol üst; dönen `onKenarY` göstergenin oturacağı
 * battaniye ön kenarı (hücre).
 */
export function ranzaTepeden(x: number, y: number, w: number, d: YatakDurumu, tohum = 1) {
  const p: Piksel[] = [];
  const h = Math.max(18, Math.round(w * 0.36));
  const on = 5; // ön yüz yüksekliği (3/4 bakış)

  // Yere düşen gölge
  p.push({ x: x + 2, y: y + h + on + 1, w: w, h: 2, c: '#000', o: 0.3 });
  // Ayaklar
  for (const ax of [x + 1, x + w - 3])
    p.push({ x: ax, y: y + h + 2, w: 2, h: on + 1, c: DEMIR_KOYU });

  // Çerçeve: dış kenar, üst ışık
  p.push({ x, y, w, h: h + 2, c: KENAR });
  p.push({ x: x + 1, y: y + 1, w: w - 2, h: h, c: DEMIR });
  p.push({ x: x + 1, y: y + 1, w: w - 2, h: 1, c: DEMIR_AC });
  // Baş ve ayak demiri: iki kalın dikme
  p.push(
    { x: x + 1, y: y - 3, w: 2, h: h + 4, c: DEMIR_KOYU },
    { x: x + 1, y: y - 3, w: 1, h: h + 4, c: DEMIR_AC },
  );
  p.push(
    { x: x + w - 3, y: y - 3, w: 2, h: h + 4, c: DEMIR_KOYU },
    { x: x + w - 2, y: y - 3, w: 1, h: h + 4, c: DEMIR_AC },
  );

  // Şilte + çarşaf
  const ix = x + 3;
  const iw = w - 6;
  const iy = y + 2;
  const ih = h - 2;
  p.push({ x: ix, y: iy, w: iw, h: ih, c: CARSAF });
  p.push({ x: ix, y: iy + ih - 1, w: iw, h: 1, c: CARSAF_GOLGE });

  // Yastık (baş, solda)
  const yw = Math.max(7, Math.round(iw * 0.16));
  const kose = d.kat >= 3;
  p.push({ x: ix + 1, y: iy + 1, w: yw, h: ih - 2, c: YASTIK });
  p.push({ x: ix + 1, y: iy + ih - 2, w: yw, h: 1, c: YASTIK_GOLGE });
  p.push({ x: ix + yw, y: iy + 1, w: 1, h: ih - 2, c: YASTIK_GOLGE });
  if (!kose) {
    // Dağınık yastık: çöküntü ve eğri köşe
    p.push({ x: ix + 3, y: iy + Math.floor(ih / 2) - 1, w: yw - 4, h: 2, c: YASTIK_GOLGE });
    p.push({ x: ix + 1, y: iy + 1, w: 2, h: 1, c: CARSAF });
  } else {
    p.push({ x: ix + 1, y: iy + 1, w: yw, h: 1, c: CARSAF_AC });
  }

  // Battaniye: yastığın bitiminden ayak ucuna
  const bx = ix + yw + 2;
  const bw = ix + iw - bx;
  p.push({ x: bx, y: iy, w: bw, h: ih, c: BATTANIYE });
  p.push({ x: bx, y: iy, w: bw, h: 1, c: BATTANIYE_AC });
  // Battaniyenin iki ucundaki açık şerit (asker battaniyesi)
  p.push(
    { x: bx + bw - 4, y: iy, w: 1, h: ih, c: SERIT },
    { x: bx + bw - 6, y: iy, w: 1, h: ih, c: SERIT },
  );

  // 1. kat: çarşaf battaniyenin üstüne dört parmak kıvrılmış
  if (d.kat >= 1) {
    p.push({ x: bx, y: iy, w: 4, h: ih, c: CARSAF_AC });
    p.push({ x: bx + 4, y: iy, w: 1, h: ih, c: CARSAF_GOLGE });
  } else {
    // Henüz açık: çarşaf yastığın yanında buruşuk bir yığın
    p.push(
      { x: bx, y: iy + 2, w: 5, h: ih - 5, c: CARSAF },
      { x: bx + 1, y: iy + 4, w: 3, h: 1, c: CARSAF_GOLGE },
    );
  }

  // Buruşukluk: uzun kıvrım sırtları (üstü açık, altı koyu) ve kısa
  // kırışıklar. Tohumlu: aynı yatak her karede aynı.
  const sirt = Math.round(d.burusuk * 7);
  for (let i = 0; i < sirt; i++) {
    const kx = bx + 6 + Math.floor(hash(i, 1, tohum) * Math.max(1, bw - 22));
    const ky = iy + 2 + Math.floor(hash(i, 2, tohum) * Math.max(1, ih - 6));
    const boy = 8 + Math.floor(hash(i, 3, tohum) * 8);
    const egim = hash(i, 4, tohum) < 0.5 ? 1 : -1;
    for (let j = 0; j < boy; j++) {
      const yy = ky + Math.round((j * egim) / 4);
      if (yy <= iy || yy >= iy + ih - 1) continue;
      p.push({ x: kx + j, y: yy - 1, w: 1, h: 1, c: BATTANIYE_AC });
      p.push({ x: kx + j, y: yy, w: 1, h: 1, c: BATTANIYE_KOYU });
    }
  }
  const kirisik = Math.round(d.burusuk * 12);
  for (let i = 0; i < kirisik; i++) {
    const kx = bx + 6 + Math.floor(hash(i, 5, tohum) * Math.max(1, bw - 12));
    const ky = iy + 1 + Math.floor(hash(i, 6, tohum) * Math.max(1, ih - 3));
    p.push({ x: kx, y: ky, w: 2, h: 1, c: BATTANIYE_KOYU }, { x: kx + 1, y: ky - 1, w: 2, h: 1, c: BATTANIYE_AC });
  }
  // Çok dağınıksa battaniyenin ayak ucu köşesi kıvrılmış, altından çarşaf görünüyor
  if (d.burusuk > 0.55) {
    const kw = Math.round(bw * 0.22);
    for (let j = 0; j < Math.min(kw, ih - 2); j++) {
      const sx = bx + bw - kw + j;
      p.push({ x: sx, y: iy + ih - 1 - j, w: bx + bw - sx, h: 1, c: CARSAF });
      p.push({ x: sx, y: iy + ih - 1 - j, w: 1, h: 1, c: BATTANIYE_AC });
    }
  }

  // Ön yüz: şiltenin kenarı ve battaniyenin sarkan eteği
  const onY = y + h + 2;
  p.push({ x: x + 3, y: onY - 1, w: w - 6, h: 2, c: CARSAF_GOLGE });
  if (d.kat >= 2) {
    // Sıkıştırılmış: düz, keskin kenar
    p.push({ x: bx, y: onY - 1, w: bw, h: 2, c: BATTANIYE_KOYU });
  } else {
    for (let sx = bx; sx < bx + bw; sx++) {
      const sark = 1 + Math.floor(hash(Math.floor(sx / 3), 9, tohum) * (2 + d.burusuk * 5));
      p.push({
        x: sx,
        y: onY - 1,
        w: 1,
        h: sark + 1,
        c: sx % 5 === 0 ? BATTANIYE : BATTANIYE_KOYU,
      });
    }
  }
  // Ön demir çubuğu
  p.push({ x: x + 1, y: onY + 1, w: w - 2, h: 1, c: DEMIR_KOYU });

  return { pikseller: p, onKenarY: onY - 1, battaniyeX: bx, battaniyeW: bw, yukseklik: h + on + 3 };
}

/** Koğuş penceresi: demir çerçeve, dört cam, dışarıdan soluk ışık. */
export function pencere(x: number, y: number, gece: boolean): Piksel[] {
  const cam = gece ? '#1E2433' : '#9FB0B4';
  const camAc = gece ? '#2A3144' : '#BCCACB';
  const p: Piksel[] = [
    { x: x - 1, y: y - 1, w: 16, h: 14, c: KENAR },
    { x, y, w: 14, h: 12, c: DEMIR },
    { x: x + 1, y: y + 1, w: 5, h: 4, c: cam },
    { x: x + 8, y: y + 1, w: 5, h: 4, c: cam },
    { x: x + 1, y: y + 7, w: 5, h: 4, c: cam },
    { x: x + 8, y: y + 7, w: 5, h: 4, c: cam },
    { x: x + 1, y: y + 1, w: 2, h: 1, c: camAc },
    { x: x + 8, y: y + 1, w: 2, h: 1, c: camAc },
    // Denizlik
    { x: x - 2, y: y + 12, w: 18, h: 1, c: DEMIR_AC },
  ];
  if (gece) p.push({ x: x + 10, y: y + 2, w: 1, h: 1, c: '#E6DCC0' });
  return p;
}

/** Arkadaki komşu ranzanın demiri: iki dikme ve üst yatağın alt tahtası. */
export function komsuRanza(x: number, zeminY: number, boy: number): Piksel[] {
  return [
    { x, y: zeminY - boy, w: 2, h: boy, c: DEMIR_KOYU },
    { x: x + 22, y: zeminY - boy, w: 2, h: boy, c: DEMIR_KOYU },
    { x, y: zeminY - boy + 3, w: 24, h: 2, c: DEMIR_KOYU },
    { x: x + 2, y: zeminY - boy + 5, w: 20, h: 2, c: BATTANIYE_KOYU },
    { x, y: zeminY - Math.round(boy * 0.45), w: 24, h: 2, c: DEMIR_KOYU },
    { x: x + 2, y: zeminY - Math.round(boy * 0.45) - 3, w: 20, h: 3, c: BATTANIYE_KOYU },
  ];
}

const R = {
  '.': '',
  k: KENAR,
  d: DEMIR,
  D: DEMIR_KOYU,
  a: DEMIR_AC,
  c: CARSAF,
  C: CARSAF_GOLGE,
  y: YASTIK,
  b: BATTANIYE,
  B: BATTANIYE_KOYU,
  e: SERIT,
  p: '#2E2419',
  P: '#4A3524',
} as Record<string, string>;

/**
 * Yandan ranza (alt yatak, üstünde ikincinin tahtası): giyinme ve gece
 * sahnelerinde. Altında postal yeri boş; postal ayrı çiziliyor.
 */
export const RANZA_YAN: SpriteDef = {
  palette: R,
  rows: [
    'aD....................................Da',
    'aD....................................Da',
    'aDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDa',
    'aDbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbDa',
    'aDBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBDa',
    'aD....................................Da',
    'aD....................................Da',
    'aD....................................Da',
    'aD....................................Da',
    'aD....................................Da',
    'aD.yyyyyy.............................Da',
    'aDyyyyyyyyccccbbbbbbbbbbbbbbbbbbbebebbDa',
    'aDCCCCCCCCccccbbbbbbbbbbbbbbbbbbbebebbDa',
    'aDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDa',
    'aDBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBDa',
    'aD....................................Da',
    'aD....................................Da',
    'aD....................................Da',
    'aD....................................Da',
    'aD....................................Da',
    'aD....................................Da',
    'aD....................................Da',
    'kDk..................................kDk',
  ],
};
