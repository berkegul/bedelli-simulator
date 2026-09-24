import { type Diyalog } from '../content/arkadaslar';
import { BASLANGIC_PARA, BASLANGIC_STATS } from '../engine/stats';
import { dakikaya } from '../engine/zaman';
import type {
  DolapDuzeni,
  Kusur,
  ArkadasId,
  Envanter,
  Profil,
  RehberKisi,
  Rol,
} from '../engine/types';
import { type Hafiza } from '../content/telefon';
import type { AktifGorusme, Panel, Sonuc } from './tipler';

export const BOS_ROL_SAYISI = (): Record<Rol, number> => ({
  anne: 0,
  baba: 0,
  sevgili: 0,
  kanka: 0,
  kardes: 0,
  es: 0,
  akraba: 0,
});

/** Başlangıç ilişkileri: annenle zaten yakınsın, babanla mesafe var. */
export const BASLANGIC_ILISKI: Record<Rol, number> = {
  anne: 75,
  baba: 60,
  sevgili: 70,
  kanka: 70,
  kardes: 65,
  es: 75,
  akraba: 55,
};

/** Sigara içen oyuncuda her blokta biriken kriz. */
export const NIKOTIN_ARTIS = 9;

export const BOS_DOSTLUK: Record<ArkadasId, number> = { emre: 0, tolga: 0, serkan: 0 };

export const ilkDurum = {
  panel: null as Panel,
  profil: { ad: '', sigaraIciyor: false } as Profil,
  hazirlikBitti: false,
  gun: 1,
  blokIndex: 0,
  sahneIndex: 0,
  saat: dakikaya('05:30'),
  stats: { ...BASLANGIC_STATS },
  para: BASLANGIC_PARA,
  envanter: {} as Envanter,
  dolapDuzeni: null as DolapDuzeni | null,
  bekleyenKusurlar: [] as Kusur[],
  dostluk: { ...BOS_DOSTLUK },
  gorulmusDiyaloglar: [] as string[],
  rehber: [] as RehberKisi[],
  nikotin: 0,
  bitenGunler: [] as { gun: number; not: string; puan: number }[],
  sonuc: null as Sonuc | null,
  miniAktif: false,
  dolapOzeti: [] as string[],
  aktifDiyalog: null as Diyalog | null,
  aktifIstek: null as ArkadasId | null,
  bugunIsteyenler: [] as ArkadasId[],
  bugunDinlenildi: false,
  cepteIzmarit: 0,
  aktifGorusme: null as AktifGorusme | null,
  gorulmusGorusmeler: [] as string[],
  iliski: { ...BASLANGIC_ILISKI },
  gerilim: BOS_ROL_SAYISI(),
  ozlem: 20,
  hafiza: {} as Hafiza,
  sonArama: BOS_ROL_SAYISI(),
  sevgiliVar: true,
  gelenArama: null as { rol: Rol; kisiId: string } | null,
  bekleyenArama: [] as Rol[],
  gelistirmeDonus: false,
};
