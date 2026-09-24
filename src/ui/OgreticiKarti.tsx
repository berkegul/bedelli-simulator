import React, { useEffect, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import type { Hareket } from '../minigames/ogretici';
import { PixelButton } from './PixelButton';
import { PixelText } from './PixelText';
import { useHareketAzalt } from './useHareketAzalt';

const ALAN = 150;

/**
 * Parmak ucu ve dokunma halkası. Hareket türüne göre parmak dokunup
 * kalkıyor, basılı kalıyor, ileri geri ovuyor, aşağı çekiyor ya da
 * sürüklüyor. Döngü sürekli; hareket azaltmada durağan.
 */
function El({ hareket }: { hareket: Hareket }) {
  const azalt = useHareketAzalt();
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (azalt) return;
    const sure = hareket === 'dokun' ? 900 : 1400;
    const dongu = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: sure,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );
    dongu.start();
    return () => dongu.stop();
  }, [hareket, azalt, t]);

  const bas = { inputRange: [0, 0.25, 0.7, 1] };
  const x =
    hareket === 'ov'
      ? t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-32, 32, -32] })
      : hareket === 'surukle'
        ? t.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [-34, -34, 30, 30] })
        : 0;
  const y =
    hareket === 'cek'
      ? t.interpolate({ inputRange: [0, 0.15, 0.85, 1], outputRange: [-30, -30, 30, 30] })
      : hareket === 'surukle'
        ? t.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [20, 20, -18, -18] })
        : hareket === 'dokun'
          ? t.interpolate({ ...bas, outputRange: [-8, 0, -8, -8] })
          : 0;
  // Halka: dokunuşta açılıp sönüyor, basılı tutuşta dolup bekliyor.
  const halkaOlcek =
    hareket === 'tut'
      ? t.interpolate({ inputRange: [0, 0.6, 0.8, 1], outputRange: [0.5, 1.5, 1.5, 0.5] })
      : t.interpolate({ ...bas, outputRange: [0.4, 0.5, 1.7, 1.7] });
  const halkaSaydam =
    hareket === 'tut'
      ? t.interpolate({ inputRange: [0, 0.6, 0.8, 1], outputRange: [0.2, 0.9, 0.9, 0] })
      : hareket === 'dokun'
        ? t.interpolate({ ...bas, outputRange: [0, 0.9, 0, 0] })
        : 0.5;

  return (
    <View
      style={{
        width: ALAN,
        height: ALAN,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: BORDER,
        borderColor: C.line,
        backgroundColor: C.bg,
      }}
    >
      <Animated.View style={{ transform: [{ translateX: x }, { translateY: y }], alignItems: 'center' }}>
        <Animated.View
          style={{
            position: 'absolute',
            top: -14,
            width: 34,
            height: 34,
            borderWidth: 3,
            borderColor: C.brass,
            opacity: halkaSaydam,
            transform: [{ scale: halkaOlcek }],
          }}
        />
        {/* Parmak: tırnaklı uç, sonra el sırtı */}
        <View style={{ width: 16, height: 38, backgroundColor: C.canvas, borderWidth: 3, borderColor: C.ink }}>
          <View style={{ margin: 1, height: 8, backgroundColor: C.canvasDim }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: -6 }}>
          {/* Başparmak yanda, avuç altta */}
          <View
            style={{
              width: 12,
              height: 16,
              marginTop: 8,
              marginRight: -3,
              backgroundColor: C.canvas,
              borderWidth: 3,
              borderColor: C.ink,
            }}
          />
          <View
            style={{ width: 36, height: 30, backgroundColor: C.canvas, borderWidth: 3, borderColor: C.ink }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

type Props = { baslik: string; hareket: Hareket; metin: string; onTamam: () => void };

/**
 * Mini oyunun ilk açılışında süre başlamadan önce çıkan kart. Bir kez
 * görülür; ayarlardan yeniden açılabilir.
 */
export function OgreticiKarti({ baslik, hareket, metin, onTamam }: Props) {
  return (
    <View style={{ gap: SP.lg }}>
      <View style={{ gap: SP.xs }}>
        <PixelText font="command" size="small" color={C.canvasFaint} tracking={2}>
          NASIL OYNANIR
        </PixelText>
        <PixelText font="command" size="h2" color={C.brass}>
          {baslik}
        </PixelText>
      </View>
      <El hareket={hareket} />
      <PixelText size="lead" color={C.canvas} line="body">
        {metin}
      </PixelText>
      <PixelButton label="Anladım, başla" onPress={onTamam} />
    </View>
  );
}
