import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { gunGetir } from '../content';
import { STAT_ORDER, gunNotu } from '../engine/stats';
import { useSecili } from '../store/secici';
import { CentikTakvim } from '../ui/CentikTakvim';
import { PixelButton } from '../ui/PixelButton';
import { GokyuzuGecisi } from '../ui/GokyuzuGecisi';
import { PixelText } from '../ui/PixelText';
import { StatBar } from '../ui/StatBar';
import { sesCal } from '../ses';

const NOT_RENK: Record<string, string> = {
  'TAKDİR ALDI': C.brass,
  'TEMİZ İŞ': C.olive,
  'İDARE EDER': C.canvas,
  'GAZ YEDİ': C.tea,
  CEZALI: C.rust,
};

export function GunSonuEkrani() {
  const g = useSecili('anaMenu', 'bitenGunler', 'gun', 'sonrakiGun', 'stats');
  // Gün kapanırken sicil defterine damga.
  useEffect(() => {
    sesCal('damga');
  }, []);
  const inset = useSafeAreaInsets();
  const not = gunNotu(g.stats);
  const gunData = gunGetir(g.gun);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{
        paddingTop: inset.top + SP.xl,
        paddingBottom: inset.bottom + SP.xl,
        paddingHorizontal: SP.xl,
        gap: SP.xl,
      }}
    >
      {/* Gün batıyor: güneş iniyor, yıldızlar teker teker beliriyor */}
      <View style={{ borderWidth: BORDER, borderColor: C.ink }}>
        <GokyuzuGecisi yon="batim" yukseklik={120} />
      </View>

      <View style={{ alignItems: 'center', gap: SP.xs }}>
        <PixelText font="command" size="body" color={C.canvasFaint} tracking={4}>
          {`GÜN ${String(g.gun).padStart(2, '0')} KAPANDI`}
        </PixelText>
        <PixelText font="bodyMed" size="small" color={C.canvasDim}>
          {gunData?.title}
        </PixelText>
      </View>

      {/* Günün notu — askerî sicil dili */}
      <View
        style={{
          borderWidth: BORDER,
          borderColor: NOT_RENK[not.ad] ?? C.line,
          paddingVertical: SP.lg,
          alignItems: 'center',
          gap: SP.xs,
        }}
      >
        <PixelText font="command" size="h1" color={NOT_RENK[not.ad] ?? C.canvas} tracking={2}>
          {not.ad}
        </PixelText>
        <PixelText font="bodyMed" size="small" color={C.canvasFaint}>
          {`Gün ortalaması ${not.puan}`}
        </PixelText>
      </View>

      <View style={{ gap: SP.md }}>
        {STAT_ORDER.map((k) => (
          <StatBar key={k} stat={k} value={g.stats[k]} />
        ))}
      </View>

      <CentikTakvim bitenGunler={g.bitenGunler} aktifGun={g.gun} />

      <View style={{ gap: SP.sm }}>
        <PixelButton label="Yat, ertesi gün" onPress={g.sonrakiGun} />
        <PixelButton label="Ana menü" tur="sessiz" onPress={g.anaMenu} />
      </View>
    </ScrollView>
  );
}
