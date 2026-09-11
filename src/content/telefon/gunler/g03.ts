import type { Gorusme } from '../tipler';

/**
 * GÜN 3 — DÜZEN. Yatak toplama, ilk ciddi azar.
 * Bugün evi arayınca baban açıyor (ZORUNLU_EV_ROLU). Kadronun en az konuşan
 * karakterini erken tanıtmazsak oyuncu 28 günü babasız bitirebiliyor.
 */
export const GUN_03: Gorusme[] = [
  {
    id: 'g03-baba',
    kayit: 'ev',
    rol: 'baba',
    tur: 'omurga',
    gunler: [3],
    kok: 'a',
    kapanis: '"Anneni vereyim" dedi ve sesinden rahatladığı belliydi.',
    ankesorKapanis: '"Kapatmam lazım baba, kuyruk var." "Tamam. Tamam." Hemen kapattı.',
    replikler: {
      a: {
        id: 'a',
        metin:
          'Telefonu baban açtı. Bir sessizlik oldu, ikiniz de kimin konuşacağını bekliyordunuz. "Eee. Nasıl gidiyor orada?"',
        secenekler: [
          {
            id: 'iyi',
            label: '"İyi gidiyor baba. Alışıyorum."',
            cevap: '"Hı. İyi." Duraksadı. "Alışırsın."',
            etki: { iliski: 4, moral: 3 },
            sonraki: 'b',
          },
          {
            id: 'zor',
            label: '"Zor. Sabah yatağımı yirmi kere toplattılar."',
            cevap:
              '"Yirmi kere mi?" İlk defa sesinde bir şey kıpırdadı. "Bize otuz toplatmıştı bizimki."',
            etki: { iliski: 8, moral: 5 },
            isaret: { ad: 'babaya_acildi', deger: 'g3' },
            sonraki: 'c',
          },
          {
            id: 'anne',
            label: '"Annem nerede? Yok mu?"',
            cevap:
              '"Çarşıya indi." Kısa durdu. "Bana da bir şey sorabilirsin ya." Bunu söylediğine ikisi de şaşırdı.',
            etki: { iliski: 2, gerilim: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Yemek nasıl? Doyuyor musun?" Annenin sorusunu soruyor, kendi sorusu değil bu.',
        secenekler: [
          {
            id: 'idare',
            label: '"İdare eder."',
            cevap: '"İdare ederse iyidir." Bu konuyu kapattı, rahatladı.',
            etki: { iliski: 2 },
            sonraki: 'd',
          },
          {
            id: 'sor',
            label: '"Baba sen nasılsın? Annem nasıl, keyfi yerinde mi?"',
            cevap:
              'Beklemiyordu. "Ben iyiyim." Sonra: "Annen... Senin odana giriyor sürekli. Bir şey aramıyor da." Sesi düştü.',
            etki: { iliski: 9, moral: 4, digerIliski: { kim: 'anne', puan: 4 } },
            isaret: { ad: 'babaya_sordu', deger: 'evet' },
            sonraki: 'd',
          },
          {
            id: 'askerlik',
            label: '"Sen nasıl yaptın baba? Senin askerliğin nasıldı?"',
            cevap: '"Uzundu." Bir sessizlik. "On sekiz ay."',
            etki: { iliski: 7, moral: 3 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Bizim zamanımızda telefon da yoktu. Ayda bir mektup. Annene ilk mektubu yazana kadar iki hafta geçti, ne yazacağımı bilemedim."',
        secenekler: [
          {
            id: 'ne',
            label: '"Ne yazdın sonunda?"',
            cevap:
              '"Hava durumunu." Kendi kendine güldü. "Sonra o bana kızdı, ne biçim mektup diye."',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'baba_anisi', deger: 'mektup' },
            sonraki: 'd',
          },
          {
            id: 'zordur',
            label: '"Ben de şu an ne diyeceğimi bilmiyorum."',
            cevap: '"Biliyorum." İki kelime, ama tam yerine oturdu.',
            etki: { iliski: 9, moral: 6 },
            isaret: { ad: 'baba_anisi', deger: 'sessizlik' },
            sonraki: 'd',
          },
        ],
      },
      d: {
        id: 'd',
        metin: '"Neyse. Sen işini yap, bitir gel." Kapatma cümlesi bu, her seferinde aynı.',
        secenekler: [
          {
            id: 'tamam',
            label: '"Tamam baba."',
            cevap: '"Tamam." Kapatmadı. Bir şey daha söyleyecek gibi durdu, söylemedi.',
            etki: { iliski: 3 },
          },
          {
            id: 'sagol',
            label: '"Konuştuğumuz iyi oldu."',
            cevap:
              'Uzun bir sessizlik. "Hı." Sonra, çok alçak sesle: "Bana da iyi geldi." Bunu duyduğuna emin değilsin.',
            etki: { iliski: 10, moral: 9 },
            isaret: { ad: 'baba_yumusadi', deger: 'g3' },
          },
        ],
      },
    },
  },

  {
    id: 'g03-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [3],
    kok: 'a',
    kapanis: 'Kapattıktan sonra hâlâ konuşuyor gibiydi.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Üçüncü gün. Nasıl, biraz alıştın mı? Sesin dünkünden iyi geliyor."',
        secenekler: [
          {
            id: 'alistim',
            label: '"Biraz. Nereye ne zaman gideceğimi öğrendim en azından."',
            cevap: '"Aferin sana." Bunu gerçekten gurur duyarak söyledi.',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'azar',
            label: '"Bugün yatağımı yirmi kere toplattılar anne."',
            cevap:
              '"Yirmi kere mi? Niye?" Sonra kendi cevapladı: "Sen zaten hiç toplamazdın ki."',
            etki: { iliski: 4, moral: 5 },
            isaret: { ad: 'ilk_azar', deger: 'yatak' },
            sonraki: 'b',
          },
          {
            id: 'ayni',
            label: '"Aynı anne. Her gün aynı."',
            cevap: '"Aynıysa iyi. Değişiklik olmasın, alışırsın." Kendi mantığı var.',
            etki: { iliski: 2 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Koli yollayacağım. Ne istersin? Çorap, iç çamaşırı, bir de o sevdiğin kurabiyeden yapayım mı?"',
        secenekler: [
          {
            id: 'kurabiye',
            label: '"Kurabiye yap. Onu yap."',
            cevap: '"Yaparım." Sesi aydınlandı. Ona yapacak bir iş verdin, en çok bunu istiyordu.',
            etki: { iliski: 8, moral: 5 },
            isaret: { ad: 'koli_istegi', deger: 'kurabiye' },
          },
          {
            id: 'pratik',
            label: '"Çorap yeter. Kalın çorap, bot vuruyor."',
            cevap: '"Bot mu vuruyor? Ayağın mı yaralandı?" Yanlış kapıyı açtın.',
            etki: { iliski: 5, moral: 2 },
            isaret: { ad: 'koli_istegi', deger: 'corap' },
          },
          {
            id: 'gerek',
            label: '"Gerek yok anne, her şey var burada."',
            cevap: '"Var mı? Yok. Ben biliyorum." Yine de yollayacak.',
            etki: { iliski: 2, gerilim: 3 },
            isaret: { ad: 'koli_istegi', deger: 'reddetti' },
          },
        ],
      },
    },
  },

  {
    id: 'g03-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [3],
    kok: 'a',
    kapanis: 'Üç dakika üç saniye gibi geçti.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Sesin bugün daha iyi geliyor. Alışıyor musun yoksa bana mı öyle geliyor?"',
        secenekler: [
          {
            id: 'alisiyorum',
            label: '"Galiba alışıyorum. Garip ama."',
            cevap: '"Garip olan ne?"',
            etki: { iliski: 4, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'senle',
            label: '"Seninle konuşunca iyi oluyorum, o kadar."',
            cevap: '"O zaman her gün konuşalım." Pazarlık gibi söyledi ama ciddiydi.',
            etki: { iliski: 8, moral: 9 },
            isaret: { ad: 'sevgili_bagimlilik', deger: 'evet' },
            sonraki: 'b',
          },
          {
            id: 'hayir',
            label: '"Yok ya. Hâlâ buradan kaçmak istiyorum."',
            cevap: '"Kaçma." Güldü ama sesinde endişe vardı.',
            etki: { iliski: 5, moral: -2, ozlem: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir şey söyleyeceğim, kızma. Dün gece telefonunu açtım, konuşma geçmişimize baktım. Salakça değil mi?"',
        secenekler: [
          {
            id: 'degil',
            label: '"Değil. Ben de burada senin sesini hatırlamaya çalışıyorum."',
            cevap: 'Sessizlik. Sonra: "Off. Ağlatma beni." Ağladı biraz.',
            etki: { iliski: 9, moral: 7, ozlem: 5 },
            isaret: { ad: 'sevgili_yakinlik', deger: 'g3' },
          },
          {
            id: 'salak',
            label: '"Biraz salakça. Ama yaparım ben de olsam."',
            cevap: '"Yaparsın tabii, sen daha beterisin." Ortam düzeldi.',
            etki: { iliski: 6, moral: 6 },
          },
          {
            id: 'gecistir',
            label: '"Yapma öyle şeyler, kendini üzersin."',
            cevap: '"Tamam." Kısa. Bir şey bekliyordu, o gelmedi.',
            etki: { iliski: 1, gerilim: 7 },
          },
        ],
      },
    },
  },

  {
    id: 'g03-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [3],
    kok: 'a',
    kapanis: '"Hadi lan, dayan." Kapattı, sonra tekrar aradı: "Şaka bir yana, iyi misin?"',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Dün akşam herkes toplandı, sen yoktun. Masada bir sandalye boş bıraktık, şaka olsun diye."',
        secenekler: [
          {
            id: 'salaklar',
            label: '"Salaklar."',
            cevap: '"Fotoğrafını da çektik. Döndüğünde göstereceğiz." Bunu gerçekten yapmışlar.',
            etki: { iliski: 5, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'ozledim',
            label: '"Özledim lan sizi."',
            cevap: 'Bir sessizlik oldu. "Biz de seni." Sonra hemen konuyu değiştirdi.',
            etki: { iliski: 7, moral: 5, ozlem: 6 },
            sonraki: 'b',
          },
          {
            id: 'anlatma',
            label: '"Anlatma bana böyle şeyler."',
            cevap: '"Tamam tamam, anlatmam." İki dakika sonra yine anlatacak.',
            etki: { iliski: 2, moral: -2, ozlem: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Orada ne yapıyorsunuz peki? Boş vaktinizde yani. Oturup bakıyor musunuz duvara?"',
        secenekler: [
          {
            id: 'aynen',
            label: '"Aynen öyle. Bir de sigara içiyoruz."',
            cevap: '"Askerlik bu demek." Çok memnun oldu bu cevaptan.',
            etki: { iliski: 5, moral: 5 },
          },
          {
            id: 'kuyruk',
            label: '"Telefon kuyruğunda bekliyoruz. Şu an da oradayım."',
            cevap: '"Ya kapat o zaman lan, sıradakileri bekletme." Kapatmadı.',
            etki: { iliski: 4, moral: 4 },
          },
          {
            id: 'muhabbet',
            label: '"Koğuşta muhabbet oluyor. Fena da değil aslında."',
            cevap: '"Bak bak, alışmış bile." Hafif bir kıskançlık vardı sesinde.',
            etki: { iliski: 3, moral: 5 },
            isaret: { ad: 'kanka_kiskanc', deger: 'g3' },
          },
        ],
      },
    },
  },
];
