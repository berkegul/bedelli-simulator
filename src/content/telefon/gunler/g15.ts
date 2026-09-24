import type { Gorusme } from '../tipler';

/** GÜN 15 — SAYIM. Artık gün sayılıyor; on üç kaldı ve bu ilk defa az geliyor. */
export const GUN_15: Gorusme[] = [
  {
    id: 'g15-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [15],
    kok: 'a',
    kapanis: '"On üç. Bir daha söyleyeyim: on üç."',
    replikler: {
      a: {
        id: 'a',
        metin: '"On üç gün kaldı. Artık ben de sayıyorum, sen de say."',
        secenekler: [
          {
            id: 'sayiyorum',
            label: '"Sayıyorum anne. Duvara çentik atıyorum."',
            cevap: '"Çentik mi?" Bunu her duyuşunda aynı tepkiyi veriyor.',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'saymiyorum',
            label: '"Saymamaya çalışıyorum. Sayınca uzuyor."',
            cevap: '"Ben sayarım senin yerine." Zaten sayıyor.',
            etki: { iliski: 5, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Koli geldi mi? Bugün de gelmediyse ben postaneyi arayacağım, ciddiyim."',
        secenekler: [
          {
            id: 'yarin',
            label: '"Yarın dağıtıyorlarmış. Arama postaneyi."',
            cevap: '"Ararım ben yine de." Aramadı ama düşündü.',
            etki: { iliski: 4, moral: 3 },
            isaret: { ad: 'koli_yolda', deger: 'evet' },
          },
          {
            id: 'sakin',
            label: '"Anne sakin ol. Gelecek."',
            cevap: '"Sakinim!" Değil.',
            etki: { iliski: 3, moral: 4 },
            isaret: { ad: 'koli_yolda', deger: 'evet' },
          },
        ],
      },
    },
  },

  {
    id: 'g15-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [15],
    kok: 'a',
    kapanis: 'Kapattın. On üç gün, ve artık sayılabilir bir sayı.',
    replikler: {
      a: {
        id: 'a',
        kosul: { isaret: 'ikinci_yari_sozu', isaretDeger: 'anlatmak' },
        atla: 'genel',
        metin:
          '"Dün bir şey anlatacağını söylemiştin. Ben bekliyorum, baskı yapmıyorum ama bekliyorum."',
        secenekler: [
          {
            id: 'anlat',
            label: 'Bugün gerçekten olan bir şeyi anlat — kötü kısmıyla birlikte',
            cevap:
              'Anlattın. Sözünü hiç kesmedi. Bitince: "Teşekkür ederim." Bunu çok ciddi söyledi.',
            etki: { iliski: 14, gerilim: -14, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'zor',
            label: '"Deniyorum ama zor geliyor. Alışkanlık değil bende."',
            cevap: '"Denediğini görüyorum." Bu yeterliydi.',
            etki: { iliski: 8, gerilim: -6 },
            sonraki: 'b',
          },
          {
            id: 'unut',
            label: '"Bugün anlatacak bir şey yok gerçekten."',
            cevap: '"Peki." Kısa. Bir şey daha bekliyordu.',
            etki: { iliski: 1, gerilim: 8 },
            sonraki: 'b',
          },
        ],
      },
      genel: {
        id: 'genel',
        metin: '"On üç gün. Artık sayılabilir bir sayı, değil mi?"',
        secenekler: [
          {
            id: 'evet',
            label: '"İki elimin parmakları yetiyor neredeyse."',
            cevap: '"Yetmiyor ama yaklaşıyor." Matematiği düzeltti, gülüştünüz.',
            etki: { iliski: 6, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'hala_cok',
            label: '"Hâlâ çok geliyor bana."',
            cevap: '"Bana da." İtiraf etti. "Ama söylemek istemiyordum."',
            etki: { iliski: 7, moral: 3, ozlem: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Bir şey planlıyorum çıktığın gün için. Söylemeyeceğim."',
        secenekler: [
          {
            id: 'soyle',
            label: '"Söyle. Ben sürprizleri sevmem."',
            cevap: '"Seversin." Doğru. "Söylemiyorum."',
            etki: { iliski: 6, moral: 6 },
            isaret: { ad: 'sevgili_surpriz', deger: 'var' },
          },
          {
            id: 'bekle',
            label: '"Tamam, bekliyorum. On üç gün beklerim."',
            cevap: '"Beklersin." Memnun oldu.',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'sevgili_surpriz', deger: 'var' },
          },
        ],
      },
    },
  },

  {
    id: 'g15-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [15],
    kok: 'a',
    kapanis: '"On üç. Takvimde çiziyorum." Çiziyor.',
    replikler: {
      a: {
        id: 'a',
        metin: '"On üç gün. Ben takvimde çiziyorum, her akşam bir tane. Ritüel oldu."',
        secenekler: [
          {
            id: 'guzel',
            label: '"Güzel ya. Birinin çizmesi lazımdı."',
            cevap: '"Ben çiziyorum işte." Bundan gurur duyuyor.',
            etki: { iliski: 6, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'takma',
            label: '"Takma kafana o kadar lan."',
            cevap: '"Takmıyorum." Takıyor.',
            etki: { iliski: 3, moral: 3 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Sana bir şey söyleyeyim mi? Sen gittiğinden beri ben daha az çıkıyorum. Sebebini de bilmiyorum."',
        secenekler: [
          {
            id: 'niye',
            label: '"Niye lan? Benim yüzümden mi?"',
            cevap:
              '"Senin yüzünden değil." Düşündü. "Ama sen yokken aynı değil işte."',
            etki: { iliski: 9, moral: 5 },
            isaret: { ad: 'kanka_itiraf', deger: 'g15' },
          },
          {
            id: 'cik',
            label: '"Çık lan. Benim için bekleme."',
            cevap: '"Beklemiyorum." Bekliyor.',
            etki: { iliski: 6, moral: 4 },
          },
        ],
      },
    },
  },
];
