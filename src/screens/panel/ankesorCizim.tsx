import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { C, SP } from '../../theme';
import type { Rol } from '../../content/telefon/tipler';
import { ASKER_AHIZE, KARTLI_TELEFON, LCD, karsiTaraf } from '../../art/sahne/ankesor';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { useHareketAzalt } from '../../ui/useHareketAzalt';

/** LCD yazısı: soluk yeşil, dijital. */
export const LCD_YAZI = '#B5D06A';

/**
 * Duvardaki kartlı telefon; LCD'sinde kalan kontör ya da söz hakkı yazıyor.
 * Metin sprite'ın LCD hücrelerinin üstüne oturuyor.
 */
export function KartliTelefon({ u, lcd }: { u: number; lcd: string }) {
  return (
    <View>
      <PixelSprite sprite={KARTLI_TELEFON} scale={u} />
      <View
        style={{
          position: 'absolute',
          left: LCD.x * u,
          top: LCD.y * u,
          width: LCD.w * u,
          height: LCD.h * u,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PixelText
          font="command"
          size={Math.max(10, Math.round(u * 2.6))}
          color={LCD_YAZI}
          line="tight"
        >
          {lcd}
        </PixelText>
      </View>
    </View>
  );
}

/** Kulübenin duvarına iğnelenmiş kâğıt: raptiye ve hafif gölge. */
export function Raptiye() {
  return (
    <View
      style={{
        position: 'absolute',
        top: -5,
        alignSelf: 'center',
        width: 10,
        height: 10,
        backgroundColor: C.rust,
        borderWidth: 2,
        borderColor: C.ink,
      }}
    />
  );
}

/** Ahizeyi kulağına dayamış asker, yakın plan. */
export function AskerAhize({ u }: { u: number }) {
  return <PixelSprite sprite={ASKER_AHIZE} scale={u} />;
}

/** Hattın öbür ucundaki kişinin silueti. */
export function KarsiTaraf({ rol, u }: { rol: Rol; u: number }) {
  return <PixelSprite sprite={karsiTaraf(rol)} scale={u} />;
}

/**
 * Hat cızırtısı: iki uç arasında titreyen kısa çizgiler. Ankesörde daha
 * kesik, cep telefonunda daha sakin. Hareket azaltmada durağan.
 */
export function HatCizirtisi({ u, kesik }: { u: number; kesik: boolean }) {
  const azalt = useHareketAzalt();
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (azalt) return;
    const d = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 1, useNativeDriver: true }),
        Animated.delay(kesik ? 180 : 420),
        Animated.timing(t, { toValue: 0, duration: 1, useNativeDriver: true }),
        Animated.delay(kesik ? 140 : 380),
      ]),
    );
    d.start();
    return () => d.stop();
  }, [azalt, kesik, t]);
  const boylar = [2, 4, 3, 6, 2, 5, 3, 4, 2];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: u }}>
      {boylar.map((b, i) => (
        <Animated.View
          key={i}
          style={{
            width: u,
            height: b * u,
            backgroundColor: i % 2 ? C.canvasFaint : C.brass,
            opacity: t.interpolate({
              inputRange: [0, 1],
              outputRange: i % 2 ? [0.35, 0.9] : [0.9, 0.35],
            }),
          }}
        />
      ))}
    </View>
  );
}

/** Küçük LCD kutusu: sahne köşesinde söz hakkı / hat durumu. */
export function LcdKutu({ baslik, deger }: { baslik: string; deger: string }) {
  return (
    <View
      style={{
        backgroundColor: '#2F3B24',
        borderWidth: 2,
        borderColor: C.ink,
        paddingHorizontal: SP.sm,
        paddingVertical: 2,
        alignItems: 'center',
      }}
    >
      <PixelText size="micro" color="#7E9450">
        {baslik}
      </PixelText>
      <PixelText font="command" size="lead" color={LCD_YAZI} line="tight">
        {deger}
      </PixelText>
    </View>
  );
}
