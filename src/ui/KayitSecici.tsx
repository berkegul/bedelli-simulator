import React from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { KAYIT_ADI, KAYIT_IPUCU, KAYIT_LISTESI } from '../content/telefon';
import type { KayitRolu } from '../engine/types';
import { PixelText } from './PixelText';

type Props = {
  secili: KayitRolu;
  onSec: (r: KayitRolu) => void;
  /** Ev zaten kayıtlıysa ikinci kez eklenemez. */
  devreDisi?: KayitRolu[];
};

/**
 * Kiminle konuştuğun, nasıl konuştuğunu belirliyor. Kadro sabit değil —
 * kimi eklediğine sen karar veriyorsun; 'Akraba' amcan, halan, dayın için
 * genel havuzu açıyor.
 */
export function KayitSecici({ secili, onSec, devreDisi = [] }: Props) {
  return (
    <View style={{ gap: SP.xs }}>
      <PixelText font="bodyMed" size="small" color={C.canvasDim}>
        Yakınlık
      </PixelText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SP.xs }}>
        {KAYIT_LISTESI.map((r) => {
          const kapali = devreDisi.includes(r);
          const acik = secili === r;
          return (
            <Pressable
              key={r}
              accessibilityRole="radio"
              accessibilityState={{ selected: acik, disabled: kapali }}
              accessibilityLabel={KAYIT_ADI[r]}
              disabled={kapali}
              onPress={() => onSec(r)}
              style={{
                borderWidth: BORDER,
                borderColor: acik ? C.brass : C.ink,
                backgroundColor: acik ? C.surfaceHi : C.surface,
                paddingVertical: SP.sm,
                paddingHorizontal: SP.md,
                opacity: kapali ? 0.35 : 1,
              }}
            >
              <PixelText font="bodySemi" size="small" color={acik ? C.brass : C.canvasDim}>
                {KAYIT_ADI[r]}
              </PixelText>
            </Pressable>
          );
        })}
      </View>
      <PixelText size="micro" color={C.canvasFaint} line="snug">
        {KAYIT_IPUCU[secili]}
      </PixelText>
    </View>
  );
}
