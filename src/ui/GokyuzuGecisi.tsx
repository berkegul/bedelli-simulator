import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { C } from '../theme';
import { sprite } from '../art';
import { isikDurumu, isikKaristir, type Isik } from './Gokyuzu';
import { PixelSprite } from './PixelSprite';

const YILDIZLAR = [
  { x: 10, y: 22 }, { x: 26, y: 11 }, { x: 39, y: 31 }, { x: 55, y: 16 },
  { x: 67, y: 35 }, { x: 76, y: 13 }, { x: 86, y: 28 }, { x: 19, y: 40 },
  { x: 61, y: 7 }, { x: 91, y: 45 }, { x: 33, y: 48 }, { x: 47, y: 5 },
];

type Props = {
  yon: 'dogum' | 'batim';
  yukseklik: number;
  sure?: number;
  onBitti?: () => void;
};

/**
 * Gün açılırken güneş ufuktan doğuyor, gün kapanırken batıp yerini
 * yıldızlara bırakıyor. Renkler kademe kademe karışıyor — pixel estetiğinde
 * yumuşak degrade yerine bant geçişi.
 */
export function GokyuzuGecisi({ yon, yukseklik, sure = 2800, onBitti }: Props) {
  const bas = isikDurumu(yon === 'dogum' ? '04:00' : '16:30');
  const son = isikDurumu(yon === 'dogum' ? '08:00' : '21:30');

  const [oran, setOran] = useState(0);
  const [azaltilmis, setAzaltilmis] = useState(false);

  useEffect(() => {
    let canli = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => canli && setAzaltilmis(v));
    return () => {
      canli = false;
    };
  }, []);

  useEffect(() => {
    if (azaltilmis) {
      setOran(1);
      onBitti?.();
      return;
    }
    const adim = 40;
    const t = setInterval(() => {
      setOran((o) => {
        const yeni = Math.min(1, o + 1 / adim);
        if (yeni >= 1) {
          clearInterval(t);
          onBitti?.();
        }
        return yeni;
      });
    }, sure / adim);
    return () => clearInterval(t);
  }, [azaltilmis, sure, onBitti]);

  const isik: Isik = isikKaristir(bas, son, oran);
  const bant = 6;

  // Doğuşta güneş yükselir, batışta iner.
  const cisimYuksekligi = yon === 'dogum' ? oran : 1 - oran;
  const cisimUst = Math.max(2, (1 - cisimYuksekligi * 0.72) * (yukseklik - 46));
  // Yıldızlar batışta sona doğru, doğuşta başta görünür.
  const yildizOpaklik = yon === 'dogum' ? Math.max(0, 0.55 - oran * 0.8) : Math.max(0, oran - 0.55) * 1.3;

  return (
    <View style={{ height: yukseklik, overflow: 'hidden' }}>
      <Svg width="100%" height={yukseklik}>
        {Array.from({ length: bant }, (_, i) => (
          <Rect
            key={i}
            x="0"
            y={(yukseklik / bant) * i}
            width="100%"
            height={yukseklik / bant + 1}
            fill={i < bant / 2 ? isik.ust : isik.alt}
            opacity={i === Math.floor(bant / 2) ? 0.7 : 1}
          />
        ))}
        {yildizOpaklik > 0.02 &&
          YILDIZLAR.map((y, i) => (
            <Rect
              key={`y${i}`}
              x={`${y.x}%`}
              y={(y.y / 100) * yukseklik}
              width={2}
              height={2}
              fill={C.canvas}
              opacity={yildizOpaklik}
            />
          ))}
      </Svg>

      <View style={{ position: 'absolute', right: '18%', top: cisimUst }}>
        <PixelSprite
          sprite={sprite(yon === 'dogum' ? 'gunes' : oran > 0.7 ? 'ay' : 'gunes')}
          scale={3}
          opacity={0.95}
        />
      </View>

      {/* Ufuk çizgisi: gökyüzünü yere bağlıyor */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: C.ink,
          opacity: 0.8,
        }}
      />
    </View>
  );
}
