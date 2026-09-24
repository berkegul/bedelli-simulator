import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Canvas, Group, Oval, Picture, Rect } from '@shopify/react-native-skia';
import type { SkPicture } from '@shopify/react-native-skia';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import { SINAV_KARELERI } from '../art/sprites';
import { SECILMEZ } from '../screens/DolapYerlesimi';
import { Siddet, titret } from '../ui/haptik';
import { PixelText } from '../ui/PixelText';
import { spriteResmi } from '../ui/skia/SkiaSprite';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

/** Tam inişin süresi; basılı tuttukça gövde bu hızla yere yaklaşıyor. */
const INIS_MS = 420;
/** İlk kalkışın süresi; her şınavla ağırlaşıyor. */
const KALKIS_MS = 380;
/** Göğüs bu derinliğe inmeden kalkılırsa şınav yarım sayılıyor. */
const ESIK = 0.85;
/** Onbaşı'yla aynı ölçek: yatan askerin boyu ayaktakinin boyuyla orantılı. */
const OLCEK = 4;
const SAHNE_BOY = 176;
const ZEMIN_Y = 150;

/**
 * Ceza şınavı. Basılı tuttukça iniyorsun, bırakınca kalkıyorsun; Onbaşı
 * her tam şınavı bağırarak sayıyor. Göğüs yere yaklaşmadan kalkarsan
 * "yarım", tam kalkmadan yeniden inersen "tam kalk" — ikisi de sayılmıyor.
 * Yoruldukça kalkış ağırlaşıyor, sona doğru kollar titriyor.
 *
 * Eskiden her dokunuş bir şınavdı ve iki kare arasında zıplayan bir asker
 * vardı; şimdi derinlik sürekli bir değer ve gövde Skia'da akıyor.
 */
export function Ceza({
  onBitti,
  zorluk = 0,
  hedef: verilen,
}: MiniOyunProps & {
  /** Denetimde kusur sayısına göre veriliyor; yoksa zorluktan. */
  hedef?: number;
}) {  const z = useZamanlayici();

  const hedef = verilen ?? 20 + Math.round(zorluk * 10);
  const sure = 6000 + hedef * 800;

  const [en, setEn] = useState(0);
  const [sayi, setSayi] = useState(0);
  const [kalan, setKalan] = useState(Math.ceil(sure / 1000));
  const [bagiris, setBagiris] = useState<{ metin: string; kotu: boolean } | null>(null);

  const sayiRef = useRef(0);
  const bitti = useRef(false);
  const titriyor = useRef(false);
  const bagirisZamani = useRef<ReturnType<typeof setTimeout> | null>(null);

  const derinlik = useSharedValue(0);
  /** Tam bir inişten kalkılıyor mu: kalkış bitince şınav sayılacak. */
  const kalkiyor = useSharedValue(0);
  const kapali = useSharedValue(0);
  const kalkisMs = useSharedValue(KALKIS_MS);
  const titreme = useSharedValue(0);

  const kareler = useMemo(() => SINAV_KARELERI.map((d) => spriteResmi(d).resim), []);
  const onbasi = useMemo(() => spriteResmi(sprite('cavus')).resim, []);
  const kare = useDerivedValue<SkPicture>(
    () => kareler[Math.round(derinlik.value * (kareler.length - 1))],
  );

  const bitir = useCallback(
    (puan: number) => {
      if (bitti.current) return;
      bitti.current = true;
      kapali.value = 1;
      onBitti(clamp01(puan));
    },
    [kapali, onBitti],
  );

  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => {
      const k = Math.max(0, sure - (Date.now() - t0));
      setKalan(Math.ceil(k / 1000));
      if (k <= 0) {
        clearInterval(id);
        bitir(sayiRef.current / hedef);
      }
    }, 250);
    return () => {
      clearInterval(id);
      if (bagirisZamani.current) clearTimeout(bagirisZamani.current);
    };
    // Saat bir kez kuruluyor; hedef ve süre oyun boyunca değişmiyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bagir = useCallback((metin: string, kotu: boolean) => {
    setBagiris({ metin, kotu });
    if (bagirisZamani.current) clearTimeout(bagirisZamani.current);
    bagirisZamani.current = setTimeout(() => setBagiris(null), 700);
  }, []);

  const say = useCallback(() => {
    if (bitti.current) return;
    sayiRef.current += 1;
    const n = sayiRef.current;
    setSayi(n);
    titret(Siddet.Medium);
    bagir(`${n}!`, false);
    // Yoruldukça kalkış ağırlaşıyor; son şınavlarda kollar titriyor.
    kalkisMs.value = KALKIS_MS + n * (18 + zorluk * 12);
    if (n / hedef > 0.6 && !titriyor.current) {
      titriyor.current = true;
      titreme.value = withRepeat(
        withSequence(withTiming(1, { duration: 60 }), withTiming(-1, { duration: 60 })),
        -1,
        true,
      );
    }
    if (n >= hedef) z.sonra(500, () => bitir(1));
  }, [bagir, bitir, hedef, kalkisMs, titreme, zorluk, z]);

  const yarim = useCallback(() => {
    titret(Siddet.Rigid);
    bagir('YARIM!', true);
  }, [bagir]);

  const erken = useCallback(() => {
    titret(Siddet.Rigid);
    bagir('TAM KALK!', true);
  }, [bagir]);

  const jest = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        // Sahne kaydırılabilir bir sayfada; basılı tutmak sayfayı kaydırmasın.
        .manualActivation(true)
        .onTouchesDown((_e, durum) => {
          'worklet';
          durum.activate();
          if (kapali.value) return;
          // Kalkış bitmeden yeniden inmek: o şınav gitti.
          if (kalkiyor.value && derinlik.value > 0.12) runOnJS(erken)();
          kalkiyor.value = 0;
          cancelAnimation(derinlik);
          derinlik.value = withTiming(1, {
            duration: INIS_MS * (1 - derinlik.value),
            easing: Easing.out(Easing.quad),
          });
        })
        .onFinalize(() => {
          'worklet';
          if (kapali.value) return;
          const ulasilan = derinlik.value;
          cancelAnimation(derinlik);
          const tam = ulasilan >= ESIK;
          if (!tam && ulasilan > 0.15) runOnJS(yarim)();
          kalkiyor.value = tam ? 1 : 0;
          derinlik.value = withTiming(
            0,
            {
              duration: kalkisMs.value * Math.max(0.25, ulasilan),
              easing: Easing.inOut(Easing.quad),
            },
            (tamamlandi) => {
              if (tamamlandi && kalkiyor.value) {
                kalkiyor.value = 0;
                runOnJS(say)();
              }
            },
          );
        }),
    [derinlik, erken, kalkisMs, kalkiyor, kapali, say, yarim],
  );

  const govdeX = en * 0.36;
  const onbasiX = en * 0.84;

  const govdeDonusum = useDerivedValue(() => [
    { translateX: govdeX + titreme.value * 0.8 },
    { translateY: ZEMIN_Y },
    { scale: OLCEK },
  ]);
  const golgeOpaklik = useDerivedValue(() => 0.12 + derinlik.value * 0.35);
  const derinlikStili = useAnimatedStyle(() => ({ height: `${derinlik.value * 100}%` }));

  return (
    <View style={{ gap: SP.md, width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.rust} style={{ flex: 1 }}>
          CEZA ŞINAVI
        </PixelText>
        <PixelText font="command" size="h3" color={kalan <= 5 ? C.rust : C.canvasFaint}>
          {`${kalan} sn`}
        </PixelText>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: SP.sm }}>
        <PixelText font="command" size={56} color={C.brass}>
          {`${sayi}`}
        </PixelText>
        <PixelText font="command" size="h3" color={C.canvasFaint}>
          {`/ ${hedef}`}
        </PixelText>
      </View>

      <GestureDetector gesture={jest}>
        <View
          accessibilityRole="button"
          accessibilityLabel="Şınav: basılı tut in, bırak kalk"
          onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
          style={[
            {
              height: SAHNE_BOY,
              borderWidth: BORDER,
              borderColor: C.ink,
              backgroundColor: '#232016',
              overflow: 'hidden',
            },
            SECILMEZ,
          ]}
        >
          {en > 0 && (
            <Canvas style={{ width: en, height: SAHNE_BOY }}>
              <Rect x={0} y={ZEMIN_Y} width={en} height={SAHNE_BOY - ZEMIN_Y} color="#3A3526" />
              <Rect x={0} y={ZEMIN_Y} width={en} height={2} color={C.ink} />
              {/* Göğsün altındaki gölge: indikçe koyulaşıyor */}
              <Oval x={govdeX - 44} y={ZEMIN_Y - 4} width={96} height={8} color={C.shadow} opacity={golgeOpaklik} />
              <Group transform={govdeDonusum}>
                <Picture picture={kare} />
              </Group>
              <Group transform={[{ translateX: onbasiX }, { translateY: ZEMIN_Y }, { scale: 4 }]}>
                <Picture picture={onbasi} />
              </Group>
            </Canvas>
          )}

          {/* Derinlik: yeşil bant göğsün yere yaklaştığı yer */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: SP.sm,
              top: SP.sm,
              bottom: SAHNE_BOY - ZEMIN_Y + SP.sm,
              width: 10,
              backgroundColor: C.ink,
              borderWidth: 1,
              borderColor: C.line,
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: `${(1 - ESIK) * 100}%`,
                backgroundColor: 'rgba(143,160,90,0.45)',
              }}
            />
            <Animated.View style={[{ width: '100%', backgroundColor: C.brass }, derinlikStili]} />
          </View>

          {/* Onbaşı sayıyor */}
          {bagiris && (
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: onbasiX - 50, top: SP.sm, width: 100, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: C.ink,
                  paddingHorizontal: SP.sm,
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor: bagiris.kotu ? C.rust : C.brass,
                }}
              >
                <PixelText font="command" size="h3" color={bagiris.kotu ? C.rust : C.brass}>
                  {bagiris.metin}
                </PixelText>
              </View>
            </View>
          )}
        </View>
      </GestureDetector>

      <PixelText size="small" color={C.canvasFaint} center line="snug">
        Basılı tut: in. Bırak: kalk. Göğsün yere yaklaşmadan kalkarsan ya da tam kalkmadan inersen sayılmaz.
      </PixelText>
    </View>
  );
}
