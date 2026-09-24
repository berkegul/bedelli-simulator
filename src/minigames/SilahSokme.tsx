import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { PixelText } from '../ui/PixelText';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';
import { useHareketAzalt } from '../ui/useHareketAzalt';
import { PikselKatman, Vinyet, ZEMINLER, type Piksel } from '../ui/sahne';
import {
  PARCALAR,
  TUFEK_BOY,
  TUFEK_EN,
  silahMasasi,
  tufekIskeleti,
  type Parca,
} from '../art/sahne/tufek';

const SIRA: Parca['ad'][] = [
  'Şarjör',
  'Kurma kolu',
  'Mekanizma kapağı',
  'Mekanizma',
  'Geri getirici yay',
  'Dipçik',
];

/** Yanlış seçilen parça pas rengine döner, koyu hatlar kalır. */
const kizart = (ps: Piksel[]): Piksel[] =>
  ps.map((p) => (p.c === C.ink ? p : { ...p, c: p.y % 2 ? '#A8442E' : '#C0583C' }));

/**
 * Tüfeğin bir parçası: takılıyken yerinde, sökülünce brandada kendi
 * yuvasına kayıyor. Yanlış seçimde kızarıp titriyor.
 */
function ParcaCizim({
  parca,
  u,
  hedef,
  sokuldu,
  yanlis,
  onPress,
}: {
  parca: Parca;
  u: number;
  hedef: { x: number; y: number };
  sokuldu: boolean;
  yanlis: boolean;
  onPress: () => void;
}) {
  const azalt = useHareketAzalt();
  const [konum] = useState(() => new Animated.ValueXY({ x: hedef.x * u, y: hedef.y * u }));
  const [titreme] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const to = { x: hedef.x * u, y: hedef.y * u };
    if (azalt) konum.setValue(to);
    else Animated.timing(konum, { toValue: to, duration: 320, useNativeDriver: true }).start();
  }, [hedef.x, hedef.y, u, azalt, konum]);

  useEffect(() => {
    if (!yanlis || azalt) return;
    titreme.setValue(0);
    Animated.sequence(
      [u, -u, u, -u, 0].map((v) =>
        Animated.timing(titreme, { toValue: v, duration: 50, useNativeDriver: true }),
      ),
    ).start();
  }, [yanlis, azalt, titreme, u]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: [{ translateX: Animated.add(konum.x, titreme) }, { translateY: konum.y }],
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={sokuldu ? `${parca.ad}, söküldü` : parca.ad}
        accessibilityState={{ disabled: sokuldu }}
        disabled={sokuldu}
        onPress={onPress}
        hitSlop={10}
      >
        <PikselKatman
          pikseller={yanlis ? kizart(parca.piksel) : parca.piksel}
          u={u}
          w={parca.w}
          h={parca.h}
        />
      </Pressable>
    </Animated.View>
  );
}

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
  const z = useZamanlayici();
  const parcalar = useMemo(() => karistir(SIRA), []);
  const [adim, setAdim] = useState(0);
  const [yanlisSecim, setYanlisSecim] = useState<string | null>(null);
  const hataSayisi = useRef(0);
  const baslangic = useRef(0);
  useEffect(() => {
    baslangic.current = Date.now();
  }, []);

  const sureSiniri = 26000 - zorluk * 7000;

  // Masa: ölçek tüfeğin boyuna göre, tam sayı.
  const [en, setEn] = useState(0);
  const u = en ? Math.max(2, Math.floor((en - 8) / TUFEK_EN)) : 0;
  const Wc = u ? Math.ceil(en / u) : 0;
  const Hc = TUFEK_BOY + 26;
  const ox = Math.floor((Wc - TUFEK_EN) / 2);
  const oy = 4;
  const masa = useMemo<Piksel[]>(
    () => (Wc ? silahMasasi(Wc, Hc, ZEMINLER.parke({ x: 0, y: 0, w: Wc, h: Hc }, 17)) : []),
    [Wc, Hc],
  );
  const iskelet = useMemo(() => tufekIskeleti(), []);
  /** Sökülen parçanın brandadaki yeri: sökme sırasına göre soldan sağa. */
  const yuva = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    let x = ox + 3;
    for (const ad of SIRA) {
      const p = PARCALAR.find((q) => q.ad === ad)!;
      m.set(ad, { x, y: oy + TUFEK_BOY + 5 });
      x += p.w + 2;
    }
    return m;
  }, [ox]);

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
        z.sonra(420, () => setYanlisSecim(null));
      }
    },
    [adim, onBitti, sureSiniri, z],
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

      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={{
          height: Hc * (u || 2),
          borderWidth: BORDER,
          borderColor: C.ink,
          overflow: 'hidden',
          backgroundColor: '#5E4428',
        }}
      >
        {u > 0 && (
          <>
            <PikselKatman
              pikseller={masa}
              u={u}
              w={Wc}
              h={Hc}
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
            <PikselKatman
              pikseller={iskelet}
              u={u}
              w={TUFEK_EN}
              h={TUFEK_BOY}
              style={{ position: 'absolute', left: ox * u, top: oy * u }}
            />
            {PARCALAR.map((p) => {
              const sokuldu = SIRA.indexOf(p.ad) < adim;
              const yer = sokuldu ? yuva.get(p.ad)! : { x: ox + p.x, y: oy + p.y };
              return (
                <ParcaCizim
                  key={p.ad}
                  parca={p}
                  u={u}
                  hedef={yer}
                  sokuldu={sokuldu}
                  yanlis={yanlisSecim === p.ad}
                  onPress={() => sec(p.ad)}
                />
              );
            })}
            <Vinyet u={u} guc={0.16} />
          </>
        )}
      </View>

      {/* Parça adları: küçük parçaya dokunmak zor olursa buradan da seçilir */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SP.xs }}>
        {parcalar.map((p) => {
          const sokuldu = SIRA.indexOf(p) < adim;
          const yanlis = yanlisSecim === p;
          return (
            <Pressable
              key={p}
              accessibilityRole="button"
              accessibilityLabel={sokuldu ? `${p}, söküldü` : p}
              accessibilityState={{ disabled: sokuldu }}
              disabled={sokuldu}
              onPress={() => sec(p)}
              style={{
                flexBasis: '48%',
                flexGrow: 1,
                borderWidth: BORDER,
                borderColor: yanlis ? C.rust : C.ink,
                backgroundColor: sokuldu ? C.bg : yanlis ? '#4A2018' : C.surface,
                paddingVertical: SP.sm,
                paddingHorizontal: SP.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.sm,
                opacity: sokuldu ? 0.45 : 1,
              }}
            >
              <PixelText
                font="bodyMed"
                size="body"
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
