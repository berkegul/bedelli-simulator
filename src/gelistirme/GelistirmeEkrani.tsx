import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { useGame } from '../store/gameStore';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { Baslik, Kart } from './parcalar';
import { BolumKonum } from './bolumler/Konum';
import { BolumMiniOyunlar } from './bolumler/MiniOyunlar';
import { BolumSahneler } from './bolumler/Sahneler';
import { BolumPaneller } from './bolumler/Paneller';
import { BolumTelefon } from './bolumler/Telefon';
import { BolumEkranlar } from './bolumler/Ekranlar';
import { BolumSistemler } from './bolumler/Sistemler';
import { BolumFinaller } from './bolumler/Finaller';
import { BolumDurum } from './bolumler/Durum';

type BolumId =
  | 'konum'
  | 'mini'
  | 'sahne'
  | 'panel'
  | 'telefon'
  | 'ekran'
  | 'sistem'
  | 'final'
  | 'durum';

const BOLUMLER: {
  id: BolumId;
  ad: string;
  alt: string;
  renk: string;
  bilesen: React.ComponentType;
}[] = [
  {
    id: 'konum',
    ad: 'Konum değiştirme',
    alt: 'Yol sahnesi · her güzergâh, adım adım, hava ve gökyüzüyle',
    renk: C.steel,
    bilesen: BolumKonum,
  },
  {
    id: 'mini',
    ad: 'Mini oyunlar',
    alt: 'Yedi görev · zorluk ayarlı, skor ve ödül hesabıyla',
    renk: C.olive,
    bilesen: BolumMiniOyunlar,
  },
  {
    id: 'sahne',
    ad: 'Sahneler',
    alt: 'Yemek, ders, tanıtım, serbest, anlatı · katalog ve atlama',
    renk: C.ekmek,
    bilesen: BolumSahneler,
  },
  {
    id: 'panel',
    ad: 'Paneller',
    alt: 'Kantin, dolap, muhabbet, cep, izmarit, ceza · on bir panel',
    renk: C.tea,
    bilesen: BolumPaneller,
  },
  {
    id: 'telefon',
    ad: 'Telefon',
    alt: '28 gün · rol seç, görüşmeyi oynat, hafızayı ve ilişkiyi izle',
    renk: C.brass,
    bilesen: BolumTelefon,
  },
  {
    id: 'ekran',
    ad: 'Ekranlar',
    alt: 'Menü, künye, çarşı, gün başı, gün sonu, kilit, içerik sonu',
    renk: C.canvasDim,
    bilesen: BolumEkranlar,
  },
  {
    id: 'sistem',
    ad: 'Sistemler',
    alt: 'Hava, stat eğrisi, nikotin, tokluk, uyku, kayıt',
    renk: C.steel,
    bilesen: BolumSistemler,
  },
  {
    id: 'final',
    ad: 'Finaller',
    alt: '13 final kartı · hangisi açılıyor, epilog ne yazıyor',
    renk: C.rust,
    bilesen: BolumFinaller,
  },
  {
    id: 'durum',
    ad: 'Durum',
    alt: 'Bütün sayılar · oku, değiştir, hazır senaryo yükle',
    renk: C.canvas,
    bilesen: BolumDurum,
  },
];

export function GelistirmeEkrani() {
  const g = useGame();
  const inset = useSafeAreaInsets();
  const [acik, setAcik] = useState<BolumId | null>(null);

  const bolum = BOLUMLER.find((b) => b.id === acik);
  const Icerik = bolum?.bilesen;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View
        style={{
          paddingTop: inset.top + SP.md,
          paddingHorizontal: SP.lg,
          paddingBottom: SP.md,
          backgroundColor: C.ink,
          borderBottomWidth: BORDER,
          borderBottomColor: C.brass,
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: SP.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <PixelText font="command" size="body" color={C.brass} tracking={3}>
            GELİŞTİRME KONTROL ALANI
          </PixelText>
          <PixelText size="micro" color={C.canvasFaint}>
            {bolum
              ? bolum.ad
              : `Gün ${g.gun} · blok ${g.blokIndex} · sahne ${g.sahneIndex} · ${g.para} TL`}
          </PixelText>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: SP.lg,
          paddingBottom: inset.bottom + SP.xxl,
          gap: SP.lg,
        }}
      >
        {Icerik ? (
          <Icerik />
        ) : (
          <>
            <Baslik
              ad="Ne açmak istiyorsun?"
              alt="Oyunun bütün mekanizmaları burada tek tek açılıyor. Bir yere atlarsan ekranın sağ üstündeki rozet seni buraya geri getirir."
            />
            <View style={{ gap: SP.sm }}>
              {BOLUMLER.map((b) => (
                <Kart
                  key={b.id}
                  ad={b.ad}
                  alt={b.alt}
                  renk={b.renk}
                  onPress={() => setAcik(b.id)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View
        style={{
          padding: SP.lg,
          paddingBottom: inset.bottom + SP.lg,
          backgroundColor: C.ink,
          borderTopWidth: BORDER,
          borderTopColor: C.line,
          gap: SP.sm,
        }}
      >
        {bolum ? (
          <PixelButton label="‹ Bölümlere dön" tur="sessiz" onPress={() => setAcik(null)} />
        ) : (
          <PixelButton label="Ana menüye dön" tur="sessiz" onPress={g.anaMenu} />
        )}
      </View>
    </View>
  );
}
