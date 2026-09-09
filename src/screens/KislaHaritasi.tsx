import React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { arkadas, avludakiler, oturmaAlanindakiler } from '../content/arkadaslar';
import { useGame } from '../store/gameStore';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

const HARITA_YUKSEKLIK = 300;

const ARKADAS_SPRITE: Record<string, SpriteKey> = {
  emre: 'askerEmre',
  tolga: 'askerTolga',
  serkan: 'askerSerkan',
};

type Nokta = {
  id: string;
  ad: string;
  sprite: SpriteKey;
  olcek: number;
  /** Kapsayıcıya göre yüzde konum; sol üst köşe. */
  x: number;
  y: number;
  onPress: () => void;
  rozet?: string;
};

/**
 * Serbest zamanın liste hâli yerine avlunun kendisi. Nereye gideceğini
 * haritadan seçiyorsun; arkadaşlar da avluda duruyor ve üstlerine gidip
 * konuşuyorsun.
 */
export function KislaHaritasi() {
  const g = useGame();
  const telefonVar = (g.envanter.kamerasizTelefon?.adet ?? 0) > 0;
  const dal = g.envanter.sigara?.adet ?? 0;
  // Akşamları bir kısmı bankta oturuyor; avluda ayakta duranlar kalanlar.
  const oturanlar = oturmaAlanindakiler(g.gun);
  const ayaktakiler = avludakiler(g.gun);

  const mekanlar: Nokta[] = [
    {
      id: 'kogus',
      ad: 'Koğuş',
      sprite: 'kisla',
      olcek: 3,
      x: 2,
      y: 4,
      onPress: () => g.panelAc('dolap'),
      rozet: 'dolabın',
    },
    {
      id: 'kantin',
      ad: 'Kantin',
      sprite: 'kantinBina',
      olcek: 3,
      x: 60,
      y: 8,
      onPress: () => g.panelAc('kantin'),
    },
    {
      id: 'ankesor',
      ad: 'Ankesör',
      sprite: 'ankesor',
      olcek: 3,
      x: 76,
      y: 58,
      onPress: () => g.panelAc('rehber'),
      rozet: telefonVar ? 'telefonun var' : 'kuyruk var',
    },
    {
      id: 'oturma',
      ad: 'Oturma alanı',
      sprite: 'agac',
      olcek: 3,
      x: 3,
      y: 58,
      onPress: () => g.panelAc('oturma'),
      rozet: oturanlar.length
        ? `${oturanlar.map((id) => arkadas(id).ad).join(', ')} orada`
        : 'bank boş',
    },
  ];

  // Arkadaşlar avluda; yerleri gün numarasına göre kayıyor ki her akşam
  // aynı tabloya bakmayasın.
  const konumlar = [
    { x: 30, y: 46 },
    { x: 48, y: 62 },
    { x: 20, y: 66 },
  ];
  const kaydir = (g.gun - 1) % konumlar.length;

  return (
    <View style={{ gap: SP.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          AVLU
        </PixelText>
        <PixelText size="micro" color={C.canvasFaint}>
          Bir yere dokun
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
        {/* Avlu zemini: beton derzleri */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Svg width="100%" height="100%">
            <Rect x={0} y={0} width="100%" height="100%" fill="#2A2719" />
            {Array.from({ length: 8 }, (_, i) => (
              <Line
                key={`y${i}`}
                x1={0}
                y1={(HARITA_YUKSEKLIK / 8) * i}
                x2="100%"
                y2={(HARITA_YUKSEKLIK / 8) * i}
                stroke={C.ink}
                strokeWidth={1}
                opacity={0.5}
              />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <Line
                key={`x${i}`}
                x1={`${(100 / 6) * i}%`}
                y1={0}
                x2={`${(100 / 6) * i}%`}
                y2={HARITA_YUKSEKLIK}
                stroke={C.ink}
                strokeWidth={1}
                opacity={0.5}
              />
            ))}
          </Svg>
        </View>

        {mekanlar.map((m) => (
          <Pressable
            key={m.id}
            accessibilityRole="button"
            accessibilityLabel={m.ad}
            onPress={m.onPress}
            style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%`, alignItems: 'center' }}
          >
            <PixelSprite sprite={sprite(m.sprite)} scale={m.olcek} />
            <View
              style={{
                backgroundColor: C.ink,
                paddingHorizontal: SP.xs,
                paddingVertical: 1,
                marginTop: 2,
              }}
            >
              <PixelText font="command" size="small" color={C.brass}>
                {m.ad.toLocaleUpperCase('tr-TR')}
              </PixelText>
            </View>
            {m.rozet && (
              <PixelText size="micro" color={C.canvasFaint}>
                {m.rozet}
              </PixelText>
            )}
          </Pressable>
        ))}

        {ayaktakiler.map((id, i) => {
          const a = arkadas(id);
          const yer = konumlar[(i + kaydir) % konumlar.length];
          const yakinlik = g.dostluk[id] ?? 0;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={`${a.ad} ile konuş`}
              onPress={() => g.arkadasaGit(id)}
              style={{ position: 'absolute', left: `${yer.x}%`, top: `${yer.y}%`, alignItems: 'center' }}
            >
              <PixelSprite sprite={sprite(ARKADAS_SPRITE[id])} scale={2} />
              <View
                style={{
                  backgroundColor: C.ink,
                  paddingHorizontal: SP.xs,
                  marginTop: 2,
                  borderWidth: 1,
                  borderColor: yakinlik >= 25 ? C.olive : C.line,
                }}
              >
                <PixelText font="bodySemi" size="micro" color={yakinlik >= 25 ? C.olive : C.canvasDim}>
                  {a.ad}
                </PixelText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Cep: telefon ve sigara üstünde, avluda bir yerde değil */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cebine bak"
        onPress={() => g.panelAc('cep')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: SP.md,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: C.surface,
          paddingVertical: SP.sm,
          paddingHorizontal: SP.md,
        }}
      >
        <PixelSprite sprite={sprite(telefonVar ? 'telefon' : 'sigara')} scale={2} />
        <View style={{ flex: 1 }}>
          <PixelText font="command" size="body" color={C.brass}>
            CEBİN
          </PixelText>
          <PixelText size="micro" color={C.canvasFaint}>
            {[
              telefonVar ? 'telefon' : null,
              dal > 0 ? `${dal} dal sigara` : null,
              g.cepteIzmarit > 0 ? `${g.cepteIzmarit} izmarit` : null,
            ]
              .filter(Boolean)
              .join(' · ') || 'boş'}
          </PixelText>
        </View>
        <PixelText font="command" size="lead" color={C.canvasDim}>
          {'>'}
        </PixelText>
      </Pressable>
    </View>
  );
}
