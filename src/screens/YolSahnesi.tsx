import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import {
  Canvas,
  Group,
  Oval,
  Path,
  Picture,
  Rect,
  Skia,
  createPicture,
} from '@shopify/react-native-skia';
import type { SkPicture } from '@shopify/react-native-skia';

import { BORDER, C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { Siddet, secim, titret } from '../ui/haptik';
import {
  HAVA_METNI,
  HAVA_YOL_NOTU,
  ZEMIN_RENK,
  havaDurumu,
  zeminTipi,
  type Hava,
  type Zemin,
} from '../engine/hava';
import {
  KADANS,
  LIDER_PAYI,
  TOLERANS,
  VARIS_ESIGI,
  kapiyaYakin,
  konumBul,
  serpinti,
  yerlesimAra,
  yolKur,
  yolaIzdusum,
  yurumeSuresi,
  type Bakis,
  type Yerlesim,
  type YolGeometrisi,
} from '../engine/yuruyus';
import { isikDurumu } from '../ui/Gokyuzu';
import { spriteResmi } from '../ui/skia/SkiaSprite';
import { PixelText } from '../ui/PixelText';
import { useZamanlayici } from '../ui/useZamanlayici';
import { sesCal } from '../ses';

const SAHNE_YUKSEKLIK = 244;

/** Bir tam adım çifti (sol + sağ) kaç milisaniye sürüyor. */
const ADIM_CIFTI = KADANS * 2 * 1000;

/** Gövdenin adım arasında ne kadar yükseldiği. */
const SALINIM = 3.2;

const GIRIS_SURESI = 780;

type Props = {
  hedef: string;
  adim: number;
  /** Yolun sonunda beliren mekan. */
  mekan: SpriteKey;
  /** Yol boyunca geçilen manzara, sırayla. */
  manzara: SpriteKey[];
  /** Sahnenin hangi kameradan çekildiği. */
  bakis: Bakis;
  /** Bloğun saati; gökyüzünün rengini bu belirliyor. */
  saat: string;
  /** Hava ve zemin bu ikisinden türetiliyor. */
  gun: number;
  blokIndex: number;
  /** Üniforma daha giyilmediyse yürüyen sivil kıyafetle. */
  sivil?: boolean;
  onVardi: () => void;
};

/**
 * İki blok arası yürüyüş. Zemine çizilmiş rotayı parmağınla takip
 * ediyorsun — ama asker parmağa yapışık değil: parmak nereye gideceğini
 * söylüyor, asker oraya kendi temposuyla yürüyor. Parmağını kaldırsan da
 * verdiğin hedefe kadar yürüyüp duruyor; yoldan çıkarsan ilerlemiyor.
 *
 * Sahne tek bir Skia tuvali. Her yağmur damlasının ayrı bir görünüm
 * olduğu sürümde hava otuz çizgiyle sınırlıydı; burada yağmur, sis, toz
 * ve ayak izleri aynı tuvale çiziliyor ve sayıları maliyet değil.
 *
 * Yürüyüş elle çevrilen bir kare döngüsü değil, bildirimsel animasyon:
 * sabit hızla yürümek zaten "kalan mesafe / hız kadar sürede doğrusal
 * git" demek. Hem niyeti daha iyi anlatıyor hem de her platformda aynı
 * çalışıyor — elle kurulan döngü (useFrameCallback) web'de hiç dönmüyor.
 */
export function YolSahnesi({
  hedef,
  adim,
  mekan,
  manzara,
  bakis,
  saat,
  gun,
  blokIndex,
  sivil = false,
  onVardi,
}: Props) {
  const hava = havaDurumu(gun, blokIndex);
  const zemin = zeminTipi(gun, blokIndex);

  const [en, setEn] = useState(0);
  const [basladi, setBasladi] = useState(false);
  const [sapti, setSapti] = useState(false);
  const [azaltilmis, setAzaltilmis] = useState(false);

  const t = useSharedValue(0);

  useEffect(() => {
    let canli = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => canli && setAzaltilmis(v));
    return () => {
      canli = false;
    };
  }, []);

  const geo = useMemo(() => {
    // Ölçüm gelmeden rota kurulmaz: kıvrım ekranın genişliğinden türüyor.
    if (en < 140) return null;
    return yolKur({ bakis, en, yuk: SAHNE_YUKSEKLIK, hedef, adim, manzara });
  }, [bakis, en, hedef, adim, manzara]);

  const ilerlemeStili = useAnimatedStyle(() => ({ transform: [{ scaleX: t.value }] }));

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
        {geo && (
          <Sahne
            key={`${bakis}-${en}-${hedef}`}
            geo={geo}
            t={t}
            adim={adim}
            mekan={mekan}
            saat={saat}
            gun={gun}
            blokIndex={blokIndex}
            hava={hava}
            zemin={zemin}
            azaltilmis={azaltilmis}
            onBasladi={() => setBasladi(true)}
            onSapma={setSapti}
            sivil={sivil}
            onVardi={onVardi}
          />
        )}

        {!basladi && (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', top: SP.sm, alignSelf: 'center' }}
          >
            <View style={{ backgroundColor: C.ink, paddingHorizontal: SP.sm, paddingVertical: 2 }}>
              <PixelText font="command" size="body" color={C.brass}>
                PARMAĞINI YOLA KOY VE SÜRÜKLE
              </PixelText>
            </View>
          </View>
        )}

        {sapti && (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', bottom: SP.sm, alignSelf: 'center' }}
          >
            <View style={{ backgroundColor: C.ink, paddingHorizontal: SP.sm, paddingVertical: 2 }}>
              <PixelText font="command" size="body" color={C.rust}>
                YOLDAN ÇIKMA
              </PixelText>
            </View>
          </View>
        )}
      </View>

      <PixelText size="micro" color={C.canvasFaint} center>
        {HAVA_YOL_NOTU[hava]}
      </PixelText>

      {/* Ne kadarı geride kaldı */}
      <View style={{ height: 8, backgroundColor: C.ink, borderWidth: 1, borderColor: C.line }}>
        <Animated.View
          style={[
            {
              height: '100%',
              width: '100%',
              backgroundColor: C.brass,
              transformOrigin: 'left center',
            },
            ilerlemeStili,
          ]}
        />
      </View>
    </View>
  );
}

type SahneProps = {
  geo: YolGeometrisi;
  t: SharedValue<number>;
  adim: number;
  mekan: SpriteKey;
  saat: string;
  gun: number;
  blokIndex: number;
  hava: Hava;
  zemin: Zemin;
  azaltilmis: boolean;
  onBasladi: () => void;
  onSapma: (v: boolean) => void;
  sivil: boolean;
  onVardi: () => void;
};

type Iz = { id: number; x: number; y: number; olcek: number; yon: number };

function Sahne({
  geo,
  t,
  adim,
  mekan,
  saat,
  gun,
  blokIndex,
  hava,
  zemin,
  azaltilmis,
  onBasladi,
  onSapma,
  sivil,
  onVardi,
}: SahneProps) {
  const z = useZamanlayici();
  const { en, yuk, ufuk, ox, oy, oolcek } = geo;
  const isik = isikDurumu(saat);
  const zeminRenk = ZEMIN_RENK[zemin];

  // Sis ve yağmur uzağı yutuyor: manzara ve hedef bina daha az görünüyor.
  const uzakOpaklik = hava === 'sisli' ? 0.3 : hava === 'yagmurlu' ? 0.52 : 0.72;
  const izBirakir = zemin !== 'beton';
  const arkadan = geo.bakis === 'perspektif';

  /** Oran cinsinden hız: saniyede yolun ne kadarı. */
  const hiz = 1 / yurumeSuresi(adim);

  const hedefT = useSharedValue(0);
  const faz = useSharedValue(0);
  const yuruyor = useSharedValue(0);
  const giris = useSharedValue(azaltilmis ? 1 : 0);
  const kilit = useSharedValue(0);
  const bitti = useSharedValue(0);

  // Ortam animasyonları 0→1 arasında dönen bağımsız fazlar.
  const yagmurFaz = useSharedValue(0);
  const tozFaz = useSharedValue(0);
  const ruzgarFaz = useSharedValue(0);

  const [izler, setIzler] = useState<Iz[]>([]);
  const [karartma, setKarartma] = useState(0);

  const ayakBasti = useCallback(
    (oran: number, sol: boolean) => {
      // Zemin ne kadar sertse dokunuş o kadar belirgin.
      if (zemin === 'cakil') titret(Siddet.Light);
      else secim();
      sesCal(sol ? 'adim1' : 'adim2');

      if (!izBirakir) return;
      const k = konumBul(ox, oy, oolcek, oran);
      setIzler((eski) =>
        [
          ...eski,
          { id: Date.now() + Math.random(), x: k.x, y: k.y, olcek: k.olcek, yon: sol ? -1 : 1 },
        ].slice(-14),
      );
    },
    [izBirakir, ox, oy, oolcek, zemin],
  );

  const vardi = useCallback(() => {
    titret(Siddet.Medium);
    // Kapıya varınca sahne kararıyor; blok bir anda yerine geçmiyor.
    // Zamanlayıcı bileşene bağlı: karartma sürerken sahne kalkarsa onVardi
    // kapanmış ekrandan çağrılmıyor.
    const basla = Date.now();
    const tik = z.aralik(32, () => {
      const o = Math.min(1, (Date.now() - basla) / 420);
      setKarartma(o);
      if (o >= 1) {
        z.durdur(tik);
        onVardi();
      }
    });
  }, [onVardi, z]);

  /**
   * Askere "şuraya kadar yürü" demek. Süre kalan mesafeden hesaplanıyor ve
   * easing doğrusal — yani hız hep aynı, parmağın hızı değil askerinki.
   * Parmak her kıpırdadığında hedef tazeleniyor; asker yeni hedefe göre
   * yürümeye devam ediyor, sıçramıyor.
   */
  const yuru = useCallback(
    (ham: number) => {
      'worklet';
      // Yolun son onda birine gelince gerisi askerin işi: kapının önünde
      // parmağı bekletmiyorsun, son adımları kendi atıyor.
      const yeni = ham >= VARIS_ESIGI ? 1 : ham;
      const kalan = yeni - t.value;
      if (kalan <= 0.0008) return;

      if (yeni >= 1) kilit.set(1);
      hedefT.set(yeni);
      if (yuruyor.value < 0.5) {
        yuruyor.set(withTiming(1, { duration: 120 }));
        faz.set(0);
        faz.set(
          withRepeat(withTiming(1, { duration: ADIM_CIFTI, easing: Easing.linear }), -1, false),
        );
      }

      t.set(
        withTiming(
          yeni,
          { duration: (kalan / hiz) * 1000, easing: Easing.linear },
          (tamamlandi) => {
            // Yeni bir hedef geldiyse bu geri çağrı yarıda kesilmiş demektir.
            if (!tamamlandi) return;
            // Durunca donup kalmıyor: gövde sakinleşiyor, hazır ol duruşuna dönüyor.
            yuruyor.value = withTiming(0, { duration: 190 });
            cancelAnimation(faz);
            if (yeni >= 1 && bitti.value === 0) {
              bitti.value = 1;
              runOnJS(vardi)();
            }
          },
        ),
      );
    },
    [bitti, faz, hedefT, hiz, kilit, t, vardi, yuruyor],
  );

  // Kadraja giriş: asker yoktan var olmuyor, soldan yürüyerek geliyor.
  useEffect(() => {
    // t üst bileşende yaşıyor (ilerleme çubuğu onu okuyor), hedefT burada.
    // Sahne tek başına yeniden kurulduğunda — ölçü değişince olur — ikisi
    // birbirinden ayrı düşüyor ve asker yolun ortasında kilitli kalıyordu.
    t.set(0);
    if (azaltilmis) {
      giris.set(1);
      return;
    }
    giris.set(withTiming(1, { duration: GIRIS_SURESI, easing: Easing.out(Easing.quad) }));
    faz.set(withRepeat(withTiming(1, { duration: ADIM_CIFTI, easing: Easing.linear }), -1, false));
    yuruyor.set(withTiming(1, { duration: 120 }));
    // Kadraja girdikten sonra parmağı bekleyerek duruyor.
    yuruyor.set(withDelay(GIRIS_SURESI, withTiming(0, { duration: 190 })));
  }, [azaltilmis, faz, giris, t, yuruyor]);

  // Yağmur ve rüzgâr yürüsen de dursan da akıyor.
  useEffect(() => {
    if (azaltilmis) return;
    const dongu = (sure: number) =>
      withRepeat(withTiming(1, { duration: sure, easing: Easing.linear }), -1, false);

    if (hava === 'yagmurlu') yagmurFaz.set(dongu(YAGMUR_SURE));
    if (hava === 'ruzgarli') {
      tozFaz.set(dongu(TOZ_SURE));
      ruzgarFaz.set(dongu(2400));
    }
    return () => {
      cancelAnimation(yagmurFaz);
      cancelAnimation(tozFaz);
      cancelAnimation(ruzgarFaz);
    };
  }, [azaltilmis, hava, ruzgarFaz, tozFaz, yagmurFaz]);

  // Ayak kontak karelerinde yere basıyor: fazın 0 ve 0.5'i.
  useAnimatedReaction(
    () => (yuruyor.value > 0.5 && giris.value >= 1 ? Math.floor(faz.value * 4) : -1),
    (kare, onceki) => {
      if (kare < 0 || onceki === null || onceki < 0 || kare === onceki) return;
      if (kare % 2 === 0) runOnJS(ayakBasti)(t.value, kare === 0);
    },
  );

  /**
   * Parmağın bulunduğu yere göre askerin yeni hedefi. Hedef, askerin şu
   * anki yerinden en fazla LIDER_PAYI kadar öne taşınabiliyor: yolu
   * yürütmek için parmağını yol boyunca gezdirmen gerekiyor, bir yere
   * dokunup bırakmak oraya ışınlamıyor.
   */
  const ilerlet = useCallback(
    (x: number, y: number) => {
      'worklet';
      if (kilit.value === 1) return;
      const { t: yeni, mesafe } = yolaIzdusum(ox, oy, x, y);
      if (mesafe > TOLERANS) {
        runOnJS(onSapma)(true);
        return;
      }
      runOnJS(onSapma)(false);

      const istenen = kapiyaYakin(ox, oy, x, y, yeni) ? 1 : yeni;
      const hedeflenen = Math.min(istenen, t.value + LIDER_PAYI);
      if (hedeflenen > hedefT.value) {
        runOnJS(onBasladi)();
        yuru(hedeflenen);
      }
    },
    [hedefT, kilit, onBasladi, onSapma, ox, oy, t, yuru],
  );

  const jest = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        // Sahne bir ScrollView'ın içinde ve perspektif kamerada yol ekranda
        // neredeyse dikey duruyor — rotayı takip eden parmak sayfayı
        // kaydırmaya kapılıyordu. Elle etkinleştirme, dokunuşu daha ilk
        // temasta sahneye bağlıyor: parmağın sahnedeyken sayfa kaymıyor.
        .manualActivation(true)
        .onTouchesDown((_e, durum) => {
          'worklet';
          durum.activate();
        })
        .onBegin((e) => {
          'worklet';
          ilerlet(e.x, e.y);
        })
        .onUpdate((e) => {
          'worklet';
          // Geriye gidilmiyor; hedef yalnızca ileri taşınıyor.
          ilerlet(e.x, e.y);
        })
        .onFinalize(() => {
          'worklet';
          runOnJS(onSapma)(false);
        }),
    [ilerlet, onSapma],
  );

  // ── Askerin duruşu ────────────────────────────────────────────────
  const askerKareleri = useMemo(() => {
    // Kontak (iki ayak yerde) ile geçiş (bir ayak havada) arasında gidip
    // geliyor. Gövdenin inip kalkması sprite'ta değil, salınımda.
    const adlar: SpriteKey[] = sivil
      ? arkadan
        ? ['sivilArka', 'sivilArkaSol', 'sivilArka', 'sivilArkaSag']
        : ['sivil', 'sivilAdimSol', 'sivil', 'sivilAdimSag']
      : arkadan
        ? ['askerArka', 'askerArkaSol', 'askerArka', 'askerArkaSag']
        : ['asker', 'askerAdimSol', 'asker', 'askerAdimSag'];
    return adlar.map((a) => spriteResmi(sprite(a)).resim);
  }, [arkadan, sivil]);

  const askerKare = useDerivedValue<SkPicture>(() => {
    if (yuruyor.value <= 0.02) return askerKareleri[0];
    // Yürüyüş başlarken faz bir kare boyunca tanımsız (NaN) ya da sınır dışı
    // olabiliyor; dizinin dışı Skia'ya boş resim veriyor ve çiziciyi
    // çökertiyordu. Kare her zaman 0–3 arasında.
    const kare = Math.floor(faz.value * 4);
    return askerKareleri[kare >= 0 && kare <= 3 ? kare : 0];
  });

  // Rüzgâr tek bir salınım; hem ağaçlar hem asker aynı esintiden eğiliyor.
  const esinti = useDerivedValue(() => {
    if (hava !== 'ruzgarli') return 0;
    const a = ruzgarFaz.value * Math.PI * 2;
    return Math.sin(a) * 0.06 + Math.sin(a * 2.6) * 0.025;
  });

  const askerDonusum = useDerivedValue(() => {
    const k = konumBul(ox, oy, oolcek, t.value);
    // Gövde adım arasında yükseliyor, ayak bastığında iniyor.
    const salinim =
      -Math.abs(Math.sin(faz.value * Math.PI * 2)) * SALINIM * k.olcek * yuruyor.value;
    const girisKaymasi = (1 - giris.value) * -44;
    return [
      { translateX: k.x + girisKaymasi },
      { translateY: k.y + salinim },
      { scale: k.olcek * 3 },
      // Yürürken hafif öne, rüzgârda yana yatıyor.
      { skewX: -esinti.value - yuruyor.value * 0.03 },
    ];
  });

  const askerOpaklik = useDerivedValue(() => giris.value);

  const golgeDonusum = useDerivedValue(() => {
    // Gölge yerde kalıyor: gövde zıplarken ayak izi kıpırdamıyor.
    const k = konumBul(ox, oy, oolcek, t.value);
    const girisKaymasi = (1 - giris.value) * -44;
    return [{ translateX: k.x + girisKaymasi }, { translateY: k.y }, { scale: k.olcek }];
  });

  // Gölge ancak gökyüzü açıkken keskin; bulutta ve siste dağılıyor.
  const golgeOpaklik = hava === 'acik' ? 0.4 : hava === 'sisli' ? 0.12 : 0.24;

  // ── Yol şeridi ────────────────────────────────────────────────────
  const yolYolu = useMemo(() => {
    const p = Skia.Path.Make();
    const n = ox.length;
    const dik = (i: number) => {
      const dx = i === 0 ? ox[1] - ox[0] : ox[i] - ox[i - 1];
      const dy = i === 0 ? oy[1] - oy[0] : oy[i] - oy[i - 1];
      const boy = Math.hypot(dx, dy) || 1;
      return { px: (-dy / boy) * geo.oen[i], py: (dx / boy) * geo.oen[i] };
    };
    // Bir kenardan gidip öteki kenardan dönen kapalı şerit.
    for (let i = 0; i < n; i++) {
      const { px, py } = dik(i);
      if (i === 0) p.moveTo(ox[i] + px, oy[i] + py);
      else p.lineTo(ox[i] + px, oy[i] + py);
    }
    for (let i = n - 1; i >= 0; i--) {
      const { px, py } = dik(i);
      p.lineTo(ox[i] - px, oy[i] - py);
    }
    p.close();
    return p;
  }, [ox, oy, geo.oen]);

  /** Geçilen kısım pirinç sarısına dönüyor — kırpma askerin bulunduğu yere kadar. */
  const gecilenKirpma = useDerivedValue(() => {
    const k = konumBul(ox, oy, oolcek, t.value);
    return arkadan
      ? Skia.XYWHRect(0, k.y - 3, en, yuk - k.y + 3)
      : Skia.XYWHRect(0, 0, k.x + 3, yuk);
  });

  // ── Sabit çizimler ────────────────────────────────────────────────
  const zeminResmi = useMemo(
    () => zeminCiz(en, yuk, ufuk, zemin, zeminRenk, gun + blokIndex),
    [en, yuk, ufuk, zemin, zeminRenk, gun, blokIndex],
  );

  const yagmurResmi = useMemo(
    () => (hava === 'yagmurlu' ? yagmurCiz(en, yuk) : null),
    [hava, en, yuk],
  );

  const tozResmi = useMemo(
    () => (hava === 'ruzgarli' ? tozCiz(en, yuk, ufuk) : null),
    [hava, en, yuk, ufuk],
  );

  const yagmurKaymasi = useDerivedValue(() => [{ translateY: yagmurFaz.value * YAGMUR_PERIYOT }]);

  const tozKaymasi = useDerivedValue(() => [{ translateX: -tozFaz.value * en }]);

  const binaYeri = useDerivedValue(() => {
    const b = yerlesimAra(geo.bina, t.value);
    return [{ translateX: b.x }, { translateY: b.y }, { scale: b.olcek * 3 }];
  });

  const binaOpaklik = useDerivedValue(() =>
    Math.min(1, uzakOpaklik + t.value * (1 - uzakOpaklik) * 1.4),
  );

  return (
    <>
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: en, height: yuk }}>
        {/* Gökyüzü: yumuşak degrade yok, bant geçişi */}
        {Array.from({ length: 5 }, (_, i) => (
          <Rect
            key={`gok${i}`}
            x={0}
            y={(ufuk / 5) * i}
            width={en}
            height={ufuk / 5 + 1}
            color={i < 2.5 ? isik.ust : isik.alt}
            opacity={i === 2 ? 0.75 : 1}
          />
        ))}

        {isik.yildiz &&
          YILDIZLAR.map((y, i) => (
            <Rect
              key={`yil${i}`}
              x={(y.x / 100) * en}
              y={(y.y / 100) * ufuk}
              width={2}
              height={2}
              color={C.canvas}
              opacity={0.55}
            />
          ))}

        {isik.cisim && (
          <Group
            transform={[
              { translateX: en * 0.84 },
              { translateY: Math.max(22, (1 - isik.yukseklik) * (ufuk - 8)) + 20 },
              { scale: 2 },
            ]}
            opacity={0.9}
          >
            <Picture picture={spriteResmi(sprite(isik.cisim === 'gunes' ? 'gunes' : 'ay')).resim} />
          </Group>
        )}

        {/* Zemin ve dokusu */}
        <Picture picture={zeminResmi} />

        {/* Yol şeridi: soluk hâli, üstüne geçtiğin kısım pirinç sarısı */}
        <Group clip={yolYolu} opacity={0.42}>
          <Rect x={0} y={0} width={en} height={yuk} color={C.canvasFaint} />
        </Group>
        {/* Kenar çizgisi olmadan şerit zemine yayılmış bir leke gibi
            duruyordu; çizgi onu "yol" yapan şey. */}
        <Path path={yolYolu} style="stroke" strokeWidth={2} color={C.ink} opacity={0.55} />
        <Group clip={gecilenKirpma}>
          <Group clip={yolYolu} opacity={0.72}>
            <Rect x={0} y={0} width={en} height={yuk} color={C.brass} />
          </Group>
        </Group>

        {/* Ayak izleri: yalnız toprak ve çakılda kalıyor */}
        {izler.map((iz, i) => (
          <Rect
            key={iz.id}
            x={iz.x + iz.yon * 3 * iz.olcek - 2 * iz.olcek}
            y={iz.y - 1.5 * iz.olcek}
            width={4 * iz.olcek}
            height={3 * iz.olcek}
            color={zemin === 'cakil' ? C.canvasFaint : C.ink}
            opacity={
              (0.1 + (i / Math.max(1, izler.length)) * 0.3) * (hava === 'yagmurlu' ? 1.3 : 1)
            }
          />
        ))}

        {/* Manzara: yürüdükçe kayıyor, perspektifte üstüne geliyor */}
        {geo.manzara.map((m, i) => (
          <ManzaraParcasi
            key={`${m.sprite}-${i}`}
            yerlesim={m.yer}
            sprite={m.sprite}
            t={t}
            esinti={esinti}
            opaklik={uzakOpaklik}
          />
        ))}

        {/* Hedef mekan yolun bittiği yerde */}
        <Group transform={binaYeri} opacity={binaOpaklik}>
          <Picture picture={spriteResmi(sprite(mekan)).resim} />
        </Group>

        {/* Gölge askerin ayağının dibinde */}
        <Group transform={golgeDonusum} opacity={golgeOpaklik}>
          <Oval x={-11} y={-3.5} width={22} height={7} color={C.ink} />
        </Group>

        <Group transform={askerDonusum} opacity={askerOpaklik}>
          <Picture picture={askerKare} />
        </Group>

        {/* Rüzgâr: yandan sürüklenen toz */}
        {tozResmi && (
          <Group transform={tozKaymasi} opacity={0.5}>
            <Picture picture={tozResmi} />
            <Group transform={[{ translateX: en }]}>
              <Picture picture={tozResmi} />
            </Group>
          </Group>
        )}

        {/* Yağmur: dikey periyodu tam tutturulmuş alan, dikişsiz akıyor */}
        {yagmurResmi && (
          <Group transform={yagmurKaymasi}>
            <Picture picture={yagmurResmi} />
          </Group>
        )}

        {/* Sis ufukta yoğun, ayağının dibinde yok */}
        {hava === 'sisli' && (
          <>
            <Rect x={0} y={0} width={en} height={ufuk} color={C.canvasFaint} opacity={0.26} />
            {Array.from({ length: 7 }, (_, i) => (
              <Rect
                key={`sis${i}`}
                x={0}
                y={ufuk - 14 + i * ((yuk - ufuk + 14) / 7)}
                width={en}
                height={(yuk - ufuk + 14) / 7 + 1}
                color={C.canvasFaint}
                opacity={0.34 - i * 0.045}
              />
            ))}
          </>
        )}

        {/* Varış karartması */}
        {karartma > 0 && (
          <Rect x={0} y={0} width={en} height={yuk} color={C.ink} opacity={karartma} />
        )}
      </Canvas>

      {/* Dokunma katmanı en üstte: konum hep sahneye göre ölçülüyor */}
      <GestureDetector gesture={jest}>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel="Rotayı parmağınla takip et"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </GestureDetector>
    </>
  );
}

/** Tek bir manzara parçası — yerini t'den, eğimini rüzgârdan alıyor. */
function ManzaraParcasi({
  yerlesim,
  sprite: sp,
  t,
  esinti,
  opaklik,
}: {
  yerlesim: Yerlesim;
  sprite: SpriteKey;
  t: SharedValue<number>;
  esinti: SharedValue<number>;
  opaklik: number;
}) {
  const resim = spriteResmi(sprite(sp)).resim;
  const salinan = sp === 'agac';

  const donusum = useDerivedValue(() => {
    const y = yerlesimAra(yerlesim, t.value);
    return [
      { translateX: y.x },
      { translateY: y.y },
      { scale: y.olcek * 2 },
      // Ağaçlar rüzgârda kökünden eğiliyor; sprite'ın çapası ayağında.
      { skewX: salinan ? esinti.value * 1.6 : 0 },
    ];
  });

  return (
    <Group transform={donusum} opacity={opaklik}>
      <Picture picture={resim} />
    </Group>
  );
}

const YILDIZLAR = [
  { x: 12, y: 32 },
  { x: 28, y: 16 },
  { x: 41, y: 46 },
  { x: 57, y: 24 },
  { x: 69, y: 52 },
  { x: 78, y: 19 },
  { x: 88, y: 42 },
  { x: 21, y: 60 },
  { x: 63, y: 11 },
  { x: 92, y: 70 },
];

/** Zemin dokusu: beton derzi, toprak izi, çakıl taneleri. */
function zeminCiz(
  en: number,
  yuk: number,
  ufuk: number,
  zemin: Zemin,
  renk: { ust: string; alt: string },
  tohum: number,
) {
  return createPicture(
    (canvas) => {
      const boya = (r: string, o = 1) => {
        const p = Skia.Paint();
        p.setColor(Skia.Color(r));
        p.setAlphaf(o);
        p.setAntiAlias(false);
        return p;
      };

      const h = yuk - ufuk;
      canvas.drawRect(Skia.XYWHRect(0, ufuk, en, h), boya(renk.ust));
      canvas.drawRect(Skia.XYWHRect(0, ufuk + h * 0.4, en, h * 0.6), boya(renk.alt));
      canvas.drawRect(Skia.XYWHRect(0, ufuk, en, 2), boya(C.line));

      if (zemin === 'beton') {
        // Derzler ufka doğru sıklaşıyor: düz aralık yerine perspektif.
        for (let i = 1; i <= 6; i++) {
          const y = ufuk + h * Math.pow(i / 6, 1.9);
          canvas.drawRect(Skia.XYWHRect(0, y, en, 1), boya(C.ink, 0.42));
        }
      } else {
        const adet = zemin === 'cakil' ? 150 : 70;
        for (let i = 0; i < adet; i++) {
          const r1 = serpinti(i * 3 + tohum);
          const r2 = serpinti(i * 7 + tohum + 41);
          // Uzaktaki taneler küçük ve sık, yakındakiler iri.
          const derin = Math.pow(r2, 0.6);
          const y = ufuk + 4 + derin * (h - 8);
          const boy = zemin === 'cakil' ? 1 + derin * 2 : 2 + derin * 5;
          canvas.drawRect(
            Skia.XYWHRect(r1 * en, y, boy, Math.max(1, boy * 0.5)),
            boya(zemin === 'cakil' ? C.canvasFaint : C.ink, 0.16 + derin * 0.22),
          );
        }
      }
    },
    Skia.XYWHRect(0, 0, en, yuk),
  );
}

/**
 * Yağmurun dikey periyodu ile kayma mesafesi birebir aynı; alan bir
 * periyot kayınca kendi üstüne oturuyor ve döngü başa dönerken hiçbir şey
 * zıplamıyor. Eski sürümde damlalar saniyede 29 piksel gidiyor ve her
 * 620 ms'de görünür biçimde geri sıçrıyordu.
 */
const YAGMUR_PERIYOT = 96;
const YAGMUR_SURE = 300;
const TOZ_SURE = 2600;

function yagmurCiz(en: number, yuk: number) {
  return createPicture(
    (canvas) => {
      const tekrar = Math.ceil((yuk + YAGMUR_PERIYOT) / YAGMUR_PERIYOT) + 1;

      const katman = (
        adet: number,
        opaklik: number,
        kalinlik: number,
        boyTaban: number,
        ofset: number,
      ) => {
        const boya = Skia.Paint();
        boya.setColor(Skia.Color(C.steel));
        boya.setAlphaf(opaklik);
        boya.setStrokeWidth(kalinlik);
        boya.setAntiAlias(false);

        for (let i = 0; i < adet; i++) {
          const x = serpinti(i * 5 + ofset) * en;
          const y = serpinti(i * 11 + ofset + 17) * YAGMUR_PERIYOT;
          const boy = boyTaban + serpinti(i * 3 + ofset + 5) * 4;
          for (let k = 0; k < tekrar; k++) {
            const yk = y + k * YAGMUR_PERIYOT - YAGMUR_PERIYOT;
            // Hafif eğik: dimdik düşen yağmur oyuncak gibi duruyor.
            canvas.drawLine(x, yk, x - boy * 0.24, yk + boy, boya);
          }
        }
      };

      // Uzaktaki yağmur ince ve soluk, öndeki kalın — derinlik buradan geliyor.
      katman(22, 0.3, 1, 7, 0);
      katman(14, 0.5, 2, 11, 91);
    },
    Skia.XYWHRect(0, -YAGMUR_PERIYOT, en, yuk + YAGMUR_PERIYOT * 2),
  );
}

/** Rüzgârda sürüklenen toz: yandan vuran havayı görünür kılan tek şey. */
function tozCiz(en: number, yuk: number, ufuk: number) {
  return createPicture(
    (canvas) => {
      const boya = Skia.Paint();
      boya.setColor(Skia.Color(C.canvasDim));
      boya.setAntiAlias(false);

      for (let i = 0; i < 26; i++) {
        const derin = serpinti(i * 13 + 3);
        const y = ufuk + 6 + derin * (yuk - ufuk - 10);
        const boy = 5 + derin * 16;
        boya.setAlphaf(0.1 + derin * 0.22);
        canvas.drawRect(Skia.XYWHRect(serpinti(i * 7) * en, y, boy, 1), boya);
      }
    },
    Skia.XYWHRect(0, 0, en, yuk),
  );
}
