import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { Gokyuzu } from './Gokyuzu';
import { PixelSprite } from './PixelSprite';
import { PixelText } from './PixelText';

const YUKSEKLIK = 150;
const ZEMIN = 26;

type Oge = {
  sprite: SpriteKey;
  olcek: number;
  x: number;
  taban?: number;
  /** Arka plandaki öğeler soluk: derinlik hissi buradan geliyor. */
  arka?: boolean;
};
type Mekan = {
  ad: string;
  ic: boolean;
  /** Arkada duran isimsiz kalabalık; koğuş 28 kişilik, üç asker göstermek yalan. */
  kalabalik?: number;
  /** Sağ üstte yazan mevcut — metin "yirmi sekiz kişi" derken göz de görsün. */
  mevcut?: string;
  ogeler: Oge[];
};

/**
 * Her bloğun geçtiği yerin ince bir kesiti. Oyuncu gün boyunca aynı metin
 * kutusuna bakmak yerine nerede olduğunu görüyor: yemekhane, içtima alanı,
 * koğuş. İç mekanlarda gökyüzü yok, duvar var.
 */
const MEKANLAR: Record<string, Mekan> = {
  nizamiye: {
    ad: 'Nizamiye',
    ic: false,
    kalabalik: 8,
    mevcut: 'SEVKİYAT',
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 30 },
      { sprite: 'agac', olcek: 2, x: 8 },
      { sprite: 'bayrak', olcek: 2, x: 78 },
    ],
  },
  kalkis: {
    ad: 'Koğuş',
    ic: true,
    kalabalik: 22,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 2, taban: ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 62, taban: ZEMIN + 34, arka: true },
      { sprite: 'ranzaDaginik', olcek: 2, x: 0 },
      { sprite: 'ranzaToplu', olcek: 2, x: 26 },
      { sprite: 'asker', olcek: 2, x: 55 },
      { sprite: 'cavus', olcek: 2, x: 84 },
    ],
  },
  kogus: {
    ad: 'Koğuş',
    ic: true,
    kalabalik: 22,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 2, taban: ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 62, taban: ZEMIN + 34, arka: true },
      { sprite: 'ranzaToplu', olcek: 2, x: 0 },
      { sprite: 'ranzaToplu', olcek: 2, x: 26 },
      { sprite: 'postal', olcek: 2, x: 54 },
      { sprite: 'camasirTorbasi', olcek: 2, x: 68 },
      { sprite: 'asker', olcek: 2, x: 86 },
    ],
  },
  mintika: {
    ad: 'Avlu — mıntıka',
    ic: false,
    kalabalik: 14,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 34, taban: ZEMIN + 26, arka: true },
      { sprite: 'agac', olcek: 2, x: 4 },
      { sprite: 'askerSirt', olcek: 2, x: 40 },
      { sprite: 'asker', olcek: 2, x: 62 },
      { sprite: 'postal', olcek: 2, x: 86 },
    ],
  },
  denetim: {
    ad: 'Koğuş — denetim',
    ic: true,
    kalabalik: 22,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 2, taban: ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 62, taban: ZEMIN + 34, arka: true },
      { sprite: 'ranzaToplu', olcek: 2, x: 0 },
      { sprite: 'ranzaToplu', olcek: 2, x: 26 },
      { sprite: 'asker', olcek: 2, x: 54 },
      { sprite: 'askerEmre', olcek: 2, x: 69 },
      { sprite: 'cavus', olcek: 2, x: 86 },
    ],
  },
  ders: {
    ad: 'Sınıf',
    ic: true,
    kalabalik: 20,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'hedefTahtasi', olcek: 2, x: 4, taban: ZEMIN + 26, arka: true },
      { sprite: 'pencere', olcek: 2, x: 78, taban: ZEMIN + 34, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 2, x: 2, taban: ZEMIN + 2 },
      { sprite: 'yemekhaneMasa', olcek: 2, x: 30, taban: ZEMIN + 2 },
      { sprite: 'askerSirt', olcek: 2, x: 8, taban: ZEMIN + 12 },
      { sprite: 'askerSirt', olcek: 2, x: 34, taban: ZEMIN + 12 },
      { sprite: 'cavus', olcek: 2, x: 58 },
      { sprite: 'defter', olcek: 2, x: 88 },
    ],
  },
  ictima: {
    ad: 'İçtima alanı',
    ic: false,
    kalabalik: 34,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'kisla', olcek: 2, x: 30, taban: ZEMIN + 26, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 22, taban: ZEMIN + 22, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 30, taban: ZEMIN + 22, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 38, taban: ZEMIN + 22, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 46, taban: ZEMIN + 22, arka: true },
      { sprite: 'bayrak', olcek: 2, x: 4 },
      { sprite: 'asker', olcek: 2, x: 32 },
      { sprite: 'askerEmre', olcek: 2, x: 48 },
      { sprite: 'askerSerkan', olcek: 2, x: 64 },
      { sprite: 'cavus', olcek: 2, x: 86 },
    ],
  },
  'aksam-ictima': {
    ad: 'İçtima alanı',
    ic: false,
    kalabalik: 34,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'bayrak', olcek: 2, x: 6 },
      { sprite: 'askerTolga', olcek: 2, x: 36 },
      { sprite: 'asker', olcek: 2, x: 52 },
      { sprite: 'cavus', olcek: 2, x: 82 },
    ],
  },
  kahvalti: {
    ad: 'Yemekhane',
    ic: true,
    kalabalik: 26,
    mevcut: 'SIRA VAR',
    ogeler: [
      { sprite: 'tepsiBandi', olcek: 2, x: 46, taban: ZEMIN + 32, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 52, taban: ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 64, taban: ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 76, taban: ZEMIN + 24, arka: true },
      { sprite: 'pencere', olcek: 2, x: 8, taban: ZEMIN + 40, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 0, taban: ZEMIN + 2 },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 36, taban: ZEMIN + 2 },
      { sprite: 'asker', olcek: 2, x: 74 },
      { sprite: 'askerEmre', olcek: 2, x: 88 },
    ],
  },
  ogle: {
    ad: 'Yemekhane',
    ic: true,
    kalabalik: 26,
    mevcut: 'SIRA VAR',
    ogeler: [
      { sprite: 'tepsiBandi', olcek: 2, x: 46, taban: ZEMIN + 32, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 52, taban: ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 64, taban: ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 76, taban: ZEMIN + 24, arka: true },
      { sprite: 'pencere', olcek: 2, x: 8, taban: ZEMIN + 40, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 0, taban: ZEMIN + 2 },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 36, taban: ZEMIN + 2 },
      { sprite: 'askerTolga', olcek: 2, x: 74 },
      { sprite: 'asker', olcek: 2, x: 88 },
    ],
  },
  'aksam-yemek': {
    ad: 'Yemekhane',
    ic: true,
    kalabalik: 26,
    mevcut: 'SIRA VAR',
    ogeler: [
      { sprite: 'tepsiBandi', olcek: 2, x: 46, taban: ZEMIN + 32, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 52, taban: ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 64, taban: ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 2, x: 76, taban: ZEMIN + 24, arka: true },
      { sprite: 'pencere', olcek: 2, x: 8, taban: ZEMIN + 40, arka: true },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 0, taban: ZEMIN + 2 },
      { sprite: 'yemekhaneMasa', olcek: 3, x: 36, taban: ZEMIN + 2 },
      { sprite: 'askerSerkan', olcek: 2, x: 74 },
      { sprite: 'asker', olcek: 2, x: 88 },
    ],
  },
  'egitim-sabah': {
    ad: 'Eğitim sahası',
    ic: false,
    kalabalik: 20,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'agac', olcek: 2, x: 20, taban: ZEMIN + 24, arka: true },
      { sprite: 'agac', olcek: 2, x: 60, taban: ZEMIN + 24, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 34, taban: ZEMIN + 22, arka: true },
      { sprite: 'askerSirt', olcek: 1, x: 42, taban: ZEMIN + 22, arka: true },
      { sprite: 'engel', olcek: 2, x: 2, taban: ZEMIN + 2 },
      { sprite: 'hedefTahtasi', olcek: 2, x: 42 },
      { sprite: 'asker', olcek: 2, x: 72 },
      { sprite: 'cavus', olcek: 2, x: 88 },
    ],
  },
  talim: {
    ad: 'Talim alanı',
    ic: false,
    kalabalik: 16,
    mevcut: 'BÖLÜK',
    ogeler: [
      { sprite: 'hedefTahtasi', olcek: 2, x: 6 },
      { sprite: 'tufek', olcek: 2, x: 36, taban: ZEMIN + 8 },
      { sprite: 'asker', olcek: 2, x: 72 },
      { sprite: 'cavus', olcek: 2, x: 88 },
    ],
  },
  serbest: {
    ad: 'Avlu',
    ic: false,
    kalabalik: 10,
    ogeler: [
      { sprite: 'kantinBina', olcek: 2, x: 4 },
      { sprite: 'agac', olcek: 2, x: 48 },
      { sprite: 'ankesor', olcek: 1, x: 70 },
      { sprite: 'askerEmre', olcek: 2, x: 84 },
    ],
  },
  'son-yoklama': {
    ad: 'Koğuş',
    ic: true,
    kalabalik: 22,
    mevcut: '28 KİŞİ',
    ogeler: [
      { sprite: 'dolapSirasi', olcek: 2, x: 2, taban: ZEMIN + 30, arka: true },
      { sprite: 'pencere', olcek: 2, x: 62, taban: ZEMIN + 34, arka: true },
      { sprite: 'ranzaToplu', olcek: 2, x: 0 },
      { sprite: 'ranzaToplu', olcek: 2, x: 26 },
      { sprite: 'askerTolga', olcek: 2, x: 54 },
      { sprite: 'asker', olcek: 2, x: 69 },
      { sprite: 'cavus', olcek: 2, x: 86 },
    ],
  },
};

export function mekanBul(blokId: string): Mekan | undefined {
  const anahtar = blokId.replace(/^d\d+-/, '');
  return MEKANLAR[anahtar];
}

/** Kalabalık her karede aynı yerde dursun diye sabit, tohumlu dağınıklık. */
const dagitim = (i: number) => {
  const n = Math.sin(i * 12.9898) * 43758.5453;
  return n - Math.floor(n);
};

const KALABALIK_YUKSEKLIK = 46;

/**
 * Arkadaki isimsiz kalabalık. Tek tek sprite basmak yerine tek SVG'de
 * siluet: yirmi sekiz kişilik koğuşta üç asker görünmesin diye var, ama
 * öndeki adı olan askerlerle yarışmasın diye soluk ve detaysız.
 */
function Kalabalik({ adet, en, ic }: { adet: number; en: number; ic: boolean }) {
  if (!en || adet <= 0) return null;

  const arkaAdet = Math.ceil(adet * 0.55);
  const satirlar = [
    { adet: arkaAdet, u: 2, taban: KALABALIK_YUKSEKLIK - 24, opaklik: ic ? 0.4 : 0.35 },
    { adet: adet - arkaAdet, u: 2, taban: KALABALIK_YUKSEKLIK - 12, opaklik: ic ? 0.62 : 0.55 },
  ];

  return (
    <Svg width={en} height={KALABALIK_YUKSEKLIK}>
      {satirlar.map((satir, si) =>
        Array.from({ length: satir.adet }, (_, i) => {
          const u = satir.u;
          const bosluk = (en - 2 * u) / Math.max(1, satir.adet);
          const kayma = dagitim(si * 97 + i) * bosluk * 0.6;
          const x = Math.round(u + i * bosluk + kayma);
          const y = satir.taban - 10 * u;
          const uniforma = si === 0 ? '#4E5330' : '#6E7444';

          return (
            <React.Fragment key={`${si}-${i}`}>
              <Rect x={x + u} y={y} width={2 * u} height={2 * u} fill="#9A7852" opacity={satir.opaklik} />
              <Rect x={x} y={y + 2 * u} width={4 * u} height={5 * u} fill={uniforma} opacity={satir.opaklik} />
              <Rect x={x} y={y + 7 * u} width={u} height={3 * u} fill="#4A3524" opacity={satir.opaklik} />
              <Rect x={x + 3 * u} y={y + 7 * u} width={u} height={3 * u} fill="#4A3524" opacity={satir.opaklik} />
            </React.Fragment>
          );
        }),
      )}
    </Svg>
  );
}

type Props = { blokId: string; saat: string };

export function MekanSeridi({ blokId, saat }: Props) {
  const mekan = mekanBul(blokId);
  // Kalabalık piksel hesabıyla diziliyor; genişliği ölçmeden çizilemez.
  const [en, setEn] = useState(0);
  if (!mekan) return null;

  return (
    <View
      onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
      style={{
        height: YUKSEKLIK,
        borderWidth: BORDER,
        borderColor: C.ink,
        backgroundColor: mekan.ic ? '#2B2719' : '#232016',
        overflow: 'hidden',
      }}
    >
      {mekan.ic ? (
        // İç mekan: gökyüzü yerine duvar ve süpürgelik
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Svg width="100%" height={YUKSEKLIK}>
            <Rect x="0" y="0" width="100%" height={YUKSEKLIK - ZEMIN} fill="#332F1E" />
            <Rect x="0" y={YUKSEKLIK - ZEMIN - 3} width="100%" height={3} fill={C.line} />
            <Rect x="0" y={YUKSEKLIK - ZEMIN} width="100%" height={ZEMIN} fill="#413A25" />
          </Svg>
        </View>
      ) : (
        <>
          <Gokyuzu saat={saat} yukseklik={YUKSEKLIK - ZEMIN} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: ZEMIN }}>
            <Svg width="100%" height={ZEMIN}>
              <Rect x="0" y="0" width="100%" height={ZEMIN} fill="#3A3421" />
              <Rect x="0" y="0" width="100%" height={2} fill={C.line} />
            </Svg>
          </View>
        </>
      )}

      {/* Kalabalık dekorun önünde, adı olan askerlerin arkasında duruyor */}
      {!!mekan.kalabalik && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: ZEMIN + 2, height: KALABALIK_YUKSEKLIK }}>
          <Kalabalik adet={mekan.kalabalik} en={en} ic={mekan.ic} />
        </View>
      )}

      {mekan.ogeler.map((o, i) => (
        <View
          key={i}
          style={{ position: 'absolute', left: `${o.x}%`, bottom: o.taban ?? ZEMIN - 4 }}
        >
          <PixelSprite sprite={sprite(o.sprite)} scale={o.olcek} opacity={o.arka ? 0.5 : 1} />
        </View>
      ))}

      <View
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          backgroundColor: C.ink,
          paddingHorizontal: 5,
          paddingVertical: 1,
        }}
      >
        <PixelText font="command" size="small" color={C.brass}>
          {mekan.ad.toLocaleUpperCase('tr-TR')}
        </PixelText>
      </View>

      {mekan.mevcut && (
        <View
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: C.ink,
            paddingHorizontal: 5,
            paddingVertical: 1,
          }}
        >
          <PixelText font="command" size="small" color={C.canvasDim}>
            {mekan.mevcut}
          </PixelText>
        </View>
      )}
    </View>
  );
}
