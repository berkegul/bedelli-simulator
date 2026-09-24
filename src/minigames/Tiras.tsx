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
import { JILET, ayna, fayans, floresan, lavabo } from '../art/sahne/lavabo';
import { IsikHavuzu, Ortu, PikselKatman, Vinyet, type Piksel } from '../ui/sahne';

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
const yeniKil = () => new Map(SAKAL.map(([x, y]) => [anahtar(x, y), 1]));

const temizlikOrani = (kil: Map<string, number>) => {
  let t = 0;
  kil.forEach((v) => (t += 1 - v));
  return t / kil.size;
};

export function Tiras({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const envanter = useGame((s) => s.envanter);
  const jilet = useMemo(() => jiletBul(envanter), [envanter]);
  const toplam = Math.round((16 - zorluk * 5) * 1000);

  const [en, setEn] = useState(0);
  // Çizim bu kopyadan; jest mantığı ref'teki canlı haritayla çalışıyor.
  const [gorunum, setGorunum] = useState(() => ({
    kil: yeniKil(),
    kesikler: new Set<string>(),
  }));
  const [bicak, setBicak] = useState<{ x: number; y: number } | null>(null);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [durdu, setDurdu] = useState(false);

  const kil = useRef<Map<string, number> | null>(null);
  const harita = () => (kil.current ??= yeniKil());
  const kesikler = useRef<Set<string>>(new Set());
  /** Bu çekişte değilen hücreler: kesik her hücrede çekiş başına bir kez sınanıyor. */
  const cekis = useRef<Set<string>>(new Set());
  const son = useRef<{ x: number; y: number } | null>(null);
  const bitti = useRef(false);
  const gorunumKesik = useRef(0);
  const mesajZamani = useRef<ReturnType<typeof setTimeout> | null>(null);

  const olcek = en > 0 ? Math.max(8, Math.min(20, Math.floor(Math.min(en, 320) / SUTUN))) : 0;

  // Sahne: fayans duvar, üstte floresan, çerçeveli ayna, aynada yüz, altta lavabo.
  const su = Math.max(2, Math.floor(olcek / 4));
  const cer = Math.round(olcek * 0.75);
  const fw = SUTUN * olcek;
  const fh = SATIR * olcek;
  const fx = Math.round((en - fw) / 2);
  const aynaUst = Math.round(olcek * 1.4);
  const yuzUst = aynaUst + cer;
  const aynaAlt = yuzUst + fh + cer;
  const sahneH = aynaAlt + Math.round(olcek * 2);
  const sahne = useMemo<Piksel[]>(() => {
    if (!olcek) return [];
    const c = (n: number) => Math.round(n / su);
    const W = Math.ceil(en / su);
    const H = Math.ceil(sahneH / su);
    return [
      ...fayans(W, H),
      ...floresan(c(fx + fw * 0.2), c(olcek * 0.3), c(fw * 0.6)),
      ...ayna(c(fx - cer), c(aynaUst), c(fw + 2 * cer), c(aynaAlt - aynaUst)),
      ...lavabo(c(fx - cer * 2), c(aynaAlt + olcek * 0.3), c(fw + 4 * cer), c(olcek * 1.6)),
    ];
  }, [olcek, su, en, sahneH, fx, fw, cer, aynaUst, aynaAlt]);

  const bitir = () => {
    if (bitti.current) return;
    bitti.current = true;
    setDurdu(true);
    setBicak(null);
    onBitti(clamp01(temizlikOrani(harita()) - kesikler.current.size * KESIK_CEZA));
  };
  const sure = useGeriSayim(toplam, bitir, durdu);

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
      const m = harita();
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

      if (degisti || kesikler.current.size !== gorunumKesik.current) {
        gorunumKesik.current = kesikler.current.size;
        setGorunum({ kil: new Map(m), kesikler: new Set(kesikler.current) });
        let kalan = 0;
        m.forEach((v) => (kalan += v > 0.05 ? 1 : 0));
        if (kalan === 0) z.sonra(400, bitir);
      }
    },
    // bitir her çizimde yeniden kuruluyor ama yalnızca ref'lere dokunuyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [goster, jilet.limit, jilet.verim, olcek],
  );

  // Jest kurucusu geri çağrıları saklıyor, render sırasında çağırmıyor;
  // derleyici bunu bilemediği için ref okuması sanıyor (yanlış pozitif).
  /* eslint-disable react-hooks/refs */
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
  /* eslint-enable react-hooks/refs */

  const yuzde = Math.round(temizlikOrani(gorunum.kil) * 100);
  const kesik = gorunum.kesikler.size;
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
          style={{
            height: '100%',
            width: `${sure.oran * 100}%`,
            backgroundColor: az ? C.rust : C.brass,
          }}
        />
      </View>
      <PixelText size="small" color={jilet.limit < 1400 ? C.rust : C.canvasDim} line="snug">
        {jilet.ad}
      </PixelText>

      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={[{ alignItems: 'center' }, SECILMEZ]}
      >
        {olcek > 0 && (
          <View
            style={{
              width: en,
              height: sahneH,
              borderWidth: 2,
              borderColor: C.ink,
              overflow: 'hidden',
              backgroundColor: '#BDBAA6',
            }}
          >
            <PikselKatman
              pikseller={sahne}
              u={su}
              w={Math.ceil(en / su)}
              h={Math.ceil(sahneH / su)}
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
            {/* Sabah 05:40, floresan yeni yanmış: loş, soğuk ışık */}
            <Ortu renk="#1A2230" opaklik={0.28} />
            <IsikHavuzu
              x={en / 2}
              y={olcek}
              yaricap={Math.round(en / su / 2.4)}
              u={su}
              renk="#E6F2FF"
              guc={0.2}
              basik={0.9}
            />

            <View style={{ position: 'absolute', left: fx, top: yuzUst }}>
              <GestureDetector gesture={jest}>
                <View
                  accessibilityLabel="Yüzün, jileti aşağı doğru çek"
                  style={{ width: fw, height: fh }}
                >
                  <View pointerEvents="none">
                    <PixelSprite sprite={YUZ} scale={olcek} />
                  </View>

                  {SAKAL.map(([x, y]) => {
                    const k = anahtar(x, y);
                    const v = gorunum.kil.get(k)!;
                    const kesildi = gorunum.kesikler.has(k);
                    if (v <= 0.02 && !kesildi) return null;
                    return (
                      <View
                        key={k}
                        pointerEvents="none"
                        style={{
                          position: 'absolute',
                          left: x * olcek,
                          top: y * olcek,
                          width: olcek,
                          height: olcek,
                        }}
                      >
                        {v > 0.02 && (
                          <>
                            {/* Köpük: jilet geçtikçe kalkıyor, altında sakal */}
                            <View
                              style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                backgroundColor: (x + y) % 3 === 0 ? '#D8D4C8' : '#ECE8DE',
                                opacity: 0.92 * v,
                              }}
                            />
                            {(x * 7 + y) % 4 === 0 && (
                              <View
                                style={{
                                  position: 'absolute',
                                  left: olcek * 0.2,
                                  top: olcek * 0.55,
                                  width: Math.max(2, olcek * 0.25),
                                  height: Math.max(2, olcek * 0.25),
                                  backgroundColor: '#3A3128',
                                  opacity: 0.6 * v,
                                }}
                              />
                            )}
                          </>
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
                      style={{
                        position: 'absolute',
                        left: bicak.x - 5 * Math.max(2, Math.round(olcek / 4)),
                        top: bicak.y - 1.5 * Math.max(2, Math.round(olcek / 4)),
                      }}
                    >
                      <PixelSprite sprite={JILET} scale={Math.max(2, Math.round(olcek / 4))} />
                    </View>
                  )}
                </View>
              </GestureDetector>
            </View>
            <Vinyet u={su} guc={0.18} />
          </View>
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
