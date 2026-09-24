/**
 * Telefonda konup henüz hiçbir yerde okunmayan işaretlerin planı.
 *
 * Telefon içeriği 28 gün için önceden yazıldı ve bazı işaretler bilerek
 * ileriye bırakıldı: final kartları henüz işaret okumuyor, gün dosyaları
 * (6–28) daha yazılmadı. Doğrulayıcı buradaki işaretleri "unutulmuş" değil
 * "planlı" sayar; plan gerçekleşince işaret buradan silinir.
 *
 *  final → 28. gün final kartlarının ya da karnenin koşulu (yayin-plani I8/I9)
 *  gun   → o gün dosyasında geri dönüş (I5–I7; sahneye hafıza koşulu gerekir)
 *
 * Epilogda okunanlar burada değil, finaller.ts'teki EPILOG_METIN'de.
 */
export type IsaretPlani = { plan: 'final' } | { plan: 'gun'; gun: number; not: string };

export const ISARET_PLANI: Record<string, IsaretPlani> = {
  // Final kartları: kimin kapıda olduğu, kimin neyi itiraf ettiği.
  karsilama: { plan: 'final' },
  baba_hazirlik: { plan: 'final' },
  kanka_kapida: { plan: 'final' },
  cikis_ani: { plan: 'final' },
  son_gece: { plan: 'final' },
  soz_tutuldu: { plan: 'final' },
  kanka_itiraf: { plan: 'final' },
  baba_itiraf: { plan: 'final' },
  baba_anisi: { plan: 'final' },
  baba_yumusadi: { plan: 'final' },
  baba_bilgisi: { plan: 'final' },
  sevgili_soru: { plan: 'final' },
  sevgili_derin: { plan: 'final' },
  kanka_ozur: { plan: 'final' },
  kanka_ciddi: { plan: 'final' },
  anneye_ozlem: { plan: 'final' },
  degisim_farkindaligi: { plan: 'final' },
  alisma_isareti: { plan: 'final' },

  // Gün içeriği: telefonda anlatılan şey ertesi gün koğuşta karşına çıkar.
  yatak_ogrendi: { plan: 'gun', gun: 20, not: 'yatak ustalığı' },
  telefon_ozlemi: { plan: 'gun', gun: 23, not: 'kanka aramadıktan sonra' },
};
