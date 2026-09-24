/**
 * Buluta yazılabilen ölçüm olayları. `firestore.rules` yalnızca bu adları
 * kabul ediyor; iki liste `olaylar.test.ts` ile eşit tutuluyor. Yeni olay
 * eklerken kurala da ekle ve kuralı yeniden yayınla.
 */
export const OLAY_ADLARI = [
  'carsi_bitti',
  'gun_bitti',
  'kilit_gorundu',
  'kayit_cakismasi',
  'oyun_bitti',
] as const;

export type OlayAdi = (typeof OLAY_ADLARI)[number];
