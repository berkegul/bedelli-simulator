import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { BORDER, C } from '../theme';
import { sprite } from '../art';
import { ASCI, KAZAN } from '../art/sahne/yemekhane';
import { PixelSprite } from '../ui/PixelSprite';
import { Golge, Nefes, PikselKatman, Sahne } from '../ui/sahne';
import { ZEMINLER, benek, type Piksel } from '../ui/sahne/doku';
import { useHareketAzalt } from '../ui/useHareketAzalt';

const U = 3;
const BANT_YUKSEKLIK = 132;

/** Kazandan yükselen buhar: birkaç piksel, yukarı çıkıp sönüyor. */
function Buhar({ gecikme }: { gecikme: number }) {
  const azalt = useHareketAzalt();
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (azalt) return;
    const d = Animated.loop(
      Animated.sequence([
        Animated.delay(gecikme),
        Animated.timing(t, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    d.start();
    return () => d.stop();
  }, [azalt, gecikme, t]);
  if (azalt) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        opacity: t.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.55, 0] }),
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -10 * U] }) },
          { translateX: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, U, 0] }) },
        ],
      }}
    >
      <View style={{ width: 2 * U, height: 2 * U, backgroundColor: '#E8E2D0' }} />
      <View style={{ width: U, height: U, marginLeft: 2 * U, backgroundColor: '#E8E2D0' }} />
    </Animated.View>
  );
}

/**
 * Dağıtım bandı: tepsini aldığın yer. Arkada badana ve lambri, bandın
 * üstünde buharı tüten kazanlar, arkasında beyaz önlüklü aşçı; solda
 * sırada bekleyen askerler.
 */
export function DagitimBandi() {
  const bant = sprite('tepsiBandi');
  const kazanlar = [30, 48, 66];
  return (
    <View style={{ borderWidth: BORDER, borderColor: C.ink, borderBottomWidth: 0 }}>
      <Sahne
        yukseklik={BANT_YUKSEKLIK}
        u={U}
        zemin="karo"
        zeminOrani={0.22}
        duvar="badana"
        lambalar={[{ x: 50, y: 20, yaricap: 22 }]}
        losluk={0.05}
        vinyet={false}
        tohum={17}
      >
        {/* Arka: pencere ve sıra bekleyenler */}
        <View style={{ position: 'absolute', left: '84%', top: 10 }}>
          <PixelSprite sprite={sprite('pencere')} scale={2} opacity={0.8} />
        </View>
        {[4, 13].map((x, i) => (
          <View
            key={x}
            style={{ position: 'absolute', left: `${x}%`, bottom: 10, alignItems: 'center' }}
          >
            <Nefes u={2} gecikme={i * 300}>
              <PixelSprite sprite={sprite(i ? 'askerSirt' : 'askerTolga')} scale={i ? 3 : 2} />
            </Nefes>
            <Golge genislik={10} u={2} />
          </View>
        ))}

        {/* Aşçı bandın arkasında, beline kadar görünüyor */}
        <View
          style={{ position: 'absolute', left: '56%', bottom: 34, height: 44, overflow: 'hidden' }}
        >
          <Nefes u={2} gecikme={500}>
            <PixelSprite sprite={ASCI} scale={2} />
          </Nefes>
        </View>

        {/* Band: iki parça yan yana, üstünde kazanlar */}
        <View style={{ position: 'absolute', left: '24%', bottom: 4, flexDirection: 'row' }}>
          <PixelSprite sprite={bant} scale={3} />
          <PixelSprite sprite={bant} scale={3} />
        </View>
        {kazanlar.map((x, i) => (
          <View key={x} style={{ position: 'absolute', left: `${x}%`, bottom: 25 }}>
            <PixelSprite sprite={KAZAN} scale={2} />
            <View style={{ position: 'absolute', left: 8, top: 0 }}>
              <Buhar gecikme={i * 600} />
            </View>
            <View style={{ position: 'absolute', left: 16, top: 0 }}>
              <Buhar gecikme={i * 600 + 900} />
            </View>
          </View>
        ))}
      </Sahne>
    </View>
  );
}

/** Ahşap masa üstü: tahta dokusu, bir iki yağ lekesi. */
function masaDokusu(w: number, h: number): Piksel[] {
  const a = { x: 0, y: 0, w, h };
  return [
    ...ZEMINLER.parke(a, 23),
    ...benek(a, [{ c: '#4A3520', oran: 0.01 }], 29, { w: 3, h: 2 }),
  ];
}

/**
 * Masa: tepsi ahşabın üstünde, altında gölgesi. Ön kenar koyu bir tahta
 * şerit; tokluk göstergesi o kenarda duruyor (children'ın `kenar`ı).
 */
export function Masa({ children, kenar }: { children: React.ReactNode; kenar?: React.ReactNode }) {
  const [en, setEn] = useState(0);
  const [boy, setBoy] = useState(0);
  const W = Math.ceil(en / U);
  const H = Math.ceil(boy / U);
  const doku = useMemo(() => (W && H ? masaDokusu(W, H) : []), [W, H]);

  return (
    <View style={{ borderWidth: BORDER, borderColor: C.ink }}>
      <View
        onLayout={(e) => {
          setEn(Math.round(e.nativeEvent.layout.width));
          setBoy(Math.round(e.nativeEvent.layout.height));
        }}
        style={{ backgroundColor: '#5E4428', padding: 12 }}
      >
        {W > 0 && H > 0 && (
          <PikselKatman
            pikseller={doku}
            u={U}
            w={W}
            h={H}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}
        {/* Tepsinin masaya düşen gölgesi */}
        <View style={{ position: 'relative' }}>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              right: -6,
              bottom: -6,
              backgroundColor: '#000',
              opacity: 0.3,
            }}
          />
          {children}
        </View>
      </View>
      {/* Ön kenar: koyu tahta, üstünde ışık çizgisi */}
      <View
        style={{
          backgroundColor: '#3E2C1A',
          borderTopWidth: 2,
          borderTopColor: '#7A5A36',
          padding: 10,
          gap: 6,
        }}
      >
        {kenar}
      </View>
    </View>
  );
}
