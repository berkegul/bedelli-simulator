import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Siddet, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import { komsuRanza, pencere, ranzaTepeden } from '../art/sahne/kogus';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { PikselKatman, Sahne } from '../ui/sahne';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

const TUR = 3;
/** Sahnenin piksel hücresi ve yüksekliği. */
const U = 3;
const SAHNE_H = 270;

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
  const t0 = useRef(0);
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

  const [en, setEn] = useState(0);
  const W = Math.floor(en / U);
  const H = Math.floor(SAHNE_H / U);
  // Yatak: yapılan katlar toplanmış görünüyor, kötü katlar buruşuk kalıyor.
  const burusuk = (puanlar.reduce((t, p) => t + (1 - p), 0) + (TUR - puanlar.length) * 0.9) / TUR;
  const yatakW = Math.max(40, Math.min(W - 10, 112));
  const yatakX = Math.floor((W - yatakW) / 2);
  const yatakY = Math.round(H * 0.4);
  const yatak = useMemo(
    () => ranzaTepeden(yatakX, yatakY, yatakW, { kat: puanlar.length, burusuk }, 7),
    [yatakX, yatakY, yatakW, puanlar.length, burusuk],
  );
  const dekor = useMemo(
    () => (W > 0 ? [...pencere(6, 5, false), ...komsuRanza(W - 30, Math.round(H * 0.38), 26)] : []),
    [W, H],
  );

  // Gösterge: battaniyenin ön kenarı boyunca hiza ipi. Konumlar 0–1, oyun
  // mantığındakiyle aynı; yalnızca battaniyenin genişliğine yayılıyor.
  const gx = yatak.battaniyeX * U;
  const gw = yatak.battaniyeW * U;
  const gy = yatak.onKenarY * U + 3 * U;
  const hx = gx + (hedef.current - hedefYari) * gw;
  const hw = hedefYari * 2 * gw;
  const imlec = sonVurus ? sonVurus.poz : poz;

  return (
    <View style={{ alignItems: 'stretch', gap: SP.md }}>
      <PixelText font="command" size="h3" color={C.canvasDim} center>
        {`KAT ${tur + 1} / ${TUR}`}
      </PixelText>

      {/* Koğuş sabahı: pencereden soluk ışık, komşu ranza, senin yatağın */}
      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={{ borderWidth: BORDER, borderColor: C.ink }}
      >
        <Sahne
          yukseklik={SAHNE_H}
          u={U}
          duvar="badana"
          zemin="karo"
          zeminOrani={0.62}
          losluk={0.14}
          lambalar={[{ x: 16, y: 58, yaricap: 26, guc: 0.16 }]}
          tohum={4}
        >
          {W > 0 && (
            <>
              <PikselKatman
                pikseller={dekor}
                u={U}
                w={W}
                h={H}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
              <PikselKatman
                pikseller={yatak.pikseller}
                u={U}
                w={W}
                h={H}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
              {/* Ranzanın altında dünkü postallar */}
              <View
                style={{
                  position: 'absolute',
                  left: (yatakX + yatakW - 16) * U,
                  top: (yatakY + yatak.yukseklik - 2) * U,
                }}
              >
                <PixelSprite sprite={sprite('postal')} scale={U} />
              </View>
            </>
          )}
        </Sahne>

        {/* Hiza ipi: hedef aralık yeşil, elindeki kenar pirinç */}
        {W > 0 && (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
          >
            <View
              style={{
                position: 'absolute',
                left: gx,
                top: gy,
                width: gw,
                height: 2 * U,
                backgroundColor: C.ink,
                opacity: 0.55,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: hx,
                top: gy,
                width: hw,
                height: 2 * U,
                backgroundColor: C.olive,
                opacity: 0.8,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: hx + hw / 2 - U / 2,
                top: gy - 2 * U,
                width: U,
                height: 6 * U,
                backgroundColor: C.olive,
              }}
            />
            {/* Battaniyenin kenarını tutan el */}
            <View
              style={{
                position: 'absolute',
                left: gx + imlec * gw - 2 * U,
                top: gy - 4 * U,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 4 * U,
                  height: 3 * U,
                  backgroundColor: '#C9A277',
                  borderWidth: 1,
                  borderColor: C.ink,
                }}
              />
              <View
                style={{ width: U, height: 5 * U, backgroundColor: sonVurus ? C.brass : C.canvas }}
              />
            </View>
          </View>
        )}

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: SP.sm,
            right: SP.sm,
            backgroundColor: C.ink,
            paddingHorizontal: 6,
            paddingVertical: 2,
            opacity: sonVurus ? 1 : 0,
          }}
        >
          {sonVurus && (
            <PixelText
              font="command"
              size="h3"
              color={sonVurus.puan > 0.7 ? C.olive : sonVurus.puan > 0.35 ? C.brass : C.rust}
            >
              {sonVurus.puan > 0.85
                ? 'HİZADA'
                : sonVurus.puan > 0.5
                  ? 'KABUL'
                  : sonVurus.puan > 0.2
                    ? 'YAMUK'
                    : 'BAŞTAN'}
            </PixelText>
          )}
        </View>
      </View>

      <PixelText size="small" color={C.canvasFaint} center>
        Battaniyenin kenarı hiza ipinin yeşil yerine gelince bırak.
      </PixelText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Battaniyeyi bırak"
        onPress={vur}
        style={{
          alignSelf: 'center',
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: C.surfaceHi,
          paddingVertical: SP.lg,
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
