import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, SP } from '../theme';
import { SPRITES } from '../art';
import { useSecili } from '../store/secici';
import { YAZILMIS_GUN_SAYISI } from '../content';
import { BEDAVA_GUN } from '../monetization/entitlements';
import { CentikTakvim } from '../ui/CentikTakvim';
import { useAyarlar } from '../ayarlar';
import { OnayliButon } from '../ui/OnayliButon';
import { PixelButton } from '../ui/PixelButton';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { GELISTIRME_ACIK } from '../gelistirme/ayar';

export function MenuEkrani() {
  const g = useSecili('bitenGunler', 'blokIndex', 'devamEt', 'gelistirmeAc', 'gun', 'kayitVar', 'profil', 'sahneIndex', 'yeniOyun');
  const inset = useSafeAreaInsets();
  const devamEdilebilir =
    g.kayitVar || g.bitenGunler.length > 0 || g.blokIndex > 0 || g.sahneIndex > 0 || !!g.profil.ad;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{
        paddingTop: inset.top + SP.xxl,
        paddingBottom: inset.bottom + SP.xl,
        paddingHorizontal: SP.xl,
        gap: SP.xl,
      }}
    >
      <View style={{ alignItems: 'center', gap: SP.xs }}>
        <PixelText font="command" size={72} color={C.canvas} tracking={2}>
          BEDELLİ
        </PixelText>
        <PixelText font="command" size="h2" color={C.brass} tracking={6}>
          SİMÜLATÖR
        </PixelText>
        <PixelText size="small" color={C.canvasFaint} center style={{ marginTop: SP.sm }}>
          28 gün. Her gün 05:30’da başlar.
        </PixelText>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: SP.md }}>
        <PixelSprite sprite={SPRITES.kisla} scale={8} />
      </View>

      <View style={{ gap: SP.sm }}>
        {devamEdilebilir && <PixelButton label="Devam et" onPress={g.devamEt} />}
        {devamEdilebilir ? (
          <OnayliButon
            label="Baştan başla"
            onayLabel={`${g.gun}. gündeki kayıt silinecek. Emin misin?`}
            onPress={() => void g.yeniOyun()}
          />
        ) : (
          <PixelButton label="Sevk kâğıdını al" onPress={() => void g.yeniOyun()} />
        )}
        <PixelButton label="Ayarlar" tur="sessiz" onPress={useAyarlar.getState().ac} />
      </View>

      {GELISTIRME_ACIK && (
        <View style={{ gap: SP.xs }}>
          <PixelButton label="Geliştirme kontrol alanı" tur="sessiz" onPress={g.gelistirmeAc} />
          <PixelText size="micro" color={C.canvasFaint} center>
            Bütün mekanizmalar tek tek · yayın derlemesinde görünmez
          </PixelText>
        </View>
      )}

      <View style={{ gap: SP.md, alignItems: 'center' }}>
        <CentikTakvim
          bitenGunler={g.bitenGunler}
          aktifGun={g.gun}
          acikGunSayisi={Math.min(BEDAVA_GUN, YAZILMIS_GUN_SAYISI)}
        />
      </View>
    </ScrollView>
  );
}
