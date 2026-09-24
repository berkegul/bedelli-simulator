import type { Gorusme } from '../tipler';

/**
 * GÜN 20 — SÖZ. Oyunun en uzun mesafeli callback'i burada kapanıyor.
 * 5. günde sevgiline "çıkınca ilk kimi göreceksin" diye sorulmuştu;
 * on beş gün sonra o cevabın hesabı soruluyor. Her cevap farklı bir yol açıyor.
 */
export const GUN_20: Gorusme[] = [
  {
    id: 'g20-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [20],
    oncelik: 150,
    kok: 'giris',
    kapanis: 'Kapattın. Sekiz gün. Söylediklerinin hepsi artık yakında sınanacak.',
    ankesorKapanis: '"Kuyruk var." "Biliyorum, git." Bu sefer sesi kırgın değildi.',
    replikler: {
      giris: {
        id: 'giris',
        metin: '"Bugün eski konuşmalarımızı düşündüm. Bir şey hatırladım."',
        secenekler: [
          {
            id: 'ne',
            label: '"Ne hatırladın?"',
            cevap: '"Sen bana bir şey söylemiştin. Hatırlıyor musun?"',
            sonraki: 'callback',
          },
          {
            id: 'ben_de',
            label: '"Ben de düşünüyordum. İlk günler çok uzak geldi."',
            cevap: '"Uzak ama net." Kısa durdu. "Bir şey söylemiştin bana."',
            sonraki: 'callback',
          },
        ],
      },
      callback: {
        id: 'callback',
        kosul: { isaret: 'ilk_gorecek', isaretYas: 5 },
        atla: 'genel',
        metin:
          '"{yas:ilk_gorecek} gün önce sana çıkınca ilk kimi göreceksin diye sormuştum. Hatırlıyor musun ne dediğini?"',
        secenekler: [
          {
            id: 'seni_dedim',
            label: '"Seni demiştim. Hâlâ aynı."',
            kosul: { isaret: 'ilk_gorecek', isaretDeger: 'sevgili' },
            cevap:
              '"Dedin." Sesi titredi. "Ben o günden beri o cümleyi hatırlıyorum. Kaç kere hatırladım bilmiyorum."',
            etki: { iliski: 14, gerilim: -10, moral: 10 },
            isaret: { ad: 'soz_tutuldu', deger: 'evet' },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'degisti',
            label: '"Aileyi demiştim. Ama değişti."',
            kosul: { isaret: 'ilk_gorecek', isaretDeger: 'aile' },
            cevap:
              '"Değişti mi?" Buna hazırlıklı değildi. "Neden değişti?"',
            etki: { iliski: 9, gerilim: -8, moral: 6 },
            sonraki: 'neden',
          },
          {
            id: 'aile_hala',
            label: '"Aileyi demiştim. Hâlâ öyle düşünüyorum."',
            kosul: { isaret: 'ilk_gorecek', isaretDeger: 'aile' },
            cevap:
              '"Peki." Uzun bir sessizlik. "Doğru olan da o. Ben sadece... neyse."',
            etki: { iliski: 2, gerilim: 10 },
            isaret: { ad: 'soz_tutuldu', deger: 'hayir' },
            sonraki: 'kapanis_soguk',
          },
          {
            id: 'uyku_dedim',
            label: '"Uyuyacağım demiştim. O da değişmedi."',
            kosul: { isaret: 'ilk_gorecek', isaretDeger: 'uyku' },
            cevap:
              '"Uyku." Güldü ama gülüşü kısa sürdü. "Tamam, uyu. Uyandığında ben burada olurum."',
            etki: { iliski: 6, moral: 6 },
            isaret: { ad: 'soz_tutuldu', deger: 'yari' },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'bilmiyordum',
            label: '"Bilmiyorum demiştim. Şimdi biliyorum."',
            kosul: { isaret: 'ilk_gorecek', isaretDeger: 'bilmiyorum' },
            cevap: '"Ne biliyorsun?" Sesi çok yavaştı.',
            etki: { iliski: 8, moral: 5 },
            sonraki: 'neden',
          },
          {
            id: 'hatirlamiyorum',
            label: '"Hatırlamıyorum ne dediğimi."',
            cevap:
              '"\'{deger:ilk_gorecek}\' demiştin." Kelimesi kelimesine söyledi. "Ben hatırlıyorum."',
            etki: { iliski: -3, gerilim: 12 },
            isaret: { ad: 'soz_tutuldu', deger: 'unuttu' },
            sonraki: 'kapanis_soguk',
          },
        ],
      },
      neden: {
        id: 'neden',
        metin: 'Bekliyor. Bu sefer gerçekten bekliyor, boşluğu doldurmuyor.',
        secenekler: [
          {
            id: 'seni',
            label: '"Çünkü ilk seni görmek istiyorum. Yirmi gün bunu düşündüm."',
            cevap:
              'Telefonda bir ses çıktı. "Tamam." Sonra: "Kapıda olacağım."',
            etki: { iliski: 15, gerilim: -14, moral: 11 },
            isaret: { ad: 'soz_tutuldu', deger: 'evet' },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'ikisi',
            label: '"İkisini de istiyorum. Ama sen önce geliyorsun."',
            cevap: '"Sen önce geliyorsun." Tekrarladı. "Bu yeterli."',
            etki: { iliski: 12, gerilim: -10, moral: 9 },
            isaret: { ad: 'soz_tutuldu', deger: 'evet' },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'kararsiz',
            label: '"Hâlâ tam bilmiyorum aslında."',
            cevap: '"Peki." Kabul etti. Kabul etmek her zaman iyi değildir.',
            etki: { iliski: 1, gerilim: 8 },
            isaret: { ad: 'soz_tutuldu', deger: 'belirsiz' },
            sonraki: 'kapanis_soguk',
          },
        ],
      },
      genel: {
        id: 'genel',
        metin:
          '"İlk günlerde konuştuklarımızı hatırlıyorum da, o zaman ikimiz de başka insandık."',
        secenekler: [
          {
            id: 'dogru',
            label: '"Doğru. Yirmi gün insanı değiştiriyor."',
            cevap: '"Değiştiriyor." Onayladı.',
            etki: { iliski: 6, moral: 5 },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'ayni',
            label: '"Ben aynıyım bence. Sadece yorgunum."',
            cevap: '"Öyle diyorsan öyledir." İnanmadı.',
            etki: { iliski: 3, gerilim: 4 },
            sonraki: 'kapanis_soguk',
          },
        ],
      },
      kapanis_iyi: {
        id: 'kapanis_iyi',
        metin: '"Sekiz gün. Sekiz günden sonra bunları yüzüne bakarak konuşacağız."',
        secenekler: [
          {
            id: 'sabirsizim',
            label: '"Sabırsızlanıyorum."',
            cevap: '"Ben de." İkiniz de kapatmak istemediniz.',
            etki: { iliski: 8, moral: 8 },
          },
          {
            id: 'korkuyorum',
            label: '"Biraz korkuyorum aslında. Yüz yüze farklı olacak."',
            cevap:
              '"Farklı olacak." Kabul etti. "Ama kötü olmayacak. Bunu biliyorum."',
            etki: { iliski: 10, moral: 7 },
          },
        ],
      },
      kapanis_soguk: {
        id: 'kapanis_soguk',
        metin: '"Neyse. Sekiz gün kaldı. Konuşuruz."',
        secenekler: [
          {
            id: 'tamam',
            label: '"Tamam."',
            cevap: 'Kapattı. Konuşma bitmemişti ama bitti.',
            etki: { moral: -5, ozlem: 7 },
          },
          {
            id: 'dur',
            label: '"Dur. Böyle kapatma."',
            cevap:
              'Durdu. "Nasıl kapatayım?" Cevabın yoktu. Sonra o: "Yarın ara." Kapattı.',
            etki: { iliski: 4, gerilim: -6, moral: -2 },
          },
        ],
      },
    },
  },

  {
    id: 'g20-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [20],
    kok: 'a',
    kapanis: '"Sekiz gün." Sayıyı her seferinde ayrı bir zevkle söylüyor.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Sekiz gün! Bugün pazartesi, gelecek hafta bu zamanlar sen evdesin."',
        secenekler: [
          {
            id: 'hesap',
            label: '"Hesabı öyle yapınca daha yakın geldi."',
            cevap: '"Değil mi? Ben böyle hesaplıyorum artık." Kendi yöntemini buldu.',
            etki: { iliski: 7, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'evdeyim',
            label: '"Evdeyim. Evde olacağım."',
            cevap: 'Bu cümleyi duyunca sustu. "Evet." Sesi doldu.',
            etki: { iliski: 9, moral: 8, ozlem: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir şey söyleyeceğim, kızma. Sen değiştin. Sesin değişti, konuşman değişti. İyi mi kötü mü bilmiyorum."',
        secenekler: [
          {
            id: 'iyi',
            label: '"İyi bence anne. Ben de fark ediyorum."',
            cevap: '"İyiyse iyi." Kabul etti ama bir şey kaybettiğini de hissediyor.',
            etki: { iliski: 7, moral: 6 },
            isaret: { ad: 'degisim_farkindaligi', deger: 'evet' },
          },
          {
            id: 'ayni',
            label: '"Aynı oğlunum ben anne."',
            cevap: '"Biliyorum." Kısa durdu. "Ama biraz büyümüşsün, o kadar."',
            etki: { iliski: 9, moral: 8 },
          },
        ],
      },
    },
  },

  {
    id: 'g20-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [20],
    kok: 'a',
    kapanis: '"Sekiz." Kapattı, tek kelime yetti.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Sekiz gün. Bu aralar konuşacak bir şey bulamıyorum lan, hepsi bitti."',
        secenekler: [
          {
            id: 'bulma',
            label: '"Bulma o zaman. Konuşmayalım, sadece açık kalsın."',
            cevap: '"Olur mu öyle şey?" Oldu. İki dakika sessiz kaldınız.',
            etki: { iliski: 8, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'ben_anlatirim',
            label: '"Ben anlatırım o zaman."',
            cevap: '"Anlat lan." Dinledi.',
            etki: { iliski: 6, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Bir şeyi merak ediyorum. Orada arkadaş edindin mi gerçekten? Kalıcı yani."',
        secenekler: [
          {
            id: 'edindim',
            label: '"Edindim. Emre var, iyi çocuk."',
            cevap:
              '"Hı." Kısa bir sessizlik. "İyi. İyi ya." Bunu söylerken pek ikna olmuş değildi.',
            etki: { iliski: 4, moral: 5 },
          },
          {
            id: 'gecici',
            label: '"Burada iyiyiz ama dışarıda görüşür müyüz bilmem."',
            cevap: '"Görüşmezsiniz." Bunu fazla hızlı söyledi. "Yani genelde öyle olur."',
            etki: { iliski: 6, moral: 4 },
          },
          {
            id: 'sen',
            label: '"Sen gibisi yok lan. Merak etme."',
            cevap: '"Merak etmiyordum ki." Ediyordu.',
            etki: { iliski: 9, moral: 7 },
            isaret: { ad: 'kanka_guvence', deger: 'verdi' },
          },
        ],
      },
    },
  },
];
