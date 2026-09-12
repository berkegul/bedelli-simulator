import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import {
  BOLGE_ADI,
  BOLGE_DE,
  dolapDenetimi,
  duzendekiler,
  torbadakiler,
  yiginDuzeni,
  type DolapParcasi,
} from '../content/dolap';
import type { Choice, DolapBolgesi, DolapDuzeni, Envanter } from '../engine/types';
import { Siddet, titret } from '../ui/haptik';
import { PixelButton } from '../ui/PixelButton';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

/**
 * Koğuşa ilk giriş: torbadaki eşyaları tek tek dolaba yerleştiriyorsun.
 * Eskiden "düzenli yerleştir / çabuk tık" diye iki düğmeydi; artık eşyayı
 * eline alıp rafına koyuyorsun. Çamaşır üst rafa, postal alt göze, kilit
 * kapağa — neyin nereye gittiği kayda geçiyor ve dördüncü gün denetimde
 * Yüzbaşı tam olarak bunu görüyor (bkz. DolapDenetimi).
 *
 * Sürüklemek tek yol değil: eşyaya dokunup sonra rafa dokunmak da
 * yerleştiriyor. Parmakla uzun sürükleme herkese rahat gelmiyor.
 */

type Bolge = DolapBolgesi;
/** Bırakılabilen her yer: dolabın bölgeleri, bir de geri koymak için torba. */
type Hedef = Bolge | 'torba';

type Rect = { x: number; y: number; w: number; h: number };
type HedefRect = Rect & { id: Hedef };

// ── Geometri ─────────────────────────────────────────────────────────

export const KUTU = 44;
const ADIM = KUTU + 4;
const CERCEVE = 6;
const RAF = 4;
const PLAKA = 14;
const KAPAK_EN = 46;
const ARALIK = 6;
const TORBA_BASLIK = 24;

const BOLGE_BOY: [Bolge, number][] = [
  ['ust', 58],
  ['aski', 100],
  ['orta', 110],
  ['alt', 58],
];

export function planKur(en: number, adet: number) {
  const dolapEn = Math.min(300, en - KAPAK_EN - ARALIK - 8);
  const icBoy = BOLGE_BOY.reduce((t, [, h]) => t + h, 0) + RAF * (BOLGE_BOY.length - 1);
  const dolapBoy = icBoy + CERCEVE * 2 + PLAKA;
  const sol = Math.max(4, (en - (KAPAK_EN + ARALIK + dolapEn)) / 2);

  // Kapak sola açılmış; perspektiften biraz kısa görünüyor.
  const kapak: Rect = { x: sol, y: 8, w: KAPAK_EN, h: dolapBoy - 16 };
  const dolap: Rect = { x: sol + KAPAK_EN + ARALIK, y: 0, w: dolapEn, h: dolapBoy };

  const bolgeler: HedefRect[] = [{ id: 'kapi', ...kapak }];
  let y = dolap.y + CERCEVE + PLAKA;
  for (const [id, h] of BOLGE_BOY) {
    bolgeler.push({ id, x: dolap.x + CERCEVE, y, w: dolapEn - CERCEVE * 2, h });
    y += h + RAF;
  }

  const torbaEn = en - 8;
  const sutun = Math.max(1, Math.floor((torbaEn - 12) / ADIM));
  const satir = Math.max(1, Math.ceil(adet / sutun));
  const torba: HedefRect = {
    id: 'torba',
    x: 4,
    y: dolap.y + dolapBoy + 20,
    w: torbaEn,
    h: TORBA_BASLIK + satir * ADIM + 12,
  };
  bolgeler.push(torba);

  return { kapak, dolap, bolgeler, torba, yukseklik: torba.y + torba.h + 4 };
}

type Plan = ReturnType<typeof planKur>;

/** Bölgedeki `sira`ncı kutunun yeri. Sığmazsa kutular yan yana sıkışıyor, bölgeden taşmıyor. */
export function yuva(r: HedefRect, sira: number, adet: number) {
  const ic = 6;
  const ust = r.id === 'aski' ? 14 : r.id === 'torba' ? TORBA_BASLIK : ic;

  // Kilit kapağın ortasındaki kilit dilinde duruyor; üstüne konan her şey alta diziliyor.
  if (r.id === 'kapi') {
    return { x: r.x + (r.w - KUTU) / 2, y: r.y + r.h * 0.42 - KUTU / 2 + sira * ADIM };
  }

  const sutun = Math.max(1, Math.floor((r.w - ic * 2) / ADIM));
  const satir = Math.max(1, Math.floor((r.h - ust - ic) / ADIM));
  const gerekSutun = Math.max(sutun, Math.ceil(adet / satir));
  const adimX = gerekSutun > sutun ? (r.w - ic * 2 - KUTU) / Math.max(1, gerekSutun - 1) : ADIM;
  return {
    x: r.x + ic + (sira % gerekSutun) * adimX,
    y: r.y + ust + Math.floor(sira / gerekSutun) * ADIM,
  };
}

function bolgeBul(rects: HedefRect[], x: number, y: number): Hedef | null {
  'worklet';
  for (const r of rects) {
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r.id;
  }
  return null;
}

type Yerlesim = Record<string, { bolge: Bolge; t: number }>;

/** Her parçanın ekrandaki yeri: dolaptaysa bölgesindeki sırası, değilse torbadaki sırası. */
function hedefHesapla(plan: Plan, parcalar: DolapParcasi[], yerler: Yerlesim) {
  const out: Record<string, { x: number; y: number }> = {};
  const rect = (id: Hedef) => plan.bolgeler.find((b) => b.id === id)!;

  const torbada = parcalar.filter((p) => !yerler[p.id]);
  torbada.forEach((p, i) => (out[p.id] = yuva(rect('torba'), i, torbada.length)));

  for (const id of ['ust', 'aski', 'orta', 'alt', 'kapi'] as const) {
    const burada = parcalar
      .filter((p) => yerler[p.id]?.bolge === id)
      .sort((a, b) => yerler[a.id].t - yerler[b.id].t);
    burada.forEach((p, i) => (out[p.id] = yuva(rect(id), i, burada.length)));
  }
  return out;
}

const YAY = { damping: 17, stiffness: 210, mass: 0.6 };

/**
 * Web'de fare sürüklemesi eşyayı değil bölge adlarını ve yazıları seçiyordu.
 * RN'nin tiplerinde `userSelect` yok ama react-native-web tanıyor.
 */
export const SECILMEZ = (Platform.OS === 'web' ? { userSelect: 'none' } : {}) as ViewStyle;

// ── Yerleştirme ──────────────────────────────────────────────────────

export function DolapYerlesimi({
  envanter,
  onBitti,
}: {
  envanter: Envanter;
  onBitti: (c: Choice, duzen: DolapDuzeni) => void;
}) {
  const parcalar = useMemo(() => torbadakiler(envanter), [envanter]);
  const [en, setEn] = useState(0);
  const [yerler, setYerler] = useState<Yerlesim>({});
  const [secili, setSecili] = useState<string | null>(null);
  const [tutulan, setTutulan] = useState<string | null>(null);
  const hover = useSharedValue<Hedef | null>(null);
  const sayac = useRef(0);

  const plan = useMemo(() => (en > 0 ? planKur(en, parcalar.length) : null), [en, parcalar.length]);
  const hedefler = useMemo(
    () => (plan ? hedefHesapla(plan, parcalar, yerler) : {}),
    [plan, parcalar, yerler],
  );

  const yerlestir = useCallback((id: string, h: Hedef | null) => {
    // Boşluğa bırakılan eşya eski yerine döner; yeri değişmiyor.
    if (!h) return;
    titret(Siddet.Light);
    setYerler((y) => {
      if (h === 'torba') {
        if (!y[id]) return y;
        const { [id]: _, ...kalan } = y;
        return kalan;
      }
      if (y[id]?.bolge === h) return y;
      sayac.current += 1;
      return { ...y, [id]: { bolge: h, t: sayac.current } };
    });
    setSecili(null);
  }, []);

  const onBasla = useCallback((id: string) => {
    setTutulan(id);
    setSecili(null);
  }, []);

  const onBirak = useCallback(
    (id: string, x: number, y: number) => {
      setTutulan(null);
      if (plan) yerlestir(id, bolgeBul(plan.bolgeler, x, y));
    },
    [plan, yerlestir],
  );

  const onDokun = useCallback((id: string) => {
    setTutulan(null);
    setSecili((s) => (s === id ? null : id));
  }, []);

  const yerlesen = parcalar.filter((p) => yerler[p.id]).length;
  const hepsi = yerlesen === parcalar.length;
  const odak = parcalar.find((p) => p.id === (tutulan ?? secili));

  const kapat = () => {
    const dogrular = parcalar.filter((p) => yerler[p.id]?.bolge === p.dogru).length;
    const oran = dogrular / parcalar.length;
    const yanlis = parcalar.find((p) => yerler[p.id] && yerler[p.id].bolge !== p.dogru);
    const outcome =
      oran === 1
        ? 'Her şey yerli yerinde. Onbaşı dolaba baktı, kapağı kendisi kapattı. Yarın sabahki telaşta bunu kendine teşekkür edeceksin.'
        : oran >= 0.6 && yanlis
          ? `Çoğu yerinde ama ${yanlis.ad.toLocaleLowerCase('tr-TR')} ${BOLGE_DE[yerler[yanlis.id].bolge]} kaldı. Yarın sabah onu ararken bulacaksın kendini.`
          : 'Dolap doldu ama düzen yok. Onbaşı kapağı açtı, baktı, bir şey demeden kapattı. Bu iyi bir işaret değil.';

    // Kayda yerleştirme sırasıyla geçiyor: denetimde raflar aynı sırayla dizilsin.
    const sirali = parcalar
      .filter((p) => yerler[p.id])
      .sort((a, b) => yerler[a.id].t - yerler[b.id].t);
    const duzen: DolapDuzeni = {
      yerler: Object.fromEntries(sirali.map((p) => [p.id, yerler[p.id].bolge])),
    };

    onBitti(
      {
        id: 'd1-yerlesim-duzenli',
        label: 'Dolabı kapat',
        effect: { disiplin: Math.round(-2 + oran * 10), enerji: -6, ...(oran === 1 && { moral: 3 }) },
        outcome,
      },
      duzen,
    );
  };

  const bosalt = () =>
    onBitti(
      {
        id: 'd1-yerlesim-hizli',
        label: 'Torbayı dolaba boşalt',
        effect: { disiplin: -4, enerji: 4, moral: 3 },
        outcome: 'Torbayı dolaba boşalttın. Yarın sabah bu dolabı açmak istemeyeceksin.',
      },
      yiginDuzeni(envanter),
    );

  return (
    <View style={{ gap: SP.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          DOLABIN
        </PixelText>
        <PixelText font="command" size="body" color={hepsi ? C.olive : C.canvasFaint}>
          {`${yerlesen} / ${parcalar.length}`}
        </PixelText>
      </View>

      <PixelText size="small" color={odak ? C.brass : C.canvasFaint} line="snug">
        {odak
          ? secili
            ? `${odak.ad} elinde. Koyacağın yere dokun.`
            : odak.ad
          : 'Eşyayı torbadan tut, dolapta yerine sürükle. Dokunup sonra rafa dokunmak da olur.'}
      </PixelText>

      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={[{ height: plan?.yukseklik ?? 520 }, SECILMEZ]}
      >
        {plan && (
          <>
            <DolapCizimi plan={plan} torba />

            {plan.bolgeler.map((r) => (
              <BolgeKutusu
                key={r.id}
                r={r}
                hover={hover}
                acik={!!(tutulan || secili)}
                onPress={() => secili && yerlestir(secili, r.id)}
              />
            ))}

            {parcalar.map((p) => {
              const h = hedefler[p.id];
              if (!h) return null;
              return (
                <Esya
                  key={p.id}
                  parca={p}
                  hedef={h}
                  dolapta={!!yerler[p.id]}
                  secili={secili === p.id}
                  hover={hover}
                  bolgeler={plan.bolgeler}
                  onBasla={onBasla}
                  onBirak={onBirak}
                  onDokun={onDokun}
                />
              );
            })}
          </>
        )}
      </View>

      <PixelButton
        label={hepsi ? 'Dolabı kapat' : `Torbada ${parcalar.length - yerlesen} parça kaldı`}
        tur={hepsi ? 'ana' : 'sessiz'}
        disabled={!hepsi}
        onPress={kapat}
      />
      <PixelButton label="Uğraşma, torbayı dolaba boşalt" tur="secim" onPress={bosalt} />
    </View>
  );
}

// ── Denetim ──────────────────────────────────────────────────────────

/**
 * Dördüncü gün: Yüzbaşı dolabı açıyor. Kayıttaki yerleşim olduğu gibi
 * çiziliyor — ilk gün nereye ne koyduysan orada. Yanlış yerdeki her
 * parça pas rengi çerçeveyle işaretli; Yüzbaşı'nın gözü onlarda.
 */
export function DolapDenetimi({
  duzen,
  onBitti,
}: {
  duzen: DolapDuzeni | null;
  onBitti: (c: Choice) => void;
}) {
  const [en, setEn] = useState(0);
  const sonuc = useMemo(() => dolapDenetimi(duzen), [duzen]);
  const parcalar = useMemo(() => (duzen ? duzendekiler(duzen) : []), [duzen]);
  const yerler = useMemo<Yerlesim>(
    () =>
      duzen
        ? Object.fromEntries(parcalar.map((p, t) => [p.id, { bolge: duzen.yerler[p.id], t }]))
        : {},
    [duzen, parcalar],
  );

  const plan = useMemo(() => (en > 0 ? planKur(en, 0) : null), [en]);
  const hedefler = useMemo(
    () => (plan ? hedefHesapla(plan, parcalar, yerler) : {}),
    [plan, parcalar, yerler],
  );

  const bitir = () =>
    onBitti({ id: 'dolap-denetimi', label: 'Hazır olda bekle', effect: sonuc.etki, outcome: sonuc.metin });

  return (
    <View style={{ gap: SP.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          DOLAP DENETİMİ
        </PixelText>
        {duzen && (
          <PixelText
            font="command"
            size="body"
            color={sonuc.yanlislar.length ? C.rust : C.olive}
          >
            {sonuc.yanlislar.length ? `${sonuc.yanlislar.length} yanlış` : 'kusursuz'}
          </PixelText>
        )}
      </View>

      {duzen ? (
        <View
          onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
          style={{ height: plan ? plan.dolap.h + 12 : 420 }}
        >
          {plan && (
            <>
              <DolapCizimi plan={plan} />
              {parcalar.map((p) => {
                const h = hedefler[p.id];
                if (!h) return null;
                const yanlis = sonuc.yanlislar.includes(p.id);
                return (
                  <View
                    key={p.id}
                    accessibilityLabel={
                      yanlis ? `${p.ad}, yanlış yerde: ${BOLGE_DE[duzen.yerler[p.id]]}` : p.ad
                    }
                    style={{
                      position: 'absolute',
                      left: h.x,
                      top: h.y,
                      width: KUTU,
                      height: KUTU,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: yanlis ? 2 : 0,
                      borderColor: C.rust,
                    }}
                  >
                    <PixelSprite sprite={sprite(p.sprite)} scale={3} />
                  </View>
                );
              })}
            </>
          )}
        </View>
      ) : (
        <PixelText size="small" color={C.canvasFaint} line="snug">
          Bu kayıtta dolap yerleşimi yok; ilk gün dolap sahnesinden önce başlamış bir oyun.
        </PixelText>
      )}

      <PixelButton label="Hazır olda bekle" onPress={bitir} />
    </View>
  );
}

// ── Parçalar ─────────────────────────────────────────────────────────

const METAL = '#4F5A48';
const METAL_KOYU = '#3A4235';
const RAF_RENK = '#7C8189';
const IC = '#1A1912';

/** Dolabın kendisi: kapak, gövde, raflar, askı borusu ve istenirse altta torba. */
export function DolapCizimi({ plan, torba = false }: { plan: Plan; torba?: boolean }) {
  const { kapak, dolap, bolgeler } = plan;
  const bolge = (id: Hedef) => bolgeler.find((b) => b.id === id)!;
  const aski = bolge('aski');

  return (
    <>
      {/* Açık kapak: havalandırma yarıkları ve kilit dili */}
      <View
        style={{
          position: 'absolute',
          left: kapak.x,
          top: kapak.y,
          width: kapak.w,
          height: kapak.h,
          backgroundColor: METAL_KOYU,
          borderWidth: BORDER,
          borderColor: C.ink,
          alignItems: 'center',
          paddingTop: 10,
          gap: 4,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={{ width: kapak.w - 18, height: 3, backgroundColor: C.ink }} />
        ))}
        <View
          style={{
            position: 'absolute',
            left: 3,
            top: kapak.h * 0.42 - 6,
            width: 8,
            height: 12,
            borderWidth: 2,
            borderColor: RAF_RENK,
          }}
        />
      </View>

      {/* Gövde */}
      <View
        style={{
          position: 'absolute',
          left: dolap.x,
          top: dolap.y,
          width: dolap.w,
          height: dolap.h,
          backgroundColor: METAL,
          borderWidth: BORDER,
          borderColor: C.ink,
        }}
      >
        <View style={{ alignItems: 'center', height: PLAKA, justifyContent: 'center' }}>
          <View style={{ backgroundColor: C.ink, paddingHorizontal: SP.xs }}>
            <PixelText font="command" size="micro" color={C.brass}>
              NO 17
            </PixelText>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            left: CERCEVE - BORDER,
            right: CERCEVE - BORDER,
            top: CERCEVE + PLAKA - BORDER,
            bottom: CERCEVE - BORDER,
            backgroundColor: IC,
          }}
        />
      </View>

      {/* Raflar: bölgelerin arasındaki metal şerit */}
      {BOLGE_BOY.slice(0, -1).map(([id]) => {
        const r = bolge(id);
        return (
          <View
            key={`raf-${id}`}
            style={{
              position: 'absolute',
              left: r.x,
              top: r.y + r.h,
              width: r.w,
              height: RAF,
              backgroundColor: RAF_RENK,
            }}
          />
        );
      })}

      {/* Askı borusu */}
      <View
        style={{
          position: 'absolute',
          left: aski.x + 4,
          top: aski.y + 8,
          width: aski.w - 8,
          height: 3,
          backgroundColor: RAF_RENK,
        }}
      />

      {torba && (
        <View
          style={{
            position: 'absolute',
            left: plan.torba.x,
            top: plan.torba.y,
            width: plan.torba.w,
            height: plan.torba.h,
            backgroundColor: '#5C4D31',
            borderWidth: BORDER,
            borderColor: C.ink,
            borderTopWidth: 6,
            borderTopColor: '#3F3421',
            paddingHorizontal: SP.sm,
            paddingTop: 2,
          }}
        >
          <PixelText font="command" size="micro" color={C.canvasDim}>
            TORBAN
          </PixelText>
        </View>
      )}

      {/* Bölge adları */}
      {(['ust', 'aski', 'orta', 'alt'] as const).map((id) => {
        const r = bolge(id);
        return (
          <View
            key={`ad-${id}`}
            pointerEvents="none"
            style={{ position: 'absolute', left: r.x + r.w - 70, top: r.y + r.h - 14, width: 66 }}
          >
            <PixelText size="micro" color={C.canvasFaint} style={{ textAlign: 'right' }}>
              {BOLGE_ADI[id].toLocaleUpperCase('tr-TR')}
            </PixelText>
          </View>
        );
      })}
    </>
  );
}

/**
 * Bırakılabilir alan. Bir eşya eldeyken kesikli çizgiyle beliriyor,
 * üstüne gelinen bölge pirinç rengine dönüyor.
 */
function BolgeKutusu({
  r,
  hover,
  acik,
  onPress,
}: {
  r: HedefRect;
  hover: SharedValue<Hedef | null>;
  acik: boolean;
  onPress: () => void;
}) {
  const vurgu = useAnimatedStyle(() => {
    const ustunde = hover.value === r.id;
    return {
      borderColor: ustunde ? C.brass : 'transparent',
      backgroundColor: ustunde ? 'rgba(217,165,33,0.14)' : 'transparent',
    };
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={r.id === 'torba' ? 'Torba' : BOLGE_ADI[r.id]}
      onPress={onPress}
      style={{
        position: 'absolute',
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: acik && r.id !== 'torba' ? C.line : 'transparent',
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderWidth: 2 }, vurgu]}
      />
    </Pressable>
  );
}

/**
 * Tutulup taşınan eşya. Konumu tamamen öteleme: hedef değişince (rafa
 * kondu, torbaya döndü, yanındaki alındı ve sıra kaydı) yayla oraya
 * gidiyor. Tutulunca biraz büyüyor ve her şeyin üstüne çıkıyor.
 */
function Esya({
  parca,
  hedef,
  dolapta,
  secili,
  hover,
  bolgeler,
  onBasla,
  onBirak,
  onDokun,
}: {
  parca: DolapParcasi;
  hedef: { x: number; y: number };
  dolapta: boolean;
  secili: boolean;
  hover: SharedValue<Hedef | null>;
  bolgeler: HedefRect[];
  onBasla: (id: string) => void;
  onBirak: (id: string, x: number, y: number) => void;
  onDokun: (id: string) => void;
}) {
  const x = useSharedValue(hedef.x);
  const y = useSharedValue(hedef.y);
  const basX = useSharedValue(0);
  const basY = useSharedValue(0);
  const tutuluyor = useSharedValue(0);

  const hedefRef = useRef(hedef);
  hedefRef.current = hedef;

  useEffect(() => {
    x.value = withSpring(hedef.x, YAY);
    y.value = withSpring(hedef.y, YAY);
  }, [hedef.x, hedef.y, x, y]);

  // Bırakılınca önce bildiği yere dönüyor; yeri değiştiyse bir sonraki
  // çizimde hedef güncelleniyor ve yay yeni yere kıvrılıyor.
  const yerineOtur = useCallback(() => {
    x.value = withSpring(hedefRef.current.x, YAY);
    y.value = withSpring(hedefRef.current.y, YAY);
  }, [x, y]);

  const id = parca.id;
  const basla = useCallback(() => onBasla(id), [id, onBasla]);
  const birak = useCallback(
    (cx: number, cy: number) => {
      onBirak(id, cx, cy);
      yerineOtur();
    },
    [id, onBirak, yerineOtur],
  );
  const dokun = useCallback(() => {
    onDokun(id);
    yerineOtur();
  }, [id, onDokun, yerineOtur]);

  const jest = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        // Sahne bir ScrollView'ın içinde. Eşyaya değen parmak sayfayı
        // kaydırmasın diye jest ilk temasta etkinleşiyor (bkz. YolSahnesi).
        .manualActivation(true)
        .onTouchesDown((_e, durum) => {
          'worklet';
          durum.activate();
        })
        .onStart(() => {
          'worklet';
          cancelAnimation(x);
          cancelAnimation(y);
          basX.value = x.value;
          basY.value = y.value;
          tutuluyor.value = withTiming(1, { duration: 90 });
          runOnJS(basla)();
        })
        .onUpdate((e) => {
          'worklet';
          x.value = basX.value + e.translationX;
          y.value = basY.value + e.translationY;
          hover.value = bolgeBul(bolgeler, x.value + KUTU / 2, y.value + KUTU / 2);
        })
        .onEnd((e) => {
          'worklet';
          const kisa = Math.abs(e.translationX) + Math.abs(e.translationY) < 6;
          if (kisa) runOnJS(dokun)();
          else runOnJS(birak)(x.value + KUTU / 2, y.value + KUTU / 2);
        })
        .onFinalize(() => {
          'worklet';
          tutuluyor.value = withTiming(0, { duration: 140 });
          hover.value = null;
        }),
    [basX, basY, basla, birak, bolgeler, dokun, hover, tutuluyor, x, y],
  );

  const stil = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: 1 + tutuluyor.value * 0.14 },
    ],
    zIndex: tutuluyor.value > 0.01 ? 30 : 2,
  }));

  return (
    <GestureDetector gesture={jest}>
      <Animated.View
        accessibilityRole="button"
        accessibilityLabel={parca.ad}
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            width: KUTU,
            height: KUTU,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: dolapta ? 'transparent' : C.surface,
            borderWidth: secili ? 2 : dolapta ? 0 : 1,
            borderColor: secili ? C.brass : C.line,
          },
          stil,
        ]}
      >
        <PixelSprite sprite={sprite(parca.sprite)} scale={3} />
      </Animated.View>
    </GestureDetector>
  );
}
