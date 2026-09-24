import React, { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { C, SP } from '../../theme';
import { sprite } from '../../art';
import { ROL_ADI, TUM_GORUSMELER, secenekleriHazirla } from '../../content/telefon';
import { telefonDurumuOku } from '../../store/gameStore';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { sesCal } from '../../ses';
import { PanelKabuk } from './ortak';

/**
 * Görüşme: tek kart değil, biriken bir transkript.
 * Söylenen her şey ekranda kalıyor — uzun bir konuşmanın uzun hissettirmesi
 * ve geriye dönüp "ne demiştim" diye bakabilmek için. Etkiler konuşma
 * boyunca gizli birikiyor, kapanışta bir kere işleniyor.
 */
export function GorusmePaneli() {
  const g = useSecili('aktifGorusme', 'gorusmeCevapla', 'gorusmeKapat', 'rehber');
  const gorusme = g.aktifGorusme;
  // Hat açılışı: ankesörde kart düşüyor, kendi telefonunda zil çalıyor.
  const ankesor = gorusme?.ankesor;
  useEffect(() => {
    sesCal(ankesor ? 'kontor' : 'telefon');
  }, [ankesor]);
  const kaydirma = useRef<ScrollView>(null);

  if (!gorusme) return null;
  const kisi = g.rehber.find((k) => k.id === gorusme.kisiId);
  if (!kisi) return null;

  const veri = TUM_GORUSMELER.find((x) => x.id === gorusme.gorusmeId);
  const replik = veri?.replikler[gorusme.replikId];
  const durum = telefonDurumuOku();
  const secenekler =
    !gorusme.kapanis && veri && replik
      ? secenekleriHazirla(replik, durum, gorusme.rol, gorusme.ankesor)
      : [];

  const kaynak = gorusme.gelen ? 'seni aradı' : gorusme.ankesor ? 'ankesörden' : 'cep telefonundan';

  return (
    <PanelKabuk
      baslik={kisi.ad.toLocaleUpperCase('tr-TR')}
      alt={`${ROL_ADI[gorusme.rol]} · ${kaynak}`}
      kapat={g.gorusmeKapat}
      kapatLabel={gorusme.kapanis ? 'Kapat' : 'Telefonu kapat'}
    >
      <View style={{ alignItems: 'center', gap: SP.xs }}>
        <PixelSprite sprite={sprite(gorusme.ankesor ? 'ankesor' : 'telefon')} scale={3} />
        <PixelText size="micro" color={C.canvasFaint} center line="snug">
          {gorusme.ankesor
            ? `Arkanda kuyruk var · ${gorusme.kalanRaunt} söz hakkın kaldı`
            : 'Hat açık · acele ettiren yok'}
        </PixelText>
      </View>

      <ScrollView
        ref={kaydirma}
        style={{ maxHeight: 380 }}
        contentContainerStyle={{ gap: SP.md }}
        onContentSizeChange={() => kaydirma.current?.scrollToEnd({ animated: true })}
      >
        {gorusme.gecmis.map((satir, i) => (
          <TranskriptSatiri key={i} satir={satir} sonuncu={i === gorusme.gecmis.length - 1} />
        ))}
      </ScrollView>

      {gorusme.kapanis ? (
        <View
          style={{
            borderLeftWidth: 4,
            borderLeftColor: C.brass,
            paddingLeft: SP.lg,
            gap: SP.xs,
          }}
        >
          <PixelText font="command" size="body" color={C.brass}>
            KAPANIŞ
          </PixelText>
          <PixelText size="lead" color={C.canvasDim} line="body">
            {gorusme.kapanis}
          </PixelText>
        </View>
      ) : (
        <View style={{ gap: SP.sm }}>
          {secenekler.map((sec, i) => (
            <PixelButton
              key={sec.id}
              tur="secim"
              label={sec.label}
              onPress={() => g.gorusmeCevapla(i)}
            />
          ))}
        </View>
      )}
    </PanelKabuk>
  );
}

/** Transkript satırı: karşı taraf solda ve parlak, sen sağda ve sönük. */
function TranskriptSatiri({
  satir,
  sonuncu,
}: {
  satir: { kim: string; metin: string; ben?: boolean };
  sonuncu: boolean;
}) {
  if (satir.ben) {
    return (
      <View style={{ alignItems: 'flex-end', paddingLeft: SP.xxl }}>
        <PixelText size="body" color={C.canvasDim} line="snug" style={{ textAlign: 'right' }}>
          {`— ${satir.metin}`}
        </PixelText>
      </View>
    );
  }

  // Anlatıcı: adsız, tırnaksız, kenarlıksız. Sahnenin kendi sesi.
  if (!satir.kim) {
    return (
      <PixelText size="body" color={C.canvasFaint} line="body">
        {satir.metin}
      </PixelText>
    );
  }

  return (
    <View style={{ gap: 2, paddingRight: SP.xl }}>
      <PixelText font="command" size="body" color={C.brass}>
        {satir.kim.toLocaleUpperCase('tr-TR')}
      </PixelText>
      <PixelText size="lead" color={sonuncu ? C.canvas : C.canvasDim} line="body">
        {satir.metin}
      </PixelText>
    </View>
  );
}
