import React from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { KALITE_ADI, esya, kullanilabilirler } from '../../content/esyalar';
import { useSecili } from '../../store/secici';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { PanelKabuk } from './ortak';

export function DolapPaneli() {
  const g = useSecili('envanter', 'esyaKullan', 'gun', 'panelAc');
  const dolu = Object.entries(g.envanter).filter(([, v]) => (v?.adet ?? 0) > 0);
  const kullanilir = kullanilabilirler(g.envanter);

  return (
    <PanelKabuk baslik="DOLABIN" alt="Denetimde açık duracak">
      {g.gun >= 5 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="ANT-41 kâğıdını oku"
          onPress={() => g.panelAc('ant41')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SP.md,
            borderWidth: BORDER,
            borderColor: C.brass,
            backgroundColor: C.surface,
            padding: SP.md,
          }}
        >
          <PixelSprite sprite={sprite('defter')} scale={3} />
          <View style={{ flex: 1 }}>
            <PixelText font="bodySemi" size="body" color={C.brass}>
              ANT-41 kâğıdı
            </PixelText>
            <PixelText size="micro" color={C.canvasFaint}>
              Askerî nezaket kuralları — istediğin zaman bak
            </PixelText>
          </View>
          <PixelText font="command" size="lead" color={C.canvasDim}>
            {'>'}
          </PixelText>
        </Pressable>
      )}

      {dolu.length === 0 ? (
        <PixelText size="lead" color={C.canvasDim} center>
          Dolabın boş. Çarşıda ne aldıysan burada olurdu.
        </PixelText>
      ) : (
        <View style={{ gap: SP.sm }}>
          {dolu.map(([id, kayit]) => {
            const t = esya(id as Parameters<typeof esya>[0]);
            const kullanilabilir = kullanilir.some((k) => k.id === t.id);
            return (
              <View
                key={id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: SP.md,
                  borderWidth: BORDER,
                  borderColor: C.line,
                  backgroundColor: C.surface,
                  padding: SP.md,
                }}
              >
                <PixelSprite sprite={sprite(t.sprite)} scale={3} />
                <View style={{ flex: 1 }}>
                  <PixelText font="bodySemi" size="body" color={C.canvas}>
                    {t.ad}
                  </PixelText>
                  <PixelText size="micro" color={C.canvasFaint}>
                    {[
                      // Kademesiz üründe kalite yazmak bilgi değil gürültü.
                      t.kademeli ? KALITE_ADI[kayit!.kalite] : null,
                      kayit!.adet > 1 ? `${kayit!.adet} ${t.birim ?? 'adet'}` : null,
                      t.tuketilir && kayit!.adet === 1 ? `son bir ${t.birim ?? 'tane'}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || t.aciklama.split('.')[0]}
                  </PixelText>
                </View>
                {kullanilabilir && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${t.ad} kullan`}
                    onPress={() => g.esyaKullan(t.id)}
                    style={{
                      borderWidth: BORDER,
                      borderColor: C.ink,
                      backgroundColor: C.surfaceHi,
                      paddingVertical: SP.sm,
                      paddingHorizontal: SP.md,
                    }}
                  >
                    <PixelText font="command" size="body" color={C.brass}>
                      KULLAN
                    </PixelText>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      )}
    </PanelKabuk>
  );
}
