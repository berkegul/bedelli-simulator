import { C } from '../../theme/palette';
import type { SpriteDef } from '../../ui/PixelSprite';
import type { Rol } from '../../content/telefon/tipler';

/**
 * Ankesör ve telefon görüşmesi: duvara monte kartlı telefon, ahizeyi
 * kulağına dayamış asker (yakın plan), hattın öbür ucundakilerin silueti.
 */

/** Kartlı ankesör: ahize kancada, sarmal kordon, LCD, tuş takımı, kart yuvası. */
export const KARTLI_TELEFON: SpriteDef = {
  palette: {
    k: C.ink,
    g: '#7C7F72',
    G: '#565A4E',
    h: '#9EA192',
    r: C.rust,
    d: '#2F3B24',
    t: '#C8C3AE',
    T: '#8E8A78',
    a: '#2A2A26',
    A: '#4A4A44',
    w: '#3A3A34',
    c: C.tea,
    C: '#8A5226',
  },
  rows: [
    '.....kkkkkkkkkkkkkkk',
    '.....khhhhhhhhhhhhGk',
    '.....khrrrrrrrrrrgGk',
    '.kkkkkhgggggggggggGk',
    '.kaAkkhgkkkkkkkkkgGk',
    '.kaakkhgkdddddddkgGk',
    '..aa.khgkdddddddkgGk',
    '..aa.khgkdddddddkgGk',
    '..aa.khgkkkkkkkkkgGk',
    '..aa.khgggggggggggGk',
    '..aa.khgtTgtTgtTggGk',
    '..aa.khgggggggggggGk',
    '..aa.khgtTgtTgtTggGk',
    '..aa.khgggggggggggGk',
    '.kaakkhgtTgtTgtTggGk',
    '.kaAkkhgggggggggggGk',
    '.kkkkkhgtTgtTgtTggGk',
    '..w..khgggggggggggGk',
    '...w.khgggkkkkkgggGk',
    '..w..khgggkcccCgggGk',
    '...w.khggggcccCgggGk',
    '..w..khgggggggggggGk',
    '...wwkGGGGGGGGGGGGGk',
    '.....kkkkkkkkkkkkkkk',
  ],
};

/** LCD'nin telefon üzerindeki yeri (hücre): sayı buraya yazılıyor. */
export const LCD = { x: 8, y: 5, w: 7, h: 3 };

/** Ahizeyi kulağına dayamış asker, omuzdan yukarı. */
export const ASKER_AHIZE: SpriteDef = {
  palette: {
    k: C.ink,
    h: '#565B36',
    H: '#4E5330',
    s: '#C9A277',
    S: '#9A7852',
    u: '#6E7444',
    U: '#4E5330',
    y: '#858C5A',
    q: '#4E5330',
    m: C.brass,
    a: '#2A2A26',
    A: '#5A5A52',
  },
  rows: [
    '.......kkkkkkkkkk.......',
    '......khhhhhhhhhhk......',
    '.....khhhhhhhhhhhhk.....',
    '.....khhhhhhhhhhhhk.....',
    '.....kHHHHHHHHHHHHk.....',
    '.kkkkkssssssssssSSk.....',
    '.kaAaasskkssssskkSSk....',
    '.kaAaasssksssssksSSk....',
    '.kaaaasssssSSssssSSk....',
    '.kkkkkssssssssssSSk.....',
    '.kskaassssSSSssssSk.....',
    '.ksskaassssssssSSk......',
    '..ksskaakSSSSSSSk.......',
    '...ksskkkkSSSSk.........',
    'kyuukkkyuuukkuuuUk......',
    'kyuukyuuuuusSuuuuuUk....',
    'kyuuuuuuuuuuuuuuuuuuUk..',
    'kyuuuuqmquuuuuuqmquuuUk.',
    '.kyuuuuuuuuuuuuuuuuuuUk.',
    '.kyuuuuuuuuuuuuuuuuuuUk.',
    '.kyuuuuuuuuuuuuuuuuuuUk.',
    '.kyuuuuuuuuuuuuuuuuuuUk.',
    '.kyuuuuuuuuuuuuuuuuuuUk.',
    '.kyuuuuuuuuuuuuuuuuuuUk.',
  ],
};

const KADIN = [
  '...kkkkkk...',
  '..kHHHHHHk..',
  '.kHHHHHHHHk.',
  '.kHsssssSHk.',
  '.kHskssksHk.',
  '.kHssssssHk.',
  '.kHsSSSsSHk.',
  '.kHHssssHHk.',
  'kHHHkSSkHHHk',
  'kHHccccccHHk',
  'kcccccccccck',
  'kcccccccccck',
  'kCCCCCCCCCCk',
  'kkkkkkkkkkkk',
];

const ERKEK = [
  '...kkkkkk...',
  '..kHHHHHHk..',
  '..kHHHHHHk..',
  '..kssssssk..',
  '.kSskssksSk.',
  '.kSssSSssSk.',
  '..ksMMMMsk..',
  '..kssSSssk..',
  '...kSSSSk...',
  '..kcccccck..',
  '.kcccccccck.',
  'kcccccccccck',
  'kCCCCCCCCCCk',
  'kkkkkkkkkkkk',
];

type Gorunus = { kalip: 'kadin' | 'erkek' | 'genc'; sac: string; giysi: string; biyik?: string };

const GORUNUS: Record<Rol, Gorunus> = {
  anne: { kalip: 'kadin', sac: '#3B2B20', giysi: '#7A4A5A' },
  sevgili: { kalip: 'kadin', sac: '#5A3620', giysi: '#8A4A3A' },
  es: { kalip: 'kadin', sac: '#2E241A', giysi: '#4A5A7A' },
  baba: { kalip: 'erkek', sac: '#8A8A80', giysi: '#4E5A6A', biyik: '#5A5A52' },
  akraba: { kalip: 'erkek', sac: '#5A4630', giysi: '#6A5A3A', biyik: '#3B2B20' },
  kanka: { kalip: 'genc', sac: '#2E241A', giysi: '#46607E' },
  kardes: { kalip: 'genc', sac: '#4A3524', giysi: '#7A6A2E' },
};

const koyu = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const k = (v: number) => Math.round(v * 0.72);
  return `#${((k(n >> 16) << 16) | (k((n >> 8) & 255) << 8) | k(n & 255)).toString(16).padStart(6, '0')}`;
};

/** Hattın öbür ucu: role göre siluet (saç, giysi, babada bıyık). */
export function karsiTaraf(rol: Rol): SpriteDef {
  const g = GORUNUS[rol];
  return {
    palette: {
      k: C.ink,
      H: g.sac,
      s: '#C9A277',
      S: '#9A7852',
      c: g.giysi,
      C: koyu(g.giysi),
      M: g.biyik ?? '#C9A277',
    },
    rows: g.kalip === 'kadin' ? KADIN : ERKEK,
  };
}
