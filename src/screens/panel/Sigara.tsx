import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { sprite } from '../../art';
import { arkadas } from '../../content/arkadaslar';
import { useSecili } from '../../store/secici';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { ARKADAS_SPRITE, PanelKabuk } from './ortak';
import { Balon, ZeminParcasi } from './sahneParcalari';
import { Golge, Nefes } from '../../ui/sahne';

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
    <PanelKabuk
      baslik="BİR DAL İSTİYOR"
      alt={`Cebinde ${dal} dal kaldı`}
      sahne={{ mekan: 'serbest' }}
    >
      <View style={{ gap: SP.md }}>
        {/* Karşında duruyor: büyük, gölgeli, nefes alıyor; lafı balonda */}
        <ZeminParcasi tur="toprak" yukseklik={210} u={3} tohum={id.length}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              padding: SP.md,
              gap: SP.sm,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Nefes u={6}>
                <PixelSprite sprite={sprite(ARKADAS_SPRITE[id])} scale={6} />
              </Nefes>
              <View style={{ marginTop: -6 }}>
                <Golge genislik={12} u={6} />
              </View>
              {/* Elinde boş paket */}
              <View
                style={{
                  position: 'absolute',
                  right: -14,
                  bottom: 58,
                  transform: [{ rotate: '-12deg' }],
                }}
              >
                <PixelSprite sprite={sprite('sigara')} scale={3} opacity={0.7} />
              </View>
            </View>
            <View style={{ flex: 1, alignSelf: 'flex-start', gap: SP.xs }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: C.ink,
                  paddingHorizontal: SP.sm,
                  paddingVertical: 2,
                }}
              >
                <PixelText font="command" size="body" color={C.brass}>
                  {kisi.ad.toLocaleUpperCase('tr-TR')}
                </PixelText>
              </View>
              <Balon metin={laf} kuyruk="sol" />
              <PixelText
                size="micro"
                color={C.canvasDim}
                style={{ backgroundColor: C.ink, alignSelf: 'flex-start', paddingHorizontal: 3 }}
              >
                {`${kisi.meslek} · yakınlık ${g.dostluk[id] ?? 0}`}
              </PixelText>
            </View>
          </View>
        </ZeminParcasi>

        {/* Cevabın: senin ağzından çıkan balonlar */}
        <View style={{ gap: SP.sm, alignItems: 'flex-end' }}>
          <Balon
            kuyruk="sag"
            metin={`"Al kardeşim." (${dal} → ${dal - 1} dal)`}
            erisimEtiketi={`Bir dal ver, ${dal} dal kaldı`}
            onPress={() => g.sigaraVer(true)}
          />
          <Balon
            kuyruk="sag"
            metin='"Yok, bende de az kaldı."'
            erisimEtiketi="Yok, bende de az kaldı"
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
