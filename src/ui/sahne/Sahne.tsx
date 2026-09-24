import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Gokyuzu } from '../Gokyuzu';
import { DUVARLAR, ZEMINLER, ufuk, type DuvarTuru, type Piksel, type ZeminTuru } from './doku';
import { IsikHavuzu, Ortu, Vinyet, gecelik } from './Isik';
import { PikselKatman } from './PikselKatman';

export type SahneProps = {
  /** Nokta cinsinden yükseklik. */
  yukseklik: number;
  /** Bir piksel hücresi kaç nokta (sprite ölçeğiyle aynı). */
  u: number;
  zemin: ZeminTuru;
  /** Zeminin yükseklikteki payı (0–1). Tepeden bakışta 1. */
  zeminOrani?: number;
  /** İç mekân duvarı; verilmezse dış mekân (gökyüzü + ufuk). */
  duvar?: DuvarTuru;
  /** Dış mekânda gökyüzü ve gece örtüsü için. */
  saat?: string;
  /** Dış mekânda uzak duvar, tel örgü, ağaçlar. */
  ufukVar?: boolean;
  /** Tavan lambaları / fenerler: yatay konum yüzde, yükseklik yüzde. */
  lambalar?: { x: number; y: number; yaricap?: number; guc?: number }[];
  /** İç mekân loşluğu (0–1); gece dış mekânda saatten hesaplanır. */
  losluk?: number;
  vinyet?: boolean;
  tohum?: number;
  children?: React.ReactNode;
};

/**
 * Mini oyunların ve sahne şeritlerinin ortak sahnesi: duvar ya da gökyüzü,
 * ufuk, dokulu zemin, ışık, loşluk, vinyet. İçerik (sprite'lar, dokunma
 * alanları) `children` olarak üstüne konuyor ve sahnenin koordinatlarında.
 */
export function Sahne({
  yukseklik,
  u,
  zemin,
  zeminOrani = 0.4,
  duvar,
  saat = '12:00',
  ufukVar = true,
  lambalar = [],
  losluk = 0,
  vinyet = true,
  tohum = 1,
  children,
}: SahneProps) {
  const [en, setEn] = useState(0);
  const W = Math.ceil(en / u);
  const H = Math.ceil(yukseklik / u);
  const zH = Math.round(H * zeminOrani);
  const ustH = H - zH;
  const gece = gecelik(saat);
  const disarida = !duvar;

  const ust = useMemo<Piksel[]>(() => {
    if (!W || ustH <= 0) return [];
    if (duvar) return DUVARLAR[duvar]({ x: 0, y: 0, w: W, h: ustH }, tohum);
    return ufukVar ? ufuk({ x: 0, y: 0, w: W, h: ustH }, tohum, gece > 0.3) : [];
  }, [W, ustH, duvar, ufukVar, tohum, gece]);

  const alt = useMemo<Piksel[]>(
    () => (W && zH > 0 ? ZEMINLER[zemin]({ x: 0, y: 0, w: W, h: zH }, tohum + 3) : []),
    [W, zH, zemin, tohum],
  );

  return (
    <View
      onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
      style={{ height: yukseklik, overflow: 'hidden', backgroundColor: '#1B1A14' }}
    >
      {disarida && ustH > 0 && <Gokyuzu saat={saat} yukseklik={ustH * u} />}
      {W > 0 && ust.length > 0 && (
        <PikselKatman
          pikseller={ust}
          u={u}
          w={W}
          h={ustH}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      {W > 0 && (
        <PikselKatman
          pikseller={alt}
          u={u}
          w={W}
          h={zH}
          style={{ position: 'absolute', top: ustH * u, left: 0 }}
        />
      )}
      {/* Duvar dibinde zemine düşen gölge şeridi: derinlik */}
      {!disarida && zH > 0 && zH < H && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: ustH * u,
            left: 0,
            right: 0,
            height: 2 * u,
            backgroundColor: '#000',
            opacity: 0.25,
          }}
        />
      )}

      {children}

      <Ortu opaklik={disarida ? gece : losluk} />
      {en > 0 &&
        lambalar.map((l, i) => (
          <IsikHavuzu
            key={i}
            x={(l.x / 100) * en}
            y={(l.y / 100) * yukseklik}
            yaricap={l.yaricap ?? 24}
            u={u}
            guc={l.guc ?? (disarida ? 0.12 + gece * 0.5 : 0.14 + losluk * 0.5)}
          />
        ))}
      {vinyet && <Vinyet u={u} />}
    </View>
  );
}
