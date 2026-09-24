import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../../theme';
import type { ArkadasId } from '../../engine/types';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelText } from '../../ui/PixelText';
import { MekanSeridi } from '../../ui/MekanSeridi';
import { saate } from '../../engine/zaman';

export const ARKADAS_SPRITE: Record<ArkadasId, 'askerEmre' | 'askerTolga' | 'askerSerkan'> = {
  emre: 'askerEmre',
  tolga: 'askerTolga',
  serkan: 'askerSerkan',
};

/** Oyun ekranının üstüne binen tam ekran panel; sahne akışı bozulmaz. */
export function PanelKabuk({
  baslik,
  alt,
  children,
  kapat,
  kapatLabel = 'Geri dön',
  sahne,
}: {
  baslik: string;
  alt?: string;
  children: React.ReactNode;
  /** Görüşme paneli gibi kapanışı kendi yöneten paneller için. */
  kapat?: () => void;
  kapatLabel?: string;
  /**
   * Başlığın altında yerin kendisi: mekan anahtarı (MekanSeridi) ve saat.
   * Panel bir form değil, bir yer; kantine giren tezgâhı görüyor.
   */
  sahne?: { mekan: string; saat?: string };
}) {
  const g = useSecili('panelAc', 'para', 'saat');
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.bg }}
    >
      <View
        style={{
          paddingTop: inset.top + SP.md,
          paddingHorizontal: SP.lg,
          paddingBottom: SP.md,
          backgroundColor: C.ink,
          borderBottomWidth: BORDER,
          borderBottomColor: C.line,
          flexDirection: 'row',
          alignItems: 'center',
          gap: SP.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <PixelText font="command" size="h3" color={C.canvas}>
            {baslik}
          </PixelText>
          {alt && (
            <PixelText size="micro" color={C.canvasFaint}>
              {alt}
            </PixelText>
          )}
        </View>
        <PixelText font="command" size="h3" color={C.brass}>
          {`${g.para} TL`}
        </PixelText>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: SP.lg, gap: SP.lg }}
        keyboardShouldPersistTaps="handled"
      >
        {sahne && (
          <MekanSeridi
            blokId={`d0-${sahne.mekan}`}
            saat={sahne.saat ?? saate(g.saat)}
            carpan={1}
            cercevesiz
          />
        )}
        <View style={{ paddingHorizontal: SP.lg, paddingTop: sahne ? 0 : SP.lg, gap: SP.lg }}>
          {children}
        </View>
      </ScrollView>

      <View style={{ padding: SP.lg, paddingBottom: inset.bottom + SP.lg, backgroundColor: C.ink }}>
        <PixelButton label={kapatLabel} tur="sessiz" onPress={kapat ?? (() => g.panelAc(null))} />
      </View>
    </View>
  );
}
