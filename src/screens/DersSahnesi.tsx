import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { ANT41, TOPLAM_MADDE, type AntBolum } from '../content/ant41';
import { Siddet, titret } from '../ui/haptik';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';

type Props = {
  /** Ders bitince ilerlemek için; salt okuma modunda verilmez. */
  onBitti?: () => void;
  /** Serbest zamanda tekrar bakarken başlık ve buton değişiyor. */
  tekrar?: boolean;
};

/**
 * ANT-41 dersi. Sınav yok, soru sorulmuyor — bu ekran öğretir, sorgulamaz.
 * Oyuncu bölümleri istediği sırada açar; hepsini görmeden ders bitmez ama
 * bir baskı da yoktur, okuma hızını kendisi belirler.
 */
export function DersSahnesi({ onBitti, tekrar }: Props) {
  const [acik, setAcik] = useState<AntBolum | null>(tekrar ? ANT41[0] : null);
  const [okunan, setOkunan] = useState<string[]>(tekrar ? ANT41.map((b) => b.id) : []);

  const hepsi = okunan.length >= ANT41.length;

  const ac = (b: AntBolum) => {
    titret(Siddet.Light);
    setAcik(b);
    setOkunan((o) => (o.includes(b.id) ? o : [...o, b.id]));
  };

  return (
    <View style={{ gap: SP.lg }}>
      <View style={{ gap: SP.xs }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
          <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
            ANT-41
          </PixelText>
          <PixelText font="command" size="body" color={hepsi ? C.olive : C.canvasFaint}>
            {`${okunan.length} / ${ANT41.length} bölüm`}
          </PixelText>
        </View>
        <PixelText size="micro" color={C.canvasFaint}>
          {`Askerî nezaket ve protokol kuralları · ${TOPLAM_MADDE} madde`}
        </PixelText>
      </View>

      {/* Bölüm listesi */}
      <View style={{ gap: SP.sm }}>
        {ANT41.map((b) => {
          const secili = acik?.id === b.id;
          const gorulmus = okunan.includes(b.id);
          return (
            <Pressable
              key={b.id}
              accessibilityRole="button"
              accessibilityLabel={b.baslik}
              accessibilityState={{ selected: secili }}
              onPress={() => ac(b)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.md,
                borderWidth: BORDER,
                borderColor: secili ? C.brass : C.ink,
                backgroundColor: secili ? C.surfaceHi : C.surface,
                paddingVertical: SP.md,
                paddingHorizontal: SP.md,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderWidth: BORDER,
                  borderColor: gorulmus ? C.olive : C.line,
                  backgroundColor: gorulmus ? C.olive : 'transparent',
                }}
              />
              <View style={{ flex: 1 }}>
                <PixelText font="bodySemi" size="lead" color={secili ? C.brass : C.canvas}>
                  {b.baslik}
                </PixelText>
                <PixelText size="micro" color={C.canvasFaint}>
                  {`${b.maddeler.length} madde`}
                </PixelText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Seçili bölümün maddeleri */}
      {acik && (
        <View
          style={{
            borderLeftWidth: 4,
            borderLeftColor: C.brass,
            paddingLeft: SP.lg,
            gap: SP.md,
          }}
        >
          <View style={{ gap: SP.xs }}>
            <PixelText font="command" size="lead" color={C.brass}>
              {acik.baslik.toLocaleUpperCase('tr-TR')}
            </PixelText>
            <PixelText size="small" color={C.canvasDim} line="body">
              {acik.giris}
            </PixelText>
          </View>

          <View style={{ gap: SP.md }}>
            {acik.maddeler.map((m, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: SP.sm }}>
                <PixelText font="command" size="body" color={C.canvasFaint}>
                  {String(i + 1).padStart(2, '0')}
                </PixelText>
                <PixelText size="lead" color={C.canvas} line="body" style={{ flex: 1 }}>
                  {m}
                </PixelText>
              </View>
            ))}
          </View>
        </View>
      )}

      {!acik && (
        <PixelText size="small" color={C.canvasFaint} center line="snug">
          Bir bölüme dokun ve maddeleri oku.
        </PixelText>
      )}

      {onBitti && (
        <PixelButton
          label={hepsi ? 'Dersi bitir' : `${ANT41.length - okunan.length} bölüm kaldı`}
          tur={hepsi ? 'ana' : 'sessiz'}
          disabled={!hepsi}
          onPress={onBitti}
        />
      )}
    </View>
  );
}
