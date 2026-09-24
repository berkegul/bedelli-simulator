import type { Gorusme } from '../tipler';

/**
 * GÜN 7 — BİR HAFTA. İlk eşik.
 * Oyunun ilk gerçek callback'i burada: 1. gün ne dediysen annen onu
 * hatırlıyor ve yüzüne vuruyor — kötü anlamda değil, kanıt olarak.
 */
export const GUN_07: Gorusme[] = [
  {
    id: 'g07-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [7],
    oncelik: 130,
    kok: 'a',
    kapanis: 'Telefonu kapattığında avlu boşalmıştı. Bir süre orada durdun.',
    ankesorKapanis: '"Kapatmam lazım anne." "Tamam tamam, git." Sesi titriyordu, saklamaya çalıştı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Bir hafta oldu. Bir hafta {ad}." Sesi normal değil.',
        secenekler: [
          {
            id: 'agliyor',
            label: '"Anne ağlıyor musun sen?"',
            cevap:
              '"Ağlamıyorum." Ağlıyor. "Sadece... bir hafta oldu işte." Burnunu çekti.',
            etki: { iliski: 6, moral: -2, ozlem: 8 },
            sonraki: 'b',
          },
          {
            id: 'gecti',
            label: '"Bir hafta geçti. Dört tane daha var, o kadar."',
            cevap: '"Dört tane daha..." Hesabı kendi yaptı, rakam onu rahatlattı.',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'hizli',
            label: '"Hızlı geçti aslında. Ben daha uzun sanıyordum."',
            cevap: '"Hızlı mı geçti?" Buna inanmak istedi. "İyi o zaman. İyi."',
            etki: { iliski: 6, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        kim: 'anne',
        metin:
          '"İlk gün aradığında ne demiştin, hatırlıyor musun? Tam {yas:ilk_gece} gün önce. Ben hatırlıyorum, kelimesi kelimesine hatırlıyorum."',
        kosul: { isaret: 'ilk_gece', isaretYas: 5 },
        atla: 'c',
        secenekler: [
          {
            id: 'hatirliyorum',
            label: '"Hatırlıyorum."',
            kosul: { isaret: 'ilk_gece', isaretDeger: 'dayanamam' },
            cevap:
              '"\'Duramam\' demiştin. Duruyorsun ama. Bir hafta durdun." Bunu söylerken sesi kırıldı ama gururluydu.',
            etki: { iliski: 9, moral: 10 },
            sonraki: 'c',
          },
          {
            id: 'garipti',
            label: '"Garip demiştim. Hâlâ garip bu arada."',
            kosul: { isaret: 'ilk_gece', isaretDeger: ['garip', 'iyi'] },
            cevap:
              '"Garip demiştin, evet. Şimdi sesin garip gelmiyor ama. Alışmışsın sen." Fark etti.',
            etki: { iliski: 7, moral: 8 },
            sonraki: 'c',
          },
          {
            id: 'hatirlamiyorum',
            label: '"Hatırlamıyorum ya. Çok uzak geldi."',
            cevap:
              '"Uzak mı geldi?" Güldü. "İyi işte. Uzak gelmesi iyi." Bunu bir zafer saydı.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Baban her akşam telefonun yanında oturuyor. Konuşmuyor, sadece oturuyor. Sen arayınca ben açıyorum, o da dinliyor."',
        secenekler: [
          {
            id: 'ver',
            label: '"Ver ona telefonu."',
            cevap: 'Telefon el değiştirdi. Uzun bir hışırtı, sonra: "Bir hafta olmuş."',
            etki: { iliski: 4, digerIliski: { kim: 'baba', puan: 8 } },
            rolDegis: 'baba',
            sonraki: 'baba1',
          },
          {
            id: 'selam',
            label: '"Selam söyle. Yeter."',
            cevap: '"Söylerim." Söylemeyeceğini ikiniz de biliyorsunuz.',
            etki: { iliski: 2, digerIliski: { kim: 'baba', puan: -2 } },
            sonraki: 'd',
          },
        ],
      },
      baba1: {
        id: 'baba1',
        kim: 'baba',
        metin: '"Bir hafta olmuş." Başka bir şey söylemedi, söylemesi gerektiğini biliyor ama bulamıyor.',
        secenekler: [
          {
            id: 'evet',
            label: '"Olmuş baba."',
            cevap: '"Hı." Bir sessizlik. "Üç hafta kaldı. Az." Hesap yapmış demek ki.',
            etki: { iliski: 7, moral: 6 },
            sonraki: 'd',
          },
          {
            id: 'sen',
            label: '"Sen her akşam telefonun yanında mı oturuyormuşsun?"',
            cevap:
              'Uzun bir sessizlik oldu. "Annen çok konuşuyor." Bu, evet demenin onca yolundan biri.',
            etki: { iliski: 10, moral: 9 },
            isaret: { ad: 'baba_yumusadi', deger: 'g7' },
            sonraki: 'd',
          },
        ],
      },
      d: {
        id: 'd',
        kim: 'anne',
        metin: '"Hadi kapat, kontörün gidiyor. Bir hafta daha, sonra bir hafta daha."',
        secenekler: [
          {
            id: 'tamam',
            label: '"Tamam anne. İyi geceler."',
            cevap: '"İyi geceler oğlum." Kapatmadı. Sen kapattın.',
            etki: { iliski: 4, moral: 3 },
          },
          {
            id: 'ozledim',
            label: '"Seni özledim anne."',
            cevap:
              'Telefonda bir ses çıktı, ne olduğu belli değil. "Ben de." Sonra hemen kapattı.',
            etki: { iliski: 10, moral: 8, ozlem: 6 },
            isaret: { ad: 'anneye_ozlem', deger: 'g7' },
          },
        ],
      },
    },
  },

  {
    id: 'g07-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [7],
    oncelik: 130,
    kok: 'a',
    kapanis: 'Uzun bir konuşmaydı. Kontörün yarısı gitti, umursamadın.',
    ankesorKapanis:
      '"Kuyruk uzadı, kapatmam lazım." "Biliyorum." Sesinden anladın: bunu beklemiyordu.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Bir hafta. Söz vermiştik ya bugün uzun konuşacağız diye. Ben hazırlandım, sen hazır mısın?"',
        secenekler: [
          {
            id: 'hazirim',
            label: '"Hazırım. Bütün kontörü buna ayırdım."',
            cevap: '"Bütün kontörü mü?" Sessizlik. "Tamam. O zaman başlıyorum."',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'hafta_sozu', deger: 'tuttu' },
            sonraki: 'b',
          },
          {
            id: 'yorgunum',
            label: '"Hazırım ama çok yorgunum. Sesim çıkmıyor bugün."',
            cevap: '"O zaman ben konuşurum, sen dinle." Çözümü hep bulur.',
            etki: { iliski: 6, moral: 6, enerji: 3 },
            sonraki: 'b',
          },
          {
            id: 'unuttum',
            label: '"Ne sözü?"',
            cevap: 'Bir sessizlik oldu. "Boş ver." Sesi düzmüştü ama düzelmedi.',
            etki: { iliski: -4, gerilim: 14 },
            isaret: { ad: 'hafta_sozu', deger: 'unuttu' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir hafta içinde değiştin mi? Ben değiştiğini düşünüyorum. Kötü anlamda demiyorum. Sesin farklı."',
        secenekler: [
          {
            id: 'degistim',
            label: '"Değiştim galiba. Fark ediyorum ben de."',
            cevap: '"Nasıl?" Merakla sordu, korkuyla değil.',
            etki: { iliski: 7, moral: 4 },
            sonraki: 'c',
          },
          {
            id: 'ayniyim',
            label: '"Aynıyım. Sadece yorgunum."',
            cevap: '"Peki." Kabul etti ama ikna olmadı.',
            etki: { iliski: 3, gerilim: 4 },
            sonraki: 'c',
          },
          {
            id: 'korkuyorum',
            label: '"Değişmekten korkuyorum biraz."',
            cevap:
              'Uzun bir sessizlik. "Ben seni her hâlinle tanırım." Bunu düşünmeden söyledi, o yüzden gerçek.',
            etki: { iliski: 12, moral: 9 },
            isaret: { ad: 'sevgili_derin', deger: 'g7' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Bir şey daha. Her akşam aynı saatte telefonumun yanında oluyorum. Bunu bilmeni istedim, baskı olsun diye değil."',
        secenekler: [
          {
            id: 'bilirim',
            label: '"Biliyorum. Ben de o saati bekliyorum bütün gün."',
            cevap: '"Peki o zaman." Rahatladı. "Randevumuz var demek ki."',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'randevu_sozu', deger: 'kabul' },
          },
          {
            id: 'bazen',
            label: '"Bazen arayamıyorum. Nöbet var, sıra var. Kızma."',
            cevap:
              '"Kızmam." Kısa durdu. "Ama beklerim. Beklemekten kızmak farklı şeyler."',
            etki: { iliski: 5, moral: 3 },
            isaret: { ad: 'randevu_sozu', deger: 'sartli' },
          },
          {
            id: 'baski',
            label: '"Biraz baskı gibi geldi aslında."',
            cevap: 'Sessizlik. "Öyle demek istemedim." Sesi çekildi.',
            etki: { iliski: -5, gerilim: 16 },
            isaret: { ad: 'randevu_sozu', deger: 'reddetti' },
          },
        ],
      },
    },
  },

  {
    id: 'g07-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [7],
    oncelik: 130,
    kok: 'a',
    kapanis: '"Bir hafta lan. Bir hafta." Kapattı, sonra mesaj attı: "Gurur duydum."',
    replikler: {
      a: {
        id: 'a',
        metin: '"BİR HAFTA OLDU LAN! Farkında mısın? Dörtte biri bitti. Matematik yaptım."',
        secenekler: [
          {
            id: 'dortte',
            label: '"Dörtte biri değil lan, dörtte birinden az."',
            cevap: '"Ya işte o civarda. Matematikçi misin sen?" Bozuldu ama sevindi.',
            etki: { iliski: 5, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'uzun',
            label: '"Bir hafta bana bir ay gibi geldi."',
            cevap: '"Öyle mi?" Sesi ciddileşti. "O kadar zor mu?"',
            etki: { iliski: 6, moral: 2, ozlem: 5 },
            sonraki: 'b',
          },
          {
            id: 'hizli',
            label: '"Hızlı geçti ya. Ben daha yavaş bekliyordum."',
            cevap: '"HA ŞÖYLE. Devamı da böyle geçer."',
            etki: { iliski: 5, moral: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bak sana bir şey söyleyeceğim, sonra da bir daha söylemeyeceğim. Dayandığın için helal olsun. Ben yapamazdım."',
        secenekler: [
          {
            id: 'yapardin',
            label: '"Yapardın. Herkes yapıyor."',
            cevap: '"Yapamazdım." Israr etti. "Sen daha sağlamsın."',
            etki: { iliski: 7, moral: 8 },
          },
          {
            id: 'sagol',
            label: '"Sağ ol lan. Beklemiyordum bunu."',
            cevap: '"Bekleme zaten. Bir daha yok." Güldü ama söylediği yerinde durdu.',
            etki: { iliski: 8, moral: 9 },
            isaret: { ad: 'kanka_ciddi', deger: 'g7' },
          },
          {
            id: 'utandim',
            label: '"Lan duygusallaşma, ben buradayım daha."',
            cevap: '"Tamam tamam, geri aldım." Almadı.',
            etki: { iliski: 5, moral: 6 },
          },
        ],
      },
    },
  },
];
