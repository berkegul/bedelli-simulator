import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { GUNLER } from '../../content';
import { arkadas } from '../../content/arkadaslar';
import { useGame, type Panel, type Store } from '../../store/gameStore';
import { PixelButton } from '../../ui/PixelButton';
import { PixelText } from '../../ui/PixelText';
import {
  Ant41Paneli,
  CepPaneli,
  DolapPaneli,
  GorusmePaneli,
  IzmaritCezasiPaneli,
  IzmaritPaneli,
  KantinPaneli,
  MuhabbetPaneli,
  OturmaAlaniPaneli,
  RehberPaneli,
  SigaraIstegiPaneli,
} from '../../screens/panel';
import { Baslik, Kart, Kutu } from '../parcalar';

type Kayit = {
  id: Exclude<Panel, null>;
  ad: string;
  alt: string;
  /** Panel boş açılmasın diye önce kurulması gereken durum. */
  hazirla?: (g: Store) => void;
  uyari?: string;
};

const PANELLER: Kayit[] = [
  { id: 'kantin', ad: 'Kantin', alt: 'Kontör, sigara, atıştırmalık · para harcanan tek yer' },
  { id: 'dolap', ad: 'Dolap', alt: 'Envanter, eşya kullanımı, ANT-41 kâğıdı' },
  { id: 'rehber', ad: 'Rehber', alt: 'Kişiler, arama izni, kontör durumu' },
  {
    id: 'muhabbet',
    ad: 'Muhabbet',
    alt: 'Koğuş diyalogları · dostluk puanına göre havuz',
    hazirla: (g) => g.muhabbetBaslat(),
    uyari: 'Uygun diyalog yoksa panel boş açılır; dostluğu yükseltip dene.',
  },
  {
    id: 'sigaraIstegi',
    ad: 'Sigara isteği',
    alt: 'Arkadaş senden sigara istiyor · ver / verme',
    hazirla: (g) => g.gelistirmeAtla({ aktifIstek: 'emre', panel: 'sigaraIstegi' }),
  },
  { id: 'ant41', ad: 'ANT-41', alt: 'Ders metni, istenildiği zaman okunur' },
  { id: 'oturma', ad: 'Oturma alanı', alt: 'Ağacın altı · gölgede dinlenme, günde bir kez' },
  { id: 'cep', ad: 'Cep', alt: 'Üstünde taşıdıkların · sigara, telefon, izmarit' },
  {
    id: 'izmarit',
    ad: 'İzmarit',
    alt: 'Yere at / cebe koy kararı',
    hazirla: (g) => g.gelistirmeAtla({ cepteIzmarit: 3, panel: 'izmarit' }),
  },
  {
    id: 'izmaritCezasi',
    ad: 'İzmarit cezası',
    alt: 'Yakalandın · ceza mini oyunu buradan açılıyor',
  },
  {
    id: 'gorusme',
    ad: 'Görüşme',
    alt: 'Telefon transkripti · Telefon bölümünden başlatılıyor',
    uyari: 'Aktif görüşme olmadan boş açılır. Telefon bölümünü kullan.',
  },
];

/**
 * Paneller: sahne akışını durdurmadan üstüne açılan on bir katman.
 * Burada hepsi tek tıkla açılıyor; bağlam isteyenlerin (sigara isteği,
 * izmarit, muhabbet) durumu önce kuruluyor.
 */
export function BolumPaneller() {
  const g = useGame();
  const [acik, setAcik] = useState<Exclude<Panel, null> | null>(null);

  const kapat = () => {
    setAcik(null);
    g.gelistirmeyeDon();
  };

  if (acik) {
    return (
      <View style={{ flex: 1 }}>
        {acik === 'kantin' && <KantinPaneli />}
        {acik === 'dolap' && <DolapPaneli />}
        {acik === 'rehber' && <RehberPaneli />}
        {acik === 'muhabbet' && <MuhabbetPaneli />}
        {acik === 'sigaraIstegi' && <SigaraIstegiPaneli />}
        {acik === 'ant41' && <Ant41Paneli />}
        {acik === 'oturma' && <OturmaAlaniPaneli />}
        {acik === 'cep' && <CepPaneli />}
        {acik === 'izmarit' && <IzmaritPaneli />}
        {acik === 'izmaritCezasi' && <IzmaritCezasiPaneli />}
        {acik === 'gorusme' && <GorusmePaneli />}
      </View>
    );
  }

  const serbestBlok = GUNLER[1]?.blocks.findIndex((b) => b.id.endsWith('-serbest')) ?? 0;

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Bölüm 04"
        ad="Paneller"
        alt="Panel açıkken sahne ilerlemiyor; oyuncu işini bitirip aynı yere dönüyor. Bazı panellerin izni bloğa bağlı — telefon ve sigara yalnızca serbest zamanda."
      />

      <Kutu baslik="Bağlam" renk={C.brass}>
        <PixelText size="small" color={C.canvasDim} line="snug">
          {`Şu an: gün ${g.gun}, blok ${g.blokIndex}. İzin kuralları bu bloğa bakıyor.`}
        </PixelText>
        <PixelButton
          label="Serbest zaman bloğuna geç (izinler açılsın)"
          tur="sessiz"
          onPress={() =>
            g.gelistirmeAtla({
              gun: 2,
              blokIndex: Math.max(0, serbestBlok),
              sahneIndex: 0,
              saat: 19 * 60,
              ekran: 'gelistirme',
            })
          }
        />
      </Kutu>

      <View style={{ gap: SP.sm }}>
        {PANELLER.map((p) => (
          <Kart
            key={p.id}
            ad={p.ad}
            alt={p.uyari ? `${p.alt}\n⚠ ${p.uyari}` : p.alt}
            saglik={p.id}
            renk={C.tea}
            onPress={() => {
              if (p.hazirla) p.hazirla(g);
              else g.gelistirmeAtla({ panel: p.id, ekran: 'gelistirme' });
              setAcik(p.id);
            }}
          />
        ))}
      </View>

      <Kutu baslik="Not" renk={C.line}>
        <PixelText size="micro" color={C.canvasFaint} line="snug">
          {`Muhabbet havuzu dostluğa bakıyor — şu an emre ${g.dostluk.emre}, tolga ${g.dostluk.tolga}, serkan ${g.dostluk.serkan}. Diyalog çıkmazsa Durum bölümünden yükselt.`}
        </PixelText>
        <PixelText size="micro" color={C.canvasFaint} line="snug">
          {`İzmarit cezası ${arkadas('emre').ad} gibi arkadaş verisine değil, cepteki izmarit sayısına bakıyor: ${g.cepteIzmarit}.`}
        </PixelText>
      </Kutu>

      <PixelButton label="Panelleri kapat" tur="sessiz" onPress={kapat} />
    </View>
  );
}
