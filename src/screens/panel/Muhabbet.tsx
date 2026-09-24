import React from 'react';
import { View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { arkadas } from '../../content/arkadaslar';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { ARKADAS_SPRITE, PanelKabuk } from './ortak';

export function MuhabbetPaneli() {
  const g = useSecili('aktifDiyalog', 'diyalogSec', 'dostluk');
  const d = g.aktifDiyalog;

  return (
    <PanelKabuk baslik="KOĞUŞ MUHABBETİ">
      {!d ? (
        <PixelText size="lead" color={C.canvasDim} center line="body">
          Koğuşta herkes kendi işinde. Bugünlük muhabbet bu kadar.
        </PixelText>
      ) : (
        <View style={{ gap: SP.lg }}>
          <View style={{ alignItems: 'center', gap: SP.xs }}>
            <PixelSprite sprite={sprite(ARKADAS_SPRITE[d.kim])} scale={4} />
            <PixelText font="command" size="lead" color={C.brass} style={{ marginTop: SP.sm }}>
              {arkadas(d.kim).ad.toLocaleUpperCase('tr-TR')}
            </PixelText>
            <PixelText size="micro" color={C.canvasFaint}>
              {`${arkadas(d.kim).meslek} · yakınlık ${g.dostluk[d.kim] ?? 0}`}
            </PixelText>
          </View>

          <View
            style={{
              borderWidth: BORDER,
              borderColor: C.line,
              backgroundColor: C.surface,
              padding: SP.lg,
            }}
          >
            <PixelText size="lead" color={C.canvas} line="body">
              {d.metin}
            </PixelText>
          </View>

          <View style={{ gap: SP.sm }}>
            {d.secenekler.map((s, i) => (
              <PixelButton key={i} tur="secim" label={s.label} onPress={() => g.diyalogSec(i)} />
            ))}
          </View>
        </View>
      )}
    </PanelKabuk>
  );
}
