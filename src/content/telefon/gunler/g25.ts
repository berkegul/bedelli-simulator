import type { Gorusme } from '../tipler';

/** GÜN 25 — SON SERBEST. Üç gün. Artık her şey "son" diye anılıyor. */
export const GUN_25: Gorusme[] = [
  {
    id: 'g25-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [25],
    kok: 'a',
    kapanis: '"Üç gün." Sayıyı söylerken sesi gülüyordu.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Üç gün! Bugün son hafta sonun değil mi orada? Ne yaptınız?"',
        secenekler: [
          {
            id: 'serbest',
            label: '"Son serbest günümüz. Avluda oturduk, hava güzeldi."',
            cevap: '"Oturdunuz mu? İyi." Bunu hayal etmeye çalıştı.',
            etki: { iliski: 6, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'temizlik',
            label: '"Dolapları boşaltmaya başladık. Teslim listesi çıktı."',
            cevap: '"Boşaltıyor musunuz?" Bu ona gerçek geldi birden. "Bitiyor demek."',
            etki: { iliski: 7, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Üç gün sonra bu telefonu aramayacaksın. Ben buna alışamadım, garip değil mi? Aramana alıştım."',
        secenekler: [
          {
            id: 'ararim',
            label: '"Yine ararım anne. Başka yerden ararım."',
            cevap: '"Ararsın." Bunu duymak istedi. "Unutma ama."',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'aramaya_devam', deger: 'soz' },
          },
          {
            id: 'yanindayim',
            label: '"Aramama gerek kalmayacak. Yanında olacağım."',
            cevap: 'Sustu. "Doğru ya." Bunu unutmuştu.',
            etki: { iliski: 12, moral: 9, ozlem: 5 },
          },
        ],
      },
    },
  },

  {
    id: 'g25-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [25],
    kok: 'a',
    kapanis: 'Üç gün. Sesler artık yüzlere dönüşmek üzere.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Üç gün. Üç. Bugün takvime baktım ve gerçekten üç tane kutu kalmış."',
        secenekler: [
          {
            id: 'uc',
            label: '"Üç. Ben de bugün duvardaki çentikleri saydım."',
            cevap: '"Kaç tane var?" "Yirmi beş." "Yirmi beş..." Bu sayıyı sindirdi.',
            etki: { iliski: 8, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'hizli',
            label: '"Son hafta çok hızlı geçti."',
            cevap: '"Bana geçmedi." Güldü. "Ama şikayet etmiyorum."',
            etki: { iliski: 7, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Son üç günde bana bir şey söylemek istersen söyle. Sonrasında yüz yüze söylemek zor olur, telefonda kolay."',
        secenekler: [
          {
            id: 'ozledim',
            label: '"Seni çok özledim. Kelimeyle anlatamıyorum."',
            cevap: '"Anlatma o zaman." Sesi yumuşadı. "Üç gün sonra göster."',
            etki: { iliski: 12, moral: 9, ozlem: 8 },
            isaret: { ad: 'son_soz', deger: 'ozlem' },
          },
          {
            id: 'tesekkur',
            label: '"Teşekkür ederim. Yirmi beş gün boyunca oradaydın."',
            cevap:
              'Uzun bir sessizlik. "Başka yerde olmayı düşünmedim ki." Bu cümle sende kaldı.',
            etki: { iliski: 14, moral: 10 },
            isaret: { ad: 'son_soz', deger: 'tesekkur' },
          },
          {
            id: 'ozur',
            label: '"Bazı günler kötü davrandım. Onun için özür dilerim."',
            cevap:
              '"Biliyorum." Sonra: "Ama sen oradaydın. Ben burada rahat koltuktaydım." Adil davrandı.',
            etki: { iliski: 13, gerilim: -18, moral: 8 },
            isaret: { ad: 'son_soz', deger: 'ozur' },
          },
          {
            id: 'yok',
            label: '"Yüz yüze söylerim. Üç gün beklerim."',
            cevap: '"Beklerim." Kabul etti.',
            etki: { iliski: 6, moral: 6 },
            isaret: { ad: 'son_soz', deger: 'yuz_yuze' },
          },
        ],
      },
    },
  },

  {
    id: 'g25-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [25],
    kok: 'a',
    kapanis: '"Üç gün lan!" Bu sayıyı bağırmadan söyleyemiyor artık.',
    replikler: {
      a: {
        id: 'a',
        metin: '"ÜÇ GÜN! Üç! Ben bu hafta hiçbir şey yapamadım, sırf bunu düşündüm."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de. İki gündür kafam hep dışarıda."',
            cevap: '"Normal lan." Onayladı. "Ben olsam çoktan kaçmıştım."',
            etki: { iliski: 7, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'sakin',
            label: '"Sakin ol lan, üç gün daha var."',
            cevap: '"SAKİN OLAMIYORUM." Gerçekten olamıyor.',
            etki: { iliski: 6, moral: 8 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bak, üç gün sonra bu iş bitince sen değişmiş olacaksın. Ben de fark edeceğim. Bunu şimdiden söylüyorum ki sonra tartışmayalım."',
        secenekler: [
          {
            id: 'degismedim',
            label: '"Değişmedim lan ben."',
            cevap: '"Değiştin." Israr etti. "Sesin bile değişti. Ama sorun değil."',
            etki: { iliski: 6, moral: 6 },
          },
          {
            id: 'degistim',
            label: '"Değiştim. Kendim de biliyorum."',
            cevap:
              '"İyi." Rahatladı. "Ben de bu yüzden söyledim. Tartışmayalım diye."',
            etki: { iliski: 10, moral: 7 },
            isaret: { ad: 'degisim_farkindaligi', deger: 'evet' },
          },
          {
            id: 'sen_de',
            label: '"Sen de değişmişsin lan. Sen de farkında değilsin."',
            cevap:
              'Bir sessizlik. "Ben mi?" Bunu hiç düşünmemişti. "Olabilir."',
            etki: { iliski: 9, moral: 7 },
          },
        ],
      },
    },
  },
];
