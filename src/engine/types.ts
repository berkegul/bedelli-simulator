import type { SpriteKey } from '../art';

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

/** Oyuncunun kışlaya girmeden önce belirlediği kimliği. */
export type Profil = {
  ad: string;
  /** Sigara içiyor mu — bütün bir mekanik zinciri buna bağlı. */
  sigaraIciyor: boolean;
};

export type RehberKisi = {
  id: string;
  ad: string;
  yakinlik: string;
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
  | 'ceza';

export type OgunAdi = 'kahvalti' | 'ogle' | 'aksam';

/** Mini oyun 0–1 arası bir başarı puanı döndürür; içerik onu etkiye çevirir. */
export type MiniGameResult = { score: number; detail?: string };

export type Scene =
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
    };

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
  blocks: TimeBlock[];
};
