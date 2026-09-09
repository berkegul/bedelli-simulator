import React from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import {
  KALITE_ADI,
  KALITE_NOTU,
  dukkanKatalogu,
  fiyat,
  type Dukkan,
  type EsyaTanim,
} from '../content/esyalar';
import type { Envanter, Kalite } from '../engine/types';
import { PixelSprite } from './PixelSprite';
import { PixelText } from './PixelText';

const KADEMELER: Kalite[] = ['ekonomik', 'standart', 'kaliteli'];

type Props = {
  dukkan: Dukkan;
  sigaraIciyor: boolean;
  envanter: Envanter;
  para: number;
  onSatinAl: (t: EsyaTanim, kalite: Kalite) => void;
};

export function DukkanListesi({ dukkan, sigaraIciyor, envanter, para, onSatinAl }: Props) {
  const katalog = dukkanKatalogu(dukkan, sigaraIciyor);

  return (
    <View style={{ gap: SP.md }}>
      {katalog.map((t) => {
        const kayit = envanter[t.id];
        const adet = kayit?.adet ?? 0;
        const dolu = t.maxAdet !== undefined && adet >= t.maxAdet;

        return (
          <View
            key={t.id}
            style={{
              borderWidth: BORDER,
              borderColor: adet > 0 ? C.line : C.ink,
              backgroundColor: C.surface,
              padding: SP.md,
              gap: SP.sm,
            }}
          >
            <View style={{ flexDirection: 'row', gap: SP.md, alignItems: 'flex-start' }}>
              <View style={{ opacity: dolu ? 0.5 : 1, paddingTop: 2 }}>
                <PixelSprite sprite={sprite(t.sprite)} scale={3} />
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
                  <PixelText font="bodySemi" size="body" color={C.canvas} style={{ flex: 1 }}>
                    {t.ad}
                  </PixelText>
                  {adet > 0 && (
                    <PixelText font="command" size="body" color={C.olive}>
                      {t.maxAdet === 1 ? 'ALINDI' : `x${adet}`}
                    </PixelText>
                  )}
                </View>

                {t.icerik && (
                  <PixelText size="micro" color={C.brass}>
                    {t.icerik}
                  </PixelText>
                )}
                <PixelText size="micro" color={C.canvasFaint} line="snug">
                  {t.aciklama}
                </PixelText>
                {kayit && t.kademeli && (
                  <PixelText size="micro" color={C.canvasDim}>
                    {`Dolabında: ${KALITE_ADI[kayit.kalite].toLocaleLowerCase('tr-TR')}`}
                  </PixelText>
                )}
              </View>
            </View>

            {t.kademeli ? (
              <View style={{ flexDirection: 'row', gap: SP.xs }}>
                {KADEMELER.map((k) => {
                  const tutar = fiyat(t, k);
                  const alinabilir = !dolu && para >= tutar;
                  return (
                    <Pressable
                      key={k}
                      accessibilityRole="button"
                      accessibilityLabel={`${t.ad}, ${KALITE_ADI[k]}, ${tutar} lira`}
                      accessibilityState={{ disabled: !alinabilir }}
                      disabled={!alinabilir}
                      onPress={() => onSatinAl(t, k)}
                      style={{
                        flex: 1,
                        borderWidth: BORDER,
                        borderColor: C.ink,
                        backgroundColor: alinabilir ? C.surfaceHi : C.bg,
                        paddingVertical: SP.sm,
                        alignItems: 'center',
                        opacity: alinabilir ? 1 : 0.45,
                      }}
                    >
                      <PixelText size="micro" color={alinabilir ? C.canvasDim : C.canvasFaint}>
                        {KALITE_ADI[k]}
                      </PixelText>
                      <PixelText font="command" size="body" color={alinabilir ? C.brass : C.canvasFaint}>
                        {`${tutar}`}
                      </PixelText>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${t.ad} al, ${t.fiyat} lira`}
                accessibilityState={{ disabled: dolu || para < t.fiyat }}
                disabled={dolu || para < t.fiyat}
                onPress={() => onSatinAl(t, 'standart')}
                style={{
                  borderWidth: BORDER,
                  borderColor: C.ink,
                  backgroundColor: !dolu && para >= t.fiyat ? C.surfaceHi : C.bg,
                  paddingVertical: SP.sm,
                  paddingHorizontal: SP.md,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  opacity: !dolu && para >= t.fiyat ? 1 : 0.45,
                }}
              >
                <PixelText font="bodyMed" size="small" color={C.canvasDim}>
                  {dolu ? 'Dolabın dolu' : 'Satın al'}
                </PixelText>
                <PixelText font="command" size="body" color={C.brass}>
                  {`${t.fiyat} TL`}
                </PixelText>
              </Pressable>
            )}
          </View>
        );
      })}

      <PixelText size="micro" color={C.canvasFaint} center style={{ paddingHorizontal: SP.lg }}>
        {KALITE_NOTU.ekonomik}
      </PixelText>
    </View>
  );
}
