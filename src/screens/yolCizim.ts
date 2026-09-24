import { Skia, createPicture } from '@shopify/react-native-skia';
import type { SkCanvas, SkPaint, SkPicture } from '@shopify/react-native-skia';

import { C } from '../theme';
import { sprite } from '../art';
import { COP_KOVASI, LAMBA_DIREGI, OT_TUTAMI, SINIR_TASI, YON_TABELASI } from '../art/sahne/yol';
import type { Zemin } from '../engine/hava';
import type { YolGeometrisi } from '../engine/yuruyus';
import type { Isik } from '../ui/Gokyuzu';
import { ZEMINLER, benek, hash, ufuk as ufukDokusu, type Piksel } from '../ui/sahne/doku';
import { spriteResmi } from '../ui/skia/SkiaSprite';
import type { SpriteDef } from '../ui/PixelSprite';

/**
 * Yol sahnesinin sabit katmanları (D4c). Hepsi bir kez SkPicture'a
 * kaydediliyor; sahne kare kare yalnızca asker, manzara ve havayı
 * yeniden basıyor. Dokular sahne kitinden (ui/sahne/doku): mekan
 * şeritleri ve mini oyunlarla aynı piksel dili.
 */

/** Doku hücresi kaç nokta: sprite'ların yol sahnesindeki pikseliyle aynı iri. */
export const HUCRE = 2;

function boyaKutusu() {
  const onbellek = new Map<string, SkPaint>();
  return (renk: string, opaklik = 1) => {
    const anahtar = `${renk}|${opaklik}`;
    let p = onbellek.get(anahtar);
    if (!p) {
      p = Skia.Paint();
      p.setColor(Skia.Color(renk));
      p.setAlphaf(opaklik);
      p.setAntiAlias(false);
      onbellek.set(anahtar, p);
    }
    return p;
  };
}

function pikselBas(
  canvas: SkCanvas,
  boya: (r: string, o?: number) => SkPaint,
  ps: Piksel[],
  dx: number,
  dy: number,
  u = HUCRE,
) {
  for (const p of ps) {
    canvas.drawRect(
      Skia.XYWHRect(dx + p.x * u, dy + p.y * u, p.w * u, p.h * u),
      boya(p.c, p.o ?? 1),
    );
  }
}

/** İki renk arası: gökyüzü basamak basamak açılıyor (Gokyuzu ile aynı dil). */
function ara(x: string, y: string, oran: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [p(x), p(y)];
  return `#${a
    .map((v, i) =>
      Math.round(v + (b[i] - v) * oran)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

const YILDIZLAR = [
  { x: 12, y: 32 },
  { x: 28, y: 16 },
  { x: 41, y: 46 },
  { x: 57, y: 24 },
  { x: 69, y: 52 },
  { x: 78, y: 19 },
  { x: 88, y: 42 },
  { x: 21, y: 60 },
  { x: 63, y: 11 },
  { x: 92, y: 70 },
  { x: 5, y: 12 },
  { x: 35, y: 28 },
  { x: 48, y: 8 },
  { x: 74, y: 64 },
  { x: 16, y: 44 },
  { x: 96, y: 26 },
];

/** Sekiz basamaklı gökyüzü ve gece yıldızları. */
export function gokCiz(en: number, ufuk: number, isik: Isik): SkPicture {
  return createPicture(
    (canvas) => {
      const boya = boyaKutusu();
      const bant = 8;
      for (let i = 0; i < bant; i++) {
        canvas.drawRect(
          Skia.XYWHRect(0, Math.floor((ufuk / bant) * i), en, Math.ceil(ufuk / bant) + 1),
          boya(ara(isik.ust, isik.alt, i / (bant - 1))),
        );
      }
      if (isik.yildiz) {
        YILDIZLAR.forEach((y, i) => {
          const boy = i % 5 === 0 ? 3 : 2;
          canvas.drawRect(
            Skia.XYWHRect((y.x / 100) * en, (y.y / 100) * ufuk * 0.9, boy, boy),
            boya(C.canvas, i % 3 === 0 ? 0.8 : 0.45),
          );
        });
      }
    },
    Skia.XYWHRect(0, 0, en, ufuk),
  );
}

const BULUT = [
  [
    '......aaaa..........',
    '....aaaaaaaa..aaa...',
    '..aaaaaaaaaaaaaaaaa.',
    '.aaaaaaaaaaaaaaaaaaa',
    'bbbbbbbbbbbbbbbbbbbb',
    '.bbbbbbbbbbbbbbbbbb.',
  ],
  ['.....aaa......', '..aaaaaaaa....', '.aaaaaaaaaaaa.', 'bbbbbbbbbbbbbb', '..bbbbbbbbbb..'],
];

/** Gündüz bulutları: üstü açık, altı gölgeli; renk gökyüzünden. */
export function bulutCiz(en: number, ufuk: number, isik: Isik): SkPicture {
  return createPicture(
    (canvas) => {
      const boya = boyaKutusu();
      const acik = ara(isik.alt, '#D8D0B8', 0.45);
      const golge = ara(isik.alt, isik.ust, 0.25);
      const yerler = [
        { x: 0.05, y: 0.16, u: 3, sekil: 0 },
        { x: 0.5, y: 0.06, u: 2, sekil: 1 },
        { x: 0.74, y: 0.3, u: 3, sekil: 1 },
      ];
      for (const b of yerler) {
        BULUT[b.sekil].forEach((satir, sy) => {
          for (let sx = 0; sx < satir.length; sx++) {
            const ch = satir[sx];
            if (ch === '.') continue;
            canvas.drawRect(
              Skia.XYWHRect(b.x * en + sx * b.u, b.y * ufuk + sy * b.u, b.u, b.u),
              boya(ch === 'a' ? acik : golge, 0.85),
            );
          }
        });
      }
    },
    Skia.XYWHRect(0, 0, en + 60, ufuk),
  );
}

/**
 * Ufuk: uzakta koğuş blokları (gece bir iki penceresi yanık), önünde ağaç
 * siluetleri, kışla duvarı ve tel örgü. Taban çizgisi ufkun kendisi.
 */
export function ufukCiz(en: number, ufuk: number, gece: boolean, tohum: number): SkPicture {
  return createPicture(
    (canvas) => {
      const boya = boyaKutusu();
      const W = Math.ceil(en / HUCRE);
      const H = Math.ceil(ufuk / HUCRE);
      const dy = ufuk - H * HUCRE;

      // Koğuş blokları: düz çatılı, sıra pencereli
      const blok = gece ? '#22211B' : '#5A5646';
      const blokUst = gece ? '#1C1B16' : '#4C493B';
      const pencere = gece ? '#E8C868' : '#3E4A54';
      const bloklar = [
        { x: Math.floor(W * 0.08), w: 22, h: 12 },
        { x: Math.floor(W * 0.58), w: 30, h: 15 },
      ];
      const ps: Piksel[] = [];
      for (const b of bloklar) {
        const taban = H - 5;
        ps.push({ x: b.x, y: taban - b.h, w: b.w, h: b.h, c: blok, o: gece ? 1 : 0.85 });
        ps.push({ x: b.x - 1, y: taban - b.h - 1, w: b.w + 2, h: 1, c: blokUst });
        for (let py = taban - b.h + 2; py < taban - 2; py += 4) {
          for (let px = b.x + 2; px < b.x + b.w - 2; px += 4) {
            const yanik = !gece || hash(px, py, tohum) < 0.18;
            if (yanik) ps.push({ x: px, y: py, w: 2, h: 2, c: pencere, o: gece ? 0.9 : 0.6 });
          }
        }
      }
      pikselBas(canvas, boya, ps, 0, dy);
      pikselBas(canvas, boya, ufukDokusu({ x: 0, y: 0, w: W, h: H }, tohum, gece), 0, dy);
    },
    Skia.XYWHRect(0, 0, en, ufuk),
  );
}

/** Güzergâhın zemini: avlu betonu, eğitim sahası toprağı ya da çakıl. */
function zeminDokusu(
  zemin: Zemin,
  a: { x: number; y: number; w: number; h: number },
  tohum: number,
) {
  if (zemin === 'beton') return ZEMINLER.beton(a, tohum);
  if (zemin === 'toprak') return ZEMINLER.toprak(a, tohum);
  return [
    ...ZEMINLER.toprak(a, tohum),
    ...benek(
      a,
      [
        { c: '#8C8674', oran: 0.1 },
        { c: '#6E6A5C', oran: 0.06 },
      ],
      tohum + 7,
    ),
  ];
}

/**
 * Zemin: dokulu, ufka doğru havaya karışıyor (uzak soluk), kameraya yakın
 * kısım koyu. Betonda perspektif derzleri de var: ufka doğru sıklaşıyor.
 */
export function zeminCiz(
  en: number,
  yuk: number,
  ufuk: number,
  zemin: Zemin,
  pus: string,
  tohum: number,
): SkPicture {
  return createPicture(
    (canvas) => {
      const boya = boyaKutusu();
      const h = yuk - ufuk;
      const W = Math.ceil(en / HUCRE);
      const Hh = Math.ceil(h / HUCRE);
      pikselBas(canvas, boya, zeminDokusu(zemin, { x: 0, y: 0, w: W, h: Hh }, tohum), 0, ufuk);

      if (zemin === 'beton') {
        for (let i = 1; i <= 7; i++) {
          const y = ufuk + h * Math.pow(i / 7, 1.9);
          canvas.drawRect(Skia.XYWHRect(0, Math.round(y), en, 1), boya(C.ink, 0.28));
        }
      }
      // Atmosfer: uzak zemin gökyüzünün alt rengine karışıyor.
      const pusBant = [0.42, 0.3, 0.2, 0.12, 0.06];
      pusBant.forEach((o, i) => {
        canvas.drawRect(
          Skia.XYWHRect(0, ufuk + i * Math.ceil(h * 0.05), en, Math.ceil(h * 0.05)),
          boya(pus, o),
        );
      });
      // Kameranın dibi hafif karanlık: göz yola çekilsin.
      canvas.drawRect(
        Skia.XYWHRect(0, yuk - Math.ceil(h * 0.12), en, Math.ceil(h * 0.12)),
        boya('#000', 0.14),
      );
      canvas.drawRect(Skia.XYWHRect(0, ufuk, en, 1), boya(C.line, 0.7));
    },
    Skia.XYWHRect(0, 0, en, yuk),
  );
}

/** Yolun kendi malzemesi; yol şeridiyle kırpılıp basılıyor. */
export function yolDokusuCiz(en: number, yuk: number, ufuk: number, zemin: Zemin, tohum: number) {
  return createPicture(
    (canvas) => {
      const boya = boyaKutusu();
      const W = Math.ceil(en / HUCRE);
      const H = Math.ceil((yuk - ufuk) / HUCRE);
      const a = { x: 0, y: 0, w: W, h: H };
      let ps: Piksel[];
      if (zemin === 'beton') {
        // Asfalt yol: koyu, ince benek
        ps = ZEMINLER.asfalt(a, tohum + 5);
      } else if (zemin === 'toprak') {
        // Sıkışmış patika: çevresinden açık, tekerlek izli
        ps = [
          { x: 0, y: 0, w: W, h: H, c: '#76644A' },
          ...benek(
            a,
            [
              { c: '#6A5940', oran: 0.1 },
              { c: '#86745A', oran: 0.07 },
            ],
            tohum + 5,
          ),
        ];
      } else {
        ps = [
          { x: 0, y: 0, w: W, h: H, c: '#6E6A5C' },
          ...benek(
            a,
            [
              { c: '#8C8674', oran: 0.16 },
              { c: '#55524A', oran: 0.12 },
              { c: '#A8A290', oran: 0.03 },
            ],
            tohum + 5,
          ),
        ];
      }
      pikselBas(canvas, boya, ps, 0, ufuk);
    },
    Skia.XYWHRect(0, 0, en, yuk),
  );
}

/** Kenar rengi: betonda kaldırım taşı, toprakta ot kenarı, çakılda taş. */
export const YOL_KENARI: Record<Zemin, { renk: string; kalinlik: number }> = {
  beton: { renk: '#8C8674', kalinlik: 4 },
  toprak: { renk: '#4F5A2A', kalinlik: 5 },
  cakil: { renk: '#6E6A5C', kalinlik: 3 },
};

type Esya = { def: SpriteDef; olcek: number };

/**
 * Yol kenarı: lamba direği, çöp kovası, sınır taşı, tabela, bayrak, ot.
 * Yolun iki yanına dönüşümlü diziliyor, perspektif ölçeğiyle; uzaktakiler
 * önce çiziliyor. Sabit: kamera yolun kendisini çekiyor, asker yürüyor.
 */
export function kenarEsyalariCiz(geo: YolGeometrisi, zemin: Zemin, tohum: number): SkPicture {
  const { en, yuk, ufuk, ox, oy, oolcek, oen } = geo;
  const n = ox.length;
  const buyukler: Esya[] =
    zemin === 'beton'
      ? [
          { def: LAMBA_DIREGI, olcek: 1 },
          { def: COP_KOVASI, olcek: 1 },
          { def: sprite('bayrak'), olcek: 0.8 },
          { def: YON_TABELASI, olcek: 1 },
          { def: SINIR_TASI, olcek: 1 },
        ]
      : [
          { def: YON_TABELASI, olcek: 1 },
          { def: SINIR_TASI, olcek: 1 },
          { def: COP_KOVASI, olcek: 1 },
          { def: SINIR_TASI, olcek: 1 },
        ];

  type Yer = { x: number; y: number; s: number; def: SpriteDef };
  const yerler: Yer[] = [];
  const dik = (i: number) => {
    const a = Math.max(0, i - 1);
    const b = Math.min(n - 1, i + 1);
    const dx = ox[b] - ox[a];
    const dy = oy[b] - oy[a];
    const boy = Math.hypot(dx, dy) || 1;
    return { px: -dy / boy, py: dx / boy };
  };
  const koy = (i: number, yan: number, def: SpriteDef, carpan: number, pay: number) => {
    const { px, py } = dik(i);
    const s = Math.max(0.35, oolcek[i]);
    const d = oen[i] + pay * s;
    const x = ox[i] + px * d * yan;
    const y = oy[i] + py * d * yan;
    if (y < ufuk + 3 || y > yuk - 1 || x < -10 || x > en + 10) return;
    yerler.push({ x, y, s: s * 2 * carpan, def });
  };

  // Büyük eşyalar seyrek, iki yana dönüşümlü
  let k = 0;
  for (let i = Math.floor(n * 0.1); i < n * 0.9; i += Math.max(3, Math.floor(n / 7))) {
    const e = buyukler[k % buyukler.length];
    koy(i, k % 2 ? 1 : -1, e.def, e.olcek, 10);
    k++;
  }
  // Ot tutamları sık ve rastgele
  for (let i = 1; i < n - 1; i += 2) {
    if (hash(i, 3, tohum) < 0.55)
      koy(i, hash(i, 4, tohum) < 0.5 ? 1 : -1, OT_TUTAMI, 0.8, 4 + hash(i, 5, tohum) * 10);
  }
  yerler.sort((a, b) => a.y - b.y);

  return createPicture(
    (canvas) => {
      const boya = boyaKutusu();
      for (const y of yerler) {
        const r = spriteResmi(y.def);
        // Gölge: ayağın dibinde iki sıra
        canvas.drawRect(
          Skia.XYWHRect(y.x - (r.w * y.s) / 2.6, y.y - y.s * 0.6, (r.w * y.s) / 1.3, y.s * 1.2),
          boya('#000', 0.22),
        );
        canvas.save();
        canvas.translate(Math.round(y.x), Math.round(y.y));
        canvas.scale(y.s, y.s);
        canvas.drawPicture(r.resim);
        canvas.restore();
      }
    },
    Skia.XYWHRect(0, 0, en, yuk),
  );
}
