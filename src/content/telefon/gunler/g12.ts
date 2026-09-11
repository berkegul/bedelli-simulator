import type { Gorusme } from '../tipler';

/**
 * GÜN 12 — HATIRLAMA. İlk büyük callback günü.
 * Üç hat da geçmişe uzanıyor ama farklı şekilde: annen yemeği hatırlıyor,
 * sevgilin ilk gece ne dediğini, kankan çıkış planını. Her biri 5 günden
 * eski işaretlere bakıyor; taze olan geri dönmüyor.
 */
export const GUN_12: Gorusme[] = [
  {
    id: 'g12-baba',
    kayit: 'ev',
    rol: 'baba',
    tur: 'omurga',
    gunler: [12],
    kok: 'a',
    kapanis: '"Hadi." Kapattı. Bu sefer sesi daha az gergindi.',
    replikler: {
      a: {
        id: 'a',
        metin:
          'Baban açtı, bu sefer beklemedi. "Ben açtım. Annen dışarıda." Sanki savunma yapıyor.',
        secenekler: [
          {
            id: 'iyi',
            label: '"İyi oldu. Seninle konuşmak istiyordum zaten."',
            cevap: '"Öyle mi?" Bunu duymaya hazır değildi. "Eee, konuş o zaman."',
            etki: { iliski: 9, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'normal',
            label: '"Tamam baba. Nasılsın?"',
            cevap: '"İyiyim." Standart cevap. "Sen?"',
            etki: { iliski: 3 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"On iki gün oldu. Yarısına geliyorsun. En zor kısmı geçtin sayılır."',
        secenekler: [
          {
            id: 'oyle_mi',
            label: '"Öyle mi? Bana daha zorlaşıyor gibi geliyor."',
            cevap:
              '"Zorlaşır." Kısa durdu. "Ortası en kötüsüdür. Başı heyecan, sonu sevinç, orta kısım sadece gün."',
            etki: { iliski: 10, moral: 6 },
            isaret: { ad: 'baba_anisi', deger: 'orta' },
            sonraki: 'c',
          },
          {
            id: 'gectim',
            label: '"Geçtim sanırım. Artık düzen oturdu."',
            cevap: '"Oturursa iyi." Onaylamak onun için bu kadar.',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Sana bir şey söyleyeceğim. Seni otogarda bırakırken arabaya döndüm, bir süre oturdum. Annen ağladı, ben sürmedim." Bunu söylemek ona on iki gün sürdü.',
        secenekler: [
          {
            id: 'baba',
            label: '"Baba..."',
            cevap: '"Neyse." Hemen kapattı konuyu. "Sen işine bak."',
            etki: { iliski: 12, moral: 8, ozlem: 8 },
            isaret: { ad: 'baba_itiraf', deger: 'otogar' },
          },
          {
            id: 'bilmiyordum',
            label: '"Bilmiyordum bunu."',
            cevap: '"Bilmeni istemedim." Bir sessizlik. "Şimdi istedim."',
            etki: { iliski: 14, moral: 9, ozlem: 6 },
            isaret: { ad: 'baba_itiraf', deger: 'otogar' },
          },
          {
            id: 'sessiz',
            label: 'Sesini çıkarma',
            cevap:
              'Sessizlik uzadı. Sonra: "Hı." Söylediğine pişman değil ama devam da etmeyecek.',
            etki: { iliski: 8, moral: 5 },
            isaret: { ad: 'baba_itiraf', deger: 'otogar' },
          },
        ],
      },
    },
  },

  {
    id: 'g12-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [12],
    kok: 'a',
    kapanis: '"Hesabını tuttum ben senin." Tutuyor gerçekten.',
    replikler: {
      a: {
        id: 'a',
        kosul: { isaret: 'yemek_beyani', isaretYas: 5 },
        atla: 'b',
        metin:
          '"İlk günlerde yemek için ne demiştin, {yas:yemek_beyani} gün önce? Ben unutmadım."',
        secenekler: [
          {
            id: 'duzeldi',
            label: '"Alıştım artık. Gerçekten alıştım."',
            cevap: '"Alışılır mı ona?" Sonra: "Alışılıyormuş demek."',
            etki: { iliski: 6, moral: 5 },
            isaret: { ad: 'yemek_beyani', deger: 'alisti' },
            sonraki: 'b',
          },
          {
            id: 'ayni',
            label: '"Aynı anne. Değişen bir şey yok."',
            cevap: '"Koli gitti, açtın mı? İçinde bir şeyler var."',
            etki: { iliski: 4 },
            sonraki: 'b',
          },
          {
            id: 'ozledim',
            label: '"Senin yemeğini özledim. Onu söyleyeyim."',
            cevap:
              'Sesi değişti. "Geldiğinde ne istersen yaparım." Zaten listeyi yapmaya başlamıştı.',
            etki: { iliski: 10, moral: 7, ozlem: 7 },
            isaret: { ad: 'ev_yemegi', deger: 'ozledi' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Yarısına geliyorsun. On iki gün. Ben takvimde işaretliyorum."',
        secenekler: [
          {
            id: 'sen_de',
            label: '"Sen de mi işaretliyorsun?"',
            cevap: '"Herkes işaretliyor herhalde." Kendini savundu, sonra güldü.',
            etki: { iliski: 6, moral: 5 },
          },
          {
            id: 'ben',
            label: '"Ben de duvara çentik atıyorum burada."',
            cevap: '"Çentik mi?" Bu ona hem komik hem hüzünlü geldi. "Mahkum gibi."',
            etki: { iliski: 5, moral: 4 },
            isaret: { ad: 'centik_atiyor', deger: 'evet' },
          },
        ],
      },
    },
  },

  {
    id: 'g12-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [12],
    oncelik: 120,
    kok: 'a',
    kapanis: 'Kapattın. Söylediklerini bir daha düşündün.',
    replikler: {
      a: {
        id: 'a',
        kosul: { isaret: 'ilk_gece', isaretYas: 5 },
        atla: 'b',
        metin:
          '"Bir şey söyleyeceğim. İlk gün aradığında sesin çok kötüydü. {yas:ilk_gece} gün oldu ve şimdi başka birisin. Fark ediyor musun?"',
        secenekler: [
          {
            id: 'ediyorum',
            label: '"Ediyorum. Kendi sesim bana da farklı geliyor."',
            cevap: '"İyi bir şey bu." Emin olmak istiyor. "Değil mi?"',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'degisim_farkindaligi', deger: 'evet' },
            sonraki: 'b',
          },
          {
            id: 'korkuyorum',
            label: '"Ediyorum ve bu hoşuma gitmiyor."',
            cevap:
              '"Neden?" Merakla sordu. "Değişmek kötü bir şey değil. Uzaklaşmak kötü."',
            etki: { iliski: 7, moral: 3 },
            isaret: { ad: 'degisim_farkindaligi', deger: 'korku' },
            sonraki: 'b',
          },
          {
            id: 'etmiyorum',
            label: '"Etmiyorum. Aynıyım bence."',
            cevap: '"Değilsin." Israr etmedi ama geri de almadı.',
            etki: { iliski: 3, gerilim: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Sana bir şey sormak istiyorum ama sorarsam kızacaksın."',
        secenekler: [
          {
            id: 'sor',
            label: '"Sor. Kızmam."',
            cevap:
              '"Bana her şeyi anlatıyor musun? Yoksa iyi kısımları mı anlatıyorsun?"',
            etki: { iliski: 6 },
            sonraki: 'c',
          },
          {
            id: 'sorma',
            label: '"Sorma o zaman."',
            cevap: '"Tamam." Sordu sayılır, cevabı da aldı sayılır.',
            etki: { iliski: -3, gerilim: 12 },
          },
        ],
      },
      c: {
        id: 'c',
        metin: 'Soruyu sordu ve bekliyor.',
        secenekler: [
          {
            id: 'durust',
            label: '"İyi kısımları anlatıyorum. Haklısın."',
            cevap:
              '"Teşekkür ederim." Bunu söylemesi tuhaf geldi ama samimiydi. "Kötüsünü de anlat. Kaldırırım."',
            etki: { iliski: 12, gerilim: -15, moral: 5 },
            isaret: { ad: 'durustluk', deger: 'itiraf' },
          },
          {
            id: 'hepsi',
            label: '"Her şeyi anlatıyorum. Gizlediğim bir şey yok."',
            cevap: '"Peki." İnandı mı, belli değil.',
            etki: { iliski: 3, gerilim: 4 },
            isaret: { ad: 'durustluk', deger: 'inkar' },
          },
          {
            id: 'koruyorum',
            label: '"Seni üzmek istemiyorum, o kadar."',
            cevap:
              '"Beni korumana gerek yok." Sesi sertleşti biraz. "Ben senin sevgilinim, hastan değil."',
            etki: { iliski: 5, gerilim: -5 },
            isaret: { ad: 'durustluk', deger: 'koruma' },
          },
        ],
      },
    },
  },

  {
    id: 'g12-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [12],
    kok: 'a',
    kapanis: '"On altı gün. Sayıyorum lan." Sayıyor.',
    replikler: {
      a: {
        id: 'a',
        kosul: { isaret: 'cikis_plani', isaretYas: 5 },
        atla: 'b',
        metin:
          '"Hatırlıyor musun, {yas:cikis_plani} gün önce sana çıkınca ne yapacaksın diye sormuştum. Fikrin değişti mi?"',
        secenekler: [
          {
            id: 'ayni',
            label: '"Değişmedi. Aynı şey."',
            cevap:
              '"Tahmin etmiştim." Güldü. "Sen kararını verdin, ben plan yapıyorum. Uyuşmuyoruz ama olsun."',
            etki: { iliski: 5, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'degisti',
            label: '"Değişti. Artık başka bir şey istiyorum."',
            cevap: '"Ne?" Hemen atladı üstüne.',
            etki: { iliski: 6, moral: 4 },
            isaret: { ad: 'cikis_plani', deger: 'degisti' },
            sonraki: 'b',
          },
          {
            id: 'unuttum',
            label: '"Ne demiştim ben?"',
            cevap: '"\'{deger:cikis_plani}\' demiştin. Ben unutmuyorum lan."',
            etki: { iliski: 3, moral: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Bak bir şey söyleyeceğim. Sen gittiğinden beri kimse doğru düzgün plan yapmıyor."',
        secenekler: [
          {
            id: 'yaparsiniz',
            label: '"Yaparsınız lan. Bana ihtiyacınız yok."',
            cevap: '"Var." Tek kelime, kestirip attı.',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'kanka_ciddi', deger: 'g12' },
          },
          {
            id: 'iyi',
            label: '"İyi. Ben gelene kadar bir şey yapmayın."',
            cevap: '"Yapmıyoruz zaten." Bunu şikayet gibi söyledi.',
            etki: { iliski: 6, moral: 5 },
          },
        ],
      },
    },
  },
];
