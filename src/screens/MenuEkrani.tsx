import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, SP } from '../theme';
import { SPRITES } from '../art';
import { useGame } from '../store/gameStore';
import { YAZILMIS_GUN_SAYISI } from '../content';
import { BEDAVA_GUN } from '../monetization/entitlements';
import { CentikTakvim } from '../ui/CentikTakvim';
import { PixelButton } from '../ui/PixelButton';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

export function MenuEkrani() {
  const g = useGame();
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
        <PixelButton
          label={devamEdilebilir ? 'Baştan başla' : 'Sevk kâğıdını al'}
          tur={devamEdilebilir ? 'sessiz' : 'ana'}
          onPress={() => void g.yeniOyun()}
        />
      </View>

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
