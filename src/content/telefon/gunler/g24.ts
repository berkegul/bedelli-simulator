import type { Gorusme } from '../tipler';

/** GÜN 24 — EVRAK. Terhis işlemleri başladı. Dört gün. */
export const GUN_24: Gorusme[] = [
  {
    id: 'g24-baba',
    kayit: 'ev',
    rol: 'baba',
    tur: 'omurga',
    gunler: [24],
    oncelik: 140,
    kok: 'a',
    kapanis: '"Dört gün." Kapattı. Hesabı yapmış, yolu ölçmüş, hazır.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Kaçta çıkıyorsun o gün? Saatini söyle, ben ona göre yola çıkacağım."',
        secenekler: [
          {
            id: 'onbir',
            label: '"On birde diyorlar. Ama kesin değil."',
            cevap:
              '"Dokuzda oradayım." Hesabı çoktan yapmış. "Beklerim, sorun değil."',
            etki: { iliski: 9, moral: 8 },
            isaret: { ad: 'karsilama', deger: 'baba' },
            sonraki: 'b',
          },
          {
            id: 'belli_degil',
            label: '"Belli değil baba. Evrak işi uzayabilir."',
            cevap: '"Beklerim." İki kelime, tartışma yok.',
            etki: { iliski: 8, moral: 7 },
            isaret: { ad: 'karsilama', deger: 'baba' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Yolu baktım. Üç saat sürüyor. Annen de gelecek, o sabah beşten uyanmış olur zaten."',
        secenekler: [
          {
            id: 'gulumse',
            label: '"Beşten uyanır tabii."',
            cevap: '"Uyanır." Bu ikinizin ortak bilgisi.',
            etki: { iliski: 8, moral: 8 },
            sonraki: 'c',
          },
          {
            id: 'yorulmayin',
            label: '"Yorulmayın, otobüsle gelirim."',
            cevap:
              '"Geleceğiz." Bu konu kapandı, üç hafta önce kapanmıştı zaten.',
            etki: { iliski: 7, moral: 6 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Bir şey diyeceğim. Bu yirmi dört günde seninle, bütün hayatımda konuştuğumdan çok konuştum."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de farkındayım. İyi oldu."',
            cevap: '"İyi oldu." Onayladı. Sonra: "Bitmesin."',
            etki: { iliski: 14, moral: 10 },
            isaret: { ad: 'baba_itiraf', deger: 'konusma' },
          },
          {
            id: 'devam',
            label: '"Gelince de devam edelim."',
            cevap:
              'Uzun bir sessizlik. "Ederiz." Bunu söyleyip söyleyemeyeceğinden emin değil ama söyledi.',
            etki: { iliski: 13, moral: 9 },
            isaret: { ad: 'baba_itiraf', deger: 'konusma' },
          },
          {
            id: 'sasirdim',
            label: '"Sen mi söylüyorsun bunu baba?"',
            cevap: '"Ben söylüyorum." Kendine de şaşırdı.',
            etki: { iliski: 11, moral: 9 },
            isaret: { ad: 'baba_itiraf', deger: 'konusma' },
          },
        ],
      },
    },
  },

  {
    id: 'g24-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [24],
    kok: 'a',
    kapanis: '"Dört gün." Dört parmağını saydı bu sefer.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Dört gün! Evrakları verdiler mi? Kağıt falan var mı imzalayacağın?"',
        secenekler: [
          {
            id: 'basladi',
            label: '"Başladı. Bugün liste okudular, benim adım da vardı."',
            cevap: '"Adın okundu mu?" Bunu bir tören gibi hayal etti.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'yarin',
            label: '"Yarın başlıyor. Teslim listesi çıkacak."',
            cevap: '"Neyi teslim edeceksin?" Meraklı.',
            etki: { iliski: 5, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Ben o gün ne yapacağımı bilmiyorum. Ağlar mıyım sence?"',
        secenekler: [
          {
            id: 'aglarsin',
            label: '"Ağlarsın. Kesin ağlarsın."',
            cevap: '"Ağlamam!" Ağlayacak.',
            etki: { iliski: 8, moral: 8 },
          },
          {
            id: 'agla',
            label: '"Ağla. Ben de ağlarım belki."',
            cevap: 'Sustu. "Sen ağlama, ben ağlarım." Görev paylaşımı yaptı.',
            etki: { iliski: 11, moral: 8, ozlem: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g24-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [24],
    kok: 'a',
    kapanis: 'Dört gün. Buluşma yeri ve saati artık kesin.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Dört gün. Nerede buluşuyoruz, kesinleştirelim artık."',
        secenekler: [
          {
            id: 'kapi',
            label: '"Kapıya gel. Çıkar çıkmaz seni göreyim."',
            kosul: { iliskiMin: { sevgili: 55 } },
            cevap:
              '"Kapıya mı?" Sesi titredi. "Tamam. Sabah dokuzda orada olurum."',
            etki: { iliski: 13, moral: 10 },
            isaret: { ad: 'bulusma_yeri', deger: 'kapi' },
            sonraki: 'b',
          },
          {
            id: 'eski',
            label: '"O eski yerde. Akşam."',
            cevap: '"Eski yer." Sesinde bir gülümseme var. "Tamam."',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'bulusma_yeri', deger: 'eski' },
            sonraki: 'b',
          },
          {
            id: 'ertesi',
            label: '"Ertesi gün görüşelim. İlk gün toparlanayım."',
            cevap: '"Tamam." Kabul etti. Kabul etmekten başka ne yapsın.',
            etki: { iliski: 3, gerilim: 7 },
            isaret: { ad: 'bulusma_yeri', deger: 'ertesi' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Dört gün sonra bu telefon görüşmeleri bitecek. Bu bana tuhaf geliyor."',
        secenekler: [
          {
            id: 'bitmeyecek',
            label: '"Bitmeyecek. Sadece değişecek."',
            cevap: '"Değişecek." Bu kelimeyi sevdi. "Tamam, değişecek."',
            etki: { iliski: 10, moral: 8 },
          },
          {
            id: 'iyi_ki',
            label: '"İyi ki bitiyor. Yirmi dört gün yeter."',
            cevap: '"Yeter." Güldü. "Fazlasıyla yeter."',
            etki: { iliski: 7, moral: 8 },
          },
        ],
      },
    },
  },
];
