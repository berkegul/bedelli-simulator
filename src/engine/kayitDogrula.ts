import type { SaveData } from './save';
import type { StatKey } from './types';

/**
 * Diskten ya da buluttan gelen kayıt `JSON.parse` sonrası tipsiz bir nesne.
 * Eskiden olduğu gibi `as SaveData` denirse eksik bir `stats` alanı ancak
 * ekranda, `stats.moral` okunurken çökme olarak ortaya çıkıyordu.
 *
 * Kural: oyunun devam edemeyeceği alanlar (profil, gün, konum, istatistik,
 * para) bozuksa kayıt reddedilir. Geri kalan her alan yanlış tipteyse
 * düşürülür; store eksik alanı zaten varsayılanla dolduruyor.
 */

const STAT_ANAHTARLARI: StatKey[] = ['kondisyon', 'disiplin', 'moral', 'enerji', 'tokluk'];

type Ham = Record<string, unknown>;

const nesneMi = (d: unknown): d is Ham => typeof d === 'object' && d !== null && !Array.isArray(d);
const sayiMi = (d: unknown): d is number => typeof d === 'number' && Number.isFinite(d);
const tamSayi = (d: unknown, en = 0): number | null =>
  sayiMi(d) && Number.isInteger(d) && d >= en ? d : null;
const sayiSozlugu = (d: unknown) => nesneMi(d) && Object.values(d).every(sayiMi);
const metinDizisi = (d: unknown) => Array.isArray(d) && d.every((x) => typeof x === 'string');
/** Yarım görüşme ancak kapanışta uygulanacak alanları tamsa kurtarılır. */
const gorusmeMi = (d: unknown) =>
  nesneMi(d) &&
  typeof d.gorusmeId === 'string' &&
  typeof d.rol === 'string' &&
  sayiMi(d.kalanRaunt) &&
  sayiMi(d.birikenMoral) &&
  sayiMi(d.birikenEnerji) &&
  sayiMi(d.birikenOzlem) &&
  sayiSozlugu(d.birikenIliski) &&
  sayiSozlugu(d.birikenGerilim) &&
  Array.isArray(d.isaretler);

/**
 * Sürüm taşımaları: her giriş kaydı bir sonraki sürüme çevirir. Yeni bir
 * sürüm eklenince yalnızca buraya bir satır girer; zincir sırayla uygulanır.
 */
const TASIMALAR: Record<number, (k: Ham) => Ham> = {
  // v2 → v3: telefon motoru alanları yok, store varsayılanla dolduruyor;
  // rehberdeki `tur` store'da role çevriliyor.
  2: (k) => ({ ...k, version: 3 }),
};

export const GUNCEL_SURUM = 3;

function tasi(k: Ham): Ham | null {
  let surum = k.version;
  let kayit = k;
  while (surum !== GUNCEL_SURUM) {
    const adim = typeof surum === 'number' ? TASIMALAR[surum] : undefined;
    if (!adim) return null;
    kayit = adim(kayit);
    surum = kayit.version;
  }
  return kayit;
}

export function kayitDogrula(ham: unknown): SaveData | null {
  if (!nesneMi(ham)) return null;
  const k = tasi(ham);
  if (!k) return null;

  // Zorunlu alanlar.
  const profil = k.profil;
  if (!nesneMi(profil) || typeof profil.ad !== 'string') return null;
  const gun = tamSayi(k.gun, 1);
  const blokIndex = tamSayi(k.blokIndex);
  const sahneIndex = tamSayi(k.sahneIndex);
  if (gun === null || blokIndex === null || sahneIndex === null) return null;
  if (!nesneMi(k.stats) || !STAT_ANAHTARLARI.every((s) => sayiMi((k.stats as Ham)[s]))) return null;
  if (!sayiMi(k.para)) return null;

  const stats = Object.fromEntries(
    STAT_ANAHTARLARI.map((s) => [s, Math.max(0, Math.min(100, (k.stats as Ham)[s] as number))]),
  ) as SaveData['stats'];

  // Opsiyonel alanlar: tipi tutmuyorsa düşer, store varsayılanı koyar.
  const secime = <T>(deger: unknown, uygun: boolean): T | undefined => (uygun ? (deger as T) : undefined);

  const rehber = Array.isArray(k.rehber)
    ? k.rehber.filter((r): r is Ham => nesneMi(r) && typeof r.id === 'string' && typeof r.ad === 'string')
    : [];

  // Her anahtar zorunlu: SaveData'ya yeni bir alan eklenip burada
  // unutulursa tsc hata verir, alan kayıttan sessizce düşmez.
  const kayit: Required<Record<keyof SaveData, unknown>> & SaveData = {
    version: 3,
    profil: { ad: profil.ad, sigaraIciyor: profil.sigaraIciyor === true },
    hazirlikBitti: k.hazirlikBitti === true,
    gun,
    blokIndex,
    sahneIndex,
    saat: secime(k.saat, sayiMi(k.saat)),
    stats,
    para: Math.max(0, k.para),
    envanter: secime(k.envanter, nesneMi(k.envanter)) ?? {},
    dolapDuzeni: secime(k.dolapDuzeni, nesneMi(k.dolapDuzeni) && nesneMi(k.dolapDuzeni.yerler)),
    bekleyenKusurlar: secime(k.bekleyenKusurlar, Array.isArray(k.bekleyenKusurlar)),
    dostluk: secime(k.dostluk, sayiSozlugu(k.dostluk)) ?? ({} as SaveData['dostluk']),
    gorulmusDiyaloglar: secime(k.gorulmusDiyaloglar, Array.isArray(k.gorulmusDiyaloglar)) ?? [],
    rehber: rehber.map((r) => ({
      ...r,
      yakinlik: typeof r.yakinlik === 'string' ? r.yakinlik : '',
    })) as unknown as SaveData['rehber'],
    nikotin: sayiMi(k.nikotin) ? k.nikotin : 0,
    bitenGunler: secime(k.bitenGunler, Array.isArray(k.bitenGunler)) ?? [],
    iliski: secime(k.iliski, sayiSozlugu(k.iliski)),
    gerilim: secime(k.gerilim, sayiSozlugu(k.gerilim)),
    ozlem: secime(k.ozlem, sayiMi(k.ozlem)),
    hafiza: secime(k.hafiza, nesneMi(k.hafiza)),
    sonArama: secime(k.sonArama, sayiSozlugu(k.sonArama)),
    gorulmusGorusmeler: secime(k.gorulmusGorusmeler, Array.isArray(k.gorulmusGorusmeler)),
    sevgiliVar: secime(k.sevgiliVar, typeof k.sevgiliVar === 'boolean'),
    cepteIzmarit: secime(k.cepteIzmarit, tamSayi(k.cepteIzmarit) !== null),
    bugunIsteyenler: secime(k.bugunIsteyenler, metinDizisi(k.bugunIsteyenler)),
    bugunDinlenildi: secime(k.bugunDinlenildi, typeof k.bugunDinlenildi === 'boolean'),
    gelenArama: secime(
      k.gelenArama,
      nesneMi(k.gelenArama) && typeof k.gelenArama.rol === 'string' && typeof k.gelenArama.kisiId === 'string',
    ),
    bekleyenArama: secime(k.bekleyenArama, metinDizisi(k.bekleyenArama)),
    yarimGorusme: secime(k.yarimGorusme, gorusmeMi(k.yarimGorusme)),
    guncelleme: sayiMi(k.guncelleme) ? k.guncelleme : 0,
  };
  return kayit;
}
