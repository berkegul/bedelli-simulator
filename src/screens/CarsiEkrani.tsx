import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { useSecili } from '../store/secici';
import { DukkanListesi } from '../ui/DukkanListesi';
import { MekanSeridi } from '../ui/MekanSeridi';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';

/**
 * Kışla öncesi çarşı. Bütçe tek: burada harcadığın para kantinde kalmıyor.
 * Oyunun ilk gerçek kararı bu ekranda veriliyor.
 */
export function CarsiEkrani() {
  const g = useSecili('carsiyiBitir', 'envanter', 'para', 'profil', 'satinAl');
  const inset = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Dükkânın önü: sabah, tabela, cüzdan */}
      <MekanSeridi blokId="carsi" saat="09:10" etiketsiz>
        <View
          style={{
            position: 'absolute',
            top: inset.top + SP.sm,
            left: SP.md,
            right: SP.md,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View
            style={{
              backgroundColor: C.ink,
              borderWidth: BORDER,
              borderColor: C.brass,
              paddingHorizontal: SP.sm,
              paddingVertical: 2,
            }}
          >
            <PixelText font="command" size="lead" color={C.brass} tracking={1}>
              ASKERİ MALZEMECİ
            </PixelText>
          </View>
          <View
            style={{
              backgroundColor: C.ink,
              borderWidth: BORDER,
              borderColor: C.line,
              paddingHorizontal: SP.sm,
              paddingVertical: 2,
              alignItems: 'flex-end',
            }}
          >
            <PixelText font="command" size="lead" color={C.canvas}>
              {`${g.para} TL`}
            </PixelText>
            <PixelText size="micro" color={C.canvasDim}>
              28 gün bu cepten
            </PixelText>
          </View>
        </View>
      </MekanSeridi>

      <ScrollView contentContainerStyle={{ padding: SP.lg, gap: SP.lg }}>
        <PixelText size="body" color={C.canvasDim} line="body">
          Sevk kâğıdının arkasında bir liste var. Dükkân sahibi listeye bakıp "hepsi var" diyor.
          Ucuzu da var kalitelisi de; hangisini aldığını yirmi sekiz gün boyunca hatırlayacaksın.
        </PixelText>

        <DukkanListesi
          dukkan="hazirlik"
          sigaraIciyor={g.profil.sigaraIciyor}
          envanter={g.envanter}
          para={g.para}
          onSatinAl={(t, k) => g.satinAl(t.id, k)}
          kagit
        />
      </ScrollView>

      <View
        style={{
          padding: SP.lg,
          paddingBottom: inset.bottom + SP.lg,
          backgroundColor: C.ink,
          borderTopWidth: BORDER,
          borderTopColor: C.line,
          gap: SP.sm,
        }}
      >
        <PixelText size="micro" color={C.canvasFaint} center>
          Eksik gittiğin her şeyin bedelini her sabah biraz ödersin.
        </PixelText>
        <PixelButton label="Otobüse bin" onPress={g.carsiyiBitir} />
      </View>
    </View>
  );
}
