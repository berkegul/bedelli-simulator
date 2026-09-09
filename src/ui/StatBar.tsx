import React from 'react';
import { View } from 'react-native';
import { C, SP, STAT_COLOR } from '../theme';
import { STAT_META, type StatKey } from '../engine/types';
import { PixelText } from './PixelText';

const SEGMENT = 10;

type Props = {
  stat: StatKey;
  value: number;
  delta?: number;
  /** Kompakt mod: alt şeritte yan yana dizilenler için. */
  kucuk?: boolean;
};

export function StatBar({ stat, value, delta, kucuk }: Props) {
  const renk = STAT_COLOR[stat];
  const dolu = Math.round((value / 100) * SEGMENT);
  const yukseklik = kucuk ? 6 : 10;

  return (
    <View style={{ gap: kucuk ? 2 : SP.xs, flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.xs }}>
        <PixelText
          font={kucuk ? 'bodyMed' : 'bodySemi'}
          size={kucuk ? 'micro' : 'small'}
          color={C.canvasDim}
          style={{ flex: 1 }}
          numberOfLines={1}
        >
          {STAT_META[stat].ad}
        </PixelText>
        <PixelText font="command" size={kucuk ? 'body' : 'lead'} color={renk}>
          {value}
        </PixelText>
        {delta !== undefined && delta !== 0 && (
          <PixelText font="command" size={kucuk ? 'small' : 'body'} color={delta > 0 ? C.olive : C.rust}>
            {delta > 0 ? `+${delta}` : `${delta}`}
          </PixelText>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 2 }}>
        {Array.from({ length: SEGMENT }, (_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: yukseklik,
              backgroundColor: i < dolu ? renk : C.ink,
              // Son dolu segment sönük: değer tam segmente oturmuyorsa görünsün.
              opacity: i < dolu ? 1 : 0.55,
            }}
          />
        ))}
      </View>
    </View>
  );
}
