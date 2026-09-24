import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { C, COMMAND_SCALE, FONT, LINE, SIZE } from '../theme';

type FontRole = keyof typeof FONT;

type Props = TextProps & {
  font?: FontRole;
  size?: keyof typeof SIZE | number;
  color?: string;
  line?: keyof typeof LINE;
  /** Harfler arası boşluk; Jersey 10 çok sıkı, komutlarda hafif açmak iyi gelir. */
  tracking?: number;
  center?: boolean;
};

export function PixelText({
  font = 'body',
  size = 'body',
  color = C.canvas,
  line = 'body',
  tracking,
  center,
  style,
  ...rest
}: Props) {
  const base = typeof size === 'number' ? size : SIZE[size];
  const isCommand = font === 'command';
  const fontSize = Math.round(isCommand ? base * COMMAND_SCALE : base);

  const s: TextStyle = {
    fontFamily: FONT[font],
    fontSize,
    color,
    lineHeight: Math.round(fontSize * LINE[isCommand ? 'tight' : line]),
    letterSpacing: tracking ?? (isCommand ? 1 : 0),
    textAlign: center ? 'center' : 'left',
  };

  // Sistemde büyük yazı açıkken piksel font 1.3 kata kadar büyüyor; ötesinde
  // sabit yükseklikli şeritler ve düğmeler taşıyordu (C6).
  return <Text maxFontSizeMultiplier={1.3} {...rest} style={[s, style]} />;
}
