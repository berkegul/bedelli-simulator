import type { Day, OgunAdi, Scene, TimeBlock } from '../engine/types';
import type { SpriteKey } from '../art';
import { gun01 } from './day01';
import { gun02 } from './day02';
import { gun03 } from './day03';
import { gun04 } from './day04';
import { gun05 } from './day05';

/**
 * Yemek ve serbest zaman blokları her gün aynı yapıda tekrar ediyor.
 * İçerik dosyalarında tekrar tekrar yazmak yerine blok kimliğinden tanıyıp
 * ilgili etkileşimli sahneyi buraya ekliyoruz: yazılacak 25 gün de bunu
 * kendiliğinden kazanıyor.
 */
const OGUN_EKI: Record<string, OgunAdi> = {
  kahvalti: 'kahvalti',
  ogle: 'ogle',
  'aksam-yemek': 'aksam',
};

/**
 * Kışlada bir yerden bir yere yürünür. Bu bloklara girerken araya kısa bir
 * yürüyüş sahnesi giriyor; hem günün monotonluğunu kırıyor hem de bloklar
 * arası geçiş "ekran değişti" olmaktan çıkıp mesafe hissi kazanıyor.
 * Yemekhane ve avlu da dahil: içtimadan sofraya ışınlanmıyorsun, yürüyorsun.
 * Yol kısa tutuluyor, günde üç öğün var.
 */
export const YOLLAR: Record<
  string,
  { hedef: string; adim: number; mekan: SpriteKey; manzara: SpriteKey[] }
> = {
  ictima: {
    hedef: 'İçtima alanına',
    adim: 5,
    mekan: 'bayrak',
    manzara: ['agac', 'kisla', 'agac', 'ankesor'],
  },
  'egitim-sabah': {
    hedef: 'Eğitim sahasına',
    adim: 7,
    mekan: 'hedefTahtasi',
    manzara: ['kisla', 'agac', 'engel', 'agac', 'engel'],
  },
  talim: {
    hedef: 'Talim alanına',
    adim: 6,
    mekan: 'engel',
    manzara: ['agac', 'bayrak', 'agac', 'hedefTahtasi'],
  },
  'aksam-ictima': {
    hedef: 'Akşam içtimasına',
    adim: 5,
    mekan: 'bayrak',
    manzara: ['kantinBina', 'agac', 'kisla', 'agac'],
  },
  denetim: { hedef: 'Koğuşa', adim: 4, mekan: 'kisla', manzara: ['agac', 'bayrak', 'agac'] },
  mintika: { hedef: 'Mıntıkaya', adim: 4, mekan: 'kisla', manzara: ['agac', 'ankesor', 'agac'] },
  kahvalti: { hedef: 'Yemekhaneye', adim: 3, mekan: 'kisla', manzara: ['bayrak', 'agac'] },
  ogle: { hedef: 'Yemekhaneye', adim: 3, mekan: 'kisla', manzara: ['agac', 'kisla'] },
  'aksam-yemek': { hedef: 'Yemekhaneye', adim: 3, mekan: 'kisla', manzara: ['agac', 'bayrak'] },
  serbest: { hedef: 'Avluya', adim: 3, mekan: 'kantinBina', manzara: ['kisla', 'agac', 'ankesor'] },
  'son-yoklama': { hedef: 'Koğuşa', adim: 3, mekan: 'kisla', manzara: ['ankesor', 'agac'] },
};

function blokZenginlestir(b: TimeBlock): TimeBlock {
  const anahtar = b.id.replace(/^d\d+-/, '');
  // Sevk gününde bölge zaten turla geziliyor; ayrıca yürüyüş sahnesi konmuyor.
  const sevkGunu = b.id.startsWith('d1-');
  const yol = sevkGunu ? undefined : YOLLAR[anahtar];

  let scenes = b.scenes;

  const ek = Object.keys(OGUN_EKI).find((k) => b.id.endsWith(`-${k}`));
  if (ek) {
    // Tepsi en başta: önce yemeğini alırsın, muhabbet sonra gelir.
    const tepsi: Scene = {
      kind: 'yemek',
      id: `${b.id}-tepsi`,
      ogun: OGUN_EKI[ek],
      sprite: 'tepsi',
      brief: 'Sıraya girdin, tepsini aldın. Bugün panoda ne yazıyorsa o var.',
    };
    scenes = [tepsi, ...scenes];
  }

  if (b.id.endsWith('-serbest')) {
    const serbest: Scene = {
      kind: 'serbest',
      id: `${b.id}-menu`,
      brief: 'İki saat senin. Kantin açık, telefon çekiyor, koğuşta muhabbet var.',
    };
    scenes = [...scenes, serbest];
  }

  // Yürüyüş en başa: bloğun kapısından girmeden önce oraya gidiliyor.
  // Yemek ve serbest blokları da dahil — eskiden bunlar yolun dışındaydı ve
  // içtimadan sofraya geçiş bir anda oluyordu.
  if (yol) {
    const yolSahnesi: Scene = {
      kind: 'yol',
      id: `${b.id}-yol`,
      hedef: yol.hedef,
      adim: yol.adim,
      mekan: yol.mekan,
      manzara: yol.manzara,
    };
    scenes = [yolSahnesi, ...scenes];
  }

  return scenes === b.scenes ? b : { ...b, scenes };
}

/**
 * Günün tekrar eden düzenini kıran görevler. Hepsi gün numarasından
 * türetiliyor — rastgele ama her oynayışta aynı, yani kayıttan dönünce
 * karşına başka bir gün çıkmıyor.
 */
function gunlukGorevler(g: Day): Day {
  const bloklar = g.blocks.map((b) => {
    const anahtar = b.id.replace(/^d\d+-/, '');

    // Mıntıka temizliği kışlanın günlük rutini: kahvaltıdan önce avlu toplanır.
    // 2. gün ilk tam gün olduğu için yükü hafif kalıyor, süpürge üçüncü günde
    // eline veriliyor.
    if (anahtar === 'mintika' && g.day >= 3) {
      const izmarit: Scene = {
        kind: 'mini',
        id: `${b.id}-izmarit`,
        game: 'izmarit',
        sprite: 'postal',
        brief:
          'Mıntıka dağıtıldı, avlunun bu köşesi senin. "Yerde bir tane izmarit görürsem hepiniz inersiniz."',
        reward: (s) => ({
          disiplin: Math.round(-4 + s * 13),
          enerji: -9,
          moral: Math.round(-2 + s * 4),
        }),
        verdict: (s) =>
          s > 0.85
            ? 'Avlu tertemiz. Onbaşı yere baktı, bir şey bulamadı ve bu onu rahatsız etti.'
            : s > 0.5
              ? 'Çoğunu topladın. Kalanları rüzgâr halletti diyelim.'
              : 'Yarısı yerde kaldı. Bütün bölük seninle beraber bahçeye indi.',
      };
      return { ...b, scenes: [...b.scenes, izmarit] };
    }

    // İlk üç gün alıştırma dönemi: bölge tanınır, düzen oturur, ceza yazılmaz.
    // Ceza dördüncü günden sonra ve dört günde bir, akşam içtimasında okunur.
    if (anahtar === 'aksam-ictima' && g.day >= 4 && g.day % 4 === 2) {
      const ceza: Scene = {
        kind: 'mini',
        id: `${b.id}-ceza`,
        game: 'ceza',
        sprite: 'asker',
        brief:
          'Onbaşı listeyi okurken senin adının yanında bir işaret var. "Sen kal. Yirmi şınav, sayıyorum."',
        reward: (s) => ({
          disiplin: Math.round(-6 + s * 12),
          kondisyon: Math.round(-2 + s * 6),
          enerji: -14,
          moral: Math.round(-6 + s * 4),
        }),
        verdict: (s) =>
          s >= 1
            ? 'Sayıyı tamamladın. Onbaşı bir şey demeden gitti.'
            : s > 0.6
              ? 'Yarısını geçtin, gerisini Onbaşı bağışladı. Bu sefer.'
              : 'Kollarını kaldıramadın. Yarın aynı ceza, iki katı.',
      };
      return { ...b, scenes: [...b.scenes, ceza] };
    }

    // Nöbet listesine ancak alıştırma bitince giriyorsun.
    if (anahtar === 'son-yoklama' && g.day >= 5 && g.day % 3 === 0) {
      const nobet: Scene = {
        kind: 'mini',
        id: `${b.id}-nobet`,
        game: 'nobet',
        sprite: 'ay',
        brief:
          'Saat 02:00. Nöbet yerindesin, koğuş uyuyor. Tek işin uyanık kalmak — ve devriye geçtiğinde ayakta olmak.',
        reward: (s) => ({
          disiplin: Math.round(-8 + s * 20),
          enerji: -26,
          moral: Math.round(-8 + s * 8),
          kondisyon: -4,
        }),
        verdict: (s) =>
          s > 0.85
            ? 'İki saat, tek bir kez bile oturmadın. Sabaha karşı devredip ranzana döndün.'
            : s > 0.5
              ? 'Gözlerin birkaç kez kapandı ama devriyeye yakalanmadın.'
              : 'Nöbette uyuklarken yakalandın. Bu bölük defterine yazılır.',
      };
      return { ...b, scenes: [...b.scenes, nobet] };
    }

    return b;
  });

  return { ...g, blocks: bloklar };
}

const zenginlestir = (g: Day): Day =>
  gunlukGorevler({ ...g, blocks: g.blocks.map(blokZenginlestir) });

/**
 * Dikey dilim: 1–5. günler yazıldı.
 *  1. gün sevk günü (öğlen varış, yerleşme, bölge turu),
 *  2–3. gün alıştırma (görev ve ceza yok),
 *  4. gün denetim, 5. gün ANT-41 nezaket dersi.
 * Kalan günler aynı yapıya eklenecek.
 */
export const GUNLER: Day[] = [gun01, gun02, gun03, gun04, gun05].map(zenginlestir);

export const YAZILMIS_GUN_SAYISI = GUNLER.length;

export function gunGetir(no: number): Day | undefined {
  return GUNLER.find((g) => g.day === no);
}

/**
 * Bir sonraki öğüne kaç blok var. Tepsi ekranı bununla "bu öğün seni nereye
 * kadar götürür" diyebiliyor — oyuncu ne kadar yiyeceğine körlemesine değil,
 * bilerek karar veriyor.
 */
export function sonrakiOgunMesafesi(gun: number, blokIndex: number): number {
  const gunData = gunGetir(gun);
  if (!gunData) return 3;
  const bloklar = gunData.blocks;
  for (let i = blokIndex + 1; i < bloklar.length; i++) {
    if (bloklar[i].scenes.some((sc) => sc.kind === 'yemek')) return i - blokIndex;
  }
  // Günün son öğünüyse: kalan bloklar + gece.
  return bloklar.length - blokIndex + 2;
}
