import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, SP } from '../theme';
import { gunGetir } from '../content';
import { kalanGun } from '../engine/stats';
import { useGame } from '../store/gameStore';
import { BORDER } from '../theme';
import { PixelButton } from '../ui/PixelButton';
import { GokyuzuGecisi } from '../ui/GokyuzuGecisi';
import { PixelText } from '../ui/PixelText';

export function GunBasiEkrani() {
  const g = useGame();
  const inset = useSafeAreaInsets();
  const gunData = gunGetir(g.gun);
  if (!gunData) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.bg,
        paddingTop: inset.top + SP.xl,
        paddingBottom: inset.bottom + SP.xl,
        paddingHorizontal: SP.xl,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ gap: SP.sm, alignItems: 'center', marginTop: SP.xxxl }}>
        <PixelText font="command" size="body" color={C.canvasFaint} tracking={4}>
          {`SİVİLE ${kalanGun(g.gun)} GÜN`}
        </PixelText>
        <PixelText font="command" size={96} color={C.brass} line="tight">
          {String(g.gun).padStart(2, '0')}
        </PixelText>
        <PixelText font="command" size="h2" color={C.canvas} center tracking={1}>
          {gunData.title.toLocaleUpperCase('tr-TR')}
        </PixelText>
      </View>

      {/* Gün doğuyor: gökyüzü geceden sabaha dönerken güneş ufuktan çıkıyor */}
      <View style={{ borderWidth: BORDER, borderColor: C.ink, marginVertical: SP.md }}>
        <GokyuzuGecisi yon="dogum" yukseklik={130} />
      </View>

      <View style={{ gap: SP.lg }}>
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
        {gunData.epigraph && (
          <PixelText size="lead" color={C.canvasDim} center line="loose">
            {gunData.epigraph}
          </PixelText>
        )}
        <PixelButton label="Kalkışa hazırlan" onPress={g.gunuBaslat} />
      </View>
    </View>
  );
}
