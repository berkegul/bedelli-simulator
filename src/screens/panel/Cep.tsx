import React from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite, type SpriteKey } from '../../art';
import { gunGetir } from '../../content';
import { sigaraIzni, telefonIzni } from '../../engine/kurallar';
import { useSecili } from '../../store/secici';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { PanelKabuk } from './ortak';

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
    sprite: SpriteKey;
    ad: string;
    alt: string;
    kapali?: boolean;
    onPress: () => void;
  }[] = [];

  if (telefonVar) {
    satirlar.push({
      id: 'telefon',
      sprite: 'telefon',
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
      sprite: 'sigara',
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
      sprite: 'atistirmalik',
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

      {satirlar.length === 0 ? (
        <PixelText size="lead" color={C.canvasDim} center line="body">
          Cebin boş. Telefon ve sigara gibi üstünde taşıdıkların burada durur.
        </PixelText>
      ) : (
        <View style={{ gap: SP.sm }}>
          {satirlar.map((r) => (
            <Pressable
              key={r.id}
              accessibilityRole="button"
              accessibilityLabel={r.ad}
              accessibilityState={{ disabled: !!r.kapali }}
              disabled={r.kapali}
              onPress={r.onPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.md,
                borderWidth: BORDER,
                borderColor: C.ink,
                backgroundColor: C.surface,
                padding: SP.md,
                opacity: r.kapali ? 0.45 : 1,
              }}
            >
              <PixelSprite sprite={sprite(r.sprite)} scale={3} />
              <View style={{ flex: 1 }}>
                <PixelText font="bodySemi" size="lead" color={C.canvas}>
                  {r.ad}
                </PixelText>
                <PixelText size="micro" color={C.canvasFaint}>
                  {r.alt}
                </PixelText>
              </View>
              <PixelText font="command" size="lead" color={C.canvasDim}>
                {'>'}
              </PixelText>
            </Pressable>
          ))}
        </View>
      )}
    </PanelKabuk>
  );
}
