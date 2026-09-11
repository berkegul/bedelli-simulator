/**
 * Telefon motoru v2 — tip sözlüğü.
 *
 * Eski motorda bir görüşme tek rauntluk bir karttı: açılış, bir seçim, cevap,
 * kapanış. Burada görüşme bir düğüm zinciri: her replikte 2-4 seçenek var,
 * seçenek karşı tarafın anlık tepkisini taşıyor ve zincirin nereye gideceğini
 * belirliyor. Etkiler anında uygulanmıyor, görüşme boyunca birikiyor ve
 * kapanışta bir kere işleniyor — oyuncu konuşurken üst şeritteki çubukların
 * oynamasına bakıp seçim yapamasın diye.
 */

import type { KayitRolu, Rol } from '../../engine/types';

export type { KayitRolu, Rol };

export const TUM_ROLLER: Rol[] = ['anne', 'baba', 'sevgili', 'kanka', 'kardes', 'es', 'akraba'];

/** Hangi kayıttan hangi roller çıkabilir. */
export const KAYIT_ROLLERI: Record<KayitRolu, Rol[]> = {
  ev: ['anne', 'baba'],
  sevgili: ['sevgili'],
  kanka: ['kanka'],
  kardes: ['kardes'],
  es: ['es'],
  akraba: ['akraba'],
};

export const ROL_ADI: Record<Rol, string> = {
  anne: 'Annen',
  baba: 'Baban',
  sevgili: 'Sevgilin',
  kanka: 'Kankan',
  kardes: 'Kardeşin',
  es: 'Eşin',
  akraba: 'Akraban',
};

export const KAYIT_ADI: Record<KayitRolu, string> = {
  ev: 'Ev',
  sevgili: 'Sevgili',
  kanka: 'Kanka',
  kardes: 'Kardeş',
  es: 'Eş',
  akraba: 'Akraba',
};

/**
 * Oyuncunun söylediği/başına gelen şeyler. Değerle birlikte hangi gün
 * konduğu da saklanıyor — "on yedi gün önce de bunu söylüyordun" repliği
 * ancak böyle yazılabiliyor.
 */
export type Hafiza = Record<string, { deger: string; gun: number }>;

/** Motorun karar verirken baktığı her şey. Store'dan türetilir. */
export type TelefonDurumu = {
  gun: number;
  iliski: Record<Rol, number>;
  gerilim: Record<Rol, number>;
  ozlem: number;
  moral: number;
  disiplin: number;
  hafiza: Hafiza;
  /** Oynanmış görüşme id'leri. */
  gorulmus: string[];
  telefonVar: boolean;
  sigaraIcen: boolean;
  sevgiliVar: boolean;
  /** Rol başına en son arandığı gün; hiç aranmadıysa 0. */
  sonArama: Record<Rol, number>;
};

export type Kosul = {
  gunMin?: number;
  gunMax?: number;
  iliskiMin?: Partial<Record<Rol, number>>;
  iliskiMax?: Partial<Record<Rol, number>>;
  gerilimMin?: Partial<Record<Rol, number>>;
  gerilimMax?: Partial<Record<Rol, number>>;
  moralMin?: number;
  moralMax?: number;
  ozlemMin?: number;
  ozlemMax?: number;
  disiplinMin?: number;
  /** Bu işaret konmuş olmalı. */
  isaret?: string;
  /** Konmuşsa değeri bunlardan biri olmalı. */
  isaretDeger?: string | string[];
  /** Bu işaret konmamış olmalı. */
  isaretYok?: string;
  /** İşaret en az bu kadar gün önce konmuş olmalı — taze callback sahte durur. */
  isaretYas?: number;
  telefonVar?: boolean;
  sigaraIcen?: boolean;
  sevgiliVar?: boolean;
};

/**
 * Bir seçimin karşılığı. `iliski` ve `gerilim` o an konuşulan role işler;
 * başka birine yansıması gerekiyorsa (babaya anneyi sormak gibi) `digerIliski`.
 */
export type TelefonEtki = {
  iliski?: number;
  gerilim?: number;
  moral?: number;
  enerji?: number;
  ozlem?: number;
  digerIliski?: { kim: Rol; puan: number };
};

export type Secenek = {
  id: string;
  label: string;
  kosul?: Kosul;
  etki?: TelefonEtki;
  /** Konuşma boyunca biriken işaret; kapanışta hafızaya yazılır. */
  isaret?: { ad: string; deger: string };
  /** Karşı tarafın anlık tepkisi. Ayrı düğüm açmadan transkripte düşer. */
  cevap?: string;
  /** Zincirin devamı. Yoksa görüşme kapanır. */
  sonraki?: string;
  /** Bundan sonrasını başkası konuşuyor: "anneyi ver". */
  rolDegis?: Rol;
};

export type Replik = {
  id: string;
  /** Konuşan. Verilmezse görüşmenin aktif rolü. 'anlatici' tırnaksız sestir. */
  kim?: Rol | 'anlatici';
  metin: string;
  secenekler?: Secenek[];
  /** Seçeneksiz düğüm; metin okunur ve buraya geçilir. */
  sonraki?: string;
  /**
   * Tutmazsa bu replik hiç görünmez. Callback beat'leri böyle korunuyor:
   * 1. günü hiç aramamış oyuncuya 7. günde "ne demiştin hatırlıyor musun"
   * diye sorulmuyor.
   */
  kosul?: Kosul;
  /** Koşul tutmazsa nereye geçilecek. Verilmezse görüşme kapanır. */
  atla?: string;
};

export type GorusmeTuru = 'omurga' | 'dal' | 'dolgu';

export type Gorusme = {
  id: string;
  kayit: KayitRolu;
  rol: Rol;
  tur: GorusmeTuru;
  /** Belirli günler ya da kapalı aralık. Yoksa her gün uygun. */
  gunler?: number[] | { min: number; max: number };
  kosul?: Kosul;
  /** Aynı gün birden fazla uygunsa büyük olan kazanır. */
  oncelik?: number;
  /** Bir kez oynanır; omurga beat'leri için. */
  tekSefer?: boolean;
  /** Anlatıcı sesiyle kapanış — seçimden bağımsız. */
  kapanis: string;
  /**
   * Ankesörde ikinci rauntun sonunda kuyruk seni kesiyor. Buradaki cümle
   * o kesintiyi karşılar; verilmezse genel bir kapanış kullanılır.
   */
  ankesorKapanis?: string;
  kok: string;
  replikler: Record<string, Replik>;
};

/** Ankesörde kaç seçim rauntu yapılabilir; kendi telefonunda kaç. */
export const RAUNT_ANKESOR = 2;
export const RAUNT_TELEFON = 4;

export const GENEL_ANKESOR_KAPANIS =
  'Arkandaki "bitir artık" diye homurdandı. Kapatmak zorunda kaldın.';
