import React, { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import type { Yemek } from '../content/menu';
import { PixelText } from './PixelText';

export const TEPSI_YUKSEKLIK = 210;

/** Paslanmaz tepsi tonları — paletin çelik ailesinden, parlak metal yok. */
const METAL = {
  govde: '#6E8290',
  acik: '#8FA3AF',
  koyu: '#4A5A66',
  golge: '#38454F',
  kuyu: '#56666F',
};

type Desen = 'sivi' | 'tane' | 'dilim' | 'kup' | 'yigin';
type Stil = { renk: string; koyu: string; desen: Desen; sicak?: boolean };

/**
 * Tepsideki her kalemin ne göründüğü. İçerik dosyalarına renk alanı
 * eklemek yerine addan tanınıyor: yeni yemek yazan kişi hiçbir şey
 * öğrenmek zorunda kalmıyor, tanınmayan kalem de yakışır bir yığın oluyor.
 */
const KURALLAR: [RegExp, Stil][] = [
  [/çorba/i, { renk: '#B5602A', koyu: '#8A431C', desen: 'sivi', sicak: true }],
  [/fasulye|nohut|kuru bakla/i, { renk: '#9A5A2E', koyu: '#6E3C1C', desen: 'yigin', sicak: true }],
  [/pirinç|pilav/i, { renk: '#D8CBA4', koyu: '#AFA37C', desen: 'tane' }],
  [/bulgur/i, { renk: '#B08D57', koyu: '#87683C', desen: 'tane' }],
  [/ekmek/i, { renk: '#C79A5B', koyu: '#8A6534', desen: 'dilim' }],
  [/siyah zeytin/i, { renk: '#3C3A2C', koyu: '#24231A', desen: 'kup' }],
  [/zeytin/i, { renk: '#6E7444', koyu: '#4E5330', desen: 'kup' }],
  [/peynir/i, { renk: '#E6DCC0', koyu: '#B9AE92', desen: 'kup' }],
  [/yumurta/i, { renk: '#E6DCC0', koyu: '#D9A521', desen: 'kup' }],
  [/reçel/i, { renk: '#8E2E2E', koyu: '#661F1F', desen: 'sivi' }],
  [/helva/i, { renk: '#C7A16A', koyu: '#9A7852', desen: 'dilim' }],
  [/çay/i, { renk: '#8E4A20', koyu: '#5F3014', desen: 'sivi', sicak: true }],
  [/ayran|yoğurt|cacık|süt/i, { renk: '#E8E4D6', koyu: '#BFBAA8', desen: 'sivi' }],
  [/makarna/i, { renk: '#D8B45C', koyu: '#A98A42', desen: 'yigin', sicak: true }],
  [/patates/i, { renk: '#D2B268', koyu: '#A08542', desen: 'yigin', sicak: true }],
  [/turşu/i, { renk: '#7E8A3E', koyu: '#5A652A', desen: 'kup' }],
  [/karpuz/i, { renk: '#B2453F', koyu: '#7C2C28', desen: 'dilim' }],
  [/kavun/i, { renk: '#D7C46A', koyu: '#A79646', desen: 'dilim' }],
  [/köfte|et|tavuk|kıyma|oturtma|sote/i, { renk: '#7A4526', koyu: '#52301A', desen: 'yigin', sicak: true }],
  [/salata|marul|semizotu/i, { renk: '#6E7444', koyu: '#4A5030', desen: 'yigin' }],
  [/üzüm|elma|armut|şeftali|portakal/i, { renk: '#8E9A4E', koyu: '#646E34', desen: 'dilim' }],
  [/tatlı|puding|sütlaç|kek/i, { renk: '#D9C7A2', koyu: '#AC9974', desen: 'sivi' }],
];

const VARSAYILAN: Stil = { renk: '#9A8A62', koyu: '#6E6244', desen: 'yigin' };

export function yemekStili(ad: string): Stil {
  return KURALLAR.find(([re]) => re.test(ad))?.[1] ?? VARSAYILAN;
}

/** Aynı yemek her tepside aynı görünsün diye addan türeyen sabit dağınıklık. */
function tohum(ad: string, i: number) {
  let h = 0;
  for (let k = 0; k < ad.length; k++) h = (h * 31 + ad.charCodeAt(k)) % 9973;
  const n = Math.sin((h + i * 41) * 0.7331) * 43758.5453;
  return n - Math.floor(n);
}

/** Bölmenin içindeki porsiyon: 0–100 birimlik kutuya çizilir, esnetilir. */
function Porsiyon({ ad, stil }: { ad: string; stil: Stil }) {
  const { renk, koyu, desen } = stil;

  if (desen === 'sivi') {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Rect x={6} y={22} width={88} height={70} fill={renk} />
        <Rect x={6} y={22} width={88} height={6} fill={koyu} opacity={0.55} />
        <Rect x={16} y={34} width={26} height={4} fill="#FFFFFF" opacity={0.18} />
      </Svg>
    );
  }

  if (desen === 'tane') {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Rect x={8} y={26} width={84} height={64} fill={renk} />
        {Array.from({ length: 22 }, (_, i) => (
          <Rect
            key={i}
            x={12 + tohum(ad, i) * 74}
            y={30 + tohum(ad, i + 50) * 54}
            width={5}
            height={4}
            fill={koyu}
            opacity={0.7}
          />
        ))}
      </Svg>
    );
  }

  if (desen === 'dilim') {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            <Rect x={10 + i * 27} y={30 + (i % 2) * 8} width={24} height={46} fill={renk} />
            <Rect x={10 + i * 27} y={30 + (i % 2) * 8} width={24} height={7} fill={koyu} />
          </React.Fragment>
        ))}
      </Svg>
    );
  }

  if (desen === 'kup') {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({ length: 7 }, (_, i) => {
          const x = 10 + tohum(ad, i) * 66;
          const y = 30 + tohum(ad, i + 20) * 48;
          return (
            <React.Fragment key={i}>
              <Rect x={x} y={y} width={18} height={16} fill={renk} />
              <Rect x={x} y={y + 12} width={18} height={4} fill={koyu} />
            </React.Fragment>
          );
        })}
      </Svg>
    );
  }

  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <Rect x={10} y={34} width={80} height={54} fill={renk} />
      {Array.from({ length: 9 }, (_, i) => (
        <Rect
          key={i}
          x={12 + tohum(ad, i) * 68}
          y={30 + tohum(ad, i + 30) * 46}
          width={14}
          height={11}
          fill={i % 2 ? koyu : renk}
          opacity={0.9}
        />
      ))}
    </Svg>
  );
}

/** Sıcak yemeğin üstünde tüten buhar; üç şerit, kaydırmalı döngü. */
function Buhar() {
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const dongu = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    dongu.start();
    return () => dongu.stop();
  }, [t]);

  return (
    <View style={{ position: 'absolute', top: -10, left: 0, right: 0, height: 20, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={{
            width: 3,
            height: 10,
            backgroundColor: C.canvas,
            opacity: t.interpolate({
              inputRange: [0, 0.3 + i * 0.12, 0.7 + i * 0.1, 1],
              outputRange: [0, 0.3, 0.05, 0],
            }),
            transform: [
              {
                translateY: t.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, -10 - i * 2],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

/** Bölme yerleşimi yüzde: solda büyük ana göz, sağda ve altta küçükler. */
const BOLMELER = [
  { x: 3, y: 5, w: 54, h: 50 },
  { x: 60, y: 5, w: 37, h: 50 },
  { x: 3, y: 59, w: 30, h: 36 },
  { x: 36, y: 59, w: 30, h: 36 },
  { x: 69, y: 59, w: 28, h: 36 },
];

type Props = {
  menu: Yemek[];
  secili: number[];
  onToggle: (i: number) => void;
};

/**
 * Askeriye tepsisi: bölmeli paslanmaz. Menü listesi yerine tepsinin
 * kendisi seçim ekranı — hangi gözün dolduğunu görüyorsun, listede
 * kaç kalem işaretlediğini saymıyorsun.
 */
export function Tepsi({ menu, secili, onToggle }: Props) {
  // En doyurucu kalem büyük göze; kalanlar menü sırasıyla yerleşiyor.
  const yerlesim = React.useMemo(() => {
    if (!menu.length) return [];
    let anaIndex = 0;
    menu.forEach((y, i) => {
      if (y.tokluk > menu[anaIndex].tokluk) anaIndex = i;
    });
    const kalan = menu.map((_, i) => i).filter((i) => i !== anaIndex);
    return [anaIndex, ...kalan].slice(0, BOLMELER.length);
  }, [menu]);

  return (
    <View
      style={{
        height: TEPSI_YUKSEKLIK,
        borderWidth: BORDER,
        borderColor: C.ink,
        backgroundColor: METAL.govde,
      }}
    >
      {/* Tepsinin kendisi: kenar pahı ve bölme kuyuları */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Svg width="100%" height="100%">
          <Rect x="0" y="0" width="100%" height="100%" fill={METAL.govde} />
          <Rect x="0" y="0" width="100%" height={3} fill={METAL.acik} />
          <Rect x="0" y="0" width={3} height="100%" fill={METAL.acik} />
          <Rect x="0" y={TEPSI_YUKSEKLIK - 4} width="100%" height={4} fill={METAL.golge} />
          {BOLMELER.map((b, i) => (
            <React.Fragment key={i}>
              <Rect
                x={`${b.x}%`}
                y={`${b.y}%`}
                width={`${b.w}%`}
                height={`${b.h}%`}
                fill={METAL.kuyu}
              />
              <Rect x={`${b.x}%`} y={`${b.y}%`} width={`${b.w}%`} height={3} fill={METAL.golge} />
              <Rect x={`${b.x}%`} y={`${b.y}%`} width={3} height={`${b.h}%`} fill={METAL.golge} />
            </React.Fragment>
          ))}
        </Svg>
      </View>

      {yerlesim.map((menuIndex, bolmeIndex) => (
        <Goz
          key={menu[menuIndex].ad}
          yemek={menu[menuIndex]}
          kutu={BOLMELER[bolmeIndex]}
          dolu={secili.includes(menuIndex)}
          onPress={() => onToggle(menuIndex)}
        />
      ))}
    </View>
  );
}

/** Tek bölme: dokununca porsiyon büyüyerek iniyor, tekrar dokununca kalkıyor. */
function Goz({
  yemek,
  kutu,
  dolu,
  onPress,
}: {
  yemek: Yemek;
  kutu: { x: number; y: number; w: number; h: number };
  dolu: boolean;
  onPress: () => void;
}) {
  const stil = yemekStili(yemek.ad);
  const [giris] = useState(() => new Animated.Value(dolu ? 1 : 0));

  useEffect(() => {
    Animated.spring(giris, {
      toValue: dolu ? 1 : 0,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [dolu, giris]);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: dolu }}
      accessibilityLabel={`${yemek.ad}, ${dolu ? 'tepside' : 'boş göz'}`}
      onPress={onPress}
      style={{
        position: 'absolute',
        left: `${kutu.x}%`,
        top: `${kutu.y}%`,
        width: `${kutu.w}%`,
        height: `${kutu.h}%`,
        borderWidth: BORDER,
        borderColor: dolu ? C.brass : 'transparent',
        justifyContent: 'flex-end',
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Seçilmemiş yemek de gözünde duruyor, soluk ve küçük: oyuncu ne
          // sunulduğunu görüyor. Eskiden boş gri kutular taslak gibi duruyordu.
          opacity: giris.interpolate({ inputRange: [0, 1], outputRange: [0.32, 1] }),
          transform: [{ scale: giris.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) }],
        }}
      >
        <Porsiyon ad={yemek.ad} stil={stil} />
        {stil.sicak && dolu && <Buhar />}
      </Animated.View>

      <View style={{ backgroundColor: C.ink, paddingHorizontal: 3, alignSelf: 'flex-start', margin: 2 }}>
        <PixelText font="bodyMed" size="micro" color={dolu ? C.brass : C.canvasDim} numberOfLines={1}>
          {yemek.ad}
        </PixelText>
      </View>
    </Pressable>
  );
}

/** Tepsinin altındaki tek satırlık özet — kaç göz doldu, kaç tokluk. */
export function TepsiOzeti({ adet, tokluk }: { adet: number; tokluk: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
      <PixelText font="bodyMed" size="small" color={C.canvasDim} style={{ flex: 1 }}>
        {adet ? `Tepside ${adet} kalem` : 'Tepsi boş — bir göze dokun'}
      </PixelText>
      <PixelText font="command" size="lead" color={C.ekmek}>
        {`+${tokluk}`}
      </PixelText>
    </View>
  );
}
