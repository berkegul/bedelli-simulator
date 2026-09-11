import React, { useState } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { PixelText } from '../ui/PixelText';

/** Bölüm başlığı — geliştirme alanının her katmanında aynı görünüyor. */
export function Baslik({ ust, ad, alt }: { ust?: string; ad: string; alt?: string }) {
  return (
    <View style={{ gap: 2 }}>
      {ust && (
        <PixelText font="command" size="body" color={C.brass} tracking={2}>
          {ust.toLocaleUpperCase('tr-TR')}
        </PixelText>
      )}
      <PixelText font="command" size="h2" color={C.canvas}>
        {ad.toLocaleUpperCase('tr-TR')}
      </PixelText>
      {alt && (
        <PixelText size="small" color={C.canvasFaint} line="snug">
          {alt}
        </PixelText>
      )}
    </View>
  );
}

export function Kutu({
  baslik,
  children,
  renk = C.line,
  style,
}: {
  baslik?: string;
  children: React.ReactNode;
  renk?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        { borderWidth: BORDER, borderColor: renk, backgroundColor: C.surface, padding: SP.md, gap: SP.sm },
        style,
      ]}
    >
      {baslik && (
        <PixelText font="command" size="body" color={renk === C.line ? C.canvasDim : renk} tracking={2}>
          {baslik.toLocaleUpperCase('tr-TR')}
        </PixelText>
      )}
      {children}
    </View>
  );
}

/** Ad + değer satırı; denetçilerin tamamı bunu kullanıyor. */
export function Satir({
  ad,
  deger,
  renk = C.canvas,
}: {
  ad: string;
  deger: string | number;
  renk?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
      <PixelText size="small" color={C.canvasFaint} style={{ flex: 1 }} numberOfLines={1}>
        {ad}
      </PixelText>
      <PixelText font="command" size="body" color={renk}>
        {String(deger)}
      </PixelText>
    </View>
  );
}

/** Yatay seçim şeridi. Uzun listelerde sarar. */
export function Secenekler<T extends string | number>({
  liste,
  secili,
  onSec,
  etiket,
}: {
  liste: readonly T[];
  secili: T;
  onSec: (v: T) => void;
  etiket?: (v: T) => string;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SP.xs }}>
      {liste.map((v) => {
        const acik = v === secili;
        return (
          <Pressable
            key={String(v)}
            accessibilityRole="radio"
            accessibilityState={{ selected: acik }}
            onPress={() => onSec(v)}
            style={{
              borderWidth: BORDER,
              borderColor: acik ? C.brass : C.ink,
              backgroundColor: acik ? C.surfaceHi : C.bg,
              paddingVertical: SP.xs,
              paddingHorizontal: SP.sm,
              minWidth: 34,
              alignItems: 'center',
            }}
          >
            <PixelText font="command" size="body" color={acik ? C.brass : C.canvasDim}>
              {etiket ? etiket(v) : String(v)}
            </PixelText>
          </Pressable>
        );
      })}
    </View>
  );
}

/** −/+ ile ilerleyen sayı alanı; kaydırıcı pixel estetiğine oturmuyor. */
export function Sayi({
  ad,
  deger,
  onDegis,
  adim = 1,
  min = 0,
  max = 100,
}: {
  ad: string;
  deger: number;
  onDegis: (v: number) => void;
  adim?: number;
  min?: number;
  max?: number;
}) {
  const kirp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SP.sm }}>
      <PixelText size="small" color={C.canvasFaint} style={{ flex: 1 }}>
        {ad}
      </PixelText>
      <TusKucuk label="−" onPress={() => onDegis(kirp(deger - adim))} />
      <PixelText
        font="command"
        size="lead"
        color={C.canvas}
        style={{ minWidth: 42, textAlign: 'center' }}
      >
        {deger}
      </PixelText>
      <TusKucuk label="+" onPress={() => onDegis(kirp(deger + adim))} />
    </View>
  );
}

export function TusKucuk({ label, onPress }: { label: string; onPress: () => void }) {
  const [basili, setBasili] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPressIn={() => setBasili(true)}
      onPressOut={() => setBasili(false)}
      onPress={onPress}
      style={{
        borderWidth: BORDER,
        borderColor: C.ink,
        backgroundColor: basili ? C.surfaceHi : C.surface,
        paddingHorizontal: SP.md,
        paddingVertical: SP.xs,
      }}
    >
      <PixelText font="command" size="lead" color={C.brass}>
        {label}
      </PixelText>
    </Pressable>
  );
}

/** Listeden bir şey seçip açan satır — bölümlerin ana etkileşimi. */
export function Kart({
  ad,
  alt,
  saglik,
  onPress,
  renk = C.line,
}: {
  ad: string;
  alt?: string;
  /** Sağda duran kısa etiket: durum, sayı, rozet. */
  saglik?: string;
  onPress: () => void;
  renk?: string;
}) {
  const [basili, setBasili] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ad}
      onPressIn={() => setBasili(true)}
      onPressOut={() => setBasili(false)}
      onPress={onPress}
      style={{
        borderWidth: BORDER,
        borderColor: renk,
        borderLeftWidth: 5,
        backgroundColor: basili ? C.surfaceHi : C.surface,
        paddingVertical: SP.sm,
        paddingHorizontal: SP.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SP.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <PixelText font="bodySemi" size="lead" color={C.canvas}>
          {ad}
        </PixelText>
        {alt && (
          <PixelText size="micro" color={C.canvasFaint} line="snug">
            {alt}
          </PixelText>
        )}
      </View>
      {saglik && (
        <PixelText font="command" size="body" color={C.brass}>
          {saglik}
        </PixelText>
      )}
    </Pressable>
  );
}

/** Geliştirme alanında çıktı gösteren tek renkli blok. */
export function Cikti({ satirlar }: { satirlar: string[] }) {
  if (!satirlar.length) return null;
  return (
    <View style={{ borderWidth: BORDER, borderColor: C.olive, backgroundColor: C.ink, padding: SP.md, gap: 2 }}>
      {satirlar.map((s, i) => (
        <PixelText key={i} size="small" color={i === 0 ? C.olive : C.canvasDim} line="snug">
          {s}
        </PixelText>
      ))}
    </View>
  );
}
