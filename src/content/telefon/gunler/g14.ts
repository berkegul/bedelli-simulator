import type { Gorusme } from '../tipler';

/**
 * GÜN 14 — YARISI. İkinci eşik.
 * Sevgili hattı tek görüşme ama içinde iki yol var: 13. günde konulan
 * `sevgili_ekseni` işareti hangi repliğin açılacağını belirliyor. Ayrı
 * görüşme yazmak yerine replik koşulu kullanmak, dal hacmini düşürüyor.
 */
export const GUN_14: Gorusme[] = [
  {
    id: 'g14-baba',
    kayit: 'ev',
    rol: 'baba',
    tur: 'omurga',
    gunler: [14],
    oncelik: 130,
    kok: 'a',
    kapanis: '"Yarısı. Hadi." Kapattı. Bu onun kutlaması.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Yarısı bitti." Bunu söylemek için beklemiş, belli.',
        secenekler: [
          {
            id: 'bitti',
            label: '"Bitti baba. On dört gün."',
            cevap:
              '"On dört gün." Tekrarladı. "Buradan sonra hızlı geçer. Sayınca hızlanır."',
            etki: { iliski: 7, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'inanamiyorum',
            label: '"İnanamıyorum ya. Dün başlamış gibiyim."',
            cevap: '"Öyledir." Kısa durdu. "Sonra bir bakarsın bitmiş."',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ben senin yaşındayken bu noktada kaçmayı düşünmüştüm. Kimseye söylemedim bugüne kadar."',
        secenekler: [
          {
            id: 'niye',
            label: '"Niye kaçmadın?"',
            cevap:
              '"Nereye kaçacaktım?" Güldü. "Bir de babam vardı. Ona ne diyecektim."',
            etki: { iliski: 11, moral: 7 },
            isaret: { ad: 'baba_anisi', deger: 'kacma' },
            sonraki: 'c',
          },
          {
            id: 'ben_de',
            label: '"Ben de düşündüm. İlk hafta."',
            cevap:
              '"Herkes düşünür." Bunu rahatlatmak için söylemedi, gerçek olduğu için söyledi.',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'kacma_dusundu', deger: 'evet' },
            sonraki: 'c',
          },
          {
            id: 'sasirdim',
            label: '"Sen mi? Sen hiç öyle görünmüyorsun."',
            cevap: '"Görünmem." Bir sessizlik. "Kimse görünmez."',
            etki: { iliski: 9, moral: 6 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Neyse. Anneni vereyim, seni bekliyor. Ama iyi ki konuştuk."',
        secenekler: [
          {
            id: 'iyi_ki',
            label: '"İyi ki konuştuk baba."',
            cevap: '"Hı." Telefonu verirken annene bir şey söyledi, duymadın.',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'baba_yumusadi', deger: 'g14' },
          },
        ],
      },
    },
  },

  {
    id: 'g14-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [14],
    oncelik: 130,
    kok: 'a',
    kapanis: 'On dört gün. Kapattığında ilk defa "az kaldı" diye düşündün.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Bugün yarısı! Ben sabahtan beri bunu bekliyorum. Pasta yaptım, gülme."',
        secenekler: [
          {
            id: 'pasta',
            label: '"Pasta mı yaptın? Ben yokken mi?"',
            cevap:
              '"Sen gelince bir tane daha yaparım." Bunu söylerken sesi çatladı, toparladı.',
            etki: { iliski: 9, moral: 8, ozlem: 7 },
            sonraki: 'b',
          },
          {
            id: 'gulmedim',
            label: '"Gülmedim. Hiç gülmedim."',
            cevap: '"Güldün, duydum." Güldü o da.',
            etki: { iliski: 7, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Sen gideli on dört gün oldu ve ben bu on dört günde senin odana on dört kere girdim. Sayıyorum çünkü utanıyorum."',
        secenekler: [
          {
            id: 'utanma',
            label: '"Utanma anne."',
            cevap: '"Utanıyorum işte." Sonra: "Ama gireceğim yine."',
            etki: { iliski: 9, moral: 5, ozlem: 8 },
            isaret: { ad: 'anneye_ozlem', deger: 'g14' },
            sonraki: 'c',
          },
          {
            id: 'ben_de',
            label: '"Ben de burada senin sesini hatırlamaya çalışıyorum bazen."',
            cevap: 'Telefon sessizleşti. Sonra: "Ay {ad}." Başka bir şey diyemedi.',
            etki: { iliski: 12, moral: 7, ozlem: 9 },
            isaret: { ad: 'anneye_ozlem', deger: 'g14' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Kalan on dördü de böyle geçireceğiz. Söz mü?"',
        secenekler: [
          {
            id: 'soz',
            label: '"Söz."',
            cevap: '"Tamam o zaman." Anlaşma yapıldı.',
            etki: { iliski: 7, moral: 6 },
          },
          {
            id: 'daha_iyi',
            label: '"Daha iyi geçireceğiz. İlk yarısı en zoruydu."',
            cevap: '"İnşallah." Bunu söylerken gerçekten inanıyordu.',
            etki: { iliski: 8, moral: 7 },
          },
        ],
      },
    },
  },

  {
    id: 'g14-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [14],
    oncelik: 140,
    kok: 'giris',
    kapanis: 'Yarısı bitti. İkiniz de bunu söylemeden hissettiniz.',
    replikler: {
      giris: {
        id: 'giris',
        metin: '"On dört gün. Yarısı."',
        secenekler: [
          {
            id: 'devam',
            label: '"Yarısı. İnanamıyorum."',
            cevap: '"Ben inanıyorum. Günleri tek tek yaşadım çünkü."',
            etki: { iliski: 4 },
            sonraki: 'acik',
          },
          {
            id: 'hizli',
            label: '"Bana hızlı geçti gibi geliyor."',
            cevap: '"Sana geçti." Kısa bir duraklama oldu.',
            etki: { iliski: 2 },
            sonraki: 'acik',
          },
        ],
      },
      acik: {
        id: 'acik',
        kosul: { isaret: 'sevgili_ekseni', isaretDeger: ['acik', 'onarildi'] },
        atla: 'kapali',
        metin:
          '"Dün konuştuklarımızdan sonra bütün gün iyi hissettim. Sana bunu söylemek istedim."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de. Dün bir şey düzeldi sanki."',
            cevap: '"Düzeldi." Onayladı. "Kırık değildi ama düzeldi."',
            etki: { iliski: 10, gerilim: -8, moral: 8 },
            sonraki: 'ortak',
          },
          {
            id: 'devam',
            label: '"Böyle devam edelim. Kalan on dört gün böyle geçsin."',
            cevap: '"Geçsin." Bunu bir dilek gibi söyledi.',
            etki: { iliski: 11, moral: 8 },
            isaret: { ad: 'sevgili_ekseni', deger: 'acik' },
            sonraki: 'ortak',
          },
        ],
      },
      kapali: {
        id: 'kapali',
        metin:
          '"Dün konuştuğumuzdan beri düşünüyorum. Kızgın değilim, onu bil. Sadece yorgunum ve on dört gün daha var."',
        secenekler: [
          {
            id: 'ozur',
            label: '"Özür dilerim. Daha iyi olacağım."',
            cevap:
              '"Söz verme." Yumuşak söyledi. "Sadece yap. Söz vermeyi ikimiz de biliyoruz."',
            etki: { iliski: 6, gerilim: -10 },
            isaret: { ad: 'sevgili_ekseni', deger: 'onarildi' },
            sonraki: 'ortak',
          },
          {
            id: 'ben_de_yorgunum',
            label: '"Ben de yorgunum. İkimiz de yorgunuz."',
            cevap:
              '"Biliyorum." Bir sessizlik. "Bunu söylemen bile iyi geldi, tuhaf."',
            etki: { iliski: 8, gerilim: -12, moral: 4 },
            isaret: { ad: 'sevgili_ekseni', deger: 'onarildi' },
            sonraki: 'ortak',
          },
          {
            id: 'dayan',
            label: '"On dört gün daha dayan. Sonra her şey normale döner."',
            cevap:
              '"Normale." Bu kelimeyi tekrarladı, hoşuna gitmedi. "Umarım."',
            etki: { iliski: 1, gerilim: 4 },
            isaret: { ad: 'sevgili_ekseni', deger: 'kapali' },
            sonraki: 'ortak',
          },
        ],
      },
      ortak: {
        id: 'ortak',
        metin: '"Bir şey soracağım. Kalan on dört günde ne değişmesini istersin?"',
        secenekler: [
          {
            id: 'daha_cok',
            label: '"Daha çok konuşmak isterim. Her gün."',
            cevap: '"Ben de." Basit bir cevap ama ikinizi de rahatlattı.',
            etki: { iliski: 9, gerilim: -6, moral: 6 },
            isaret: { ad: 'ikinci_yari_sozu', deger: 'daha_cok' },
          },
          {
            id: 'anlatmak',
            label: '"Sana daha çok şey anlatmak isterim. Deneyeceğim."',
            cevap:
              '"Denemen yeter." Bunu söylerken sesi değişti, tam olarak bunu bekliyordu.',
            etki: { iliski: 12, gerilim: -12, moral: 7 },
            isaret: { ad: 'ikinci_yari_sozu', deger: 'anlatmak' },
          },
          {
            id: 'hicbir',
            label: '"Hiçbir şey. Böyle iyi."',
            cevap: '"Böyle iyi mi?" Emin değil ama üstelemedi.',
            etki: { iliski: 3, gerilim: 3 },
            isaret: { ad: 'ikinci_yari_sozu', deger: 'yok' },
          },
        ],
      },
    },
  },

  {
    id: 'g14-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [14],
    oncelik: 130,
    kok: 'a',
    kapanis: '"YARILADIN LAN!" Bunu üç kere daha bağırdı, sonra kapattı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"YARILADIN LAN! Yarıladın! Ben kadeh kaldırdım, tek başıma, kafayı yedim."',
        secenekler: [
          {
            id: 'tek',
            label: '"Tek başına mı kaldırdın?"',
            cevap:
              '"Tek başıma." Bir sessizlik. "Herkesi çağırdım, kimse gelmedi. Boş ver."',
            etki: { iliski: 7, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'sagol',
            label: '"Sağ ol lan. Cidden."',
            cevap: '"Ne demek. Yarını da kutlarız." Yarını da kutlayacak.',
            etki: { iliski: 8, moral: 8 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bak şimdi ciddi konuşacağım. On dört gün sonra sen buradasın. Ben ne yapacağımı biliyorum. Sen biliyor musun?"',
        secenekler: [
          {
            id: 'biliyorum',
            label: '"Biliyorum. Düşünüyorum sürekli."',
            cevap: '"İyi. Düşün. Düşünmek zamanı geçiriyor." Bunu tecrübeyle söyledi.',
            etki: { iliski: 7, moral: 6 },
            isaret: { ad: 'yari_tepkisi', deger: 'planli' },
          },
          {
            id: 'bilmiyorum',
            label: '"Bilmiyorum lan. Düşünmemeye çalışıyorum."',
            cevap:
              '"Niye?" Anlamadı. "Düşün. Bu işin tek güzel tarafı o zaten."',
            etki: { iliski: 5, moral: 3 },
            isaret: { ad: 'yari_tepkisi', deger: 'kacinan' },
          },
          {
            id: 'korkuyorum',
            label: '"Çıkınca her şey aynı olacak mı, onu düşünüyorum."',
            cevap:
              'Uzun bir sessizlik. "Olmayacak." Dürüst konuştu. "Ama kötü olmayacak. Farklı olacak."',
            etki: { iliski: 10, moral: 5 },
            isaret: { ad: 'yari_tepkisi', deger: 'endise' },
          },
        ],
      },
    },
  },
];
