import type { Gorusme } from '../tipler';

/**
 * GÜN 27 — SON GECE. Oyunun zirvesi.
 * Üç hattın da son telefon görüşmesi. Baban yirmi yedi gün boyunca
 * kurmadığı cümleyi burada kuruyor — iki kelime, ve hemen arkasından
 * konuyu kapatıyor, çünkü o öyle biri. Sevgili hattı 13. günde açılan
 * eksene göre ikiye ayrılıyor.
 */
export const GUN_27: Gorusme[] = [
  {
    id: 'g27-baba',
    kayit: 'ev',
    rol: 'baba',
    tur: 'omurga',
    gunler: [27],
    oncelik: 160,
    kok: 'a',
    kapanis: 'Telefonu kapattın. Yirmi yedi gün boyunca duymadığın bir şey duydun.',
    ankesorKapanis: '"Kapatmam lazım baba." "Tamam. Yarın görüşürüz." Yarın görüşeceksiniz.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Yarın." Tek kelime söyledi ve bekledi.',
        secenekler: [
          {
            id: 'yarin',
            label: '"Yarın baba."',
            cevap: '"Dokuzda oradayım." Plan tekrar edildi, üçüncü kez.',
            etki: { iliski: 6, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'son_gece',
            label: '"Son gecem. Tuhaf geliyor."',
            cevap:
              '"Tuhaftır." Kısa durdu. "Benim son gecemde bütün koğuş uyumadı. Sabaha kadar konuştuk."',
            etki: { iliski: 9, moral: 7 },
            isaret: { ad: 'baba_anisi', deger: 'son_gece' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Eşyalarını teslim ettin mi? Yarın sabah kalabalık olur, akşamdan hallet."',
        secenekler: [
          {
            id: 'ettim',
            label: '"Ettim. Dolabım boş."',
            cevap: '"İyi." Bir sessizlik. Konuşacak pratik bir şey kalmadı ve bu onu zorluyor.',
            etki: { iliski: 5 },
            sonraki: 'c',
          },
          {
            id: 'yarin_sabah',
            label: '"Yarın sabah edeceğim. Liste uzun."',
            cevap: '"Erken kalk o zaman." Son nasihat.',
            etki: { iliski: 5 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        kim: 'anlatici',
        metin:
          'Telefonda uzun bir sessizlik oldu. Hattın açık olduğunu nefesinden anlıyorsun. Bir şey söyleyecek, söylemeye çalışıyor.',
        sonraki: 'itiraf',
      },
      itiraf: {
        id: 'itiraf',
        kim: 'baba',
        metin: '"Seni özledim."',
        secenekler: [
          {
            id: 'baba',
            label: '"Baba..."',
            cevap:
              '"Neyse." Hemen kapattı konuyu, sesi normale döndü. "Yarın görüşürüz."',
            etki: { iliski: 15, moral: 14, ozlem: 8 },
            isaret: { ad: 'son_gece', deger: 'baba_ozledi' },
          },
          {
            id: 'ben_de',
            label: '"Ben de seni özledim baba."',
            cevap:
              'Bir ses çıkardı, ne olduğu belli değil. "Hı." Sonra: "Yarın görüşürüz." Sesi çatlamıştı.',
            etki: { iliski: 18, moral: 15, ozlem: 7 },
            isaret: { ad: 'son_gece', deger: 'baba_ozledi' },
          },
          {
            id: 'sessiz',
            label: 'Hiçbir şey söyleme',
            cevap:
              'Sessizlik uzadı. Sonra o bozdu: "Hadi. Yarın." Söylediği yerinde durdu, ikiniz de biliyorsunuz.',
            etki: { iliski: 12, moral: 11, ozlem: 9 },
            isaret: { ad: 'son_gece', deger: 'baba_ozledi' },
          },
        ],
      },
    },
  },

  {
    id: 'g27-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [27],
    oncelik: 155,
    kok: 'a',
    kapanis: 'Kapattın. Yarın sabah onu göreceksin.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Son gece. Son gecen {ad}." Bunu söylerken sesi zaten titriyordu.',
        secenekler: [
          {
            id: 'son',
            label: '"Son gece anne."',
            cevap: '"Yarın buradasın." Kendine söylüyor gibiydi.',
            etki: { iliski: 7, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'agla',
            label: '"Ağlama anne. Daha yarın var, orada ağlarsın."',
            cevap: '"Ağlamıyorum!" Ağlıyordu. "Yarın da ağlarım, merak etme."',
            etki: { iliski: 9, moral: 9 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Sana bir şey söyleyeceğim. Yirmi yedi gündür söylemedim."',
        secenekler: [
          {
            id: 'soyle',
            label: '"Söyle anne."',
            cevap: 'Bir nefes aldı.',
            sonraki: 'itiraf',
          },
          {
            id: 'biliyorum',
            label: '"Biliyorum sanırım."',
            cevap: '"Bilmiyorsun." Sonra bir nefes aldı.',
            sonraki: 'itiraf',
          },
        ],
      },
      itiraf: {
        id: 'itiraf',
        metin:
          '"Seni otogarda bırakırken ağladım. Sen otobüse binerken arkanı döndün, el salladın, ben gülümsedim. Sen gidince arabada ağladım. Sana söylemedim çünkü sen zaten zorlanıyordun."',
        secenekler: [
          {
            id: 'biliyordum',
            label: '"Biliyordum anne. Camdan gördüm."',
            cevap:
              'Uzun bir sessizlik. "Gördün mü?" Sesi kırıldı. "Hiç söylemedin."',
            etki: { iliski: 15, moral: 10, ozlem: 10 },
            isaret: { ad: 'son_gece', deger: 'anne_otogar' },
            sonraki: 'kapanis',
          },
          {
            id: 'ben_de',
            label: '"Ben de otobüste ağladım. Kimseye söylemedim."',
            cevap:
              '"Ay oğlum." Başka bir şey diyemedi bir süre. "İkimiz de aynı anda mı ağladık?"',
            etki: { iliski: 17, moral: 9, ozlem: 11 },
            isaret: { ad: 'son_gece', deger: 'anne_otogar' },
            sonraki: 'kapanis',
          },
          {
            id: 'neden',
            label: '"Neden şimdi söyledin?"',
            cevap:
              '"Çünkü bitti." Sesi sakinleşti. "Artık söyleyebilirim. Bitmeden söyleyemezdim."',
            etki: { iliski: 14, moral: 10, ozlem: 8 },
            isaret: { ad: 'son_gece', deger: 'anne_otogar' },
            sonraki: 'kapanis',
          },
        ],
      },
      kapanis: {
        id: 'kapanis',
        metin: '"Yarın. Yarın sabah. Ben kapıda olacağım, baban arabada bekleyecek."',
        secenekler: [
          {
            id: 'gorusuruz',
            label: '"Yarın görüşürüz anne."',
            cevap: '"Görüşürüz." Kapatmadı. Sen de kapatmadın. Sonunda o kapattı.',
            etki: { iliski: 10, moral: 10 },
          },
          {
            id: 'tesekkur',
            label: '"Yirmi yedi gün her akşam oradaydın. Teşekkür ederim."',
            cevap:
              '"Nerede olacaktım?" Bu soruyu gerçekten sordu, cevabı olmadığı için.',
            etki: { iliski: 14, moral: 12 },
            isaret: { ad: 'son_soz', deger: 'anneye_tesekkur' },
          },
        ],
      },
    },
  },

  {
    id: 'g27-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [27],
    oncelik: 155,
    kok: 'a',
    kapanis: 'Son telefon görüşmesi bitti. Yarın ses değil, yüz olacak.',
    ankesorKapanis: '"Kuyruk var, kapatmam lazım." "Biliyorum. Yarın." Yarın.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Son konuşmamız. Yirmi yedinci. Saydım, yirmi yedi akşam."',
        secenekler: [
          {
            id: 'saydin',
            label: '"Hepsini mi saydın?"',
            cevap: '"Hepsini." Duraksadı. "Aramadığın günleri de saydım."',
            etki: { iliski: 8, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'son',
            label: '"Son. Tuhaf bir kelime."',
            cevap: '"Son değil aslında. Sadece bu şeklinin sonu."',
            etki: { iliski: 9, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Dün bir şey söyleyeceğimi söylemiştim. Şimdi söyleyeceğim."',
        secenekler: [
          {
            id: 'dinliyorum',
            label: '"Dinliyorum."',
            cevap: 'Bir nefes aldı.',
            sonraki: 'acik',
          },
        ],
      },
      acik: {
        id: 'acik',
        kosul: {
          isaret: 'sevgili_ekseni',
          isaretDeger: ['acik', 'onarildi'],
          iliskiMin: { sevgili: 60 },
        },
        atla: 'kapali',
        metin:
          '"Seni bekledim ve bir gün bile pişman olmadım. Bunu bilmeni istedim, çünkü yarın seni gördüğümde söyleyemeyeceğim, ağlarım."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de her akşam o telefonu bekledim. Kırk dakika kuyrukta bekledim, değdi."',
            cevap:
              '"Kırk dakika mı?" Sesi çatladı. "Bunu hiç söylemedin bana."',
            etki: { iliski: 16, gerilim: -12, moral: 14 },
            isaret: { ad: 'son_gece', deger: 'sevgili_iyi' },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'tesekkur',
            label: '"Sen bu yirmi yedi günün en iyi kısmıydın."',
            cevap: '"Rakipsiz bir yarış." Güldü, ağlarken güldü.',
            etki: { iliski: 15, moral: 13 },
            isaret: { ad: 'son_gece', deger: 'sevgili_iyi' },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'yarin',
            label: '"Yarın söylerim ben de. Ağlarsak beraber ağlarız."',
            cevap: '"Anlaştık." Sesinde bir rahatlama vardı.',
            etki: { iliski: 13, moral: 12 },
            isaret: { ad: 'son_gece', deger: 'sevgili_iyi' },
            sonraki: 'kapanis_iyi',
          },
        ],
      },
      kapali: {
        id: 'kapali',
        metin:
          '"Yarın seni göreceğim ve ne hissedeceğimi bilmiyorum. Bunu söylemem gerekiyordu, yalan söylemek istemedim."',
        secenekler: [
          {
            id: 'anliyorum',
            label: '"Anlıyorum. Ben de bilmiyorum."',
            cevap:
              '"En azından dürüstüz." Kısa bir sessizlik. "Yarın konuşuruz. Yüz yüze."',
            etki: { iliski: 7, gerilim: -10, moral: 4 },
            isaret: { ad: 'son_gece', deger: 'sevgili_belirsiz' },
            sonraki: 'kapanis_belirsiz',
          },
          {
            id: 'ozur',
            label: '"Yirmi yedi günde seni yeterince yanıma almadım. Farkındayım."',
            cevap:
              'Uzun bir sessizlik. "Bunu duymak istiyordum." Sesi yumuşadı. "Yarın görüşelim."',
            etki: { iliski: 12, gerilim: -20, moral: 8 },
            isaret: { ad: 'son_gece', deger: 'sevgili_onarim' },
            sonraki: 'kapanis_belirsiz',
          },
          {
            id: 'bekle',
            label: '"Yarın her şey düzelir."',
            cevap:
              '"Düzelecek bir şey var mı?" Soru gerçekti. Cevabını ikiniz de bilmiyorsunuz.',
            etki: { iliski: 2, gerilim: 6 },
            isaret: { ad: 'son_gece', deger: 'sevgili_kotu' },
            sonraki: 'kapanis_belirsiz',
          },
        ],
      },
      kapanis_iyi: {
        id: 'kapanis_iyi',
        metin: '"Kapatıyorum. Yarın sabah kapıda olacağım. Çıkınca beni ara, ben koşarım."',
        secenekler: [
          {
            id: 'tamam',
            label: '"Yarın görüşürüz."',
            cevap: 'Kapattı. Sonra hemen tekrar aradı: "Unuttum — iyi geceler."',
            etki: { iliski: 10, moral: 12 },
          },
        ],
      },
      kapanis_belirsiz: {
        id: 'kapanis_belirsiz',
        metin: '"Kapatıyorum. Yarın... yarın görüşürüz."',
        secenekler: [
          {
            id: 'tamam',
            label: '"Yarın görüşürüz."',
            cevap: 'Kapattı. Bu sefer geri aramadı.',
            etki: { moral: -2, ozlem: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g27-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [27],
    oncelik: 155,
    kok: 'a',
    kapanis: '"Yarın lan. YARIN." Kapattı. On saniye sonra tekrar aradı, sadece bağırmak için.',
    replikler: {
      a: {
        id: 'a',
        metin: '"SON GECE LAN! Son gece! Yarın bu saatlerde dışarıdasın!"',
        secenekler: [
          {
            id: 'inanamiyorum',
            label: '"İnanamıyorum. Gerçekten inanamıyorum."',
            cevap: '"İnan!" Bağırdı. "Yirmi yedi gün lan! Yaptın!"',
            etki: { iliski: 8, moral: 11 },
            sonraki: 'b',
          },
          {
            id: 'sakin',
            label: '"Daha bir gece var lan, sakin."',
            cevap: '"SAKİN OLAMIYORUM." Olamıyor gerçekten.',
            etki: { iliski: 6, moral: 10 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        kosul: { isaret: 'kanka_surpriz', isaretDeger: 'saklandi' },
        atla: 'c',
        metin:
          '"Bak sürprizi söyleyeceğim çünkü dayanamıyorum. Yarın kapıda yalnız olmayacağım. Herkes geliyor. Hepsi."',
        secenekler: [
          {
            id: 'herkes',
            label: '"Herkes mi?"',
            cevap:
              'İsim saydı. Dokuz kişi. "Hepsi izin aldı işten. Senin için."',
            etki: { iliski: 14, moral: 15 },
            isaret: { ad: 'kanka_surpriz', deger: 'acildi' },
            sonraki: 'c',
          },
          {
            id: 'yapmayin',
            label: '"Yapmayın lan, mahcup olurum."',
            cevap: '"Ol." Kestirdi attı. "Yirmi sekiz gün hak ettin."',
            etki: { iliski: 12, moral: 13 },
            isaret: { ad: 'kanka_surpriz', deger: 'acildi' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Bir şey söyleyeceğim ve bir daha söylemeyeceğim, yirmi birinci günde de söylemiştim ya hani. Yirmi yedi gün boyunca her gün seni düşündüm."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de lan. Her gün."',
            cevap: '"Tamam." Sesi boğuldu biraz. "Yarın. Kapıda."',
            etki: { iliski: 12, moral: 12 },
            isaret: { ad: 'son_gece', deger: 'kanka_iyi' },
          },
          {
            id: 'sagol',
            label: '"Sen olmasan bu yirmi sekiz gün çok farklı geçerdi."',
            cevap:
              'Uzun bir sessizlik. "Lan ağlatma beni, arabadayım." Arabada değildi.',
            etki: { iliski: 14, moral: 13 },
            isaret: { ad: 'son_gece', deger: 'kanka_iyi' },
          },
          {
            id: 'saka',
            label: '"Lan yine mi duygusallaştın?"',
            cevap: '"Son defa. Söz." Söz verdi, tutmayacak.',
            etki: { iliski: 8, moral: 10 },
            isaret: { ad: 'son_gece', deger: 'kanka_iyi' },
          },
        ],
      },
    },
  },
];
