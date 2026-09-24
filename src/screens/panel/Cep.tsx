import React from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { IZMARIT_EZIK } from '../../art/sahne/avlu';
import { gunGetir } from '../../content';
import { sigaraIzni, telefonIzni } from '../../engine/kurallar';
import { useSecili } from '../../store/secici';
import { PixelSprite, type SpriteDef } from '../../ui/PixelSprite';
import { Golge } from '../../ui/sahne';
import { PixelText } from '../../ui/PixelText';
import { PanelKabuk } from './ortak';
import { ZeminParcasi } from './sahneParcalari';

/**
 * Cep: üstünde taşıdıkların. Telefon avluda bir direk değil, cebinde bir
 * eşya — dolap koğuşta kalır, bunlar seninle gelir.
 */
export function CepPaneli() {
  const g = useSecili(
    'blokIndex',
    'cepteIzmarit',
    'envanter',
    'gun',
    'izmaritAt',
    'miniAktif',
    'panelAc',
    'profil',
    'sigaraIc',
  );
  const telefonVar = (g.envanter.kamerasizTelefon?.adet ?? 0) > 0;
  const dal = g.envanter.sigara?.adet ?? 0;
  // Cep her yerden açılır ama içindekiler her yerde kullanılmaz.
  const blokId = gunGetir(g.gun)?.blocks[g.blokIndex]?.id;
  const sigaraOk = sigaraIzni(blokId, g.miniAktif);
  const telefonOk = telefonIzni(blokId, g.miniAktif);

  const satirlar: {
    id: string;
    sprite: SpriteDef;
    ad: string;
    alt: string;
    kapali?: boolean;
    onPress: () => void;
  }[] = [];

  if (telefonVar) {
    satirlar.push({
      id: 'telefon',
      sprite: sprite('telefon'),
      ad: 'Kamerasız telefon',
      // Kendi telefonun: kontör yok, hattın sende.
      alt: !telefonOk.olur ? telefonOk.sebep! : 'Rehberi aç · kontör gerekmiyor',
      kapali: !telefonOk.olur,
      onPress: () => g.panelAc('rehber'),
    });
  }

  if (g.profil.sigaraIciyor || dal > 0) {
    satirlar.push({
      id: 'sigara',
      sprite: sprite('sigara'),
      ad: 'Sigara',
      alt: !sigaraOk.olur
        ? sigaraOk.sebep!
        : dal > 0
          ? `${dal} dal kaldı`
          : 'Paket boş — kantinden al',
      kapali: !sigaraOk.olur || dal <= 0,
      onPress: () => g.sigaraIc(),
    });
  }

  if (g.cepteIzmarit > 0) {
    satirlar.push({
      id: 'izmarit',
      sprite: IZMARIT_EZIK,
      ad: 'Cebindeki izmaritler',
      alt: `${g.cepteIzmarit} adet · çöpe at`,
      onPress: () => g.izmaritAt(),
    });
  }

  return (
    <PanelKabuk baslik="CEBİN" alt="Üstünde taşıdıkların">
      {!sigaraOk.olur && !telefonOk.olur && satirlar.length > 0 && (
        <View style={{ borderWidth: BORDER, borderColor: C.line, padding: SP.md }}>
          <PixelText size="small" color={C.canvasDim} line="snug">
            Cebindekiler serbest zamanın işi. Görev başındayken cep kapalı kalır.
          </PixelText>
        </View>
      )}

      {/* Cebin içi: haki astar, dikiş; eşyalar üstünde dağınık duruyor */}
      <ZeminParcasi tur="kumas" yukseklik={satirlar.length > 2 ? 300 : 220} u={3} tohum={g.gun}>
        {satirlar.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SP.xl }}>
            <PixelText size="lead" color={C.canvasDim} center line="body">
              Cebin boş. Telefon ve sigara gibi üstünde taşıdıkların burada durur.
            </PixelText>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: SP.lg,
              gap: SP.md,
            }}
          >
            {satirlar.map((r, i) => (
              <Pressable
                key={r.id}
                accessibilityRole="button"
                accessibilityLabel={r.ad}
                accessibilityState={{ disabled: !!r.kapali }}
                disabled={r.kapali}
                onPress={r.onPress}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  gap: SP.xs,
                  maxWidth: 150,
                  opacity: r.kapali ? 0.5 : 1,
                  transform: [
                    { rotate: `${[-6, 4, -2][i % 3]}deg` },
                    { translateY: pressed ? 3 : 0 },
                  ],
                })}
              >
                <View style={{ alignItems: 'center' }}>
                  <PixelSprite sprite={r.sprite} scale={5} />
                  <View style={{ marginTop: -4 }}>
                    <Golge genislik={10} u={4} opaklik={0.28} />
                  </View>
                </View>
                {/* Üstünde bant gibi yapışmış etiket */}
                <View
                  style={{
                    backgroundColor: C.kagit,
                    borderWidth: BORDER,
                    borderColor: C.ink,
                    paddingHorizontal: SP.sm,
                    paddingVertical: 2,
                    alignItems: 'center',
                  }}
                >
                  <PixelText font="bodySemi" size="small" color={C.murekkep} center>
                    {r.ad}
                  </PixelText>
                  <PixelText size="micro" color={C.murekkepSoluk} center line="snug">
                    {r.alt}
                  </PixelText>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ZeminParcasi>
    </PanelKabuk>
  );
}
