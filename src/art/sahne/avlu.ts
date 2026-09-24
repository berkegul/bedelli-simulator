import { C } from '../../theme/palette';
import type { SpriteDef } from '../../ui/PixelSprite';

/**
 * Avlu mıntıkası (izmarit toplama) için yerdeki nesneler, tepeden bakış.
 * Her birinin altında bir sıra koyu gölge ('s'): nesne toprağa yapışık
 * durmasın, üstünde dursun.
 */
const P: Record<string, string> = {
  '.': '',
  k: C.ink,
  F: '#C98A3A', // filtre mantarı
  f: '#9E6A2A',
  K: '#E6DCC0', // sigara kâğıdı
  W: '#B3A88C', // ezik kâğıt gölgesi
  a: '#6E6A60', // kül
  s: '#2A2215', // gölge
  m: C.brass,
  M: '#9C7A18',
  o: '#6E7A34', // yaprak
  O: '#4E5A24',
  y: '#9A6A2E', // kuru yaprak
  Y: '#74501F',
  t: '#8A826C', // taş
  T: '#5E584A',
  g: '#6E7444', // kova boyası (asker yeşili)
  G: '#4E5330',
  h: '#8A9058',
  b: '#3B3A30', // torba
  B: '#2A2A22',
  w: '#D8D0B8',
  r: C.rust,
};

const s = (rows: string[]): SpriteDef => ({ palette: P, rows });

/** Düz, ezilmemiş izmarit. */
export const IZMARIT_DUZ = s(['.FFKKKKKa.', '.fFKKKKWa.', '..sssssss.']);

/** Ortadan kırılmış, basılmış izmarit. */
export const IZMARIT_EZIK = s(['.FF.......', '.fFKK.....', '...KWKaa..', '....ssss..']);

/** Çaprazına düşmüş izmarit. */
export const IZMARIT_CAPRAZ = s([
  '......aa',
  '....KKa.',
  '..KKW...',
  '.FFK....',
  '.fF.s...',
  '..ss....',
]);

/** Yere atılmış buruşuk kâğıt. */
export const KAGIT_TOP = s(['.kWWk..', 'kWKKWk.', 'kKWKKWk', 'kKKWKk.', '.kWWk..', '..sss..']);

/** Gazoz kapağı. */
export const KAPAK = s(['.kmk.', 'kmMmk', 'kMmMk', '.kmk.', '.sss.']);

export const YAPRAK_YESIL = s(['..oO', '.oOo', 'oOo.', 'O...']);

export const YAPRAK_KURU = s(['Y.y.', '.yYy', '.yyY', '..Y.']);

export const TAS = s(['.tt.', 'tttT', '.TT.']);

/** Mıntıkanın kenarındaki çöp varili, üç çeyrek açı. */
export const COP_VARILI = s([
  '..kkkkkkk..',
  '.kGgggggGk.',
  'kGGGGGGGGGk',
  'kgGgggggGgk',
  'kghhgggggGk',
  'kGGGGGGGGGk',
  'kghggggggGk',
  'kghggggggGk',
  'kGGGGGGGGGk',
  'kghggggggGk',
  'kghggggggGk',
  '.kkkkkkkkk.',
  '..sssssss..',
]);

/** Elindeki çöp torbası: topladıkça dolan. */
export const TORBA = s([
  '..k.k..',
  '..kbk..',
  '.kbbbk.',
  'kbbBbbk',
  'kbBbbbk',
  'kbbbBbk',
  'kbbbbbk',
  '.kkkkk.',
]);

/** Onbaşının kol saati: süre bunda akıyor. */
export const KOL_SAATI = s([
  '..kkkk..',
  '.kwwwwk.',
  'kwwkwwwk',
  'kwwkkkwk',
  'kwwwwwwk',
  '.kwwwwk.',
  '..kkkk..',
]);
