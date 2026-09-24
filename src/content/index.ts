import type { Day, OgunAdi, Scene, TimeBlock } from '../engine/types';
import type { SpriteKey } from '../art';
import { GUZERGAH_BAKIS } from '../engine/yuruyus';
import { gun01 } from './day01';
import { gun02 } from './day02';
import { gun03 } from './day03';
import { gun04 } from './day04';
import { gun05 } from './day05';
import { gun06 } from './day06';
import { gun07 } from './day07';
import { gun08 } from './day08';
import { gun09 } from './day09';
import { gun10 } from './day10';
import { gun11 } from './day11';
import { gun12 } from './day12';
import { gunGorevleri } from './gorevTakvimi';
import { kosulTutar } from './telefon/motor';
import type { TelefonDurumu } from './telefon/tipler';
import { geceRutini, sabahDenetimi, sabahRutini } from './rutin';

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
  { hedef: string; adim: number; mekan: SpriteKey; manzara: SpriteKey[]; sivil?: boolean }
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
  ders: { hedef: 'Sınıfa', adim: 4, mekan: 'kisla', manzara: ['bayrak', 'agac', 'revir'] },
  kahvalti: { hedef: 'Yemekhaneye', adim: 3, mekan: 'kisla', manzara: ['bayrak', 'agac'] },
  ogle: { hedef: 'Yemekhaneye', adim: 3, mekan: 'kisla', manzara: ['agac', 'kisla'] },
  'aksam-yemek': { hedef: 'Yemekhaneye', adim: 3, mekan: 'kisla', manzara: ['agac', 'bayrak'] },
  serbest: { hedef: 'Avluya', adim: 3, mekan: 'kantinBina', manzara: ['kisla', 'agac', 'ankesor'] },
  'son-yoklama': { hedef: 'Koğuşa', adim: 3, mekan: 'kisla', manzara: ['ankesor', 'agac'] },
};

/**
 * Sevk gününün kendine özgü yolu: nizamiyeden koğuşa üniforma daha torbada,
 * sivil kıyafetle yürünüyor; giyinme koğuşta. Günün geri kalanı her günkü
 * gibi — eskiden turdan sonraki bloklar yürüyüşsüzdü ve ilk içtimadan
 * yemekhaneye, oradan avluya ışınlanıyordun.
 */
const SEVK_YOLLARI: typeof YOLLAR = {
  kogus: {
    hedef: 'Koğuşa',
    adim: 5,
    mekan: 'kisla',
    manzara: ['bayrak', 'agac', 'kisla', 'agac'],
    sivil: true,
  },
};

function blokZenginlestir(b: TimeBlock): TimeBlock {
  const anahtar = b.id.replace(/^d\d+-/, '');
  const sevkGunu = b.id.startsWith('d1-');
  const yol = (sevkGunu && SEVK_YOLLARI[anahtar]) || YOLLAR[anahtar];

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
      bakis: GUZERGAH_BAKIS[anahtar] ?? 'patika',
      sivil: yol.sivil,
    };
    scenes = [yolSahnesi, ...scenes];
  }

  return scenes === b.scenes ? b : { ...b, scenes };
}

/**
 * Günün tekrar eden düzenini kıran görevler. Hepsi gün numarasından
 * (görev takviminden) türetiliyor: her oynayışta aynı, kayıttan dönünce
 * karşına başka bir gün çıkmıyor.
 */
function gunlukGorevler(g: Day): Day {
  const gorev = gunGorevleri(g);
  const bloklar = g.blocks.map((b) => {
    const anahtar = b.id.replace(/^d\d+-/, '');

    // Gece: yoklamadan önce üniforma yerine, pijama ve terlik. İlk gece de var —
    // dolap o gün yerleştirildi. Nöbet varsa aşağıda yoklamanın sonuna ekleniyor.
    if (anahtar === 'son-yoklama') b = geceRutini(b);

    // Sabah rutini: yatak → giyinme → postal → tıraş, sonra içtima. İlk gün
    // koğuşa yeni girildiği için yok; eksik adımlar kendiliğinden ekleniyor.
    if (anahtar === 'kalkis' && g.day >= 2) return sabahRutini(b);
    // Rutinin karşılığı içtimada: Onbaşı sırayı dolaşıyor, kusura şınav.
    if (anahtar === 'ictima' && g.day >= 2) return sabahDenetimi(b);

    // Mıntıka temizliği kışlanın günlük rutini: kahvaltıdan önce avlu toplanır.
    // İlk tam günden itibaren var — 2. günde mıntıkaya yürüyüp bir satır okuyup
    // yemekhaneye geçiyordun. Zorluk gün numarasından geldiği için 2. gün hafif.
    if (anahtar === 'mintika' && g.day >= 2) {
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

    // Ceza akşam içtimasında okunur; hangi gün olduğu görev takviminde.
    if (anahtar === 'aksam-ictima' && gorev.ceza) {
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

    // Nöbet listesi 4. gün asılıyor, ilk nöbet 10. gece (görev takvimi).
    if (anahtar === 'son-yoklama' && gorev.nobet) {
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
 * Yazılı günler. 1. gün sevk, 2–3 alıştırma, 4 denetim, 5 ANT-41;
 * 6–12 ikinci hafta: hesap, bir hafta, rutin, atış, ilk nöbet, bot, hatırlama.
 * Günlerin teması telefon/gunler/gNN.ts ile aynı; takvim yayin-plani.md §4.
 */
export const GUNLER: Day[] = [
  gun01, gun02, gun03, gun04, gun05, gun06, gun07, gun08, gun09, gun10, gun11, gun12,
].map(zenginlestir);

export const YAZILMIS_GUN_SAYISI = GUNLER.length;

export function gunGetir(no: number): Day | undefined {
  return GUNLER.find((g) => g.day === no);
}

/**
 * Bloğun `bas` sırasından itibaren koşulu tutan ilk sahne. Koşulsuz sahne
 * her zaman açık; hiçbiri açık değilse null. Her blokta en az bir koşulsuz
 * sahne olması içerik testinde zorunlu, o yüzden blok başında null dönmez.
 */
export function acikSahne(blok: TimeBlock, bas: number, durum: TelefonDurumu): number | null {
  for (let i = bas; i < blok.scenes.length; i++) {
    if (kosulTutar(blok.scenes[i].kosul, durum)) return i;
  }
  return null;
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
