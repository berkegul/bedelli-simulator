/**
 * Sahne dokuları: zemin, duvar, ufuk. Hepsi piksel ızgarasında (bir hücre =
 * sprite'ların bir pikseli) ve tohumlu: aynı sahne her karede, her açılışta
 * aynı çizilir. Çıktı birleştirilmiş dikdörtgen listesi; çizen katman
 * (PikselKatman) bunları tek SVG'de basıyor.
 *
 * Zenginlik çözünürlükten değil katmandan (README · Görsel üretim): düz renk
 * yerine derz, benek, leke, ışık.
 */
export type Piksel = { x: number; y: number; w: number; h: number; c: string; o?: number };
export type Alan = { x: number; y: number; w: number; h: number };

/** 0–1 arası, (x, y, tohum) için sabit sayı. */
export function hash(x: number, y: number, tohum = 0): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + tohum * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Tabana serpiştirilmiş tek hücrelik benekler. Yan yana düşen aynı renkler
 * tek dikdörtgene birleşiyor.
 */
export function benek(
  a: Alan,
  renkler: { c: string; oran: number }[],
  tohum: number,
  boy: { w: number; h: number } = { w: 1, h: 1 },
): Piksel[] {
  const out: Piksel[] = [];
  for (let y = a.y; y < a.y + a.h; y += boy.h) {
    let run: Piksel | null = null;
    for (let x = a.x; x < a.x + a.w; x += boy.w) {
      const r = hash(x, y, tohum);
      let secilen: string | null = null;
      let esik = 0;
      for (const k of renkler) {
        esik += k.oran;
        if (r < esik) {
          secilen = k.c;
          break;
        }
      }
      if (secilen && run && run.c === secilen && run.x + run.w === x) {
        run.w += boy.w;
      } else if (secilen) {
        run = { x, y, w: boy.w, h: boy.h, c: secilen };
        out.push(run);
      } else run = null;
    }
  }
  return out;
}

const dolu = (a: Alan, c: string, o?: number): Piksel => ({ ...a, c, o });

// ─────────────────────────────────────────── zeminler

export type ZeminTuru = 'beton' | 'toprak' | 'cim' | 'karo' | 'parke' | 'asfalt' | 'poligon';

/** Kışla betonu: büyük plakalar, derz, çatlak, yağ lekesi. */
function beton(a: Alan, t: number): Piksel[] {
  const out: Piksel[] = [dolu(a, '#4B4636')];
  out.push(
    ...benek(
      a,
      [
        { c: '#554F3D', oran: 0.05 },
        { c: '#403B2D', oran: 0.05 },
      ],
      t,
    ),
  );
  const plaka = 16;
  for (let y = a.y; y < a.y + a.h; y += 6) out.push({ x: a.x, y, w: a.w, h: 1, c: '#39352A' });
  for (let y = a.y; y < a.y + a.h; y += 6) {
    const kay = ((y - a.y) / 6) % 2 ? plaka / 2 : 0;
    for (let x = a.x + kay; x < a.x + a.w; x += plaka) out.push({ x, y, w: 1, h: 6, c: '#39352A' });
  }
  for (let i = 0; i < Math.floor((a.w * a.h) / 500); i++) {
    const x = a.x + Math.floor(hash(i, 1, t) * (a.w - 4));
    const y = a.y + Math.floor(hash(i, 2, t) * (a.h - 2));
    out.push({ x, y, w: 3, h: 1, c: '#3E3A2C' }, { x: x + 1, y: y + 1, w: 2, h: 1, c: '#3E3A2C' });
  }
  return out;
}

/** Avlu toprağı: sıkışmış kum, çakıl, ayak izi. */
function toprak(a: Alan, t: number): Piksel[] {
  return [
    dolu(a, '#5B4B31'),
    ...benek(
      a,
      [
        { c: '#4C3E27', oran: 0.09 },
        { c: '#6B5A3C', oran: 0.07 },
        { c: '#7C6E56', oran: 0.012 },
      ],
      t,
    ),
  ];
}

/** Çim: ot tutamları dikine iki hücre. */
function cim(a: Alan, t: number): Piksel[] {
  return [
    dolu(a, '#3D4724'),
    ...benek(a, [{ c: '#2F3819', oran: 0.08 }], t),
    ...benek(
      a,
      [
        { c: '#56622F', oran: 0.07 },
        { c: '#6A7438', oran: 0.02 },
      ],
      t + 9,
      { w: 1, h: 2 },
    ),
  ];
}

/** Koğuş ve yemekhane karosu: dama, ara derz, yer yer aşınma. */
function karo(a: Alan, t: number): Piksel[] {
  const out: Piksel[] = [dolu(a, '#4F4A36')];
  const kw = 8;
  const kh = 4;
  for (let y = a.y; y < a.y + a.h; y += kh)
    for (let x = a.x; x < a.x + a.w; x += kw)
      if (((x - a.x) / kw + (y - a.y) / kh) % 2 === 0)
        out.push({
          x,
          y,
          w: Math.min(kw, a.x + a.w - x),
          h: Math.min(kh, a.y + a.h - y),
          c: '#5A553F',
        });
  for (let y = a.y; y < a.y + a.h; y += kh) out.push({ x: a.x, y, w: a.w, h: 1, c: '#3E3A2A' });
  out.push(
    ...benek(
      a,
      [
        { c: '#66604A', oran: 0.02 },
        { c: '#46412F', oran: 0.03 },
      ],
      t,
    ),
  );
  return out;
}

/** Tahta döşeme: uzun tahtalar, kaydırmalı ek yeri, damar. */
function parke(a: Alan, t: number): Piksel[] {
  const out: Piksel[] = [dolu(a, '#5E4428')];
  for (let y = a.y; y < a.y + a.h; y += 3) {
    out.push({ x: a.x, y, w: a.w, h: 1, c: '#4A3520' });
    const kay = Math.floor(hash(y, 3, t) * 20);
    for (let x = a.x + kay; x < a.x + a.w; x += 22) out.push({ x, y, w: 1, h: 3, c: '#4A3520' });
  }
  out.push(...benek(a, [{ c: '#6C5031', oran: 0.06 }], t, { w: 3, h: 1 }));
  return out;
}

/** Yol asfaltı: koyu, ince benek, orta şerit. */
function asfalt(a: Alan, t: number): Piksel[] {
  return [
    dolu(a, '#34322B'),
    ...benek(
      a,
      [
        { c: '#3E3C34', oran: 0.08 },
        { c: '#2B2923', oran: 0.06 },
      ],
      t,
    ),
  ];
}

/** Atış poligonu: kuru toprak, boy boy ot. */
function poligon(a: Alan, t: number): Piksel[] {
  return [...toprak(a, t), ...benek(a, [{ c: '#5E6A30', oran: 0.03 }], t + 4, { w: 1, h: 2 })];
}

export const ZEMINLER: Record<ZeminTuru, (a: Alan, tohum: number) => Piksel[]> = {
  beton,
  toprak,
  cim,
  karo,
  parke,
  asfalt,
  poligon,
};

// ─────────────────────────────────────────── duvarlar

export type DuvarTuru = 'badana' | 'tugla' | 'sac';

/**
 * Kışla içi: üstte kirli badana, altta yağlı boya lambri (yeşil), arada
 * çıta, en altta süpürgelik. Yer yer kabarmış boya ve rutubet lekesi.
 */
function badana(a: Alan, t: number): Piksel[] {
  const lambri = Math.round(a.h * 0.42);
  const ust: Alan = { x: a.x, y: a.y, w: a.w, h: a.h - lambri };
  const alt: Alan = { x: a.x, y: a.y + a.h - lambri, w: a.w, h: lambri };
  const out: Piksel[] = [
    dolu(ust, '#8A826A'),
    ...benek(
      ust,
      [
        { c: '#948C73', oran: 0.05 },
        { c: '#7E765F', oran: 0.05 },
      ],
      t,
    ),
    dolu(alt, '#4C5838'),
    ...benek(
      alt,
      [
        { c: '#56633F', oran: 0.04 },
        { c: '#435030', oran: 0.04 },
      ],
      t + 1,
    ),
    { x: a.x, y: alt.y - 1, w: a.w, h: 1, c: '#3A4429' },
    { x: a.x, y: alt.y, w: a.w, h: 1, c: '#627049' },
    { x: a.x, y: a.y + a.h - 2, w: a.w, h: 2, c: '#2E3521' },
  ];
  // Rutubet lekeleri: lambrinin hemen üstünde soluk halkalar
  for (let i = 0; i < Math.max(1, Math.floor(a.w / 60)); i++) {
    const x = a.x + Math.floor(hash(i, 5, t) * (a.w - 8));
    const y = alt.y - 5 - Math.floor(hash(i, 6, t) * 4);
    out.push({ x, y, w: 6, h: 1, c: '#7A725B' }, { x: x + 1, y: y + 1, w: 5, h: 2, c: '#7F7760' });
  }
  return out;
}

/** Tuğla duvar: kaydırmalı sıralar, harç, tonları değişen tuğlalar. */
function tugla(a: Alan, t: number): Piksel[] {
  const out: Piksel[] = [dolu(a, '#5A4A3A')];
  const bw = 6;
  const bh = 3;
  for (let y = a.y; y < a.y + a.h; y += bh) {
    const kay = ((y - a.y) / bh) % 2 ? bw / 2 : 0;
    for (let x = a.x - kay; x < a.x + a.w; x += bw) {
      const r = hash(x, y, t);
      const c = r < 0.33 ? '#7A4C36' : r < 0.66 ? '#6E4431' : '#834F39';
      const x0 = Math.max(a.x, x);
      const w = Math.min(x + bw - 1, a.x + a.w) - x0;
      if (w > 0) out.push({ x: x0, y, w, h: Math.min(bh - 1, a.y + a.h - y), c });
    }
  }
  return out;
}

/** Oluklu sac (kulübe, depo): dikey oluklar, pas akıntısı. */
function sac(a: Alan, t: number): Piksel[] {
  const out: Piksel[] = [dolu(a, '#5C6252')];
  for (let x = a.x; x < a.x + a.w; x += 3) out.push({ x, y: a.y, w: 1, h: a.h, c: '#4B5043' });
  out.push(...benek(a, [{ c: '#7A5A3A', oran: 0.03 }], t, { w: 1, h: 3 }));
  return out;
}

export const DUVARLAR: Record<DuvarTuru, (a: Alan, tohum: number) => Piksel[]> = {
  badana,
  tugla,
  sac,
};

// ─────────────────────────────────────────── ufuk (dış mekânın arka planı)

/**
 * Uzakta kışla duvarı ve üstünde tel örgü, arkasında ağaç siluetleri.
 * Taban çizgisi `a.y + a.h`; siluetler gökyüzüne taşıyor.
 */
export function ufuk(a: Alan, t: number, gece: boolean): Piksel[] {
  const out: Piksel[] = [];
  const agac = gece ? '#1C2018' : '#39432A';
  const agac2 = gece ? '#171A14' : '#2F3822';
  const duvar = gece ? '#2A2820' : '#6E6751';
  const duvarUst = gece ? '#23211B' : '#5E5845';
  const taban = a.y + a.h;
  // Ağaç siluetleri: yuvarlak tepeler
  for (let x = a.x; x < a.x + a.w; x += 1) {
    const h1 = 6 + Math.floor(4 * Math.sin((x + t * 13) / 5) + 3 * hash(Math.floor(x / 3), 7, t));
    out.push({ x, y: taban - 5 - h1, w: 1, h: h1, c: hash(x, 8, t) < 0.5 ? agac : agac2 });
  }
  // Duvar
  out.push(
    { x: a.x, y: taban - 5, w: a.w, h: 5, c: duvar },
    { x: a.x, y: taban - 5, w: a.w, h: 1, c: duvarUst },
  );
  // Tel örgü: direkler ve iki sıra tel
  for (let x = a.x + 2; x < a.x + a.w; x += 14)
    out.push({ x, y: taban - 10, w: 1, h: 5, c: '#4A4A42' });
  out.push(
    { x: a.x, y: taban - 9, w: a.w, h: 1, c: '#5A5A50', o: 0.7 },
    { x: a.x, y: taban - 7, w: a.w, h: 1, c: '#5A5A50', o: 0.7 },
  );
  return out;
}
