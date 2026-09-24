import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { sprite } from '../../art';
import { IZMARIT_DUZ, IZMARIT_EZIK, TAS, YAPRAK_KURU } from '../../art/sahne/avlu';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { Golge, Nefes } from '../../ui/sahne';
import { PanelKabuk } from './ortak';
import { Balon, ZeminParcasi } from './sahneParcalari';

/** Avlu toprağında dağınık küçük şeyler: yer boş bir renk olmasın. */
function YerDetayi() {
  return (
    <>
      <View style={{ position: 'absolute', left: '12%', top: '22%' }}>
        <PixelSprite sprite={YAPRAK_KURU} scale={3} />
      </View>
      <View style={{ position: 'absolute', right: '10%', top: '14%' }}>
        <PixelSprite sprite={TAS} scale={3} />
      </View>
      <View style={{ position: 'absolute', right: '26%', bottom: '14%' }}>
        <PixelSprite sprite={YAPRAK_KURU} scale={2} />
      </View>
    </>
  );
}

/** Sigara bitti, elinde izmarit kaldı. Kolay yol her zaman temiz yol değil. */
export function IzmaritPaneli() {
  const g = useSecili('izmaritKarar');
  return (
    <PanelKabuk baslik="ELİNDE İZMARİT" alt="Sigara bitti" sahne={{ mekan: 'serbest' }}>
      {/* Ayağının dibi: toprak, postal ucu, parmaklarının arasındaki izmarit */}
      <ZeminParcasi tur="toprak" yukseklik={170} u={3} tohum={7}>
        <YerDetayi />
        <View style={{ position: 'absolute', left: '14%', bottom: 18, alignItems: 'center' }}>
          <PixelSprite sprite={sprite('postal')} scale={6} />
          <View style={{ marginTop: -6 }}>
            <Golge genislik={14} u={5} />
          </View>
        </View>
        <View style={{ position: 'absolute', right: '20%', top: 46, alignItems: 'center' }}>
          <PixelSprite sprite={IZMARIT_DUZ} scale={6} />
          {/* Son duman: iki soluk piksel */}
          <View
            style={{
              position: 'absolute',
              right: 2,
              top: -14,
              width: 6,
              height: 6,
              backgroundColor: C.canvasDim,
              opacity: 0.35,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -26,
              width: 6,
              height: 6,
              backgroundColor: C.canvasDim,
              opacity: 0.2,
            }}
          />
        </View>
      </ZeminParcasi>

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
  // İlk adımda izmarit hâlâ yerde; eğilince eline geçiyor.
  const yerde = adim === 0;
  // Özür adımlarında eğiliyorsun: asker bir boy aşağıda.
  const egik = adim === 1 || adim === 2;

  return (
    <PanelKabuk
      baslik="YAKALANDIN"
      alt={`${adim + 1} / ${basamaklar.length}`}
      sahne={{ mekan: 'mintika' }}
    >
      <ZeminParcasi tur="toprak" yukseklik={230} u={3} tohum={11}>
        <YerDetayi />
        {yerde && (
          <View style={{ position: 'absolute', left: '44%', bottom: 26 }}>
            <PixelSprite sprite={IZMARIT_EZIK} scale={5} />
          </View>
        )}
        {/* Sen: izmaritin başında */}
        <View
          style={{
            position: 'absolute',
            left: '10%',
            bottom: 14,
            alignItems: 'center',
            transform: [{ translateY: egik ? 18 : 0 }],
          }}
        >
          <PixelSprite sprite={sprite('asker')} scale={5} />
          <View style={{ marginTop: -5 }}>
            <Golge genislik={12} u={5} />
          </View>
          {!yerde && (
            <View style={{ position: 'absolute', left: -6, top: 74 }}>
              <PixelSprite sprite={IZMARIT_DUZ} scale={2} />
            </View>
          )}
        </View>
        {/* Çavuş: tepende */}
        <View style={{ position: 'absolute', right: '8%', bottom: 14, alignItems: 'center' }}>
          <Nefes u={5}>
            <PixelSprite sprite={sprite('cavus')} scale={5} />
          </Nefes>
          <View style={{ marginTop: -5 }}>
            <Golge genislik={12} u={5} />
          </View>
        </View>
      </ZeminParcasi>

      <View style={{ gap: SP.xs }}>
        <View
          style={{
            alignSelf: 'flex-end',
            backgroundColor: C.ink,
            paddingHorizontal: SP.sm,
            paddingVertical: 2,
          }}
        >
          <PixelText font="command" size="body" color={C.rust}>
            {su.konusan}
          </PixelText>
        </View>
        <Balon metin={su.metin} kuyruk="yok" />
      </View>

      <PixelButton
        label={su.buton}
        onPress={() => (adim + 1 < basamaklar.length ? setAdim(adim + 1) : g.izmaritCezasiBitir())}
      />
    </PanelKabuk>
  );
}
