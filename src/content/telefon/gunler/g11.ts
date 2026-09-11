import type { Gorusme } from '../tipler';

/**
 * GÜN 11 — KOĞUŞ. Kaybolan bot olayı.
 * Aynı olay üç ağızda üç farklı karşılık buluyor: annen anlamıyor,
 * sevgilin gülüyor, kankan bunu yılın haberi sayıyor. Mizahın tepesi burası.
 */
export const GUN_11: Gorusme[] = [
  {
    id: 'g11-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [11],
    kok: 'a',
    kapanis: '"Botunu bul oğlum." Konuşmanın tamamından aklında kalan bu oldu.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Anlat bakalım, bugün ne oldu? Sesin neşeli geliyor."',
        secenekler: [
          {
            id: 'bot',
            label: '"Bir çocuğun botu kayboldu. Bütün koğuş iki saat bot aradı."',
            cevap:
              '"Bot mu kayboldu?" Ciddiye aldı. "Çaldılar mı? Senin botunu da çalarlar mı?"',
            etki: { iliski: 5, moral: 7 },
            isaret: { ad: 'komik_olay', deger: 'bot' },
            sonraki: 'b',
          },
          {
            id: 'iyi',
            label: '"Bugün iyiydi anne. Gülüştük biraz."',
            cevap: '"Aa, iyi." Sesindeki rahatlama telefondan taştı.',
            etki: { iliski: 6, moral: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Gülmen iyi geldi bana. On gündür ilk defa güldüğünü duyuyorum."',
        secenekler: [
          {
            id: 'farketmedim',
            label: '"Fark etmemiştim."',
            cevap: '"Ben ettim." Anne işi bu.',
            etki: { iliski: 6, moral: 5 },
          },
          {
            id: 'alisiyorum',
            label: '"Alışıyorum galiba. Buranın da bir komikliği var."',
            cevap: '"Olsun. İyi ki var." Bunu içtenlikle söyledi.',
            etki: { iliski: 7, moral: 6 },
            isaret: { ad: 'alisma_isareti', deger: 'g11' },
          },
        ],
      },
    },
  },

  {
    id: 'g11-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [11],
    kok: 'a',
    kapanis: 'Uzun uzun güldünüz. On bir gündür ilk defa böyle bir konuşma oldu.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Sesin bugün farklı. İyi anlamda. Ne oldu?"',
        secenekler: [
          {
            id: 'anlat',
            label: 'Bot olayını baştan sona anlat',
            cevap:
              '"DUR." Gülmekten konuşamadı. "Adam botunu mu kaybetti? Botunu?" Beş dakika toparlanamadı.',
            etki: { iliski: 9, moral: 10 },
            isaret: { ad: 'komik_olay', deger: 'bot' },
            sonraki: 'b',
          },
          {
            id: 'kisa',
            label: '"Komik bir şey oldu. Anlatması uzun."',
            cevap: '"Anlat ya! Ben gülmek istiyorum." Israr etti.',
            etki: { iliski: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Böyle konuşmayı özlemişim. Şikayet yok, özlem yok, sadece saçma bir hikaye."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de özlemişim. Her konuşma ağır olmak zorunda değil."',
            cevap: '"Aynen." Rahatladı. "Bundan sonra bir komik şey biriktir bana."',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'hafif_konusma', deger: 'evet' },
          },
          {
            id: 'zor',
            label: '"Her gün komik bir şey olmuyor ama."',
            cevap: '"Olmasın. Olduğunda anlat yeter." Beklentiyi kendisi düşürdü.',
            etki: { iliski: 6, moral: 5 },
          },
        ],
      },
    },
  },

  {
    id: 'g11-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [11],
    oncelik: 110,
    kok: 'a',
    kapanis: '"Bu hikayeyi herkese anlatacağım." Anlattı. Hâlâ anlatıyor.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Ne var ne yok lan? Bir şey oldu mu? Bir şey olsun artık, ben sıkıldım."',
        secenekler: [
          {
            id: 'bot',
            label: '"Bir çocuğun botu kayboldu. Bütün koğuş seferber oldu."',
            cevap:
              '"YOK ARTIK." Bekle. "Buldular mı?" Bulunup bulunmadığını sormak için nefes aldı.',
            etki: { iliski: 7, moral: 9 },
            isaret: { ad: 'komik_olay', deger: 'bot' },
            sonraki: 'b',
          },
          {
            id: 'yok',
            label: '"Hiçbir şey olmuyor lan. Aynı gün tekrar ediyor."',
            cevap: '"Bir şey uydur o zaman. Ben inanırım." Ciddi söyledi.',
            etki: { iliski: 4, moral: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Bak bu hikayeyi ben anlatacağım herkese. Senin adına. Sen gelene kadar."',
        secenekler: [
          {
            id: 'anlat',
            label: '"Anlat. Ama abartma."',
            cevap: '"Abartırım tabii, ne demek abartma." Zaten abartacaktı.',
            etki: { iliski: 6, moral: 7 },
          },
          {
            id: 'ben',
            label: '"Bekle, ben gelince kendim anlatırım."',
            cevap:
              '"Tamam." Kısa durdu. "On yedi gün sonra. O zaman anlatırsın."',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'donunce_anlatacak', deger: 'evet' },
          },
        ],
      },
    },
  },
];
