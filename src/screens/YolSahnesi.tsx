import React, { useCallback, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { Siddet, secim, titret } from '../ui/haptik';
import { Gokyuzu } from '../ui/Gokyuzu';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

const SAHNE_YUKSEKLIK = 190;
const ZEMIN = 52;

type Props = {
  hedef: string;
  adim: number;
  /** Yolun sonunda beliren mekan. */
  mekan: SpriteKey;
  /** Yol boyunca geçilen manzara, sırayla. */
  manzara: SpriteKey[];
  /** Bloğun başlangıç saati; gökyüzünün rengini bu belirliyor. */
  saat: string;
  onVardi: () => void;
};

/**
 * İki blok arasındaki yürüyüş. Asker ekranın ortasında sabit, manzara
 * sola kayıyor — koşu bandı mantığı. Her dokunuş bir adım; hızlı dokunan
 * hızlı varır, oyun kimseyi bekletmez.
 */
export function YolSahnesi({ hedef, adim, mekan, manzara, saat, onVardi }: Props) {
  // Manzara öğelerini yola dağıt; hepsi zemin çizgisinin üstünde, uzakta.
  const dizilim = manzara.map((sp, i) => ({
    sprite: sp,
    olcek: sp === 'kisla' || sp === 'kantinBina' ? 2 : sp === 'ankesor' ? 1 : 2,
    yer: 0.18 + i * 0.36,
    taban: ZEMIN + 1,
  }));
  const [atilan, setAtilan] = useState(0);
  const [solAyak, setSolAyak] = useState(true);
  const kaydirma = useRef(new Animated.Value(0)).current;
  const zipla = useRef(new Animated.Value(0)).current;
  const vardi = useRef(false);

  const basAdim = useCallback(() => {
    if (vardi.current) return;
    const yeni = atilan + 1;
    setAtilan(yeni);
    setSolAyak((s) => !s);
    secim();

    Animated.timing(kaydirma, {
      toValue: yeni,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Adım atarken gövde hafif yükselip iniyor: yürüyüşün ritmi.
    Animated.sequence([
      Animated.timing(zipla, { toValue: 1, duration: 110, useNativeDriver: true }),
      Animated.timing(zipla, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();

    if (yeni >= adim) {
      vardi.current = true;
      titret(Siddet.Medium);
      setTimeout(onVardi, 380);
    }
  }, [atilan, adim, kaydirma, zipla, onVardi]);

  const kalan = Math.max(0, adim - atilan);

  return (
    <View style={{ gap: SP.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          {hedef.toLocaleUpperCase('tr-TR')}
        </PixelText>
        <PixelText size="micro" color={C.canvasFaint}>
          {kalan > 0 ? `${kalan} adım` : 'vardın'}
        </PixelText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adım at"
        onPress={basAdim}
        style={{
          height: SAHNE_YUKSEKLIK,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: '#232016',
          overflow: 'hidden',
          justifyContent: 'flex-end',
        }}
      >
        {/* Günün saatine göre gökyüzü */}
        <Gokyuzu saat={saat} yukseklik={SAHNE_YUKSEKLIK - ZEMIN} />

        {/* Zemin */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: ZEMIN }}>
          <Svg width="100%" height={ZEMIN}>
            <Rect x="0" y="0" width="100%" height={ZEMIN} fill="#3A3421" />
            <Line x1="0" y1={1} x2="100%" y2={1} stroke={C.line} strokeWidth={2} />
          </Svg>
        </View>

        {/* Hedef mekan: yürüdükçe sağdan yaklaşıp ortada beliriyor */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: ZEMIN - 4,
            alignSelf: 'center',
            opacity: kaydirma.interpolate({
              inputRange: [0, adim * 0.55, adim],
              outputRange: [0, 0.35, 1],
            }),
            transform: [
              {
                translateX: kaydirma.interpolate({
                  inputRange: [0, adim],
                  outputRange: [300, 0],
                }),
              },
            ],
          }}
        >
          <PixelSprite sprite={sprite(mekan)} scale={3} />
        </Animated.View>

        {/* Manzara: her adımda sola kayar */}
        {dizilim.map((m, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              bottom: m.taban,
              left: `${m.yer * 100}%`,
              opacity: 0.5,
              transform: [
                {
                  translateX: kaydirma.interpolate({
                    inputRange: [0, adim],
                    outputRange: [0, -340],
                  }),
                },
              ],
            }}
          >
            <PixelSprite sprite={sprite(m.sprite)} scale={m.olcek} />
          </Animated.View>
        ))}

        {/* Yol çizgileri — hareket hissini veren asıl şey */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 6,
            left: 0,
            flexDirection: 'row',
            gap: 26,
            transform: [
              {
                translateX: kaydirma.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -42],
                  extrapolate: 'extend',
                }),
              },
            ],
          }}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <View key={i} style={{ width: 16, height: 3, backgroundColor: C.canvasFaint, opacity: 0.5 }} />
          ))}
        </Animated.View>

        {/* Yürüyen asker: ekranın ortasında sabit */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 8,
            alignSelf: 'center',
            transform: [
              { translateY: zipla.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) },
            ],
          }}
        >
          <PixelSprite sprite={sprite(solAyak ? 'askerAdim' : 'asker')} scale={4} />
        </Animated.View>

        {atilan === 0 && (
          <View style={{ position: 'absolute', top: SP.md, alignSelf: 'center' }}>
            <PixelText font="command" size="lead" color={C.brass}>
              YÜRÜMEK İÇİN DOKUN
            </PixelText>
          </View>
        )}
      </Pressable>

      {/* Adım sayacı */}
      <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'center' }}>
        {Array.from({ length: adim }, (_, i) => (
          <View
            key={i}
            style={{
              width: 12,
              height: 8,
              backgroundColor: i < atilan ? C.brass : C.ink,
              borderWidth: 1,
              borderColor: C.line,
            }}
          />
        ))}
      </View>
    </View>
  );
}
