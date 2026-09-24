import React, { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useHareketAzalt } from './useHareketAzalt';

/**
 * Üst düzey ekran değişince yeni ekran karanlıktan açılıyor (160 ms).
 * Eskiden bir kare içinde değişiyordu; oyuncu nereye geçtiğini fark
 * etmiyordu. `anahtar` değişince yeniden oynar; hareket azaltmada yok.
 */
export function EkranGecisi({ anahtar, children }: { anahtar: string; children: React.ReactNode }) {
  const azalt = useHareketAzalt();
  const [acilis] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (azalt) {
      acilis.setValue(1);
      return;
    }
    acilis.setValue(0);
    Animated.timing(acilis, {
      toValue: 1,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [anahtar, azalt, acilis]);

  return <Animated.View style={{ flex: 1, opacity: acilis }}>{children}</Animated.View>;
}
