import React, { useEffect, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { C } from '../theme';
import { PixelSprite } from './PixelSprite';
import { sprite } from '../art';
import type { SpriteDef } from './PixelSprite';
import { useHareketAzalt } from './useHareketAzalt';

/**
 * Günün saati gökyüzünün rengini belirliyor. Renkler bilerek soluk ve
 * kirli — oyunun haki paletine parlak bir mavi hiç oturmuyordu, bu yüzden
 * gökyüzü de kumaş boyası gibi duruyor.
 */
export type Isik = {
  ad: string;
  ust: string;
  alt: string;
  cisim: 'gunes' | 'ay' | null;
  /** Cismin gökyüzündeki yüksekliği: 0 ufuk, 1 tepe. */
  yukseklik: number;
  yildiz: boolean;
};

const dakika = (saat: string) => {
  const [s, d] = saat.split(':').map(Number);
  return (s || 0) * 60 + (d || 0);
};

export function isikDurumu(saat: string): Isik {
  const t = dakika(saat);

  if (t < 5 * 60 + 15) {
    return { ad: 'gece', ust: '#12141F', alt: '#1B1D2A', cisim: 'ay', yukseklik: 0.72, yildiz: true };
  }
  if (t < 6 * 60 + 30) {
    return { ad: 'şafak', ust: '#2E2838', alt: '#6B4A38', cisim: 'gunes', yukseklik: 0.12, yildiz: false };
  }
  if (t < 11 * 60) {
    return { ad: 'sabah', ust: '#3E4A54', alt: '#5C6560', cisim: 'gunes', yukseklik: 0.45, yildiz: false };
  }
  if (t < 15 * 60) {
    return { ad: 'öğle', ust: '#54626B', alt: '#6E7466', cisim: 'gunes', yukseklik: 0.85, yildiz: false };
  }
  if (t < 18 * 60) {
    return { ad: 'ikindi', ust: '#5A5A50', alt: '#7A6440', cisim: 'gunes', yukseklik: 0.4, yildiz: false };
  }
  if (t < 20 * 60) {
    return { ad: 'akşam', ust: '#3A2E3C', alt: '#7A4A32', cisim: 'gunes', yukseklik: 0.08, yildiz: false };
  }
  return { ad: 'gece', ust: '#12141F', alt: '#1B1D2A', cisim: 'ay', yukseklik: 0.6, yildiz: true };
}

/** Yıldız konumları sabit; her karede zıplamasınlar diye modül seviyesinde. */
const YILDIZLAR = [
  { x: 12, y: 18 }, { x: 28, y: 9 }, { x: 41, y: 26 }, { x: 57, y: 14 },
  { x: 69, y: 30 }, { x: 78, y: 11 }, { x: 88, y: 24 }, { x: 21, y: 34 },
  { x: 63, y: 6 }, { x: 92, y: 40 }, { x: 5, y: 8 }, { x: 35, y: 16 },
  { x: 48, y: 5 }, { x: 74, y: 44 }, { x: 16, y: 48 }, { x: 52, y: 38 },
  { x: 83, y: 4 }, { x: 96, y: 15 },
];

/** İki renk arası: gökyüzü ufka doğru basamak basamak açılıyor. */
function ara(x: string, y: string, oran: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [p(x), p(y)];
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * oran).toString(16).padStart(2, '0')).join('')}`;
}

/** Piksel bulut: üstü açık, altı gölgeli. Renkler gökyüzünden türüyor. */
const BULUT_SATIRLARI = [
  [
    '......aaaa..........',
    '....aaaaaaaa..aaa...',
    '..aaaaaaaaaaaaaaaaa.',
    '.aaaaaaaaaaaaaaaaaaa',
    'bbbbbbbbbbbbbbbbbbbb',
    '.bbbbbbbbbbbbbbbbbb.',
  ],
  [
    '.....aaa......',
    '..aaaaaaaa....',
    '.aaaaaaaaaaaa.',
    'bbbbbbbbbbbbbb',
    '..bbbbbbbbbb..',
  ],
];

function bulut(i: number, isik: Isik): SpriteDef {
  const acik = ara(isik.alt, '#D8D0B8', 0.45);
  const golge = ara(isik.alt, isik.ust, 0.25);
  return { palette: { a: acik, b: golge }, rows: BULUT_SATIRLARI[i % BULUT_SATIRLARI.length] };
}

/** Bulutlar çok yavaş kayıyor; bir tur ~90 saniye. Hareket azaltmada duruyor. */
function Bulutlar({ isik, yukseklik }: { isik: Isik; yukseklik: number }) {
  const azalt = useHareketAzalt();
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (azalt) return;
    const d = Animated.loop(
      Animated.timing(t, { toValue: 1, duration: 90_000, easing: Easing.linear, useNativeDriver: true }),
    );
    d.start();
    return () => d.stop();
  }, [azalt, t]);
  const konumlar = [
    { x: 6, y: 0.18, olcek: 3 },
    { x: 52, y: 0.08, olcek: 2 },
    { x: 78, y: 0.3, olcek: 3 },
  ];
  return (
    <>
      {konumlar.map((k, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: `${k.x}%`,
            top: Math.round(k.y * yukseklik),
            opacity: 0.85,
            transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, 40 + i * 12] }) }],
          }}
        >
          <PixelSprite sprite={bulut(i, isik)} scale={k.olcek} />
        </Animated.View>
      ))}
    </>
  );
}

type Props = {
  saat: string;
  yukseklik: number;
  /** Gökyüzü cismini gizle — gün başı ekranı kendi güneşini animasyonlu çiziyor. */
  cisimsiz?: boolean;
};

/** Yatay bantlarla kurulmuş pixel gökyüzü; yumuşak degrade yok, kademe var. */
export function Gokyuzu({ saat, yukseklik, cisimsiz }: Props) {
  const isik = isikDurumu(saat);
  const bantSayisi = 8;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: yukseklik }}>
      <Svg width="100%" height={yukseklik}>
        {Array.from({ length: bantSayisi }, (_, i) => (
          <Rect
            key={i}
            x="0"
            y={(yukseklik / bantSayisi) * i}
            width="100%"
            height={yukseklik / bantSayisi + 1}
            fill={ara(isik.ust, isik.alt, i / (bantSayisi - 1))}
          />
        ))}

        {isik.yildiz &&
          YILDIZLAR.map((y, i) => (
            <Rect
              key={`y${i}`}
              x={`${y.x}%`}
              y={(y.y / 100) * yukseklik}
              width={i % 5 === 0 ? 3 : 2}
              height={i % 5 === 0 ? 3 : 2}
              fill={C.canvas}
              opacity={i % 3 === 0 ? 0.8 : 0.45}
            />
          ))}
      </Svg>

      {!isik.yildiz && yukseklik > 60 && <Bulutlar isik={isik} yukseklik={yukseklik} />}

      {!cisimsiz && isik.cisim && (
        <View
          style={{
            position: 'absolute',
            right: '14%',
            top: Math.max(4, (1 - isik.yukseklik) * (yukseklik - 40)),
            opacity: 0.9,
          }}
        >
          <PixelSprite sprite={sprite(isik.cisim === 'gunes' ? 'gunes' : 'ay')} scale={2} />
        </View>
      )}
    </View>
  );
}

/** Gün doğumu / batımı ekranları için ham renkler. */
export function gunDogumuRenkleri() {
  return { baslangic: isikDurumu('03:00'), bitis: isikDurumu('07:00') };
}

export function gunBatimiRenkleri() {
  return { baslangic: isikDurumu('17:00'), bitis: isikDurumu('22:00') };
}

/** İki ışık arası ara renk — animasyonlu geçişler için. */
export function isikKaristir(a: Isik, b: Isik, oran: number): Isik {
  const karis = (x: string, y: string) => {
    const s = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const [r1, g1, b1] = s(x);
    const [r2, g2, b2] = s(y);
    const k = (p: number, q: number) => Math.round(p + (q - p) * oran);
    return `#${[k(r1, r2), k(g1, g2), k(b1, b2)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')}`;
  };
  return {
    ad: oran < 0.5 ? a.ad : b.ad,
    ust: karis(a.ust, b.ust),
    alt: karis(a.alt, b.alt),
    cisim: oran < 0.5 ? a.cisim : b.cisim,
    yukseklik: a.yukseklik + (b.yukseklik - a.yukseklik) * oran,
    yildiz: oran < 0.4 ? a.yildiz : b.yildiz,
  };
}
