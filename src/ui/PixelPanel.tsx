import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { BORDER, C } from '../theme';

type Props = ViewProps & {
  /** 'kabartma' dışa basılı, 'oyuk' içe basılı görünür — 8-bit arayüz kenarı. */
  tur?: 'kabartma' | 'oyuk' | 'duz';
  bg?: string;
  kenar?: string;
};

/**
 * İki katmanlı kenar: dış hat siyah, iç hat aydınlık/gölge çifti.
 * Yuvarlatma yok — pixel gridinden çıkan her eğri bulanıklık yaratıyor.
 */
export function PixelPanel({ tur = 'kabartma', bg = C.surface, kenar = C.ink, style, children, ...rest }: Props) {
  const oyuk = tur === 'oyuk';
  const ic: ViewStyle =
    tur === 'duz'
      ? { borderWidth: 0 }
      : {
          borderWidth: BORDER,
          borderTopColor: oyuk ? C.shadow : C.line,
          borderLeftColor: oyuk ? C.shadow : C.line,
          borderBottomColor: oyuk ? C.line : C.shadow,
          borderRightColor: oyuk ? C.line : C.shadow,
        };

  return (
    <View {...rest} style={[{ borderWidth: BORDER, borderColor: kenar, backgroundColor: bg }, style]}>
      <View style={[ic, { flex: style && (style as ViewStyle).flex ? 1 : undefined }]}>{children}</View>
    </View>
  );
}
