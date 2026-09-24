import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bildirim, Siddet, bildir, secim, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { ASKER_YAN, ASKER_YAN_ADIM, CAVUS_BAGIRIYOR, CAVUS_HAZIROL } from '../art/sahne/alan';
import { PixelText } from '../ui/PixelText';
import { PikselKatman, Sahne, benek, hash, type Piksel } from '../ui/sahne';
import { Balon, Basan, zeminUstu } from './alanSahnesi';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

const VURUS = 12;

/**
 * Adım ritmi: her vuruşta dokun. Tempo kademeli hızlanır. Sahne arazi
 * yürüyüşü: toprak yolda kolon, yanda sayan Çavuş, adım attıkça manzara
 * (tepeler, kavaklar, yol kenarı) farklı hızlarda akıyor.
 */
export function YuruyusRitmi({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const [aktifVurus, setAktifVurus] = useState(-1);
  const [parlak, setParlak] = useState(false);
  const [isaretler, setIsaretler] = useState<number[]>([]);
  const [geriSayim, setGeriSayim] = useState(3);
  const [en, setEn] = useState(0);

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
        setTimeout(() => {
          setAktifVurus(i);
          setParlak(true);
          secim();
          z.sonra(200, () => setParlak(false));
        }, an - Date.now()),
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
  const adim = aktifVurus + 1;
  const g = zeminUstu(SAHNE_H, U, ZEMIN_ORANI);

  return (
    <View style={{ alignItems: 'center', gap: SP.md, width: '100%' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adım at"
        onPress={dokun}
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={{ width: '100%', borderWidth: BORDER, borderColor: parlak ? C.brass : C.ink }}
      >
        <Sahne
          yukseklik={SAHNE_H}
          u={U}
          zemin="toprak"
          zeminOrani={ZEMIN_ORANI}
          saat="09:30"
          ufukVar={false}
          tohum={11}
        >
          {en > 0 && (
            <>
              {/*
                Manzara her adımda bir hücre akıyor: uzak tepeler yavaş,
                kavaklar orta, yol ve otlar hızlı. Kayma JS'te tam hücre;
                web'de de yerli yerinde, piksel ızgarası bozulmuyor.
              */}
              <Kayan
                u={U}
                en={en}
                adim={adim}
                hiz={1}
                top={g - 18 * U}
                yukseklik={18}
                uret={tepeler}
              />
              <Kayan
                u={U}
                en={en}
                adim={adim}
                hiz={2}
                top={g - 22 * U}
                yukseklik={22}
                uret={agaclar}
              />
              <Kayan u={U} en={en} adim={adim} hiz={4} top={g} yukseklik={ZH} uret={yol} />
              <Kayan
                u={U}
                en={en}
                adim={adim}
                hiz={6}
                top={SAHNE_H - 12 * U}
                yukseklik={12}
                uret={onOtlar}
              />
            </>
          )}
          {KOLON.map((x, i) => (
            <React.Fragment key={i}>
              {parlak && (
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: `${x - 7}%`,
                    top: g + 44 - 3 * U,
                    flexDirection: 'row',
                    gap: U,
                  }}
                >
                  <View
                    style={{
                      width: 3 * U,
                      height: 2 * U,
                      backgroundColor: '#8A7654',
                      opacity: 0.55,
                    }}
                  />
                  <View
                    style={{
                      width: 2 * U,
                      height: 2 * U,
                      marginTop: -U,
                      backgroundColor: '#8A7654',
                      opacity: 0.4,
                    }}
                  />
                </View>
              )}
              <Basan
                sprite={parlak ? ASKER_YAN_ADIM : ASKER_YAN}
                u={U}
                x={x}
                alt={g + 44}
                nefes={false}
                opaklik={i === BEN ? 1 : 0.92}
              />
            </React.Fragment>
          ))}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: `${KOLON[BEN]}%`,
              top: g + 44 - 24 * U - 6 * U,
              marginLeft: -2 * U,
            }}
          >
            <View style={{ width: 4 * U, height: U, backgroundColor: C.brass }} />
            <View style={{ width: 2 * U, height: U, marginLeft: U, backgroundColor: C.brass }} />
          </View>

          {/* Çavuş kolonun yanında, sayıyor */}
          <Basan
            sprite={parlak ? CAVUS_BAGIRIYOR : CAVUS_HAZIROL}
            u={U - 1}
            x={90}
            alt={g + 22}
            nefes={false}
          />
          {geriSayim > 0 ? (
            <Balon
              metin={`${geriSayim}…`}
              u={U}
              kuyruk="sag"
              buyuk
              style={{ right: '3%', top: g - 28 * U }}
            />
          ) : (
            aktifVurus >= 0 &&
            parlak && (
              <Balon
                metin={`${ayak}!`}
                u={U}
                kuyruk="sag"
                buyuk
                style={{ right: '3%', top: g - 28 * U }}
              />
            )
          )}
        </Sahne>
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

// ─────────────────────────────────────────── sahne

const U = 3;
const SAHNE_H = 250;
const ZEMIN_ORANI = 0.4;
/** Zeminin hücre yüksekliği (Sahne'nin hesabıyla aynı). */
const ZH = Math.round(Math.ceil(SAHNE_H / U) * ZEMIN_ORANI);
/** Kolondaki askerler (yüzde); BEN sensin. */
const KOLON = [16, 34, 52, 70];
const BEN = 2;

/** Uzak tepeler: iki tonlu yumuşak sırtlar. */
function tepeler(w: number, h: number): Piksel[] {
  const out: Piksel[] = [];
  for (let x = 0; x < w; x++) {
    const y1 = Math.round(h * 0.45 + Math.sin(x / 9) * 3 + Math.sin(x / 4.3) * 1.5);
    out.push({ x, y: y1, w: 1, h: h - y1, c: '#6A7358' });
    const y2 = Math.round(h * 0.7 + Math.sin(x / 6 + 2) * 2);
    out.push({ x, y: y2, w: 1, h: h - y2, c: '#56604A' });
  }
  return out;
}

/** Orta plan: seyrek kavaklar ve çalılar. */
function agaclar(w: number, h: number): Piksel[] {
  const out: Piksel[] = [];
  for (let x = 3; x < w - 6; x += 17 + Math.floor(hash(x, 1, 5) * 9)) {
    const boy = 10 + Math.floor(hash(x, 2, 5) * 8);
    // Kavak: ince, uzun tepe
    out.push({ x: x + 2, y: h - 4, w: 1, h: 4, c: '#4A3524' });
    for (let y = h - 4 - boy; y < h - 4; y++) {
      const ic = Math.round(Math.sin(((y - (h - 4 - boy)) / boy) * Math.PI) * 2.4);
      out.push({ x: x + 2 - ic, y, w: 2 * ic + 1, h: 1, c: y % 3 ? '#4E5B2C' : '#5D6B34' });
    }
    // Yanında çalı
    out.push(
      { x: x + 7, y: h - 3, w: 4, h: 3, c: '#46512A' },
      { x: x + 8, y: h - 4, w: 2, h: 1, c: '#56622F' },
    );
  }
  return out;
}

/**
 * Zeminin tamamı: arka kenarda ot sırası, ortada açık toprak yol ve iki
 * tekerlek izi, ön kenarda koyu toprak. Sahnenin kendi zemini üstünü
 * kapatıyor ki kadrajda boşluk kalmasın.
 */
function yol(w: number, h: number): Piksel[] {
  const out: Piksel[] = [{ x: 0, y: 0, w, h, c: '#5B4B31' }];
  out.push({ x: 0, y: 0, w, h: 3, c: '#46512A' });
  out.push(...benek({ x: 0, y: 0, w, h: 4 }, [{ c: '#5D6B34', oran: 0.3 }], 21, { w: 1, h: 2 }));
  // Yol şeridi
  const y0 = 6;
  const y1 = h - 7;
  out.push({ x: 0, y: y0, w, h: y1 - y0, c: '#7A6446' });
  out.push(
    ...benek(
      { x: 0, y: y0, w, h: y1 - y0 },
      [
        { c: '#8A7654', oran: 0.08 },
        { c: '#6A553A', oran: 0.08 },
        { c: '#9A8A6A', oran: 0.015 },
      ],
      22,
    ),
  );
  out.push({ x: 0, y: y0 + 4, w, h: 1, c: '#5E4B32' }, { x: 0, y: y1 - 5, w, h: 1, c: '#5E4B32' });
  out.push({ x: 0, y: y0, w, h: 1, c: '#4C3E27' }, { x: 0, y: y1, w, h: 1, c: '#4C3E27' });
  out.push(...benek({ x: 0, y: y1 + 1, w, h: h - y1 - 1 }, [{ c: '#4C3E27', oran: 0.1 }], 23));
  return out;
}

/** Ön plan: yolun bu yanındaki otlar, hızlı akıyor. */
function onOtlar(w: number, h: number): Piksel[] {
  const out: Piksel[] = [];
  for (let x = 0; x < w; x += 2 + Math.floor(hash(x, 3, 9) * 5)) {
    const boy = 2 + Math.floor(hash(x, 4, 9) * (h - 4));
    out.push({ x, y: h - boy, w: 1, h: boy, c: hash(x, 5, 9) < 0.5 ? '#5D6B34' : '#46512A' });
  }
  return out;
}

/**
 * Sonsuz kayan şerit: desen ekran genişliğinde üretilip yan yana iki kez
 * basılıyor; adım × hız hücre sola kayıyor, genişlik kadar gidince başa.
 * İki kopya birbirine değdiği için döngüde boşluk kalmıyor.
 */
function Kayan({
  u,
  en,
  adim,
  hiz,
  top,
  yukseklik,
  uret,
}: {
  u: number;
  en: number;
  adim: number;
  hiz: number;
  top: number;
  yukseklik: number;
  uret: (w: number, h: number) => Piksel[];
}) {
  const W = Math.ceil(en / u) + 1;
  const desen = useMemo(() => uret(W, yukseklik), [W, yukseklik, uret]);
  const kayma = ((Math.max(0, adim) * hiz) % W) * u;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: -kayma,
        top,
        width: 2 * W * u,
        height: yukseklik * u,
        flexDirection: 'row',
      }}
    >
      <PikselKatman pikseller={desen} u={u} w={W} h={yukseklik} />
      <PikselKatman pikseller={desen} u={u} w={W} h={yukseklik} />
    </View>
  );
}
