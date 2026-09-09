import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { Siddet, titret } from '../ui/haptik';
import { PixelText } from '../ui/PixelText';
import { clamp01, type MiniOyunProps } from './types';

const SURE = 15000;
const ALAN_YUKSEKLIK = 260;

type Cop = { id: number; x: number; y: number; tur: 'izmarit' | 'kagit' | 'kapak' };

const SIMGE: Record<Cop['tur'], string> = { izmarit: '✕', kagit: '▤', kapak: '◉' };

/**
 * Bölük işleri: avluda ne varsa toplanacak. Süre içinde ne kadar çok
 * toplarsan o kadar iyi; yerde kalan her şey Onbaşı'nın gözüne çarpıyor.
 */
export function IzmaritToplama({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const hedef = 14 + Math.round(zorluk * 6);
  const [copler, setCopler] = useState<Cop[]>([]);
  const [toplanan, setToplanan] = useState(0);
  const [kalan, setKalan] = useState(Math.round(SURE / 1000));
  const sonrakiId = useRef(0);
  const bitti = useRef(false);

  const uret = useCallback((): Cop => {
    const turler: Cop['tur'][] = ['izmarit', 'izmarit', 'kagit', 'kapak'];
    return {
      id: sonrakiId.current++,
      x: 6 + Math.random() * 82,
      y: 6 + Math.random() * 80,
      tur: turler[Math.floor(Math.random() * turler.length)],
    };
  }, []);

  useEffect(() => {
    setCopler(Array.from({ length: 5 }, uret));
    const ekle = setInterval(() => {
      if (bitti.current) return;
      // Yeni çöp düşmeye devam ediyor; ekran hiç boşalmıyor.
      setCopler((c) => (c.length < 9 ? [...c, uret()] : c));
    }, 900 - zorluk * 250);

    const sayac = setInterval(() => setKalan((k) => Math.max(0, k - 1)), 1000);
    const son = setTimeout(() => {
      bitti.current = true;
      onBitti(clamp01(toplananRef.current / hedef));
    }, SURE);

    return () => {
      clearInterval(ekle);
      clearInterval(sayac);
      clearTimeout(son);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toplananRef = useRef(0);
  const topla = useCallback((id: number) => {
    if (bitti.current) return;
    setCopler((c) => c.filter((x) => x.id !== id));
    toplananRef.current += 1;
    setToplanan(toplananRef.current);
    titret(Siddet.Light);
  }, []);

  return (
    <View style={{ gap: SP.md, width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvasDim} style={{ flex: 1 }}>
          {`TOPLANAN ${toplanan} / ${hedef}`}
        </PixelText>
        <PixelText font="command" size="h3" color={kalan <= 4 ? C.rust : C.canvasFaint}>
          {`${kalan} sn`}
        </PixelText>
      </View>

      <View
        style={{
          height: ALAN_YUKSEKLIK,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: '#2A2719',
        }}
      >
        {copler.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel="Yerden topla"
            onPress={() => topla(c.id)}
            hitSlop={14}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PixelText
              font="command"
              size="h3"
              color={c.tur === 'izmarit' ? C.canvasDim : c.tur === 'kagit' ? C.canvas : C.brass}
            >
              {SIMGE[c.tur]}
            </PixelText>
          </Pressable>
        ))}
      </View>

      <PixelText size="small" color={C.canvasFaint} center line="snug">
        Yerdekilere dokunup topla. Süre bitince kalanlar senin hanene yazılır.
      </PixelText>
    </View>
  );
}
