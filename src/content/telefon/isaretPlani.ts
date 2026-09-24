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
  sevgili_soru: { plan: 'final' },
  sevgili_derin: { plan: 'final' },
  kanka_ozur: { plan: 'final' },
  kanka_ciddi: { plan: 'final' },
  anneye_ozlem: { plan: 'final' },
  degisim_farkindaligi: { plan: 'final' },
  alisma_isareti: { plan: 'final' },

  // Gün içeriği: telefonda anlatılan şey ertesi gün koğuşta karşına çıkar.
  para_durumu: { plan: 'gun', gun: 7, not: 'kantin borcu, Serkan ekonomisi' },
  biriktiren: { plan: 'gun', gun: 7, not: 'kontör biriktiren oyuncu kantinde' },
  atis_sonucu: { plan: 'gun', gun: 10, not: 'atış sonucu koğuşta konuşuluyor' },
  agri_sikayeti: { plan: 'gun', gun: 10, not: 'omuz ağrısı, sabah rutininde' },
  baba_bilgisi: { plan: 'gun', gun: 10, not: 'babanın nöbet tavsiyesi ilk nöbette' },
  kanka_takvim: { plan: 'gun', gun: 10, not: 'kankanın tuttuğu takvim' },
  nobet_gecesi: { plan: 'gun', gun: 11, not: 'ilk nöbetin ertesi sabahı' },
  komik_olay: { plan: 'gun', gun: 12, not: 'bot olayı hatırlama gününde koğuşta anlatılıyor' },
  ev_yemegi: { plan: 'gun', gun: 13, not: 'yemekhanede ev yemeği özlemi' },
  sevgili_surpriz: { plan: 'gun', gun: 16, not: 'sevgilinin sürprizi' },
  hasta_oldu: { plan: 'gun', gun: 17, not: 'ayak yarası, revir dalı sonrası' },
  koli_yolda: { plan: 'gun', gun: 17, not: 'koli geliyor' },
  koli_icerigi: { plan: 'gun', gun: 18, not: 'koliden çıkan koğuşta paylaşılıyor' },
  ilk_azar: { plan: 'gun', gun: 19, not: 'ilk azarın yatağı artık kusursuz' },
  yatak_ogrendi: { plan: 'gun', gun: 20, not: 'yatak ustalığı' },
  telefon_ozlemi: { plan: 'gun', gun: 23, not: 'kanka aramadıktan sonra' },
};
