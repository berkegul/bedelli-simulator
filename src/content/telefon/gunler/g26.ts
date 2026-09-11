import type { Gorusme } from '../tipler';

/** GÜN 26 — İKİ GÜN. Dolap boşalıyor, teslim listesi. Duygusal yükseliş başlıyor. */
export const GUN_26: Gorusme[] = [
  {
    id: 'g26-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [26],
    oncelik: 130,
    kok: 'a',
    kapanis: '"İki gün." Bu sefer sayıyı fısıldadı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"İki gün. İki. Bu akşam uyuyabileceğimi sanmıyorum."',
        secenekler: [
          {
            id: 'uyu',
            label: '"Uyu anne. Yolculuk var yarından sonra."',
            cevap: '"Uyurum." Uyumayacak.',
            etki: { iliski: 6, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'ben_de',
            label: '"Ben de uyuyamıyorum. İki gündür."',
            cevap: '"İkimiz de mi?" Bu ona iyi geldi, tuhaf ama iyi geldi.',
            etki: { iliski: 9, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bugün senin odanı bir daha düzenledim. Yirmi altıncı kez. Sayıyorum artık, utanmıyorum."',
        secenekler: [
          {
            id: 'guzel',
            label: '"Yirmi altı gün, yirmi altı kez. Güzel bir simetri."',
            cevap: '"Simetri mi?" Güldü. "Sen askerde matematikçi mi oldun?"',
            etki: { iliski: 9, moral: 8 },
          },
          {
            id: 'ozledim',
            label: '"Özledim o odayı. Ve seni."',
            cevap:
              'Telefon sessizleşti. Sonra, çok alçak: "İki gün." Başka bir şey diyemedi.',
            etki: { iliski: 12, moral: 8, ozlem: 8 },
            isaret: { ad: 'anneye_ozlem', deger: 'g26' },
          },
        ],
      },
    },
  },

  {
    id: 'g26-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [26],
    oncelik: 130,
    kok: 'a',
    kapanis: 'İki gün. Yarın son konuşma olacak ve ikiniz de biliyorsunuz.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"İki gün. Yarın son telefon görüşmemiz olacak, farkında mısın? Yarın akşam, son."',
        secenekler: [
          {
            id: 'farkindayim',
            label: '"Farkındayım. Bütün gün onu düşündüm."',
            cevap: '"Ben de." Bir sessizlik. "Yarın için bir şey hazırlamalı mıyız?"',
            etki: { iliski: 9, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'dusunmedim',
            label: '"Böyle düşünmemiştim. Şimdi tuhaf oldu."',
            cevap: '"Ben iki gündür düşünüyorum." İtiraf etti.',
            etki: { iliski: 7, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bu yirmi altı günde sana her gün söylemediğim bir şey var. Yarın söyleyeceğim. Bugün değil."',
        secenekler: [
          {
            id: 'bekliyorum',
            label: '"Yarın bekliyorum o zaman."',
            cevap: '"Bekle." Sesi çok sakindi, bu onda nadirdir.',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'sevgili_soru', deger: 'yarin' },
          },
          {
            id: 'simdi',
            label: '"Bugün söyle. Yarını beklemeyelim."',
            cevap:
              '"Hayır." Güldü. "Bir gün bekleyebilirsin. Yirmi altı gün bekledin."',
            etki: { iliski: 8, moral: 7 },
            isaret: { ad: 'sevgili_soru', deger: 'yarin' },
          },
        ],
      },
    },
  },

  {
    id: 'g26-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [26],
    kok: 'a',
    kapanis: '"İki gün lan. İki." Bu sefer bağırmadı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"İki gün. Arabayı yıkattım bu arada. Senin baban gibi oldum."',
        secenekler: [
          {
            id: 'baba',
            label: '"O da yıkatmış. Bir hafta önce."',
            cevap: '"YOK ARTIK." Güldü. "Aynı adamız demek."',
            etki: { iliski: 8, moral: 9 },
            sonraki: 'b',
          },
          {
            id: 'abartma',
            label: '"Abartma lan, ben iki günlük yolcuyum."',
            cevap: '"Abartırım." Abartacak.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Yarın son konuşmamız. Sonrasında yüz yüze. Bu tuhaf değil mi lan?"',
        secenekler: [
          {
            id: 'tuhaf',
            label: '"Tuhaf. Yirmi altı gün sesten ibarettin."',
            cevap: '"Sesten ibaret." Bu tarifi sevdi. "Yarın et kemik olacağım."',
            etki: { iliski: 8, moral: 8 },
          },
          {
            id: 'iyi',
            label: '"İyi bir tuhaflık. Bitiyor sonunda."',
            cevap: '"Bitiyor." Bu kelimeyi ikiniz de seviyorsunuz artık.',
            etki: { iliski: 7, moral: 8 },
          },
        ],
      },
    },
  },
];
