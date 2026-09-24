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

  return <KantinRafi katalog={katalog} envanter={envanter} para={para} onSatinAl={onSatinAl} />;
}

/** Raf tahtası: üstü ışık alan kenar, altı gölge. Ürün bunun üstünde duruyor. */
function RafTahtasi() {
  return (
    <View>
      <View style={{ height: 2, backgroundColor: '#8A6238' }} />
      <View style={{ height: 4, backgroundColor: '#6B4A2B' }} />
      <View style={{ height: 2, backgroundColor: '#3E2A18' }} />
      <View style={{ height: 3, backgroundColor: '#000', opacity: 0.35 }} />
    </View>
  );
}

/**
 * Tahtanın altına iple asılmış karton fiyat etiketi. Satın alınabilirse
 * dokunulur; alınan kademenin etiketine "ALINDI" damgası basılır.
 */
function FiyatEtiketi({
  ust,
  tutar,
  alinabilir,
  alindi,
  egim,
  etiket,
  onPress,
}: {
  ust?: string;
  tutar: number;
  alinabilir: boolean;
  alindi?: boolean;
  egim: number;
  etiket: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiket}
      accessibilityState={{ disabled: !alinabilir }}
      disabled={!alinabilir}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: 'center',
        opacity: alinabilir || alindi ? 1 : 0.4,
        transform: [{ rotate: `${egim}deg` }, { translateY: pressed ? 2 : 0 }],
      })}
    >
      {/* İp */}
      <View style={{ width: 2, height: 6, backgroundColor: '#B3A88C' }} />
      <View
        style={{
          alignSelf: 'stretch',
          backgroundColor: C.kagit,
          borderWidth: BORDER,
          borderColor: alindi ? C.rust : C.murekkepSoluk,
          paddingVertical: SP.xs,
          alignItems: 'center',
        }}
      >
        <View
          style={{ position: 'absolute', top: 3, width: 4, height: 4, backgroundColor: '#2E2217' }}
        />
        {ust && (
          <PixelText size="micro" color={C.murekkepSoluk} style={{ marginTop: 4 }}>
            {ust}
          </PixelText>
        )}
        <PixelText
          font="command"
          size="body"
          color={alindi ? C.rust : C.murekkep}
          style={ust ? undefined : { marginTop: 4 }}
        >
          {alindi ? 'ALINDI' : `${tutar} TL`}
        </PixelText>
      </View>
    </Pressable>
  );
}

/**
 * Kantinin rafı: koyu ahşap arka, her ürün kendi tahtasının üstünde büyük,
 * fiyatı tahtaya asılı karton etikette. Eskiden her ürün aynı koyu kutudaydı
 * ve kantin bir form gibi duruyordu.
 */
function KantinRafi({
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
  return (
    <View style={{ gap: SP.md }}>
      <View style={{ borderWidth: BORDER, borderColor: C.ink, backgroundColor: '#2E2217' }}>
        {/* Arka panelin damarı */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '22%',
            width: 1,
            backgroundColor: '#3A2B1D',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '61%',
            width: 1,
            backgroundColor: '#3A2B1D',
          }}
        />

        {katalog.map((t, sira) => {
          const kayit = envanter[t.id];
          const adet = kayit?.adet ?? 0;
          const dolu = t.maxAdet !== undefined && adet >= t.maxAdet;
          const kademeler: Kalite[] = t.kademeli ? KADEMELER : ['standart'];

          return (
            <View key={t.id} style={{ paddingTop: SP.md }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: SP.md,
                  alignItems: 'flex-end',
                  paddingHorizontal: SP.md,
                }}
              >
                <View style={{ opacity: dolu ? 0.55 : 1, alignItems: 'center', minWidth: 52 }}>
                  <PixelSprite sprite={sprite(t.sprite)} scale={4} />
                  {adet > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -8,
                        backgroundColor: C.ink,
                        paddingHorizontal: 3,
                      }}
                    >
                      <PixelText font="command" size="small" color={C.olive}>
                        {t.maxAdet === 1 ? '✓' : `x${adet}`}
                      </PixelText>
                    </View>
                  )}
                </View>

                <View style={{ flex: 1, gap: 2, paddingBottom: 2 }}>
                  <PixelText font="bodySemi" size="body" color={C.canvas}>
                    {t.ad}
                  </PixelText>
                  {t.icerik && (
                    <PixelText size="micro" color={C.brass}>
                      {t.icerik}
                    </PixelText>
                  )}
                  <PixelText size="micro" color={C.canvasDim} line="snug">
                    {t.aciklama}
                  </PixelText>
                  {kayit && t.kademeli && (
                    <PixelText size="micro" color={C.canvasDim}>
                      {`Dolabında: ${KALITE_ADI[kayit.kalite].toLocaleLowerCase('tr-TR')}`}
                    </PixelText>
                  )}
                </View>
              </View>

              <RafTahtasi />

              <View
                style={{
                  flexDirection: 'row',
                  gap: SP.sm,
                  paddingHorizontal: SP.md,
                  paddingBottom: SP.md,
                }}
              >
                {kademeler.map((k, i) => {
                  const tutar = fiyat(t, k);
                  const alinabilir = !dolu && para >= tutar;
                  const bu = t.kademeli ? kayit?.kalite === k : dolu;
                  return (
                    <FiyatEtiketi
                      key={k}
                      ust={t.kademeli ? KALITE_ADI[k] : undefined}
                      tutar={tutar}
                      alinabilir={alinabilir}
                      alindi={bu}
                      egim={((sira + i) % 3) - 1}
                      etiket={
                        t.kademeli
                          ? `${t.ad}, ${KALITE_ADI[k]}, ${tutar} lira`
                          : `${t.ad} al, ${tutar} lira`
                      }
                      onPress={() => onSatinAl(t, k)}
                    />
                  );
                })}
                {!t.kademeli && <View style={{ flex: 1 }} />}
              </View>
            </View>
          );
        })}
      </View>

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
