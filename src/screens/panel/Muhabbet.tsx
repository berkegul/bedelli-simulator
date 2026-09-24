import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { RANZA_YAN } from '../../art/sahne/kogus';
import { arkadas } from '../../content/arkadaslar';
import type { ArkadasId } from '../../engine/types';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { Golge, Nefes, Sahne } from '../../ui/sahne';
import { ARKADAS_SPRITE, PanelKabuk } from './ortak';

const OTURAN: Record<ArkadasId, 'oturanEmre' | 'oturanTolga' | 'oturanSerkan'> = {
  emre: 'oturanEmre',
  tolga: 'oturanTolga',
  serkan: 'oturanSerkan',
};

const U = 3;
const YUKSEKLIK = 210;
const ZEMIN_ORANI = 0.3;
const ZEMIN_Y = Math.round(YUKSEKLIK * (1 - ZEMIN_ORANI));

/**
 * Koğuşta akşam: iki ranza karşılıklı, kenarlarında sen ve arkadaşın
 * oturuyorsunuz. Arkadaşın sağda, senin sırtın yarım dönük solda.
 */
function MuhabbetSahnesi({ kim }: { kim: ArkadasId }) {
  const { width } = useWindowDimensions();
  const [en, setEn] = useState(Math.min(width, 480) - 2 * SP.lg);
  // RANZA_YAN genişliğini sprite'tan oku; iki ranza kenarları kadrajda.
  const ranzaW = (RANZA_YAN.rows[0]?.length ?? 30) * 3;
  const ranzaH = RANZA_YAN.rows.length * 3;

  return (
    <View
      onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
      style={{ borderWidth: BORDER, borderColor: C.ink, overflow: 'hidden' }}
    >
      <Sahne
        yukseklik={YUKSEKLIK}
        u={U}
        duvar="badana"
        zemin="karo"
        zeminOrani={ZEMIN_ORANI}
        losluk={0.22}
        lambalar={[{ x: 50, y: 12, yaricap: 40, guc: 0.22 }]}
        tohum={4}
      >
        {/* Sol ve sağ ranza, uçları kadrajdan taşıyor */}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: -ranzaW * 0.45, top: ZEMIN_Y + 18 - ranzaH }}
        >
          <PixelSprite sprite={RANZA_YAN} scale={3} />
        </View>
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: en - ranzaW * 0.55, top: ZEMIN_Y + 18 - ranzaH }}
        >
          <PixelSprite sprite={RANZA_YAN} scale={3} />
        </View>
        {/* Sen: solda, sırtın yarım dönük */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: en * 0.16,
            top: ZEMIN_Y - 16 * 4 + 20,
            alignItems: 'center',
          }}
        >
          <Nefes u={U} gecikme={400}>
            <PixelSprite sprite={sprite('oturanAsker')} scale={4} />
          </Nefes>
          <View style={{ marginTop: -U }}>
            <Golge genislik={12} u={4} opaklik={0.25} />
          </View>
        </View>
        {/* Arkadaşın: sağda, sana dönük */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: en * 0.62,
            top: ZEMIN_Y - 16 * 4 + 20,
            alignItems: 'center',
          }}
        >
          <Nefes u={U}>
            <PixelSprite sprite={sprite(OTURAN[kim])} scale={4} />
          </Nefes>
          <View style={{ marginTop: -U }}>
            <Golge genislik={12} u={4} opaklik={0.25} />
          </View>
        </View>
      </Sahne>
    </View>
  );
}

/** Balonun kuyruğu: üç basamak daralan piksel, konuşana doğru. */
function Kuyruk({ yon, renk, yukari }: { yon: 'sol' | 'sag'; renk: string; yukari?: boolean }) {
  const hiza = yon === 'sol' ? 'flex-start' : 'flex-end';
  return (
    <View style={{ alignItems: hiza, paddingHorizontal: SP.xl }}>
      {(yukari ? [1, 2, 3] : [3, 2, 1]).map((w) => (
        <View key={w} style={{ width: w * U * 2, height: U * 2, backgroundColor: renk }} />
      ))}
    </View>
  );
}

export function MuhabbetPaneli() {
  const g = useSecili('aktifDiyalog', 'diyalogSec', 'dostluk');
  const d = g.aktifDiyalog;

  return (
    <PanelKabuk baslik="KOĞUŞ MUHABBETİ" alt={d ? 'Ranza kenarı, akşam' : undefined}>
      {!d ? (
        <PixelText size="lead" color={C.canvasDim} center line="body">
          Koğuşta herkes kendi işinde. Bugünlük muhabbet bu kadar.
        </PixelText>
      ) : (
        <View style={{ gap: SP.md }}>
          <MuhabbetSahnesi kim={d.kim} />

          {/* Arkadaşın: portre ve adı, balonu yukarı, ona doğru */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SP.md }}>
            <View
              style={{
                width: 60,
                height: 76,
                borderWidth: BORDER,
                borderColor: C.ink,
                backgroundColor: C.bg,
                alignItems: 'center',
                justifyContent: 'flex-end',
                overflow: 'hidden',
              }}
            >
              <PixelSprite sprite={sprite(ARKADAS_SPRITE[d.kim])} scale={3} />
            </View>
            <View style={{ flex: 1 }}>
              <PixelText font="command" size="lead" color={C.brass}>
                {arkadas(d.kim).ad.toLocaleUpperCase('tr-TR')}
              </PixelText>
              <PixelText size="micro" color={C.canvasFaint}>
                {`${arkadas(d.kim).meslek} · yakınlık ${g.dostluk[d.kim] ?? 0}`}
              </PixelText>
            </View>
          </View>

          <View>
            <Kuyruk yon="sol" renk={C.ink} yukari />
            <View
              style={{
                borderWidth: BORDER,
                borderColor: C.ink,
                backgroundColor: C.canvas,
                padding: SP.lg,
              }}
            >
              <PixelText size="lead" color={C.murekkep} line="body">
                {d.metin}
              </PixelText>
            </View>
          </View>

          {/* Senin balonun: seçenekler, kuyruğu sağdan aşağı sana */}
          <View
            style={{
              borderWidth: BORDER,
              borderColor: C.line,
              backgroundColor: C.surface,
              padding: SP.sm,
              gap: SP.sm,
            }}
          >
            <PixelText font="command" size="small" color={C.canvasFaint} tracking={1}>
              SEN
            </PixelText>
            {d.secenekler.map((s, i) => (
              <PixelButton key={i} tur="secim" label={s.label} onPress={() => g.diyalogSec(i)} />
            ))}
          </View>
          <Kuyruk yon="sag" renk={C.line} />
        </View>
      )}
    </PanelKabuk>
  );
}
