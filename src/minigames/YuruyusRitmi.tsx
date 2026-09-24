import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bildirim, Siddet, bildir, secim, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { PixelSprite } from '../ui/PixelSprite';
import { sprite } from '../art';
import { PixelText } from '../ui/PixelText';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

const VURUS = 12;

/** Adım ritmi: her vuruşta dokun. Tempo kademeli hızlanır. */
export function YuruyusRitmi({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const [aktifVurus, setAktifVurus] = useState(-1);
  const [parlak, setParlak] = useState(false);
  const [isaretler, setIsaretler] = useState<number[]>([]);
  const [geriSayim, setGeriSayim] = useState(3);

  const zamanlar = useRef<number[]>([]);
  const kullanilan = useRef<Set<number>>(new Set());
  const puanlar = useRef<number[]>([]);
  const basladi = useRef(false);

  // Tempo her vuruşta biraz artar; zorluk taban hızı belirler.
  const araliklar = useRef(
    Array.from({ length: VURUS }, (_, i) => Math.round((760 - zorluk * 160) * Math.pow(0.965, i))),
  );

  useEffect(() => {
    if (geriSayim > 0) {
      const t = setTimeout(() => setGeriSayim((n) => n - 1), 700);
      return () => clearTimeout(t);
    }
    if (basladi.current) return;
    basladi.current = true;

    const t0 = Date.now() + 400;
    let birikim = 0;
    const zamanlayicilar: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < VURUS; i++) {
      birikim += araliklar.current[i];
      const an = t0 + birikim;
      zamanlar.current.push(an);
      zamanlayicilar.push(
        setTimeout(
          () => {
            setAktifVurus(i);
            setParlak(true);
            secim();
            z.sonra(200, () => setParlak(false));
          },
          an - Date.now(),
        ),
      );
    }

    zamanlayicilar.push(
      setTimeout(
        () => {
          const toplam = puanlar.current.reduce((a, b) => a + b, 0);
          onBitti(clamp01(toplam / VURUS));
        },
        zamanlar.current[VURUS - 1] - Date.now() + 700,
      ),
    );

    return () => zamanlayicilar.forEach(clearTimeout);
  }, [geriSayim, onBitti, z]);

  const dokun = useCallback(() => {
    if (geriSayim > 0) return;
    const simdi = Date.now();

    let enYakin = -1;
    let enKucukFark = Infinity;
    zamanlar.current.forEach((z, i) => {
      if (kullanilan.current.has(i)) return;
      const fark = Math.abs(simdi - z);
      if (fark < enKucukFark) {
        enKucukFark = fark;
        enYakin = i;
      }
    });

    if (enYakin < 0 || enKucukFark > 420) {
      bildir(Bildirim.Error);
      return;
    }

    kullanilan.current.add(enYakin);
    const puan = clamp01(1 - enKucukFark / 300);
    puanlar.current.push(puan);
    setIsaretler((a) => [...a, puan]);
    titret(puan > 0.7 ? Siddet.Medium : Siddet.Rigid);
  }, [geriSayim]);

  const ayak = aktifVurus % 2 === 0 ? 'SOL' : 'SAĞ';

  return (
    <View style={{ alignItems: 'center', gap: SP.lg, width: '100%' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adım at"
        onPress={dokun}
        style={{
          width: '100%',
          minHeight: 250,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: parlak ? C.surfaceHi : C.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {geriSayim > 0 ? (
          <PixelText font="command" size="display" color={C.canvasDim}>
            {String(geriSayim)}
          </PixelText>
        ) : (
          <View style={{ alignItems: 'center', gap: SP.md }}>
            {/* Üç asker aynı anda adım atıyor: bölük halinde yürüyorsun */}
            <View style={{ flexDirection: 'row', gap: SP.md, height: 24 * 4 }}>
              {[0, 1, 2].map((i) => (
                <PixelSprite
                  key={i}
                  sprite={sprite(parlak ? 'askerAdim' : 'asker')}
                  scale={4}
                  opacity={i === 1 ? 1 : 0.55}
                />
              ))}
            </View>
            <PixelText font="command" size="h2" color={parlak ? C.brass : C.canvasFaint}>
              {aktifVurus < 0 ? '···' : ayak}
            </PixelText>
          </View>
        )}
      </Pressable>

      <View style={{ flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: VURUS }, (_, i) => {
          const p = isaretler[i];
          return (
            <View
              key={i}
              style={{
                width: 14,
                height: 14,
                backgroundColor:
                  p === undefined ? C.ink : p > 0.7 ? C.olive : p > 0.35 ? C.brass : C.rust,
                borderWidth: 1,
                borderColor: C.line,
              }}
            />
          );
        })}
      </View>

      <PixelText size="small" color={C.canvasFaint} center>
        Her adımda dokun. Tempo yavaş yavaş artacak.
      </PixelText>
    </View>
  );
}
