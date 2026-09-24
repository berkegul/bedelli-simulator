import React, { useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import { C } from '../theme';
import { RANZA_YAN, komsuRanza, pencere } from '../art/sahne/kogus';
import { PixelSprite, type SpriteDef } from '../ui/PixelSprite';
import { useHareketAzalt } from '../ui/useHareketAzalt';
import type { planKur } from '../screens/DolapYerlesimi';
import { PixelText } from '../ui/PixelText';
import { Golge, Nefes, PikselKatman, Sahne } from '../ui/sahne';

/** Koğuş sahnesinin piksel hücresi. */
export const KOGUS_U = 3;

type Kutu = { x: number; y: number; w: number; h: number };

/**
 * Giyinme ve yatma hazırlığının ortak fonu: dolabın arkasında badana ve
 * yeşil lambri, önünde karo zemin, yanda pencere ve komşu ranza. Sabah
 * pencereden soluk ışık, gece tek tavan lambası.
 *
 * Dokunma alanları çağıranda; bu yalnızca çizim (pointerEvents yok).
 */
export function KogusFonu({
  en,
  yukseklik,
  zeminY,
  gece,
}: {
  en: number;
  yukseklik: number;
  /** Zeminin başladığı yükseklik (nokta): dolabın ayak hizası. */
  zeminY: number;
  gece: boolean;
}) {
  const u = KOGUS_U;
  const W = Math.floor(en / u);
  const H = Math.floor(yukseklik / u);
  const dekor = useMemo(
    () =>
      W > 0 ? [...pencere(W - 18, 6, gece), ...komsuRanza(2, Math.round(zeminY / u), 30)] : [],
    [W, gece, zeminY, u],
  );

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
      <Sahne
        yukseklik={yukseklik}
        u={u}
        duvar="badana"
        zemin="karo"
        zeminOrani={Math.max(0.1, 1 - zeminY / yukseklik)}
        losluk={gece ? 0.5 : 0.16}
        lambalar={
          gece
            ? [{ x: 50, y: 10, yaricap: 44, guc: 0.3 }]
            : [{ x: 84, y: (zeminY / yukseklik) * 100 + 8, yaricap: 26, guc: 0.14 }]
        }
        tohum={gece ? 11 : 5}
      >
        {W > 0 && (
          <PikselKatman
            pikseller={dekor}
            u={u}
            w={W}
            h={H}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}
      </Sahne>
      {gece && (
        // Tavan lambası: kablo ve yanan ampul
        <View style={{ position: 'absolute', top: 0, left: en / 2 - u, alignItems: 'center' }}>
          <View style={{ width: u / 2 + 1, height: 6 * u, backgroundColor: '#2A2820' }} />
          <View style={{ width: 4 * u, height: u, backgroundColor: '#3F4238' }} />
          <View style={{ width: 2 * u, height: 2 * u, backgroundColor: '#FFE6A0' }} />
        </View>
      )}
    </View>
  );
}

/** Yandan ranza: dokunma alanının içine çizilir, altına postal yeri. */
export function RanzaCizimi({ kutu, vurgulu }: { kutu: Kutu; vurgulu?: boolean }) {
  const olcek = Math.max(2, Math.min(4, Math.floor((kutu.w - 8) / 40)));
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' }}
    >
      <PixelSprite sprite={RANZA_YAN} scale={olcek} />
      <View
        style={{
          position: 'absolute',
          top: 2,
          left: 4,
          backgroundColor: C.ink,
          paddingHorizontal: 4,
        }}
      >
        <PixelText font="command" size="micro" color={vurgulu ? C.brass : C.canvasDim}>
          RANZA
        </PixelText>
      </View>
    </View>
  );
}

/** Ayakta duran sen: gölge, nefes, altında paspas. */
export function AskerDurusu({
  kare,
  olcek = 5,
}: {
  kare: Parameters<typeof PixelSprite>[0]['sprite'];
  olcek?: number;
}) {
  const genislik = kare.rows[0]?.length ?? 16;
  return (
    <View pointerEvents="none" style={{ alignItems: 'center' }}>
      <Nefes u={Math.max(1, Math.round(olcek / 2))}>
        <PixelSprite sprite={kare} scale={olcek} />
      </Nefes>
      <View style={{ marginTop: -olcek }}>
        <Golge genislik={Math.round(genislik * 0.8)} u={olcek} />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────── sac dolap

type Plan = ReturnType<typeof planKur>;
type Bolge = Plan['bolgeler'][number];

const SAC = '#5E6452';
const SAC_AC = '#777D68';
const SAC_KOYU = '#434838';
const YARIK = '#2A2D24';
const IC_YUZ = '#1C1B14';
const RAF_TAHTA = '#8A8D80';
const RAF_ALT = '#3F4238';
const BANT = '#D6CCA4';

/** Kenar bükümü: üst-sol ışık, alt-sağ gölge. */
function Bukum({
  w,
  h,
  ac = SAC_AC,
  koyu = SAC_KOYU,
}: {
  w: number;
  h: number;
  ac?: string;
  koyu?: string;
}) {
  return (
    <>
      <View
        style={{ position: 'absolute', left: 0, top: 0, width: w, height: 2, backgroundColor: ac }}
      />
      <View
        style={{ position: 'absolute', left: 0, top: 0, width: 2, height: h, backgroundColor: ac }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: w,
          height: 2,
          backgroundColor: koyu,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 2,
          height: h,
          backgroundColor: koyu,
        }}
      />
    </>
  );
}

/** Havalandırma yarıkları: sacı delen yatay çizgiler, altlarında ışık. */
function Yariklar({ adet, en }: { adet: number; en: number }) {
  return (
    <View style={{ gap: 3, alignItems: 'center' }}>
      {Array.from({ length: adet }, (_, i) => (
        <View key={i}>
          <View style={{ width: en, height: 2, backgroundColor: YARIK }} />
          <View style={{ width: en, height: 1, backgroundColor: SAC_AC }} />
        </View>
      ))}
    </View>
  );
}

/**
 * Koğuş dolabının gövdesi, açık kapağı ve iç yüzü. Raflar sac tahta, askı
 * bölümünde boru ve boş askılar. Gözlerin kapakları ayrı (KapaliGoz),
 * dokunma alanlarının içinde çiziliyor.
 */
export function SacDolap({ plan }: { plan: Plan }) {
  const { kapak, dolap, bolgeler } = plan;
  const ic = bolgeler.filter((b) => b.id !== 'kapi' && b.id !== 'torba');
  const aski = bolgeler.find((b) => b.id === 'aski');
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Zemine düşen gölge */}
      <View
        style={{
          position: 'absolute',
          left: kapak.x + 4,
          top: dolap.y + dolap.h - 2,
          width: dolap.x + dolap.w - kapak.x + 6,
          height: 8,
          backgroundColor: '#000',
          opacity: 0.35,
        }}
      />
      {/* Açık kapak, iç yüzü: yarıklar, kilit dili, ayna yerine teneke etiket */}
      <View
        style={{
          position: 'absolute',
          left: kapak.x,
          top: kapak.y,
          width: kapak.w,
          height: kapak.h,
          backgroundColor: SAC_KOYU,
          borderWidth: 1,
          borderColor: C.ink,
          alignItems: 'center',
          paddingTop: 10,
        }}
      >
        <Bukum w={kapak.w - 2} h={kapak.h - 2} ac={SAC} koyu="#30342A" />
        <Yariklar adet={4} en={kapak.w - 16} />
        <View
          style={{
            position: 'absolute',
            left: 4,
            top: kapak.h * 0.42 - 6,
            width: 7,
            height: 12,
            borderWidth: 2,
            borderColor: RAF_TAHTA,
          }}
        />
      </View>
      {/* Menteşeler: kapakla gövde arasında */}
      {[0.12, 0.5, 0.86].map((t) => (
        <View
          key={t}
          style={{
            position: 'absolute',
            left: kapak.x + kapak.w,
            top: dolap.y + dolap.h * t,
            width: dolap.x - kapak.x - kapak.w + 2,
            height: 8,
            backgroundColor: RAF_TAHTA,
            borderWidth: 1,
            borderColor: C.ink,
          }}
        />
      ))}

      {/* Gövde */}
      <View
        style={{
          position: 'absolute',
          left: dolap.x,
          top: dolap.y,
          width: dolap.w,
          height: dolap.h,
          backgroundColor: SAC,
          borderWidth: 1,
          borderColor: C.ink,
        }}
      >
        <Bukum w={dolap.w - 2} h={dolap.h - 2} />
        {/* Pirinç numara plakası, iki perçin */}
        <View
          style={{
            alignSelf: 'center',
            marginTop: 2,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#B98A22',
            borderWidth: 1,
            borderColor: '#6E5214',
            paddingHorizontal: 5,
          }}
        >
          <View style={{ width: 2, height: 2, backgroundColor: '#6E5214', marginRight: 4 }} />
          <PixelText font="command" size="micro" color="#2E2208">
            NO 17
          </PixelText>
          <View style={{ width: 2, height: 2, backgroundColor: '#6E5214', marginLeft: 4 }} />
        </View>
      </View>

      {/* İç: koyu, arka duvarda nokta kaynak izi */}
      {ic.map((b) => (
        <View
          key={b.id}
          style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            width: b.w,
            height: b.h,
            backgroundColor: IC_YUZ,
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              height: 3,
              backgroundColor: '#000',
              opacity: 0.4,
            }}
          />
          {/* Raf tahtası: üstü ışık, altı gölge */}
          <View
            style={{
              position: 'absolute',
              left: -2,
              right: -2,
              bottom: 0,
              height: 4,
              backgroundColor: RAF_TAHTA,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: -2,
              right: -2,
              bottom: 3,
              height: 1,
              backgroundColor: '#A5A898',
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: -2,
              right: -2,
              bottom: -3,
              height: 3,
              backgroundColor: RAF_ALT,
            }}
          />
        </View>
      ))}

      {/* Askı borusu ve boş tel askılar */}
      {aski && (
        <>
          <View
            style={{
              position: 'absolute',
              left: aski.x + 3,
              top: aski.y + 7,
              width: aski.w - 6,
              height: 3,
              backgroundColor: RAF_TAHTA,
            }}
          />
          {[0.72, 0.84].map((t) => (
            <View
              key={t}
              style={{
                position: 'absolute',
                left: aski.x + aski.w * t,
                top: aski.y + 5,
                alignItems: 'center',
              }}
            >
              <View style={{ width: 2, height: 6, backgroundColor: '#9A9C8E' }} />
              <View
                style={{
                  width: 16,
                  height: 2,
                  backgroundColor: '#9A9C8E',
                  transform: [{ rotate: '0deg' }],
                }}
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
}

/**
 * Kapalı göz: boyalı sac kapak, kenar bükümü, yarıklar, mandal ve elle
 * yazılmış bant etiket. `nabiz` açıksa (sıradaki ipucunun gösterdiği göz)
 * kenarı hafifçe pirinç yanıp sönüyor; `bakiyor` iken kapak aralanmış.
 */
export function KapaliGoz({
  r,
  ad,
  nabiz,
  bakiyor,
  karistiriyor,
}: {
  r: Bolge;
  ad: string;
  nabiz?: boolean;
  bakiyor?: boolean;
  karistiriyor?: boolean;
}) {
  const azalt = useHareketAzalt();
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!nabiz || azalt) {
      t.setValue(0);
      return;
    }
    const d = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    );
    d.start();
    return () => d.stop();
  }, [nabiz, azalt, t]);

  return (
    <View
      pointerEvents="none"
      style={{ width: r.w, height: r.h, backgroundColor: SAC, overflow: 'hidden' }}
    >
      <Bukum w={r.w} h={r.h} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 8, alignItems: 'center' }}>
        <Yariklar adet={r.h > 80 ? 3 : 2} en={Math.round(r.w * 0.45)} />
      </View>
      {/* Bant etiket: kâğıt, köşesi kalkık */}
      <View
        style={{
          position: 'absolute',
          left: 10,
          bottom: 8,
          backgroundColor: BANT,
          paddingHorizontal: 5,
          paddingVertical: 1,
          transform: [{ rotate: '-2deg' }],
          borderBottomWidth: 1,
          borderColor: '#A89E78',
        }}
      >
        <PixelText font="command" size="micro" color={C.murekkep}>
          {ad.toLocaleUpperCase('tr-TR')}
        </PixelText>
      </View>
      {/* Mandal */}
      <View
        style={{
          position: 'absolute',
          right: 10,
          top: r.h / 2 - 7,
          width: 8,
          height: 14,
          backgroundColor: RAF_TAHTA,
          borderWidth: 1,
          borderColor: C.ink,
        }}
      >
        <View style={{ margin: 2, height: 3, backgroundColor: '#A5A898' }} />
      </View>
      {/* Aralanmış kapak: sol kenarda karanlık yarık */}
      {bakiyor && (
        <>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 10,
              backgroundColor: IC_YUZ,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 26,
              top: r.h / 2 - 8,
              backgroundColor: C.ink,
              paddingHorizontal: 4,
            }}
          >
            <PixelText font="command" size="micro" color={C.brass}>
              {karistiriyor ? 'KARIŞTIRIYORSUN…' : 'BAKIYORSUN…'}
            </PixelText>
          </View>
        </>
      )}
      {nabiz && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderWidth: 2,
            borderColor: C.brass,
            opacity: azalt ? 0.6 : t.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.9] }),
          }}
        />
      )}
    </View>
  );
}

/**
 * Açık gözün rafında duran, oyuna konu olmayan eşyalar: dolap ilk gün nasıl
 * dizildiyse. Sağdan dizilir, sürüklenen parçalar solda kalır.
 */
export function RafEsyalari({ r, spritelar }: { r: Bolge; spritelar: SpriteDef[] }) {
  if (!spritelar.length) return null;
  const olcek = 2;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: r.x,
        top: r.y,
        width: r.w - 6,
        height: r.h - 4,
        flexDirection: 'row-reverse',
        alignItems: r.id === 'aski' ? 'flex-start' : 'flex-end',
        paddingTop: r.id === 'aski' ? 10 : 0,
        gap: 2,
        overflow: 'hidden',
      }}
    >
      {spritelar.slice(0, 4).map((s, i) => (
        <PixelSprite key={i} sprite={s} scale={olcek} />
      ))}
    </View>
  );
}

/** Asker'in durduğu yer: koğuş paspası. Bırakma alanı çağıranda aynı kalıyor. */
export function Paspas({ en }: { en: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        width: en,
        height: 10,
        backgroundColor: '#4A3A2A',
        borderWidth: 1,
        borderColor: C.ink,
      }}
    >
      <View style={{ margin: 2, height: 2, backgroundColor: '#6A5436' }} />
    </View>
  );
}
