import React, { useState } from 'react';
import { View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { arkadas } from '../../content/arkadaslar';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { ARKADAS_SPRITE, PanelKabuk } from './ortak';

export function SigaraIstegiPaneli() {
  const g = useSecili('aktifIstek', 'dostluk', 'envanter', 'sigaraVer');
  // Hangi lafla istediği panel açılınca bir kez seçiliyor; eskiden her
  // yeniden çizimde başka bir cümleye dönebiliyordu.
  const [zar] = useState(() => Math.random());
  const id = g.aktifIstek;
  if (!id) return null;
  const kisi = arkadas(id);
  const dal = g.envanter.sigara?.adet ?? 0;
  const laf = kisi.sigaraLafi?.[Math.floor(zar * kisi.sigaraLafi.length)] ?? '"Bir dal var mı?"';

  return (
    <PanelKabuk baslik="BİR DAL İSTİYOR" alt={`Cebinde ${dal} dal kaldı`}>
      <View style={{ gap: SP.lg }}>
        <View style={{ alignItems: 'center', gap: SP.xs }}>
          <PixelSprite sprite={sprite(ARKADAS_SPRITE[id])} scale={4} />
          <PixelText font="command" size="lead" color={C.brass} style={{ marginTop: SP.sm }}>
            {kisi.ad.toLocaleUpperCase('tr-TR')}
          </PixelText>
          <PixelText size="micro" color={C.canvasFaint}>
            {`${kisi.meslek} · yakınlık ${g.dostluk[id] ?? 0}`}
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
            {laf}
          </PixelText>
        </View>

        <View style={{ gap: SP.sm }}>
          <PixelButton
            tur="secim"
            label={`Bir dal ver (${dal} → ${dal - 1})`}
            onPress={() => g.sigaraVer(true)}
          />
          <PixelButton
            tur="secim"
            label="Yok, bende de az kaldı"
            onPress={() => g.sigaraVer(false)}
          />
        </View>

        <PixelText size="micro" color={C.canvasFaint} center line="snug">
          Paket 20 dal. Burada dal dağıtmak parayla değil, arkadaşlıkla ödenir.
        </PixelText>
      </View>
    </PanelKabuk>
  );
}
