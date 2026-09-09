import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { PixelText } from '../ui/PixelText';
import { clamp01, type MiniOyunProps } from './types';

const SIRA = [
  'Şarjör',
  'Kurma kolu',
  'Mekanizma kapağı',
  'Mekanizma',
  'Geri getirici yay',
  'Dipçik',
];

function karistir<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Sıralama oyunu: parçaları sökme sırasına göre seç. Yanlış seçim puan götürür. */
export function SilahSokme({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const parcalar = useMemo(() => karistir(SIRA), []);
  const [adim, setAdim] = useState(0);
  const [yanlisSecim, setYanlisSecim] = useState<string | null>(null);
  const hataSayisi = useRef(0);
  const baslangic = useRef(Date.now());

  const sureSiniri = 26000 - zorluk * 7000;

  const sec = useCallback(
    (parca: string) => {
      if (parca === SIRA[adim]) {
        titret(Siddet.Medium);
        setYanlisSecim(null);
        const sonraki = adim + 1;
        setAdim(sonraki);

        if (sonraki >= SIRA.length) {
          const gecenSure = Date.now() - baslangic.current;
          const dogruluk = clamp01(1 - hataSayisi.current / (SIRA.length * 1.5));
          const hiz = clamp01(1 - gecenSure / sureSiniri);
          onBitti(clamp01(dogruluk * 0.75 + hiz * 0.25));
        }
      } else {
        bildir(Bildirim.Error);
        hataSayisi.current += 1;
        setYanlisSecim(parca);
        setTimeout(() => setYanlisSecim(null), 420);
      }
    },
    [adim, onBitti, sureSiniri],
  );

  return (
    <View style={{ gap: SP.lg, width: '100%' }}>
      <View style={{ alignItems: 'center', gap: SP.xs }}>
        <PixelText font="command" size="h3" color={C.canvasDim}>
          {`${adim} / ${SIRA.length} PARÇA`}
        </PixelText>
        <PixelText size="small" color={C.canvasFaint} center>
          Sökme sırasına göre seç. Yanlış parça ceza puanı yazar.
        </PixelText>
      </View>

      <View style={{ gap: SP.sm }}>
        {parcalar.map((p) => {
          const sokuldu = SIRA.indexOf(p) < adim;
          const yanlis = yanlisSecim === p;
          return (
            <Pressable
              key={p}
              accessibilityRole="button"
              accessibilityState={{ disabled: sokuldu }}
              disabled={sokuldu}
              onPress={() => sec(p)}
              style={{
                borderWidth: BORDER,
                borderColor: yanlis ? C.rust : C.ink,
                backgroundColor: sokuldu ? C.bg : yanlis ? '#4A2018' : C.surface,
                paddingVertical: SP.md,
                paddingHorizontal: SP.lg,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.md,
                opacity: sokuldu ? 0.45 : 1,
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: BORDER,
                  borderColor: sokuldu ? C.olive : C.line,
                  backgroundColor: sokuldu ? C.olive : 'transparent',
                }}
              />
              <PixelText
                font="bodyMed"
                size="lead"
                color={sokuldu ? C.canvasFaint : yanlis ? C.rust : C.canvas}
                style={{ flex: 1 }}
              >
                {p}
              </PixelText>
              {sokuldu && (
                <PixelText font="command" size="body" color={C.olive}>
                  {String(SIRA.indexOf(p) + 1)}
                </PixelText>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
