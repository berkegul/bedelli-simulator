import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, SP, BORDER } from '../theme';
import { gunGetir } from '../content';
import { kalanGun } from '../engine/stats';
import { useSecili } from '../store/secici';
import { MekanSeridi } from '../ui/MekanSeridi';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { sesCal } from '../ses';

const GOLGE = {
  textShadowColor: C.ink,
  textShadowOffset: { width: 3, height: 3 },
  textShadowRadius: 0,
};

/**
 * Koğuş duvarına tebeşirle atılmış çentikler: dörder dik çizgi, beşincisi
 * çapraz. Geçen her gün bir çizgi; menüdeki çentik takviminin duvardaki hâli.
 */
function Centikler({ adet, u }: { adet: number; u: number }) {
  const gruplar = Math.ceil(adet / 5);
  const tebesir = '#D9D2BC';
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 * u, maxWidth: 34 * u * 3 }}>
      {Array.from({ length: gruplar }, (_, gi) => {
        const bu = Math.min(5, adet - gi * 5);
        return (
          <View key={gi} style={{ width: 9 * u, height: 8 * u }}>
            {Array.from({ length: Math.min(4, bu) }, (_, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: i * 2 * u + u,
                  top: (i % 2) * (u / 2),
                  width: u,
                  height: 8 * u - (i % 2) * u,
                  backgroundColor: tebesir,
                  opacity: 0.8,
                }}
              />
            ))}
            {bu === 5 && (
              <View
                style={{
                  position: 'absolute',
                  left: -u / 2,
                  top: 3.5 * u,
                  width: 10 * u,
                  height: u,
                  backgroundColor: tebesir,
                  opacity: 0.85,
                  transform: [{ rotate: '-28deg' }],
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

/**
 * Günün açılışı: koğuş, şafaktan önce. Işıklar daha loş; duvarda geçen
 * günlerin çentikleri, üstünde günün numarası ve adı. Epigraf ve dolap
 * özeti altta, sonra düdük.
 */
export function GunBasiEkrani() {
  const g = useSecili('dolapOzeti', 'gun', 'gunuBaslat');
  const inset = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const gunData = gunGetir(g.gun);
  if (!gunData) return null;
  const k = height >= 720 ? 2 : 1;
  const sahneEk = Math.max(0, Math.round(height * 0.6) - 150 * k);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingBottom: inset.bottom + SP.xl, flexGrow: 1 }}
    >
      <MekanSeridi
        blokId={`d${g.gun}-kalkis`}
        saat="05:20"
        carpan={k}
        ekYukseklik={sahneEk}
        cercevesiz
        etiketsiz
      >
        <View
          style={{
            position: 'absolute',
            top: inset.top + SP.xl,
            left: 0,
            right: 0,
            alignItems: 'center',
            gap: SP.xs,
          }}
        >
          <PixelText font="command" size="body" color={C.canvasDim} tracking={4} style={GOLGE}>
            {`SİVİLE ${kalanGun(g.gun)} GÜN`}
          </PixelText>
          <PixelText font="command" size={96} color={C.brass} line="tight" style={GOLGE}>
            {String(g.gun).padStart(2, '0')}
          </PixelText>
          <PixelText font="command" size="h2" color={C.canvas} center tracking={1} style={GOLGE}>
            {gunData.title.toLocaleUpperCase('tr-TR')}
          </PixelText>
          {g.gun > 1 && (
            <View style={{ marginTop: SP.md }}>
              <Centikler adet={g.gun - 1} u={k + 1} />
            </View>
          )}
        </View>
      </MekanSeridi>

      <View style={{ paddingHorizontal: SP.xl, paddingTop: SP.lg, gap: SP.lg, flexGrow: 1 }}>
        {gunData.epigraph && (
          <PixelText size="lead" color={C.canvas} center line="loose">
            {gunData.epigraph}
          </PixelText>
        )}
        {g.dolapOzeti.length > 0 && (
          <View style={{ borderWidth: BORDER, borderColor: C.line, padding: SP.md, gap: SP.xs }}>
            <PixelText font="command" size="body" color={C.canvasFaint} tracking={2}>
              DOLABINDAN
            </PixelText>
            {g.dolapOzeti.slice(0, 4).map((satir) => (
              <PixelText key={satir} size="micro" color={C.canvasDim}>
                {satir}
              </PixelText>
            ))}
            {g.dolapOzeti.length > 4 && (
              <PixelText size="micro" color={C.canvasFaint}>
                {`ve ${g.dolapOzeti.length - 4} kalem daha`}
              </PixelText>
            )}
          </View>
        )}
        <View style={{ marginTop: 'auto' }}>
          <PixelButton
            label="Kalkışa hazırlan"
            onPress={() => {
              sesCal('duduk');
              g.gunuBaslat();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
