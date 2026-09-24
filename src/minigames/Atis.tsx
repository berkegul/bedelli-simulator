import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { Siddet, titret } from '../ui/haptik';
import { PixelSprite, type SpriteDef } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { useZamanlayici } from '../ui/useZamanlayici';
import { clamp01, type MiniOyunProps } from './types';

const MERMI = 5;
/** Hedef ızgarası: HUCRE × HUCRE piksel, her piksel PX nokta. */
const HUCRE = 41;
const PX = 6;
const BOY = HUCRE * PX;
const MERKEZ = BOY / 2;
/** Halka yarıçapları (piksel), içten dışa; dışı karton. */
const HALKALAR = [3, 7, 11, 15, 19];

/** Nefes tutulabilen süre; bitince nişangâh titremeye başlıyor. */
const NEFES_MS = 2600;
/** Nefesin boşken tamamen dolma süresi. */
const DOLMA_MS = 1400;

/**
 * Halkalar piksel ızgarası olarak üretiliyor: oyunun geri kalanı gibi tam
 * sayı kareler, daire değil. PixelSprite yatay aynı renkleri birleştiriyor.
 */
function hedefSprite(): SpriteDef {
  const rows: string[] = [];
  const o = (HUCRE - 1) / 2;
  for (let y = 0; y < HUCRE; y++) {
    let satir = '';
    for (let x = 0; x < HUCRE; x++) {
      const d = Math.hypot(x - o, y - o);
      // +0.35: tam yarıçaptaki eksen noktaları tek piksel çıkıntı yapmasın.
      const halka = HALKALAR.findIndex((r) => d < r + 0.35);
      satir += halka === -1 ? 'k' : halka === 0 ? 'm' : halka % 2 ? 'w' : 'g';
    }
    rows.push(satir);
  }
  return { palette: { k: '#5B4A31', w: C.canvas, g: '#8C8266', m: C.rust }, rows };
}

/** İsabetin puanı: merkez 1, her halka biraz daha az, karton 0. */
function isabetPuani(x: number, y: number) {
  const d = Math.hypot(x - MERKEZ, y - MERKEZ) / PX;
  const halka = HALKALAR.findIndex((r) => d < r + 0.35);
  return halka === -1 ? 0 : 1 - halka * 0.18;
}

/**
 * Atış poligonu. Nişangâh nefesle salınıyor. Basılı tutmak nefesi tutmak:
 * salınım daralıyor ama nefes çubuğu tükeniyor; biterse eller titriyor.
 * Bırakınca tetik çekiliyor. Acele eden geniş salınımda ateş ediyor,
 * bekleyen nefessiz kalıyor. Asıl iş doğru anı seçmek.
 *
 * Konum animasyondan değil saatten okunuyor: bırakma anıyla ekrandaki
 * nişangâh arasında kayma olmasın.
 */
export function Atis({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const sprite = useMemo(() => hedefSprite(), []);

  const [azaltilmis, setAzaltilmis] = useState(false);
  useEffect(() => {
    let canli = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => canli && setAzaltilmis(v));
    return () => {
      canli = false;
    };
  }, []);

  const [nisan, setNisan] = useState({ x: MERKEZ, y: MERKEZ });
  const [nefes, setNefes] = useState(1);
  const [delikler, setDelikler] = useState<{ x: number; y: number; puan: number }[]>([]);
  const [son, setSon] = useState<number | null>(null);

  const t0 = useRef(0);
  const tutuyor = useRef(false);
  const nefesRef = useRef(1);
  const sonKare = useRef(0);
  /** Tepme: atıştan sonra nişangâh yukarı sıçrayıp yerine oturuyor. */
  const tepme = useRef(0);
  const bitti = useRef(false);
  const genislik = useRef(1);

  // Salınım genliği zorlukla büyüyor; hareket azaltma açıksa dar.
  const genlik = (azaltilmis ? 0.22 : 0.42 + zorluk * 0.2) * MERKEZ;

  const konum = useCallback(
    (simdi: number) => {
      const t = (simdi - t0.current) / 1000;
      const a = genlik * genislik.current;
      // İki eksende farklı hız: göğüs inip kalkıyor, eller yana kayıyor.
      const titreme = nefesRef.current <= 0 ? Math.sin(t * 38) * 5 : 0;
      return {
        x: MERKEZ + a * Math.sin(t * 1.1 + 0.7) + titreme,
        y: MERKEZ + a * 0.8 * Math.sin(t * 1.9) - tepme.current + titreme,
      };
    },
    [genlik],
  );

  useEffect(() => {
    t0.current = Date.now();
    sonKare.current = t0.current;
    let raf = 0;
    const dongu = () => {
      const simdi = Date.now();
      const dt = simdi - sonKare.current;
      sonKare.current = simdi;

      // Nefes: tutarken tükeniyor, bırakınca doluyor.
      nefesRef.current = tutuyor.current
        ? Math.max(0, nefesRef.current - dt / NEFES_MS)
        : Math.min(1, nefesRef.current + dt / DOLMA_MS);
      // Genişlik yumuşak geçiyor: nefes tutunca salınım yavaşça daralıyor.
      const hedefGenislik = tutuyor.current && nefesRef.current > 0 ? 0.25 : nefesRef.current <= 0 ? 1.3 : 1;
      genislik.current += (hedefGenislik - genislik.current) * Math.min(1, dt / 220);
      tepme.current *= Math.max(0, 1 - dt / 260);

      setNisan(konum(simdi));
      setNefes(nefesRef.current);
      raf = requestAnimationFrame(dongu);
    };
    raf = requestAnimationFrame(dongu);
    return () => cancelAnimationFrame(raf);
  }, [konum]);

  /** Bu basışın atışı henüz yapılmadı. */
  const bekleyen = useRef(false);

  const tut = useCallback(() => {
    if (bitti.current) return;
    tutuyor.current = true;
    bekleyen.current = true;
  }, []);

  // Tetik bırakınca çekiliyor. Çok kısa dokunuşta web'de pressIn/pressOut
  // sırası garanti değil; atış onPressOut ya da onPress'ten hangisi önce
  // gelirse orada, basış başına bir kez yapılıyor.
  const atesle = useCallback(() => {
    if (bitti.current || !bekleyen.current) return;
    bekleyen.current = false;
    tutuyor.current = false;

    const n = konum(Date.now());
    const puan = isabetPuani(n.x, n.y);
    titret(Siddet.Heavy);
    tepme.current = 34;
    setSon(puan);

    setDelikler((eski) => {
      const yeni = [...eski, { x: n.x, y: n.y, puan }];
      if (yeni.length >= MERMI) {
        bitti.current = true;
        const ortalama = yeni.reduce((t, d) => t + d.puan, 0) / MERMI;
        z.sonra(900, () => onBitti(clamp01(ortalama)));
      }
      return yeni;
    });
  }, [konum, onBitti, z]);

  const kalan = MERMI - delikler.length;

  return (
    <View style={{ alignItems: 'center', gap: SP.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: BOY }}>
        <PixelText font="command" size="h3" color={C.canvasDim}>
          {`MERMİ ${kalan} / ${MERMI}`}
        </PixelText>
        <PixelText
          font="command"
          size="h3"
          color={son === null ? C.canvasFaint : son > 0.8 ? C.olive : son > 0.4 ? C.brass : C.rust}
        >
          {son === null ? '' : son >= 1 ? 'ON İKİDEN' : son > 0.6 ? 'İSABET' : son > 0 ? 'KENAR' : 'KARAVANA'}
        </PixelText>
      </View>

      <View style={{ borderWidth: BORDER, borderColor: C.ink, backgroundColor: C.ink, padding: 3 }}>
        <View style={{ width: BOY, height: BOY }}>
          <PixelSprite sprite={sprite} scale={PX} />
          <Svg width={BOY} height={BOY} style={{ position: 'absolute', left: 0, top: 0 }}>
            {delikler.map((d, i) => (
              <Rect key={i} x={d.x - PX / 2} y={d.y - PX / 2} width={PX} height={PX} fill={C.ink} />
            ))}
            {kalan > 0 && (
              <>
                <Rect x={nisan.x - 14} y={nisan.y - 1} width={10} height={3} fill={C.ink} />
                <Rect x={nisan.x + 4} y={nisan.y - 1} width={10} height={3} fill={C.ink} />
                <Rect x={nisan.x - 1} y={nisan.y - 14} width={3} height={10} fill={C.ink} />
                <Rect x={nisan.x - 1} y={nisan.y + 4} width={3} height={10} fill={C.ink} />
              </>
            )}
          </Svg>
        </View>
      </View>

      <View style={{ width: BOY, gap: SP.xs }}>
        <PixelText size="micro" color={C.canvasDim}>
          NEFES
        </PixelText>
        <View style={{ height: 10, borderWidth: BORDER, borderColor: C.ink, backgroundColor: C.bg }}>
          <View
            style={{
              width: `${Math.round(nefes * 100)}%`,
              height: '100%',
              backgroundColor: nefes > 0.3 ? C.steel : C.rust,
            }}
          />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nefesini tut, bırakınca ateş et"
        disabled={kalan === 0}
        onPressIn={tut}
        onPressOut={atesle}
        onPress={atesle}
        style={{
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: C.surfaceHi,
          paddingVertical: SP.lg,
          paddingHorizontal: SP.xxl,
          alignItems: 'center',
          width: BOY,
        }}
      >
        <PixelText font="command" size="h2" color={C.brass}>
          TUT · BIRAK
        </PixelText>
        <PixelText size="micro" color={C.canvasDim}>
          basılı tut: nefes · bırak: tetik
        </PixelText>
      </Pressable>
    </View>
  );
}
