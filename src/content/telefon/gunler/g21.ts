import type { Gorusme } from '../tipler';

/**
 * GÜN 21 — YEDİ GÜN. Kankanın yirmi bir gündür sakladığı şeyi söylediği gün.
 * Kadronun en çok şaka yapan karakteri yılda bir kez ciddileşiyor; o an
 * bu. Öncesinde ve sonrasında bir daha bu tonda konuşmuyor.
 */
export const GUN_21: Gorusme[] = [
  {
    id: 'g21-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [21],
    oncelik: 150,
    kok: 'a',
    kapanis: '"Neyse lan. Yedi gün." Şakaya döndü ama söylediği yerinde kaldı.',
    ankesorKapanis: '"Kapatmam lazım." "Tamam, tamam. Kapat." Bu sefer üstelemedi.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Yedi gün. Bir hafta. Sen bir haftada çıkıyorsun lan."',
        secenekler: [
          {
            id: 'bir_hafta',
            label: '"Bir hafta. Söylemesi bile tuhaf."',
            cevap: '"Tuhaf değil, güzel." Sonra sustu. Bu sessizlik onda alışıldık değil.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'sayiyorum',
            label: '"Yedi. Saat saat sayıyorum artık."',
            cevap: '"Ben de." Yine sustu.',
            etki: { iliski: 6, moral: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          'Uzun bir sessizlik oldu. "Bir şey diyeceğim ama gülme." Sesi değişti, hiç böyle konuşmamıştı.',
        secenekler: [
          {
            id: 'de',
            label: '"De lan."',
            cevap: '"Sen yokken garip oldu."',
            etki: { iliski: 5 },
            sonraki: 'itiraf',
          },
          {
            id: 'gulmem',
            label: '"Gülmem. Söyle."',
            cevap: '"Sen yokken garip oldu."',
            etki: { iliski: 6 },
            sonraki: 'itiraf',
          },
        ],
      },
      itiraf: {
        id: 'itiraf',
        metin:
          '"Herkes var, hepsi yerinde. Ama bir şey eksik ve o sensin. Yirmi bir gündür bunu söylemek istiyordum, saçma geldi hep."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de sizi öyle özlüyorum. Saçma değil."',
            cevap:
              '"Tamam." Sesi çabuk toparlandı. "Bir daha söylemeyeceğim bunu, haberin olsun."',
            etki: { iliski: 14, moral: 10, ozlem: 8 },
            isaret: { ad: 'kanka_itiraf', deger: 'g21' },
            sonraki: 'kapanis',
          },
          {
            id: 'sagol',
            label: '"Sağ ol lan. Bunu duymaya ihtiyacım vardı."',
            cevap: '"İhtiyacın mı vardı?" Bu ona iyi geldi. "Tamam o zaman, iyi ki söyledim."',
            etki: { iliski: 12, moral: 11 },
            isaret: { ad: 'kanka_itiraf', deger: 'g21' },
            sonraki: 'kapanis',
          },
          {
            id: 'saka',
            label: '"Lan sen ciddi ciddi duygulandın mı?"',
            cevap:
              '"Kapatıyorum." Kapatmadı ama konu kapandı. Bir kapı açılmıştı, kapandı.',
            etki: { iliski: 3, moral: 4 },
            isaret: { ad: 'kanka_itiraf', deger: 'gecistirildi' },
            sonraki: 'kapanis',
          },
        ],
      },
      kapanis: {
        id: 'kapanis',
        metin: '"Yedi gün sonra buradasın. Yedi gün sonra bunların hiçbiri konuşulmayacak."',
        secenekler: [
          {
            id: 'konusuruz',
            label: '"Konuşuruz. Ben hatırlayacağım bunu."',
            cevap: '"Hatırlama." Güldü. "Tamam, hatırla."',
            etki: { iliski: 8, moral: 7 },
          },
          {
            id: 'unuturuz',
            label: '"Unuturuz gider."',
            cevap: '"Unutmayız." Kesin konuştu.',
            etki: { iliski: 6, moral: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g21-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [21],
    kok: 'a',
    kapanis: '"Yedi gün. Bir hafta." Bunu bir dua gibi söyledi.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Bir hafta kaldı. Bir hafta önce ne yapıyordun, hatırlıyor musun?"',
        secenekler: [
          {
            id: 'ayni',
            label: '"Aynı şeyi. Buradan aradım seni."',
            cevap: '"Aynı." Kısa durdu. "Ama sesin bambaşkaydı."',
            etki: { iliski: 6, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'hatirlamiyorum',
            label: '"Hatırlamıyorum. Günler birbirine benziyor."',
            cevap: '"Benzesin. Bitiyor artık." Rahat.',
            etki: { iliski: 5, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Baban bugün arabayı yıkattı. Sebep söylemedi ama ben biliyorum."',
        secenekler: [
          {
            id: 'niye',
            label: '"Niye yıkattı?"',
            cevap:
              '"Seni almaya gelecek ya." Güldü. "Bir hafta önceden yıkattı, inanabiliyor musun?"',
            etki: { iliski: 9, moral: 10, digerIliski: { kim: 'baba', puan: 8 } },
            isaret: { ad: 'baba_hazirlik', deger: 'araba' },
          },
          {
            id: 'anladim',
            label: '"Anladım. Söyleme ona bana söylediğini."',
            cevap: '"Söylemem." Bu ikinizin sırrı oldu.',
            etki: { iliski: 10, moral: 9, digerIliski: { kim: 'baba', puan: 6 } },
            isaret: { ad: 'baba_hazirlik', deger: 'araba' },
          },
        ],
      },
    },
  },

  {
    id: 'g21-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [21],
    kok: 'a',
    kapanis: 'Yedi gün. Konuşmalar artık planlama toplantısına benziyor ve bu hoşunuza gidiyor.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Yedi gün. Ne giyeceğimi düşünmeye başladım, bu ne kadar saçma?"',
        secenekler: [
          {
            id: 'degil',
            label: '"Saçma değil. Ben de ne diyeceğimi düşünüyorum."',
            cevap: '"Ne diyeceksin?" Hemen atladı.',
            etki: { iliski: 9, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'farketmez',
            label: '"Ne giyersen giy, ben seni göreceğim sadece."',
            cevap: '"Off." Bir süre konuşamadı. "Böyle şeyler söyleme telefonda."',
            etki: { iliski: 12, moral: 9 },
            sonraki: 'b',
          },
          {
            id: 'saka',
            label: '"Üniforma giy, ben alışkınım artık."',
            cevap: '"Salak." Güldü. İyi bir gülüştü.',
            etki: { iliski: 7, moral: 9 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir şey söyleyeceğim. Bu yirmi bir gün bittiğinde ben sana bir şey soracağım. Şimdi sormuyorum."',
        secenekler: [
          {
            id: 'sor',
            label: '"Şimdi sor."',
            cevap: '"Sormam." Kesin. "Yüzüne bakarak soracağım."',
            etki: { iliski: 8, moral: 7 },
            isaret: { ad: 'sevgili_soru', deger: 'bekliyor' },
          },
          {
            id: 'bekleyecegim',
            label: '"Tamam. Yedi gün beklerim."',
            cevap: '"Beklersin." Memnun oldu.',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'sevgili_soru', deger: 'bekliyor' },
          },
          {
            id: 'korkuttun',
            label: '"Kötü bir şey mi?"',
            cevap: '"Hayır." Hızlı cevapladı. "Kötü değil. Merak etme."',
            etki: { iliski: 6, moral: 4 },
            isaret: { ad: 'sevgili_soru', deger: 'bekliyor' },
          },
        ],
      },
    },
  },
];
