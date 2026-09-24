import React, { useEffect, useState } from 'react';
import { Animated, Easing, useWindowDimensions, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { arkadas, oturmaAlanindakiler } from '../../content/arkadaslar';
import type { ArkadasId } from '../../engine/types';
import { saate } from '../../engine/zaman';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { IsikHavuzu, Nefes, Sahne } from '../../ui/sahne';
import { useHareketAzalt } from '../../ui/useHareketAzalt';
import { PanelKabuk } from './ortak';

const OTURAN_SPRITE: Record<ArkadasId, 'oturanEmre' | 'oturanTolga' | 'oturanSerkan'> = {
  emre: 'oturanEmre',
  tolga: 'oturanTolga',
  serkan: 'oturanSerkan',
};

const U = 3;
const YUKSEKLIK = 240;
const ZEMIN_ORANI = 0.34;
/** Çimin başladığı yükseklik (nokta). */
const ZEMIN_Y = Math.round(YUKSEKLIK * (1 - ZEMIN_ORANI));

/**
 * Sigara dumanı: üç piksel yükselip soluyor, sırayla. Hareket azaltmada
 * tek soluk piksel duruyor.
 */
function Duman({ gecikme = 0 }: { gecikme?: number }) {
  const azalt = useHareketAzalt();
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (azalt) return;
    const d = Animated.loop(
      Animated.sequence([
        Animated.delay(gecikme),
        Animated.timing(t, {
          toValue: 1,
          duration: 2400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    d.start();
    return () => d.stop();
  }, [azalt, gecikme, t]);

  if (azalt) {
    return <View style={{ width: U, height: U, backgroundColor: '#C9C3B0', opacity: 0.4 }} />;
  }
  return (
    <View pointerEvents="none" style={{ width: 4 * U, height: 12 * U }}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: (i % 2) * U,
            bottom: 0,
            width: U,
            height: U,
            backgroundColor: '#C9C3B0',
            opacity: t.interpolate({
              inputRange: [0, 0.15 + i * 0.1, 1],
              outputRange: [0, 0.6, 0],
            }),
            transform: [
              {
                translateY: t.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -(8 + i * 2) * U],
                }),
              },
              {
                translateX: t.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, (i - 1) * U, (i % 2 ? 2 : -1) * U],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

/** Ağaç altı, bank, çim. Oturanlar nefes alıyor, içenlerin dumanı yükseliyor. */
function OturmaSahnesi({
  oturanlar,
  sen,
  senIciyor,
  saat,
}: {
  oturanlar: ArkadasId[];
  sen: boolean;
  senIciyor: boolean;
  saat: string;
}) {
  const { width } = useWindowDimensions();
  const [en, setEn] = useState(Math.min(width, 480) - 2 * SP.lg);
  const aksam = Number(saat.split(':')[0]) >= 17;

  // Bank ortada, 20x12 sprite 6 kat: 120x72.
  const bankW = 20 * 6;
  const bankX = Math.round(en * 0.52 - bankW / 2);
  const bankUst = ZEMIN_Y + 34 - 12 * 6;
  const kisiler: { key: string; sprite: ReturnType<typeof sprite>; duman: boolean }[] = [
    ...oturanlar.map((id) => ({
      key: id,
      sprite: sprite(OTURAN_SPRITE[id]),
      duman: arkadas(id).sigaraIcer,
    })),
    ...(sen ? [{ key: 'sen', sprite: sprite('oturanAsker'), duman: senIciyor }] : []),
  ];
  const aralik = kisiler.length > 2 ? 36 : 44;
  const kisiX0 = bankX + bankW / 2 - ((kisiler.length - 1) * aralik) / 2 - 24;

  return (
    <View
      onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
      style={{ borderWidth: BORDER, borderColor: C.ink, overflow: 'hidden' }}
    >
      <Sahne yukseklik={YUKSEKLIK} u={U} zemin="cim" zeminOrani={ZEMIN_ORANI} saat={saat} tohum={7}>
        {/* Ağacın yere düşen gölgesi, bankın üstüne kadar */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: Math.round(en * 0.02),
            top: ZEMIN_Y + 8 * U,
            width: Math.round(en * 0.62),
            height: 9 * U,
            backgroundColor: '#000',
            opacity: 0.22,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: Math.round(en * 0.06),
            top: ZEMIN_Y + 7 * U,
            width: Math.round(en * 0.5),
            height: U,
            backgroundColor: '#000',
            opacity: 0.18,
          }}
        />
        {/* Ağaç: 12x14, 7 kat */}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 4, top: ZEMIN_Y + 20 - 14 * 7 }}
        >
          <PixelSprite sprite={sprite('agac')} scale={7} />
        </View>
        {aksam && (
          <IsikHavuzu x={en * 0.78} y={ZEMIN_Y - 10} yaricap={46} u={U} renk="#F2A65A" guc={0.2} />
        )}
        {/* Bank */}
        <View pointerEvents="none" style={{ position: 'absolute', left: bankX, top: bankUst }}>
          <PixelSprite sprite={sprite('bank')} scale={6} />
        </View>
        {/* Oturanlar: bankın oturağına */}
        {kisiler.map((k, i) => (
          <View
            key={k.key}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: kisiX0 + i * aralik,
              top: bankUst - 16 * 3 + 30,
            }}
          >
            <Nefes u={U} gecikme={i * 330}>
              <PixelSprite sprite={k.sprite} scale={3} />
            </Nefes>
            {k.duman && (
              <View style={{ position: 'absolute', left: 30, top: -30 }}>
                <Duman gecikme={i * 700} />
              </View>
            )}
          </View>
        ))}
      </Sahne>
    </View>
  );
}

/**
 * Avlunun kenarındaki oturma alanı. Ağacın altında bank var, akşamları
 * birileri orada oturuyor. Oturmak zorunda değilsin — ayakta durup
 * konuşabilir ya da hiç girmeden geçebilirsin.
 */
export function OturmaAlaniPaneli() {
  const g = useSecili(
    'arkadasaGit',
    'bugunDinlenildi',
    'envanter',
    'golgedeDinlen',
    'gun',
    'profil',
    'saat',
    'sigaraIc',
  );
  const oturanlar = oturmaAlanindakiler(g.gun);
  const dal = g.envanter.sigara?.adet ?? 0;

  return (
    <PanelKabuk
      baslik="OTURMA ALANI"
      alt={g.bugunDinlenildi ? 'Bugün bir kere oturdun' : 'Ağacın altı, bank ve gölge'}
    >
      <OturmaSahnesi
        oturanlar={oturanlar}
        sen={g.bugunDinlenildi}
        senIciyor={g.profil.sigaraIciyor && g.bugunDinlenildi}
        saat={saate(g.saat)}
      />

      <PixelText size="small" color={C.canvasDim} line="body">
        {oturanlar.length
          ? `Bankta ${oturanlar.map((id) => arkadas(id).ad).join(' ve ')} oturuyor. Yer var.`
          : 'Bank boş. Akşam serinliği ve ağacın gölgesi.'}
      </PixelText>

      <View style={{ gap: SP.sm }}>
        <PixelButton
          tur="secim"
          label={g.bugunDinlenildi ? 'Biraz daha otur' : 'Otur, postalları çıkar'}
          onPress={g.golgedeDinlen}
        />

        {oturanlar.map((id) => (
          <PixelButton
            key={id}
            tur="secim"
            label={`${arkadas(id).ad} ile konuş`}
            onPress={() => g.arkadasaGit(id)}
          />
        ))}

        {g.profil.sigaraIciyor && (
          <PixelButton
            tur="secim"
            label={dal > 0 ? `Bir sigara yak (${dal} dal)` : 'Sigaran bitti'}
            disabled={dal <= 0}
            onPress={g.sigaraIc}
          />
        )}
      </View>

      <PixelText size="micro" color={C.canvasFaint} center line="snug">
        Oturmak günde bir kez dinlendirir. Konuşmanın sayısı yoktur.
      </PixelText>
    </PanelKabuk>
  );
}
