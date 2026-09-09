import React from 'react';
import { View } from 'react-native';
import { C, SP } from '../theme';
import { useGame } from '../store/gameStore';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { KislaHaritasi } from './KislaHaritasi';

/** İki saat serbest. Ne yapacağın tamamen sana kalmış. */
export function SerbestSahnesi() {
  const g = useGame();

  return (
    <View style={{ gap: SP.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          SERBEST ZAMAN
        </PixelText>
        <PixelText size="micro" color={C.canvasFaint}>
          19:00 — 21:00
        </PixelText>
      </View>

      <KislaHaritasi />

      <PixelButton label="Yat, gün bitsin" tur="sessiz" onPress={g.ileri} />
    </View>
  );
}
