import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { Siddet, titret } from '../ui/haptik';
import { PixelButton } from '../ui/PixelButton';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

const HARITA_YUKSEKLIK = 300;

type Durak = {
  id: string;
  ad: string;
  sprite: SpriteKey;
  olcek: number;
  x: number;
  y: number;
  metin: string;
};

/**
 * İlk günün bölge turu. Oyuncu haritadaki her yere dokunup ne işe
 * yaradığını öğreniyor; hepsini gezmeden tur bitmiyor. Aynı harita
 * ilerleyen günlerde serbest zamanda karşısına çıkacak, o yüzden burada
 * öğrendiği yerleşim işine yarıyor.
 */
const DURAKLAR: Durak[] = [
  {
    id: 'kogus',
    ad: 'Koğuş',
    sprite: 'kisla',
    olcek: 3,
    x: 2,
    y: 4,
    metin:
      'Yirmi sekiz kişi, on dört ranza. Dolabın numaralı ve denetimde açık duracak. Burası yatak odası değil, düzenin ölçüldüğü yer.',
  },
  {
    id: 'yemekhane',
    ad: 'Yemekhane',
    sprite: 'kantinBina',
    olcek: 3,
    x: 58,
    y: 6,
    metin:
      'Üç öğün: 07:00, 12:00, 17:30. Sıraya girmeden tepsi alınmaz, tepsi elde yürünmez. Ne kadar yiyeceğine sen karar verirsin ama öğünler arası uzun.',
  },
  {
    id: 'ictima',
    ad: 'İçtima alanı',
    sprite: 'bayrak',
    olcek: 3,
    x: 34,
    y: 40,
    metin:
      'Günde iki kez buradasın: sabah ve akşam. Bayrak töreni, yoklama, bölük işleri. Hizanın bozulduğu yer burasıdır ve herkes görür.',
  },
  {
    id: 'kantin',
    ad: 'Kantin',
    sprite: 'atistirmalik',
    olcek: 3,
    x: 76,
    y: 44,
    metin:
      'Sigara, çay, bisküvi, kontör. Fiyatlar tartışmaya açık değil. Cebindeki para 28 gün yetecek, kantin de aynı cepten.',
  },
  {
    id: 'revir',
    ad: 'Revir',
    sprite: 'revir',
    olcek: 3,
    x: 4,
    y: 56,
    metin:
      'Gerçekten hastaysan buraya. Ama "hastayım" demek burada kolay değil; doktor da, bölük de bunu tartar.',
  },
  {
    id: 'nizamiye',
    ad: 'Nizamiye',
    sprite: 'ankesor',
    olcek: 3,
    x: 60,
    y: 70,
    metin:
      'Bu sabah girdiğin kapı. Yanındaki ankesör, telefonu olmayanın tek bağlantısı. Kapıyı bir daha 28 gün sonra göreceksin.',
  },
];

export function TanitimSahnesi({ onBitti }: { onBitti: () => void }) {
  const [gezilen, setGezilen] = useState<string[]>([]);
  const [acik, setAcik] = useState<Durak | null>(null);

  const hepsi = gezilen.length >= DURAKLAR.length;

  const dokun = (d: Durak) => {
    titret(Siddet.Light);
    setAcik(d);
    setGezilen((g) => (g.includes(d.id) ? g : [...g, d.id]));
  };

  return (
    <View style={{ gap: SP.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          BÖLGE TURU
        </PixelText>
        <PixelText font="command" size="body" color={hepsi ? C.olive : C.canvasFaint}>
          {`${gezilen.length} / ${DURAKLAR.length}`}
        </PixelText>
      </View>

      <View
        style={{
          height: HARITA_YUKSEKLIK,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: '#2A2719',
          overflow: 'hidden',
        }}
      >
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Svg width="100%" height="100%">
            <Rect x={0} y={0} width="100%" height="100%" fill="#2A2719" />
            {Array.from({ length: 8 }, (_, i) => (
              <Line
                key={i}
                x1={0}
                y1={(HARITA_YUKSEKLIK / 8) * i}
                x2="100%"
                y2={(HARITA_YUKSEKLIK / 8) * i}
                stroke={C.ink}
                strokeWidth={1}
                opacity={0.5}
              />
            ))}
          </Svg>
        </View>

        {DURAKLAR.map((d) => {
          const gorulmus = gezilen.includes(d.id);
          return (
            <Pressable
              key={d.id}
              accessibilityRole="button"
              accessibilityLabel={d.ad}
              onPress={() => dokun(d)}
              style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, alignItems: 'center' }}
            >
              <PixelSprite sprite={sprite(d.sprite)} scale={d.olcek} opacity={gorulmus ? 0.55 : 1} />
              <View
                style={{
                  backgroundColor: C.ink,
                  paddingHorizontal: SP.xs,
                  marginTop: 2,
                  borderWidth: 1,
                  borderColor: gorulmus ? C.olive : C.brass,
                }}
              >
                <PixelText font="command" size="small" color={gorulmus ? C.olive : C.brass}>
                  {gorulmus ? `✓ ${d.ad}` : d.ad}
                </PixelText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {acik ? (
        <View style={{ borderLeftWidth: 4, borderLeftColor: C.brass, paddingLeft: SP.lg, gap: SP.xs }}>
          <PixelText font="command" size="lead" color={C.brass}>
            {acik.ad.toLocaleUpperCase('tr-TR')}
          </PixelText>
          <PixelText size="lead" color={C.canvas} line="body">
            {acik.metin}
          </PixelText>
        </View>
      ) : (
        <PixelText size="small" color={C.canvasFaint} center line="snug">
          Onbaşı önde yürüyor. Gezilecek yerlere sırayla dokun.
        </PixelText>
      )}

      <PixelButton
        label={hepsi ? 'Tur bitti, bölüğe dön' : `${DURAKLAR.length - gezilen.length} yer kaldı`}
        tur={hepsi ? 'ana' : 'sessiz'}
        disabled={!hepsi}
        onPress={onBitti}
      />
    </View>
  );
}
