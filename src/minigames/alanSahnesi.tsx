import React, { useEffect, useState } from 'react';
import { Animated, View, type DimensionValue } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { C } from '../theme';
import { PixelSprite, type SpriteDef } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { Golge, Nefes } from '../ui/sahne';
import { useHareketAzalt } from '../ui/useHareketAzalt';

/**
 * Açık alan mini oyunlarının (içtima, yürüyüş, yemin, nöbet) ortak sahne
 * parçaları: konuşma balonu, damga, dalgalanan bayrak, projektör, tribün,
 * zemine basan asker.
 */

/** Sahnede zeminin başladığı yükseklik (nokta); Sahne'nin hesabıyla aynı. */
export function zeminUstu(yukseklik: number, u: number, oran: number) {
  const H = Math.ceil(yukseklik / u);
  return (H - Math.round(H * oran)) * u;
}

/**
 * Konuşma balonu: kaput bezi zemin, koyu piksel kenar, altında kuyruk.
 * `kuyruk` balonun hangi köşesinden konuşana indiği.
 */
export function Balon({
  metin,
  u,
  kuyruk = 'sol',
  buyuk,
  style,
}: {
  metin: string;
  u: number;
  kuyruk?: 'sol' | 'sag' | 'orta';
  buyuk?: boolean;
  style?: object;
}) {
  const kx = kuyruk === 'sol' ? '18%' : kuyruk === 'sag' ? '78%' : '48%';
  return (
    <View pointerEvents="none" style={[{ position: 'absolute' }, style]}>
      <View
        style={{
          backgroundColor: C.canvas,
          borderWidth: u,
          borderColor: C.ink,
          paddingHorizontal: 2 * u,
          paddingVertical: u,
        }}
      >
        <PixelText
          font="command"
          size={buyuk ? 'h2' : 'body'}
          color={C.murekkep}
          center
          tracking={buyuk ? 2 : 1}
        >
          {metin}
        </PixelText>
      </View>
      {/* Kuyruk: üç basamak daralan piksel */}
      <View style={{ position: 'absolute', bottom: -3 * u, left: kx }}>
        <View style={{ width: 3 * u, height: u, backgroundColor: C.ink }} />
        <View
          style={{
            width: 2 * u,
            height: u,
            backgroundColor: C.ink,
            marginLeft: kuyruk === 'sag' ? u : 0,
          }}
        />
        <View
          style={{
            width: u,
            height: u,
            backgroundColor: C.ink,
            marginLeft: kuyruk === 'sag' ? 2 * u : 0,
          }}
        />
      </View>
    </View>
  );
}

/** Sahneye vurulmuş sonuç damgası: yamuk, çerçeveli. */
export function Damga({ metin, renk, style }: { metin: string; renk: string; style?: object }) {
  return (
    <View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          borderWidth: 3,
          borderColor: renk,
          backgroundColor: 'rgba(22,21,14,0.72)',
          paddingHorizontal: 8,
          paddingVertical: 2,
          transform: [{ rotate: '-6deg' }],
        },
        style,
      ]}
    >
      <PixelText font="command" size="h3" color={renk} tracking={2} center>
        {metin}
      </PixelText>
    </View>
  );
}

/**
 * Zemine basan karakter: altında gölge, istenirse nefes. `alt` ayak
 * tabanının sahnenin üstünden uzaklığı (nokta), `x` yüzde.
 */
export function Basan({
  sprite,
  u,
  x,
  alt,
  nefes = true,
  gecikme = 0,
  opaklik = 1,
  golge = true,
}: {
  sprite: SpriteDef;
  u: number;
  x: number | DimensionValue;
  alt: number;
  nefes?: boolean;
  gecikme?: number;
  opaklik?: number;
  golge?: boolean;
}) {
  const h = sprite.rows.length * u;
  const w = (sprite.rows[0]?.length ?? 8) * u;
  const govde = <PixelSprite sprite={sprite} scale={u} opacity={opaklik} />;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: typeof x === 'number' ? (`${x}%` as DimensionValue) : x,
        top: alt - h,
        width: w,
        marginLeft: -w / 2,
        alignItems: 'center',
      }}
    >
      {nefes ? (
        <Nefes u={u} gecikme={gecikme}>
          {govde}
        </Nefes>
      ) : (
        govde
      )}
      {golge && (
        <View style={{ marginTop: -u }}>
          <Golge
            genislik={Math.round((sprite.rows[0]?.length ?? 8) * 0.75)}
            u={u}
            opaklik={0.3 * opaklik}
          />
        </View>
      )}
    </View>
  );
}

/**
 * Direk ve dalgalanan bayrak: kırmızı zemin, beyaz ay-yıldız izi. İki kare
 * arasında sütunlar yukarı aşağı kayıyor; rüzgâr piksel piksel.
 */
export function Bayrak({
  u,
  x,
  alt,
  boy = 44,
}: {
  u: number;
  x: DimensionValue;
  alt: number;
  boy?: number;
}) {
  const azalt = useHareketAzalt();
  const [kare, setKare] = useState(0);
  useEffect(() => {
    if (azalt) return;
    const t = setInterval(() => setKare((k) => (k + 1) % 4), 420);
    return () => clearInterval(t);
  }, [azalt]);

  const BW = 14;
  const BH = 9;
  const W = BW + 2;
  const H = boy;
  const hucre: React.ReactNode[] = [];
  for (let c = 0; c < BW; c++) {
    // Direkten uzaklaştıkça dalga büyüyor
    const dalga = Math.round(Math.sin((c + kare * 2) / 2.2) * Math.min(1.5, c / 6));
    hucre.push(
      <Rect
        key={`b${c}`}
        x={(2 + c) * u}
        y={(2 + dalga) * u}
        width={u}
        height={BH * u}
        fill={C.rust}
      />,
      <Rect
        key={`g${c}`}
        x={(2 + c) * u}
        y={(2 + dalga + BH - 1) * u}
        width={u}
        height={u}
        fill="#7E3222"
      />,
    );
    // Ay ve yıldız: kaba beyaz leke
    if (c >= 4 && c <= 7) {
      const ay = c === 4 || c === 7 ? [3, 5] : c === 5 ? [2, 6] : [];
      for (const r of ay)
        hucre.push(
          <Rect
            key={`a${c}-${r}`}
            x={(2 + c) * u}
            y={(2 + dalga + r) * u}
            width={u}
            height={u}
            fill={C.canvas}
          />,
        );
    }
    if (c === 9)
      hucre.push(
        <Rect
          key="y"
          x={(2 + c) * u}
          y={(2 + dalga + 4) * u}
          width={u}
          height={u}
          fill={C.canvas}
        />,
      );
  }
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x, top: alt - H * u }}>
      <Svg width={W * u} height={H * u}>
        <Rect x={0} y={0} width={u * 2} height={u} fill="#9A9C94" />
        <Rect x={0} y={u} width={u} height={(H - 1) * u} fill="#7C8189" />
        <Rect x={u} y={u} width={u} height={(H - 1) * u} fill="#4E5359" />
        {hucre}
        <Rect x={-u} y={(H - 2) * u} width={4 * u} height={2 * u} fill={C.ink} />
      </Svg>
    </View>
  );
}

/** Projektör direği: ince direk, üstte lamba başlığı, istenirse titreyen ışık. */
export function Projektor({
  u,
  x,
  alt,
  boy = 34,
  yanik = true,
}: {
  u: number;
  x: DimensionValue;
  alt: number;
  boy?: number;
  yanik?: boolean;
}) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x, top: alt - boy * u }}>
      <Svg width={7 * u} height={boy * u}>
        <Rect x={2 * u} y={3 * u} width={u} height={(boy - 3) * u} fill="#4E5359" />
        <Rect x={3 * u} y={3 * u} width={u} height={(boy - 3) * u} fill="#2E3238" />
        <Rect x={0} y={0} width={7 * u} height={3 * u} fill="#2E3238" />
        <Rect x={u} y={2 * u} width={5 * u} height={u} fill={yanik ? '#FFE6A0' : '#5A5A50'} />
        <Rect x={u} y={boy * u - u} width={5 * u} height={u} fill={C.ink} />
      </Svg>
    </View>
  );
}

/**
 * Tribün: basamaklı beton oturak, üstünde isimsiz aile kalabalığı. Tohumlu
 * dağılım; kafalar ten, gövdeler sivil renkler.
 */
export function Tribun({
  u,
  genislik,
  basamak = 3,
}: {
  u: number;
  genislik: number;
  basamak?: number;
}) {
  const W = Math.ceil(genislik / u);
  const BH = 6;
  const renkler = ['#7A5A3A', '#5C6A78', '#8A6E4A', '#6A4A5A', '#4E5A48', '#9A8A6A', '#5A4A3A'];
  const parca: React.ReactNode[] = [];
  for (let b = 0; b < basamak; b++) {
    const y = b * BH;
    parca.push(
      <Rect
        key={`t${b}`}
        x={0}
        y={(y + BH - 2) * u}
        width={W * u}
        height={2 * u}
        fill={b % 2 ? '#6E6A58' : '#77725F'}
      />,
      <Rect key={`g${b}`} x={0} y={(y + BH) * u} width={W * u} height={u} fill="#3E3B30" />,
    );
    for (let x = 1 + (b % 2); x < W - 2; x += 3) {
      const r = Math.abs(Math.sin(x * 12.9 + b * 78.2)) % 1;
      if (r < 0.2) continue;
      const govde = renkler[Math.floor(r * 97) % renkler.length];
      parca.push(
        <Rect
          key={`k${b}-${x}`}
          x={x * u}
          y={(y + 1) * u}
          width={2 * u}
          height={2 * u}
          fill={r > 0.6 ? '#C9A277' : '#9A7852'}
        />,
        <Rect
          key={`v${b}-${x}`}
          x={x * u}
          y={(y + 3) * u}
          width={2 * u}
          height={2 * u}
          fill={govde}
        />,
      );
    }
  }
  return (
    <Svg width={W * u} height={(basamak * BH + 1) * u}>
      {parca}
    </Svg>
  );
}

/** Nöbette uyuklayan asker için "z z z": yukarı süzülen harfler. */
export function Zzz({ u, style }: { u: number; style?: object }) {
  const azalt = useHareketAzalt();
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (azalt) return;
    const d = Animated.loop(
      Animated.timing(t, { toValue: 1, duration: 1600, useNativeDriver: true }),
    );
    d.start();
    return () => d.stop();
  }, [azalt, t]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          opacity: t.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -6 * u] }) },
          ],
        },
        style,
      ]}
    >
      <PixelText font="command" size="h3" color={C.steel}>
        z z
      </PixelText>
    </Animated.View>
  );
}
