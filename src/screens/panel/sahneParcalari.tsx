import React, { useMemo, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { PikselKatman, Vinyet, ZEMINLER, benek, type Piksel, type ZeminTuru } from '../../ui/sahne';
import { PixelText } from '../../ui/PixelText';

/**
 * Panelin içinde yerden bir parça: avlu toprağı, beton, cep astarı. Genişlik
 * ölçülene kadar pencereden tahmin ediliyor; ilk karede de doku çizilsin
 * (web'de onLayout geç gelirse alan boş kalıyordu).
 */
export function ZeminParcasi({
  tur,
  yukseklik,
  u = 3,
  tohum = 1,
  ekPiksel,
  children,
}: {
  tur: ZeminTuru | 'kumas';
  yukseklik: number;
  u?: number;
  tohum?: number;
  /** Dokunun üstüne serilen ek pikseller (dikiş, leke). Hücre cinsinden alır. */
  ekPiksel?: (w: number, h: number) => Piksel[];
  children?: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  const [olculen, setOlculen] = useState(0);
  const en = olculen || Math.min(width, 480) - 2 * SP.lg;
  const W = Math.max(1, Math.ceil(en / u));
  const H = Math.max(1, Math.ceil(yukseklik / u));

  const pikseller = useMemo<Piksel[]>(() => {
    const a = { x: 0, y: 0, w: W, h: H };
    const taban = tur === 'kumas' ? kumas(W, H, tohum) : ZEMINLER[tur](a, tohum);
    return ekPiksel ? [...taban, ...ekPiksel(W, H)] : taban;
  }, [W, H, tur, tohum, ekPiksel]);

  return (
    <View
      onLayout={(e) => setOlculen(Math.round(e.nativeEvent.layout.width))}
      style={{
        height: yukseklik,
        overflow: 'hidden',
        borderWidth: BORDER,
        borderColor: C.ink,
        backgroundColor: '#1B1A14',
      }}
    >
      <PikselKatman
        pikseller={pikseller}
        u={u}
        w={W}
        h={H}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      {children}
      <Vinyet u={u} kalinlik={2} guc={0.2} />
    </View>
  );
}

/** Cebin astarı: haki pamuk, ince dokuma çizgileri, kenarda dikiş. */
function kumas(W: number, H: number, tohum: number): Piksel[] {
  const out: Piksel[] = [{ x: 0, y: 0, w: W, h: H, c: '#4F5334' }];
  for (let y = 1; y < H; y += 2) out.push({ x: 0, y, w: W, h: 1, c: '#4A4E30' });
  out.push(
    ...benek(
      { x: 0, y: 0, w: W, h: H },
      [
        { c: '#585C3A', oran: 0.05 },
        { c: '#43472C', oran: 0.04 },
      ],
      tohum,
    ),
  );
  // Dikiş: kenardan iki hücre içeride kesik çizgi
  for (let x = 2; x < W - 2; x += 3) {
    out.push({ x, y: 2, w: 2, h: 1, c: '#8A8458' }, { x, y: H - 3, w: 2, h: 1, c: '#8A8458' });
  }
  for (let y = 2; y < H - 2; y += 3) {
    out.push({ x: 2, y, w: 1, h: 2, c: '#8A8458' }, { x: W - 3, y, w: 1, h: 2, c: '#8A8458' });
  }
  return out;
}

/**
 * Konuşma balonu: açık kâğıt tonu, koyu kenar, kuyruğu konuşana doğru.
 * `onPress` verilirse cevap balonu olur (oyuncunun ağzından).
 */
export function Balon({
  metin,
  kuyruk = 'sol',
  onPress,
  kapali,
  erisimEtiketi,
}: {
  metin: string;
  kuyruk?: 'sol' | 'sag' | 'yok';
  onPress?: () => void;
  kapali?: boolean;
  erisimEtiketi?: string;
}) {
  const cevap = !!onPress;
  const zemin = cevap ? C.surfaceHi : C.kagit;
  const yazi = cevap ? C.canvas : C.murekkep;
  const icerik = (
    <>
      <View
        style={{
          backgroundColor: zemin,
          borderWidth: BORDER,
          borderColor: C.ink,
          paddingVertical: SP.sm,
          paddingHorizontal: SP.md,
        }}
      >
        <PixelText font={cevap ? 'bodySemi' : 'body'} size="lead" color={yazi} line="body">
          {metin}
        </PixelText>
      </View>
      {kuyruk !== 'yok' && (
        <View
          style={{
            position: 'absolute',
            bottom: -8,
            [kuyruk === 'sol' ? 'left' : 'right']: SP.lg,
            width: 12,
            height: 10,
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 12,
              height: 4,
              backgroundColor: C.ink,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 2,
              width: 8,
              height: 2,
              backgroundColor: zemin,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 4,
              left: 2,
              width: 8,
              height: 3,
              backgroundColor: C.ink,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 7,
              left: kuyruk === 'sol' ? 0 : 6,
              width: 6,
              height: 3,
              backgroundColor: C.ink,
            }}
          />
        </View>
      )}
    </>
  );
  if (!onPress) return <View style={{ marginBottom: kuyruk === 'yok' ? 0 : 8 }}>{icerik}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={erisimEtiketi ?? metin}
      accessibilityState={{ disabled: !!kapali }}
      disabled={kapali}
      onPress={onPress}
      style={({ pressed }) => ({
        marginBottom: kuyruk === 'yok' ? 0 : 8,
        opacity: kapali ? 0.45 : 1,
        transform: [{ translateY: pressed ? 2 : 0 }],
      })}
    >
      {icerik}
    </Pressable>
  );
}
