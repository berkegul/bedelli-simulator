import React from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { GUNLER } from '../../content';
import { BEDAVA_GUN } from '../../monetization/entitlements';
import { type Ekran } from '../../store/gameStore';
import { useSecili } from '../../store/secici';
import { PixelText } from '../../ui/PixelText';
import { Baslik, Kart, Kutu } from '../parcalar';

type Kayit = { id: Ekran; ad: string; alt: string; hazirla?: () => Partial<Record<string, unknown>> };

/**
 * Ekranlar: uygulamanın tepe seviyedeki sekiz durağı. Hepsi `ekran`
 * alanına bakıyor; buradan doğrudan o duruma atlanıyor.
 */
export function BolumEkranlar() {
  const g = useSecili('blokIndex', 'ekran', 'gelistirmeAtla', 'gun', 'sahneIndex');

  const EKRANLAR: Kayit[] = [
    { id: 'menu', ad: 'Ana menü', alt: 'Çentik takvim, devam et, baştan başla' },
    { id: 'profil', ad: 'Künye', alt: 'Ad, sigara, rehber kurulumu' },
    { id: 'carsi', ad: 'Çarşı', alt: 'Hazırlık alışverişi · kalite kademeleri' },
    { id: 'gunBasi', ad: 'Gün başı', alt: 'Gün kartı, dolap özeti, epigraf' },
    { id: 'oyun', ad: 'Oyun', alt: 'Asıl döngü · blok ve sahne akışı' },
    { id: 'gunSonu', ad: 'Gün sonu', alt: 'Günün notu, puan, çentik' },
    { id: 'kilit', ad: 'Kilit', alt: `${BEDAVA_GUN + 1}. günde çıkan satın alma duvarı` },
    { id: 'icerikSonu', ad: 'İçerik sonu', alt: `Yazılı ${GUNLER.length} gün bitince` },
  ];

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Bölüm 06"
        ad="Ekranlar"
        alt="Tepe seviyedeki durak. Atladığın yerden geri dönmek için sağ üstteki rozet."
      />

      <Kutu baslik="Şu an" renk={C.brass}>
        <PixelText size="small" color={C.canvasDim}>
          {`ekran: ${g.ekran} · gün ${g.gun} · blok ${g.blokIndex} · sahne ${g.sahneIndex}`}
        </PixelText>
      </Kutu>

      <View style={{ gap: SP.sm }}>
        {EKRANLAR.map((e) => (
          <Kart
            key={e.id}
            ad={e.ad}
            alt={e.alt}
            saglik={e.id}
            renk={C.canvasDim}
            onPress={() => {
              if (e.id === 'kilit') {
                g.gelistirmeAtla({ ekran: 'kilit', gun: BEDAVA_GUN + 1 });
              } else if (e.id === 'gunSonu') {
                g.gelistirmeAtla({ ekran: 'gunSonu' });
              } else if (e.id === 'icerikSonu') {
                g.gelistirmeAtla({ ekran: 'icerikSonu', gun: GUNLER.length + 1 });
              } else {
                g.gelistirmeAtla({ ekran: e.id });
              }
            }}
          />
        ))}
      </View>
    </View>
  );
}
