import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { gunGetir } from '../../content';
import { KAYIT_ADI } from '../../content/telefon';
import { telefonIzni } from '../../engine/kurallar';
import type { KayitRolu } from '../../engine/types';
import { useSecili } from '../../store/secici';
import { PixelInput } from '../../ui/PixelInput';
import { KayitSecici } from '../../ui/KayitSecici';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { Sahne } from '../../ui/sahne';
import { PanelKabuk } from './ortak';
import { KartliTelefon, LcdKutu, Raptiye } from './ankesorCizim';

/** Kulübe duvarına iğnelenmiş not: rehber kâğıdının küçüğü, uyarılar için. */
function DuvarNotu({ baslik, metin }: { baslik?: string; metin: string }) {
  return (
    <View
      style={{
        backgroundColor: C.kagit,
        borderWidth: BORDER,
        borderColor: C.ink,
        padding: SP.md,
        paddingTop: SP.md + 2,
        gap: 2,
        transform: [{ rotate: '-1deg' }],
      }}
    >
      <Raptiye />
      {baslik && (
        <PixelText font="command" size="body" color={C.rust} tracking={1}>
          {baslik}
        </PixelText>
      )}
      <PixelText size="small" color={C.murekkepSoluk} line="snug">
        {metin}
      </PixelText>
    </View>
  );
}

/**
 * Ankesörün içi. Duvara monte kartlı telefon, LCD'de kalan kart; yanında
 * duvara iğnelenmiş kâğıt rehber — künyeye yazdığın adlar, elle yazılmış
 * satırlar. Satıra dokunmak numarayı çevirmek. Kendi telefonun varsa koğuş
 * köşesinde cep telefonu, kontör gerekmiyor.
 */
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
      sahne={telefonVar ? undefined : { mekan: 'ankesor' }}
    >
      {/* Kulübenin içi (ya da koğuş köşesi) */}
      <View style={{ marginHorizontal: -SP.lg, marginTop: telefonVar ? -SP.lg : 0 }}>
        <Sahne
          yukseklik={150}
          u={3}
          zemin={telefonVar ? 'karo' : 'beton'}
          zeminOrani={0.18}
          duvar={telefonVar ? 'badana' : 'sac'}
          losluk={0.12}
          lambalar={[{ x: 30, y: 8, yaricap: 22 }]}
          tohum={11}
        >
          <View style={{ position: 'absolute', left: '10%', bottom: 150 * 0.18 - 6 }}>
            {telefonVar ? (
              <PixelSprite sprite={sprite('telefon')} scale={6} />
            ) : (
              <KartliTelefon u={4} lcd={String(kontor).padStart(2, '0')} />
            )}
          </View>
          <View
            style={{
              position: 'absolute',
              right: '8%',
              top: SP.lg,
              alignItems: 'flex-end',
              gap: SP.sm,
            }}
          >
            <LcdKutu
              baslik={telefonVar ? 'CEP' : 'KART'}
              deger={telefonVar ? 'HAT VAR' : `${kontor} ADET`}
            />
            {!telefonVar && (
              <View
                style={{
                  backgroundColor: C.kagit,
                  borderWidth: 2,
                  borderColor: C.ink,
                  paddingHorizontal: SP.sm,
                  paddingVertical: 2,
                  transform: [{ rotate: '2deg' }],
                }}
              >
                <PixelText size="micro" color={C.murekkep}>
                  KARTI TAK · ÇEVİR
                </PixelText>
              </View>
            )}
          </View>
        </Sahne>
      </View>

      {!izin.olur && <DuvarNotu baslik="ŞU AN ARANMAZ" metin={izin.sebep ?? ''} />}
      {!telefonVar && (
        <DuvarNotu metin="Kamerasız telefon almadın. Aramak için ankesör kuyruğuna gireceksin: her arama bir ankesör kartı yakar, kırk dakika kuyruk ve parası var." />
      )}

      {/* Duvardaki kâğıt rehber */}
      <View
        style={{
          backgroundColor: C.kagit,
          borderWidth: BORDER,
          borderColor: C.ink,
          padding: SP.lg,
          paddingTop: SP.lg + 4,
          gap: SP.md,
        }}
      >
        <Raptiye />
        <View style={{ borderBottomWidth: BORDER, borderColor: C.murekkep, paddingBottom: 2 }}>
          <PixelText font="command" size="body" color={C.murekkep} tracking={1}>
            ARANACAK KİŞİLER
          </PixelText>
        </View>

        {g.rehber.length === 0 ? (
          <PixelText size="body" color={C.murekkepSoluk} line="snug">
            Kâğıt boş. Aşağıya birinin adını yaz.
          </PixelText>
        ) : (
          <View>
            {g.rehber.map((k, i) => (
              <Pressable
                key={k.id}
                accessibilityRole="button"
                accessibilityLabel={`${k.ad} kişisini ara`}
                accessibilityState={{ disabled: !izin.olur }}
                disabled={!izin.olur}
                onPress={() => g.kisiAra(k.id)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: SP.sm,
                  borderBottomWidth: 1,
                  borderColor: C.kagitCizgi,
                  paddingVertical: SP.sm,
                  backgroundColor: pressed ? C.kagitCizgi : 'transparent',
                })}
              >
                <PixelText font="command" size="body" color={C.murekkepSoluk}>
                  {`${i + 1}.`}
                </PixelText>
                <View style={{ flex: 1 }}>
                  <PixelText font="bodySemi" size="lead" color={C.murekkep}>
                    {k.ad}
                  </PixelText>
                  <PixelText size="micro" color={C.murekkepSoluk}>
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
                {/* Elle daire içine alınmış "ARA" */}
                <View
                  style={{
                    borderWidth: 2,
                    borderColor: izin.olur ? C.rust : C.kagitCizgi,
                    paddingHorizontal: SP.sm,
                    paddingVertical: 2,
                    transform: [{ rotate: i % 2 ? '2deg' : '-2deg' }],
                  }}
                >
                  <PixelText
                    font="command"
                    size="body"
                    color={izin.olur ? C.rust : C.murekkepSoluk}
                  >
                    ARA
                  </PixelText>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Kâğıdın altı: yeni kayıt */}
        <View style={{ gap: SP.sm, paddingTop: SP.sm }}>
          <PixelText font="command" size="small" color={C.murekkepSoluk} tracking={1}>
            YENİ KAYIT
          </PixelText>
          <View style={{ flexDirection: 'row', gap: SP.md }}>
            <View style={{ flex: 3 }}>
              <PixelInput kagit value={ad} onChangeText={setAd} placeholder="İsim" maxLength={16} />
            </View>
            <View style={{ flex: 2 }}>
              <PixelInput
                kagit
                value={yakinlik}
                onChangeText={setYakinlik}
                placeholder="Yakınlık"
                maxLength={14}
              />
            </View>
          </View>

          <KayitSecici
            kagit
            secili={tur}
            onSec={setTur}
            devreDisi={g.rehber.some((k) => k.rol === 'ev') ? ['ev'] : []}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rehbere ekle"
            onPress={() => {
              g.kisiEkle(ad, yakinlik, tur);
              setAd('');
              setYakinlik('');
            }}
            style={{
              alignSelf: 'flex-start',
              borderWidth: BORDER,
              borderColor: C.murekkep,
              paddingHorizontal: SP.md,
              paddingVertical: SP.xs,
            }}
          >
            <PixelText font="command" size="body" color={C.murekkep}>
              + REHBERE EKLE
            </PixelText>
          </Pressable>
        </View>
      </View>
    </PanelKabuk>
  );
}
