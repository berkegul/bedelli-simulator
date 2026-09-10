import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { Siddet, secim, titret } from '../ui/haptik';
import {
  HAVA_METNI,
  HAVA_YOL_NOTU,
  ZEMIN_RENK,
  havaDurumu,
  zeminTipi,
} from '../engine/hava';
import { Gokyuzu } from '../ui/Gokyuzu';
import { PixelSprite, spriteSize } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

const SAHNE_YUKSEKLIK = 230;
/** Ufuk çizgisi: üstü gökyüzü, altı kışla zemini. */
const UFUK = 0.36;
/** Parmak yoldan bu kadar uzaklaşırsa adım işlemiyor. */
const TOLERANS = 62;
/** Tek harekette atlanabilecek en fazla yol — sondan tutup varılmasın diye. */
const ADIM_TAVANI = 0.16;

type Nokta = { x: number; y: number };

type Props = {
  hedef: string;
  adim: number;
  /** Yolun sonunda beliren mekan. */
  mekan: SpriteKey;
  /** Yol boyunca geçilen manzara, sırayla. */
  manzara: SpriteKey[];
  /** Bloğun saati; gökyüzünün rengini bu belirliyor. */
  saat: string;
  /** Hava ve zemin bu ikisinden türetiliyor. */
  gun: number;
  blokIndex: number;
  onVardi: () => void;
};

/** Hedef adından türeyen sabit kıvrım: aynı yer her gün aynı yolla gidiliyor. */
function tohum(ad: string) {
  let h = 0;
  for (let i = 0; i < ad.length; i++) h = (h * 31 + ad.charCodeAt(i)) % 997;
  return h / 997;
}

/** Bir noktanın doğru parçasına en yakın hâli ve o parçadaki oranı. */
function parcayaIzdusum(p: Nokta, a: Nokta, b: Nokta) {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const uzunluk2 = vx * vx + vy * vy || 1;
  const oran = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / uzunluk2));
  const nx = a.x + vx * oran;
  const ny = a.y + vy * oran;
  return { oran, mesafe: Math.hypot(p.x - nx, p.y - ny) };
}

/**
 * İki blok arası yürüyüş. Eskiden ekrana beş kere dokunmaktı ve gitmek
 * gibi değil sayaç doldurmak gibi duruyordu. Artık zemine çizilmiş rotayı
 * parmağınla takip ediyorsun: asker yolun neresindeysen orada, yoldan
 * çıkarsan ilerlemiyor. Bıraktığın yerden devam edebilirsin.
 */
export function YolSahnesi({ hedef, adim, mekan, manzara, saat, gun, blokIndex, onVardi }: Props) {
  const hava = havaDurumu(gun, blokIndex);
  const zemin = zeminTipi(gun, blokIndex);
  const zeminRenk = ZEMIN_RENK[zemin];
  // Sis ve yağmur manzarayı yutuyor: uzaktaki şeyler daha az görünüyor.
  const manzaraOpaklik = hava === 'sisli' ? 0.22 : hava === 'yagmurlu' ? 0.38 : 0.5;
  const yagmur = useRef(new Animated.Value(0)).current;
  const [en, setEn] = useState(0);
  const [solAyak, setSolAyak] = useState(true);
  const [basladi, setBasladi] = useState(false);
  const [sapti, setSapti] = useState(false);

  const ilerleme = useRef(new Animated.Value(0)).current;
  const zipla = useRef(new Animated.Value(0)).current;
  const oran = useRef(0);
  const sonAdim = useRef(0);
  const vardi = useRef(false);

  // Rota: soldan sağa ilerleyen, yukarı aşağı kıvrılan bir patika.
  const yol = useMemo(() => {
    // Ölçüm gelmeden ya da absürt darken rota kurulmaz: interpolate'in
    // giriş aralığı artan olmak zorunda.
    if (en < 120) return null;

    const s = tohum(hedef);
    const sayi = Math.max(4, adim + 2);
    const taban = SAHNE_YUKSEKLIK * 0.7;
    const genlik = SAHNE_YUKSEKLIK * 0.16;

    const noktalar: Nokta[] = Array.from({ length: sayi }, (_, i) => ({
      x: 18 + ((en - 46) * i) / (sayi - 1),
      y: taban + Math.sin(i * 1.85 + s * 6.28) * genlik,
    }));

    const uzunluklar: number[] = [];
    let toplam = 0;
    for (let i = 1; i < noktalar.length; i++) {
      const d = Math.hypot(noktalar[i].x - noktalar[i - 1].x, noktalar[i].y - noktalar[i - 1].y);
      uzunluklar.push(d);
      toplam += d;
    }

    // Her köşenin yol üzerindeki oranı — Animated bunları doğrudan kullanıyor.
    const oranlar = [0];
    let birikim = 0;
    for (const d of uzunluklar) {
      birikim += d;
      oranlar.push(birikim / toplam);
    }

    // Yolu döşeyen çizgiler: konum ve açı sabit, yalnızca rengi doluyor.
    const cizgiler: { x: number; y: number; aci: number; t: number }[] = [];
    const aralik = 18;
    for (let mesafe = 6; mesafe < toplam; mesafe += aralik) {
      let kalan = mesafe;
      let i = 0;
      while (i < uzunluklar.length - 1 && kalan > uzunluklar[i]) {
        kalan -= uzunluklar[i];
        i++;
      }
      const a = noktalar[i];
      const b = noktalar[i + 1];
      const k = kalan / (uzunluklar[i] || 1);
      cizgiler.push({
        x: a.x + (b.x - a.x) * k,
        y: a.y + (b.y - a.y) * k,
        aci: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
        t: mesafe / toplam,
      });
    }

    return { noktalar, uzunluklar, toplam, oranlar, cizgiler };
  }, [en, hedef, adim]);

  const bas = useCallback(
    (x: number, y: number) => {
      if (!yol || vardi.current) return;

      // Yolun neresine denk geliyor?
      let enIyi = { t: 0, mesafe: Infinity };
      let birikim = 0;
      for (let i = 0; i < yol.uzunluklar.length; i++) {
        const { oran: k, mesafe } = parcayaIzdusum({ x, y }, yol.noktalar[i], yol.noktalar[i + 1]);
        if (mesafe < enIyi.mesafe) {
          enIyi = { t: (birikim + k * yol.uzunluklar[i]) / yol.toplam, mesafe };
        }
        birikim += yol.uzunluklar[i];
      }

      if (enIyi.mesafe > TOLERANS) {
        setSapti(true);
        return;
      }
      setSapti(false);

      const yeni = Math.min(enIyi.t, oran.current + ADIM_TAVANI);
      if (yeni <= oran.current) return;

      oran.current = yeni;
      ilerleme.setValue(yeni);
      if (!basladi) setBasladi(true);

      // Adım ritmi: yolun her 1/(2·adım)'ında bir ayak değişiyor.
      if (yeni - sonAdim.current >= 1 / (adim * 2)) {
        sonAdim.current = yeni;
        setSolAyak((s) => !s);
        secim();
        // Asker'in transform'unda ilerleme (JS) ile aynı yerde duruyor;
        // ikisi aynı sürücüde olmalı, yoksa biri güncellenmiyor.
        Animated.sequence([
          Animated.timing(zipla, { toValue: 1, duration: 90, useNativeDriver: false }),
          Animated.timing(zipla, {
            toValue: 0,
            duration: 130,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
        ]).start();
      }

      if (yeni >= 0.985) {
        vardi.current = true;
        titret(Siddet.Medium);
        setTimeout(onVardi, 420);
      }
    },
    [yol, adim, basladi, ilerleme, zipla, onVardi],
  );

  // PanResponder bir kez kuruluyor; güncel `bas` referansı ref üstünden geliyor.
  const basRef = useRef(bas);
  basRef.current = bas;
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Sahne bir ScrollView'ın içinde: rota çizerken sayfa kaymamalı.
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (e) => basRef.current(e.nativeEvent.locationX, e.nativeEvent.locationY),
      onPanResponderMove: (e) => basRef.current(e.nativeEvent.locationX, e.nativeEvent.locationY),
      onPanResponderRelease: () => setSapti(false),
    }),
  ).current;

  const askerBoyu = useMemo(() => spriteSize(sprite('asker')), []);
  const olcek = 3;
  const askerEn = askerBoyu.w * olcek;
  const askerYuk = askerBoyu.h * olcek;

  const hedefBoyu = useMemo(() => spriteSize(sprite(mekan)), [mekan]);
  const hedefEn = hedefBoyu.w * 3;
  const hedefYuk = hedefBoyu.h * 3;
  const son = yol?.noktalar[yol.noktalar.length - 1];

  // Yağmur sürekli akıyor; yürüsen de dursan da.
  useEffect(() => {
    if (hava !== 'yagmurlu') return;
    const dongu = Animated.loop(
      Animated.timing(yagmur, {
        toValue: 1,
        duration: 620,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    dongu.start();
    return () => dongu.stop();
  }, [hava, yagmur]);

  return (
    <View style={{ gap: SP.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          {hedef.toLocaleUpperCase('tr-TR')}
        </PixelText>
        <PixelText size="micro" color={sapti ? C.rust : C.canvasFaint}>
          {sapti ? 'yoldan çıktın' : basladi ? 'yürüyorsun' : HAVA_METNI[hava]}
        </PixelText>
      </View>

      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={{
          height: SAHNE_YUKSEKLIK,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: '#232016',
          overflow: 'hidden',
        }}
      >
        <Gokyuzu saat={saat} yukseklik={SAHNE_YUKSEKLIK * UFUK} />

        {/* Zemin: ufkun altı beton, derz çizgileriyle */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: SAHNE_YUKSEKLIK * UFUK,
            bottom: 0,
          }}
        >
          <Svg width="100%" height="100%">
            <Rect x="0" y="0" width="100%" height="100%" fill={zeminRenk.ust} />
            <Rect x="0" y="40%" width="100%" height="60%" fill={zeminRenk.alt} />
            <Rect x="0" y="0" width="100%" height={2} fill={C.line} />
            {zemin === 'beton' ? (
              <>
                <Rect x="0" y={10} width="100%" height={1} fill={C.ink} opacity={0.5} />
                <Rect x="0" y={34} width="100%" height={1} fill={C.ink} opacity={0.4} />
              </>
            ) : (
              // Toprak ve çakılda düz derz yok, serpiştirilmiş iz var
              Array.from({ length: 16 }, (_, i) => (
                <Rect
                  key={i}
                  x={`${(i * 6.5 + ((gun + blokIndex) % 6)) % 98}%`}
                  y={6 + ((i * 11) % 44)}
                  width={zemin === 'cakil' ? 3 : 6}
                  height={2}
                  fill={C.ink}
                  opacity={0.32}
                />
              ))
            )}
          </Svg>
        </View>

        {/* Manzara ufkun dibinde; yürüdükçe hafif kayıyor */}
        {manzara.map((sp, i) => (
          <Animated.View
            key={`${sp}-${i}`}
            style={{
              position: 'absolute',
              left: `${8 + i * (76 / Math.max(1, manzara.length - 1 || 1))}%`,
              top: SAHNE_YUKSEKLIK * UFUK - 26,
              opacity: manzaraOpaklik,
              transform: [
                {
                  translateX: ilerleme.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -22 - i * 6],
                  }),
                },
              ],
            }}
          >
            <PixelSprite sprite={sprite(sp)} scale={2} />
          </Animated.View>
        ))}

        {/* Rota: soluk çizgiler, geçtiğin kısım pirinç sarısına dönüyor */}
        {yol?.cizgiler.map((c, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: c.x - 5,
              top: c.y - 2,
              width: 10,
              height: 4,
              transform: [{ rotate: `${c.aci}deg` }],
            }}
          >
            <View style={{ width: 10, height: 4, backgroundColor: C.canvasFaint, opacity: 0.55 }} />
            <Animated.View
              style={{
                position: 'absolute',
                width: 10,
                height: 4,
                backgroundColor: C.brass,
                opacity: ilerleme.interpolate({
                  inputRange: [Math.max(0, c.t - 0.03), c.t, 1],
                  outputRange: [0, 1, 1],
                }),
              }}
            />
          </View>
        ))}

        {/* Hedef mekan yolun sonunda; yaklaştıkça beliriyor */}
        {son && (
          <Animated.View
            style={{
              position: 'absolute',
              left: son.x - hedefEn / 2,
              top: son.y - hedefYuk,
              opacity: ilerleme.interpolate({
                inputRange: [0, 0.45, 1],
                outputRange: [0.25, 0.6, 1],
              }),
              transform: [
                { scale: ilerleme.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
              ],
            }}
          >
            <PixelSprite sprite={sprite(mekan)} scale={3} />
          </Animated.View>
        )}

        {/* Başlangıç işareti: rotanın nereden tutulacağı */}
        {yol && !basladi && (
          <View
            style={{
              position: 'absolute',
              left: yol.noktalar[0].x - 11,
              top: yol.noktalar[0].y - 11,
              width: 22,
              height: 22,
              borderWidth: BORDER,
              borderColor: C.brass,
            }}
          />
        )}

        {/* Asker: yolun neresindeysen orada, ayakları rotanın üstünde */}
        {yol && (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: [
                {
                  translateX: ilerleme.interpolate({
                    inputRange: yol.oranlar,
                    outputRange: yol.noktalar.map((n) => n.x - askerEn / 2),
                  }),
                },
                {
                  translateY: ilerleme.interpolate({
                    inputRange: yol.oranlar,
                    outputRange: yol.noktalar.map((n) => n.y - askerYuk),
                  }),
                },
                { translateY: zipla.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
              ],
            }}
          >
            <PixelSprite sprite={sprite(solAyak ? 'askerAdim' : 'asker')} scale={olcek} />
          </Animated.View>
        )}

        {!basladi && (
          <View style={{ position: 'absolute', top: SP.sm, alignSelf: 'center' }}>
            <View style={{ backgroundColor: C.ink, paddingHorizontal: SP.sm, paddingVertical: 2 }}>
              <PixelText font="command" size="body" color={C.brass}>
                PARMAĞINI YOLA KOY VE SÜRÜKLE
              </PixelText>
            </View>
          </View>
        )}

        {sapti && (
          <View style={{ position: 'absolute', bottom: SP.sm, alignSelf: 'center' }}>
            <View style={{ backgroundColor: C.ink, paddingHorizontal: SP.sm, paddingVertical: 2 }}>
              <PixelText font="command" size="body" color={C.rust}>
                YOLDAN ÇIKMA
              </PixelText>
            </View>
          </View>
        )}

        {/* Sis: ufuktan aşağı inen soluk perde */}
        {hava === 'sisli' && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: C.canvasFaint,
              opacity: 0.2,
            }}
          />
        )}

        {/* Yağmur: eğik çizgiler, sürekli akıyor */}
        {hava === 'yagmurlu' && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: -18,
              left: 0,
              right: 0,
              height: SAHNE_YUKSEKLIK + 18,
              transform: [
                { translateY: yagmur.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) },
              ],
            }}
          >
            <Svg width="100%" height={SAHNE_YUKSEKLIK + 18}>
              {Array.from({ length: 30 }, (_, i) => {
                const x = (i * 17 + (i % 3) * 5) % 100;
                const y = (i * 23) % (SAHNE_YUKSEKLIK - 6);
                return (
                  <Rect
                    key={i}
                    x={`${x}%`}
                    y={y}
                    width={1}
                    height={7}
                    fill={C.steel}
                    opacity={0.45}
                  />
                );
              })}
            </Svg>
          </Animated.View>
        )}

        {/* Dokunma katmanı en üstte: konum hep sahneye göre ölçülüyor */}
        <View
          {...pan.panHandlers}
          accessibilityRole="adjustable"
          accessibilityLabel={`${hedef} yürü — rotayı parmağınla takip et`}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </View>

      <PixelText size="micro" color={C.canvasFaint} center>
        {HAVA_YOL_NOTU[hava]}
      </PixelText>

      {/* Ne kadarı geride kaldı */}
      <View style={{ height: 8, backgroundColor: C.ink, borderWidth: 1, borderColor: C.line }}>
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: C.brass,
            width: ilerleme.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>
    </View>
  );
}
