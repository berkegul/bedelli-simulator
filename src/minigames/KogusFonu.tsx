import React, { useMemo } from 'react';
import { View } from 'react-native';
import { C } from '../theme';
import { RANZA_YAN, komsuRanza, pencere } from '../art/sahne/kogus';
import { PixelSprite } from '../ui/PixelSprite';
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
