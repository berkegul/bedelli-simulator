import React from 'react';
import { View } from 'react-native';
import { C, SP } from '../theme';
import { gunGetir } from '../content';
import { blokSonu, kalanSure, saate } from '../engine/zaman';
import { useGame } from '../store/gameStore';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { KislaHaritasi } from './KislaHaritasi';

/** İki saat serbest. Ne yapacağın tamamen sana kalmış. */
export function SerbestSahnesi() {
  const g = useGame();
  const blok = gunGetir(g.gun)?.blocks[g.blokIndex];
  // Serbest zaman biten bir kaynak: telefon kuyruğu kırk dakika yiyor,
  // ağacın altında oturmak on beş. Kalanı görmeden karar verilemiyor.
  const kalan = blok ? blokSonu(blok) - g.saat : 0;

  return (
    <View style={{ gap: SP.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          SERBEST ZAMAN
        </PixelText>
        <View style={{ alignItems: 'flex-end' }}>
          <PixelText font="command" size="body" color={C.canvas}>
            {saate(g.saat)}
          </PixelText>
          <PixelText size="micro" color={kalan <= 20 ? C.rust : C.canvasFaint}>
            {blok ? `yat vaktine ${kalanSure(kalan)}` : ''}
          </PixelText>
        </View>
      </View>

      <KislaHaritasi />

      <PixelButton label="Yat, gün bitsin" tur="sessiz" onPress={g.ileri} />
    </View>
  );
}
