import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { C, SP } from '../theme';
import { BOOT } from '../art/sprites';
import type { Envanter } from '../engine/types';
import { SECILMEZ } from '../screens/DolapYerlesimi';
import { useGame } from '../store/gameStore';
import { Siddet, titret } from '../ui/haptik';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { useGeriSayim } from './geriSayim';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

/**
 * Postal parlatma. Ranzanın altındaki iki postal dünkü çamurla mat.
 * Parmağınla ovdukça deri açılıyor, tamamen temizlenen yerde parıltı
 * beliriyor. Bot bakım seti varsa boya ve süngerle; yoksa elindeki bezle —
 * bez hem yavaş hem de bir yerden sonra daha fazla parlatmıyor.
 */

type Arac = { ad: string; verim: number; tavan: number };

function aracBul(envanter: Envanter): Arac {
  const k = envanter.botBakim;
  if (!k || k.adet <= 0) return { ad: 'Boyan yok, elindeki bezle', verim: 0.55, tavan: 0.6 };
  if (k.kalite === 'kaliteli') return { ad: 'Kaliteli boya ve sünger', verim: 1.3, tavan: 1 };
  if (k.kalite === 'ekonomik') return { ad: 'Ucuz boya, dağılan sünger', verim: 0.85, tavan: 0.8 };
  return { ad: 'Boya ve sünger', verim: 1, tavan: 1 };
}

/** Çamur yalnızca deride ('b'): dış hat ve toka kirlenmiyor. */
const DERI: [number, number][] = [];
BOOT.rows.forEach((satir, y) =>
  satir.split('').forEach((ch, x) => {
    if (ch === 'b') DERI.push([x, y]);
  }),
);

const SUTUN = BOOT.rows[0].length;
const SATIR = BOOT.rows.length;
/** İki postal arası, sprite pikseli cinsinden. */
const ARA = 2;
/** Parmağın altındaki hücre tam, dört komşusu yarım ağırlıkla ovuluyor. */
const FIRCA: [number, number, number][] = [
  [0, 0, 1],
  [1, 0, 0.5],
  [-1, 0, 0.5],
  [0, 1, 0.5],
  [0, -1, 0.5],
];
/** Bir piksel ovmanın hücreden sildiği çamur. */
const SILME = 0.006;

const anahtar = (p: number, x: number, y: number) => `${p}:${x}:${y}`;

export function PostalParlatma({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const envanter = useGame((s) => s.envanter);
  const arac = useMemo(() => aracBul(envanter), [envanter]);
  const taban = 1 - arac.tavan;
  const toplam = Math.round((14 - zorluk * 4) * 1000);

  const [en, setEn] = useState(0);
  const [, setSurum] = useState(0);

  const kir = useRef<Map<string, number> | null>(null);
  if (!kir.current) {
    const m = new Map<string, number>();
    for (const p of [0, 1]) for (const [x, y] of DERI) m.set(anahtar(p, x, y), 1);
    kir.current = m;
  }

  const son = useRef<{ x: number; y: number } | null>(null);
  const parlayan = useRef(0);
  const sonTitresim = useRef(0);
  const bitti = useRef(false);

  const olcek = en > 0 ? Math.max(6, Math.min(14, Math.floor(en / (SUTUN * 2 + ARA)))) : 0;

  const puan = () => {
    let t = 0;
    kir.current!.forEach((v) => (t += 1 - v));
    return t / kir.current!.size;
  };

  const bitir = () => {
    if (bitti.current) return;
    bitti.current = true;
    sure.durdur();
    onBitti(clamp01(puan()));
  };
  const sure = useGeriSayim(toplam, () => bitir());

  const ov = useCallback(
    (x: number, y: number, mesafe: number) => {
      if (bitti.current || !olcek) return;
      const px = Math.floor(x / olcek);
      const py = Math.floor(y / olcek);
      const p = px < SUTUN ? 0 : px >= SUTUN + ARA ? 1 : -1;
      if (p < 0) return;
      const lx = p === 1 ? px - SUTUN - ARA : px;

      const m = kir.current!;
      let degisti = false;
      for (const [dx, dy, agirlik] of FIRCA) {
        const k = anahtar(p, lx + dx, py + dy);
        const v = m.get(k);
        if (v === undefined || v <= taban) continue;
        m.set(k, Math.max(taban, v - mesafe * SILME * agirlik * arac.verim));
        degisti = true;
      }
      if (!degisti) return;

      // Yeni bir hücre parladıysa hafif bir tık; sürekli titremesin diye aralıklı.
      let parlak = 0;
      m.forEach((v) => v <= taban + 0.05 && (parlak += 1));
      if (parlak > parlayan.current && Date.now() - sonTitresim.current > 120) {
        titret(Siddet.Light);
        sonTitresim.current = Date.now();
      }
      parlayan.current = parlak;
      setSurum((s) => s + 1);

      // Daha fazla parlatılamıyorsa beklemeye gerek yok.
      if (parlak === m.size) z.sonra(400, bitir);
    },
    // bitir her çizimde yeniden kuruluyor ama yalnızca ref'lere dokunuyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arac.verim, olcek, taban],
  );

  const jest = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .minDistance(0)
        // Geliştirme alanında sahne kaydırılabilir bir sayfada; ovmak sayfayı kaydırmasın.
        .manualActivation(true)
        .onTouchesDown((_e, durum) => durum.activate())
        .onBegin((e) => {
          son.current = { x: e.x, y: e.y };
        })
        .onUpdate((e) => {
          const s = son.current;
          son.current = { x: e.x, y: e.y };
          if (!s) return;
          const d = Math.hypot(e.x - s.x, e.y - s.y);
          if (d > 0) ov(e.x, e.y, d);
        })
        .onFinalize(() => {
          son.current = null;
        }),
    [ov],
  );

  const yuzde = Math.round(puan() * 100);
  const az = sure.oran < 0.3;

  return (
    <View style={{ gap: SP.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          PARLAKLIK
        </PixelText>
        <PixelText font="command" size="h3" color={yuzde >= 80 ? C.olive : C.brass}>
          {`%${yuzde}`}
        </PixelText>
      </View>
      <View style={{ height: 8, backgroundColor: C.ink, borderWidth: 1, borderColor: C.line }}>
        <View
          style={{ height: '100%', width: `${sure.oran * 100}%`, backgroundColor: az ? C.rust : C.brass }}
        />
      </View>
      <PixelText size="small" color={arac.tavan < 1 ? C.rust : C.canvasDim} line="snug">
        {arac.tavan < 1 ? `${arac.ad} · en fazla %${Math.round(arac.tavan * 100)} parlar` : arac.ad}
      </PixelText>

      <View onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))} style={[{ alignItems: 'center' }, SECILMEZ]}>
        {olcek > 0 && (
          <GestureDetector gesture={jest}>
            <View
              accessibilityLabel="Postallar, parmağınla ov"
              style={{ width: (SUTUN * 2 + ARA) * olcek, height: SATIR * olcek }}
            >
              {[0, 1].map((p) => (
                <View
                  key={p}
                  pointerEvents="none"
                  style={{ position: 'absolute', left: p * (SUTUN + ARA) * olcek, top: 0 }}
                >
                  <PixelSprite sprite={BOOT} scale={olcek} />
                </View>
              ))}
              {[0, 1].flatMap((p) =>
                DERI.map(([x, y]) => {
                  const v = kir.current!.get(anahtar(p, x, y))!;
                  const sol = (p * (SUTUN + ARA) + x) * olcek;
                  const parlak = v <= taban + 0.05 && (x + y + p) % 3 === 0;
                  return (
                    <View
                      key={anahtar(p, x, y)}
                      pointerEvents="none"
                      style={{ position: 'absolute', left: sol, top: y * olcek, width: olcek, height: olcek }}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: 0,
                          backgroundColor: '#8A7A5E',
                          opacity: v * 0.85,
                        }}
                      />
                      {parlak && arac.tavan >= 1 && (
                        <View
                          style={{
                            position: 'absolute',
                            left: 1,
                            top: 1,
                            width: Math.max(2, olcek / 3),
                            height: Math.max(2, olcek / 3),
                            backgroundColor: C.canvas,
                            opacity: 0.85,
                          }}
                        />
                      )}
                    </View>
                  );
                }),
              )}
            </View>
          </GestureDetector>
        )}
      </View>

      <PixelText size="small" color={C.canvasFaint} center line="snug">
        Parmağınla ileri geri ov. İki postal da parlamadan Onbaşı'nın önüne çıkma.
      </PixelText>
    </View>
  );
}
