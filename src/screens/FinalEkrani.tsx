import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, SP } from '../theme';
import { epilog, finalKartlari } from '../content/telefon';
import { telefonDurumuOku } from '../store/gameStore';
import { useSecili } from '../store/secici';
import { Daktilo } from '../ui/Daktilo';
import { DiyalogKutusu } from '../ui/DiyalogKutusu';
import { MekanSeridi } from '../ui/MekanSeridi';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';

/**
 * Nizamiyenin dışı. Koşulu tutan final kartları sırayla okunuyor (kapı,
 * aile, sevgili, kanka...), ardından epilog: oyuncunun yirmi sekiz gün
 * boyunca telefonda söylediklerinden üç cümle, kaç gün önce söylendiğiyle.
 * Durum ekran açılınca bir kez okunuyor; sonrası değişmiyor.
 */
export function FinalEkrani() {
  const g = useSecili('anaMenu', 'karneAc');
  const inset = useSafeAreaInsets();
  const [durum] = useState(telefonDurumuOku);
  const kartlar = useMemo(() => finalKartlari(durum), [durum]);
  const satirlar = useMemo(() => epilog(durum.hafiza), [durum]);
  const [adim, setAdim] = useState(0);
  const [yazildi, setYazildi] = useState(false);

  const kart = kartlar[adim];

  const ileri = () => {
    setYazildi(false);
    setAdim((a) => a + 1);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingBottom: inset.bottom + SP.xl, flexGrow: 1 }}
    >
      <MekanSeridi blokId="d1-nizamiye" saat="11:00" carpan={2} cercevesiz etiketsiz />

      <View style={{ padding: SP.lg, gap: SP.lg, flexGrow: 1 }}>
        {kart ? (
          <>
            <DiyalogKutusu baslik={kart.baslik}>
              <Daktilo
                key={kart.id}
                text={kart.metin}
                size="lead"
                color={C.canvas}
                line="body"
                atla={yazildi}
                onBitti={() => setYazildi(true)}
              />
            </DiyalogKutusu>
            <PixelText size="micro" color={C.canvasFaint} center>
              {`${adim + 1} / ${kartlar.length}`}
            </PixelText>
            <PixelButton
              label={yazildi ? 'Devam' : 'Geç'}
              onPress={yazildi ? ileri : () => setYazildi(true)}
            />
          </>
        ) : (
          <>
            <View style={{ gap: SP.xs, alignItems: 'center' }}>
              <PixelText font="command" size="h2" color={C.brass} tracking={2}>
                SİVİL
              </PixelText>
              <PixelText size="small" color={C.canvasDim} center>
                Yirmi sekiz gün boyunca telefonda söylediklerin.
              </PixelText>
            </View>
            {satirlar.length ? (
              satirlar.map((s) => (
                <View
                  key={`${s.gun}-${s.metin}`}
                  style={{
                    borderLeftWidth: 4,
                    borderLeftColor: C.brass,
                    paddingLeft: SP.md,
                    gap: 2,
                  }}
                >
                  <PixelText size="micro" color={C.canvasFaint}>
                    {`${s.gun}. gün · ${s.gunFarki} gün önce`}
                  </PixelText>
                  <PixelText size="lead" color={C.canvas} line="body">
                    {s.metin}
                  </PixelText>
                </View>
              ))
            ) : (
              <PixelText size="lead" color={C.canvasDim} center line="body">
                Telefonda pek bir şey söylemedin. Anlatacakların kapının bu tarafında.
              </PixelText>
            )}
            <View style={{ gap: SP.sm, marginTop: 'auto' }}>
              <PixelButton label="Ana menü" onPress={g.anaMenu} />
              <PixelButton label="Karneye bak" tur="sessiz" onPress={g.karneAc} />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
