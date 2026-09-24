import { C } from '../../theme';
import type { SpriteDef } from '../../ui/PixelSprite';

/**
 * Koğuş panellerinin (dolap, muhabbet, oturma, ANT-41) ek parçaları.
 * Palet oyunun paletiyle aynı aile: haki, kaput bezi, pirinç, ahşap.
 */
const P: Record<string, string> = {
  k: C.ink,
  u: '#6E7444',
  U: '#4E5330',
  y: '#858C5A',
  m: C.brass,
  M: '#8A6A1E',
  g: '#7C8189',
  G: '#4E5359',
  w: '#8A6A44',
  W: '#5E4428',
  t: '#A9834F',
};

/** Askıda asılı ceket: tel askı, omuzlar, iki cep, düğme hattı. */
export const ASKIDA_CEKET: SpriteDef = {
  palette: P,
  rows: [
    '.....gg.....',
    '....g..g....',
    '...g....g...',
    '.kkkkkkkkkk.',
    'kyuuuukuuuUk',
    'kyuuuukuuuUk',
    'kyUmUukUmUUk',
    'kyuuuumuuuUk',
    'kyuuuukuuuUk',
    'kyuuuumuuuUk',
    'kyuuuukuuuUk',
    'kyuuuukuuuUk',
    '.kUUUUkUUUk.',
    '.kkkkkkkkkk.',
  ],
};

/** Dolap kulpuna takılı asma kilit: pirinç gövde, çelik halka. */
export const ASMA_KILIT: SpriteDef = {
  palette: P,
  rows: [
    '..kkkk..',
    '.kg..gk.',
    '.kg..gk.',
    'kkkkkkkk',
    'kmmmmmMk',
    'kmmkkmMk',
    'kmmmkmMk',
    'kMMMMMMk',
    '.kkkkkk.',
  ],
};

/** Sınıf sırası, arkadan: ahşap tabla, demir ayak. */
export const DERS_SIRASI: SpriteDef = {
  palette: P,
  rows: [
    'kkkkkkkkkkkkkkkkkkkk',
    'kttttttttttttttttttk',
    'kwwwwwwwwwwwwwwwwwwk',
    'kkkkkkkkkkkkkkkkkkkk',
    '.kGk............kGk.',
    '.kGk............kGk.',
    '.kGk............kGk.',
    '.kkk............kkk.',
  ],
};
