import type { SpriteDef } from '../../ui/PixelSprite';
import { SERGEANT, SOLDIER } from '../sprites';

/**
 * Açık alan sahneleri (içtima, arazi yürüyüşü, yemin töreni, gece nöbeti)
 * için sprite'lar. Asker duruşları ortak askerden türetiliyor: aynı yüz,
 * aynı üniforma, yalnızca kollar ve bacaklar değişiyor.
 */

const P = SOLDIER.palette;

/** Satırın belli sütunlarını değiştir; genişlik korunur. */
function yamala(
  def: SpriteDef,
  yamalar: [satir: number, sutun: number, metin: string][],
): SpriteDef {
  const rows = [...def.rows];
  for (const [r, c, m] of yamalar) {
    rows[r] = rows[r].slice(0, c) + m + rows[r].slice(c + m.length);
  }
  return { palette: def.palette, rows };
}

const BACAK_HAZIROL = [
  '...kuuuuuuuuk...',
  '...kuuukkuuuk...',
  '...kuuukkuuuk...',
  '...kuuukkuuuk...',
  '...kUUUkkUUUk...',
  '...kbbbkkbbbk...',
  '...kbbbkkbbbk...',
  '...kkkkkkkkkk...',
];

const BACAK_RAHAT = [
  '.kuuuuuuuuuuuuk.',
  '.kuuuuk..kuuuuk.',
  '.kuuuuk..kuuuuk.',
  '.kuuuuk..kuuuuk.',
  '.kUUUUk..kUUUUk.',
  '.kbbbbk..kbbbbk.',
  '.kbbbbk..kbbbbk.',
  '.kkkkkk..kkkkkk.',
];

/**
 * Gövde (ilk 16 satır) ortak askerden, bacaklar buradan. Ortak asker yeniden
 * çizilse de duruşlar onunla birlikte güncelleniyor.
 */
const govde = (def: SpriteDef) => def.rows.slice(0, 16);

/** Hazırol: topuklar bitişik, eller yanda. */
export const ASKER_HAZIROL: SpriteDef = { palette: P, rows: [...govde(SOLDIER), ...BACAK_HAZIROL] };

/** Rahat: ayaklar omuz genişliğinde açık. */
export const ASKER_RAHAT: SpriteDef = { palette: P, rows: [...govde(SOLDIER), ...BACAK_RAHAT] };

/**
 * Yemin: sağ el sol göğüste. Asker bize bakıyor; sağ eli ekranın solunda.
 * Eli kol hizasındaki ten pikselinden bulup kaldırıyor, önkolu göğsün
 * üstünden karşı tarafa çekiyoruz.
 */
export const ASKER_SELAM: SpriteDef = (() => {
  const rows = [...ASKER_HAZIROL.rows];
  const w = rows[0].length;
  const orta = Math.floor(w / 2);
  // Ekranın sol yarısındaki en alt ten pikseli: sağ el.
  for (let r = 15; r >= 9; r--) {
    const c = rows[r].slice(0, orta - 2).search(/[sS]/);
    if (c >= 0) {
      rows[r] =
        rows[r].slice(0, c) + rows[r].slice(c, c + 2).replace(/[sS]/g, 'k') + rows[r].slice(c + 2);
      break;
    }
  }
  const kol = (r: number, c: number, m: string) => {
    rows[r] = rows[r].slice(0, c) + m + rows[r].slice(c + m.length);
  };
  kol(12, 3, 'UUUUUU');
  kol(11, orta + 1, 'ss');
  kol(12, orta + 1, 'S');
  return { palette: P, rows };
})();

/** Çavuş hazırol (komut verirken). */
export const CAVUS_HAZIROL: SpriteDef = {
  palette: SERGEANT.palette,
  rows: [...govde(SERGEANT), ...BACAK_HAZIROL],
};

/** Çavuş bağırırken: ağız bir piksel daha açık. */
export const CAVUS_BAGIRIYOR: SpriteDef = (() => {
  const rows = [...CAVUS_HAZIROL.rows];
  for (let r = 4; r < 9; r++) {
    const m = /s(k{2,})s/.exec(rows[r]);
    if (m) {
      const bas = m.index;
      const son = m.index + m[0].length - 1;
      rows[r] = rows[r].slice(0, bas) + 'k'.repeat(son - bas + 1) + rows[r].slice(son + 1);
      break;
    }
  }
  return { palette: SERGEANT.palette, rows };
})();

// ─────────────────────────────────────────── yandan asker (arazi yürüyüşü)

const YAN_UST = [
  '...kkkkk....',
  '..khhhhhk...',
  '..khhhhhhkk.',
  '..ksssssk...',
  '..ksssskSk..',
  '..kssssssk..',
  '..kSsssskk..',
  '...ksssk....',
  '....kSSk....',
  '...kuuuuk...',
  '..kuuuuuuk..',
  '..kuuUuuuk..',
  '..kuuUuuuk..',
  '..kuuUmuuk..',
  '..kbbbbbbk..',
  '..kuusuuuk..',
  '..kuuuuuuk..',
  '...kuuuuk...',
];

/** Yandan, sağa bakan asker: ayaklar birleşik. */
export const ASKER_YAN: SpriteDef = {
  palette: P,
  rows: [
    ...YAN_UST,
    '...kuuuk....',
    '...kuuuk....',
    '...kUUUk....',
    '...kUUUk....',
    '...kbbbbk...',
    '...kkkkkk...',
  ],
};

/** Yandan, adım anı: bacaklar açık, kol öne. */
export const ASKER_YAN_ADIM: SpriteDef = {
  palette: P,
  rows: [
    ...yamala({ palette: P, rows: YAN_UST }, [
      [11, 5, 'u'],
      [12, 5, 'uU'],
      [13, 5, 'mU'],
      [15, 5, 'uus'],
    ]).rows,
    '...kuuuuk...',
    '..kuuk.kuk..',
    '..kUk...kUk.',
    '.kUUk...kUk.',
    '.kbbk...kbbk',
    '.kkk....kkkk',
  ],
};

// ─────────────────────────────────────────── yapılar

const PY: Record<string, string> = {
  ...P,
  y: '#5E6553',
  Y: '#4A5043',
  c: '#B9B29A',
  d: '#15140F',
  B: '#3A2819',
};

/** Nöbet kulübesi: sac çatı, beyaz çizgili dikmeler, karanlık iç. */
export const NOBET_KULUBESI: SpriteDef = {
  palette: PY,
  rows: [
    '......kkkkkk......',
    '....kkYYYYYYkk....',
    '..kkYYYYYYYYYYkk..',
    'kkYYYYYYYYYYYYYYkk',
    'kkkkkkkkkkkkkkkkkk',
    '.kyyyyyyyyyyyyyyk.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kckddddddddddkck.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kckddddddddddkck.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kckddddddddddkck.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kckddddddddddkck.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kykddddddddddkyk.',
    '.kckddddddddddkck.',
    '.kykddddddddddkyk.',
    '.kyyyyyyyyyyyyyyk.',
    '.kkkkkkkkkkkkkkkk.',
    '.kBBBBBBBBBBBBBBk.',
    'kkkkkkkkkkkkkkkkkk',
  ],
};

/** Tören kürsüsü: ahşap, önünde amblem. */
export const KURSU: SpriteDef = {
  palette: PY,
  rows: [
    'kkkkkkkkkkkkkkkkkkkk',
    'kbbbbbbbbbbbbbbbbbbk',
    'kkkkkkkkkkkkkkkkkkkk',
    '.kbbbbbbbbbbbbbbbbk.',
    '.kbbbbbkkkkkkbbbbbk.',
    '.kbbbbkrrrrrrkbbbbk.',
    '.kbbbbkrrwrrrkbbbbk.',
    '.kbbbbkrrrwrrkbbbbk.',
    '.kbbbbkrrrrrrkbbbbk.',
    '.kbbbbbkkkkkkbbbbbk.',
    '.kbbbbbbbbbbbbbbbbk.',
    '.kbbbbbbbbbbbbbbbbk.',
    '.kBBBBBBBBBBBBBBBBk.',
    '.kkkkkkkkkkkkkkkkkk.',
  ],
};
