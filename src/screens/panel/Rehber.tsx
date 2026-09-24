import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { gunGetir } from '../../content';
import { KAYIT_ADI } from '../../content/telefon';
import { telefonIzni } from '../../engine/kurallar';
import type { KayitRolu } from '../../engine/types';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelInput } from '../../ui/PixelInput';
import { KayitSecici } from '../../ui/KayitSecici';
import { PixelText } from '../../ui/PixelText';
import { PanelKabuk } from './ortak';

export function RehberPaneli() {
  const g = useSecili('blokIndex', 'envanter', 'gun', 'kisiAra', 'kisiEkle', 'miniAktif', 'rehber');
  const [ad, setAd] = useState('');
  const [yakinlik, setYakinlik] = useState('');
  const [tur, setTur] = useState<KayitRolu>('ev');
  const telefonVar = (g.envanter.kamerasizTelefon?.adet ?? 0) > 0;
  const kontor = g.envanter.kontor?.adet ?? 0;
  const izin = telefonIzni(gunGetir(g.gun)?.blocks[g.blokIndex]?.id, g.miniAktif);

  return (
    <PanelKabuk
      baslik="REHBER"
      alt={telefonVar ? 'Kendi telefonun · kontör gerekmiyor' : `Ankesör · ${kontor} kart kaldı`}
    >
      {!izin.olur && (
        <View style={{ borderWidth: BORDER, borderColor: C.rust, padding: SP.md }}>
          <PixelText font="command" size="body" color={C.rust}>
            ŞU AN ARANMAZ
          </PixelText>
          <PixelText size="small" color={C.canvasDim} line="snug">
            {izin.sebep}
          </PixelText>
        </View>
      )}
      {!telefonVar && (
        <View style={{ borderWidth: BORDER, borderColor: C.rust, padding: SP.md }}>
          <PixelText size="small" color={C.canvasDim} line="snug">
            Kamerasız telefon almadın. Aramak için ankesör kuyruğuna gireceksin: her arama bir
            ankesör kartı yakar, kırk dakika kuyruk ve parası var.
          </PixelText>
        </View>
      )}

      {g.rehber.length === 0 ? (
        <PixelText size="lead" color={C.canvasDim} center>
          Rehberin boş. Aşağıdan birini kaydet.
        </PixelText>
      ) : (
        <View style={{ gap: SP.sm }}>
          {g.rehber.map((k) => (
            <View
              key={k.id}
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
              <View style={{ flex: 1 }}>
                <PixelText font="bodySemi" size="lead" color={C.canvas}>
                  {k.ad}
                </PixelText>
                <PixelText size="micro" color={C.canvasFaint}>
                  {[
                    k.yakinlik,
                    // Etiket zaten rolün adıysa iki kere yazmanın anlamı yok.
                    k.rol && k.yakinlik !== KAYIT_ADI[k.rol]
                      ? KAYIT_ADI[k.rol].toLocaleLowerCase('tr-TR')
                      : null,
                    k.sonArananGun === g.gun ? 'bugün arandı' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </PixelText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${k.ad} kişisini ara`}
                accessibilityState={{ disabled: !izin.olur }}
                disabled={!izin.olur}
                onPress={() => g.kisiAra(k.id)}
                style={{
                  borderWidth: BORDER,
                  borderColor: C.ink,
                  backgroundColor: C.surfaceHi,
                  paddingVertical: SP.sm,
                  paddingHorizontal: SP.lg,
                  opacity: izin.olur ? 1 : 0.4,
                }}
              >
                <PixelText font="command" size="lead" color={izin.olur ? C.olive : C.canvasFaint}>
                  ARA
                </PixelText>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={{ gap: SP.sm }}>
        <View style={{ flexDirection: 'row', gap: SP.sm }}>
          <View style={{ flex: 3 }}>
            <PixelInput value={ad} onChangeText={setAd} placeholder="İsim" maxLength={16} />
          </View>
          <View style={{ flex: 2 }}>
            <PixelInput
              value={yakinlik}
              onChangeText={setYakinlik}
              placeholder="Yakınlık"
              maxLength={14}
            />
          </View>
        </View>

        <KayitSecici
          secili={tur}
          onSec={setTur}
          devreDisi={g.rehber.some((k) => k.rol === 'ev') ? ['ev'] : []}
        />

        <PixelButton
          label="Rehbere ekle"
          tur="sessiz"
          onPress={() => {
            g.kisiEkle(ad, yakinlik, tur);
            setAd('');
            setYakinlik('');
          }}
        />
      </View>
    </PanelKabuk>
  );
}
