import React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { BORDER, C, FONT, SIZE, SP } from '../theme';
import { PixelText } from './PixelText';

type Props = TextInputProps & {
  etiket?: string;
};

export function PixelInput({ etiket, style, ...rest }: Props) {
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
