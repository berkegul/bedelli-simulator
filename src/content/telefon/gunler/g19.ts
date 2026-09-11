import type { Gorusme } from '../tipler';

/** GÜN 19 — TEK HANE. "Dokuz" demek garip geliyor, çünkü sayılabilir. */
export const GUN_19: Gorusme[] = [
  {
    id: 'g19-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [19],
    kok: 'a',
    kapanis: '"Dokuz." Kapatmadan önce bir daha söyledi.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Dokuz gün. Tek haneye indi. Ben bunu bekliyordum."',
        secenekler: [
          {
            id: 'garip',
            label: '"Tek hane garip geliyor. Sayılabilir bir şey oldu birden."',
            cevap: '"Hep sayılabilirdi." Güldü. "Sen saymıyordun."',
            etki: { iliski: 6, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'iyi',
            label: '"İyi hissettiriyor. İlk defa ucu göründü."',
            cevap: '"Göründü tabii." Sesi rahat.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Odanı temizledim bugün. Yatağı yaptım, havayı aldım. Hazır bekliyor."',
        secenekler: [
          {
            id: 'sagol',
            label: '"Sağ ol anne."',
            cevap: '"Ne demek." Kısa durdu. "Yatağını sen toplarsın artık, öğrenmişsindir."',
            etki: { iliski: 8, moral: 8 },
          },
          {
            id: 'yatak',
            label: '"Yatak toplamayı öğrendim bu arada. Ciddiyim."',
            cevap:
              '"Yok artık." Gerçekten şaşırdı. "Bu askerliğin tek faydası olur."',
            etki: { iliski: 9, moral: 9 },
            isaret: { ad: 'yatak_ogrendi', deger: 'evet' },
          },
        ],
      },
    },
  },

  {
    id: 'g19-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [19],
    kok: 'a',
    kapanis: 'Dokuz gün. Cümleler artık hep gelecek zamanda kuruluyor.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Dokuz. Bir haftadan biraz fazla. Bu kadar kısa bir şey söylemek tuhaf."',
        secenekler: [
          {
            id: 'tuhaf',
            label: '"Tuhaf evet. On dokuz gün önce sonsuz gibiydi."',
            cevap: '"Sonsuz gibiydi." Onayladı. "Şimdi çok kısa geliyor, hatta az."',
            etki: { iliski: 7, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'az',
            label: '"Az bile geliyor artık. Garip bir şey bu."',
            cevap: '"Nasıl yani?" Bunu duymayı beklemiyordu.',
            etki: { iliski: 5, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir şey itiraf edeceğim. Bu on dokuz günde bazı şeyleri özlemedim. Sürekli mesajlaşmayı mesela. Bu kötü bir şey mi?"',
        secenekler: [
          {
            id: 'degil',
            label: '"Değil. Ben de bazı şeyleri özlemedim."',
            cevap: '"Ne mesela?" Merakla sordu, korkmadı.',
            etki: { iliski: 9, moral: 6 },
            isaret: { ad: 'durustluk', deger: 'karsilikli' },
            sonraki: 'c',
          },
          {
            id: 'kirildim',
            label: '"Bunu duymak biraz garip oldu."',
            cevap:
              '"Yanlış anlaşıldı." Telaşlandı. "Seni özledim, konuşma şeklimizi özlemedim demek istedim."',
            etki: { iliski: 4, gerilim: 5 },
            sonraki: 'c',
          },
          {
            id: 'anladim',
            label: '"Anlıyorum. Burada da az konuşmak öğretici."',
            cevap: '"Aynen bunu diyorum!" Rahatladı.',
            etki: { iliski: 8, moral: 5 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Belki bu bize iyi geldi. Söylemesi tuhaf ama belki iyi geldi."',
        secenekler: [
          {
            id: 'geldi',
            label: '"Geldi bence. Kötü bir yoldan ama geldi."',
            cevap: '"Kötü bir yoldan." Güldü. "İyi tarif."',
            etki: { iliski: 10, gerilim: -8, moral: 7 },
          },
          {
            id: 'bilmiyorum',
            label: '"Bilemiyorum. Sonunda görürüz."',
            cevap: '"Görürüz." Dokuz gün sonra görecek.',
            etki: { iliski: 5, moral: 4 },
          },
        ],
      },
    },
  },

  {
    id: 'g19-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [19],
    kok: 'a',
    kapanis: '"Dokuz lan. Dokuz." Bu sayı onu fazlasıyla heyecanlandırdı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"TEK HANE! Tek haneye indik lan! Bunu kutlamamız lazım ama sen yoksun."',
        secenekler: [
          {
            id: 'sonra',
            label: '"Dokuz gün sonra kutlarız."',
            cevap: '"Dokuz gün sonra." Not aldı. Gerçekten not aldı.',
            etki: { iliski: 7, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'kutla',
            label: '"Sen kutla. Benim adıma da iç."',
            cevap: '"İçerim tabii." İçecek.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Plan kesinleşti. Yer ayarladım, herkese haber verdim. Dokuz gün sonra saat sekiz."',
        secenekler: [
          {
            id: 'herkes',
            label: '"Herkes kim?"',
            cevap:
              'İsim saydı. Bazılarını aylardır görmemişsin. "Hepsi geliyor. Hepsi sordu seni."',
            etki: { iliski: 9, moral: 9 },
            isaret: { ad: 'kanka_plan', deger: 'kesin' },
          },
          {
            id: 'yorgun',
            label: '"O gün yorgun olacağım lan."',
            cevap:
              '"Otur yorgun yorgun." Çözüm buldu. "Sen sadece orada ol."',
            etki: { iliski: 7, moral: 7 },
            isaret: { ad: 'kanka_plan', deger: 'kesin' },
          },
          {
            id: 'kalabalik',
            label: '"Kalabalık istemiyorum. Sadece sen olsan?"',
            cevap:
              'Bir sessizlik oldu. "Tamam." Hayal kırıklığını sakladı. "Sadece ben."',
            etki: { iliski: 6, moral: 5 },
            isaret: { ad: 'kanka_plan', deger: 'sade' },
          },
        ],
      },
    },
  },
];
