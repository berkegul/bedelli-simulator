import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, SP } from '../theme';
import { SPRITES } from '../art';
import { YAZILMIS_GUN_SAYISI } from '../content';
import { useGame } from '../store/gameStore';
import { CentikTakvim } from '../ui/CentikTakvim';
import { PixelButton } from '../ui/PixelButton';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

export function IcerikSonuEkrani() {
  const g = useGame();
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.bg,
        paddingTop: inset.top + SP.xl,
        paddingBottom: inset.bottom + SP.xl,
        paddingHorizontal: SP.xl,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ alignItems: 'center', gap: SP.md, marginTop: SP.xxl }}>
        <PixelSprite sprite={SPRITES.duduk} scale={6} />
        <PixelText font="command" size="h2" color={C.brass} center tracking={1} style={{ marginTop: SP.lg }}>
          BURAYA KADAR YAZILDI
        </PixelText>
        <PixelText size="lead" color={C.canvasDim} center line="loose">
          {`${YAZILMIS_GUN_SAYISI} gün oynanabilir durumda. Kalan günler aynı yapıya eklenecek: içerik dosyası yaz, motor gerisini yapar.`}
        </PixelText>
      </View>

      <CentikTakvim bitenGunler={g.bitenGunler} aktifGun={g.gun} acikGunSayisi={YAZILMIS_GUN_SAYISI} />

      <PixelButton label="Ana menü" onPress={g.anaMenu} />
    </View>
  );
}
