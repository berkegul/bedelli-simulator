import React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { BORDER, C, FONT, SIZE, SP } from '../theme';
import { PixelText } from './PixelText';

type Props = TextInputProps & {
  etiket?: string;
  /** Evrak üstünde: yalnızca alt çizgi, mürekkep rengi. */
  kagit?: boolean;
};

export function PixelInput({ etiket, kagit, style, ...rest }: Props) {
  if (kagit) {
    return (
      <View style={{ gap: 2 }}>
        {etiket && (
          <PixelText font="command" size="small" color={C.murekkepSoluk} tracking={1}>
            {etiket.toLocaleUpperCase('tr-TR')}
          </PixelText>
        )}
        <TextInput
          placeholderTextColor={'#9A8D69'}
          selectionColor={C.rust}
          {...rest}
          style={[
            {
              fontFamily: FONT.bodyMed,
              fontSize: SIZE.lead,
              color: C.murekkep,
              paddingHorizontal: 2,
              paddingVertical: SP.xs,
              borderBottomWidth: BORDER,
              borderColor: C.murekkepSoluk,
              borderStyle: 'dashed',
            },
            style,
          ]}
        />
      </View>
    );
  }
  return (
    <View style={{ gap: SP.xs }}>
      {etiket && (
        <PixelText font="bodyMed" size="small" color={C.canvasDim}>
          {etiket}
        </PixelText>
      )}
      <View
        style={{
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: C.bg,
        }}
      >
        <TextInput
          placeholderTextColor={C.canvasFaint}
          selectionColor={C.brass}
          {...rest}
          style={[
            {
              fontFamily: FONT.body,
              fontSize: SIZE.lead,
              color: C.canvas,
              paddingHorizontal: SP.md,
              paddingVertical: SP.md,
              borderWidth: BORDER,
              borderTopColor: C.shadow,
              borderLeftColor: C.shadow,
              borderBottomColor: C.line,
              borderRightColor: C.line,
            },
            style,
          ]}
        />
      </View>
    </View>
  );
}
