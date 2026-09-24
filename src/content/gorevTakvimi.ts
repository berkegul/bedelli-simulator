import type { Day } from '../engine/types';

export type GunGorevi = { nobet?: boolean; ceza?: boolean };

/**
 * Gece nöbeti ve akşam içtimasındaki ceza hangi günlerde. Eskiden gün
 * numarasından formülle türüyordu (nöbet her 3 günde, ceza her 4 günde) ve
 * içerikle çelişiyordu: ilk nöbet 6. güne düşüyordu, telefon ise 10. günde
 * "ilk gece nöbeti" diyordu; tema günlerine (evrak, son gece) de nöbet
 * çıkıyordu.
 *
 * Takvim telefon günleriyle (telefon/gunler/gNN.ts) hizalı. Gün dosyası
 * `gorevler` alanıyla kendi gününü ayrıca açıp kapatabilir.
 */
export const GOREV_TAKVIMI: Record<number, GunGorevi> = {
  6: { ceza: true }, // HESAP: para bitiyor, ilk ceza
  10: { nobet: true }, // GECE: ilk nöbet
  13: { nobet: true },
  14: { ceza: true }, // YARISI
  16: { nobet: true }, // YORGUNLUK
  18: { ceza: true }, // ON GÜN
  19: { nobet: true },
  22: { nobet: true }, // SESSİZLİK
  25: { nobet: true }, // SON SERBEST
};

export function gunGorevleri(gun: Pick<Day, 'day' | 'gorevler'>): GunGorevi {
  return { ...GOREV_TAKVIMI[gun.day], ...gun.gorevler };
}
