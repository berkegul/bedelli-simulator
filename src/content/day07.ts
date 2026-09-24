import type { Day } from '../engine/types';

/**
 * 7. gün — BİR HAFTA. İlk eşik. Pazar düzeni: eğitim yok, çamaşır ve koğuş
 * işi var, serbest zaman uzun. Telefon g07'de annen ilk gece ne dediğini
 * hatırlatıyor; burada da öğle postası 6. günün para konuşmasına göre
 * değişiyor (para_durumu).
 */
export const gun07: Day = {
  day: 7,
  title: 'Bir Hafta',
  epigraph: 'Yedi çentik. Duvarda ilk defa bir desen var.',
  blocks: [
    {
      id: 'd7-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-k1',
          sprite: 'duduk',
          text: 'Pazar. Düdük yine 05:30\'da çaldı; pazar olduğunu kimse düdüğe söylememiş. Emre üst ranzadan "Bir hafta oldu lan" dedi, kimseye değil, tavana.',
        },
        {
          kind: 'mini',
          id: 'd7-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Pazar da olsa yatak aynı yatak.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 14), moral: Math.round(-1 + s * 5) }),
          verdict: (s) =>
            s > 0.85
              ? 'Bir haftada ellerin öğrendi. Düşünmeden, tek seferde.'
              : s > 0.55
                ? 'İdare eder. Pazar sabahı kimse cetvelle gelmiyor.'
                : 'Pazar gevşekliği battaniyeye de geçmiş. Onbaşı baştan yaptırdı.',
        },
      ],
    },
    {
      id: 'd7-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bir hafta bitti. İlk hafta herkes birbirine benzer, ikinci hafta ayrışır. Bugün pazar: çamaşır, koğuş, dolap. Öğlen posta dağıtılacak.',
        },
        {
          kind: 'mini',
          id: 'd7-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Pazar yoklaması. Kısa sürecek ama yine de sürecek.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), enerji: -3 }),
          verdict: (s) =>
            s > 0.85
              ? 'Bir haftalık bölük tek ses çıkarıyor. Çavuş ilk defa "iyi" dedi.'
              : s > 0.5
                ? 'Olur. Pazar sabahı için olur.'
                : 'Uykulu çıktı sesin. Çavuş pazar olduğunu hatırlatmadı, hatırlattırdı.',
        },
      ],
    },
    {
      id: 'd7-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-m1',
          sprite: 'postal',
          text: 'Cumartesi akşamı kantin geç kapanmış; avlu her zamankinden kirli. Yedi günde izmarit toplamanın bir tekniği olduğunu öğrendin: yere değil, çimle betonun birleştiği yere bak.',
        },
      ],
    },
    {
      id: 'd7-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-ka1',
          sprite: 'tepsi',
          text: 'Serkan çayını kaldırdı: "Bir haftaya. Dört tane daha var, matematik yaptım." Emre "Matematikçi misin sen?" dedi ve bütün masa güldü. Yedi gündür ilk defa hep birlikte.',
        },
      ],
    },
    {
      id: 'd7-camasir',
      from: '08:00',
      to: '12:00',
      title: 'Çamaşır',
      sprite: 'camasirTorbasi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-c1',
          sprite: 'camasirTorbasi',
          text: 'Çamaşırhanede iki makine var, koğuşta yirmi sekiz kişi. Sıra kapıdan taşmış. Serkan sıranın başında duruyor, elinde defter.',
          choices: [
            {
              id: 'd7-camasir-el',
              label: 'Lavaboda elde yıka',
              effect: { disiplin: 4, kondisyon: 2, enerji: -10, moral: -2 },
              outcome:
                'Soğuk su, sert sabun, bir saat. Parmak uçların buruştu ama öğlene kadar ipte kuruyordu. Onbaşı geçerken ipe baktı, bir şey demedi.',
            },
            {
              id: 'd7-camasir-serkan',
              label: 'Serkan\'dan makine sırası satın al (25 TL)',
              effect: { para: -25, moral: 4, enerji: 2, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: '"Onuncu sıra senin," dedi Serkan. Sen onuncu sıraya nasıl sahip olduğunu sormadın, o da anlatmadı.',
            },
            {
              id: 'd7-camasir-bekle',
              label: 'Sıraya gir, bekle',
              effect: { moral: -4, enerji: -3, dostluk: { kim: 'tolga', puan: 3 } },
              outcome:
                'Üç saat sırada Tolga\'yla yan yana durdun. Konuşmadınız ama iki kez aynı şakaya güldünüz. Çamaşır öğlene yetişti.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd7-c2',
          sprite: 'dolapSirasi',
          text: 'Dolap düzeni haftalık bakım. İlk gün nereye ne koyduysan hâlâ orada; bir hafta sonra dolabın sana ne kadar dikkatli olduğunu söylüyor.',
        },
      ],
    },
    {
      id: 'd7-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle ve Posta',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-o1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Yemekten sonra posta. Onbaşı elinde bir deste zarfla masaların arasında yürüyor, isim okuyor. Adı okunan kalkıyor; okunmayan tepsisine bakıyor.',
        },
        {
          kind: 'anlati',
          id: 'd7-o-havale',
          sprite: 'cuzdan',
          kosul: { isaret: 'para_durumu', isaretDeger: ['bitti', 'kontor'] },
          text: 'Adın okundu. Zarf değil, havale bildirimi. Annene paranın azaldığını söylemiştin; bildirimin arkasına biri tükenmez kalemle yazmış: "Kontöre değil, yemeğe."',
          choices: [
            {
              id: 'd7-havale-al',
              label: 'Bildirimi imzala',
              effect: { para: 150, moral: 5 },
              outcome: 'Yüz elli lira. El yazısı babanın. Kâğıdı katlayıp cüzdanın iç gözüne koydun, parayı değil.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd7-o-utanc',
          sprite: 'cuzdan',
          kosul: { isaret: 'para_durumu', isaretDeger: 'utandi' },
          text: 'Adın okundu. Havale bildirimi. Annene para istemeye utandığını söylemiştin; istememişsin, yine de gelmiş. Arkasında tek satır: "İdare et. — B."',
          choices: [
            {
              id: 'd7-utanc-al',
              label: 'Bildirimi imzala',
              effect: { para: 150, moral: 7 },
              outcome: 'Utandığın şey buymuş: istemek değil, istemeden gelmesi. Kâğıdı katlayıp sakladın.',
            },
          ],
        },
      ],
    },
    {
      id: 'd7-kogus',
      from: '13:30',
      to: '16:30',
      title: 'Koğuş Günü',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-g1',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Bir hafta oldu, bir şey yapmamız lazım. Kutlama değil tabii, burada kutlama olmaz. Ama bir şey." Kantinden bir paket bisküvi, bir şişe gazoz: koğuşun ilk ortak masası.',
          choices: [
            {
              id: 'd7-masa-katil',
              label: 'Kantinden bir şey al, masaya koy (30 TL)',
              effect: {
                para: -30,
                moral: 8,
                dostluk: { kim: 'emre', puan: 5 },
              },
              outcome:
                'Bir paket kraker, iki gazoz. Emre "İşte bu," dedi. Tolga ilk defa bir şeyin başından sonuna kadar masada oturdu.',
            },
            {
              id: 'd7-masa-otur',
              label: 'Sadece otur, sohbete katıl',
              effect: { moral: 5, dostluk: { kim: 'tolga', puan: 2 } },
              outcome: 'Masaya bir şey koymadın ama sandalyen boş kalmadı. Bir haftada öğrendiğin şey: burada varlık da sayılıyor.',
            },
            {
              id: 'd7-masa-uyu',
              label: 'Pazar öğleden sonrası: ranzada uyu',
              effect: { enerji: 16, moral: -2 },
              outcome: 'İki saat, rüyasız. Uyandığında masa toplanmıştı ve sana bir kraker bırakılmıştı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd7-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yarından itibaren ikinci hafta. Birinci hafta öğrendiğinizi ikinci hafta hatırlamayanı ben hatırlatırım. Dağılın.',
        },
      ],
    },
    {
      id: 'd7-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-ay1',
          sprite: 'tepsi',
          text: 'Pazar akşamı yemekhanede sessizlik var. Herkes telefon sırasını düşünüyor: bir hafta dolmuş, evde biri bunu biliyor ve bekliyor.',
        },
      ],
    },
    {
      id: 'd7-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-s1',
          text: 'Ankesörün önünde kuyruk hiç bu kadar uzun olmamıştı. Pazar akşamı, bir haftanın akşamı. Kuyrukta kimse konuşmuyor, herkes ne söyleyeceğini prova ediyor.',
        },
      ],
    },
    {
      id: 'd7-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd7-sy1',
          sprite: 'ay',
          text: 'Yedi gün bitti, yirmi bir kaldı. Işıklar sönmeden önce duvara baktın: yedi çentik. İlk defa bir desen gibi duruyorlar, rastgele çizgiler gibi değil.',
        },
      ],
    },
  ],
};
