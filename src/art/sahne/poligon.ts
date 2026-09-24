import type { SpriteDef } from '../../ui/PixelSprite';

/**
 * Atış poligonu ve ceza sahnesinin sprite'ları (D4b). Ortak sprites.ts'e
 * değil buraya: paralel çalışan sahne işleri aynı dosyayı ezmesin.
 */
const P: Record<string, string> = {
  k: '#1E1C15', // kontur
  s: '#8C7A52', // kum torbası
  S: '#A8956A', // torba ışık
  d: '#6B5C3C', // torba gölge
  i: '#5A4C30', // dikiş / bağ
  n: '#2A2B28', // namlu
  m: '#3C3E39', // namlu ışık
  a: '#1A1B18', // arpacık
  y: '#FFE9A0', // alev çekirdek
  Y: '#F2B640', // alev
  o: '#D9642E', // alev dış
  t: '#8A7A5A', // toz
  T: '#A8987A', // toz açık
  r: '#B2463A', // bayrak kırmızı
  w: '#E8E0C8', // bayrak beyaz bant
  p: '#5E5A4E', // direk
  P: '#7A766A', // direk ışık
  l: '#FFF2B8', // projektör camı
  L: '#C9B77A', // projektör gövde
  b: '#9CC4D8', // ter
  B: '#D8ECF4', // ter parıltı
};

/** Siperin önündeki kum torbası; yan yana ve üst üste diziliyor. */
export const KUM_TORBASI: SpriteDef = {
  palette: P,
  rows: [
    '...kkkkkkkkkk...',
    '.kkSSSSSSSSSSkk.',
    'kSSSSssssssSSSSk',
    'ksssssisssssssdk',
    'ksssssisssssssdk',
    'kdssssisssssddk.',
    '.kddddddddddkk..',
    '..kkkkkkkkkk....',
  ],
};

/**
 * Namlu, atıcının gözünden: alt kenardan hedefe uzanıyor, ucunda arpacık.
 * Aşağı doğru genişliyor (yakın taraf).
 */
export const NAMLU: SpriteDef = {
  palette: P,
  rows: [
    '....a....',
    '...kak...',
    '...kak...',
    '..kkkkk..',
    '..kmnnk..',
    '..kmnnk..',
    '..kmnnk..',
    '..kmnnk..',
    '..kmnnk..',
    '..kmnnk..',
    '.kkmnnkk.',
    '.kmmnnnk.',
    '.kmmnnnk.',
    '.kmmnnnk.',
    '.kmmnnnk.',
    '.kmmnnnk.',
    'kkmmnnnkk',
    'kmmmnnnnk',
    'kmmmnnnnk',
    'kmmmnnnnk',
    'kmmmnnnnk',
    'kmmmnnnnk',
  ],
};

/** Atış anında namlu ucunda bir kare görünen alev. */
export const NAMLU_ALEVI: SpriteDef = {
  palette: P,
  rows: ['....o....', '..o.Y.o..', '...YyY...', '.oYyyyYo.', '...YyY...', '..o.Y.o..', '....o....'],
};

/** Merminin toprağa ya da sete çarptığı yerde kalkan toz; iki kare. */
export const TOZ: SpriteDef[] = [
  {
    palette: P,
    rows: ['..t..', '.tTt.', 'tTTTt', '.ttt.'],
  },
  {
    palette: P,
    rows: ['.t...t.', '..tTt..', 't.TTT.t', '.tTtTt.', '..t.t..'],
  },
];

/** Rüzgâr bayrağı: direk ve dalgalanan kumaş, iki kare. */
export const RUZGAR_BAYRAGI: SpriteDef[] = [
  {
    palette: P,
    rows: [
      'Pp.........',
      'Pprrwwrr...',
      'Pprrwwrrr..',
      'Pprrwwrr...',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'kkk........',
    ],
  },
  {
    palette: P,
    rows: [
      'Pp.........',
      'Pprrwwr....',
      'Pprrwwrrrr.',
      'Pprrwwrrr..',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'Pp.........',
      'kkk........',
    ],
  },
];

/** Akşam içtima alanını aydınlatan projektör direği. */
export const PROJEKTOR: SpriteDef = {
  palette: P,
  rows: [
    'kkkkkk..',
    'kLllLk..',
    'kLllLk..',
    '.kkkk...',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '..Pp....',
    '.kkkk...',
  ],
};

/** Şınav çekenin alnından düşen ter. */
export const TER: SpriteDef = {
  palette: P,
  rows: ['.B.', 'bBb', 'bbb', '.b.'],
};
