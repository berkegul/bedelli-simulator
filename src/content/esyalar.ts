import type { EsyaId, Effect, Envanter, Kalite } from '../engine/types';
import type { SpriteKey } from '../art';

export type Dukkan = 'hazirlik' | 'kantin';

export type EsyaTanim = {
  id: EsyaId;
  ad: string;
  /** Kutunun içinden ne çıkıyor — çarşı listesinde alt satır olarak görünür. */
  icerik?: string;
  aciklama: string;
  /** Standart kalitenin fiyatı; kademeler bunun katı. */
  fiyat: number;
  sprite: SpriteKey;
  nerede: Dukkan[];
  /** Üç kalitede satılıyor mu. Kantin ürünleri tek kalitedir. */
  kademeli?: boolean;
  tuketilir?: boolean;
  sigaraya?: boolean;
  kullanimEtkisi?: Effect;
  maxAdet?: number;
  /** Bir satın almada envantere kaç birim girer (sigara: paket = 20 dal). */
  birimAdet?: number;
  /** Sayım birimi; boşsa "adet". */
  birim?: string;
  /**
   * Her gün başında uygulanan pasif etki (standart kalite için).
   * Kalite çarpanı bunun üstüne biner. Eşya hiç yoksa `yokluk` uygulanır.
   */
  gunluk?: Effect;
  yokluk?: Effect;
};

export const KALITE_ADI: Record<Kalite, string> = {
  ekonomik: 'Ekonomik',
  standart: 'Standart',
  kaliteli: 'Kaliteli',
};

export const KALITE_FIYAT: Record<Kalite, number> = {
  ekonomik: 0.6,
  standart: 1,
  kaliteli: 1.75,
};

/** Ucuz olan işi görür ama yıpratır; kaliteli olan 28 gün boyunca geri öder. */
export const KALITE_FAYDA: Record<Kalite, number> = {
  ekonomik: -0.6,
  standart: 1,
  kaliteli: 1.8,
};

export const KALITE_NOTU: Record<Kalite, string> = {
  ekonomik: 'Ucuz. İlk hafta idare eder, sonrası senin problemin.',
  standart: 'Ortalama. Herkesin aldığı.',
  kaliteli: 'Pahalı ama 28 gün boyunca fark ettirir.',
};

export const ESYALAR: EsyaTanim[] = [
  {
    id: 'askerSeti',
    ad: 'Asker iç çamaşır seti',
    icerik: '12 fanila, 12 boxer, 12 çift çorap',
    aciklama:
      'Çamaşır yıkama sırası haftada bir. On iki takım, tam da bu yüzden. Ucuzu terletir ve pişik yapar.',
    fiyat: 900,
    sprite: 'tisort',
    nerede: ['hazirlik'],
    kademeli: true,
    maxAdet: 1,
    gunluk: { kondisyon: 2, moral: 2 },
    yokluk: { kondisyon: -4, moral: -3 },
  },
  {
    id: 'botBakim',
    ad: 'Bot bakım seti',
    icerik: 'Bot boyası, parlatıcı sünger, vatka, bot kilidi',
    aciklama:
      'Postal denetimi her sabah var. Ucuz boya çatlar, sünger dağılır ve Onbaşı bunu görür.',
    fiyat: 260,
    sprite: 'botBoyasi',
    nerede: ['hazirlik', 'kantin'],
    kademeli: true,
    maxAdet: 2,
    gunluk: { disiplin: 3 },
    yokluk: { disiplin: -3 },
  },
  {
    id: 'tabanlik',
    ad: 'Tabanlık',
    icerik: '1 çift jel tabanlık',
    aciklama:
      'Günde dört saat yürüyorsun ve postal senin ayağına göre üretilmedi. Bu listede en çok işe yarayan tek parça.',
    fiyat: 220,
    sprite: 'tabanlik',
    nerede: ['hazirlik'],
    kademeli: true,
    maxAdet: 1,
    gunluk: { kondisyon: 4 },
    yokluk: { kondisyon: -3 },
  },
  {
    id: 'pisikPudrasi',
    ad: 'Ayak ve pişik pudrası',
    aciklama:
      'Postal, terleyen ayak ve kuruma fırsatı bulamayan çorap. Bunu almayan üçüncü günde öğreniyor.',
    fiyat: 90,
    sprite: 'pudra',
    nerede: ['hazirlik', 'kantin'],
    kademeli: true,
    maxAdet: 2,
    gunluk: { kondisyon: 2 },
    yokluk: { kondisyon: -2, moral: -1 },
  },
  {
    id: 'trasCantasi',
    ad: 'Tıraş çantası',
    icerik: 'Jilet, sabun kutusu, tıraş malzemesi, peçete',
    aciklama:
      'Her sabah tıraş zorunlu. Kör jilet yüzünü keser, kesik de içtimada görünür.',
    fiyat: 240,
    sprite: 'trasCantasi',
    nerede: ['hazirlik', 'kantin'],
    kademeli: true,
    maxAdet: 1,
    gunluk: { disiplin: 2, moral: 1 },
    yokluk: { disiplin: -3, moral: -2 },
  },
  {
    id: 'kogusDuzen',
    ad: 'Koğuş düzen seti',
    icerik: 'Dikiş seti, 2 metal askı, temiz ve kirli çamaşır torbası',
    aciklama:
      'Dolap denetimi askıyı ve torbayı ayrı ayrı sayar. Kopan düğmeyi de kendin dikeceksin.',
    fiyat: 180,
    sprite: 'camasirTorbasi',
    nerede: ['hazirlik', 'kantin'],
    kademeli: true,
    maxAdet: 1,
    gunluk: { disiplin: 3 },
    yokluk: { disiplin: -3 },
  },
  {
    id: 'dolapKilidi',
    ad: 'Dolap kilidi',
    aciklama:
      'Yirmi sekiz kişilik koğuşta açık dolap, ortak dolaptır. Kaybolan eşya geri gelmez.',
    fiyat: 120,
    sprite: 'kilit',
    nerede: ['hazirlik', 'kantin'],
    kademeli: true,
    maxAdet: 1,
    gunluk: { moral: 2 },
    yokluk: { moral: -3, para: -8 },
  },
  {
    id: 'askerCuzdani',
    ad: 'Boyuna asmalı asker cüzdanı',
    aciklama:
      'Künye, para ve izin kâğıdı hep üstünde durur. Cebe koyduğun her şey eğitimde düşer.',
    fiyat: 110,
    sprite: 'cuzdan',
    nerede: ['hazirlik'],
    kademeli: true,
    maxAdet: 1,
    gunluk: { disiplin: 1 },
    yokluk: { para: -6 },
  },
  {
    id: 'kamerasizTelefon',
    ad: 'Kamerasız telefon',
    aciklama:
      'Kışlaya kameralı telefon giremez. Dokunmatik ama kamerasız modeller tam bunun için satılıyor. Olmazsa ankesör kuyruğundasın.',
    fiyat: 850,
    sprite: 'telefon',
    nerede: ['hazirlik'],
    kademeli: true,
    maxAdet: 1,
  },

  // ── Kantin ─────────────────────────────────────────────────────────
  {
    id: 'kontor',
    ad: 'Kontör',
    aciklama: 'Konuşma kredisi. Her arama bir kontör yakar.',
    fiyat: 60,
    sprite: 'kontor',
    nerede: ['hazirlik', 'kantin'],
    tuketilir: true,
    maxAdet: 20,
  },
  {
    id: 'kitap',
    ad: 'Kitap',
    aciklama: 'Serbest zaman iki saat ve telefon her zaman çekmiyor.',
    fiyat: 110,
    sprite: 'kitap',
    nerede: ['hazirlik', 'kantin'],
    maxAdet: 4,
    kullanimEtkisi: { moral: 9, enerji: -4 },
  },
  {
    id: 'defterKalem',
    ad: 'Defter ve kalem',
    aciklama: 'Gün saymak, mektup yazmak, aklında kalanı bir yere koymak için.',
    fiyat: 45,
    sprite: 'defter',
    nerede: ['hazirlik', 'kantin'],
    maxAdet: 2,
    kullanimEtkisi: { moral: 6, disiplin: 2 },
  },
  {
    id: 'tesbih',
    ad: 'Tesbih',
    aciklama: 'Elin boş durmasın. Koğuşta herkeste bir tane var.',
    fiyat: 35,
    sprite: 'tesbih',
    nerede: ['hazirlik', 'kantin'],
    maxAdet: 1,
    kullanimEtkisi: { moral: 4 },
  },
  {
    id: 'sigara',
    ad: 'Sigara (paket)',
    icerik: '20 dal',
    aciklama:
      'Kantinin en çok satan ürünü. İçmesen de işine yarar: koğuşta dal dağıtmak dostluğun en hızlı yolu.',
    fiyat: 95,
    sprite: 'sigara',
    nerede: ['hazirlik', 'kantin'],
    tuketilir: true,
    birimAdet: 20,
    birim: 'dal',
    maxAdet: 120,
    kullanimEtkisi: { moral: 8, nikotin: -60, kondisyon: -3 },
  },
  {
    id: 'cakmak',
    ad: 'Çakmak',
    aciklama: 'Koğuşta sürekli kaybolan tek eşya.',
    fiyat: 20,
    sprite: 'cakmak',
    nerede: ['hazirlik', 'kantin'],
    sigaraya: true,
    maxAdet: 3,
  },
  {
    id: 'atistirmalik',
    ad: 'Bisküvi ve kuruyemiş',
    aciklama: 'Öğün araları uzun. Dolapta bir şey olması iyidir.',
    fiyat: 40,
    sprite: 'atistirmalik',
    nerede: ['hazirlik', 'kantin'],
    tuketilir: true,
    maxAdet: 12,
    kullanimEtkisi: { tokluk: 22, moral: 3 },
  },
  {
    id: 'enerjiIcecegi',
    ad: 'Enerji içeceği',
    aciklama: 'Nöbet gecesi için. Ertesi gün bedelini ödersin.',
    fiyat: 50,
    sprite: 'enerjiIcecegi',
    nerede: ['kantin'],
    tuketilir: true,
    maxAdet: 8,
    kullanimEtkisi: { enerji: 26, kondisyon: -4, tokluk: 4 },
  },
];

export const esya = (id: EsyaId) => ESYALAR.find((e) => e.id === id)!;

export const fiyat = (t: EsyaTanim, kalite: Kalite) =>
  t.kademeli ? Math.round((t.fiyat * KALITE_FIYAT[kalite]) / 5) * 5 : t.fiyat;

export function dukkanKatalogu(dukkan: Dukkan, sigaraIciyor: boolean) {
  return ESYALAR.filter((e) => e.nerede.includes(dukkan) && (!e.sigaraya || sigaraIciyor));
}

export function kullanilabilirler(envanter: Envanter) {
  return ESYALAR.filter((e) => e.kullanimEtkisi && (envanter[e.id]?.adet ?? 0) > 0);
}

const olcekle = (etki: Effect, carpan: number): Effect => {
  const cikti: Effect = {};
  for (const [k, v] of Object.entries(etki)) {
    if (typeof v === 'number') (cikti as Record<string, number>)[k] = Math.round(v * carpan);
  }
  return cikti;
};

/**
 * Her gün başında uygulanan dolap etkisi: iyi hazırlanan kazanır, eksik
 * gelen her sabah biraz daha kaybeder. Çarşıdaki kararın 28 gün süren
 * karşılığı burada.
 */
export function gunlukEsyaEtkisi(envanter: Envanter): { etki: Effect; satirlar: string[] } {
  const toplam: Record<string, number> = {};
  const satirlar: string[] = [];

  for (const t of ESYALAR) {
    const kayit = envanter[t.id];
    const kaynak = kayit ? t.gunluk : t.yokluk;
    if (!kaynak) continue;

    const carpan = kayit ? KALITE_FAYDA[kayit.kalite] : 1;
    const etki = olcekle(kaynak, carpan);
    const anlamli = Object.values(etki).some((v) => v !== 0);
    if (!anlamli) continue;

    for (const [k, v] of Object.entries(etki)) toplam[k] = (toplam[k] ?? 0) + (v as number);
    satirlar.push(
      kayit
        ? `${t.ad} · ${KALITE_ADI[kayit.kalite].toLocaleLowerCase('tr-TR')}`
        : `${t.ad} yok`,
    );
  }

  return { etki: toplam as Effect, satirlar };
}
