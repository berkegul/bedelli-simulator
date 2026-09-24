import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

/** Saate göre karanlık: gece koyu lacivert örtü, alacakaranlıkta yarısı. */
export function gecelik(saat: string): number {
  const [s, d] = saat.split(':').map(Number);
  const t = s + (d || 0) / 60;
  if (t >= 21.5 || t < 5) return 0.5;
  if (t < 6) return 0.5 - (t - 5) * 0.35;
  if (t < 7) return 0.15 - (t - 6) * 0.15;
  if (t >= 20) return 0.2 + (t - 20) * 0.2;
  if (t >= 18.5) return (t - 18.5) * 0.13;
  return 0;
}

/** Tam ekran örtü: gece ya da iç mekânın loşluğu. */
export function Ortu({ renk = '#0B1026', opaklik }: { renk?: string; opaklik: number }) {
  if (opaklik <= 0) return null;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: renk,
        opacity: opaklik,
      }}
    />
  );
}

/**
 * Işık havuzu: lamba, fener, pencere. Merkezden dışa basamaklı halkalar;
 * yumuşak geçiş yerine piksel basamak — oyunun diliyle aynı.
 */
export function IsikHavuzu({
  x,
  y,
  yaricap,
  u,
  renk = '#FFE6A0',
  guc = 0.22,
  basik = 0.45,
}: {
  /** Merkez, nokta cinsinden. */
  x: number;
  y: number;
  /** Hücre cinsinden. */
  yaricap: number;
  u: number;
  renk?: string;
  guc?: number;
  /** Dikey basıklık: yere düşen ışık yayvan görünür. */
  basik?: number;
}) {
  const basamak = 4;
  const halkalar = Array.from({ length: basamak }, (_, i) => basamak - i);
  const R = yaricap * u;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x - R,
        top: y - R * basik,
        width: 2 * R,
        height: 2 * R * basik,
      }}
    >
      <Svg width={2 * R} height={2 * R * basik}>
        {halkalar.map((k) => {
          const r = Math.round((yaricap * k) / basamak);
          // Piksel daire: satır satır yarı genişlik
          const satir: React.ReactNode[] = [];
          const ry = Math.max(1, Math.round(r * basik));
          for (let j = -ry; j < ry; j++) {
            const yy = (j + 0.5) / ry;
            const yari = Math.round(r * Math.sqrt(Math.max(0, 1 - yy * yy)));
            if (!yari) continue;
            satir.push(
              <Rect
                key={`${k}-${j}`}
                x={R - yari * u}
                y={R * basik + j * u}
                width={2 * yari * u}
                height={u}
                fill={renk}
                opacity={guc / basamak}
              />,
            );
          }
          return <React.Fragment key={k}>{satir}</React.Fragment>;
        })}
      </Svg>
    </View>
  );
}

/** Kenarları basamaklı karartma: göz ortaya çekilsin. */
export function Vinyet({
  u,
  kalinlik = 3,
  guc = 0.18,
}: {
  u: number;
  kalinlik?: number;
  guc?: number;
}) {
  const bantlar = Array.from({ length: kalinlik }, (_, i) => i);
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {bantlar.map((i) => {
        const d = i * u * 2;
        const o = (guc * (kalinlik - i)) / kalinlik;
        return (
          <React.Fragment key={i}>
            <View
              style={{
                position: 'absolute',
                top: d,
                left: d,
                right: d,
                height: u * 2,
                backgroundColor: '#000',
                opacity: o,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: d,
                left: d,
                right: d,
                height: u * 2,
                backgroundColor: '#000',
                opacity: o,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: d + u * 2,
                bottom: d + u * 2,
                left: d,
                width: u * 2,
                backgroundColor: '#000',
                opacity: o,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: d + u * 2,
                bottom: d + u * 2,
                right: d,
                width: u * 2,
                backgroundColor: '#000',
                opacity: o,
              }}
            />
          </React.Fragment>
        );
      })}
    </View>
  );
}
