/**
 * Hava ve zemin, gün ile blok numarasından türetiliyor: rastgele görünüyor
 * ama kayıttan dönünce değişmiyor. Amaç yürüyüşün her seferinde aynı
 * görünmemesi — yol tekdüzeliğini asıl kıran şey manzara değil, hava.
 */
export type Hava = 'acik' | 'bulutlu' | 'ruzgarli' | 'yagmurlu' | 'sisli';

export type Zemin = 'beton' | 'toprak' | 'cakil';

const karistir = (a: number, b: number) => {
  // Küçük bir hash: ardışık bloklarda aynı sonucu vermesin.
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function havaDurumu(gun: number, blokIndex: number): Hava {
  // Hava gün içinde blok blok zıplamaz: sabah bir, öğleden sonra bir kez
  // dönebiliyor. Yürüyüşleri birbirinden ayıran asıl şey ışık ve zemin.
  const yarim = blokIndex >= 6 ? 1 : 0;
  const r = karistir(gun, yarim);
  if (r < 0.42) return 'acik';
  if (r < 0.66) return 'bulutlu';
  if (r < 0.8) return 'ruzgarli';
  if (r < 0.93) return 'yagmurlu';
  return 'sisli';
}

export function zeminTipi(gun: number, blokIndex: number): Zemin {
  // Zemin yola göre değişiyor: avlu betonu, eğitim sahası toprağı.
  const r = karistir(gun + 17, blokIndex + 5);
  if (r < 0.45) return 'beton';
  if (r < 0.78) return 'toprak';
  return 'cakil';
}

export const HAVA_METNI: Record<Hava, string> = {
  acik: 'Hava açık',
  bulutlu: 'Gökyüzü kapalı',
  ruzgarli: 'Rüzgâr yandan vuruyor',
  yagmurlu: 'Yağmur çiseliyor',
  sisli: 'Sis var, on adım ötesi görünmüyor',
};

/** Yürüyüşün nasıl geçtiğini anlatan kısa cümle. */
export const HAVA_YOL_NOTU: Record<Hava, string> = {
  acik: 'Güneş sırtını ısıtıyor.',
  bulutlu: 'Ne sıcak ne soğuk; yürümek için fena değil.',
  ruzgarli: 'Kep uçmasın diye elini başına götürüyorsun.',
  yagmurlu: 'Postalların ıslanıyor, yaka içine su kaçıyor.',
  sisli: 'Öndeki bölüğü sesinden takip ediyorsun.',
};

export const ZEMIN_RENK: Record<Zemin, { ust: string; alt: string }> = {
  beton: { ust: '#3A3421', alt: '#332E1D' },
  toprak: { ust: '#463A26', alt: '#3B3020' },
  cakil: { ust: '#403C2E', alt: '#363325' },
};

/**
 * Her yürüyüşte uygulanıyor, o yüzden değerler küçük: günde dört beş yol
 * var ve büyük sayılar burada birikip günü tek başına belirliyor.
 */
export function havaEtkisi(hava: Hava) {
  switch (hava) {
    case 'yagmurlu':
      return { moral: -2, kondisyon: -1 };
    case 'sisli':
      return { moral: -1 };
    case 'ruzgarli':
      return { enerji: -1 };
    case 'acik':
      return { moral: 1 };
    default:
      return {};
  }
}
