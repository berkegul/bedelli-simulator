import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { ROL_ADI, TUM_GORUSMELER, secenekleriHazirla } from '../../content/telefon';
import { telefonDurumuOku } from '../../store/gameStore';
import { useSecili } from '../../store/secici';
import { PixelText } from '../../ui/PixelText';
import { Nefes, Sahne } from '../../ui/sahne';
import { Siddet, titret } from '../../ui/haptik';
import { sesCal } from '../../ses';
import { PanelKabuk } from './ortak';
import { AskerAhize, HatCizirtisi, KarsiTaraf, LcdKutu } from './ankesorCizim';

/**
 * Görüşme: tek kart değil, biriken bir transkript.
 * Söylenen her şey ekranda kalıyor — uzun bir konuşmanın uzun hissettirmesi
 * ve geriye dönüp "ne demiştim" diye bakabilmek için. Etkiler konuşma
 * boyunca gizli birikiyor, kapanışta bir kere işleniyor.
 *
 * Üstte hattın iki ucu: ahizeyi kulağına dayamış sen, arada hat cızırtısı,
 * öbür uçta konuşanın silueti. Ankesörde köşede söz hakkı sayacı.
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
      {/* Hattın iki ucu */}
      <View style={{ marginHorizontal: -SP.lg, marginTop: -SP.lg }}>
        <Sahne
          yukseklik={144}
          u={3}
          zemin={gorusme.ankesor ? 'beton' : 'karo'}
          zeminOrani={0.12}
          duvar={gorusme.ankesor ? 'sac' : 'badana'}
          losluk={gorusme.kapanis ? 0.3 : 0.12}
          lambalar={[{ x: 22, y: 6, yaricap: 20 }]}
          tohum={23}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingHorizontal: SP.lg,
            }}
          >
            <Nefes u={4}>
              <AskerAhize u={4} />
            </Nefes>
            <View
              style={{
                alignSelf: 'center',
                paddingBottom: SP.lg,
                opacity: gorusme.kapanis ? 0.25 : 1,
              }}
            >
              <HatCizirtisi u={3} kesik={gorusme.ankesor} />
            </View>
            <View style={{ alignItems: 'center', gap: 2, paddingBottom: SP.sm }}>
              {/* Uzaktaki: soluk çerçevede, hattın öbür ucunda */}
              <View
                style={{
                  borderWidth: 2,
                  borderColor: C.line,
                  backgroundColor: '#1F1D15',
                  padding: 3,
                  opacity: gorusme.kapanis ? 0.5 : 1,
                }}
              >
                <KarsiTaraf rol={gorusme.rol} u={4} />
              </View>
              <PixelText size="micro" color={C.canvasDim}>
                {ROL_ADI[gorusme.rol]}
              </PixelText>
            </View>
          </View>
          <View style={{ position: 'absolute', top: SP.sm, right: SP.sm }}>
            {gorusme.ankesor ? (
              <LcdKutu baslik="SÖZ HAKKI" deger={String(gorusme.kalanRaunt).padStart(2, '0')} />
            ) : (
              <LcdKutu baslik="HAT" deger="AÇIK" />
            )}
          </View>
        </Sahne>
      </View>

      <PixelText size="micro" color={C.canvasFaint} center line="snug">
        {gorusme.ankesor
          ? `Arkanda kuyruk var · ${gorusme.kalanRaunt} söz hakkın kaldı`
          : 'Hat açık · acele ettiren yok'}
      </PixelText>

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
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: C.line,
            borderStyle: 'dashed',
            paddingVertical: SP.md,
            gap: SP.xs,
            alignItems: 'center',
          }}
        >
          <PixelText font="command" size="body" color={C.brass} tracking={2}>
            HAT KAPANDI
          </PixelText>
          <PixelText size="lead" color={C.canvasDim} center line="body">
            {gorusme.kapanis}
          </PixelText>
        </View>
      ) : (
        <View style={{ gap: SP.sm }}>
          <PixelText size="micro" color={C.canvasFaint} style={{ textAlign: 'right' }}>
            NE DİYECEKSİN
          </PixelText>
          {secenekler.map((sec, i) => (
            <Pressable
              key={sec.id}
              accessibilityRole="button"
              accessibilityLabel={sec.label}
              hitSlop={4}
              onPressIn={() => {
                titret(Siddet.Light);
                sesCal('tik');
              }}
              onPress={() => g.gorusmeCevapla(i)}
              style={({ pressed }) => ({
                alignSelf: 'flex-end',
                maxWidth: '92%',
                backgroundColor: pressed ? C.kagitCizgi : C.kagit,
                borderWidth: BORDER,
                borderColor: C.ink,
                paddingVertical: SP.sm,
                paddingHorizontal: SP.md,
                transform: [{ translateY: pressed ? 2 : 0 }],
              })}
            >
              <PixelText size="body" color={C.murekkep} line="snug">
                {sec.label}
              </PixelText>
              {/* Balonun kuyruğu: sağ alttan sana doğru */}
              <View
                style={{
                  position: 'absolute',
                  right: SP.md,
                  bottom: -6,
                  width: 6,
                  height: 6,
                  backgroundColor: C.kagit,
                  borderRightWidth: BORDER,
                  borderBottomWidth: BORDER,
                  borderColor: C.ink,
                }}
              />
            </Pressable>
          ))}
        </View>
      )}
    </PanelKabuk>
  );
}

/**
 * Transkript satırı, konuşma balonu dilinde: karşı taraf solda koyu balon,
 * sen sağda kâğıt balon, anlatıcı balonsuz ve soluk.
 */
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
        <View
          style={{
            backgroundColor: '#BDB293',
            borderWidth: BORDER,
            borderColor: C.ink,
            paddingVertical: SP.xs,
            paddingHorizontal: SP.md,
            opacity: 0.85,
          }}
        >
          <PixelText size="body" color={C.murekkep} line="snug">
            {satir.metin}
          </PixelText>
        </View>
      </View>
    );
  }

  // Anlatıcı: adsız, tırnaksız, kenarlıksız. Sahnenin kendi sesi.
  if (!satir.kim) {
    return (
      <PixelText size="body" color={C.canvasFaint} center line="body">
        {satir.metin}
      </PixelText>
    );
  }

  return (
    <View style={{ paddingRight: SP.xl, gap: 2 }}>
      <PixelText font="command" size="small" color={C.brass}>
        {satir.kim.toLocaleUpperCase('tr-TR')}
      </PixelText>
      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: sonuncu ? C.surfaceHi : C.surface,
          borderWidth: BORDER,
          borderColor: sonuncu ? C.line : C.ink,
          paddingVertical: SP.sm,
          paddingHorizontal: SP.md,
        }}
      >
        <PixelText size="lead" color={sonuncu ? C.canvas : C.canvasDim} line="body">
          {satir.metin}
        </PixelText>
        {/* Balonun kuyruğu: sol üstten konuşana doğru */}
        <View
          style={{
            position: 'absolute',
            left: SP.md,
            top: -6,
            width: 6,
            height: 6,
            backgroundColor: sonuncu ? C.surfaceHi : C.surface,
            borderLeftWidth: BORDER,
            borderTopWidth: BORDER,
            borderColor: sonuncu ? C.line : C.ink,
          }}
        />
      </View>
    </View>
  );
}
