import { C } from '../theme/palette';
import type { SpriteDef } from '../ui/PixelSprite';

/**
 * Ortak palet anahtarları:
 *   .  saydam      k  koyu hat        u  üniforma      U  üniforma gölge
 *   s  ten         S  ten gölge       b  deri/bot      m  pirinç/madeni
 *   w  bez/çarşaf  W  bez gölge       g  metal         G  metal gölge
 *   r  pas/kırmızı t  çay/sıcak       n  gece mavisi
 */
const P = {
  '.': '',
  k: C.ink,
  u: '#6E7444',
  U: '#4E5330',
  s: '#C9A277',
  S: '#9A7852',
  b: '#4A3524',
  m: C.brass,
  w: C.canvas,
  W: '#B3A88C',
  g: '#7C8189',
  G: '#4E5359',
  r: C.rust,
  t: C.tea,
  n: C.steel,
  o: C.olive,
  h: '#565B36',
  // Üniformanın ışık alan kenarı (ışık sol üstten) ve postal parlaması.
  y: '#858C5A',
  l: '#6B5140',
  // Cep kapağı: üniformanın gölge tonu; soyunurken ayrıca silinebilsin.
  q: '#4E5330',
} as Record<string, string>;

export const SOLDIER: SpriteDef = {
  palette: P,
  rows: [
    '.....kkkkkk.....',
    '....khhhhhhk....',
    '...khhhhhhhhk...',
    '...kUUUUUUUUk...',
    '...ksssssssSk...',
    '.kSsskssssksSSk.',
    '..kssssSssssSk..',
    '...ksssSSssSk...',
    '.....kSSSSk.....',
    '..kyuuukkuuuUk..',
    '.kyuuuusSuuuuUk.',
    'kyukuuuuuuuukuUk',
    'kyukqmquuqmqkuUk',
    'kyukuuuUuuuUkuUk',
    'kyukuuuuuuuUkuUk',
    'ksskbbbmmbbbksSk',
    '...kuuuuuuuUk...',
    '...kuuukkuuUk...',
    '...kuuukkuuUk...',
    '...kuuUkkuuUk...',
    '...kUUUkkUUUk...',
    '..klbbbkklbbbk..',
    '..kbbbbkkbbbbk..',
    '..kkkkk..kkkkk..',
  ],
};

/**
 * Çavuş: askerin gövdesi, kırmızı bere ve pirinç rozet, omuzda pirinç
 * apolet, bıyık. Aynı ızgara; yan yana durunca kim olduğu ilk bakışta belli.
 */
export const SERGEANT: SpriteDef = {
  palette: { ...P, h: C.rust },
  rows: SOLDIER.rows.map((satir, i) => {
    const degisen: Record<number, string> = {
      1: '....krrrrrrk....',
      2: '...kmrrrrrrrk...',
      3: '...krrrrrrrrk...',
      7: '...kssbbbbsSk...',
      9: '..kmmuukkuummk..',
    };
    return degisen[i] ?? satir;
  }),
};

export const BUNK_MESSY: SpriteDef = {
  palette: P,
  rows: [
    '........................',
    '..kkk...................',
    '..kwWk..wWw.............',
    '..kwwk.wWWWw...ww.......',
    '..kkkkwWWwWWWwwWWw......',
    '.kwWWWWwWWWWWWWWWWWk....',
    'kwWWWWWWWWWWWWWWWWWWk...',
    'kwwwwwwwwwwwwwwwwwwwk...',
    'kGGGGGGGGGGGGGGGGGGGk...',
    'kGkkkkkkkkkkkkkkkkkGk...',
    'kGk...............kGk...',
    'kGk...............kGk...',
    'kkk...............kkk...',
    '.g.................g....',
  ],
};

export const BUNK_TIDY: SpriteDef = {
  palette: P,
  rows: [
    '........................',
    '........................',
    '........................',
    '.....kkkkkkkkkk.........',
    '.kkkkkwwwwwwwwkkkkkk....',
    'kwwwwwwwwwwwwwwwwwwwk...',
    'kwWWWWWWWWWWWWWWWWWWk...',
    'kwwwwwwwwwwwwwwwwwwwk...',
    'kGGGGGGGGGGGGGGGGGGGk...',
    'kGkkkkkkkkkkkkkkkkkGk...',
    'kGk...............kGk...',
    'kGk...............kGk...',
    'kkk...............kkk...',
    '.g.................g....',
  ],
};

export const RIFLE: SpriteDef = {
  palette: P,
  rows: [
    '..........kk............',
    '.......kkkGGkkk.........',
    'kkkkkkkGGGGGGGGkkkkkkkk.',
    'kbbbbkGGGGGGGGGGGGGGGGk.',
    'kbbbbkGGkkkGGkkkkkkkkkk.',
    '.kbbbkGkk..kGk..........',
    '..kbbkkk...kGk..........',
    '...kkk......kk..........',
  ],
};

export const TRAY: SpriteDef = {
  palette: P,
  rows: [
    'kkkkkkkkkkkkkkkk',
    'kGGGGGGGGGGGGGGk',
    'kGkkkkGkkkkGkkGk',
    'kGkttkGkoookGkwk',
    'kGkttkGkoookGkwk',
    'kGkkkkGkkkkGkkGk',
    'kGGGGGGGGGGGGGGk',
    'kGkkkkkkkkkkkkGk',
    'kGGGGGGGGGGGGGGk',
    'kkkkkkkkkkkkkkkk',
  ],
};

export const BOOT: SpriteDef = {
  palette: P,
  rows: [
    '..kkkkkk....',
    '..kbbbbk....',
    '..kbmmbk....',
    '..kbbbbk....',
    '..kbmmbk....',
    '..kbbbbk....',
    '..kbbbbkkk..',
    '..kbbbbbbbk.',
    '.kbbbbbbbbbk',
    '.kbbbbbbbbbk',
    '.kkkkkkkkkkk',
    '..kkkkkkkkk.',
  ],
};

export const SUN: SpriteDef = {
  palette: P,
  rows: [
    '.....mm.....',
    '.m...mm...m.',
    '..m..mm..m..',
    '...kkkkkk...',
    '..kmmmmmmk..',
    'mmkmmmmmmkmm',
    'mmkmmmmmmkmm',
    '..kmmmmmmk..',
    '...kkkkkk...',
    '..m..mm..m..',
    '.m...mm...m.',
    '.....mm.....',
  ],
};

export const MOON: SpriteDef = {
  palette: P,
  rows: [
    '....kkkk....',
    '..kknnnnkk..',
    '..knnnnnnk..',
    '.knnnnnnkk..',
    '.knnnnnk....',
    'knnnnnk.....',
    'knnnnnk.....',
    '.knnnnnk....',
    '.knnnnnnkk..',
    '..knnnnnnk..',
    '..kknnnnkk..',
    '....kkkk....',
  ],
};

export const BARRACKS: SpriteDef = {
  palette: P,
  rows: [
    '...............kk...............',
    '..............krrk..............',
    '..............krrk..............',
    '.....kkkkkkkkkkkkkkkkkkkk.......',
    '....kUUUUUUUUUUUUUUUUUUUUk......',
    '...kUUUUUUUUUUUUUUUUUUUUUUk.....',
    '..kkkkkkkkkkkkkkkkkkkkkkkkkk....',
    '..kuuuuuuuuuuuuuuuuuuuuuuuuk....',
    '..kukkkukkkukkkukkkukkkukkuk....',
    '..kuknkuknkuknkuknkuknkukkuk....',
    '..kuknkuknkuknkuknkuknkukkuk....',
    '..kukkkukkkukkkukkkukkkukkuk....',
    '..kuuuuuuuuuuuuuuuuuuuuuuuuk....',
    '..kukkkukkkukkhhhkkukkkukkuk....',
    '..kuknkuknkukhhhhhkuknkukkuk....',
    '..kuknkuknkukhhhhhkuknkukkuk....',
    '..kukkkukkkukhhhhhkukkkukkuk....',
    '..kuuuuuuuuuukhhhhhkuuuuuuuk....',
    '..kkkkkkkkkkkkkkkkkkkkkkkkkk....',
    '.gggggggggggggggggggggggggggg...',
  ],
};

export const DOGTAG: SpriteDef = {
  palette: P,
  rows: [
    '...kk.....',
    '..k..k....',
    '.k....k...',
    '.k....k...',
    '..kkkkk...',
    '..kgggk...',
    '..kgkgk...',
    '..kgggk...',
    '..kgkgk...',
    '..kgggk...',
    '..kgggk...',
    '..kkkkk...',
  ],
};

export const WHISTLE: SpriteDef = {
  palette: P,
  rows: [
    '....kkkkkkk.',
    '...kGGGGGGGk',
    '.kkGGkkkkGGk',
    'kGGGGk..kGGk',
    'kGGGGk..kGGk',
    '.kkGGkkkkGGk',
    '...kGGGGGGGk',
    '....kkkkkkk.',
  ],
};

// ── Eşyalar ──────────────────────────────────────────────────────────
// Hepsi 12x12; envanter ve dükkân listelerinde aynı hizada dursunlar diye.

export const TELEFON: SpriteDef = {
  palette: P,
  rows: [
    '..kkkkkkkk..',
    '..kggggggk..',
    '..kgnnnngk..',
    '..kgnnnngk..',
    '..kgnnnngk..',
    '..kgnnnngk..',
    '..kgnnnngk..',
    '..kgnnnngk..',
    '..kggggggk..',
    '..kggmmggk..',
    '..kggggggk..',
    '..kkkkkkkk..',
  ],
};

export const KONTOR: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '.kkkkkkkkkk.',
    '.kmmmmmmmmk.',
    '.kmkkkkkkmk.',
    '.kmkwwwwkmk.',
    '.kmkwwwwkmk.',
    '.kmkkkkkkmk.',
    '.kmmmmmmmmk.',
    '.kkkkkkkkkk.',
    '............',
    '............',
    '............',
  ],
};

export const SABUN: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '...kkkkk....',
    '..kwwwwwk...',
    '...kkkkk....',
    '............',
    '.kkkkkkkkk..',
    '.kwwwwwwwk..',
    '.kwWWWWWwk..',
    '.kwwwwwwwk..',
    '.kkkkkkkkk..',
    '............',
    '............',
  ],
};

export const TERLIK: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '..kkkkkk....',
    '.knnnnnnk...',
    '.knkkkknk...',
    '.knnnnnnk...',
    '.knnnnnnk...',
    '.knnnnnnk...',
    '..knnnnk....',
    '..knnnnk....',
    '..kkkkkk....',
    '............',
    '............',
  ],
};

export const CORAP: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '..kkkkkk....',
    '..kwwwwk....',
    '..kWWWWk....',
    '..kwwwwk....',
    '..kwwwwk....',
    '..kwwwwk....',
    '..kwwwkkk...',
    '..kwwwwwwk..',
    '..kwwwwwwk..',
    '..kkkkkkkk..',
    '............',
  ],
};

export const KREM: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '....kkkk....',
    '....kmmk....',
    '...kkkkkk...',
    '...kwwwwk...',
    '...kwttwk...',
    '...kwttwk...',
    '...kwwwwk...',
    '...kwwwwk...',
    '...kkkkkk...',
    '............',
    '............',
  ],
};

export const KITAP: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '.kkkkkkkkkk.',
    '.krrrrrrrrk.',
    '.krwwwwwwrk.',
    '.krwkkkkwrk.',
    '.krwwwwwwrk.',
    '.krwkkkkwrk.',
    '.krwwwwwwrk.',
    '.krrrrrrrrk.',
    '.kkkkkkkkkk.',
    '............',
    '............',
  ],
};

export const DEFTER: SpriteDef = {
  palette: P,
  rows: [
    '..........k.',
    '.kkkkkkk.km.',
    '.kwwwwwk.km.',
    '.kwkkkwk.kb.',
    '.kwwwwwk.kb.',
    '.kwkkkwk.kb.',
    '.kwwwwwk.kb.',
    '.kwkkkwk.kb.',
    '.kwwwwwk.kb.',
    '.kkkkkkk.kk.',
    '............',
    '............',
  ],
};

export const TESBIH: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '....kkkk....',
    '..kkmmmmkk..',
    '..km....mk..',
    '.km......mk.',
    '.km......mk.',
    '..km....mk..',
    '..kkmmmmkk..',
    '....kkkk....',
    '.....km.....',
    '.....km.....',
    '.....kk.....',
  ],
};

export const SIGARA: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '..kkkkkkk...',
    '..kwwwwwk...',
    '..kwrrrwk...',
    '..kwrrrwk...',
    '..kwwwwwk...',
    '..kwwwwwk...',
    '..kwwwwwk...',
    '..kwwwwwk...',
    '..kkkkkkk...',
    '............',
    '............',
  ],
};

export const CAKMAK: SpriteDef = {
  palette: P,
  rows: [
    '.....t......',
    '....ttt.....',
    '.....t......',
    '...kkkkk....',
    '...kgggk....',
    '...kgmgk....',
    '...kgggk....',
    '...krrrk....',
    '...krrrk....',
    '...krrrk....',
    '...kkkkk....',
    '............',
  ],
};

export const ATISTIRMALIK: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '..kkkkkkkk..',
    '.kwwwwwwwwk.',
    '.kwtttttwwk.',
    '.kwtkkktwwk.',
    '.kwtttttwwk.',
    '.kwwwwwwwwk.',
    '.kwwwwwwwwk.',
    '..kkkkkkkk..',
    '............',
    '............',
    '............',
  ],
};

export const ENERJI_ICECEGI: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '....kkkk....',
    '...kkkkkk...',
    '...kgoogk...',
    '...kgoogk...',
    '...kgoogk...',
    '...kgoogk...',
    '...kgoogk...',
    '...kgoogk...',
    '...kkkkkk...',
    '............',
    '............',
  ],
};

export const TISORT: SpriteDef = {
  palette: P,
  rows: [
    '..kk....kk..',
    '.kwwkkkkwwk.',
    'kwwwwwwwwwwk',
    'kwwwwwwwwwwk',
    'kwkwwwwwwkwk',
    '.kkwwwwwwkk.',
    '..kwwwwwwk..',
    '..kwwwwwwk..',
    '..kwWWWWwk..',
    '..kwwwwwwk..',
    '..kkkkkkkk..',
    '............',
  ],
};

export const BOT_BOYASI: SpriteDef = {
  palette: P,
  rows: [
    '......kkkk..',
    '.....kbbbbk.',
    '....kbbbbbk.',
    '..kkkkkkkkk.',
    '.kmmmmmmmmk.',
    '.kkkkkkkkkk.',
    '.kbbbbbbbbk.',
    '.kbbkkkkbbk.',
    '.kbbkbbkbbk.',
    '.kbbkkkkbbk.',
    '.kbbbbbbbbk.',
    '.kkkkkkkkkk.',
  ],
};

export const TABANLIK: SpriteDef = {
  palette: P,
  rows: [
    '...kkkk.....',
    '..knnnnk....',
    '.knnnnnnk...',
    '.knnnnnnk...',
    '.knnnnnnk...',
    '..knnnnk....',
    '..knnnnk....',
    '..knnnnk....',
    '.knnnnnnk...',
    '.knnnnnnk...',
    '..knnnnk....',
    '...kkkk.....',
  ],
};

export const PUDRA: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '....kkkk....',
    '....kwwk....',
    '...kkkkkk...',
    '...kwwwwk...',
    '...kwoowk...',
    '...kwookk...',
    '...kwoowk...',
    '...kwwwwk...',
    '...kwwwwk...',
    '...kkkkkk...',
    '............',
  ],
};

export const TRAS_CANTASI: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '....kkkk....',
    '...kk..kk...',
    '.kkkkkkkkkk.',
    '.kbbbbbbbbk.',
    '.kbbbbbbbbk.',
    '.kkkkkkkkkk.',
    '.kbbbbbbbbk.',
    '.kbbkkkkbbk.',
    '.kbbbbbbbbk.',
    '.kkkkkkkkkk.',
    '............',
  ],
};

export const CAMASIR_TORBASI: SpriteDef = {
  palette: P,
  rows: [
    '...kkkkkk...',
    '..k.k..k.k..',
    '..kkkkkkkk..',
    '.kwwwwwwwwk.',
    'kwwwwwwwwwwk',
    'kwwwWWWWwwwk',
    'kwwwwwwwwwwk',
    'kwwwWWWWwwwk',
    'kwwwwwwwwwwk',
    'kwwwwwwwwwwk',
    '.kwwwwwwwwk.',
    '..kkkkkkkk..',
  ],
};

export const KILIT: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '....kkkk....',
    '...kggggk...',
    '..kgk..kgk..',
    '..kgk..kgk..',
    '.kkkkkkkkkk.',
    '.kmmmmmmmmk.',
    '.kmmmkkmmmk.',
    '.kmmmkkmmmk.',
    '.kmmmmkmmmk.',
    '.kmmmmmmmmk.',
    '.kkkkkkkkkk.',
  ],
};

export const CUZDAN: SpriteDef = {
  palette: P,
  rows: [
    '.....kk.....',
    '....k..k....',
    '...k....k...',
    '..k......k..',
    '.kkkkkkkkkk.',
    '.kbbbbbbbbk.',
    '.kbwwwwwwbk.',
    '.kbwkkkkwbk.',
    '.kbwwwwwwbk.',
    '.kbbbbbbbbk.',
    '.kbbbkkbbbk.',
    '.kkkkkkkkkk.',
  ],
};

/** Yürüyüş animasyonunun ikinci karesi: bacaklar açık, adım atılmış hâli. */
export const ASKER_ADIM: SpriteDef = {
  palette: P,
  rows: [
    '.....kkkkkk.....',
    '....khhhhhhk....',
    '...kuuuuuuuuk...',
    '...kssssssssk...',
    '...kskssssksk...',
    '...ksssSSsssk...',
    '...kssskksssk...',
    '....kssssssk....',
    '.....kSSSSk.....',
    '...kuuuuuuuuk...',
    '..kuuuuuuuuuuk..',
    '.kUuuuuuuuuuuUk.',
    '.kUummuuuuuuuUk.',
    '.kUuuuuuuuuuuUk.',
    '.kUubbbmmbbbuUk.',
    '.kUsuuuuuuuusUk.',
    '..kuuuuuuuuuuk..',
    '..kuuuu..uuuuk..',
    '.kuuuu....uuuuk.',
    '.kuuu......uuuk.',
    'kUUU........UUUk',
    'kbbb........bbbk',
    'kbbb........bbbk',
    'kkkk........kkkk',
  ],
};

// ── Kışla avlusu ─────────────────────────────────────────────────────

export const KANTIN_BINA: SpriteDef = {
  palette: P,
  rows: [
    '........................',
    '.....kkkkkkkkkkkkkk.....',
    '....kmmmmmmmmmmmmmmk....',
    '....kkkkkkkkkkkkkkkk....',
    '...kuuuuuuuuuuuuuuuuk...',
    '...kukkkkukkkkukkkkuk...',
    '...kuknnkuknnkuknnkuk...',
    '...kuknnkuknnkuknnkuk...',
    '...kukkkkukkkkukkkkuk...',
    '...kuuuuuuuuuuuuuuuuk...',
    '...kuuuukkkkkkuuuuuuk...',
    '...kuuuukhhhhkuuuuuuk...',
    '...kuuuukhhhhkuuuuuuk...',
    '...kuuuukhhhhkuuuuuuk...',
    '...kkkkkkkkkkkkkkkkkk...',
    '..gggggggggggggggggggg..',
  ],
};

export const ANKESOR: SpriteDef = {
  palette: P,
  rows: [
    '..kkkkkkkk..',
    '.kmmmmmmmmk.',
    '.kkkkkkkkkk.',
    '.kGnnnnnnGk.',
    '.kGnnnnnnGk.',
    '.kGnnnnnnGk.',
    '.kGnnnnnnGk.',
    '.kGnnkknnGk.',
    '.kGnnkknnGk.',
    '.kGnnnnnnGk.',
    '.kGnnnnnnGk.',
    '.kGnnnnnnGk.',
    '.kGnnnnnnGk.',
    '.kGnnnnnnGk.',
    '.kkkkkkkkkk.',
    '.kGGGGGGGGk.',
    '.kkkkkkkkkk.',
    '..gggggggg..',
  ],
};

export const AGAC: SpriteDef = {
  palette: P,
  rows: [
    '....oooo....',
    '..oooooooo..',
    '.oooooooooo.',
    '.oooooooooo.',
    'oooooooooooo',
    'oooooooooooo',
    '.oooooooooo.',
    '..oooooooo..',
    '....oooo....',
    '.....bb.....',
    '.....bb.....',
    '.....bb.....',
    '....bbbb....',
    '...gggggg...',
  ],
};

/**
 * Koğuş arkadaşları aynı gövdeden türüyor; kep ve üniforma tonu değişiyor.
 * Küçük ölçekte bile birbirinden ayırt edilebilsinler diye kontrast yüksek.
 */
/** Rengi açar: üniformanın ışık alan kenarı kendi kumaşından. */
function acik(hex: string, oran = 0.18): string {
  const n = parseInt(hex.slice(1), 16);
  const kanal = (v: number) => Math.min(255, Math.round(v + (255 - v) * oran));
  const r = kanal(n >> 16);
  const g = kanal((n >> 8) & 255);
  const b = kanal(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const arkadasVaryanti = (kep: string, uniforma: string, golge: string): SpriteDef => ({
  palette: { ...P, h: kep, u: uniforma, U: golge, q: golge, y: acik(uniforma) },
  rows: SOLDIER.rows,
});

export const ASKER_EMRE = arkadasVaryanti('#7A5230', '#7C6A3C', '#59492A');
export const ASKER_TOLGA = arkadasVaryanti('#42566A', '#59684A', '#3D4832');
export const ASKER_SERKAN = arkadasVaryanti('#8A7A2E', '#6E7444', '#4E5330');

// ── Mekanlar ─────────────────────────────────────────────────────────

export const BAYRAK_DIREGI: SpriteDef = {
  palette: P,
  rows: [
    '.gk.......',
    '.gkkkkkkk.',
    '.gkrrrrrk.',
    '.gkrwrrrk.',
    '.gkrrwrrk.',
    '.gkrrrrrk.',
    '.gkkkkkkk.',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    '.gk.......',
    'kkkkk.....',
    'kkkkk.....',
  ],
};

export const YEMEKHANE_MASA: SpriteDef = {
  palette: P,
  rows: [
    'kkkkkkkkkkkkkkkkkkkk',
    'kGGGGGGGGGGGGGGGGGGk',
    'kGkkGGkkGGkkGGkkGGGk',
    'kGkwGGkwGGkwGGkwGGGk',
    'kGkkGGkkGGkkGGkkGGGk',
    'kGGGGGGGGGGGGGGGGGGk',
    'kkkkkkkkkkkkkkkkkkkk',
    '.kk..............kk.',
    '.kk..............kk.',
    '.kk..............kk.',
  ],
};

export const HEDEF_TAHTASI: SpriteDef = {
  palette: P,
  rows: [
    '..kkkkkkkk..',
    '.kwwwwwwwwk.',
    '.kwkkkkkkwk.',
    '.kwkrrrrkwk.',
    '.kwkrwwrkwk.',
    '.kwkrwwrkwk.',
    '.kwkrrrrkwk.',
    '.kwkkkkkkwk.',
    '.kwwwwwwwwk.',
    '..kkkkkkkk..',
    '...k....k...',
    '...k....k...',
    '..k......k..',
    '..k......k..',
    '.k........k.',
    'kkk......kkk',
  ],
};

export const ENGEL: SpriteDef = {
  palette: P,
  rows: [
    '................',
    'kkkkkkkkkkkkkkkk',
    'kbbbbbbbbbbbbbbk',
    'kkkkkkkkkkkkkkkk',
    '..k..........k..',
    '..k..........k..',
    'kkkkkkkkkkkkkkkk',
    'kbbbbbbbbbbbbbbk',
    'kkkkkkkkkkkkkkkk',
    '..k..........k..',
  ],
};

export const DOLAP_SIRASI: SpriteDef = {
  palette: P,
  rows: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kGGGGGGGGkGGGGGGGGkGGGGGGGGk',
    'kGGGGGGGGkGGGGGGGGkGGGGGGGGk',
    'kGGGGGmGGkGGGGGmGGkGGGGGmGGk',
    'kGGGGGGGGkGGGGGGGGkGGGGGGGGk',
    'kGkkkkkGGkGkkkkkGGkGkkkkkGGk',
    'kGGGGGGGGkGGGGGGGGkGGGGGGGGk',
    'kGGGGGGGGkGGGGGGGGkGGGGGGGGk',
    'kGGGGGmGGkGGGGGmGGkGGGGGmGGk',
    'kGGGGGGGGkGGGGGGGGkGGGGGGGGk',
    'kGGGGGGGGkGGGGGGGGkGGGGGGGGk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkk',
  ],
};

export const TEPSI_BANDI: SpriteDef = {
  palette: P,
  rows: [
    '........................',
    'kkkkkkkkkkkkkkkkkkkkkkkk',
    'kGGGGGGGGGGGGGGGGGGGGGGk',
    'kGttGGttGGttGGttGGttGGGk',
    'kGttGGttGGttGGttGGttGGGk',
    'kGGGGGGGGGGGGGGGGGGGGGGk',
    'kkkkkkkkkkkkkkkkkkkkkkkk',
    '.kk..................kk.',
    '.kk..................kk.',
    '.kk..................kk.',
  ],
};

export const PENCERE: SpriteDef = {
  palette: P,
  rows: [
    'kkkkkkkkkkkk',
    'kGGGGGGGGGGk',
    'kGnnnnknnnGk',
    'kGnnnnknnnGk',
    'kGnnnnknnnGk',
    'kGkkkkkkkkGk',
    'kGnnnnknnnGk',
    'kGnnnnknnnGk',
    'kGnnnnknnnGk',
    'kGGGGGGGGGGk',
    'kkkkkkkkkkkk',
  ],
};

/** Kalabalık için arkadan görünen küçük asker; yüz detayı yok. */
export const ASKER_SIRT: SpriteDef = {
  palette: P,
  rows: [
    '..kkkk..',
    '.khhhhk.',
    '.kuuuuk.',
    'kuuuuuuk',
    'kuuuuuuk',
    'kUuuuuUk',
    '.kuuuuk.',
    '.kuuuuk.',
    '.kuuuuk.',
    '.kU..Uk.',
    '.kb..bk.',
    '.kk..kk.',
  ],
};

export const REVIR: SpriteDef = {
  palette: P,
  rows: [
    '....kkkkkkkk....',
    '...kwwwwwwwwk...',
    '...kwwkkkkwwk...',
    '...kwwkrrkwwk...',
    '...kwkrrrrkwk...',
    '...kwkrrrrkwk...',
    '...kwwkrrkwwk...',
    '...kwwkkkkwwk...',
    '...kwwwwwwwwk...',
    '..kkkkkkkkkkkk..',
    '..kuuuuuuuuuuk..',
    '..kukkkukkkukk..',
    '..kuknkuknkukk..',
    '..kukkkukkkukk..',
    '..kuuuuhhuuuuk..',
    '..kuuuuhhuuuuk..',
    '..kkkkkkkkkkkk..',
    '.gggggggggggggg.',
  ],
};

export const BANK: SpriteDef = {
  palette: P,
  rows: [
    '....................',
    'kkkkkkkkkkkkkkkkkkkk',
    'kbbbbbbbbbbbbbbbbbbk',
    'kkkkkkkkkkkkkkkkkkkk',
    '..k..............k..',
    'kkkkkkkkkkkkkkkkkkkk',
    'kbbbbbbbbbbbbbbbbbbk',
    'kkkkkkkkkkkkkkkkkkkk',
    '.kk..............kk.',
    '.kk..............kk.',
    '.kk..............kk.',
    'kkkk............kkkk',
  ],
};

/** Bankta oturan asker: bacaklar öne uzanmış. */
/**
 * Oturan asker: baş ayakta duranla aynı, gövde dizleri öne gelmiş, elleri
 * kemerde. Bankın arkasında duruyor; ayaklar bankın önünde görünüyor.
 */
const oturanVaryant = (kep: string, uniforma: string, golge: string): SpriteDef => ({
  palette: { ...P, h: kep, u: uniforma, U: golge, q: golge, y: acik(uniforma) },
  rows: [
    ...SOLDIER.rows.slice(0, 9),
    '..kyuuukkuuuUk..',
    '.kyuuuusSuuuuUk.',
    'kyukqmquuqmqkuUk',
    'ksskbbbmmbbbksSk',
    '..kuuuuuuuuuUk..',
    '..kuuuUkkuuuUk..',
    '..klbbbkklbbbk..',
  ],
});

export const OTURAN_ASKER = oturanVaryant('#565B36', '#6E7444', '#4E5330');
export const OTURAN_EMRE = oturanVaryant('#7A5230', '#7C6A3C', '#59492A');
export const OTURAN_TOLGA = oturanVaryant('#42566A', '#59684A', '#3D4832');
export const OTURAN_SERKAN = oturanVaryant('#8A7A2E', '#6E7444', '#4E5330');

// ── Yürüyüş kareleri ─────────────────────────────────────────────────
// Yol sahnesi üç ayrı kameradan çekiliyor (patika / perspektif / yan) ve
// her kamera askere başka taraftan bakıyor. Ortak kural: tek bir "duruş"
// karesi yetmiyor, yürüyüş kontak (ayak yere basar, gövde alçalır) ve
// geçiş (bacaklar yan yana, gövde yükselir) kareleri arasında gidip
// geliyor. Gövdenin inip kalkması sprite'ta değil, sahnedeki salınımda.

/** Gövde ve baş her karede aynı; yalnız bacaklar değişiyor. */
const ON_GOVDE = SOLDIER.rows.slice(0, 17);

/** Sol ayak havada, sağ ayak basıyor. */
export const ASKER_ADIM_SOL: SpriteDef = {
  palette: P,
  rows: [
    ...ON_GOVDE,
    '...kuuukkuuUk...',
    '...kuuukkuuUk...',
    '...kUUUkkuuUk...',
    '..klbbbkkuuUk...',
    '..kkkkk.kUUUk...',
    '.......klbbbk...',
    '.......kkkkkk...',
  ],
};

/** Sağ ayak havada, sol ayak basıyor — döngünün öteki yarısı. */
export const ASKER_ADIM_SAG: SpriteDef = {
  palette: P,
  rows: [
    ...ON_GOVDE,
    '...kuuukkuuUk...',
    '...kuuukkuuUk...',
    '...kuuukkUUUk...',
    '...kuuUkklbbbk..',
    '...kUUUk.kkkkk..',
    '..klbbbk........',
    '..kkkkkk........',
  ],
};

/**
 * Sırt görünüşü. Perspektif kamerada asker senden uzaklaşarak ufka
 * yürüyor; önden bakan bir sprite o sahnede geri geri gidiyor gibi
 * duruyordu. Elde 8x12'lik bir sırt sprite'ı vardı ama kalabalık
 * siluetiydi, kahraman olacak kadar detaylı değil.
 */
const ARKA_GOVDE = [
  '.....kkkkkk.....',
  '....khhhhhhk....',
  '...khhhhhhhhk...',
  '...kUUUUUUUUk...',
  '...kSbbbbbbSk...',
  '..kSbbbbbbbbSk..',
  '...kSbbbbbbSk...',
  '....kSSSSSSk....',
  '.....kSSSSk.....',
  '..kyuuuuuuuuUk..',
  '.kyuuuuuuuuuuUk.',
  'kyukuuuuuuuukuUk',
  'kyukuuuUUuuUkuUk',
  'kyukuuuUUuuUkuUk',
  'kyukuuuUUuuUkuUk',
  'ksskbbbbbbbbksSk',
  '...kuuuuuuuUk...',
];

export const ASKER_ARKA: SpriteDef = {
  palette: P,
  rows: [
    ...ARKA_GOVDE,
    '...kuuukkuuUk...',
    '...kuuukkuuUk...',
    '...kuuUkkuuUk...',
    '...kUUUkkUUUk...',
    '..klbbbkklbbbk..',
    '..kbbbbkkbbbbk..',
    '..kkkkk..kkkkk..',
  ],
};

export const ASKER_ARKA_SOL: SpriteDef = {
  palette: P,
  rows: [
    ...ARKA_GOVDE,
    '...kuuukkuuUk...',
    '...kuuukkuuUk...',
    '...kUUUkkuuUk...',
    '..klbbbkkuuUk...',
    '..kkkkk.kUUUk...',
    '.......klbbbk...',
    '.......kkkkkk...',
  ],
};

export const ASKER_ARKA_SAG: SpriteDef = {
  palette: P,
  rows: [
    ...ARKA_GOVDE,
    '...kuuukkuuUk...',
    '...kuuukkuuUk...',
    '...kuuukkUUUk...',
    '...kuuUkklbbbk..',
    '...kUUUk.kkkkk..',
    '..klbbbk........',
    '..kkkkkk........',
  ],
};

// ── Sivil ────────────────────────────────────────────────────────────
// Nizamiyeden koğuşa yürürken üniforma daha torbada. Gövde aynı, kıyafet
// sivil. Palet takası yetmiyor: kep siperliği de gövde de aynı 'u', göğüsteki
// arma ve kemer tokası 'm'. O yüzden grid bölge bölge çevriliyor —
// kep saça, üniforma kazağa ve kota, postal spor ayakkabıya.

const SIVIL_P = {
  ...P,
  H: '#3B2B20', // saç
  c: '#8A4A3A', // kazak
  C: '#63342A', // kazak gölge
  j: '#46607E', // kot
  J: '#31445C', // kot gölge
  e: '#D6CFBF', // spor ayakkabı
  v: '#9C7A4E', // valiz
  V: '#74582F', // valiz gölge
} as Record<string, string>;

/** 0–8 baş ve boyun, 9–16 gövde, sonrası bacak. Bütün asker kareleri bu düzende. */
const BAS_SONU = 9;
const GOVDE_SONU = 17;

function sivilGiydir(def: SpriteDef): SpriteDef {
  const cevir = (satir: string, harita: Record<string, string>) =>
    satir.replace(/./g, (ch) => harita[ch] ?? ch);
  return {
    palette: SIVIL_P,
    rows: def.rows.map((satir, i) => {
      if (i < BAS_SONU) return cevir(satir, { h: 'H', u: 'H', U: 'H', y: 'H' });
      if (i < GOVDE_SONU) return cevir(satir, { u: 'c', U: 'C', m: 'c', b: 'c', y: 'c', q: 'c' });
      return cevir(satir, { u: 'j', U: 'J', b: 'e', y: 'j', l: 'e' });
    }),
  };
}

/**
 * Orta boy el valizi. Sapı elde, gövdesi bacağın yanında; alt kenarı
 * yerden bir piksel yukarıda, yani taşınıyor, sürüklenmiyor.
 */
const VALIZ = [
  '.sskk.', // kolun ucundaki el sapı kavrıyor
  '.k..k.',
  'kkkkkk',
  'kvvvvk',
  'kvmmvk',
  'kvvvvk',
  'kVVVVk',
  'kkkkkk',
];
/** El satırı: valizi tutan el gövdenin yanından sapa geçiyor. */
const EL_SATIRI = 15;
const VALIZ_UST = EL_SATIRI;
/** Sprite iki yandan eşit genişliyor; çapa alt-orta olduğu için asker kaymıyor. */
const PAY = 5;

/**
 * `savrulma`: adım karelerinde valiz bir piksel dışarı açılıyor, kontakta
 * ortaya dönüyor — her adımda bir kez sallanıyor. El ve sap kolda sabit;
 * yalnız sapın altı ve gövde kaydığı için sap da hafifçe yatıyor.
 */
function valizTut(def: SpriteDef, yan: 'sag' | 'sol', savrulma: 0 | 1 = 0): SpriteDef {
  const bos = '.'.repeat(PAY);
  return {
    palette: def.palette,
    rows: def.rows.map((satir, i) => {
      let s = satir;
      if (i === EL_SATIRI) {
        const el = yan === 'sag' ? s.lastIndexOf('s') : s.indexOf('s');
        s = s.slice(0, el) + 'c' + s.slice(el + 1);
      }
      const tam = (bos + s + bos).split('');
      const satirParca = VALIZ[i - VALIZ_UST];
      if (satirParca) {
        // Valiz bacağa bitişik: kenardan bir sütun içeride. Solda ayna görüntüsü.
        const parca = yan === 'sag' ? satirParca : satirParca.split('').reverse().join('');
        const kayma = i > EL_SATIRI ? savrulma : 0;
        const bas = yan === 'sag' ? tam.length - parca.length - 1 + kayma : 1 - kayma;
        parca.split('').forEach((ch, j) => {
          if (ch !== '.') tam[bas + j] = ch;
        });
      }
      return tam.join('');
    }),
  };
}

// Valiz sol elde: önden bakınca ekranın sağında, arkadan bakınca solunda.
const onden = (d: SpriteDef, savrulma: 0 | 1 = 0) => valizTut(sivilGiydir(d), 'sag', savrulma);
const arkadan = (d: SpriteDef, savrulma: 0 | 1 = 0) => valizTut(sivilGiydir(d), 'sol', savrulma);

export const SIVIL = onden(SOLDIER);
export const SIVIL_ADIM_SOL = onden(ASKER_ADIM_SOL, 1);
export const SIVIL_ADIM_SAG = onden(ASKER_ADIM_SAG, 1);
export const SIVIL_ARKA = arkadan(ASKER_ARKA);
export const SIVIL_ARKA_SOL = arkadan(ASKER_ARKA_SOL, 1);
export const SIVIL_ARKA_SAG = arkadan(ASKER_ARKA_SAG, 1);

/** Nizamiyede verilen yedek üniforma, katlanmış: tişörtün kalıbı, üniformanın kumaşı. */
export const UNIFORMA_KATLI: SpriteDef = {
  palette: { ...P, w: '#6E7444', W: '#4E5330' },
  rows: TISORT.rows,
};

/** Askıdan alınan pantolon: kemeri takılı, paçalar ayrık. */
export const PANTOLON: SpriteDef = {
  palette: P,
  rows: [
    '............',
    '.kkkkkkkkkk.',
    '.kbbbmmbbbk.',
    '.kuuuuuuuuk.',
    '.kuuuuuuuuk.',
    '.kuuukkuuuk.',
    '.kuuk..kuuk.',
    '.kuuk..kuuk.',
    '.kuuk..kuuk.',
    '.kUUk..kUUk.',
    '.kkkk..kkkk.',
    '............',
  ],
};

// ── Sabah giyinme ────────────────────────────────────────────────────
// Asker iç çamaşırından tam üniformaya aşama aşama giyiniyor. Gövde yine
// SOLDIER; her aşamada bir bölge kendi rengine dönüyor. Sıra mini oyunla
// aynı: 0 iç çamaşırı, 1 fanila, 2 pantolon, 3 çorap, 4 postal, 5 ceket ve kep.

const GIYINME_P = {
  ...P,
  H: '#3B2B20', // saç — kep ceketle geliyor
  f: '#DDD5C0', // fanila
  F: '#B3A88C', // fanila gölge
  x: '#55657A', // boxer
  c: '#8A8F96', // çorap
} as Record<string, string>;

/** Kalça satırı: boxer ya da pantolon beli. */
const KALCA = GOVDE_SONU - 1;
/** Postal satırları; son satır dış hat. */
const AYAK_BASI = 21;

function giyinmeKaresi(asama: number): SpriteDef {
  const cevir = (satir: string, harita: Record<string, string>) =>
    satir.replace(/./g, (ch) => harita[ch] ?? ch);
  const ten = { u: 's', U: 'S', m: 's', b: 's', y: 's', l: 's', q: 's' };
  return {
    palette: GIYINME_P,
    rows: SOLDIER.rows.map((satir, i) => {
      if (i < BAS_SONU) return asama >= 5 ? satir : cevir(satir, { h: 'H', u: 'H', U: 'H', y: 'H' });
      if (i === KALCA) return asama >= 2 ? satir : cevir(satir, { u: 'x', U: 'x', y: 'x' });
      if (i < GOVDE_SONU) {
        if (asama >= 5) return satir;
        return cevir(satir, asama >= 1 ? { u: 'f', U: 'F', m: 'f', b: 'f', y: 'f', q: 'f' } : ten);
      }
      if (i < AYAK_BASI) return asama >= 2 ? satir : cevir(satir, ten);
      if (asama >= 4) return satir;
      return cevir(satir, asama >= 3 ? { b: 'c', l: 'c' } : { b: 's', l: 's' });
    }),
  };
}

export const GIYINME_ASAMALARI: SpriteDef[] = [0, 1, 2, 3, 4, 5].map(giyinmeKaresi);

/** Katlanmış pijama: tişörtün kalıbı, açık mavi pamuk. */
export const PIJAMA_KATLI: SpriteDef = {
  palette: { ...P, w: '#7C93A8', W: '#5B6F82' },
  rows: TISORT.rows,
};

// ── Gece ─────────────────────────────────────────────────────────────
// Yoklamadan önce üniforma çıkıyor (GIYINME_ASAMALARI tersten), sonra
// pijama ve terlik. Çıplak hâl fanila aşaması: boxer, fanila, yalınayak.

const GECE_P = { ...GIYINME_P, p: '#7C93A8', P: '#5B6F82', t: '#34495E' } as Record<string, string>;

function geceKaresi(pijama: boolean, terlik: boolean): SpriteDef {
  const cevir = (satir: string, harita: Record<string, string>) =>
    satir.replace(/./g, (ch) => harita[ch] ?? ch);
  return {
    palette: GECE_P,
    rows: giyinmeKaresi(1).rows.map((satir, i) => {
      if (pijama && i >= BAS_SONU && i < KALCA) return cevir(satir, { f: 'p', F: 'P' });
      if (pijama && i === KALCA) return cevir(satir, { x: 'p' });
      if (pijama && i > KALCA && i < AYAK_BASI) return cevir(satir, { s: 'p', S: 'P' });
      // Terlik tabanı: ayağın son satırı.
      if (terlik && i === AYAK_BASI + 1) return cevir(satir, { s: 't' });
      return satir;
    }),
  };
}

/** [pijama][terlik]: 0 yok, 1 var. */
export const GECE_KARELERI: SpriteDef[][] = [
  [geceKaresi(false, false), geceKaresi(false, true)],
  [geceKaresi(true, false), geceKaresi(true, true)],
];

/**
 * Tıraş aynası: yakından yüz. Sakal 8–15. satırlardaki ten piksellerinde
 * duruyor (yanak, çene, boyun); ağız dış hat olduğu için tıraşlanmıyor.
 */
export const YUZ: SpriteDef = {
  palette: { ...P, H: '#3B2B20' },
  rows: [
    '.....kkkkkk.....',
    '...kkHHHHHHkk...',
    '..kHHHHHHHHHHk..',
    '..kHssssssssHk..',
    '.kssssssssssssk.',
    '.ksskksssskkssk.',
    '.kssssssssssssk.',
    '.ksssssSSsssssk.',
    '.kssssssssssssk.',
    '.kssssssssssssk.',
    '.ksssskkkkssssk.',
    '..kssssssssssk..',
    '...kssssssssk...',
    '....kssssssk....',
    '.....kSSSSk.....',
    '.....kSSSSk.....',
  ],
};

// ── Şınav ────────────────────────────────────────────────────────────
// Yandan, baş sağda. Gövde elle çizili, komutanla aynı palet ve aynı
// detay: postal, pantolon, pirinç tokalı kemer, ceket, yaka, kep, kulak,
// göz. Eğim döndürmeyle değil makaslamayla veriliyor — her piksel sütunu
// kendi yüksekliği kadar kalkıyor, pikseller keskin kalıyor ve gövde
// kareler arasında aynı çizim olarak kalıyor. Kol ayrı çiziliyor: öndeki
// kol, gövdenin önünde; indikçe dirsek geriye kırılıyor.

/** Yere yatmış asker: solda postal, sağda baş; üst kenar sırt, alt kenar göğüs. */
const SINAV_GOVDE = [
  '........................kkkkk.',
  '.............kkkkkkkkkkkhhhhhk',
  'kkkkkkkkkkkkkbbuuuuuuuukhhhhhk',
  'kbbbbuuuuuuuubbuuuuuuuukuuuuuu',
  'kbbbbuuuuuuuubmuuuUUuuukSssskk',
  'kbbbbUUUUUUUUbbuuuuuuuuksssssk',
  'kbbbbkkkkkkkkbbUUUUUUUUsssSssk',
  'kbbbb........kkkkkkkkkkkkkkkk.',
  'kkkkk.........................',
];
const SINAV_EN = SINAV_GOVDE[0].length;
/** Kollar düzken başın kalkabileceği en fazla yükseklik. */
const SINAV_KALDIRMA = 12;
const SINAV_BOY = SINAV_KALDIRMA + SINAV_GOVDE.length;
/** Kolun gövdeye bağlandığı sütun (ceketin göğüs tarafı). */
const SINAV_OMUZ = 21;
/** Gövde çiziminde göğsün alt dış hattının satırı; kol buradan çıkıyor. */
const SINAV_GOGUS = 7;

function sinavKaresi(d: number): SpriteDef {
  const iz = Array.from({ length: SINAV_BOY }, () => Array<string>(SINAV_EN).fill('.'));
  const koy = (x: number, y: number, ch: string) => {
    if (x >= 0 && y >= 0 && x < SINAV_EN && y < SINAV_BOY) iz[y][x] = ch;
  };

  // Eğim: kollar düzken 0.42, göğüs yerdeyken 0.1 — postal burnu sabit.
  const egim = 0.42 + (0.1 - 0.42) * d;
  const kalkis = (x: number) => Math.round(egim * x);

  SINAV_GOVDE.forEach((satir, y) =>
    [...satir].forEach((ch, x) => {
      if (ch !== '.') koy(x, y + SINAV_KALDIRMA - kalkis(x), ch);
    }),
  );

  // Kol: omuzdan dirseğe, dirsekten ele; iki piksel kalın, sonra dış hat.
  const omuzY = SINAV_GOGUS + SINAV_KALDIRMA - kalkis(SINAV_OMUZ);
  const elX = SINAV_OMUZ + 1;
  const elY = SINAV_BOY - 2;
  // Aşağıda dirsek geriye ve göğsün hemen üstüne kırılıyor; daha yukarı
  // kırınca gövdenin dış hattıyla birleşip leke gibi duruyordu.
  const dirsekX = SINAV_OMUZ - Math.round(d * 5);
  const dirsekY = Math.round(((omuzY + elY) / 2) * (1 - d) + (omuzY - 1) * d);

  const ic = new Set<string>();
  const cizgi = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n);
      const y = Math.round(y0 + ((y1 - y0) * i) / n);
      ic.add(`${x},${y}`);
      ic.add(`${x + 1},${y}`);
    }
  };
  cizgi(SINAV_OMUZ - 1, omuzY - 1, dirsekX, dirsekY);
  cizgi(dirsekX, dirsekY, elX, elY - 1);
  ic.forEach((k) => {
    const [x, y] = k.split(',').map(Number);
    koy(x, y, 'U');
  });
  for (const x of [elX, elX + 1]) {
    ic.add(`${x},${elY}`);
    koy(x, elY, 's');
  }
  ic.forEach((k) => {
    const [x, y] = k.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (!ic.has(`${x + dx},${y + dy}`)) koy(x + dx, y + dy, 'k');
    }
  });

  return { palette: P, rows: iz.map((r) => r.join('')) };
}

/** Derinlik 0 (kollar düz) → 1 (göğüs yerde), yedi kare. */
export const SINAV_KARELERI: SpriteDef[] = Array.from({ length: 7 }, (_, i) => sinavKaresi(i / 6));
