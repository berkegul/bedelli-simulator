import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { useGame } from '../store/gameStore';
import { PixelText } from '../ui/PixelText';
import { GELISTIRME_ACIK } from './ayar';

/**
 * Geliştirme alanından oyuna atlandığında ekranın üstünde duran geri
 * dönüş rozeti. Tek yerde durduğu için oyunun ekranlarına hiç dokunmuyor.
 */
export function GelistirmeRozeti() {
  const donus = useGame((s) => s.gelistirmeDonus);
  const don = useGame((s) => s.gelistirmeyeDon);
  const inset = useSafeAreaInsets();

  if (!GELISTIRME_ACIK || !donus) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: inset.top + SP.xs,
        right: SP.sm,
        zIndex: 999,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Geliştirme alanına dön"
        onPress={don}
        style={{
          borderWidth: BORDER,
          borderColor: C.brass,
          backgroundColor: C.ink,
          paddingHorizontal: SP.sm,
          paddingVertical: 2,
        }}
      >
        <PixelText font="command" size="body" color={C.brass} tracking={1}>
          ‹ GELİŞTİRME
        </PixelText>
      </Pressable>
    </View>
  );
}
