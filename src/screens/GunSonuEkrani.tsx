import React, { useEffect } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, SP } from '../theme';
import { gunGetir } from '../content';
import { STAT_ORDER, TOPLAM_GUN, gunNotu } from '../engine/stats';
import { useSecili } from '../store/secici';
import { CentikTakvim } from '../ui/CentikTakvim';
import { PixelButton } from '../ui/PixelButton';
import { MekanSeridi } from '../ui/MekanSeridi';
import { PixelText } from '../ui/PixelText';
import { StatBar } from '../ui/StatBar';
import { sesCal } from '../ses';

const GOLGE = {
  textShadowColor: C.ink,
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 0,
};

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
  const { height } = useWindowDimensions();
  const not = gunNotu(g.stats);
  const gunData = gunGetir(g.gun);
  const k = height >= 720 ? 2 : 1;
  const renk = NOT_RENK[not.ad] ?? C.canvas;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingBottom: inset.bottom + SP.xl, gap: SP.xl }}
    >
      {/* Işıklar sönmek üzere: gece koğuşu, sicil damgası duvarda */}
      <MekanSeridi
        blokId={`d${g.gun}-son-yoklama`}
        saat="21:50"
        carpan={k}
        ekYukseklik={Math.max(0, Math.round(height * 0.4) - 150 * k)}
        cercevesiz
        etiketsiz
      >
        <View
          style={{
            position: 'absolute',
            top: inset.top + SP.lg,
            left: 0,
            right: 0,
            alignItems: 'center',
            gap: SP.xs,
          }}
        >
          <PixelText font="command" size="body" color={C.canvasDim} tracking={4} style={GOLGE}>
            {`GÜN ${String(g.gun).padStart(2, '0')} KAPANDI`}
          </PixelText>
          <PixelText font="bodyMed" size="small" color={C.canvasDim} style={GOLGE}>
            {gunData?.title}
          </PixelText>
          <View
            style={{
              marginTop: SP.md,
              borderWidth: 4,
              borderColor: renk,
              paddingHorizontal: SP.md,
              paddingVertical: SP.xs,
              backgroundColor: 'rgba(20,18,12,0.55)',
              transform: [{ rotate: '-4deg' }],
              alignItems: 'center',
            }}
          >
            <PixelText font="command" size="h1" color={renk} tracking={2}>
              {not.ad}
            </PixelText>
            <PixelText font="bodyMed" size="small" color={C.canvasDim}>
              {`Gün ortalaması ${not.puan}`}
            </PixelText>
          </View>
        </View>
      </MekanSeridi>

      <View style={{ paddingHorizontal: SP.xl, gap: SP.xl }}>
        <View style={{ gap: SP.md }}>
          {STAT_ORDER.map((k) => (
            <StatBar key={k} stat={k} value={g.stats[k]} />
          ))}
        </View>

        <CentikTakvim bitenGunler={g.bitenGunler} aktifGun={g.gun} />

        <View style={{ gap: SP.sm }}>
          <PixelButton
            label={g.gun >= TOPLAM_GUN ? 'Karneni al' : 'Yat, ertesi gün'}
            onPress={g.sonrakiGun}
          />
          <PixelButton label="Ana menü" tur="sessiz" onPress={g.anaMenu} />
        </View>
      </View>
    </ScrollView>
  );
}
