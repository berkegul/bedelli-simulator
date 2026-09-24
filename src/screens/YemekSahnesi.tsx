import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { OGUN_ADI, ogunMenusu, type Yemek } from '../content/menu';
import { sonrakiOgunMesafesi } from '../content';
import { BLOK_BASINA_ACLIK, TOKLUK_BANT } from '../engine/stats';
import type { OgunAdi } from '../engine/types';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { Tepsi, TepsiOzeti } from '../ui/Tepsi';
import { DagitimBandi, Masa } from './Yemekhane';

type Props = {
  gun: number;
  blokIndex: number;
  ogun: OgunAdi;
  tokluk: number;
  onYe: (secilen: Yemek[]) => void;
};

const BAR_YUKSEKLIK = 16;

/** Tepsideki her kalem ayrı bir karar: zeytini bırak, peyniri ye. */
export function YemekSahnesi({ gun, blokIndex, ogun, tokluk, onYe }: Props) {
  const menu = ogunMenusu(gun, ogun);
  const [secili, setSecili] = useState<number[]>([]);

  const secilenler = secili.map((i) => menu[i]);
  const kazanc = secilenler.reduce((t, y) => t + y.tokluk, 0);
  const doluluk = Math.min(100, tokluk + kazanc);

  // Bu öğün seni bir sonrakine kadar götürecek mi?
  const mesafe = useMemo(() => sonrakiOgunMesafesi(gun, blokIndex), [gun, blokIndex]);
  const yakilacak = mesafe * BLOK_BASINA_ACLIK;
  const varis = doluluk - yakilacak;

  const tavsiye =
    varis < 20
      ? { metin: 'Bir sonraki öğüne aç varırsın', renk: C.rust }
      : varis < 35
        ? { metin: 'Ucu ucuna yeter', renk: C.tea }
        : doluluk > TOKLUK_BANT.ust
          ? { metin: 'Fazla doldurdun, eğitimde ağır olursun', renk: C.tea }
          : { metin: 'Bu kadarı sonraki öğüne yeter', renk: C.olive };

  return (
    <View style={{ gap: SP.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          {OGUN_ADI[ogun].toLocaleUpperCase('tr-TR')}
        </PixelText>
        <PixelText size="micro" color={C.canvasFaint}>
          {`sonraki öğüne ${mesafe} saat dilimi`}
        </PixelText>
      </View>

      {/*
        Dağıtım bandından tepsini alıyorsun, masaya oturuyorsun: tepsi masanın
        üstünde, tokluk göstergesi masanın ön kenarında.
      */}
      <View>
        <DagitimBandi />
        <Masa
          kenar={
            <>
              <TepsiOzeti adet={secili.length} tokluk={kazanc} />
              <View style={{ gap: SP.xs }}>
                <View
                  style={{
                    borderWidth: BORDER,
                    borderColor: C.ink,
                    backgroundColor: C.ink,
                    padding: 2,
                  }}
                >
                  <Svg width="100%" height={BAR_YUKSEKLIK}>
                    <Rect x="0" y="0" width="100%" height={BAR_YUKSEKLIK} fill={C.bg} />
                    {/* İdeal bant */}
                    <Rect
                      x={`${TOKLUK_BANT.alt}%`}
                      y="0"
                      width={`${TOKLUK_BANT.ust - TOKLUK_BANT.alt}%`}
                      height={BAR_YUKSEKLIK}
                      fill={C.olive}
                      opacity={0.22}
                    />
                    {/* Şu anki tokluk */}
                    <Rect x="0" y="0" width={`${tokluk}%`} height={BAR_YUKSEKLIK} fill={C.ekmek} />
                    {/* Seçimle eklenecek kısım */}
                    {kazanc > 0 && (
                      <Rect
                        x={`${tokluk}%`}
                        y="0"
                        width={`${doluluk - tokluk}%`}
                        height={BAR_YUKSEKLIK}
                        fill={C.brass}
                        opacity={0.85}
                      />
                    )}
                    {/* Sonraki öğüne varış noktası */}
                    {varis > 0 && (
                      <Rect
                        x={`${varis}%`}
                        y="0"
                        width={2}
                        height={BAR_YUKSEKLIK}
                        fill={C.canvas}
                      />
                    )}
                  </Svg>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
                  <PixelText size="micro" color={C.canvasFaint} style={{ flex: 1 }}>
                    {`Şimdi ${doluluk} · öğüne kadar ${yakilacak} yakarsın · varış ${Math.max(0, varis)}`}
                  </PixelText>
                </View>
                <PixelText font="bodySemi" size="small" color={tavsiye.renk}>
                  {tavsiye.metin}
                </PixelText>
              </View>
            </>
          }
        >
          {/* Tepsinin kendisi seçim ekranı: hangi göz doldu, gözle görünüyor */}
          <Tepsi
            menu={menu}
            secili={secili}
            onToggle={(i) =>
              setSecili((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))
            }
          />
        </Masa>
      </View>

      {/* Tepsinin yanında kısa liste: iki sütun, tokluk değeriyle */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SP.sm }}>
        {menu.map((y, i) => {
          const acik = secili.includes(i);
          return (
            <Pressable
              key={y.ad}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acik }}
              accessibilityLabel={y.ad}
              onPress={() =>
                setSecili((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))
              }
              style={{
                flexBasis: '47%',
                flexGrow: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.sm,
                borderWidth: BORDER,
                borderColor: acik ? C.olive : C.ink,
                backgroundColor: acik ? C.surfaceHi : C.surface,
                paddingVertical: SP.sm,
                paddingHorizontal: SP.sm,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderWidth: BORDER,
                  borderColor: acik ? C.olive : C.line,
                  backgroundColor: acik ? C.olive : 'transparent',
                }}
              />
              <View style={{ flex: 1 }}>
                <PixelText font="bodyMed" size="body" color={acik ? C.canvas : C.canvasDim}>
                  {y.ad}
                </PixelText>
                {y.not && (
                  <PixelText size="micro" color={C.brass}>
                    {y.not}
                  </PixelText>
                )}
              </View>
              <PixelText font="command" size="body" color={C.ekmek}>
                {`+${y.tokluk}`}
              </PixelText>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: SP.sm }}>
        <PixelButton
          label={secili.length ? `Ye (${secili.length} kalem)` : 'Tepsiye dokunma'}
          tur={secili.length ? 'ana' : 'sessiz'}
          onPress={() => onYe(secilenler)}
        />
        <PixelText size="micro" color={C.canvasFaint} center>
          Yeşil bant ideal aralık. Altı açlık, üstü ağırlık.
        </PixelText>
      </View>
    </View>
  );
}
