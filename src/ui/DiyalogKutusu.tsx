import React from 'react';
import { View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { PixelSprite } from './PixelSprite';
import { PixelText } from './PixelText';

/** Konuşanın portresi. Listede olmayan konuşmacı (ya da anlatıcı) portresiz. */
const PORTRE: Record<string, SpriteKey> = {
  'Çavuş Kaya': 'cavus',
  'Onbaşı Recep': 'cavus',
  Emre: 'askerEmre',
  Tolga: 'askerTolga',
  Serkan: 'askerSerkan',
};

type Props = {
  /** Konuşan; yoksa anlatıcı sesi. */
  konusan?: string;
  /** Konuşan yerine sekmede görünecek başlık (mini oyun adı gibi). */
  baslik?: string;
  children: React.ReactNode;
};

/**
 * Anlatının oyundaki yeri. Eskiden sade bir panel içinde düz metindi ve
 * ekran bir form gibi duruyordu; burada konuşanın adı kutunun kenarından
 * taşan bir sekme, portresi solda. Anlatıcının sekmesi ve portresi yok,
 * metni daha soluk: kimin konuştuğu bir bakışta belli.
 */
export function DiyalogKutusu({ konusan, baslik, children }: Props) {
  const portre = konusan ? PORTRE[konusan] : undefined;
  const sekme = baslik ?? konusan;

  return (
    <View style={{ paddingTop: sekme ? 14 : 0 }}>
      <View
        style={{
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: C.surface,
        }}
      >
        {/* İç kabartma: dış çizgi koyu, iç çizgi açık — pixel pencere hissi */}
        <View
          style={{
            borderWidth: BORDER,
            borderTopColor: C.line,
            borderLeftColor: C.line,
            borderBottomColor: C.shadow,
            borderRightColor: C.shadow,
            padding: SP.lg,
            paddingTop: sekme ? SP.lg + 4 : SP.lg,
            flexDirection: 'row',
            gap: SP.md,
          }}
        >
          {portre && (
            <View
              style={{
                width: 60,
                height: 76,
                borderWidth: BORDER,
                borderColor: C.ink,
                backgroundColor: C.bg,
                alignItems: 'center',
                justifyContent: 'flex-end',
                overflow: 'hidden',
              }}
            >
              <PixelSprite sprite={sprite(portre)} scale={3} />
            </View>
          )}
          <View style={{ flex: 1 }}>{children}</View>
        </View>
      </View>

      {sekme && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: SP.lg,
            backgroundColor: C.ink,
            borderWidth: BORDER,
            borderColor: C.line,
            paddingHorizontal: SP.sm,
            paddingVertical: 2,
          }}
        >
          <PixelText font="command" size="body" color={C.brass} tracking={1}>
            {sekme.toLocaleUpperCase('tr-TR')}
          </PixelText>
        </View>
      )}
    </View>
  );
}
