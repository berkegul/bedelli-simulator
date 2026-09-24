import React from 'react';
import { View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { PixelText } from './PixelText';

/** Askerî evrakın kâğıdı: kaput bezi tonunda zemin, koyu kenar. */
export function Kagit({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: C.kagit,
        borderWidth: BORDER,
        borderColor: C.ink,
        padding: SP.lg,
        gap: SP.xl,
      }}
    >
      {children}
    </View>
  );
}

/** Evrakta bölüm başlığı: numaralı, büyük harf, altı çizgili. */
export function Bolum({
  no,
  baslik,
  children,
}: {
  no: string;
  baslik: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: SP.sm }}>
      <View
        style={{
          flexDirection: 'row',
          gap: SP.sm,
          borderBottomWidth: BORDER,
          borderColor: C.murekkep,
          paddingBottom: 2,
        }}
      >
        <PixelText font="command" size="body" color={C.murekkepSoluk}>
          {no}
        </PixelText>
        <PixelText font="command" size="body" color={C.murekkep} tracking={1}>
          {baslik}
        </PixelText>
      </View>
      {children}
    </View>
  );
}

/** Kâğıda vurulmuş, hafif yamuk mühür. */
export function Damga({ metin, renk = C.rust }: { metin: string; renk?: string }) {
  return (
    <View
      style={{
        borderWidth: 3,
        borderColor: renk,
        paddingHorizontal: SP.sm,
        paddingVertical: 2,
        transform: [{ rotate: '-8deg' }],
        opacity: 0.85,
        marginTop: SP.sm,
      }}
    >
      <PixelText font="command" size="lead" color={renk} tracking={2}>
        {metin}
      </PixelText>
    </View>
  );
}

/** Evrak satırı: solda etiket, sağda değer, altında ince çizgi. */
export function Satir({ etiket, deger, renk }: { etiket: string; deger: string; renk?: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SP.md,
        borderBottomWidth: 1,
        borderColor: C.kagitCizgi,
        paddingVertical: SP.xs,
      }}
    >
      <PixelText size="body" color={C.murekkepSoluk} style={{ flexShrink: 1 }}>
        {etiket}
      </PixelText>
      <PixelText font="bodySemi" size="body" color={renk ?? C.murekkep}>
        {deger}
      </PixelText>
    </View>
  );
}
