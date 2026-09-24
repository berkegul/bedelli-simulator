import type { SpriteDef } from '../../ui/PixelSprite';

/**
 * Yol sahnesinin yol kenarı eşyaları (D4c). Yol Skia'da çiziliyor; bunlar
 * SkiaSprite ile resme çevrilip yol boyunca perspektif ölçeğiyle diziliyor.
 * Ortak sprites.ts'e değil buraya: paralel sahne işleri çakışmasın.
 */
const P: Record<string, string> = {
  k: '#1E1C15', // kontur
  g: '#5E6A4C', // kova yeşili
  G: '#76835F', // kova ışık
  d: '#454F37', // kova gölge
  m: '#8C8A80', // metal
  M: '#B4B2A6', // metal ışık
  n: '#4A4944', // direk
  N: '#66655E', // direk ışık
  l: '#FFE9A0', // lamba camı
  L: '#C9B77A', // lamba gövde
  o: '#56622F', // ot
  O: '#6E7A3A', // ot ışık
  q: '#3F4A24', // ot koyu
  t: '#8C8674', // taş
  T: '#A8A290', // taş ışık
  w: '#D8D0B8', // tabela
  r: '#B2463A', // tabela ok
  b: '#6B5140', // tabela direği
};

/** Yeşil boyalı çöp kovası, kapaklı. */
export const COP_KOVASI: SpriteDef = {
  palette: P,
  rows: [
    '..kkkkkk..',
    '.kMMMMmmk.',
    'kmmmmmmmmk',
    '.kkkkkkkk.',
    '.kGggggdk.',
    '.kGgkkgdk.',
    '.kGggggdk.',
    '.kGggggdk.',
    '.kGgkkgdk.',
    '.kGggggdk.',
    '.kddddddk.',
    '..kkkkkk..',
  ],
};

/** Sokak lambası: ince direk, kolda lamba başlığı. */
export const LAMBA_DIREGI: SpriteDef = {
  palette: P,
  rows: [
    '.kkkkkk.',
    'kLLLLLLk',
    '.kllllk.',
    '..kkkkN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '.....kN.',
    '....kNNk',
    '...kkkkk',
  ],
};

/** Ot tutamı: yol kenarında, taşların arasında. */
export const OT_TUTAMI: SpriteDef = {
  palette: P,
  rows: ['.O..O.', '.oO.oO', 'Oo.Ooq', 'qoOoqq', '.qqqq.'],
};

/** Kaldırım taşı yığını / sınır taşı. */
export const SINIR_TASI: SpriteDef = {
  palette: P,
  rows: ['.kkkk.', 'kTTttk', 'kTtttk', 'kttttk', '.kkkk.'],
};

/** Yön tabelası: kışla içinde "YEMEKHANE →" gibi. */
export const YON_TABELASI: SpriteDef = {
  palette: P,
  rows: [
    'kkkkkkkkkk',
    'kwwwwwwwrk',
    'kwkwkwkrrk',
    'kwwwwwwwrk',
    'kkkkkkkkkk',
    '....kb....',
    '....kb....',
    '....kb....',
    '....kb....',
    '....kb....',
    '...kkkk...',
  ],
};
