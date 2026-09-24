import React, { useState } from 'react';
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
  /** Çarşıda: sevk kâğıdının arkasındaki alışveriş listesi. */
  kagit?: boolean;
};

export function DukkanListesi({ dukkan, sigaraIciyor, envanter, para, onSatinAl, kagit }: Props) {
  const katalog = dukkanKatalogu(dukkan, sigaraIciyor);
  if (kagit) {
    return (
      <AlisverisListesi katalog={katalog} envanter={envanter} para={para} onSatinAl={onSatinAl} />
    );
  }

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
                      <PixelText
                        font="command"
                        size="body"
                        color={alinabilir ? C.brass : C.canvasFaint}
                      >
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

/**
 * Sevk kâğıdının arkasındaki liste. Her kalem bir satır: alınanın kutusu
 * işaretli, üstünde hangi kalitede alındığı. Uzun açıklama katlı; satıra
 * dokununca açılıyor. Eskiden her kalemin açıklaması, içeriği ve üç fiyat
 * düğmesi aynı anda açıktı ve ekran bir katalog gibi kalabalıktı.
 */
function AlisverisListesi({
  katalog,
  envanter,
  para,
  onSatinAl,
}: {
  katalog: EsyaTanim[];
  envanter: Envanter;
  para: number;
  onSatinAl: (t: EsyaTanim, kalite: Kalite) => void;
}) {
  const [acik, setAcik] = useState<string | null>(null);

  return (
    <View
      style={{
        backgroundColor: C.kagit,
        borderWidth: BORDER,
        borderColor: C.ink,
        padding: SP.lg,
        gap: SP.xs,
      }}
    >
      <View
        style={{
          borderBottomWidth: BORDER,
          borderColor: C.murekkep,
          paddingBottom: 2,
          marginBottom: SP.sm,
        }}
      >
        <PixelText font="command" size="body" color={C.murekkep} tracking={1}>
          İHTİYAÇ LİSTESİ
        </PixelText>
      </View>

      {katalog.map((t) => {
        const kayit = envanter[t.id];
        const adet = kayit?.adet ?? 0;
        const dolu = t.maxAdet !== undefined && adet >= t.maxAdet;
        const alindi = adet > 0;
        const acilmis = acik === t.id;
        const kademeler: Kalite[] = t.kademeli ? KADEMELER : ['standart'];

        return (
          <View
            key={t.id}
            style={{
              borderBottomWidth: 1,
              borderColor: C.kagitCizgi,
              paddingVertical: SP.sm,
              gap: SP.sm,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: acilmis }}
              accessibilityLabel={`${t.ad}${alindi ? ', alındı' : ''}`}
              onPress={() => setAcik(acilmis ? null : t.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: SP.sm }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: BORDER,
                  borderColor: C.murekkep,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {alindi && (
                  <PixelText font="command" size="body" color={C.rust}>
                    X
                  </PixelText>
                )}
              </View>
              <PixelSprite sprite={sprite(t.sprite)} scale={2} />
              <View style={{ flex: 1 }}>
                <PixelText font="bodySemi" size="body" color={C.murekkep}>
                  {t.ad}
                </PixelText>
                {t.icerik && (
                  <PixelText
                    size="small"
                    color={C.murekkepSoluk}
                    numberOfLines={acilmis ? undefined : 1}
                  >
                    {t.icerik}
                  </PixelText>
                )}
              </View>
              {alindi && (
                <PixelText font="command" size="body" color={C.rust}>
                  {t.kademeli && kayit
                    ? KALITE_ADI[kayit.kalite].toLocaleUpperCase('tr-TR')
                    : `x${adet}`}
                </PixelText>
              )}
              <PixelText font="command" size="body" color={C.murekkepSoluk}>
                {acilmis ? '−' : '+'}
              </PixelText>
            </Pressable>

            {acilmis && (
              <PixelText size="small" color={C.murekkepSoluk} line="snug">
                {t.aciklama}
              </PixelText>
            )}

            <View style={{ flexDirection: 'row', gap: SP.xs }}>
              {kademeler.map((k) => {
                const tutar = fiyat(t, k);
                const bu = t.kademeli && kayit?.kalite === k;
                const alinabilir = !dolu && para >= tutar;
                return (
                  <Pressable
                    key={k}
                    accessibilityRole="button"
                    accessibilityLabel={`${t.ad}, ${t.kademeli ? KALITE_ADI[k] + ', ' : ''}${tutar} lira`}
                    accessibilityState={{ disabled: !alinabilir, selected: bu }}
                    disabled={!alinabilir}
                    onPress={() => onSatinAl(t, k)}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      gap: SP.xs,
                      borderWidth: BORDER,
                      borderColor: bu ? C.rust : C.murekkepSoluk,
                      backgroundColor: bu ? '#E9DFC2' : 'transparent',
                      paddingVertical: SP.xs,
                      opacity: alinabilir || bu ? 1 : 0.35,
                    }}
                  >
                    {t.kademeli && (
                      <PixelText size="small" color={C.murekkepSoluk}>
                        {KALITE_ADI[k]}
                      </PixelText>
                    )}
                    <PixelText font="command" size="body" color={bu ? C.rust : C.murekkep}>
                      {`${tutar}`}
                    </PixelText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}

      <PixelText size="small" color={C.murekkepSoluk} center style={{ marginTop: SP.sm }}>
        {KALITE_NOTU.ekonomik}
      </PixelText>
    </View>
  );
}
