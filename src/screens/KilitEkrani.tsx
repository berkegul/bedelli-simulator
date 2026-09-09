import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { SPRITES } from '../art';
import { TOPLAM_GUN } from '../engine/stats';
import { BEDAVA_GUN } from '../monetization/entitlements';
import { useGame } from '../store/gameStore';
import { CentikTakvim } from '../ui/CentikTakvim';
import { PixelButton } from '../ui/PixelButton';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

/**
 * Satın alma akışı henüz bağlı değil — model seçildiğinde buradaki tek buton
 * IAP çağrısına bağlanacak. Bkz. src/monetization/entitlements.ts
 */
export function KilitEkrani() {
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
        <PixelSprite sprite={SPRITES.kunye} scale={6} />
        <PixelText font="command" size="h2" color={C.canvas} center tracking={1} style={{ marginTop: SP.lg }}>
          {`${BEDAVA_GUN}. GÜN BİTTİ`}
        </PixelText>
        <PixelText size="lead" color={C.canvasDim} center line="loose">
          {`Temel eğitimin geri kalan ${TOPLAM_GUN - BEDAVA_GUN} günü kilitli. Silah eğitimi, nöbet, atış ve terhis günü bu bölümde.`}
        </PixelText>
      </View>

      <CentikTakvim bitenGunler={g.bitenGunler} aktifGun={g.gun} acikGunSayisi={BEDAVA_GUN} />

      <View style={{ gap: SP.sm }}>
        <View style={{ borderWidth: BORDER, borderColor: C.line, padding: SP.md }}>
          <PixelText size="small" color={C.canvasFaint} center>
            Satın alma akışı henüz bağlanmadı.
          </PixelText>
        </View>
        <PixelButton label="Ana menü" tur="sessiz" onPress={g.anaMenu} />
      </View>
    </View>
  );
}
