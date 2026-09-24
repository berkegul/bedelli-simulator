import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { useSecili } from '../store/secici';
import { DukkanListesi } from '../ui/DukkanListesi';
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
      <View
        style={{
          paddingTop: inset.top + SP.md,
          paddingHorizontal: SP.lg,
          paddingBottom: SP.md,
          backgroundColor: C.ink,
          borderBottomWidth: BORDER,
          borderBottomColor: C.line,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
          <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
            ASKERİ MALZEMECİ
          </PixelText>
          <PixelText font="command" size="h3" color={C.brass}>
            {`${g.para} TL`}
          </PixelText>
        </View>
        <PixelText size="micro" color={C.canvasFaint}>
          Bu para 28 gün yetecek. Kantin de aynı cepten.
        </PixelText>
      </View>

      <ScrollView contentContainerStyle={{ padding: SP.lg, gap: SP.lg }}>
        <PixelText size="small" color={C.canvasDim} line="body">
          Sevk kâğıdının arkasında bir liste var. Dükkân sahibi listeyi eline
          alıp "hepsi var" diyor. Ucuzu da var kalitelisi de — hangisini
          aldığını yirmi sekiz gün boyunca hatırlayacaksın.
        </PixelText>

        <DukkanListesi
          dukkan="hazirlik"
          sigaraIciyor={g.profil.sigaraIciyor}
          envanter={g.envanter}
          para={g.para}
          onSatinAl={(t, k) => g.satinAl(t.id, k)}
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
