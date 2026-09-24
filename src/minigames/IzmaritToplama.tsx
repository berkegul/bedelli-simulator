import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import {
  COP_VARILI,
  IZMARIT_CAPRAZ,
  IZMARIT_DUZ,
  IZMARIT_EZIK,
  KAGIT_TOP,
  KAPAK,
  KOL_SAATI,
  TAS,
  TORBA,
  YAPRAK_KURU,
  YAPRAK_YESIL,
} from '../art/sahne/avlu';
import { Siddet, titret } from '../ui/haptik';
import { PixelSprite, type SpriteDef } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { useHareketAzalt } from '../ui/useHareketAzalt';
import { PikselKatman, Vinyet, ZEMINLER, hash, type Piksel } from '../ui/sahne';
import { clamp01, type MiniOyunProps } from './types';

const SURE = 15000;
const ALAN_YUKSEKLIK = 260;

type Cop = { id: number; x: number; y: number; tur: 'izmarit' | 'kagit' | 'kapak' };

/** Piksel hücresi: sahne dokusu ve nesneler aynı ızgarada. */
const U = 3;
const KUTU = 30;

const IZMARITLER = [IZMARIT_DUZ, IZMARIT_EZIK, IZMARIT_CAPRAZ];
function copSprite(c: Cop): SpriteDef {
  if (c.tur === 'izmarit') return IZMARITLER[c.id % IZMARITLER.length];
  return c.tur === 'kagit' ? KAGIT_TOP : KAPAK;
}

/**
 * Mıntıkanın zemini, tepeden: üstte çim kenarı (düzensiz sınır), ortada
 * sıkışmış toprak ve ağaç gölgesi, sağda kaldırım taşıyla ayrılmış beton
 * yol. Tohumlu: her açılışta aynı avlu.
 */
function avluZemini(w: number, h: number): Piksel[] {
  const out: Piksel[] = [...ZEMINLER.toprak({ x: 0, y: 0, w, h }, 11)];
  const cimH = Math.round(h * 0.16);
  out.push(...ZEMINLER.cim({ x: 0, y: 0, w, h: cimH }, 12));
  // Çimin toprağa karıştığı düzensiz kenar
  for (let x = 0; x < w; x++) {
    const uz = Math.floor(hash(x, 1, 5) * 3 + Math.sin(x / 4) * 1.5);
    if (uz > 0)
      out.push({ x, y: cimH, w: 1, h: uz, c: hash(x, 2, 5) < 0.5 ? '#3D4724' : '#4A4F2A' });
  }
  // Ağaç gölgesi: çimin altında, sol üstte yayvan leke
  const gx = Math.round(w * 0.22);
  const gy = Math.round(h * 0.3);
  for (let j = -6; j <= 6; j++) {
    const yari = Math.round(16 * Math.sqrt(1 - (j / 7) ** 2));
    out.push({ x: gx - yari, y: gy + j, w: 2 * yari, h: 1, c: '#000', o: 0.14 });
  }
  // Beton yol ve kaldırım
  const yolX = Math.round(w * 0.8);
  out.push(...ZEMINLER.beton({ x: yolX, y: 0, w: w - yolX, h }, 13));
  out.push(
    { x: yolX - 2, y: 0, w: 2, h, c: '#7A7361' },
    { x: yolX - 2, y: 0, w: 1, h, c: '#8C8570' },
  );
  for (let y = 0; y < h; y += 5) out.push({ x: yolX - 2, y, w: 2, h: 1, c: '#5E5845' });
  out.push({ x: yolX, y: 0, w: 1, h, c: '#2E2A20', o: 0.5 });
  // Postal izleri: toprakta çapraz giden sıra
  for (let i = 0; i < 7; i++) {
    const x = Math.round(w * 0.35 + i * 6);
    const y = Math.round(h * 0.85 - i * 5 + (i % 2) * 2);
    out.push({ x, y, w: 2, h: 3, c: '#4A3C26' }, { x, y: y + 4, w: 2, h: 1, c: '#4A3C26' });
  }
  return out;
}

/** Sahnede sabit duran ufak şeyler: yaprak, taş. Toplanmıyor, avluya ait. */
const SUS: { sprite: SpriteDef; x: number; y: number }[] = Array.from({ length: 12 }, (_, i) => ({
  sprite: [YAPRAK_YESIL, YAPRAK_KURU, TAS, YAPRAK_KURU][i % 4],
  x: 4 + hash(i, 3, 21) * 70,
  y: 20 + hash(i, 4, 21) * 72,
}));

/** Toplanan çöp torbaya uçuyor. */
type UcanCop = Cop & { px: number; py: number };

function Ucan({
  cop,
  hedef,
  onBitti,
}: {
  cop: UcanCop;
  hedef: { x: number; y: number };
  onBitti: (id: number) => void;
}) {
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: 320,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => onBitti(cop.id));
    // Uçuş bir kez: yalnızca bileşen kurulurken başlar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: cop.px,
        top: cop.py,
        opacity: t.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
        transform: [
          { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, hedef.x - cop.px] }) },
          {
            translateY: t.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, -18, hedef.y - cop.py],
            }),
          },
          { scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) },
        ],
      }}
    >
      <PixelSprite sprite={copSprite(cop)} scale={U} />
    </Animated.View>
  );
}

/**
 * Bölük işleri: avluda ne varsa toplanacak. Süre içinde ne kadar çok
 * toplarsan o kadar iyi; yerde kalan her şey Onbaşı'nın gözüne çarpıyor.
 */
export function IzmaritToplama({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const hedef = 14 + Math.round(zorluk * 6);
  const [copler, setCopler] = useState<Cop[]>([]);
  const [toplanan, setToplanan] = useState(0);
  const [kalan, setKalan] = useState(Math.round(SURE / 1000));
  const sonrakiId = useRef(0);
  const bitti = useRef(false);

  const uret = useCallback((): Cop => {
    const turler: Cop['tur'][] = ['izmarit', 'izmarit', 'kagit', 'kapak'];
    return {
      id: sonrakiId.current++,
      x: 6 + Math.random() * 82,
      y: 6 + Math.random() * 80,
      tur: turler[Math.floor(Math.random() * turler.length)],
    };
  }, []);

  useEffect(() => {
    setCopler(Array.from({ length: 5 }, uret));
    const ekle = setInterval(
      () => {
        if (bitti.current) return;
        // Yeni çöp düşmeye devam ediyor; ekran hiç boşalmıyor.
        setCopler((c) => (c.length < 9 ? [...c, uret()] : c));
      },
      900 - zorluk * 250,
    );

    const sayac = setInterval(() => setKalan((k) => Math.max(0, k - 1)), 1000);
    const son = setTimeout(() => {
      bitti.current = true;
      onBitti(clamp01(toplananRef.current / hedef));
    }, SURE);

    return () => {
      clearInterval(ekle);
      clearInterval(sayac);
      clearTimeout(son);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toplananRef = useRef(0);
  const azalt = useHareketAzalt();
  const [en, setEn] = useState(0);
  const [ucanlar, setUcanlar] = useState<UcanCop[]>([]);
  const topla = useCallback(
    (id: number) => {
      if (bitti.current) return;
      const alinan = copler.find((x) => x.id === id);
      if (alinan && !azalt && en > 0) {
        const px = (alinan.x / 100) * en;
        const py = (alinan.y / 100) * ALAN_YUKSEKLIK + KUTU / 3;
        setUcanlar((u) => [...u, { ...alinan, px, py }]);
      }
      setCopler((c) => c.filter((x) => x.id !== id));
      toplananRef.current += 1;
      setToplanan(toplananRef.current);
      titret(Siddet.Light);
    },
    [azalt, copler, en],
  );
  const indi = useCallback((id: number) => setUcanlar((u) => u.filter((x) => x.id !== id)), []);

  const W = Math.ceil(en / U);
  const H = Math.ceil(ALAN_YUKSEKLIK / U);
  const zemin = useMemo(() => (W ? avluZemini(W, H) : []), [W, H]);
  const torba = { x: en - 64, y: ALAN_YUKSEKLIK - 40 };

  return (
    <View style={{ gap: SP.md, width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvasDim} style={{ flex: 1 }}>
          {`TOPLANAN ${toplanan} / ${hedef}`}
        </PixelText>
      </View>

      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width) - 2 * BORDER)}
        style={{
          height: ALAN_YUKSEKLIK + 2 * BORDER,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: '#5B4B31',
          overflow: 'hidden',
        }}
      >
        {W > 0 && (
          <PikselKatman
            pikseller={zemin}
            u={U}
            w={W}
            h={H}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}

        {/* Avlunun kendi eşyası: yaprak, taş, sağ üstte çöp varili */}
        {SUS.map((d, i) => (
          <View
            key={i}
            pointerEvents="none"
            style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%` }}
          >
            <PixelSprite sprite={d.sprite} scale={U} />
          </View>
        ))}
        <View pointerEvents="none" style={{ position: 'absolute', right: 10, top: 10 }}>
          <PixelSprite sprite={COP_VARILI} scale={U} />
        </View>

        {copler.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel="Yerden topla"
            onPress={() => topla(c.id)}
            hitSlop={14}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: KUTU,
              height: KUTU,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PixelSprite sprite={copSprite(c)} scale={U} />
          </Pressable>
        ))}

        {ucanlar.map((c) => (
          <Ucan key={c.id} cop={c} hedef={torba} onBitti={indi} />
        ))}

        <Vinyet u={U} guc={0.14} />

        {/* Onbaşının saati: süre avlunun köşesinde akıyor */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 6,
            bottom: 6,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: C.ink,
            paddingHorizontal: 5,
            paddingVertical: 2,
          }}
        >
          <PixelSprite sprite={KOL_SAATI} scale={2} />
          <PixelText font="command" size="body" color={kalan <= 4 ? C.rust : C.canvas}>
            {`${kalan} sn`}
          </PixelText>
        </View>

        {/* Elindeki torba: topladıkça sayı artıyor */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 6,
            bottom: 6,
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 4,
          }}
        >
          <View style={{ backgroundColor: C.ink, paddingHorizontal: 5, paddingVertical: 2 }}>
            <PixelText font="command" size="body" color={C.brass}>
              {String(toplanan)}
            </PixelText>
          </View>
          <PixelSprite sprite={TORBA} scale={U + 1} />
        </View>
      </View>

      <PixelText size="small" color={C.canvasFaint} center line="snug">
        Yerdekilere dokunup topla. Süre bitince kalanlar senin hanene yazılır.
      </PixelText>
    </View>
  );
}
