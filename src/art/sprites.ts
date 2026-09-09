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
} as Record<string, string>;

export const SOLDIER: SpriteDef = {
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
    '..kuuuu..uuuuk..',
    '..kuuuu..uuuuk..',
    '..kUUUU..UUUUk..',
    '..kbbbb..bbbbk..',
    '..kbbbb..bbbbk..',
    '..kkkkk..kkkkk..',
  ],
};

export const SERGEANT: SpriteDef = {
  palette: { ...P, h: C.rust },
  rows: [
    '.....kkkkkk.....',
    '....krrrrrrk....',
    '...kmrrrrrrmk...',
    '...kssssssssk...',
    '...kskssssksk...',
    '...ksssSSsssk...',
    '...kssskkkssk...',
    '....kssssssk....',
    '.....kSSSSk.....',
    '...kuuuuuuuuk...',
    '..kuuuuuuuuuuk..',
    '.kUummmmmmmmuUk.',
    '.kUummuuuummuUk.',
    '.kUuuuuuuuuuuUk.',
    '.kUubbbmmbbbuUk.',
    '.kUsuuuuuuuusUk.',
    '..kuuuuuuuuuuk..',
    '..kuuuu..uuuuk..',
    '..kuuuu..uuuuk..',
    '..kuuuu..uuuuk..',
    '..kUUUU..UUUUk..',
    '..kbbbb..bbbbk..',
    '..kbbbb..bbbbk..',
    '..kkkkk..kkkkk..',
  ],
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
const arkadasVaryanti = (kep: string, uniforma: string, golge: string): SpriteDef => ({
  palette: { ...P, h: kep, u: uniforma, U: golge },
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
const oturanVaryant = (kep: string, uniforma: string, golge: string): SpriteDef => ({
  palette: { ...P, h: kep, u: uniforma, U: golge },
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
    '.kUuuuuuuuuuuUk.',
    '..kuuuuuuuuuuk..',
    '..kuuuukkkkkkk..',
    '..kuuuukbbbbbk..',
  ],
});

export const OTURAN_ASKER = oturanVaryant('#565B36', '#6E7444', '#4E5330');
export const OTURAN_EMRE = oturanVaryant('#7A5230', '#7C6A3C', '#59492A');
export const OTURAN_TOLGA = oturanVaryant('#42566A', '#59684A', '#3D4832');
export const OTURAN_SERKAN = oturanVaryant('#8A7A2E', '#6E7444', '#4E5330');
