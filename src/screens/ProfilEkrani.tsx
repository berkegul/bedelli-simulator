import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { SPRITES } from '../art';
import { useGame } from '../store/gameStore';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

/** Kışlaya girmeden önce: kimsin, sigara içiyor musun, kimleri arayacaksın. */
export function ProfilEkrani() {
  const g = useGame();
  const inset = useSafeAreaInsets();
  const [ad, setAd] = useState(g.profil.ad);
  const [sigara, setSigara] = useState(g.profil.sigaraIciyor);
  const [kisiAd, setKisiAd] = useState('');
  const [kisiYakinlik, setKisiYakinlik] = useState('');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{
        paddingTop: inset.top + SP.xl,
        paddingBottom: inset.bottom + SP.xl,
        paddingHorizontal: SP.xl,
        gap: SP.xl,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: 'center', gap: SP.sm }}>
        <PixelSprite sprite={SPRITES.kunye} scale={5} />
        <PixelText font="command" size="h2" color={C.canvas} tracking={1} style={{ marginTop: SP.md }}>
          KÜNYE
        </PixelText>
        <PixelText size="small" color={C.canvasFaint} center>
          Sevkin çıktı. Otobüse binmeden önce birkaç şey.
        </PixelText>
      </View>

      <PixelInput
        etiket="Adın"
        value={ad}
        onChangeText={setAd}
        placeholder="Er ..."
        maxLength={18}
        autoCapitalize="words"
      />

      <View style={{ gap: SP.sm }}>
        <PixelText font="bodyMed" size="small" color={C.canvasDim}>
          Sigara içiyor musun?
        </PixelText>
        <View style={{ flexDirection: 'row', gap: SP.sm }}>
          {[
            { deger: false, etiket: 'İçmiyorum' },
            { deger: true, etiket: 'İçiyorum' },
          ].map((s) => (
            <Pressable
              key={String(s.deger)}
              accessibilityRole="radio"
              accessibilityState={{ selected: sigara === s.deger }}
              onPress={() => setSigara(s.deger)}
              style={{
                flex: 1,
                borderWidth: BORDER,
                borderColor: sigara === s.deger ? C.brass : C.ink,
                backgroundColor: sigara === s.deger ? C.surfaceHi : C.surface,
                paddingVertical: SP.md,
                alignItems: 'center',
              }}
            >
              <PixelText
                font="bodySemi"
                size="body"
                color={sigara === s.deger ? C.brass : C.canvasDim}
              >
                {s.etiket}
              </PixelText>
            </Pressable>
          ))}
        </View>
        <PixelText size="micro" color={C.canvasFaint} line="snug">
          İçiyorsan kantin masrafın artar ve sigarasız geçen saatlerde kriz
          birikir. İçmiyorsan bu 28 gün cebine kalır.
        </PixelText>
      </View>

      <View style={{ gap: SP.sm }}>
        <PixelText font="bodyMed" size="small" color={C.canvasDim}>
          Arayacağın kişiler
        </PixelText>
        <PixelText size="micro" color={C.canvasFaint} line="snug">
          Telefonuna kaydet. İçeride bu isimler serbest zamanda karşına çıkacak.
        </PixelText>

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
              paddingVertical: SP.sm,
              paddingHorizontal: SP.md,
            }}
          >
            <View style={{ flex: 1 }}>
              <PixelText font="bodySemi" size="body" color={C.canvas}>
                {k.ad}
              </PixelText>
              <PixelText size="micro" color={C.canvasFaint}>
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
                SİL
              </PixelText>
            </Pressable>
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: SP.sm }}>
          <View style={{ flex: 3 }}>
            <PixelInput value={kisiAd} onChangeText={setKisiAd} placeholder="İsim" maxLength={16} />
          </View>
          <View style={{ flex: 2 }}>
            <PixelInput
              value={kisiYakinlik}
              onChangeText={setKisiYakinlik}
              placeholder="Yakınlık"
              maxLength={14}
            />
          </View>
        </View>
        <PixelButton
          label="Rehbere ekle"
          tur="sessiz"
          onPress={() => {
            g.kisiEkle(kisiAd, kisiYakinlik);
            setKisiAd('');
            setKisiYakinlik('');
          }}
        />
      </View>

      <PixelButton
        label="Çarşıya git"
        onPress={() => g.profilKaydet(ad, sigara)}
        disabled={!ad.trim()}
      />
    </ScrollView>
  );
}
