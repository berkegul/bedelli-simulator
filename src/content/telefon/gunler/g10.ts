import type { Gorusme } from '../tipler';

/** GÜN 10 — GECE. İlk gece nöbeti. Gece konuşması teması buradan açılıyor. */
export const GUN_10: Gorusme[] = [
  {
    id: 'g10-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [10],
    kok: 'a',
    kapanis: '"Sabah ara, uyandığında ara." Sabah arayamayacağını biliyorsun.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Nöbet ne zaman? Gece mi? Kaçta?"',
        secenekler: [
          {
            id: 'uc',
            label: '"Üçte. Üçten beşe kadar."',
            cevap: '"Üçte mi?" Sesi yükseldi. "Yalnız mı olacaksın? Karanlıkta?"',
            etki: { iliski: 4, moral: 2 },
            sonraki: 'b',
          },
          {
            id: 'gecistirme',
            label: '"Önemli değil anne, herkes tutuyor."',
            cevap: '"Herkes tutuyor diye ben merak etmeyeyim mi?" Haklı.',
            etki: { iliski: 2, gerilim: 3 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Ben de uyumam o zaman. Üçte kalkarım, seninle beraber uyanık olurum."',
        secenekler: [
          {
            id: 'yapma',
            label: '"Yapma anne. Uyu sen."',
            cevap: '"Yaparım." Yapacak. Tartışmanın anlamı yok.',
            etki: { iliski: 6, moral: 5, ozlem: 6 },
            isaret: { ad: 'anne_nobet', deger: 'uyanik' },
          },
          {
            id: 'peki',
            label: '"Peki. O zaman ikimiz de uyanık oluruz."',
            cevap: '"Tamam." Bu anlaşma ikinizi de rahatlattı, saçma olduğunu bilseniz de.',
            etki: { iliski: 9, moral: 7, ozlem: 5 },
            isaret: { ad: 'anne_nobet', deger: 'anlasma' },
          },
        ],
      },
    },
  },

  {
    id: 'g10-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [10],
    kok: 'a',
    kapanis: 'Kapattın. Birkaç saat sonra nöbete kalkacaksın.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Gece nöbetin var demiştin. Korkuyor musun?"',
        secenekler: [
          {
            id: 'korkmuyorum',
            label: '"Korkmuyorum. Sadece uykusuz kalacağım."',
            cevap: '"Ben senin yerinde olsam korkardım." Dürüst.',
            etki: { iliski: 4, moral: 3 },
            sonraki: 'b',
          },
          {
            id: 'biraz',
            label: '"Biraz. Karanlıkta iki saat, kimse yok."',
            cevap:
              '"O zaman beni düşün." Kısa durdu. "Ciddiyim. Sıkılınca beni düşün, zaman geçer."',
            etki: { iliski: 9, moral: 8 },
            isaret: { ad: 'nobet_gecesi', deger: 'dusunecek' },
            sonraki: 'b',
          },
          {
            id: 'saka',
            label: '"Nöbette uyuyan çok. Ben de deneyeceğim."',
            cevap: '"SAKIN." Gerçekten telaşlandı. "Ceza verirler."',
            etki: { iliski: 5, moral: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ben de bu aralar gece uyuyamıyorum. Saat üç dört oluyor, tavana bakıyorum. Sana söylemedim şimdiye kadar."',
        secenekler: [
          {
            id: 'nedensoylemedin',
            label: '"Neden söylemedin?"',
            cevap: '"Senin yükün var zaten." Bunu söylemesi ona zor geldi.',
            etki: { iliski: 8, moral: 3, ozlem: 6 },
            isaret: { ad: 'sevgili_derin', deger: 'g10' },
          },
          {
            id: 'ben_de',
            label: '"Ben de uyuyamıyorum. Bu gece ikimiz de uyanığız demek."',
            cevap: '"Üçte ben de uyanık olacağım o zaman." Randevu gibi oldu.',
            etki: { iliski: 11, moral: 8 },
            isaret: { ad: 'nobet_gecesi', deger: 'birlikte' },
          },
          {
            id: 'uyu',
            label: '"Uyumaya çalış. Bana yarayacak bir şey değil bu."',
            cevap: '"Tamam." Kapandı. Bir kapı kapandı.',
            etki: { iliski: -2, gerilim: 10 },
          },
        ],
      },
    },
  },

  {
    id: 'g10-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [10],
    kok: 'a',
    kapanis: '"Nöbette sıkılırsan beni düşün." Düşündün.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Gece nöbeti mi? Lan orada ne oluyor gece? Bir şey oluyor mu?"',
        secenekler: [
          {
            id: 'hicbir',
            label: '"Hiçbir şey. İki saat karanlığa bakıyorsun."',
            cevap: '"İki saat mi? Ne düşünüyorsun o iki saatte?"',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'sessiz',
            label: '"Sessizlik. Öyle bir sessizlik ki kulağın çınlıyor."',
            cevap: '"Ürkütücü lan bu." Ürktü gerçekten.',
            etki: { iliski: 6, moral: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Ben de bazen geceleri oturuyorum. İşten sonra, evde. Kimse yok, ben varım."',
        secenekler: [
          {
            id: 'sen_de',
            label: '"Sen de mi? Hiç öyle görünmüyorsun."',
            cevap: '"Görünmem zaten." Konuyu değiştirdi hemen. "Neyse lan."',
            etki: { iliski: 7, moral: 4 },
            isaret: { ad: 'kanka_ciddi', deger: 'g10' },
          },
          {
            id: 'anlat',
            label: '"Ne düşünüyorsun o zamanlarda?"',
            cevap:
              '"Bilmem." Uzun bir sessizlik — onda nadir. "Bir şeyler eksik gibi geliyor. Boş ver."',
            etki: { iliski: 9, moral: 3 },
            isaret: { ad: 'kanka_itiraf', deger: 'g10' },
          },
        ],
      },
    },
  },
];
