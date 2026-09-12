import type { DolapBolgesi, DolapDuzeni, Effect, Envanter, EsyaId } from '../engine/types';
import type { SpriteKey } from '../art';
import { ESYALAR } from './esyalar';

/**
 * Dolabın kuralları tek yerde: neyin nereye gittiği, torbada ne olduğu ve
 * denetimde bunun neye mal olduğu. İlk gün yerleştirme sahnesi de dördüncü
 * gün denetimi de buradan okuyor.
 */

export type DolapParcasi = { id: string; ad: string; sprite: SpriteKey; dogru: DolapBolgesi };

export const BOLGE_ADI: Record<DolapBolgesi, string> = {
  ust: 'Üst raf',
  aski: 'Askı',
  orta: 'Orta raf',
  alt: 'Alt göz',
  kapi: 'Kapak',
};

export const BOLGE_DE: Record<DolapBolgesi, string> = {
  ust: 'üst rafta',
  aski: 'askıda',
  orta: 'orta rafta',
  alt: 'alt gözde',
  kapi: 'kapakta',
};

/**
 * Her eşyanın dolapta bir yeri var. Cüzdan boyunda, telefon cepte durduğu
 * için listede yok — onlar torbaya hiç girmiyor.
 */
const DOGRU: Partial<Record<EsyaId, DolapBolgesi>> = {
  askerSeti: 'ust',
  kogusDuzen: 'aski',
  botBakim: 'alt',
  tabanlik: 'alt',
  pisikPudrasi: 'orta',
  trasCantasi: 'orta',
  dolapKilidi: 'kapi',
  pijama: 'ust',
  terlik: 'alt',
  kontor: 'orta',
  kitap: 'orta',
  defterKalem: 'orta',
  tesbih: 'orta',
  sigara: 'orta',
  cakmak: 'orta',
  atistirmalik: 'orta',
  enerjiIcecegi: 'orta',
};

/** Nizamiyede herkese verilenler. Çarşıdan hiçbir şey almayanın torbası da boş değil. */
const VERILENLER: DolapParcasi[] = [
  { id: 'uniforma', ad: 'Yedek üniforma', sprite: 'uniformaKatli', dogru: 'aski' },
  { id: 'postal', ad: 'Yedek postal', sprite: 'postal', dogru: 'alt' },
];

export function torbadakiler(envanter: Envanter): DolapParcasi[] {
  const alinanlar = ESYALAR.flatMap((t) => {
    const dogru = DOGRU[t.id];
    if (!dogru || (envanter[t.id]?.adet ?? 0) <= 0) return [];
    return [{ id: t.id, ad: t.ad, sprite: t.sprite, dogru }];
  });
  return [...VERILENLER, ...alinanlar];
}

/**
 * Kayıttaki kimlikten parçayı geri kurar. Eşya o arada tükenmiş olsa da
 * (kontör harcandı, sigara bitti) dolapta nereye konduğu biliniyor.
 */
export function parcaBul(id: string): DolapParcasi | undefined {
  const verilen = VERILENLER.find((p) => p.id === id);
  if (verilen) return verilen;
  const t = ESYALAR.find((e) => e.id === id);
  const dogru = t && DOGRU[t.id];
  return t && dogru ? { id: t.id, ad: t.ad, sprite: t.sprite, dogru } : undefined;
}

/** Torbayı olduğu gibi boşaltanın dolabı: her şey alt gözde, yığın hâlinde. */
export function yiginDuzeni(envanter: Envanter): DolapDuzeni {
  return {
    hizli: true,
    yerler: Object.fromEntries(torbadakiler(envanter).map((p) => [p.id, 'alt' as const])),
  };
}

/** Kayıttaki parçalar, yerleştirme sırasıyla. */
export function duzendekiler(duzen: DolapDuzeni): DolapParcasi[] {
  return Object.keys(duzen.yerler).flatMap((id) => {
    const p = parcaBul(id);
    return p ? [p] : [];
  });
}

/**
 * Denetim. Yüzbaşı dolabı açıyor ve ilk gün nasıl yerleştirdiysen onu
 * görüyor. Yanlış yerdeki her parça puan götürüyor; torbayı boşaltmış
 * olan için ayrı bir sahne var.
 */
export function dolapDenetimi(duzen: DolapDuzeni | null): {
  metin: string;
  etki: Effect;
  yanlislar: string[];
} {
  if (!duzen) {
    return { metin: 'Yüzbaşı dolabına baktı, bir şey demeden geçti.', etki: {}, yanlislar: [] };
  }

  const parcalar = duzendekiler(duzen);
  // Yığında tesadüfen alt göze düşen postal "doğru yerde" sayılmaz: yığın
  // düzen değil. Yoksa torbayı boşaltan, dolabı yanlış dizenden az ceza yiyordu.
  const yanlis = duzen.hizli ? parcalar : parcalar.filter((p) => duzen.yerler[p.id] !== p.dogru);
  const oran = parcalar.length ? 1 - yanlis.length / parcalar.length : 1;
  const etki: Effect = {
    disiplin: Math.round(-8 + oran * 16),
    moral: Math.round(-4 + oran * 6),
  };
  const ilk = yanlis[0];

  const metin = duzen.hizli
    ? 'Yüzbaşı kapağı açtı. Her şey alt gözde, bir yığın hâlinde. Kapağı yavaşça kapattı ve Onbaşı’ya baktı. Onbaşı da sana.'
    : oran === 1
      ? 'Yüzbaşı kapağı açtı, iki saniye baktı, kapattı ve yürüdü. Denetimde bundan iyisi yok.'
      : oran >= 0.6 && ilk
        ? `Yüzbaşı kapağı açtı. Gözü ${ilk.ad.toLocaleLowerCase('tr-TR')} üzerinde durdu: ${BOLGE_DE[duzen.yerler[ilk.id]]} ne işi var? Cevap beklemeden yürüdü.`
        : 'Yüzbaşı kapağı açtı ve kapatmadı. Onbaşı’yı çağırdı. Dolabın bu akşam bölüğün önünde baştan düzenlenecek.';

  return { metin, etki, yanlislar: yanlis.map((p) => p.id) };
}
