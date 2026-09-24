import React, { useState } from 'react';
import { View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { PanelKabuk } from './ortak';

/** Sigara bitti, elinde izmarit kaldı. Kolay yol her zaman temiz yol değil. */
export function IzmaritPaneli() {
  const g = useSecili('izmaritKarar');
  return (
    <PanelKabuk baslik="ELİNDE İZMARİT" alt="Sigara bitti">
      <View style={{ alignItems: 'center', paddingVertical: SP.md }}>
        <PixelSprite sprite={sprite('sigara')} scale={4} opacity={0.6} />
      </View>

      <PixelText size="lead" color={C.canvas} line="body">
        Son nefesi çektin. Elinde sönmüş bir izmarit var ve etrafta çöp kutusu görünmüyor.
      </PixelText>

      <View style={{ gap: SP.sm }}>
        <PixelButton
          tur="secim"
          label="Yere at, ayağınla ez"
          onPress={() => g.izmaritKarar(true)}
        />
        <PixelButton tur="secim" label="Söndür, cebine koy" onPress={() => g.izmaritKarar(false)} />
      </View>

      <PixelText size="micro" color={C.canvasFaint} center line="snug">
        Yere atmak hızlı. Ama avluda devriye var ve her zaman görmüyor değil.
      </PixelText>
    </PanelKabuk>
  );
}

/** Yakalandın: izmariti topla ve yerden özür dile. */
export function IzmaritCezasiPaneli() {
  const g = useSecili('izmaritCezasiBitir');
  const [adim, setAdim] = useState(0);

  const basamaklar = [
    {
      konusan: 'ÇAVUŞ KAYA',
      metin:
        '"Dur bakalım. O attığın ne? Yerdeki şey senin mi değil mi?" Arkanda duruyor ve ne zamandır orada olduğunu bilmiyorsun.',
      buton: 'Eğil, izmariti al',
    },
    {
      konusan: 'ÇAVUŞ KAYA',
      metin:
        '"Aldın. Şimdi o yere bakacaksın. Kirlettiğin yer orası. Yerden özür dileyeceksin, yüksek sesle, bütün bölük duyacak."',
      buton: '"Özür dilerim."',
    },
    {
      konusan: 'ÇAVUŞ KAYA',
      metin: '"Duymadım. Bir daha, daha yüksek."',
      buton: '"ÖZÜR DİLERİM!"',
    },
    {
      konusan: 'ÇAVUŞ KAYA',
      metin:
        '"Tamam. Kalk. Bir daha bu avluda yerde izmarit görmeyeceğim — seninkini de başkasınınkini de."',
      buton: 'Doğrul, sıraya dön',
    },
  ];

  const su = basamaklar[adim];

  return (
    <PanelKabuk baslik="YAKALANDIN" alt={`${adim + 1} / ${basamaklar.length}`}>
      <View style={{ alignItems: 'center', gap: SP.sm }}>
        <PixelSprite sprite={sprite('cavus')} scale={4} />
      </View>

      <View
        style={{
          borderWidth: BORDER,
          borderColor: C.rust,
          backgroundColor: C.surface,
          padding: SP.lg,
          gap: SP.sm,
        }}
      >
        <PixelText font="command" size="lead" color={C.rust}>
          {su.konusan}
        </PixelText>
        <PixelText size="lead" color={C.canvas} line="body">
          {su.metin}
        </PixelText>
      </View>

      <PixelButton
        label={su.buton}
        onPress={() => (adim + 1 < basamaklar.length ? setAdim(adim + 1) : g.izmaritCezasiBitir())}
      />
    </PanelKabuk>
  );
}
