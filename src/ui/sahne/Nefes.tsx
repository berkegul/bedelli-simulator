import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { useHareketAzalt } from '../useHareketAzalt';

/**
 * Duran karakter nefes alıyor: bir piksel yukarı, bir piksel aşağı, adım
 * adım (yumuşak değil, piksel diliyle). Herkes aynı anda nefes almasın diye
 * gecikme. Hareket azaltmada durağan.
 */
export function Nefes({
  u,
  gecikme = 0,
  sure = 1400,
  children,
}: {
  u: number;
  gecikme?: number;
  sure?: number;
  children: React.ReactNode;
}) {
  const azalt = useHareketAzalt();
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (azalt) return;
    const d = Animated.loop(
      Animated.sequence([
        Animated.delay(gecikme),
        Animated.timing(t, { toValue: 1, duration: 1, useNativeDriver: true }),
        Animated.delay(sure / 2),
        Animated.timing(t, { toValue: 0, duration: 1, useNativeDriver: true }),
        Animated.delay(sure / 2 - gecikme),
      ]),
    );
    d.start();
    return () => d.stop();
  }, [azalt, gecikme, sure, t]);

  return (
    <Animated.View style={{ transform: [{ translateY: Animated.multiply(t, -u) }] }}>
      {children}
    </Animated.View>
  );
}
