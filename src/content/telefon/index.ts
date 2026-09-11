import type { Gorusme, KayitRolu, Rol, TelefonDurumu } from './tipler';
import { DOLGU } from './dolgu';
import { GUN_01 } from './gunler/g01';
import { GUN_02 } from './gunler/g02';
import { GUN_03 } from './gunler/g03';
import { GUN_04 } from './gunler/g04';
import { GUN_05 } from './gunler/g05';
import { GUN_06 } from './gunler/g06';
import { GUN_07 } from './gunler/g07';
import { GUN_08 } from './gunler/g08';
import { GUN_09 } from './gunler/g09';
import { GUN_10 } from './gunler/g10';
import { GUN_11 } from './gunler/g11';
import { GUN_12 } from './gunler/g12';
import { GUN_13 } from './gunler/g13';
import { GUN_14 } from './gunler/g14';
import { GUN_15 } from './gunler/g15';
import { GUN_16 } from './gunler/g16';
import { GUN_17 } from './gunler/g17';
import { GUN_18 } from './gunler/g18';
import { GUN_19 } from './gunler/g19';
import { GUN_20 } from './gunler/g20';
import { GUN_21 } from './gunler/g21';
import { GUN_22 } from './gunler/g22';
import { GUN_23 } from './gunler/g23';
import { GUN_24 } from './gunler/g24';
import { GUN_25 } from './gunler/g25';
import { GUN_26 } from './gunler/g26';
import { GUN_27 } from './gunler/g27';
import { GUN_28 } from './gunler/g28';
import { gorusmeSec, evdeKimAcar } from './motor';

export * from './tipler';
export * from './motor';
export { finalKartlari, epilog, type FinalKarti, type EpilogSatiri } from './finaller';

/** Yirmi sekiz günün tamamı artı güne bağlı olmayan dolgu havuzu. */
export const TUM_GORUSMELER: Gorusme[] = [
  ...GUN_01, ...GUN_02, ...GUN_03, ...GUN_04, ...GUN_05, ...GUN_06, ...GUN_07,
  ...GUN_08, ...GUN_09, ...GUN_10, ...GUN_11, ...GUN_12, ...GUN_13, ...GUN_14,
  ...GUN_15, ...GUN_16, ...GUN_17, ...GUN_18, ...GUN_19, ...GUN_20, ...GUN_21,
  ...GUN_22, ...GUN_23, ...GUN_24, ...GUN_25, ...GUN_26, ...GUN_27, ...GUN_28,
  ...DOLGU,
];

/**
 * Bazı günlerde telefonu kimin açacağı kuraya bırakılmıyor. Baban kendi
 * başına neredeyse hiç açmaz; bu günler onun sahneleri.
 */
export const ZORUNLU_EV_ROLU: Record<number, Rol> = {
  3: 'baba',
  9: 'baba',
  12: 'baba',
  14: 'baba',
  18: 'baba',
  24: 'baba',
  27: 'baba',
};

/**
 * Ev kaydında konuşacak rolü seçer. Kura babayı gösterse bile o gün baba
 * için oynanabilir bir görüşme yoksa anneye düşülür — telefon boş çalmaz.
 */
export function evRolSec(d: TelefonDurumu): Rol {
  const zorla = ZORUNLU_EV_ROLU[d.gun];
  const ilk = evdeKimAcar(d, zorla);
  if (gorusmeSec(TUM_GORUSMELER, ilk, d)) return ilk;
  const diger: Rol = ilk === 'baba' ? 'anne' : 'baba';
  return gorusmeSec(TUM_GORUSMELER, diger, d) ? diger : ilk;
}

export function kayittanRolSec(kayit: KayitRolu, d: TelefonDurumu): Rol {
  if (kayit === 'ev') return evRolSec(d);
  return kayit as Rol;
}

export function gunGorusmesi(rol: Rol, d: TelefonDurumu): Gorusme | undefined {
  return gorusmeSec(TUM_GORUSMELER, rol, d);
}

/** Eski kayıtlardaki yakınlık türünü yeni kayıt rolüne çevirir. */
export function eskiTurdenRol(tur: string | undefined): KayitRolu {
  switch (tur) {
    case 'ebeveyn':
      return 'ev';
    case 'sevgili':
      return 'sevgili';
    case 'es':
      return 'es';
    case 'kardes':
      return 'kardes';
    case 'arkadas':
      return 'kanka';
    default:
      return 'akraba';
  }
}

export const KAYIT_LISTESI: KayitRolu[] = ['ev', 'sevgili', 'kanka', 'kardes', 'es', 'akraba'];

/** Rehber satırında ve seçicide görünen kısa etiketler. */
export const KAYIT_IPUCU: Record<KayitRolu, string> = {
  ev: 'Annen ve baban. Kimin açacağı belli olmaz.',
  sevgili: 'En çok şey bekleyen, en çok kırılan.',
  kanka: 'Dışarıdaki hayatın kanıtı.',
  kardes: 'Bir anlığına sivil hayata dönmek.',
  es: 'Ev, çocuk, faturalar — ve sen yoksun.',
  akraba: 'Amcan, halan, dayın. Klasik muhabbet.',
};
