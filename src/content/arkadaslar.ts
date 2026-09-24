import type { ArkadasId } from '../engine/types';

export type ArkadasTanim = {
  id: ArkadasId;
  ad: string;
  meslek: string;
  tanim: string;
  /** İçen arkadaş senden dal ister; içmeyen hiç istemez. */
  sigaraIcer: boolean;
  /** Sigara isterken kullandığı cümleler. */
  sigaraLafi?: string[];
};

export const ARKADASLAR: ArkadasTanim[] = [
  {
    id: 'emre',
    ad: 'Emre',
    meslek: 'Müteahhit, 34',
    tanim: 'Sivilde otuz kişiye iş veriyor, burada battaniyeden korkuyor. Sürekli konuşur.',
    sigaraIcer: true,
    sigaraLafi: [
      '"Bir dal ver kardeşim, benimki kantinde bitti. Yarın iki katını veririm, söz."',
      '"Şu içtimadan sonra bir sigara olsa..." Sana bakıyor ama istemiyor gibi yapıyor.',
    ],
  },
  {
    id: 'tolga',
    ad: 'Tolga',
    meslek: 'Öğretmen, 29',
    tanim: 'Az konuşur, çok düşünür. Evde bir sorun var ve anlatmıyor.',
    sigaraIcer: false,
  },
  {
    id: 'serkan',
    ad: 'Serkan',
    meslek: 'Esnaf, 31',
    tanim: 'Koğuşun ekonomisini kurmuş. Her şeyin bir fiyatı var, her işin bir yolu.',
    sigaraIcer: true,
    sigaraLafi: [
      '"Bir dal borç. Defterime yazıyorum, biliyorsun ben hesabı unutmam."',
      '"Sende paket var. Bir tane ver, akşam nöbetini ayarlarım."',
    ],
  },
];

export const arkadas = (id: ArkadasId) => ARKADASLAR.find((a) => a.id === id)!;

export type Diyalog = {
  id: string;
  kim: ArkadasId;
  /** Bu diyalog en erken bu günde çıkabilir. */
  enErkenGun?: number;
  /** Bu dostluk seviyesinin altındaysa çıkmaz. */
  minDostluk?: number;
  metin: string;
  secenekler: {
    label: string;
    outcome: string;
    dostluk: number;
    moral?: number;
    disiplin?: number;
    para?: number;
  }[];
};

/**
 * Serbest zamanda koğuşta rastgele biri lafa giriyor. Aynı diyalog iki kez
 * çıkmıyor; havuz bitince muhabbet sahnesi de kapanıyor.
 */
export const DIYALOGLAR: Diyalog[] = [
  {
    id: 'd-emre-insaat',
    kim: 'emre',
    metin:
      '"Ben sivilde beton döküyorum kardeşim. Burada bana battaniyenin kenarını gösteriyorlar. Yirmi sekiz gün sonra hangimiz haklı çıkacak göreceğiz."',
    secenekler: [
      {
        label: 'Gül ve dinle',
        outcome: 'Emre yarım saat anlattı. Sen hiçbir şey söylemedin ve ikiniz de iyi hissettiniz.',
        dostluk: 8,
        moral: 6,
      },
      {
        label: '"Battaniye de bir iş, Emre."',
        outcome: 'Bir saniye durdu, sonra güldü. "Haklısın lan." Bu koğuşta böyle konuşulur.',
        dostluk: 12,
        moral: 8,
        disiplin: 2,
      },
      {
        label: 'Ranzana dön',
        outcome: 'Emre arkandan bakakaldı. Kimse bir şey demedi ama bir şey oldu.',
        dostluk: -8,
        moral: -2,
      },
    ],
  },
  {
    id: 'd-tolga-sessiz',
    kim: 'tolga',
    enErkenGun: 2,
    metin:
      'Tolga ranzasında oturuyor, elinde katlanmış bir kâğıt. Sana bakmadan konuşuyor: "Sen kaçıncı gündesin? Ben saymayı bıraktım."',
    secenekler: [
      {
        label: '"Ben de bıraktım." (yalan)',
        outcome: 'Başını salladı. Yalan olduğunu ikiniz de biliyordunuz ama iyi bir yalandı.',
        dostluk: 10,
        moral: 5,
      },
      {
        label: 'Yanına otur, konuşma',
        outcome: 'On dakika sessiz oturdunuz. Kalkarken "sağ ol" dedi.',
        dostluk: 14,
        moral: 7,
      },
      {
        label: '"Ne o kâğıt?"',
        outcome: 'Kâğıdı cebine koydu. "Hiç." Sordun diye kapandı.',
        dostluk: -5,
      },
    ],
  },
  {
    id: 'd-serkan-teklif',
    kim: 'serkan',
    metin:
      '"Bak sana bir şey diyeyim. Ben yarınki nöbeti alırım, sen bana iki paket çay borçlanırsın. Kimse duymaz, defterde de görünmez."',
    secenekler: [
      {
        label: 'Kabul et',
        outcome: 'Serkan not aldı. Bu adam gerçekten defter tutuyor.',
        dostluk: 10,
        moral: 6,
        para: -90,
        disiplin: -4,
      },
      {
        label: '"Kendi nöbetimi kendim tutarım."',
        outcome: 'Omuz silkti. "Herkes böyle başlar." Sana biraz daha saygı duyduğu belli.',
        dostluk: 4,
        disiplin: 6,
      },
    ],
  },
  {
    id: 'd-emre-ev',
    kim: 'emre',
    enErkenGun: 3,
    minDostluk: 20,
    metin:
      '"Kızım üç yaşında. Beni görmeden yatıyor artık. Karım videoya alıyor, ben de burada telefonda izliyorum." Sesi normalden alçak.',
    secenekler: [
      {
        label: '"Az kaldı Emre. Beraber sayıyoruz."',
        outcome: 'Başını salladı, gözlerini sildi, sonra kalkıp çay koydu. Bahsi kapattınız.',
        dostluk: 12,
        moral: 4,
      },
      {
        label: 'Kendi telefonunu uzat, "ara" de',
        outcome: 'Aradı. Üç dakika. Döndüğünde yüzü değişmişti. Bunu unutmayacak.',
        dostluk: 20,
        moral: 10,
      },
    ],
  },
  {
    id: 'd-serkan-kantin',
    kim: 'serkan',
    enErkenGun: 2,
    metin:
      '"Kantinde bugün stok geldi. Yarın fiyat artıyor, bugün alan kazanır. Sana söylüyorum çünkü sen bana borçlu değilsin, ilginç geliyor."',
    secenekler: [
      {
        label: '"Sağ ol, bakarım."',
        outcome: 'Bilgi bedava geldi. Serkan bunu da bir yere yazdı herhalde.',
        dostluk: 6,
      },
      {
        label: '"Sen bu işten ne kazanıyorsun?"',
        outcome: '"Hiçbir şey. Bazen." Güldü. Bu cevabın doğru olma ihtimali düşük.',
        dostluk: 8,
        moral: 4,
      },
    ],
  },
  {
    id: 'd-tolga-kitap',
    kim: 'tolga',
    enErkenGun: 2,
    metin:
      'Tolga elindeki kitaptan başını kaldırdı: "Burada okuyan tek kişi benim sanıyordum. Ne okuyorsun?"',
    secenekler: [
      {
        label: 'Kitabını göster, konuş',
        outcome: 'Yarım saat kitap konuştunuz. İlk defa uzun konuştu.',
        dostluk: 15,
        moral: 8,
      },
      {
        label: '"Okumuyorum, uyuyorum."',
        outcome: 'Güldü. "En doğrusu da o." Kitabına döndü.',
        dostluk: 3,
        moral: 3,
      },
    ],
  },
  {
    id: 'd-kogus-memleket',
    kim: 'emre',
    enErkenGun: 2,
    metin:
      'Koğuşta memleket muhabbeti başladı. On kişi, on ayrı şehir, herkes kendi memleketinin yemeğini övüyor. Emre sana dönüyor: "Sen nerelisin?"',
    secenekler: [
      {
        label: 'Muhabbete gir',
        outcome: 'Gece yarısına kadar güldünüz. Yarın sabah zor olacak ama değdi.',
        dostluk: 10,
        moral: 12,
        disiplin: -3,
      },
      {
        label: 'Kısa kes, erken yat',
        outcome: 'Yarın dinlenmiş kalkacaksın. Koğuş sensiz güldü.',
        dostluk: -4,
        moral: -3,
        disiplin: 3,
      },
    ],
  },
];

export const SIGARA_ICENLER = ARKADASLAR.filter((a) => a.sigaraIcer).map((a) => a.id);

/**
 * Akşamları herkes aynı yerde durmuyor: bir kısmı oturma alanında bankta,
 * kalanı avluda ayakta. Kimin nerede olduğu günden türetiliyor, yani
 * rastgele görünüyor ama kayıttan dönünce değişmiyor.
 */
export function oturmaAlanindakiler(gun: number): ArkadasId[] {
  const bas = (gun - 1) % ARKADASLAR.length;
  // Her akşam biri, ikinci günden itibaren bazen ikisi bankta oluyor.
  const sayi = gun % 3 === 0 ? 2 : 1;
  return Array.from({ length: sayi }, (_, i) => ARKADASLAR[(bas + i) % ARKADASLAR.length].id);
}

export function avludakiler(gun: number): ArkadasId[] {
  const oturan = oturmaAlanindakiler(gun);
  return ARKADASLAR.filter((a) => !oturan.includes(a.id)).map((a) => a.id);
}

export function uygunDiyaloglar(gun: number, dostluk: Record<ArkadasId, number>, gorulmus: string[]) {
  return DIYALOGLAR.filter(
    (d) =>
      !gorulmus.includes(d.id) &&
      gun >= (d.enErkenGun ?? 1) &&
      (dostluk[d.kim] ?? 0) >= (d.minDostluk ?? -100),
  );
}
