import React, { useState } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { Siddet, titret } from './haptik';
import { BORDER, C, HIT_SLOP, SP } from '../theme';
import { PixelText } from './PixelText';

type Props = {
  label: string;
  onPress: () => void;
  /** 'ana' vurgulu eylem, 'secim' anlatı seçeneği, 'sessiz' ikincil. */
  tur?: 'ana' | 'secim' | 'sessiz';
  disabled?: boolean;
  style?: ViewStyle;
};

export function PixelButton({ label, onPress, tur = 'ana', disabled, style }: Props) {
  const [basili, setBasili] = useState(false);

  const bg = disabled
    ? C.surface
    : basili
      ? C.surfaceHi
      : tur === 'ana'
        ? '#4A4327'
        : C.surface;

  const yazi = disabled ? C.canvasFaint : tur === 'ana' ? C.brass : C.canvas;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={HIT_SLOP}
      disabled={disabled}
      onPressIn={() => {
        setBasili(true);
        if (!disabled) titret(Siddet.Light);
      }}
      onPressOut={() => setBasili(false)}
      onPress={onPress}
      style={[{ borderWidth: BORDER, borderColor: C.ink, backgroundColor: bg }, style]}
    >
      <View
        style={{
          borderWidth: BORDER,
          borderTopColor: basili ? C.shadow : C.line,
          borderLeftColor: basili ? C.shadow : C.line,
          borderBottomColor: basili ? C.line : C.shadow,
          borderRightColor: basili ? C.line : C.shadow,
          paddingVertical: SP.md,
          paddingHorizontal: SP.lg,
          flexDirection: 'row',
          alignItems: 'center',
          gap: SP.sm,
        }}
      >
        {tur === 'secim' && (
          <PixelText font="command" size="body" color={basili ? C.brass : C.canvasDim}>
            {'>'}
          </PixelText>
        )}
        <PixelText
          font={tur === 'ana' ? 'command' : 'bodyMed'}
          size={tur === 'ana' ? 'lead' : 'body'}
          color={yazi}
          style={{ flex: 1 }}
        >
          {label}
        </PixelText>
      </View>
    </Pressable>
  );
}
