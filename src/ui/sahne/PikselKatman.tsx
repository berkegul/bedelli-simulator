import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import type { Piksel } from './doku';

type Props = {
  pikseller: Piksel[];
  /** Bir hücre kaç nokta; sprite ölçeğiyle aynı olmalı ki doku ve sprite aynı ızgarada dursun. */
  u: number;
  /** Hücre cinsinden genişlik ve yükseklik. */
  w: number;
  h: number;
  style?: object;
};

/** Doku listesini tek SVG'de basan katman. Hesap çağıranda (useMemo). */
export function PikselKatman({ pikseller, u, w, h, style }: Props) {
  return (
    <View pointerEvents="none" style={[{ width: w * u, height: h * u }, style]}>
      <Svg width={w * u} height={h * u}>
        {pikseller.map((p, i) => (
          <Rect
            key={i}
            x={p.x * u}
            y={p.y * u}
            width={p.w * u}
            height={p.h * u}
            fill={p.c}
            opacity={p.o}
          />
        ))}
      </Svg>
    </View>
  );
}
