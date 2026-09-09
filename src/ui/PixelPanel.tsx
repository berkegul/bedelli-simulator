import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { BORDER, C } from '../theme';

type Props = ViewProps & {
  /** 'kabartma' dışa basılı, 'oyuk' içe basılı görünür — 8-bit arayüz kenarı. */
  tur?: 'kabartma' | 'oyuk' | 'duz';
  bg?: string;
  kenar?: string;
};

/** Dolgu iç çerçevenin içine geçer; dışarıda kalırsa metin iç hatta yapışıyor. */
const DOLGU_ANAHTARLARI = [
  'padding',
  'paddingHorizontal',
  'paddingVertical',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingStart',
  'paddingEnd',
] as const;

/**
 * İki katmanlı kenar: dış hat siyah, iç hat aydınlık/gölge çifti.
 * Yuvarlatma yok — pixel gridinden çıkan her eğri bulanıklık yaratıyor.
 *
 * Dolgu bilerek iç katmana taşınıyor: dışta kalınca iki çerçeve arasında
 * boşluk açılıyor ve yazı iç çerçevenin dibine yapışıyordu.
 */
export function PixelPanel({ tur = 'kabartma', bg = C.surface, kenar = C.ink, style, children, ...rest }: Props) {
  const oyuk = tur === 'oyuk';
  const cerceve: ViewStyle =
    tur === 'duz'
      ? { borderWidth: 0 }
      : {
          borderWidth: BORDER,
          borderTopColor: oyuk ? C.shadow : C.line,
          borderLeftColor: oyuk ? C.shadow : C.line,
          borderBottomColor: oyuk ? C.line : C.shadow,
          borderRightColor: oyuk ? C.line : C.shadow,
        };

  const duz = (StyleSheet.flatten(style) ?? {}) as ViewStyle;
  const dis: ViewStyle = { ...duz };
  const dolgu: ViewStyle = {};
  for (const k of DOLGU_ANAHTARLARI) {
    if (duz[k] !== undefined) {
      (dolgu as Record<string, unknown>)[k] = duz[k];
      delete (dis as Record<string, unknown>)[k];
    }
  }

  return (
    <View {...rest} style={[{ borderWidth: BORDER, borderColor: kenar, backgroundColor: bg }, dis]}>
      <View style={[cerceve, dolgu, { flex: duz.flex ? 1 : undefined }]}>{children}</View>
    </View>
  );
}
