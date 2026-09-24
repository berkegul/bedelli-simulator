import type { SpriteDef } from '../../ui/PixelSprite';
import { SOLDIER } from '../sprites';

/**
 * Yemekhane sahnesinin parçaları (D4c): dağıtım bandındaki kazanlar ve
 * beyaz önlüklü aşçı. Tepsi masaya bu sahnenin önünde oturuyor.
 */
const P: Record<string, string> = {
  k: '#1E1C15',
  m: '#8C8A80', // kazan
  M: '#B4B2A6', // kazan ışık
  d: '#5E5C54', // kazan gölge
  h: '#4A4944', // kulp
  c: '#C9A05A', // çorba
  C: '#DDB872', // çorba ışık
};

/** Büyük çelik kazan: kapaksız, içi dolu, iki kulplu. */
export const KAZAN: SpriteDef = {
  palette: P,
  rows: [
    '..kkkkkkkkkk..',
    '.kMMMMMMMMMMk.',
    'hkcCCccccccckh',
    'hkmmmmmmmmmmkh',
    '.kMmmmmmmmmdk.',
    '.kMmmmmmmmmdk.',
    '.kMmmmmmmmmdk.',
    '.kMmmmmmmmmdk.',
    '.kddddddddddk.',
    '..kkkkkkkkkk..',
  ],
};

/** Aşçı: askerin gövdesi, beyaz önlük ve beyaz başlık. */
export const ASCI: SpriteDef = {
  palette: {
    ...SOLDIER.palette,
    h: '#E4DECB',
    u: '#D8D2C0',
    U: '#A8A290',
    y: '#EEE8D6',
    q: '#A8A290',
    m: '#D8D2C0',
  },
  rows: SOLDIER.rows,
};
