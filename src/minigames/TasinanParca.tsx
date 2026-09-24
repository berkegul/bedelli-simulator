import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { C } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { KUTU } from '../screens/DolapYerlesimi';
import { PixelSprite } from '../ui/PixelSprite';

const YAY = { damping: 17, stiffness: 210, mass: 0.6 };

/**
 * Elle taşınan giysi ya da eşya: giyinmede raftan askere, gece askerden
 * askıya. Sürükleyip bırakınca `onBirak` kutunun ortasıyla çağrılıyor,
 * yerinde dokununca `onDokun`. Her durumda önce kendi yerine süzülüyor;
 * yeri değiştiyse (giyildi, asıldı) ebeveyn onu zaten kaldırıyor.
 */
export function TasinanParca<T extends string>({
  id,
  ad,
  sprite: sp,
  cerceve,
  x,
  y,
  onBirak,
  onDokun,
  yanip = false,
}: {
  id: T;
  ad: string;
  sprite: SpriteKey;
  /** Uyarı ya da seçim rengi; yoksa sade çerçeve. */
  cerceve?: string;
  /** Sıradaki parça: oyuncu neyi alacağını anlasın diye çerçevesi yanıp sönüyor. */
  yanip?: boolean;
  x: number;
  y: number;
  onBirak: (id: T, x: number, y: number) => void;
  onDokun: (id: T) => void;
}) {
  const tx = useSharedValue(x);
  const ty = useSharedValue(y);
  const bx = useSharedValue(0);
  const by = useSharedValue(0);
  const tut = useSharedValue(0);
  const nabiz = useSharedValue(0);

  useEffect(() => {
    if (yanip) {
      nabiz.set(withRepeat(withTiming(1, { duration: 520 }), -1, true));
    } else {
      cancelAnimation(nabiz);
      nabiz.set(withTiming(0, { duration: 150 }));
    }
  }, [yanip, nabiz]);

  const parilti = useAnimatedStyle(() => ({ opacity: nabiz.value }));

  const ev = useRef({ x, y });
  ev.current = { x, y };

  useEffect(() => {
    tx.set(withSpring(x, YAY));
    ty.set(withSpring(y, YAY));
  }, [x, y, tx, ty]);

  const geri = useCallback(() => {
    tx.set(withSpring(ev.current.x, YAY));
    ty.set(withSpring(ev.current.y, YAY));
  }, [tx, ty]);

  const birak = useCallback(
    (cx: number, cy: number) => {
      onBirak(id, cx, cy);
      geri();
    },
    [geri, id, onBirak],
  );
  const dokun = useCallback(() => {
    onDokun(id);
    geri();
  }, [geri, id, onDokun]);

  const jest = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        // Geliştirme alanında sahne kaydırılabilir bir sayfada; parça tutulunca sayfa kaymasın.
        .manualActivation(true)
        .onTouchesDown((_e, durum) => {
          'worklet';
          durum.activate();
        })
        .onStart(() => {
          'worklet';
          cancelAnimation(tx);
          cancelAnimation(ty);
          bx.set(tx.value);
          by.set(ty.value);
          tut.set(withTiming(1, { duration: 90 }));
        })
        .onUpdate((e) => {
          'worklet';
          tx.set(bx.value + e.translationX);
          ty.set(by.value + e.translationY);
        })
        .onEnd((e) => {
          'worklet';
          const kisa = Math.abs(e.translationX) + Math.abs(e.translationY) < 6;
          if (kisa) runOnJS(dokun)();
          else runOnJS(birak)(tx.value + KUTU / 2, ty.value + KUTU / 2);
        })
        .onFinalize(() => {
          'worklet';
          tut.set(withTiming(0, { duration: 140 }));
        }),
    [birak, bx, by, dokun, tut, tx, ty],
  );

  const stil = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: 1 + tut.value * 0.14 },
    ],
    zIndex: tut.value > 0.01 ? 30 : 3,
  }));

  return (
    <GestureDetector gesture={jest}>
      <Animated.View
        accessibilityRole="button"
        accessibilityLabel={ad}
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            width: KUTU,
            height: KUTU,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: C.surface,
            borderWidth: cerceve ? 2 : 1,
            borderColor: cerceve ?? C.line,
          },
          stil,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: -5,
              right: -5,
              top: -5,
              bottom: -5,
              borderWidth: 3,
              borderColor: C.brass,
              backgroundColor: 'rgba(217,165,33,0.18)',
            },
            parilti,
          ]}
        />
        <PixelSprite sprite={sprite(sp)} scale={3} />
      </Animated.View>
    </GestureDetector>
  );
}
