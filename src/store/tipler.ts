import { type Diyalog } from '../content/arkadaslar';
import type { Yemek } from '../content/menu';
import type {
  DolapDuzeni,
  Kusur,
  ArkadasId,
  Choice,
  Envanter,
  EsyaId,
  KayitRolu,
  Kalite,
  Profil,
  RehberKisi,
  Rol,
  Stats,
} from '../engine/types';
import { type Hafiza } from '../content/telefon';

export type Ekran =
  | 'acilis'
  | 'menu'
  | 'profil'
  | 'carsi'
  | 'gunBasi'
  | 'oyun'
  | 'gunSonu'
  | 'kilit'
  | 'icerikSonu'
  | 'gelistirme';

/** Oyun ekranının üstüne açılan panel — sahne akışını bozmadan geri dönülür. */
export type Panel =
  | null
  | 'kantin'
  | 'dolap'
  | 'rehber'
  | 'muhabbet'
  | 'sigaraIstegi'
  | 'ant41'
  | 'oturma'
  | 'cep'
  | 'izmarit'
  | 'izmaritCezasi'
  | 'gorusme';

/**
 * Süren görüşmenin imleci. Etkiler anında uygulanmıyor, burada birikiyor:
 * oyuncu konuşurken üstteki çubukların oynamasına bakıp seçim yapmasın diye.
 */
export type AktifGorusme = {
  kisiId: string;
  gorusmeId: string;
  /** Şu an konuşan; 'ev' kaydında görüşme ortasında değişebilir. */
  rol: Rol;
  replikId: string;
  /** Transkript: baştan beri söylenenler. */
  gecmis: { kim: string; metin: string; ben?: boolean }[];
  ankesor: boolean;
  kalanRaunt: number;
  birikenIliski: Partial<Record<Rol, number>>;
  birikenGerilim: Partial<Record<Rol, number>>;
  birikenMoral: number;
  birikenEnerji: number;
  birikenOzlem: number;
  isaretler: { ad: string; deger: string }[];
  /** Karşı taraf aradıysa kontör yakmıyor ve açılış farklı. */
  gelen: boolean;
  /** Görüşme bittiğinde dolan kapanış cümlesi; dolunca seçenek kalmaz. */
  kapanis: string | null;
};

export type Sonuc = {
  metin: string;
  delta: Partial<Stats> & { para?: number };
  /**
   * Kart kapanınca sahne ilerlesin mi? Sahnenin kendi sonucu ilerletir;
   * cepten yapılan iş (sigara, telefon, eşya) ilerletmez — yoksa sigara
   * yakmak o anki görevi atlıyordu.
   */
  ilerletme?: boolean;
  /**
   * Açılışta kurtarılan bir olayın kartı (yarım kalan görüşme). "Devam et"
   * eski kartları temizler; bu kart oyuncu görene kadar kalır.
   */
  acilistan?: boolean;
};

export type Store = {
  ekran: Ekran;
  panel: Panel;
  hazir: boolean;
  kayitVar: boolean;

  profil: Profil;
  hazirlikBitti: boolean;
  gun: number;
  blokIndex: number;
  sahneIndex: number;
  /** Gün içindeki saat, gece yarısından beri dakika. Üst şeritte akar. */
  saat: number;
  stats: Stats;
  para: number;
  envanter: Envanter;
  /** İlk gün dolaba ne nereye kondu. Dördüncü gün denetimi buna bakıyor. */
  dolapDuzeni: DolapDuzeni | null;
  /** Sabah ya da gece rutininden kalan, içtimada/yoklamada bakılacak işler. */
  bekleyenKusurlar: Kusur[];
  dostluk: Record<ArkadasId, number>;
  gorulmusDiyaloglar: string[];
  rehber: RehberKisi[];
  nikotin: number;
  bitenGunler: { gun: number; not: string; puan: number }[];

  sonuc: Sonuc | null;
  miniAktif: boolean;
  /** Gün başında gösterilen dolap özeti. */
  dolapOzeti: string[];
  aktifDiyalog: Diyalog | null;
  /** Şu an senden sigara isteyen arkadaş. */
  aktifIstek: ArkadasId | null;
  /** Aynı gün aynı kişi ikinci kez istemesin. */
  bugunIsteyenler: ArkadasId[];
  /** Gölgede dinlenme günde bir kez. */
  bugunDinlenildi: boolean;
  /** Cepte biriken izmarit; yere atmak yerine saklayınca artıyor. */
  cepteIzmarit: number;
  /** Süren telefon görüşmesi. */
  aktifGorusme: AktifGorusme | null;
  /** Oynanmış görüşme id'leri; omurga beat'leri tekrar etmesin diye. */
  gorulmusGorusmeler: string[];
  /** Rol başına ilişki (0-100) ve gerilim (0-100). */
  iliski: Record<Rol, number>;
  gerilim: Record<Rol, number>;
  /** Ev özlemi; gün sonu ve final kartları buna bakıyor. */
  ozlem: number;
  /** Oyuncunun söyledikleri ve başına gelenler — işaret + konduğu gün. */
  hafiza: Hafiza;
  /** Rol başına en son arandığı gün. */
  sonArama: Record<Rol, number>;
  /** Oyuncunun sevgilisi var mı — kurulumda soruluyor. */
  sevgiliVar: boolean;
  /** Bugün seni arayan; serbest blokta açılabilir. */
  gelenArama: { rol: Rol; kisiId: string } | null;
  /** Telefonun yokken gelen aramalar: nöbetçi haber veriyor, sen geri arıyorsun. */
  bekleyenArama: Rol[];
  /**
   * Geliştirme alanından bir yere atlandı mı. Doğruysa ekranın üstünde
   * geri dönüş rozeti duruyor; oyunun kendi akışına dokunmuyor.
   */
  gelistirmeDonus: boolean;

  ilkYukleme: () => Promise<void>;
  yeniOyun: () => Promise<void>;
  profilKaydet: (ad: string, sigaraIciyor: boolean) => void;
  kisiEkle: (ad: string, yakinlik: string, rol: KayitRolu) => void;
  sevgiliVarMi: (v: boolean) => void;
  gorusmeCevapla: (index: number) => void;
  gorusmeKapat: () => void;
  gelenAramayiAc: () => void;
  gelenAramayiGecistir: () => void;
  kisiSil: (id: string) => void;
  carsiyiBitir: () => void;
  devamEt: () => void;
  anaMenu: () => void;
  gelistirmeAc: () => void;
  gelistirmeyeDon: () => void;
  /** Geliştirme alanından oyuna atlama; dönüş rozetini de kuruyor. */
  gelistirmeAtla: (p: Partial<Store>) => void;
  gunuBaslat: () => void;
  ileri: () => void;
  secimYap: (c: Choice) => void;
  /** Dolap yerleşimi bitti: düzen kayda geçer, seçimin etkisi uygulanır. */
  dolapKapat: (c: Choice, duzen: DolapDuzeni) => void;
  /** Denetim bitti: kusurlar ve varsa şınav skoru etkiye çevrilir, liste boşalır. */
  denetimBitir: (cezaSkoru: number | null) => void;
  miniBaslat: () => void;
  miniBitir: (score: number) => void;
  sonucuKapat: () => void;
  sonrakiGun: () => void;
  sifirla: () => Promise<void>;

  panelAc: (p: Panel) => void;
  satinAl: (id: EsyaId, kalite: Kalite) => boolean;
  esyaKullan: (id: EsyaId) => void;
  yemekYe: (secilen: Yemek[]) => void;
  kisiAra: (id: string) => void;
  muhabbetBaslat: () => void;
  diyalogSec: (index: number) => void;
  arkadasaGit: (id: ArkadasId) => void;
  sigaraVer: (ver: boolean) => void;
  golgedeDinlen: () => void;
  yoldaVar: () => void;
  sigaraIc: () => void;
  izmaritKarar: (yereAt: boolean) => void;
  izmaritCezasiBitir: () => void;
  izmaritAt: () => void;
};

/** Dilimlere ve yardımcılara verilen store erişimi. */
export type StoreSet = (p: Partial<Store>) => void;
export type StoreGet = () => Store;
