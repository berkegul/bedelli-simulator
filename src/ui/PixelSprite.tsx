import React, { useMemo } from 'react';
import Svg, { Rect } from 'react-native-svg';

/**
 * Sprite'lar kaynak kodda okunabilir bir karakter haritası olarak yaşar.
 * Derleyici yatayda ardışık aynı renk pikselleri tek <Rect>'e birleştirir,
 * böylece 16x16'lık bir sprite 256 değil ~40 düğüme iner.
 */
export type SpriteDef = {
  /** Karakter -> renk. Haritada olmayan karakter (ör. '.') saydam bırakılır. */
  palette: Record<string, string>;
  rows: string[];
};

type Band = { x: number; y: number; w: number; fill: string };

const cache = new WeakMap<SpriteDef, { bands: Band[]; w: number; h: number }>();

function compile(def: SpriteDef) {
  const hit = cache.get(def);
  if (hit) return hit;

  const h = def.rows.length;
  const w = def.rows.reduce((m, r) => Math.max(m, r.length), 0);
  const bands: Band[] = [];

  for (let y = 0; y < h; y++) {
    const row = def.rows[y];
    let x = 0;
    while (x < row.length) {
      const fill = def.palette[row[x]];
      if (!fill) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < row.length && def.palette[row[x + run]] === fill) run++;
      bands.push({ x, y, w: run, fill });
      x += run;
    }
  }

  const out = { bands, w, h };
  cache.set(def, out);
  return out;
}

type Props = {
  sprite: SpriteDef;
  /** Bir pixel kaç ekran birimi. Tam sayı verilirse kenarlar keskin kalır. */
  scale?: number;
  /** scale yerine hedef genişlik; en-boy oranı korunur. */
  width?: number;
  opacity?: number;
};

export function PixelSprite({ sprite, scale, width, opacity = 1 }: Props) {
  const { bands, w, h } = useMemo(() => compile(sprite), [sprite]);
  const px = width ? Math.max(1, Math.floor(width / w)) : (scale ?? 4);

  return (
    <Svg width={w * px} height={h * px} viewBox={`0 0 ${w} ${h}`} opacity={opacity}>
      {bands.map((b, i) => (
        <Rect key={i} x={b.x} y={b.y} width={b.w} height={1} fill={b.fill} />
      ))}
    </Svg>
  );
}

/** Sprite'ın karakter birimindeki boyutu — yerleşim hesabı için. */
export function spriteSize(def: SpriteDef) {
  const { w, h } = compile(def);
  return { w, h };
}

/**
 * Derlenmiş bant listesi. Yol sahnesi aynı sprite'ları SVG yerine Skia'ya
 * çiziyor; iki render yolunun aynı veriden beslenmesi için derleyici
 * dışarı açık. Önbellek ortak, ikinci bir derleme olmuyor.
 */
export function spriteBantlari(def: SpriteDef) {
  return compile(def);
}
