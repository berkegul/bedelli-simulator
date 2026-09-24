import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Siddet, titret } from '../ui/haptik';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { PixelText } from '../ui/PixelText';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

const TUR = 3;
const BAR_W = 240;
const BAR_H = 28;

/**
 * Gösterge üçgen dalga ile gidip gelir. Konumu animasyondan değil saatten
 * okuyoruz — dokunma anıyla ekrandaki kare arasında kayma olmuyor.
 */
export function YatakToplama({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const [tur, setTur] = useState(0);
  const [poz, setPoz] = useState(0);
  const [puanlar, setPuanlar] = useState<number[]>([]);
  const [sonVurus, setSonVurus] = useState<{ poz: number; puan: number } | null>(null);

  const periyot = 1700 - zorluk * 500 - tur * 130;
  const hedefYari = 0.13 - zorluk * 0.045 - tur * 0.018;
  const hedef = useRef(0.5);
  const t0 = useRef(Date.now());
  const donuyor = useRef(true);

  useEffect(() => {
    hedef.current = 0.28 + Math.random() * 0.44;
    t0.current = Date.now();
    donuyor.current = true;
    setSonVurus(null);
  }, [tur]);

  useEffect(() => {
    let raf = 0;
    const dongu = () => {
      if (donuyor.current) {
        const t = ((Date.now() - t0.current) % periyot) / periyot;
        setPoz(t < 0.5 ? t * 2 : 2 - t * 2);
      }
      raf = requestAnimationFrame(dongu);
    };
    raf = requestAnimationFrame(dongu);
    return () => cancelAnimationFrame(raf);
  }, [periyot]);

  const vur = useCallback(() => {
    if (!donuyor.current) return;
    donuyor.current = false;

    const t = ((Date.now() - t0.current) % periyot) / periyot;
    const p = t < 0.5 ? t * 2 : 2 - t * 2;
    const hata = Math.abs(p - hedef.current);
    const puan = clamp01(1 - hata / (hedefYari * 2.2));

    titret(puan > 0.7 ? Siddet.Medium : Siddet.Rigid);
    setSonVurus({ poz: p, puan });
    const yeni = [...puanlar, puan];
    setPuanlar(yeni);

    z.sonra(620, () => {
      if (yeni.length >= TUR) onBitti(yeni.reduce((a, b) => a + b, 0) / yeni.length);
      else setTur((n) => n + 1);
    });
  }, [periyot, hedefYari, puanlar, onBitti, z]);

  const hx = (hedef.current - hedefYari) * BAR_W;
  const hw = hedefYari * 2 * BAR_W;

  return (
    <View style={{ alignItems: 'center', gap: SP.xl }}>
      <PixelText font="command" size="h3" color={C.canvasDim} center>
        {`KAT ${tur + 1} / ${TUR}`}
      </PixelText>

      <View style={{ borderWidth: BORDER, borderColor: C.ink, backgroundColor: C.ink, padding: 3 }}>
        <Svg width={BAR_W} height={BAR_H}>
          <Rect x={0} y={0} width={BAR_W} height={BAR_H} fill={C.bg} />
          <Rect x={hx} y={0} width={hw} height={BAR_H} fill={C.olive} opacity={0.35} />
          <Rect x={hx + hw / 2 - 1} y={0} width={2} height={BAR_H} fill={C.olive} />
          {sonVurus && (
            <Rect x={sonVurus.poz * BAR_W - 1} y={0} width={3} height={BAR_H} fill={C.brass} />
          )}
          {!sonVurus && <Rect x={poz * BAR_W - 2} y={0} width={5} height={BAR_H} fill={C.canvas} />}
        </Svg>
      </View>

      <View style={{ height: 26, justifyContent: 'center' }}>
        {sonVurus && (
          <PixelText font="command" size="h3" color={sonVurus.puan > 0.7 ? C.olive : sonVurus.puan > 0.35 ? C.brass : C.rust}>
            {sonVurus.puan > 0.85 ? 'HİZADA' : sonVurus.puan > 0.5 ? 'KABUL' : sonVurus.puan > 0.2 ? 'YAMUK' : 'BAŞTAN'}
          </PixelText>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Battaniyeyi bırak"
        onPress={vur}
        style={{
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: C.surfaceHi,
          paddingVertical: SP.xl,
          paddingHorizontal: SP.xxxl,
        }}
      >
        <PixelText font="command" size="h2" color={C.brass}>
          BIRAK
        </PixelText>
      </Pressable>
    </View>
  );
}
