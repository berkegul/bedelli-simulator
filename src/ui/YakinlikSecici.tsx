import React from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { YAKINLIK_KISA } from '../content/telefon';
import type { YakinlikTuru } from '../engine/types';
import { PixelText } from './PixelText';

const TURLER: YakinlikTuru[] = ['ebeveyn', 'sevgili', 'es', 'kardes', 'arkadas'];

type Props = {
  secili: YakinlikTuru;
  onSec: (t: YakinlikTuru) => void;
};

/** Kiminle konuştuğun, nasıl konuştuğunu belirliyor; o yüzden tür şart. */
export function YakinlikSecici({ secili, onSec }: Props) {
  return (
    <View style={{ gap: SP.xs }}>
      <PixelText font="bodyMed" size="small" color={C.canvasDim}>
        Yakınlık
      </PixelText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SP.xs }}>
        {TURLER.map((t) => {
          const acik = secili === t;
          return (
            <Pressable
              key={t}
              accessibilityRole="radio"
              accessibilityState={{ selected: acik }}
              accessibilityLabel={YAKINLIK_KISA[t]}
              onPress={() => onSec(t)}
              style={{
                borderWidth: BORDER,
                borderColor: acik ? C.brass : C.ink,
                backgroundColor: acik ? C.surfaceHi : C.surface,
                paddingVertical: SP.sm,
                paddingHorizontal: SP.md,
              }}
            >
              <PixelText font="bodySemi" size="small" color={acik ? C.brass : C.canvasDim}>
                {YAKINLIK_KISA[t]}
              </PixelText>
            </Pressable>
          );
        })}
      </View>
      <PixelText size="micro" color={C.canvasFaint}>
        Telefonda nasıl konuşacağınızı bu belirliyor.
      </PixelText>
    </View>
  );
}
