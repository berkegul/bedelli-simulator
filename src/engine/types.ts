import type { SpriteKey } from '../art';
import type { Bakis } from './yuruyus';
import type { Kosul } from '../content/telefon/tipler';

export type StatKey = 'kondisyon' | 'disiplin' | 'moral' | 'enerji' | 'tokluk';

export type Stats = Record<StatKey, number>;

export const STAT_META: Record<StatKey, { ad: string; ipucu: string }> = {
  kondisyon: { ad: 'Kondisyon', ipucu: 'Bedenin ne kadar dayanıyor' },
  disiplin: { ad: 'Disiplin', ipucu: 'Komutanların gözündeki yerin' },
  moral: { ad: 'Moral', ipucu: 'Kafanın ne kadar iyi olduğu' },
  enerji: { ad: 'Enerji', ipucu: 'Gün içinde tükenir, uykuda dolar' },
  tokluk: { ad: 'Tokluk', ipucu: 'Saat geçtikçe azalır, yemekte dolar' },
};

/** Bir seçimin ya da mini oyun sonucunun oyuncuya yansıması. */
export type Effect = Partial<Stats> & {
  /** Kantin parası, ₺ */
  para?: number;
  /** Sigara içme isteğine etki — pozitif değer krizi artırır. */
  nikotin?: number;
  /** Adı geçen arkadaşla ilişki puanı. */
  dostluk?: { kim: ArkadasId; puan: number };
  /** Envantere eklenen/eksilen eşya. */
  esya?: { id: EsyaId; adet: number };
  /** Rehberdeki birini aramak — kontör harcar, moral verir. */
  arama?: boolean;
};

export type Choice = {
  id: string;
  label: string;
  effect: Effect;
  /** Seçimden sonra gösterilen kısa sonuç cümlesi. */
  outcome: string;
  /** Seçenek yalnızca bu eşya çantadayken görünür. */
  gerekliEsya?: EsyaId;
  /** Seçenek yalnızca oyuncu sigara içiyorsa görünür. */
  sadeceSigaraIcen?: boolean;
};

export type ArkadasId = 'emre' | 'tolga' | 'serkan';

export type EsyaId =
  // Kışla öncesi çarşıdan alınan hazırlık malzemeleri
  | 'askerSeti'
  | 'botBakim'
  | 'tabanlik'
  | 'trasCantasi'
  | 'pisikPudrasi'
  | 'kogusDuzen'
  | 'dolapKilidi'
  | 'askerCuzdani'
  | 'kamerasizTelefon'
  | 'pijama'
  | 'terlik'
  // Kantinden alınanlar
  | 'kontor'
  | 'kitap'
  | 'defterKalem'
  | 'tesbih'
  | 'sigara'
  | 'cakmak'
  | 'atistirmalik'
  | 'enerjiIcecegi';

/**
 * Aynı malzemenin ucuzu da var kalitelisi de. Kademe hem fiyatı hem
 * günlük faydayı belirliyor — çarşıdaki asıl karar bu.
 */
export type Kalite = 'ekonomik' | 'standart' | 'kaliteli';

export type EnvanterKayit = { adet: number; kalite: Kalite };

export type Envanter = Partial<Record<EsyaId, EnvanterKayit>>;

export type DolapBolgesi = 'ust' | 'aski' | 'orta' | 'alt' | 'kapi';

/**
 * Dolabın kayıttaki hâli: hangi parça hangi bölgede. Anahtar sırası
 * yerleştirme sırası — denetimde raflar aynı sırayla dizilsin diye.
 * `hizli`: torba olduğu gibi boşaltıldı, her şey alt gözde yığın.
 */
export type DolapDuzeni = { yerler: Record<string, DolapBolgesi>; hizli?: boolean };

/** Denetimi bekleyen bir rutin işi: hangi mini oyun, kaç puanla bitti. */
export type Kusur = { kaynak: MiniGameId; puan: number };

/** Oyuncunun kışlaya girmeden önce belirlediği kimliği. */
export type Profil = {
  ad: string;
  /** Sigara içiyor mu — bütün bir mekanik zinciri buna bağlı. */
  sigaraIciyor: boolean;
};

/**
 * Telefonda konuşan karakter. Rehber kaydıyla birebir değil: tek bir "Ev"
 * kaydını annen de açabilir baban da, ve ikisi ayrı ilişki taşır.
 */
export type Rol = 'anne' | 'baba' | 'sevgili' | 'kanka' | 'kardes' | 'es' | 'akraba';

/**
 * Rehberde görünen satır. Kadro sabit değil — oyuncu istediğini ekler;
 * 'akraba' amcan, halan, dayın için genel havuzu açar.
 */
export type KayitRolu = 'ev' | 'sevgili' | 'kanka' | 'kardes' | 'es' | 'akraba';

/** v2 kayıtlarında duran eski kategori; v3 migration'ında role çevriliyor. */
export type YakinlikTuru = 'ebeveyn' | 'sevgili' | 'es' | 'kardes' | 'arkadas';

export type RehberKisi = {
  id: string;
  ad: string;
  /** Ekranda görünen serbest etiket: "Annem", "İrem", "Dayı". */
  yakinlik: string;
  /** Hangi içerik havuzunun açılacağı. Eski kayıtlarda yok, türden türetilir. */
  rol?: KayitRolu;
  /** v2 artığı; yalnızca migration okur. */
  tur?: YakinlikTuru;
  /** Son arandığı gün; her gün aranmak etkisini azaltır. */
  sonArananGun?: number;
};

export type MiniGameId =
  | 'yatak'
  | 'ictima'
  | 'yurumek'
  | 'silah'
  | 'nobet'
  | 'izmarit'
  | 'ceza'
  | 'giyinme'
  | 'postal'
  | 'tiras'
  | 'gece'
  | 'atis';

export type OgunAdi = 'kahvalti' | 'ogle' | 'aksam';

/** Mini oyun 0–1 arası bir başarı puanı döndürür; içerik onu etkiye çevirir. */
export type MiniGameResult = { score: number; detail?: string };

/**
 * Her sahne türünde ortak. `kosul` telefon motorunun koşul dilini kullanıyor
 * (content/telefon/tipler.ts): telefonda konan bir işaret, ilişki ya da gün
 * aralığı. Koşulu tutmayan sahne oynanmadan atlanır; böylece telefonda
 * anlatılan bot olayı ertesi gün koğuşta karşına çıkabiliyor.
 */
type SahneOrtak = { kosul?: Kosul };

export type Scene = SahneOrtak &
  (
  | {
      kind: 'anlati';
      id: string;
      sprite?: SpriteKey;
      /** Konuşan varsa adı; yoksa metin anlatıcı sesidir. */
      speaker?: string;
      text: string;
      choices?: Choice[];
    }
  | {
      kind: 'mini';
      id: string;
      game: MiniGameId;
      /**
       * Sonucu hemen değil, sonraki denetimde (içtima, yoklama) değerlendirilir.
       * `reward` yalnızca anında hissedilen bedel; disiplin denetimde gelir.
       */
      denetimde?: boolean;
      sprite?: SpriteKey;
      brief: string;
      /** 0–1 puanı etkiye çevirir. */
      reward: (score: number) => Effect;
      /** 0–1 puanı sonuç cümlesine çevirir. */
      verdict: (score: number) => string;
    }
  | {
      /** Tepsi ekranı: oyuncu menüdeki kalemleri tek tek seçer. */
      kind: 'yemek';
      id: string;
      ogun: OgunAdi;
      sprite?: SpriteKey;
      brief: string;
    }
  | {
      /** Serbest zaman: kantin, telefon, dolap ve muhabbet açılır. */
      kind: 'serbest';
      id: string;
      sprite?: SpriteKey;
      brief: string;
    }
  | {
      /** ANT-41 dersi: bölüm bölüm okunur, sınavı yoktur. */
      kind: 'ders';
      id: string;
      brief: string;
    }
  | {
      /** Bölge tanıtımı: haritadaki yerlere sırayla dokunup öğrenirsin. */
      kind: 'tanitim';
      id: string;
      brief: string;
    }
  | {
      /** Dolap yerleşimi: torbadaki eşyaları tek tek dolaptaki yerine sürüklersin. */
      kind: 'dolap';
      id: string;
      sprite?: SpriteKey;
      brief: string;
    }
  | {
      /** Dolap denetimi: kayıttaki yerleşime bakılır, yanlış yerdeki her şey görünür. */
      kind: 'dolapDenetimi';
      id: string;
      sprite?: SpriteKey;
      brief: string;
    }
  | {
      /**
       * İçtima ya da yoklama denetimi: Onbaşı sırayı dolaşıyor, sabahki (ya da
       * gece) rutinden kalan kusurlara bakıyor; kusur varsa şınav cezası.
       */
      kind: 'denetim';
      id: string;
      sprite?: SpriteKey;
      brief: string;
    }
  | {
      /** İki blok arası yürüyüş: dokundukça adım atarsın. */
      kind: 'yol';
      id: string;
      hedef: string;
      /** Kaç adımda varılır. */
      adim: number;
      /** Yolun sonunda beliren mekan. */
      mekan: SpriteKey;
      /** Yol boyunca geçilen manzara. */
      manzara: SpriteKey[];
      /** Sahnenin hangi kameradan çekildiği. */
      bakis: Bakis;
      /** Üniforma daha torbadaysa yürüyen sivil kıyafetle çiziliyor. */
      sivil?: boolean;
    }
  );

export type TimeBlock = {
  id: string;
  /** 24 saat biçiminde, ör. '05:30' */
  from: string;
  to: string;
  title: string;
  sprite?: SpriteKey;
  scenes: Scene[];
};

export type Day = {
  day: number;
  /** Günün başlığı — yatış ekranında ve çentik takviminde görünür. */
  title: string;
  /** Gün açılış kartındaki tek cümlelik ton belirleyici. */
  epigraph?: string;
  /**
   * O günün nöbet ve ceza görevini takvimden (content/gorevTakvimi.ts)
   * farklı yapmak için. Verilmezse takvim geçerli.
   */
  gorevler?: { nobet?: boolean; ceza?: boolean };
  blocks: TimeBlock[];
};
