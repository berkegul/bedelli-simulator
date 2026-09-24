import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { C, SP } from '../theme';
import { YUZ } from '../art/sprites';
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
 * Tıraş. Lavabo sırası kısa, aynada yüzün. Jileti yüzde sürükledikçe
 * sakal kalkıyor. Aşağı doğru ve sakin çekmek doğrusu; hızlı çekersen
 * kesiyor, ters (yukarı) çekmek kesme eşiğini düşürüyor. Jileti tıraş
 * çantası belirliyor: kalitelisi affediyor, ucuzu daha kolay kesiyor,
 * hiç yoksa Emre'nin kör jiletiyle hem yavaş hem kanlı.
 */

type Jilet = { ad: string; limit: number; verim: number };

function jiletBul(envanter: Envanter): Jilet {
  const k = envanter.trasCantasi;
  if (!k || k.adet <= 0) return { ad: 'Jiletin yok; Emre’nin kör jileti', limit: 700, verim: 0.55 };
  if (k.kalite === 'kaliteli') return { ad: 'Kaliteli jilet', limit: 1900, verim: 1 };
  if (k.kalite === 'ekonomik') return { ad: 'Ucuz jilet', limit: 1000, verim: 0.8 };
  return { ad: 'Jilet', limit: 1400, verim: 1 };
}

/** Sakal yanak, çene ve boyunda: 8. satırdan aşağıdaki ten pikselleri. */
const SAKAL: [number, number][] = [];
YUZ.rows.forEach((satir, y) => {
  if (y < 8) return;
  satir.split('').forEach((ch, x) => {
    if (ch === 's' || ch === 'S') SAKAL.push([x, y]);
  });
});

const SUTUN = YUZ.rows[0].length;
const SATIR = YUZ.rows.length;
/** Jilet ağzı üç piksel: parmağın altındaki ve iki yanındaki. */
const AGIZ = [-1, 0, 1];
/** Ters çekişte kesme eşiği bu kadar düşüyor. */
const TERS_ESIK = 0.6;
const KESIK_CEZA = 0.12;

const anahtar = (x: number, y: number) => `${x}:${y}`;

export function Tiras({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const envanter = useGame((s) => s.envanter);
  const jilet = useMemo(() => jiletBul(envanter), [envanter]);
  const toplam = Math.round((16 - zorluk * 5) * 1000);

  const [en, setEn] = useState(0);
  const [, setSurum] = useState(0);
  const [bicak, setBicak] = useState<{ x: number; y: number } | null>(null);
  const [mesaj, setMesaj] = useState<string | null>(null);

  const kil = useRef<Map<string, number> | null>(null);
  if (!kil.current) {
    kil.current = new Map(SAKAL.map(([x, y]) => [anahtar(x, y), 1]));
  }
  const kesikler = useRef<Set<string>>(new Set());
  /** Bu çekişte değilen hücreler: kesik her hücrede çekiş başına bir kez sınanıyor. */
  const cekis = useRef<Set<string>>(new Set());
  const son = useRef<{ x: number; y: number } | null>(null);
  const bitti = useRef(false);
  const mesajZamani = useRef<ReturnType<typeof setTimeout> | null>(null);

  const olcek = en > 0 ? Math.max(8, Math.min(20, Math.floor(Math.min(en, 320) / SUTUN))) : 0;

  const temizlik = () => {
    let t = 0;
    kil.current!.forEach((v) => (t += 1 - v));
    return t / kil.current!.size;
  };
  const puan = () => temizlik() - kesikler.current.size * KESIK_CEZA;

  const bitir = () => {
    if (bitti.current) return;
    bitti.current = true;
    sure.durdur();
    setBicak(null);
    onBitti(clamp01(puan()));
  };
  const sure = useGeriSayim(toplam, () => bitir());

  const goster = useCallback((m: string) => {
    setMesaj(m);
    if (mesajZamani.current) clearTimeout(mesajZamani.current);
    mesajZamani.current = setTimeout(() => setMesaj(null), 1100);
  }, []);

  const cek = useCallback(
    (x: number, y: number, dx: number, dy: number, hiz: number) => {
      if (bitti.current || !olcek) return;
      const mesafe = Math.hypot(dx, dy);
      if (mesafe < 0.5) return;
      const ters = dy < 0 && Math.abs(dy) > Math.abs(dx) * 0.5;
      const esik = jilet.limit * (ters ? TERS_ESIK : 1);

      const px = Math.floor(x / olcek);
      const py = Math.floor(y / olcek);
      const m = kil.current!;
      let degisti = false;

      for (const ax of AGIZ) {
        const k = anahtar(px + ax, py);
        const v = m.get(k);
        if (v === undefined) continue;

        // Hızlı çekişte kesme ihtimali; her hücrede çekiş başına bir kez.
        if (!cekis.current.has(k)) {
          cekis.current.add(k);
          if (hiz > esik && !kesikler.current.has(k)) {
            const ihtimal = Math.min(0.5, (hiz / esik - 1) * 0.5);
            if (Math.random() < ihtimal) {
              kesikler.current.add(k);
              titret(Siddet.Heavy);
              goster(ters ? 'Ters çektin, kesti.' : 'Çok hızlı. Kesti.');
            }
          }
        }

        if (v > 0) {
          // Bir hücreyi baştan sona geçmek kılın çoğunu alıyor.
          m.set(k, Math.max(0, v - (mesafe / olcek) * 0.9 * jilet.verim));
          degisti = true;
        }
      }

      if (degisti) {
        setSurum((s) => s + 1);
        let kalan = 0;
        m.forEach((v) => (kalan += v > 0.05 ? 1 : 0));
        if (kalan === 0) z.sonra(400, bitir);
      }
    },
    // bitir her çizimde yeniden kuruluyor ama yalnızca ref'lere dokunuyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [goster, jilet.limit, jilet.verim, olcek],
  );

  const jest = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .minDistance(0)
        .manualActivation(true)
        .onTouchesDown((_e, durum) => durum.activate())
        .onBegin((e) => {
          son.current = { x: e.x, y: e.y };
          cekis.current = new Set();
          setBicak({ x: e.x, y: e.y });
        })
        .onUpdate((e) => {
          const s = son.current;
          son.current = { x: e.x, y: e.y };
          setBicak({ x: e.x, y: e.y });
          if (!s) return;
          cek(e.x, e.y, e.x - s.x, e.y - s.y, Math.hypot(e.velocityX, e.velocityY));
        })
        .onFinalize(() => {
          son.current = null;
          setBicak(null);
        }),
    [cek],
  );

  const yuzde = Math.round(temizlik() * 100);
  const kesik = kesikler.current.size;
  const az = sure.oran < 0.3;

  return (
    <View style={{ gap: SP.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          {`TEMİZ %${yuzde}`}
        </PixelText>
        <PixelText font="command" size="h3" color={kesik ? C.rust : C.canvasFaint}>
          {`KESİK ${kesik}`}
        </PixelText>
      </View>
      <View style={{ height: 8, backgroundColor: C.ink, borderWidth: 1, borderColor: C.line }}>
        <View
          style={{ height: '100%', width: `${sure.oran * 100}%`, backgroundColor: az ? C.rust : C.brass }}
        />
      </View>
      <PixelText size="small" color={jilet.limit < 1400 ? C.rust : C.canvasDim} line="snug">
        {jilet.ad}
      </PixelText>

      <View onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))} style={[{ alignItems: 'center' }, SECILMEZ]}>
        {olcek > 0 && (
          <GestureDetector gesture={jest}>
            <View
              accessibilityLabel="Yüzün, jileti aşağı doğru çek"
              style={{ width: SUTUN * olcek, height: SATIR * olcek }}
            >
              <View pointerEvents="none">
                <PixelSprite sprite={YUZ} scale={olcek} />
              </View>

              {SAKAL.map(([x, y]) => {
                const k = anahtar(x, y);
                const v = kil.current!.get(k)!;
                const kesildi = kesikler.current.has(k);
                if (v <= 0.02 && !kesildi) return null;
                return (
                  <View
                    key={k}
                    pointerEvents="none"
                    style={{ position: 'absolute', left: x * olcek, top: y * olcek, width: olcek, height: olcek }}
                  >
                    {v > 0.02 && (
                      <View
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: 0,
                          backgroundColor: '#3A3128',
                          opacity: 0.7 * v,
                        }}
                      />
                    )}
                    {kesildi && (
                      <View
                        style={{
                          position: 'absolute',
                          left: olcek * 0.3,
                          top: olcek * 0.3,
                          width: olcek * 0.4,
                          height: olcek * 0.4,
                          backgroundColor: C.rust,
                        }}
                      />
                    )}
                  </View>
                );
              })}

              {/* Jilet parmağın hemen üstünde; ağzı yüze bakıyor */}
              {bicak && (
                <View
                  pointerEvents="none"
                  style={{ position: 'absolute', left: bicak.x - olcek * 1.5, top: bicak.y - olcek * 0.6 }}
                >
                  <View style={{ width: olcek * 3, height: olcek * 0.6, backgroundColor: '#B8C0C8', borderWidth: 1, borderColor: C.ink }} />
                  <View
                    style={{
                      alignSelf: 'center',
                      width: olcek * 0.5,
                      height: olcek * 1.6,
                      backgroundColor: C.steel,
                      borderWidth: 1,
                      borderColor: C.ink,
                    }}
                  />
                </View>
              )}
            </View>
          </GestureDetector>
        )}
      </View>

      <View style={{ height: 22, justifyContent: 'center' }}>
        {mesaj ? (
          <PixelText size="small" color={C.rust} center>
            {mesaj}
          </PixelText>
        ) : (
          <PixelText size="small" color={C.canvasFaint} center>
            Jileti aşağı doğru, sakin çek.
          </PixelText>
        )}
      </View>
    </View>
  );
}
