import type { Gorusme } from './tipler';

/**
 * Dolgu havuzu: güne bağlı olmayan, tekrar oynanabilen görüşmeler.
 * Eski motorun on üç konuşmasının tamamı buraya taşındı — hiçbiri çöpe
 * gitmedi, yeni şemaya çevrildi ve rollere dağıtıldı. Omurga bir gün için
 * bir şey sunamazsa (oyuncu o günü atladıysa, rol o gün yazılı değilse)
 * telefon sessiz kalmıyor, buradan çekiyor.
 *
 * Hepsi tekSefer: false — tekrar edebilirler, ama motor önce görülmemişleri
 * dener.
 */
export const DOLGU: Gorusme[] = [
  // ───────────────────────────────── ANNE
  {
    id: 'd-anne-yemek',
    kayit: 'ev',
    rol: 'anne',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Telefonu kapattığında kulağında hâlâ sesi vardı.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Alo {ad}? Sesin iyi geliyor mu bakayım... Yemekler nasıl, doyuyor musun? Zayıflamışsındır sen."',
        secenekler: [
          {
            id: 'iyi',
            label: '"İyiyim anne, yemekler güzel."',
            cevap: '"Güzelmiş diyor ama ben bilirim. Kantinden bir şeyler al, parayı idareli kullan."',
            etki: { iliski: 5, moral: 9 },
            sonraki: 'b',
          },
          {
            id: 'kotu',
            label: '"Doğru düzgün yemiyorum aslında."',
            cevap:
              '"Aman oğlum, yiyeceksin! Ben burada senin için dua ediyorum, sen orada aç kalıyorsun." Sesi titredi.',
            etki: { iliski: 6, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'sessiz',
            label: 'Sesini çıkarma, sadece dinle',
            cevap: '"Konuşmuyorsun... Zor mu geliyor? Yirmi sekiz gün çabuk geçer oğlum, bak geçer."',
            etki: { iliski: 4, moral: 7, ozlem: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Sen kendine bak yeter. Başka bir şey istemiyorum."',
        secenekler: [
          {
            id: 'bakarim',
            label: '"Bakarım anne."',
            cevap: '"Bak." Kısa ve kesin.',
            etki: { iliski: 3, moral: 3 },
          },
        ],
      },
    },
  },
  {
    id: 'd-anne-usume',
    kayit: 'ev',
    rol: 'anne',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Kapatmadan önce üç kere "kendine iyi bak" dedi.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Hava soğudu burada, orada nasıl? Üşüyor musun? O aldığımız çorapları giy, ince olanları giyme."',
        secenekler: [
          {
            id: 'giyiyorum',
            label: '"Giyiyorum anne, merak etme."',
            cevap: '"Tamam tamam. Babana da söyleyeyim, o da merak ediyor ama sormuyor. Bilirsin."',
            etki: { iliski: 5, moral: 8, digerIliski: { kim: 'baba', puan: 2 } },
          },
          {
            id: 'kosturuyoruz',
            label: '"Burada üşümeye vakit yok, sürekli koşturuyoruz."',
            cevap: '"Koşturuyor musun? Yorulma çok. Ayağını da üşütme." Neyi dinlediği belli değil.',
            etki: { iliski: 4, moral: 6, enerji: 2 },
          },
        ],
      },
    },
  },

  // ───────────────────────────────── BABA
  {
    id: 'd-baba-nasil',
    kayit: 'ev',
    rol: 'baba',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: '"Anneni vereyim" dedi ve rahatladı.',
    replikler: {
      a: {
        id: 'a',
        metin:
          'Telefonu baban açtı. Bir sessizlik oldu. "Eee. Nasıl gidiyor orada?" Baban telefonda hiç rahat olmaz.',
        secenekler: [
          {
            id: 'iyi',
            label: '"İyi gidiyor baba. Alıştım."',
            cevap: '"Hı. İyi. Alışırsın." Duraksadı. "Ben de yapmıştım. Zor değil." Bu, onun övgüsü.',
            etki: { iliski: 6, moral: 10 },
          },
          {
            id: 'zor',
            label: '"Zor baba. Çok zor."',
            cevap:
              '"Zordur." Uzun bir sessizlik. "Ama sen yaparsın." Bunu ondan duymak beklediğinden ağır geldi.',
            etki: { iliski: 8, moral: 7 },
          },
        ],
      },
    },
  },

  // ───────────────────────────────── SEVGİLİ
  {
    id: 'd-sevgili-ozlem',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Kapatırken ikiniz de kapatmadınız. Sonunda o kapattı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Aşkııım! Sonunda! Kaç gündür bekliyorum bu telefonu. Çok özledim seni."',
        secenekler: [
          {
            id: 'ben_daha',
            label: '"Ben daha çok özledim."',
            cevap: '"Yalancı." Gülüyor. "Ama devam et, hoşuma gidiyor."',
            etki: { iliski: 7, moral: 12 },
          },
          {
            id: 'saka',
            label: '"Burada seni düşünmeye bile vakit yok." (şaka)',
            cevap: '"Ne?! Kapatıyorum ha!" Kapatmadı tabii. On dakika bunun üstüne güldünüz.',
            etki: { iliski: 5, moral: 10 },
          },
          {
            id: 'sesini',
            label: '"Sesini duymak iyi geldi, gerçekten."',
            cevap: '"Sesin yorgun geliyor. İyi misin sen?" Fark etti. Hep fark eder.',
            etki: { iliski: 8, moral: 11, enerji: 3 },
          },
        ],
      },
    },
  },
  {
    id: 'd-sevgili-kavga',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'dolgu',
    tekSefer: false,
    kosul: { gerilimMin: { sevgili: 20 } },
    kok: 'a',
    kapanis: 'Telefonu kapattın ve bir süre ankesörün önünde durdun.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Neden aramadın dün? Bütün gün telefonun başında bekledim." Sesi kırgın, kızgın değil.',
        secenekler: [
          {
            id: 'nobet',
            label: '"Nöbetteydim, gerçekten arayamadım."',
            cevap: '"Biliyorum... Biliyorum. Sadece zor. Sen orada, ben burada." Sesi yumuşadı.',
            etki: { iliski: 4, gerilim: -8, moral: 7 },
          },
          {
            id: 'ozur',
            label: '"Özür dilerim. Haklısın."',
            cevap:
              '"Kızmadım ki. Sadece seni merak ediyorum." Bir süre sessiz kaldınız, iyi bir sessizlikti.',
            etki: { iliski: 6, gerilim: -12, moral: 9 },
          },
          {
            id: 'sert',
            label: '"Burası asker ocağı, otel değil."',
            cevap: '"Biliyorum ne olduğunu." Ses tonu değişti. Konuşma orada bitti.',
            etki: { iliski: -6, gerilim: 12, moral: -6 },
          },
        ],
      },
    },
  },
  {
    id: 'd-sevgili-gun',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Üç dakika üç saniye gibi geçti.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Anlat bakalım, günün nasıl geçti? Her şeyi anlat, hiçbir şeyi atlama."',
        secenekler: [
          {
            id: 'anlat',
            label: 'Bütün günü tek tek anlat',
            cevap:
              '"Yatak toplamayı bu kadar heyecanla anlatan başka biri yoktur." Gülüyor ama sonuna kadar dinledi.',
            etki: { iliski: 8, gerilim: -6, moral: 11 },
            isaret: { ad: 'anlatan', deger: 'evet' },
          },
          {
            id: 'ayni',
            label: '"Her gün aynı. Anlatacak bir şey yok."',
            cevap: '"Olsun, aynısını anlat. Sesini dinliyorum ben zaten."',
            etki: { iliski: 2, gerilim: 4, moral: 8 },
          },
        ],
      },
    },
  },

  // ───────────────────────────────── KANKA
  {
    id: 'd-kanka-naber',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: '"Kendine iyi bak lan" dedi. Onda bu, sarılmak demek.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Lan {ad}! Yaşıyor musun? Nasıl gidiyor orada, dayanabiliyor musun?"',
        secenekler: [
          {
            id: 'dayaniyorum',
            label: '"Dayanıyorum kanka. Alıştım sayılır."',
            cevap: '"Helal. Ben iki gün dayanamazdım." Abartıyor ama iyi geliyor.',
            etki: { iliski: 5, moral: 9 },
          },
          {
            id: 'zor',
            label: '"Zor lan. Hiç anlatacak gibi değil."',
            cevap:
              '"Anlatma zaten, döndüğünde anlatırsın. Çay ısmarlarım, bütün gece dinlerim." Söz verdi.',
            etki: { iliski: 7, moral: 11 },
          },
        ],
      },
    },
  },
  {
    id: 'd-kanka-disari',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Kapattıktan sonra bir süre gülümsedin.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Dün herkes toplandı, sen yoktun. Masada bir sandalye boş bıraktık, şaka olsun diye."',
        secenekler: [
          {
            id: 'salaklar',
            label: '"Salaklar." (gülerek)',
            cevap: '"Fotoğrafını da çektik. Döndüğünde göstereceğiz." Bunu gerçekten yapmışlar.',
            etki: { iliski: 5, moral: 10 },
          },
          {
            id: 'ozledim',
            label: '"Özledim sizi ya."',
            cevap: 'Bir sessizlik oldu. "Biz de seni." Sonra hemen konuyu değiştirdi, o öyledir.',
            etki: { iliski: 8, moral: 11, ozlem: 6 },
          },
        ],
      },
    },
  },

  // ───────────────────────────────── KARDEŞ
  {
    id: 'd-kardes-dalga',
    kayit: 'kardes',
    rol: 'kardes',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: '"Annem seni soruyor sürekli, ara onu" dedi ve kapattı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Ooo asker abi! Saçları kazıttılar mı? Fotoğraf yok mu, göremiyoruz seni."',
        secenekler: [
          {
            id: 'yasak',
            label: '"Kameralı telefon yasak, kurtuldun."',
            cevap: '"Ne yazık. Ben de herkese göstereceğim diyordum." Gülüyor, sen de gülüyorsun.',
            etki: { iliski: 5, moral: 9 },
          },
          {
            id: 'sira',
            label: '"Sıra sana da gelecek, o zaman konuşuruz."',
            cevap: '"Bak şimdi ciddileşti." Ama sesinde bir şey var — merak ediyor aslında.',
            etki: { iliski: 4, moral: 7 },
          },
        ],
      },
    },
  },
  {
    id: 'd-kardes-ev',
    kayit: 'kardes',
    rol: 'kardes',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Kardeşinle konuşmak, bir anlığına sivil hayata dönmek gibiydi.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Evde sen yokken sessiz. Annem sürekli senin odana giriyor, bir şey aramıyor da."',
        secenekler: [
          {
            id: 'goz_kulak',
            label: '"Ona göz kulak ol."',
            cevap: '"Oluyorum zaten." Bir an durdu. "Sen de kendine dikkat et."',
            etki: { iliski: 7, moral: 10, digerIliski: { kim: 'anne', puan: 3 } },
          },
          {
            id: 'odam',
            label: '"Odama girme sakın."',
            cevap: '"Girdim bile." Gülüşme. Bu kadar normal bir şey duymak iyi geldi.',
            etki: { iliski: 5, moral: 8 },
          },
        ],
      },
    },
  },

  // ───────────────────────────────── EŞ
  {
    id: 'd-es-ev',
    kayit: 'es',
    rol: 'es',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Kapatmadan önce çocuğun sesini duydun: "Babaaa!"',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Merhaba. Ev sessiz, alışamadım. Çocuk her akşam kapıya bakıyor, sen geleceksin sanıyor."',
        secenekler: [
          {
            id: 'soyle',
            label: '"Söyle ona, yakında geliyorum."',
            cevap: '"Söylüyorum. Bugün resmini yapmış, üniformalı. Kepini yamuk çizmiş." Gülüyor.',
            etki: { iliski: 7, moral: 12, ozlem: 5 },
          },
          {
            id: 'sen',
            label: '"Sen nasılsın? Yalnız başına zor olmalı."',
            cevap:
              '"İdare ediyorum." Kısa bir duraklama. "Sormana sevindim." Bunu söylemesi ona zor gelir.',
            etki: { iliski: 9, moral: 10 },
          },
        ],
      },
    },
  },
  {
    id: 'd-es-isler',
    kayit: 'es',
    rol: 'es',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Telefonu kapattın. Evin döndüğünde yerinde duracağını biliyorsun.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Faturaları ödedim, merak etme. Sen kendine bak, buradaki işleri ben hallederim."',
        secenekler: [
          {
            id: 'yuk',
            label: '"Sana çok yük bindi, biliyorum."',
            cevap: '"Yük değil. Yirmi sekiz gün. Sen daha zorunu yapıyorsun."',
            etki: { iliski: 8, moral: 9 },
          },
          {
            id: 'abla',
            label: '"Bir şeye ihtiyacın olursa ablamı ara."',
            cevap: '"Aradım bile. Bize yemek getirdi." Her şeyi düşünmüş, her zamanki gibi.',
            etki: { iliski: 6, moral: 7 },
          },
        ],
      },
    },
  },

  // ───────────────────────────────── AKRABA
  {
    id: 'd-akraba-hayirli',
    kayit: 'akraba',
    rol: 'akraba',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: '"Hadi kolay gelsin." Konuşma kısaydı ama iyi geldi.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Ooo {ad}! Hayırlı olsun asker! Nasıl gidiyor, alıştın mı oraya?" Sesinde gerçek bir sevgi var.',
        secenekler: [
          {
            id: 'alistim',
            label: '"Alıştım sayılır. İdare ediyorum."',
            cevap: '"Alışırsın, alışırsın. Bizim zamanımızda iki yıldı, şükret."',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'zor',
            label: '"Zor geliyor açıkçası."',
            cevap:
              '"Zordur tabii. Ama sen delikanlısın, yaparsın." Kalıp cümle ama içten söylendi.',
            etki: { iliski: 5, moral: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Bir ihtiyacın olursa söyle, çekinme. Biz buradayız."',
        secenekler: [
          {
            id: 'sagol',
            label: '"Sağ ol, her şey var."',
            cevap: '"Olsun, yine de söyle." Bu teklifi üç kere daha yapacak.',
            etki: { iliski: 5, moral: 6 },
          },
          {
            id: 'tesekkur',
            label: '"Aradığın için teşekkür ederim. Beklemiyordum."',
            cevap:
              '"Ne demek oğlum." Sesi değişti. "Sen bizim çocuğumuzsun." Bu beklenmedik şekilde iyi geldi.',
            etki: { iliski: 8, moral: 10 },
          },
        ],
      },
    },
  },
  {
    id: 'd-akraba-memleket',
    kayit: 'akraba',
    rol: 'akraba',
    tur: 'dolgu',
    tekSefer: false,
    kok: 'a',
    kapanis: 'Kapattın. Memleket bir anlığına yakınlaştı.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Burada herkes seni soruyor. Bakkal bile sordu geçen gün, \'asker nasıl\' diye."',
        secenekler: [
          {
            id: 'selam',
            label: '"Selam söyle hepsine."',
            cevap: '"Söylerim." Söyleyecek, hem de herkese tek tek.',
            etki: { iliski: 6, moral: 8 },
          },
          {
            id: 'ozledim',
            label: '"Memleketi özledim ya."',
            cevap:
              '"Gel de bir kahve içelim, döndüğünde." Basit bir davet ama tuttu bir yerinden.',
            etki: { iliski: 7, moral: 9, ozlem: 5 },
          },
        ],
      },
    },
  },
];
