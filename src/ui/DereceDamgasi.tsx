import React, { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { C, SP } from '../theme';
import { PixelText } from './PixelText';
import { useHareketAzalt } from './useHareketAzalt';

/** Skor eşikleri; ses de aynı sınırdan (0.6) başarı/başarısız seçiyor. */
export function dereceAdi(skor: number): { ad: string; renk: string } {
  if (skor >= 0.85) return { ad: 'MÜKEMMEL', renk: C.olive };
  if (skor >= 0.6) return { ad: 'TAMAM', renk: C.brass };
  return { ad: 'ZAYIF', renk: C.rust };
}

/**
 * Mini oyunun sonunda kâğıda vurulan damga: büyükten inip yerine oturuyor,
 * hafif yamuk. Hareket azaltma açıksa doğrudan yerinde.
 */
export function DereceDamgasi({ skor }: { skor: number }) {
  const { ad, renk } = dereceAdi(skor);
  const azalt = useHareketAzalt();
  const [vurus] = useState(() => new Animated.Value(azalt ? 1 : 0));

  useEffect(() => {
    if (azalt) {
      vurus.setValue(1);
      return;
    }
    vurus.setValue(0);
    Animated.timing(vurus, {
      toValue: 1,
      duration: 220,
      delay: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [skor, azalt, vurus]);

  return (
    <Animated.View
      accessibilityLabel={`Derece: ${ad}`}
      style={{
        alignSelf: 'flex-start',
        borderWidth: 3,
        borderColor: renk,
        paddingHorizontal: SP.sm,
        paddingVertical: 1,
        opacity: vurus.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [0, 0.9, 0.9],
        }),
        transform: [
          { rotate: '-6deg' },
          {
            scale: vurus.interpolate({
              inputRange: [0, 1],
              outputRange: [1.9, 1],
            }),
          },
        ],
      }}
    >
      <PixelText font="command" size="lead" color={renk} tracking={2}>
        {ad}
      </PixelText>
    </Animated.View>
  );
}
