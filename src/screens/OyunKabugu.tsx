import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { STAT_ORDER, kalanGun, toklukDurumu } from '../engine/stats';
import type { Stats } from '../engine/types';
import { PixelText } from '../ui/PixelText';
import { StatBar } from '../ui/StatBar';

type Props = {
  gun: number;
  gunBasligi: string;
  blokSaat?: string;
  blokAd?: string;
  stats: Stats;
  para: number;
  delta?: Partial<Stats> & { para?: number };
  /** Sigara içmeyen oyuncuda gösterilmez. */
  nikotin?: number;
  children: React.ReactNode;
};

export function OyunKabugu({
  gun,
  gunBasligi,
  blokSaat,
  blokAd,
  stats,
  para,
  delta,
  nikotin,
  children,
}: Props) {
  const inset = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Üst şerit: nerede olduğun ve ne kadar kaldığı */}
      <View
        style={{
          paddingTop: inset.top + SP.sm,
          paddingHorizontal: SP.lg,
          paddingBottom: SP.sm,
          backgroundColor: C.ink,
          borderBottomWidth: BORDER,
          borderBottomColor: C.line,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
          <PixelText font="command" size="h3" color={C.brass}>
            {`GÜN ${String(gun).padStart(2, '0')}`}
          </PixelText>
          <PixelText font="bodyMed" size="small" color={C.canvasDim} style={{ flex: 1 }} numberOfLines={1}>
            {gunBasligi}
          </PixelText>
          <PixelText font="command" size="body" color={C.canvasFaint}>
            {`SİVİLE ${kalanGun(gun)} GÜN`}
          </PixelText>
        </View>

        {blokAd && (
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm, marginTop: SP.xs }}>
            <PixelText font="command" size="lead" color={C.canvas}>
              {blokSaat}
            </PixelText>
            <PixelText font="bodySemi" size="small" color={C.canvasDim}>
              {blokAd}
            </PixelText>
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>{children}</View>

      {/* Alt şerit: dört istatistik, 2x2 */}
      <View
        style={{
          paddingHorizontal: SP.lg,
          paddingTop: SP.md,
          paddingBottom: inset.bottom + SP.md,
          backgroundColor: C.ink,
          borderTopWidth: BORDER,
          borderTopColor: C.line,
          gap: SP.sm,
        }}
      >
        <View style={{ flexDirection: 'row', gap: SP.lg }}>
          {STAT_ORDER.slice(0, 2).map((k) => (
            <StatBar key={k} stat={k} value={stats[k]} delta={delta?.[k]} kucuk />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: SP.lg }}>
          {STAT_ORDER.slice(2).map((k) => (
            <StatBar key={k} stat={k} value={stats[k]} delta={delta?.[k]} kucuk />
          ))}
        </View>

        {/* Tokluk kendi satırında: gün boyunca sürekli düşen tek gösterge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SP.sm }}>
          <View style={{ flex: 1 }}>
            <StatBar stat="tokluk" value={stats.tokluk} delta={delta?.tokluk} kucuk />
          </View>
          <PixelText font="command" size="small" color={stats.tokluk < 30 ? C.rust : C.canvasFaint}>
            {toklukDurumu(stats.tokluk)}
          </PixelText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.xs, marginTop: 2 }}>
          <PixelText font="bodyMed" size="micro" color={C.canvasFaint} style={{ flex: 1 }}>
            Kantin hesabı
          </PixelText>
          <PixelText font="command" size="body" color={C.canvas}>
            {`${para} TL`}
          </PixelText>
          {delta?.para !== undefined && delta.para !== 0 && (
            <PixelText font="command" size="small" color={delta.para > 0 ? C.olive : C.rust}>
              {delta.para > 0 ? `+${delta.para}` : `${delta.para}`}
            </PixelText>
          )}
        </View>

        {nikotin !== undefined && nikotin > 25 && (
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.xs }}>
            <PixelText font="bodyMed" size="micro" color={C.canvasFaint} style={{ flex: 1 }}>
              Sigara isteği
            </PixelText>
            <PixelText
              font="command"
              size="body"
              color={nikotin >= 85 ? C.rust : nikotin >= 55 ? C.tea : C.canvasDim}
            >
              {nikotin >= 85 ? 'KRİZDE' : nikotin >= 55 ? 'ÇOK İSTİYOR' : 'CANIN ÇEKTİ'}
            </PixelText>
          </View>
        )}
      </View>
    </View>
  );
}
