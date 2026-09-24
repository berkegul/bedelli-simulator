/**
 * Para kazanma modeli henüz seçilmedi. Tüm kilit mantığı burada duruyor:
 * model netleştiğinde değişecek tek dosya bu olmalı, oyun kodu değil.
 *
 * Bugünkü davranış: ilk BEDAVA_GUN gün açık, sonrası kilitli.
 *  - "Ücretsiz + kilit açma" seçilirse: satinAlindi'yi IAP durumuna bağla.
 *  - "Peşin ücretli" seçilirse: TAM_SURUM_ACIK = true yap, kilit ekranı ölür.
 *  - "Reklamlı" seçilirse: BEDAVA_GUN = 28 yap, reklam kancasını buraya ekle.
 */
/**
 * Yazılmış içerik büyüdükçe bu sayı da gözden geçirilmeli. Şu an tüm yazılı
 * günler açık: model seçilene kadar geliştirme ve test önde.
 */
export const BEDAVA_GUN = 5;

/**
 * Satın alma akışı henüz yok (yayin-plani M3). Geliştirme derlemesinde bütün
 * yazılı günler açık, yayın derlemesinde kilit BEDAVA_GUN'de. Testlerde
 * (__DEV__ tanımsız) kapalı; sanal oyuncu kendi taklidiyle açıyor.
 */
export const TAM_SURUM_ACIK = typeof __DEV__ !== 'undefined' && __DEV__;

export function gunOynanabilirMi(gun: number, satinAlindi = TAM_SURUM_ACIK) {
  return satinAlindi || gun <= BEDAVA_GUN;
}

export function kilitliMi(gun: number, satinAlindi = TAM_SURUM_ACIK) {
  return !gunOynanabilirMi(gun, satinAlindi);
}
