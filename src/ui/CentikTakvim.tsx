import React from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { C, SP } from '../theme';
import { TOPLAM_GUN } from '../engine/stats';
import { PixelText } from './PixelText';

const NOT_RENK: Record<string, string> = {
  'TAKDİR ALDI': C.brass,
  'TEMİZ İŞ': C.olive,
  'İDARE EDER': C.canvas,
  'GAZ YEDİ': C.tea,
  CEZALI: C.rust,
};

type Props = {
  bitenGunler: { gun: number; not: string }[];
  aktifGun: number;
  /** Erişilemeyen günler (henüz yazılmamış ya da kilitli) soluk gösterilir. */
  acikGunSayisi?: number;
  /** Alttaki açıklama satırı; çağıran kendi satırını yazıyorsa gizlenir. */
  aciklamasiz?: boolean;
};

/**
 * Oyunun imza görseli: 28 gün, duvara atılan çentik gibi.
 * Bitirilen gün üstü çizilir; çizginin rengi o günün notudur.
 */
export function CentikTakvim({
  bitenGunler,
  aktifGun,
  acikGunSayisi = TOPLAM_GUN,
  aciklamasiz,
}: Props) {
  const notlar = new Map(bitenGunler.map((b) => [b.gun, b.not]));
  const sutun = 7;
  const satir = Math.ceil(TOPLAM_GUN / sutun);
  const hucre = 10;
  const bosluk = 4;
  const w = sutun * hucre + (sutun - 1) * bosluk;
  const h = satir * hucre + (satir - 1) * bosluk;

  return (
    <View style={{ gap: SP.sm, alignItems: 'center' }}>
      <Svg width={w * 3} height={h * 3} viewBox={`0 0 ${w} ${h}`}>
        {Array.from({ length: TOPLAM_GUN }, (_, i) => {
          const gun = i + 1;
          const x = (i % sutun) * (hucre + bosluk);
          const y = Math.floor(i / sutun) * (hucre + bosluk);
          const not = notlar.get(gun);
          const aktif = gun === aktifGun;
          const erisilir = gun <= acikGunSayisi;

          return (
            <React.Fragment key={gun}>
              <Rect
                x={x}
                y={y}
                width={hucre}
                height={hucre}
                fill={aktif ? C.surfaceHi : C.ink}
                stroke={aktif ? C.brass : erisilir ? C.line : C.canvasFaint}
                strokeWidth={aktif ? 1.5 : 1}
                opacity={erisilir ? 1 : 0.35}
              />
              {not && (
                <Line
                  x1={x + 1}
                  y1={y + hucre - 1}
                  x2={x + hucre - 1}
                  y2={y + 1}
                  stroke={NOT_RENK[not] ?? C.canvas}
                  strokeWidth={2}
                />
              )}
            </React.Fragment>
          );
        })}
      </Svg>
      {!aciklamasiz && (
        <PixelText size="micro" color={C.canvasFaint} center>
          Her çentik bir gün. Rengi o günün notu.
        </PixelText>
      )}
    </View>
  );
}
