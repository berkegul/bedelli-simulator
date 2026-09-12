import type { MiniGameId, Scene, TimeBlock } from '../engine/types';

/**
 * Sabah rutini: yatak → giyinme → postal → tıraş, en son içtima. Her gün
 * aynı sırayla ve her adım elle yapılıyor; çarşıda ne aldıysan (çamaşır,
 * bot bakım seti, tıraş çantası) burada işe yarıyor ya da yokluğu hissediliyor.
 *
 * Bu işler yapılırken kimse bakmıyor. Onbaşı içtimada sırayı dolaşıp
 * kontrol ediyor; eksik varsa şınav orada (bkz. denetim.ts). O yüzden
 * rutin sahnelerinin anında bedeli yalnızca harcanan enerji, disiplin
 * denetimde geliyor. Gece de aynısı: yatma hazırlığı, yoklamada denetim.
 *
 * Gün dosyası adımlardan birini kendi metniyle yazabilir (2. gün lavabo,
 * 3. gün postal); o zaman o adım yerinde kalır, eksikler araya doğru
 * sırayla girer.
 */

export function giyinmeSahnesi(
  id: string,
  brief = 'Yatak tamam, sıra üstünde: fanila, pantolon, çorap, postal, ceket. Dolabı sen yerleştirdin; neyin nerede olduğunu bilen hızlı giyinir. İçtimaya on dakika.',
): Scene {
  return {
    kind: 'mini',
    id,
    game: 'giyinme',
    sprite: 'uniformaKatli',
    brief,
    denetimde: true,
    reward: () => ({ enerji: -3 }),
    verdict: (s) =>
      s > 0.8
        ? 'Düdükten iki dakika sonra hazırdın. İçtimaya ilk çıkanlardansın.'
        : s > 0.5
          ? 'Giyindin ama son düğmeyi içtima alanına koşarken ilikledin.'
          : 'Ceketin elinde çıktın. İçtimada bu görünecek.',
  };
}

export function postalSahnesi(
  id: string,
  brief = 'Postal ranzanın altında, dünkü çamur hâlâ üstünde. Onbaşı içtimada önce postala bakar. Ov, parlat.',
): Scene {
  return {
    kind: 'mini',
    id,
    game: 'postal',
    sprite: 'postal',
    brief,
    denetimde: true,
    reward: () => ({ enerji: -2 }),
    verdict: (s) =>
      s > 0.8
        ? 'Postal ayna gibi.'
        : s > 0.5
          ? 'Parlak sayılır; burnunda mat bir leke kaldı.'
          : 'Postal mat kaldı. İçtimada ilk bakılan yer postaldır.',
  };
}

export function tirasSahnesi(
  id: string,
  brief = 'Lavaboda on kişi, dört musluk. Jileti aşağı doğru çek; acele eden kesiğini içtimaya taşır.',
): Scene {
  return {
    kind: 'mini',
    id,
    game: 'tiras',
    sprite: 'trasCantasi',
    brief,
    denetimde: true,
    reward: () => ({}),
    verdict: (s) =>
      s > 0.8
        ? 'Yüzün temiz, tek kesik yok. Aynadaki adamı tanımaya başlıyorsun.'
        : s > 0.5
          ? 'Çenenin altında birkaç kıl kaldı.'
          : 'Yüzün kesik içinde; peçeteyi yapıştırıp çıktın.',
  };
}

export function geceSahnesi(
  id: string,
  brief = 'Yoklamaya on dakika, ışıklar 22:00’de sönüyor. Ceket ve pantolon askıya, postal ranzanın altına, çorap kirli torbasına; sonra pijama ve terlik.',
): Scene {
  return {
    kind: 'mini',
    id,
    game: 'gece',
    sprite: 'terlik',
    brief,
    denetimde: true,
    reward: () => ({}),
    verdict: (s) =>
      s > 0.8
        ? 'Pijama ve terlikle ranza başındasın.'
        : s > 0.5
          ? 'Terliği son anda buldun.'
          : 'Yarı giyinik kaldın; üniforma askıda değil, ranzanın üstünde.',
  };
}

export function denetimSahnesi(id: string, brief: string): Scene {
  return { kind: 'denetim', id, sprite: 'cavus', brief };
}

const SABAH_DENETIM =
  'Hizaya geçtin. Onbaşı sıranın başından yürümeye başladı: postal, yüz, üniforma. Kimsenin önünde iki saniyeden fazla durmuyor. Şimdilik.';
const GECE_DENETIM =
  'Ranza başındasın. Onbaşı koğuşu baştan sona yürüyor: askı, postal, yatma kıyafeti.';

/**
 * Son yoklamadan önce yatma hazırlığı, yoklamada denetim. Hazırlık
 * yürüyüşten (koğuşa dönüş) sonra; denetim Onbaşı'nın "Ranza başı!"
 * sahnesinden hemen sonra. Gün dosyası kendi metniyle yazmışsa dokunulmuyor.
 */
export function geceRutini(b: TimeBlock): TimeBlock {
  if (b.scenes.some((sc) => sc.kind === 'mini' && sc.game === 'gece')) return b;
  const scenes = [...b.scenes];
  const yolSonu = scenes.findIndex((sc) => sc.kind !== 'yol');
  const hazirlik = yolSonu < 0 ? scenes.length : yolSonu;
  scenes.splice(hazirlik, 0, geceSahnesi(`${b.id}-gece`));
  const denetim = Math.min(scenes.length, hazirlik + 2);
  scenes.splice(denetim, 0, denetimSahnesi(`${b.id}-denetim`, GECE_DENETIM));
  return { ...b, scenes };
}

/** Sabah içtimasında hizaya geçildikten sonra Onbaşı sırayı dolaşıyor. */
export function sabahDenetimi(b: TimeBlock): TimeBlock {
  if (b.scenes.some((sc) => sc.kind === 'denetim')) return b;
  const scenes = [...b.scenes];
  const ictima = scenes.findIndex((sc) => sc.kind === 'mini' && sc.game === 'ictima');
  scenes.splice(ictima < 0 ? scenes.length : ictima + 1, 0, denetimSahnesi(`${b.id}-denetim`, SABAH_DENETIM));
  return { ...b, scenes };
}

const RUTIN: { game: MiniGameId; sahne: (blokId: string) => Scene }[] = [
  { game: 'giyinme', sahne: (blokId) => giyinmeSahnesi(`${blokId}-giyinme`) },
  { game: 'postal', sahne: (blokId) => postalSahnesi(`${blokId}-postal`) },
  { game: 'tiras', sahne: (blokId) => tirasSahnesi(`${blokId}-tiras`) },
];

/** Kalkış bloğuna eksik rutin adımlarını yataktan sonra, doğru sırayla ekler. */
export function sabahRutini(b: TimeBlock): TimeBlock {
  const scenes = [...b.scenes];
  const bul = (game: MiniGameId) =>
    scenes.findIndex((sc) => sc.kind === 'mini' && sc.game === game);

  let son = bul('yatak');
  for (const r of RUTIN) {
    const i = bul(r.game);
    if (i >= 0) {
      son = i;
      continue;
    }
    scenes.splice(son + 1, 0, r.sahne(b.id));
    son += 1;
  }
  return { ...b, scenes };
}
