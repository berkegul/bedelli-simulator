import type { Effect, Kusur } from '../engine/types';

/**
 * İçtima ve yoklama denetimi. Sabah giyinme, postal ve tıraş yapılırken
 * kimse bakmıyor; Onbaşı içtimada sırayı dolaşıp kontrol ediyor. Gece de
 * aynısı yoklamada. Eşiğin altında kalan her iş bir kusur, her kusur on
 * şınav.
 */

export const KUSUR_ESIGI = 0.5;

const SATIR: Partial<Record<Kusur['kaynak'], [iyi: string, kotu: string]>> = {
  giyinme: ['Üniforma tam', 'Üniforma eksik, düğmeler açık'],
  postal: ['Postal parlak', 'Postal mat'],
  tiras: ['Tıraş temiz', 'Tıraş kötü, yüzde kesik'],
  gece: ['Yatma düzeni tam', 'Yatma düzeni eksik'],
};

export function denetimSatirlari(kusurlar: Kusur[]) {
  return kusurlar.map((k) => {
    const [iyi, kotu] = SATIR[k.kaynak] ?? ['Tamam', 'Eksik'];
    const tamam = k.puan >= KUSUR_ESIGI;
    return { kaynak: k.kaynak, tamam, metin: tamam ? iyi : kotu };
  });
}

export const hataSayisi = (kusurlar: Kusur[]) =>
  kusurlar.filter((k) => k.puan < KUSUR_ESIGI).length;

export const sinavSayisi = (kusurlar: Kusur[]) => hataSayisi(kusurlar) * 10;

const SAYI_ADI: Record<number, string> = { 10: 'On', 20: 'Yirmi', 30: 'Otuz', 40: 'Kırk' };
export const sinavAdi = (n: number) => SAYI_ADI[n] ?? String(n);

/**
 * Denetimin bedeli. Her iş kendi puanı kadar disiplin getiriyor ya da
 * götürüyor; kusur varsa şınavın nasıl çekildiği de hesaba giriyor.
 */
export function denetimSonucu(
  kusurlar: Kusur[],
  cezaSkoru: number | null,
): { etki: Effect; metin: string } {
  if (!kusurlar.length) {
    return { etki: {}, metin: 'Onbaşı sırayı dolaştı, bir şey demedi.' };
  }

  const disiplin = kusurlar.reduce((t, k) => t + Math.round(-4 + k.puan * 8), 0);
  const hatalar = hataSayisi(kusurlar);

  if (!hatalar) {
    return {
      etki: { disiplin: disiplin + 2, moral: 3 },
      metin: 'Onbaşı önünden geçti ve durmadı. Denetimde bundan iyisi yok.',
    };
  }

  const s = cezaSkoru ?? 0;
  const n = hatalar * 10;
  return {
    etki: {
      disiplin: disiplin + Math.round(-3 + s * 6),
      kondisyon: Math.round(-2 + s * 5),
      enerji: -6 - hatalar * 4,
      moral: Math.round(-5 + s * 3),
    },
    metin:
      s >= 1
        ? `${sinavAdi(n)} şınavı tamamladın. Onbaşı "Bir daha görmeyeyim." dedi ve geçti.`
        : s > 0.6
          ? 'Şınavların çoğunu çektin; gerisini Onbaşı bağışladı. Bu sefer.'
          : 'Kolların bıraktı. Onbaşı adını defterine yazdı.',
  };
}
