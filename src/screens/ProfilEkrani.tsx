import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { SPRITES } from '../art';
import { useSecili } from '../store/secici';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { KayitSecici } from '../ui/KayitSecici';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import type { KayitRolu } from '../engine/types';

/** Evrakta bölüm başlığı: numaralı, büyük harf, altı çizgili. */
function Bolum({
  no,
  baslik,
  children,
}: {
  no: string;
  baslik: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: SP.sm }}>
      <View
        style={{
          flexDirection: 'row',
          gap: SP.sm,
          borderBottomWidth: BORDER,
          borderColor: C.murekkep,
          paddingBottom: 2,
        }}
      >
        <PixelText font="command" size="body" color={C.murekkepSoluk}>
          {no}
        </PixelText>
        <PixelText font="command" size="body" color={C.murekkep} tracking={1}>
          {baslik}
        </PixelText>
      </View>
      {children}
    </View>
  );
}

/** Kâğıtta işaretlenen kutu: [X] seçili, [ ] boş. */
function Kutu({
  secili,
  etiket,
  onPress,
}: {
  secili: boolean;
  etiket: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: secili }}
      accessibilityLabel={etiket}
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: SP.sm, paddingVertical: SP.xs }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderWidth: BORDER,
          borderColor: C.murekkep,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {secili && (
          <PixelText font="command" size="lead" color={C.rust}>
            X
          </PixelText>
        )}
      </View>
      <PixelText font="bodySemi" size="body" color={C.murekkep}>
        {etiket}
      </PixelText>
    </Pressable>
  );
}

/**
 * Kışlaya girmeden önce doldurulan sevk belgesi. Eskiden koyu zeminde bir
 * formdu; şimdi kaput bezi tonunda bir kâğıt: başlık, damga, numaralı
 * bölümler, alt çizgili alanlar. Oyuncu bir uygulamaya kayıt olmuyor, bir
 * askerlik evrakı dolduruyor.
 */
export function ProfilEkrani() {
  const g = useSecili('kisiEkle', 'kisiSil', 'profil', 'profilKaydet', 'rehber');
  const inset = useSafeAreaInsets();
  const [ad, setAd] = useState(g.profil.ad);
  const [sigara, setSigara] = useState(g.profil.sigaraIciyor);
  const [kisiAd, setKisiAd] = useState('');
  const [kisiYakinlik, setKisiYakinlik] = useState('');
  const [kisiTur, setKisiTur] = useState<KayitRolu>('ev');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{
        paddingTop: inset.top + SP.lg,
        paddingBottom: inset.bottom + SP.xl,
        paddingHorizontal: SP.lg,
        gap: SP.lg,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <PixelText size="small" color={C.canvasDim} center>
        Sevkin çıktı. Otobüse binmeden önce şu kâğıt doldurulacak.
      </PixelText>

      {/* Kâğıt */}
      <View
        style={{
          backgroundColor: C.kagit,
          borderWidth: BORDER,
          borderColor: C.ink,
          padding: SP.lg,
          gap: SP.xl,
        }}
      >
        {/* Başlık ve damga */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: SP.md }}>
          <View style={{ flex: 1, gap: 2 }}>
            <PixelText font="command" size="small" color={C.murekkepSoluk} tracking={1}>
              T.C. ASKERLİK ŞUBESİ
            </PixelText>
            <PixelText font="command" size="h2" color={C.murekkep} tracking={1}>
              SEVK BELGESİ
            </PixelText>
            <PixelText font="command" size="small" color={C.murekkepSoluk}>
              BEDELLİ · TEMEL EĞİTİM · 28 GÜN
            </PixelText>
          </View>
          <View
            style={{
              borderWidth: 3,
              borderColor: C.rust,
              paddingHorizontal: SP.sm,
              paddingVertical: 2,
              transform: [{ rotate: '-8deg' }],
              opacity: 0.85,
              marginTop: SP.sm,
            }}
          >
            <PixelText font="command" size="lead" color={C.rust} tracking={2}>
              SEVK
            </PixelText>
          </View>
        </View>

        <Bolum no="1." baslik="KİMLİK">
          <View style={{ flexDirection: 'row', gap: SP.md, alignItems: 'flex-end' }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderWidth: BORDER,
                borderColor: C.murekkepSoluk,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PixelSprite sprite={SPRITES.kunye} scale={2} />
            </View>
            <View style={{ flex: 1 }}>
              <PixelInput
                kagit
                etiket="Adı"
                value={ad}
                onChangeText={setAd}
                placeholder="Er ..."
                maxLength={18}
                autoCapitalize="words"
              />
            </View>
          </View>
        </Bolum>

        <Bolum no="2." baslik="SİGARA KULLANIMI">
          <View style={{ flexDirection: 'row', gap: SP.xl }}>
            <Kutu secili={!sigara} etiket="Kullanmıyor" onPress={() => setSigara(false)} />
            <Kutu secili={sigara} etiket="Kullanıyor" onPress={() => setSigara(true)} />
          </View>
          <PixelText size="small" color={C.murekkepSoluk} line="snug">
            İçiyorsan kantin masrafın artar, sigarasız geçen saatlerde kriz birikir. İçmiyorsan bu
            28 gün cebine kalır.
          </PixelText>
        </Bolum>

        <Bolum no="3." baslik="ARANACAK KİŞİLER">
          <PixelText size="small" color={C.murekkepSoluk} line="snug">
            Serbest zamanda telefonda bu isimler karşına çıkacak.
          </PixelText>

          {g.rehber.map((k, i) => (
            <View
              key={k.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.sm,
                borderBottomWidth: 1,
                borderColor: C.kagitCizgi,
                paddingVertical: SP.xs,
              }}
            >
              <PixelText font="command" size="body" color={C.murekkepSoluk}>
                {`${i + 1}.`}
              </PixelText>
              <View style={{ flex: 1 }}>
                <PixelText font="bodySemi" size="body" color={C.murekkep}>
                  {k.ad}
                </PixelText>
                <PixelText size="small" color={C.murekkepSoluk}>
                  {k.yakinlik}
                </PixelText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${k.ad} kaydını sil`}
                onPress={() => g.kisiSil(k.id)}
                hitSlop={10}
              >
                <PixelText font="command" size="lead" color={C.rust}>
                  ÇİZ
                </PixelText>
              </Pressable>
            </View>
          ))}

          <View style={{ flexDirection: 'row', gap: SP.md }}>
            <View style={{ flex: 3 }}>
              <PixelInput
                kagit
                value={kisiAd}
                onChangeText={setKisiAd}
                placeholder="İsim"
                maxLength={16}
              />
            </View>
            <View style={{ flex: 2 }}>
              <PixelInput
                kagit
                value={kisiYakinlik}
                onChangeText={setKisiYakinlik}
                placeholder="Yakınlık"
                maxLength={14}
              />
            </View>
          </View>

          <KayitSecici
            kagit
            secili={kisiTur}
            onSec={setKisiTur}
            devreDisi={g.rehber.some((k) => k.rol === 'ev') ? ['ev'] : []}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Listeye ekle"
            disabled={!kisiAd.trim()}
            onPress={() => {
              g.kisiEkle(kisiAd, kisiYakinlik, kisiTur);
              setKisiAd('');
              setKisiYakinlik('');
            }}
            style={{
              alignSelf: 'flex-start',
              borderWidth: BORDER,
              borderColor: C.murekkep,
              paddingHorizontal: SP.md,
              paddingVertical: SP.xs,
              opacity: kisiAd.trim() ? 1 : 0.4,
            }}
          >
            <PixelText font="command" size="body" color={C.murekkep}>
              + LİSTEYE EKLE
            </PixelText>
          </Pressable>
        </Bolum>

        <PixelText font="command" size="small" color={C.murekkepSoluk} center>
          İMZA: {ad.trim() ? ad.trim().toLocaleUpperCase('tr-TR') : '..............'}
        </PixelText>
      </View>

      <PixelButton
        label="İmzala, çarşıya git"
        onPress={() => g.profilKaydet(ad, sigara)}
        disabled={!ad.trim()}
      />
    </ScrollView>
  );
}
