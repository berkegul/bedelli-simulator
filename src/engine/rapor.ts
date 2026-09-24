/**
 * Hata raporlama katmanı (yayin-plani.md · M6). Oyun hiçbir hatayı oyuncuya
 * göstermiyor, sessiz `catch` blokları da öyle kalıyor; ama sessiz olan hata
 * görünmez de oluyordu. Buradan bir raporlayıcıya gidiyor.
 *
 * Raporlayıcı Sentry hesabı açılınca bağlanacak (`raporlayiciKur`,
 * `npx @sentry/wizard -i reactNative` sonrası App.tsx'te). O zamana kadar
 * geliştirmede konsola yazıyor, yayında hiçbir şey yapmıyor. Kullanım
 * verisi izni (KVKK onayı) kapalıysa hiçbir şey gönderilmiyor.
 */
export type Raporlayici = (hata: unknown, yer: string) => void;

let raporlayici: Raporlayici | null = null;
let izin = false;

export function raporlayiciKur(r: Raporlayici | null) {
  raporlayici = r;
}

export function raporIzniAyarla(v: boolean) {
  izin = v;
}

/** Hatayı raporla; asla fırlatmaz, oyunu asla durdurmaz. */
export function raporla(hata: unknown, yer: string) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn(`[rapor] ${yer}`, hata);
  if (!izin || !raporlayici) return;
  try {
    raporlayici(hata, yer);
  } catch {
    // raporlayıcının kendisi de oyunu durdurmasın
  }
}
