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
import { Canvas, Group, Oval, Picture } from '@shopify/react-native-skia';
import type { SkPicture } from '@shopify/react-native-skia';
import { BORDER, C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { PROJEKTOR, TER } from '../art/sahne/poligon';
import { sayiYaziyla } from '../content/telefon/motor';
import { PixelSprite } from '../ui/PixelSprite';
import { Nefes, Sahne } from '../ui/sahne';
import { useHareketAzalt } from '../ui/useHareketAzalt';
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
const SAHNE_BOY = 256;
/** Şınav çekenin bastığı çizgi. */
const ZEMIN_Y = 214;
/** Beton alanın arka kenarı: izleyen bölük bunun üstünde duruyor. */
const UFUK_Y = 150;
const U = 3;
const BALON_EN = 160;
/** Arkada sırada izleyenler: adı olanlar kalabalığın içinde. */
const IZLEYENLER: SpriteKey[] = [
  'asker',
  'askerEmre',
  'asker',
  'asker',
  'askerTolga',
  'asker',
  'askerSerkan',
  'asker',
];

/** Alından düşen ter: yüzden yere, sonra kaybolur. */
function TerDamlasi({ x, y0, y1 }: { x: number; y0: number; y1: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withTiming(1, { duration: 420, easing: Easing.in(Easing.quad) }));
  }, [t]);
  const stil = useAnimatedStyle(() => ({
    transform: [{ translateY: t.value * (y1 - y0) }],
    opacity: t.value > 0.95 ? 0 : 1,
  }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: x, top: y0 }, stil]}>
      <PixelSprite sprite={TER} scale={3} />
    </Animated.View>
  );
}

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
}) {
  const z = useZamanlayici();
  const azalt = useHareketAzalt();
  const [terler, setTerler] = useState<number[]>([]);

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
      kapali.set(1);
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
    bagir(`${sayiYaziyla(n).toLocaleUpperCase('tr-TR')}!`, false);
    // Yarıyı geçince alından ter damlıyor.
    if (!azalt && n / hedef >= 0.3) {
      setTerler((t) => [...t, n]);
      z.sonra(600, () => setTerler((t) => t.filter((k) => k !== n)));
    }
    // Yoruldukça kalkış ağırlaşıyor; son şınavlarda kollar titriyor.
    kalkisMs.set(KALKIS_MS + n * (18 + zorluk * 12));
    if (n / hedef > 0.6 && !titriyor.current) {
      titriyor.current = true;
      titreme.set(
        withRepeat(
          withSequence(withTiming(1, { duration: 60 }), withTiming(-1, { duration: 60 })),
          -1,
          true,
        ),
      );
    }
    if (n >= hedef) z.sonra(500, () => bitir(1));
  }, [azalt, bagir, bitir, hedef, kalkisMs, titreme, zorluk, z]);

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
          kalkiyor.set(0);
          cancelAnimation(derinlik);
          derinlik.set(
            withTiming(1, {
              duration: INIS_MS * (1 - derinlik.value),
              easing: Easing.out(Easing.quad),
            }),
          );
        })
        .onFinalize(() => {
          'worklet';
          if (kapali.value) return;
          const ulasilan = derinlik.value;
          cancelAnimation(derinlik);
          const tam = ulasilan >= ESIK;
          if (!tam && ulasilan > 0.15) runOnJS(yarim)();
          kalkiyor.set(tam ? 1 : 0);
          derinlik.set(
            withTiming(
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
            ),
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

  const onbasiUst = ZEMIN_Y - 24 * 4;
  const balonSol = Math.max(0, Math.min(en - BALON_EN, onbasiX - BALON_EN + 40));
  // Kuyruk Onbaşı'nın başının biraz solunda (yüzü sola, şınav çekene dönük).
  const kuyrukX = Math.max(4, onbasiX - 10 - balonSol);
  const kuyrukRengi = bagiris?.kotu ? C.rust : C.ink;

  return (
    <View style={{ gap: SP.md, width: '100%' }}>
      <GestureDetector gesture={jest}>
        <View
          accessibilityRole="button"
          accessibilityLabel="Şınav: basılı tut in, bırak kalk"
          onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
          style={[
            {
              height: SAHNE_BOY,
              borderTopWidth: BORDER,
              borderBottomWidth: BORDER,
              borderColor: C.ink,
              overflow: 'hidden',
            },
            SECILMEZ,
          ]}
        >
          {/* Akşam içtima alanı: beton, projektör, arkada sırada bölük */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
            <Sahne
              yukseklik={SAHNE_BOY - 2 * BORDER}
              u={U}
              zemin="beton"
              zeminOrani={1 - UFUK_Y / SAHNE_BOY}
              saat="18:40"
              lambalar={en ? [{ x: 10, y: 62, yaricap: 34, guc: 0.16 }] : []}
              tohum={14}
            >
              {en > 0 && (
                <>
                  <View style={{ position: 'absolute', left: 6, top: UFUK_Y - 23 * 3 + 4 }}>
                    <PixelSprite sprite={PROJEKTOR} scale={3} />
                  </View>
                  {IZLEYENLER.map((k, i) => (
                    <View
                      key={i}
                      style={{
                        position: 'absolute',
                        left: 40 + ((en - 80) * i) / (IZLEYENLER.length - 1) - 16,
                        top: UFUK_Y - 48 + 6,
                      }}
                    >
                      <Nefes u={2} gecikme={(i * 170) % 700}>
                        <PixelSprite sprite={sprite(k)} scale={2} opacity={0.9} />
                      </Nefes>
                    </View>
                  ))}
                </>
              )}
            </Sahne>
          </View>

          {en > 0 && (
            <Canvas style={{ position: 'absolute', left: 0, top: 0, width: en, height: SAHNE_BOY }}>
              {/* Göğsün altındaki gölge: indikçe koyulaşıyor */}
              <Oval
                x={govdeX - 44}
                y={ZEMIN_Y - 4}
                width={96}
                height={8}
                color={C.shadow}
                opacity={golgeOpaklik}
              />
              <Oval
                x={onbasiX - 26}
                y={ZEMIN_Y - 4}
                width={52}
                height={8}
                color={C.shadow}
                opacity={0.35}
              />
              <Group transform={govdeDonusum}>
                <Picture picture={kare} />
              </Group>
              <Group transform={[{ translateX: onbasiX }, { translateY: ZEMIN_Y }, { scale: 4 }]}>
                <Picture picture={onbasi} />
              </Group>
            </Canvas>
          )}

          {terler.map((n) => (
            <TerDamlasi key={n} x={govdeX + 42} y0={ZEMIN_Y - 62} y1={ZEMIN_Y - 58 + 50} />
          ))}

          {/* Sayaç ve süre: sahnenin üst köşelerinde */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: SP.sm,
              top: SP.sm,
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: SP.xs,
              backgroundColor: C.ink,
              paddingHorizontal: SP.sm,
            }}
          >
            <PixelText font="command" size={36} color={C.brass}>
              {`${sayi}`}
            </PixelText>
            <PixelText font="command" size="body" color={C.canvasFaint}>
              {`/ ${hedef}`}
            </PixelText>
          </View>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: SP.sm,
              top: SP.sm,
              backgroundColor: C.ink,
              paddingHorizontal: SP.sm,
              paddingVertical: 2,
              borderWidth: 1,
              borderColor: kalan <= 5 ? C.rust : C.line,
            }}
          >
            <PixelText font="command" size="h3" color={kalan <= 5 ? C.rust : C.canvasDim}>
              {`${kalan} sn`}
            </PixelText>
          </View>

          {/* Derinlik: yeşil bant göğsün yere yaklaştığı yer */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: SP.sm,
              top: 64,
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

          {/* Onbaşı sayıyor: başının üstünde konuşma balonu, kuyruğu ağzına */}
          {bagiris && (
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: balonSol, top: onbasiUst - 44, width: BALON_EN }}
            >
              <View
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: C.canvas,
                  paddingHorizontal: SP.sm,
                  paddingVertical: 2,
                  borderWidth: BORDER,
                  borderColor: bagiris.kotu ? C.rust : C.ink,
                }}
              >
                <PixelText font="command" size="h3" color={bagiris.kotu ? C.rust : C.ink}>
                  {bagiris.metin}
                </PixelText>
              </View>
              <View
                style={{ marginLeft: kuyrukX, width: 6, height: 6, backgroundColor: kuyrukRengi }}
              />
              <View
                style={{
                  marginLeft: kuyrukX + 2,
                  width: 4,
                  height: 4,
                  backgroundColor: kuyrukRengi,
                }}
              />
            </View>
          )}
        </View>
      </GestureDetector>

      <PixelText
        size="small"
        color={C.canvasFaint}
        center
        line="snug"
        style={{ paddingHorizontal: SP.lg }}
      >
        Basılı tut: in. Bırak: kalk. Göğsün yere yaklaşmadan kalkarsan ya da tam kalkmadan inersen
        sayılmaz.
      </PixelText>
    </View>
  );
}
