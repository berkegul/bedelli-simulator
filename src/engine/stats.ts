import type { Effect, StatKey, Stats } from './types';

export const STAT_ORDER: StatKey[] = ['kondisyon', 'disiplin', 'moral', 'enerji'];

/** Tokluk alt şeritte kendi tam genişlikli satırında duruyor. */
export const TUM_STATLAR: StatKey[] = [...STAT_ORDER, 'tokluk'];

export const BASLANGIC_STATS: Stats = {
  kondisyon: 50,
  disiplin: 50,
  moral: 65,
  enerji: 80,
  tokluk: 70,
};

export const BASLANGIC_PARA = 2800;

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Enerji dışındaki istatistikler tavana yaklaştıkça kazanmak zorlaşır,
 * kaybetmek aynı hızda kalır. Bu olmadan disiplin ve moral daha ilk gün
 * 100'e vuruyor ve kalan 27 günde ilerleme hissi kalmıyordu.
 * Enerji bir kaynak, bir başarı ölçüsü değil — o tam uygulanır.
 */
const DIRENCLI: Record<StatKey, boolean> = {
  kondisyon: true,
  disiplin: true,
  moral: true,
  enerji: false,
  tokluk: false,
};

function kazanc(mevcut: number, degisim: number, direncli: boolean) {
  if (!direncli) return degisim;

  // Yuvarlama yüzünden hiç kıpırdamamak oyuncuya "hiçbir şey fark etmiyor"
  // dedirtir; bu yüzden en az 1 puan hareket garanti. Ama bu garanti uçlarda
  // kalkıyor: yoksa her gün +1 birikip 100'e dayanıyor ve 28 günlük oyunda
  // beşinci günde tavan görülüyordu. Uçlar artık asimptot.
  if (degisim > 0) {
    const olceklenmis = degisim * Math.pow(1 - mevcut / 100, 0.85);
    return mevcut >= 92 ? olceklenmis : Math.max(1, olceklenmis);
  }
  // Tabana yaklaşırken de fren var, ama yükselmekten belirgin daha zayıf:
  // disiplin kaybetmek kazanmaktan kolay kalmalı.
  const dusus = -degisim * Math.pow(mevcut / 100, 0.35);
  return mevcut <= 8 ? -dusus : -Math.max(1, dusus);
}

/** Etkiyi uygular ve gerçekte ne kadar değiştiğini geri bildirir. */
export function applyEffect(
  stats: Stats,
  para: number,
  effect: Effect,
): { stats: Stats; para: number; delta: Partial<Stats> & { para?: number } } {
  const next: Stats = { ...stats };
  const delta: Partial<Stats> & { para?: number } = {};

  for (const key of TUM_STATLAR) {
    const change = effect[key];
    if (change === undefined) continue;
    const before = next[key];
    next[key] = clamp(before + kazanc(before, change, DIRENCLI[key]));
    if (next[key] !== before) delta[key] = next[key] - before;
  }

  let nextPara = para;
  if (effect.para !== undefined) {
    nextPara = Math.max(0, para + effect.para);
    if (nextPara !== para) delta.para = nextPara - para;
  }

  return { stats: next, para: nextPara, delta };
}

/**
 * Gün sonu notu. Enerji ve tokluk hariç tutulur — ikisi de gün içinde tükenen
 * kaynak, performans göstergesi değil.
 */
const NOT_ESIGI = [
  { min: 78, ad: 'TAKDİR ALDI', renkKey: 'brass' as const },
  { min: 64, ad: 'TEMİZ İŞ', renkKey: 'olive' as const },
  { min: 50, ad: 'İDARE EDER', renkKey: 'canvas' as const },
  { min: 36, ad: 'GAZ YEDİ', renkKey: 'tea' as const },
  { min: 0, ad: 'CEZALI', renkKey: 'rust' as const },
];

export function gunNotu(stats: Stats) {
  const ortalama = (stats.kondisyon + stats.disiplin + stats.moral) / 3;
  const esik = NOT_ESIGI.find((e) => ortalama >= e.min)!;
  return { ...esik, puan: Math.round(ortalama) };
}

/**
 * Uyku enerjiyi doldurur; moral düşükse tam dolmaz — huzursuz uyku.
 * Günü tükenmiş bitirmek bedeni yıpratır: kondisyon böylece enerji
 * yönetiminin sonucu olur, kendi başına duran bir sayı değil.
 */
export function uykudanSonra(stats: Stats): Stats {
  // Aç yatmak uykuyu böler; tokluk uyku kalitesine moral kadar etki eder.
  const aclikCezasi = stats.tokluk < 30 ? 0.25 : stats.tokluk < 50 ? 0.1 : 0;
  const kalite = Math.max(0.35, 0.6 + (stats.moral / 100) * 0.4 - aclikCezasi);
  const yipranma = stats.enerji < 20 ? -7 : stats.enerji < 40 ? -3 : stats.enerji > 65 ? 4 : 1;
  return {
    ...stats,
    enerji: clamp(stats.enerji + 70 * kalite),
    kondisyon: clamp(stats.kondisyon + yipranma),
    // Gece boyunca da acıkılır; sabah kahvaltısı bu yüzden önemli.
    tokluk: clamp(stats.tokluk - 18),
  };
}

/**
 * Her zaman bloğunda tokluk düşer. Aç geçen saatler kondisyon ve morali
 * de aşağı çeker — yemek seçimleri böylece gerçek bir karar oluyor.
 */
export const BLOK_BASINA_ACLIK = 8;

export function blokGecisi(stats: Stats): Stats {
  const tokluk = clamp(stats.tokluk - BLOK_BASINA_ACLIK);

  // Tepsiyi silip süpürmek de bedava değil: tıka basa dolu bir mideyle
  // eğitime çıkmak fazladan enerji yakıyor.
  if (tokluk > TOKLUK_BANT.ust) {
    return { ...stats, tokluk, enerji: clamp(stats.enerji - 3) };
  }
  // Açlık cezası yalnızca gerçekten aç kalınca ve hafif: her blokta puan
  // kırmak günde on iki kez birikip oyuncuyu tabana çiviliyordu.
  if (tokluk > 20) return { ...stats, tokluk };
  return {
    ...stats,
    tokluk,
    kondisyon: clamp(stats.kondisyon - 1),
    moral: clamp(stats.moral - 1),
  };
}

/**
 * Tokluğun bir ideal bandı var: altında açlık, üstünde ağırlık.
 * "Ne kadar yemeliyim" sorusunun cevabı bu bant — tepsi ekranı da bunu
 * doğrudan gösteriyor, oyuncu tahmin etmek zorunda kalmıyor.
 */
export const TOKLUK_BANT = { alt: 55, ust: 88 };

export function toklukDurumu(tokluk: number) {
  if (tokluk > TOKLUK_BANT.ust) return 'AĞIR';
  if (tokluk >= TOKLUK_BANT.alt) return 'TOK';
  if (tokluk >= 35) return 'İDARE EDER';
  if (tokluk >= 18) return 'ACIKTI';
  return 'TAKATSİZ';
}

export function toklukRengi(tokluk: number) {
  if (tokluk > TOKLUK_BANT.ust) return 'agir' as const;
  if (tokluk >= TOKLUK_BANT.alt) return 'iyi' as const;
  if (tokluk >= 35) return 'idare' as const;
  return 'ac' as const;
}

export const TOPLAM_GUN = 28;

export function kalanGun(gun: number) {
  return Math.max(0, TOPLAM_GUN - gun + 1);
}
