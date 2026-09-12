import type { SpriteKey } from '../art';

/**
 * Yol sahnesinin geometrisi. Burada React yok, Skia yok, sadece sayı —
 * çünkü bu hesabın sonucu hem çizime hem de parmağın yola değip
 * değmediğine bakan jeste gidiyor ve jest UI thread'inde worklet olarak
 * koşuyor. Worklet'e taşınabilen tek şey düz veri.
 *
 * Üç kamera var ve hepsi aynı sözleşmeyi dolduruyor: yolun ortasından
 * geçen bir örnek dizisi. Her örnekte ekran konumu ve o noktadaki
 * perspektif ölçeği duruyor. Asker, yol şeridi, gölge, ayak izi — hepsi
 * bu tek diziden türüyor.
 */
export type Bakis = 'patika' | 'perspektif' | 'yan';

/** Yolun ortasından alınan örnek sayısı. Ne kadar çok, kıvrım o kadar yumuşak. */
export const ORNEK = 64;

/**
 * Hangi güzergâh hangi kameradan çekiliyor. Mantık mesafe değil, niyet:
 * uzağa gidiyorsan yol ufka doğru daralır, iki bina arası yürüyorsan
 * yandan bakılır, avlunun içinde dolaşıyorsan patika kıvrılır.
 */
export const GUZERGAH_BAKIS: Record<string, Bakis> = {
  ictima: 'perspektif',
  'egitim-sabah': 'perspektif',
  talim: 'perspektif',
  'aksam-ictima': 'perspektif',

  kahvalti: 'yan',
  ogle: 'yan',
  'aksam-yemek': 'yan',
  serbest: 'yan',
  ders: 'yan',

  denetim: 'patika',
  mintika: 'patika',
  'son-yoklama': 'patika',
};

export const BAKIS_ADI: Record<Bakis, string> = {
  patika: 'Patika — avlunun içi',
  perspektif: 'Perspektif — ufka doğru',
  yan: 'Yan — bina arası',
};

/** Askerî yürüyüş temposu: saniyede ~2 adım. */
export const KADANS = 0.52;

/** Bu orandan sonra parmak devreden çıkıyor, son adımları asker kendi atıyor. */
export const VARIS_ESIGI = 0.9;

/** Parmak yoldan bu kadar uzaklaşırsa adım işlemiyor. */
export const TOLERANS = 66;

/**
 * Parmak askeri yolun en fazla bu kadarı kadar önünden çekebiliyor.
 *
 * Olmadığı sürümde tek bir dokunuş hedefi dokunduğun yere taşıyordu:
 * yolun ortasına basınca asker oraya kadar, sonuna yakın basınca baştan
 * sona yürüyordu. Yani gidilen yol, sürüklediğin kadar değil dokunduğun
 * yer kadar oluyordu. Tavan bunu düzeltiyor — askeri yürütmek için onu
 * gerçekten yol boyunca çekmen gerekiyor.
 */
export const LIDER_PAYI = 0.1;

/** Kapıya "dokundun" sayılmak için gereken yakınlık. */
const KAPI_YARICAPI = 24;

/** Bu orandan öncesinde kapıya dokunma sayılmıyor. */
const KAPI_ESIGI = 0.72;

/**
 * Yürüyüşün baştan sona kaç saniye sürdüğü. Asker her güzergâhta aynı
 * hızda yürüyor; uzun güzergâh uzun sürüyor çünkü yol uzun, asker yavaş
 * olduğu için değil.
 */
export function yurumeSuresi(adim: number) {
  return 1.6 + adim * 0.42;
}

/** Ufuk çizgisi: üstü gökyüzü, altı kışla zemini. */
export const UFUK_ORANI = 0.36;

/** Hedef adından türeyen sabit kıvrım: aynı yer her gün aynı yolla gidiliyor. */
export function tohum(ad: string) {
  let h = 0;
  for (let i = 0; i < ad.length; i++) h = (h * 31 + ad.charCodeAt(i)) % 997;
  return h / 997;
}

/** Sabit ama düzensiz görünen sayı — her karede aynı sonucu veriyor. */
export function serpinti(i: number) {
  const n = Math.sin(i * 12.9898) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Sahnede duran bir şeyin yolun başındaki ve sonundaki hâli. Aradaki her
 * şey doğrusal karışım. Manzara da hedef bina da bununla yerleşiyor:
 * patikada yana kayarlar, perspektifte büyüyerek üstüne gelirler,
 * yan bakışta hızla geçip giderler — üçü de aynı iki uçlu tarif.
 */
export type Yerlesim = {
  x0: number;
  y0: number;
  o0: number;
  x1: number;
  y1: number;
  o1: number;
};

export type YolGeometrisi = {
  bakis: Bakis;
  en: number;
  yuk: number;
  ufuk: number;
  /** Yolun ortası, ORNEK adet örnek. t = i / (ORNEK - 1). */
  ox: number[];
  oy: number[];
  /** O noktadaki perspektif ölçeği; 1 = kameranın dibinde. */
  oolcek: number[];
  /** Yol şeridinin o noktadaki yarı genişliği. */
  oen: number[];
  /** Zemine basan her şeyin sığabileceği en alt satır. */
  taban: number;
  bina: Yerlesim;
  manzara: { sprite: SpriteKey; yer: Yerlesim }[];
};

type Girdi = {
  bakis: Bakis;
  en: number;
  yuk: number;
  hedef: string;
  adim: number;
  manzara: SpriteKey[];
};

/**
 * Patika: avlunun içinde kıvrılan yol. Kamera hafif yukarıdan bakıyor,
 * bu yüzden yukarı kıvrılan kısımlar uzak sayılıyor ve asker orada
 * küçülüyor. Eskiden ölçek sabitti ve yol düz bir masa gibi duruyordu.
 */
function patika({ en, yuk, hedef, adim }: Girdi) {
  const s = tohum(hedef);
  const taban = yuk * 0.72;
  const genlik = yuk * 0.15;
  const kivrim = 1.4 + (adim % 3) * 0.45;

  const ox: number[] = [];
  const oy: number[] = [];
  const oolcek: number[] = [];
  const oen: number[] = [];

  for (let i = 0; i < ORNEK; i++) {
    const t = i / (ORNEK - 1);
    const y = taban + Math.sin(t * Math.PI * kivrim + s * 6.28) * genlik;
    // Ölçek y'den türüyor: yukarısı uzak, aşağısı yakın.
    const derinlik = (y - (taban - genlik)) / (genlik * 2);
    const olcek = 0.84 + derinlik * 0.26;
    ox.push(22 + (en - 48) * t);
    oy.push(y);
    oolcek.push(olcek);
    oen.push(en * 0.05 * olcek);
  }

  return { ox, oy, oolcek, oen, taban: yuk };
}

/**
 * Perspektif: yol ekranın dibinden ufka doğru daralarak uzuyor, asker
 * sırtı dönük uzaklaşıyor. Derinlik bir kamera mesafesi olarak modelleniyor
 * (z = 1 yakın, z büyüdükçe uzak) ve ekran konumu 1/z ile küçülüyor —
 * yani yolun son çeyreği ilk çeyreğinden çok daha az yer kaplıyor, tam da
 * gerçek bir yola bakarken olduğu gibi.
 */
function perspektif({ en, yuk, hedef }: Girdi) {
  const s = tohum(hedef);
  const ufuk = yuk * UFUK_ORANI;
  const yakin = yuk - 12;
  const derinlik = 2.4;

  // Kaçış noktası ufkun biraz üstünde ve merkezin biraz yanında.
  const kacisX = en * (0.4 + s * 0.2);
  const yakinX = en * 0.5;

  const ox: number[] = [];
  const oy: number[] = [];
  const oolcek: number[] = [];
  const oen: number[] = [];

  for (let i = 0; i < ORNEK; i++) {
    const t = i / (ORNEK - 1);
    const z = 1 + t * derinlik;
    const olcek = 1 / z;
    // Yol dümdüz değil: uzaklaşırken hafif bir yalpa var, o da 1/z ile sönüyor.
    const yalpa = Math.sin(t * Math.PI * 1.3 + s * 6.28) * en * 0.05 * olcek;
    ox.push(kacisX + (yakinX - kacisX) * olcek + yalpa);
    oy.push(ufuk + (yakin - ufuk) * olcek);
    oolcek.push(olcek);
    oen.push(en * 0.115 * olcek);
  }

  return { ox, oy, oolcek, oen, taban: yuk };
}

/**
 * Yan: asker soldan sağa düz yürüyor, arkasındaki dünya katman katman
 * kayıyor. Derinlik ölçekten değil paralakstan geliyor — uzak kışla
 * neredeyse duruyor, öndeki otlar fırlıyor.
 */
function yan({ en, yuk }: Girdi) {
  const y = yuk * 0.8;

  const ox: number[] = [];
  const oy: number[] = [];
  const oolcek: number[] = [];
  const oen: number[] = [];

  for (let i = 0; i < ORNEK; i++) {
    const t = i / (ORNEK - 1);
    ox.push(24 + (en - 52) * t);
    oy.push(y);
    oolcek.push(1);
    oen.push(en * 0.055);
  }

  return { ox, oy, oolcek, oen, taban: yuk };
}

/** Hedef mekanın yolun başındaki ve sonundaki hâli. */
function binaYerlesimi(bakis: Bakis, en: number, yuk: number, son: { x: number; y: number }) {
  if (bakis === 'perspektif') {
    // Kamera sabit duruyor, uzaklaşan asker. Bina da dünyada sabit: yolun
    // bittiği yerde, askerin bir adım ötesinde. Bir önceki denemede bina
    // ekranda öne doğru geliyordu ve asker onu geçip arkasında kalıyordu —
    // sabit kameralı bir çekimde yaklaştığını gösteren şey binanın
    // büyümesi değil, askerin küçülmesi.
    return { x0: son.x, y0: son.y - 3, o0: 0.72, x1: son.x, y1: son.y - 3, o1: 1.05 };
  }
  if (bakis === 'yan') {
    // Sağdan kadraja giriyor; dünya kaydıkça sana doğru geliyor.
    return { x0: en + 60, y0: yuk * 0.8, o0: 1, x1: en * 0.74, y1: yuk * 0.8, o1: 1.15 };
  }
  return { x0: son.x, y0: son.y, o0: 0.72, x1: son.x, y1: son.y, o1: 1.1 };
}

/** Manzara parçalarının yolun başındaki ve sonundaki hâli. */
function manzaraYerlesimi(
  bakis: Bakis,
  en: number,
  yuk: number,
  ufuk: number,
  manzara: SpriteKey[],
  s: number,
) {
  const adet = Math.max(1, manzara.length);

  return manzara.map((sprite, i) => {
    const pay = adet === 1 ? 0.5 : i / (adet - 1);
    // Katman derinliği: sıradaki her parça bir öncekinden biraz daha yakın.
    const derin = 0.25 + ((i * 0.37 + s) % 1) * 0.75;

    if (bakis === 'perspektif') {
      // Ufukta toplanıp yaklaştıkça yanlara açılıyorlar — yolun kenarındaki
      // ağaçların yanından geçerken gördüğün şey bu.
      const yon = pay < 0.5 ? -1 : 1;
      const uzaklik = 0.3 + Math.abs(pay - 0.5) * 1.4;
      return {
        sprite,
        yer: {
          x0: en * 0.5 + yon * en * 0.06 * uzaklik,
          y0: ufuk + 16,
          o0: 0.3,
          x1: en * 0.5 + yon * en * 0.95 * uzaklik,
          y1: yuk * 0.98,
          o1: 2.2,
        },
      };
    }

    if (bakis === 'yan') {
      // Ekrana baştan yayılıyorlar, yürüdükçe sola akıyorlar. Derinlik
      // paralakstan geliyor: uzaktaki kışla neredeyse duruyor, öndeki ağaç
      // kadrajdan fırlayıp gidiyor. Hepsi sağda başlasaydı yolun yarısına
      // kadar bomboş bir sahneye bakardın.
      const basla = en * (0.12 + pay * 0.92);
      const y = yuk * (0.62 + derin * 0.16);
      const olcek = 0.7 + derin * 0.7;
      return {
        sprite,
        yer: {
          x0: basla,
          y0: y,
          o0: olcek,
          x1: basla - en * (0.25 + derin * 1.25),
          y1: y,
          o1: olcek,
        },
      };
    }

    // Patika: ufkun dibinde duruyorlar, yürüdükçe hafifçe geriye kayıyorlar.
    const basla = en * (0.08 + pay * 0.78);
    return {
      sprite,
      yer: {
        x0: basla,
        y0: ufuk + 8 + derin * 10,
        o0: 0.6 + derin * 0.5,
        x1: basla - (16 + derin * 42),
        y1: ufuk + 8 + derin * 10,
        o1: 0.6 + derin * 0.5,
      },
    };
  });
}

export function yolKur(girdi: Girdi): YolGeometrisi {
  const { bakis, en, yuk, hedef, manzara } = girdi;
  const orta =
    bakis === 'perspektif' ? perspektif(girdi) : bakis === 'yan' ? yan(girdi) : patika(girdi);

  const ufuk = yuk * UFUK_ORANI;
  const sonIndeks = ORNEK - 1;

  return {
    bakis,
    en,
    yuk,
    ufuk,
    ...orta,
    bina: binaYerlesimi(bakis, en, yuk, { x: orta.ox[sonIndeks], y: orta.oy[sonIndeks] }),
    manzara: manzaraYerlesimi(bakis, en, yuk, ufuk, manzara, tohum(hedef)),
  };
}

/**
 * t oranındaki ekran konumu ve ölçeği. Worklet: hem çizim hem jest bunu
 * UI thread'inde çağırıyor.
 */
export function konumBul(ox: number[], oy: number[], oolcek: number[], t: number) {
  'worklet';
  const n = ox.length;
  const ham = Math.max(0, Math.min(1, t)) * (n - 1);
  const i = Math.min(n - 2, Math.floor(ham));
  const k = ham - i;
  return {
    x: ox[i] + (ox[i + 1] - ox[i]) * k,
    y: oy[i] + (oy[i + 1] - oy[i]) * k,
    olcek: oolcek[i] + (oolcek[i + 1] - oolcek[i]) * k,
  };
}

/**
 * Parmağın yola en yakın düştüğü oran ve oraya uzaklığı. Yol kıvrıldığı
 * için "en yakın nokta" tek tek her parçaya bakarak bulunuyor; ORNEK
 * kadar parça var ve bu her parmak hareketinde UI thread'inde koşuyor,
 * o yüzden içeride tek bir döngüden fazlası yok.
 */
export function yolaIzdusum(ox: number[], oy: number[], px: number, py: number) {
  'worklet';
  const n = ox.length;
  let enIyiT = 0;
  let enIyiMesafe = Infinity;

  for (let i = 0; i < n - 1; i++) {
    const vx = ox[i + 1] - ox[i];
    const vy = oy[i + 1] - oy[i];
    const uzunluk2 = vx * vx + vy * vy;
    const k =
      uzunluk2 > 0
        ? Math.max(0, Math.min(1, ((px - ox[i]) * vx + (py - oy[i]) * vy) / uzunluk2))
        : 0;
    const nx = ox[i] + vx * k;
    const ny = oy[i] + vy * k;
    const mesafe = Math.sqrt((px - nx) * (px - nx) + (py - ny) * (py - ny));
    if (mesafe < enIyiMesafe) {
      enIyiMesafe = mesafe;
      enIyiT = (i + k) / (n - 1);
    }
  }

  return { t: enIyiT, mesafe: enIyiMesafe };
}

/**
 * Parmak yolun bittiği noktanın dibinde mi? Perspektif kamerada yolun son
 * onda biri ekranda yalnızca birkaç piksel tutuyor; oran hesabına bakınca
 * oyuncu kapının önünde duruyor ama eşiğe "varmamış" sayılıyordu. Ekran
 * mesafesine bakmak bunu çözüyor: kapıya dokunduysan vardın.
 *
 * Yarıçap dar ve ayrıca yolun sonuna gelmiş olman gerekiyor. Yarıçap
 * TOLERANS kadar geniş olduğunda perspektif kamerada sorun çıkıyordu:
 * yolun uzak yarısı ekranda avuç içi kadar yer tuttuğu için oraya
 * yapılan herhangi bir dokunuş "kapıdayım" sayılıyor ve asker tek
 * dokunuşla bütün yolu yürüyordu.
 */
export function kapiyaYakin(
  ox: number[],
  oy: number[],
  px: number,
  py: number,
  oran: number,
) {
  'worklet';
  if (oran < KAPI_ESIGI) return false;
  const n = ox.length - 1;
  return Math.sqrt((px - ox[n]) * (px - ox[n]) + (py - oy[n]) * (py - oy[n])) < KAPI_YARICAPI;
}

/** İki uçlu tariften t anındaki hâli. Worklet. */
export function yerlesimAra(y: Yerlesim, t: number) {
  'worklet';
  return {
    x: y.x0 + (y.x1 - y.x0) * t,
    y: y.y0 + (y.y1 - y.y0) * t,
    olcek: y.o0 + (y.o1 - y.o0) * t,
  };
}
