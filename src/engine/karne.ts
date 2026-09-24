import type { ArkadasId } from './types';
import { puanNotu } from './stats';
import type { Gorusme, Rol } from '../content/telefon/tipler';

export type BitenGun = { gun: number; not: string; puan: number };

export type Karne = {
  /** 28 günün puan ortalaması ve sicil karşılığı. */
  genel: { ad: string; puan: number };
  /** Not başına kaç gün: "TEMİZ İŞ × 11". Yalnızca en az bir kez alınanlar. */
  dagilim: { ad: string; adet: number }[];
  enIyiGun: BitenGun | null;
  enKotuGun: BitenGun | null;
  /** En çok görüşülen rol ve görüşme sayısı; hiç konuşulmadıysa null. */
  enCokKonusulan: { rol: Rol; adet: number } | null;
  toplamGorusme: number;
  /** Arkadaşlar yakınlığa göre sıralı. */
  arkadaslar: { id: ArkadasId; puan: number; derece: string }[];
};

const NOT_SIRASI = ['TAKDİR ALDI', 'TEMİZ İŞ', 'İDARE EDER', 'GAZ YEDİ', 'CEZALI'];

/** Dostluk puanının koğuştaki karşılığı. */
export function dostlukDerecesi(puan: number): string {
  if (puan >= 45) return 'kanka';
  if (puan >= 25) return 'yakın';
  if (puan >= 10) return 'tanıdık';
  return 'uzak';
}

/**
 * Terhis karnesi: sicil defterinden ve telefon kaydından derlenen özet.
 * Hesap saf; ekran yalnızca gösteriyor, test burada.
 */
export function karneHesapla(
  bitenGunler: BitenGun[],
  gorulmusGorusmeler: string[],
  gorusmeler: Pick<Gorusme, 'id' | 'rol'>[],
  dostluk: Record<ArkadasId, number>,
): Karne {
  const ortalama = bitenGunler.length
    ? bitenGunler.reduce((t, b) => t + b.puan, 0) / bitenGunler.length
    : 0;
  const genel = puanNotu(ortalama);

  const dagilim = NOT_SIRASI.map((ad) => ({
    ad,
    adet: bitenGunler.filter((b) => b.not === ad).length,
  })).filter((d) => d.adet > 0);

  // Eşitlikte erken gün: "ilk takdir" daha çok anlam taşıyor.
  const enIyiGun = bitenGunler.reduce<BitenGun | null>(
    (e, b) => (!e || b.puan > e.puan ? b : e),
    null,
  );
  const enKotuGun = bitenGunler.reduce<BitenGun | null>(
    (e, b) => (!e || b.puan < e.puan ? b : e),
    null,
  );

  const rolu = new Map(gorusmeler.map((g) => [g.id, g.rol]));
  const sayac = new Map<Rol, number>();
  for (const id of gorulmusGorusmeler) {
    const rol = rolu.get(id);
    if (rol) sayac.set(rol, (sayac.get(rol) ?? 0) + 1);
  }
  let enCokKonusulan: Karne['enCokKonusulan'] = null;
  for (const [rol, adet] of sayac) {
    if (!enCokKonusulan || adet > enCokKonusulan.adet) enCokKonusulan = { rol, adet };
  }

  const arkadaslar = (Object.keys(dostluk) as ArkadasId[])
    .map((id) => ({ id, puan: dostluk[id], derece: dostlukDerecesi(dostluk[id]) }))
    .sort((a, b) => b.puan - a.puan);

  return {
    genel: { ad: genel.ad, puan: genel.puan },
    dagilim,
    enIyiGun,
    enKotuGun,
    enCokKonusulan,
    toplamGorusme: [...sayac.values()].reduce((a, b) => a + b, 0),
    arkadaslar,
  };
}
