import React from 'react';
import { View } from 'react-native';
import { C, SP , BORDER } from '../theme';
import { gunGetir } from '../content';
import { blokSonu, kalanSure, saate } from '../engine/zaman';
import { useGame } from '../store/gameStore';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { KislaHaritasi } from './KislaHaritasi';
import { ROL_ADI } from '../content/telefon';

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

      <GelenArama />

      <KislaHaritasi />

      <PixelButton label="Yat, gün bitsin" tur="sessiz" onPress={g.ileri} />
    </View>
  );
}

/**
 * Telefonun çalıyor. Açmak serbest zamandan yiyor, açmamak ilişkiden.
 * Telefonun yoksa kimse seni arayamaz — nöbetçi haber bırakıyor, geri
 * aramak sana kalıyor.
 */
function GelenArama() {
  const g = useGame();
  const kisi = g.gelenArama
    ? g.rehber.find((k) => k.id === g.gelenArama!.kisiId)
    : undefined;

  if (g.gelenArama && kisi) {
    return (
      <View style={{ borderWidth: BORDER, borderColor: C.brass, padding: SP.md, gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.brass}>
          TELEFONUN ÇALIYOR
        </PixelText>
        <PixelText size="lead" color={C.canvas} line="snug">
          {`${kisi.ad} arıyor.`}
        </PixelText>
        <View style={{ flexDirection: 'row', gap: SP.sm }}>
          <View style={{ flex: 1 }}>
            <PixelButton label="Aç" onPress={g.gelenAramayiAc} />
          </View>
          <View style={{ flex: 1 }}>
            <PixelButton label="Şimdi olmaz" tur="sessiz" onPress={g.gelenAramayiGecistir} />
          </View>
        </View>
      </View>
    );
  }

  if (g.bekleyenArama.length) {
    const rol = g.bekleyenArama[0];
    return (
      <View style={{ borderWidth: BORDER, borderColor: C.line, padding: SP.md, gap: SP.xs }}>
        <PixelText font="command" size="body" color={C.canvasDim}>
          NÖBETÇİ ÇAVUŞ
        </PixelText>
        <PixelText size="body" color={C.canvasDim} line="snug">
          {`"Sana telefon gelmiş. ${ROL_ADI[rol]} aramış, ankesörden geri ara."`}
        </PixelText>
      </View>
    );
  }

  return null;
}
