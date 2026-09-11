import type { Gorusme } from '../tipler';

/** GÜN 18 — ON GÜN. Üçüncü eşik. Baba bugün konuşuyor ve az konuşuyor. */
export const GUN_18: Gorusme[] = [
  {
    id: 'g18-baba',
    kayit: 'ev',
    rol: 'baba',
    tur: 'omurga',
    gunler: [18],
    oncelik: 140,
    kok: 'a',
    kapanis: '"On gün." Kapattı. Fazla söze gerek duymadı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"On gün kaldı."',
        secenekler: [
          {
            id: 'on',
            label: '"On gün baba."',
            cevap: '"Hı." Bir sessizlik. "Ben seni almaya geleceğim."',
            etki: { iliski: 8, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'inanamiyorum',
            label: '"On gün. Tek haneye iniyor yarın."',
            cevap:
              '"Tek hane." Bu kelimeyi tattı. "Bizde tek haneye inince kimse uyumazdı."',
            etki: { iliski: 9, moral: 7 },
            isaret: { ad: 'baba_anisi', deger: 'tek_hane' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Seni almaya geleceğim dedim ya. Arabayla. Annen de gelir ama o kapıda bekler, ben içeride beklemem."',
        secenekler: [
          {
            id: 'gel',
            label: '"Gel baba. İyi olur."',
            cevap: '"Gelirim." Anlaşma bu kadar.',
            etki: { iliski: 9, moral: 8 },
            isaret: { ad: 'karsilama', deger: 'baba' },
            sonraki: 'c',
          },
          {
            id: 'gerek_yok',
            label: '"Gerek yok, otobüsle gelirim."',
            cevap:
              'Uzun bir sessizlik. "Geleceğim." Tartışma değil, bilgi verdi.',
            etki: { iliski: 6, moral: 6 },
            isaret: { ad: 'karsilama', deger: 'baba' },
            sonraki: 'c',
          },
          {
            id: 'anne_de',
            label: '"Annem de gelsin. İçeri kadar gelsin."',
            cevap: '"Gelir zaten." Kısa durdu. "Onu tutamam ben."',
            etki: { iliski: 8, moral: 7, digerIliski: { kim: 'anne', puan: 6 } },
            isaret: { ad: 'karsilama', deger: 'ikisi' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Bir şey daha. Sen gittikten sonra ben senin odana girmedim. Annen girdi, ben girmedim. Bugün girdim."',
        secenekler: [
          {
            id: 'ne_oldu',
            label: '"Ne oldu bugün?"',
            cevap: '"Hiç." Bir sessizlik. "On gün kaldı diye düşündüm, o kadar."',
            etki: { iliski: 12, moral: 8, ozlem: 7 },
            isaret: { ad: 'baba_itiraf', deger: 'oda' },
          },
          {
            id: 'sessiz',
            label: 'Sesini çıkarma',
            cevap: '"Neyse." Söylediğine pişman değil. "Hadi kapat, kontörün gider."',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'baba_itiraf', deger: 'oda' },
          },
        ],
      },
    },
  },

  {
    id: 'g18-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [18],
    oncelik: 135,
    kok: 'a',
    kapanis: '"On gün!" Kapattıktan sonra bir daha aradı: "Unuttum, on gün!"',
    replikler: {
      a: {
        id: 'a',
        metin: '"ON GÜN! On gün {ad}! Ben bugün bunu herkese söyledim."',
        secenekler: [
          {
            id: 'herkese',
            label: '"Kime söyledin?"',
            cevap:
              '"Komşuya, bakkala, bir de otobüste yanımdaki kadına." Utanmıyor.',
            etki: { iliski: 8, moral: 9 },
            sonraki: 'b',
          },
          {
            id: 'on',
            label: '"On gün anne. Bitiyor."',
            cevap: '"Bitiyor!" Tekrarladı. Kelimeyi sevdi.',
            etki: { iliski: 7, moral: 8 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ne yiyeceksin ilk gün? Söyle, hazırlayayım. Listeyi yapıyorum, ciddiyim, kağıda yazıyorum."',
        secenekler: [
          {
            id: 'liste',
            label: 'Üç şey say',
            cevap:
              '"Yazdım." Gerçekten yazdı. "Başka?" Başka da yazacak.',
            etki: { iliski: 10, moral: 9 },
            isaret: { ad: 'ilk_yemek', deger: 'listeledi' },
          },
          {
            id: 'nefarketmez',
            label: '"Ne yaparsan onu yerim anne."',
            cevap: '"Öyle deme, söyle bir şey." Israr etti, bir şey istemesini istiyor.',
            etki: { iliski: 5, moral: 6 },
          },
          {
            id: 'uyku',
            label: '"Önce uyuyacağım. Sonra yerim."',
            cevap: '"Uyu tabii." Kısa durdu. "Ama uyanınca sıcak olsun, ben hazırlarım."',
            etki: { iliski: 8, moral: 8 },
            isaret: { ad: 'ilk_yemek', deger: 'uyku_sonra' },
          },
        ],
      },
    },
  },

  {
    id: 'g18-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [18],
    oncelik: 135,
    kok: 'a',
    kapanis: 'On gün. Bu sayıyı ikiniz de birkaç kere tekrar ettiniz.',
    replikler: {
      a: {
        id: 'a',
        metin: '"On gün. Bugün sabah uyandım ve ilk aklıma gelen bu oldu."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Benim de. Zil çalmadan önce uyandım, on gün diye düşündüm."',
            cevap: '"Aynı anda mı düşündük acaba?" Bu ihtimal hoşuna gitti.',
            etki: { iliski: 9, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'sayiyorum',
            label: '"Artık her sabah sayıyorum. Alışkanlık oldu."',
            cevap: '"Benim de." İkiniz de aynı ritüeli kurmuşsunuz.',
            etki: { iliski: 8, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Şimdi ciddi bir şey soracağım. Çıktığın gün beni görmek istiyor musun gerçekten? Yorgun olacaksın, ailen olacak, kalabalık olacak."',
        secenekler: [
          {
            id: 'istiyorum',
            label: '"İstiyorum. Kalabalık olsa da istiyorum."',
            cevap: '"Tamam." Sesi titredi biraz. "O zaman geleceğim."',
            etki: { iliski: 12, moral: 9 },
            isaret: { ad: 'cikis_bulusma', deger: 'evet' },
            sonraki: 'c',
          },
          {
            id: 'ertesi',
            label: '"Ertesi gün görüşelim. İlk gün kendimde olmayacağım."',
            cevap:
              '"Mantıklı." Kabul etti. Mantıklı olmak her zaman yeterli değil ama.',
            etki: { iliski: 4, gerilim: 6 },
            isaret: { ad: 'cikis_bulusma', deger: 'ertesi' },
            sonraki: 'c',
          },
          {
            id: 'sen_karar',
            label: '"Sen ne istersen. Ben nasıl olsa geleceğim."',
            cevap: '"Ben soruyorum ama." Cevap alamadı, bunu not etti.',
            etki: { iliski: 2, gerilim: 7 },
            isaret: { ad: 'cikis_bulusma', deger: 'belirsiz' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"On gün sonra sesin değil, yüzün olacak. Buna alışmam lazım."',
        secenekler: [
          {
            id: 'bana_da',
            label: '"Bana da lazım. On sekiz gündür sesten ibaretsin."',
            cevap: '"Sesten ibaret." Güldü. "Kötü bir tarif değil aslında."',
            etki: { iliski: 10, moral: 8 },
          },
          {
            id: 'unutmadim',
            label: '"Yüzünü unutmadım. Merak etme."',
            cevap: '"Emin misin?" Şaka yapıyor. Yarısı şaka.',
            etki: { iliski: 8, moral: 7 },
          },
        ],
      },
    },
  },

  {
    id: 'g18-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [18],
    oncelik: 135,
    kok: 'a',
    kapanis: '"ON GÜN LAN!" Bağırdı, biri ona kızdı, umursamadı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"ON GÜN! Takvimde on tane kutu kaldı. Saydım, on tane."',
        secenekler: [
          {
            id: 'saydin',
            label: '"Her akşam sayıyorsun galiba."',
            cevap: '"Sayıyorum lan." Bundan hiç utanmıyor.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'yakin',
            label: '"Yakın artık. İlk defa yakın hissettim."',
            cevap: '"Değil mi ya!" Sevindi. "Ben iki gündür öyle hissediyorum."',
            etki: { iliski: 7, moral: 8 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Plan yapıyorum. Çıktığın gün için. Şimdi dinle: seni alacağım, doğru bir yere gideceğiz, sonra da..."',
        secenekler: [
          {
            id: 'dinle',
            label: '"Anlat, dinliyorum."',
            cevap:
              'On dakika plan anlattı. Yarısı imkansız. Hiç itiraz etmedin.',
            etki: { iliski: 9, moral: 9 },
            isaret: { ad: 'kanka_plan', deger: 'dinledi' },
          },
          {
            id: 'uyku',
            label: '"Ben ilk gün uyuyacağım demiştim ya."',
            kosul: { isaret: 'cikis_plani', isaretDeger: 'uyku' },
            cevap:
              '"Hâlâ uyku mu lan? {yas:cikis_plani} gün önce de bunu söylüyordun. Tamam, uyu. Ben kapıda beklerim."',
            etki: { iliski: 7, moral: 8 },
            isaret: { ad: 'kanka_plan', deger: 'uyku_israri' },
          },
          {
            id: 'yavas',
            label: '"Yavaş lan. Daha on gün var."',
            cevap: '"On gün plan yapmaya yetmez!" Ciddi söyledi.',
            etki: { iliski: 5, moral: 6 },
          },
        ],
      },
    },
  },
];
