import type { Day } from '../engine/types';

/**
 * 22. gün — SESSİZLİK. Telefonda kanka bugün açmıyor. Kışlada da sessiz bir
 * gün: yağmur, içeride ders, gece nöbet (görev takvimi). Tolga on dört
 * gündür cebinde taşıdığı zarfı, 19. günde "sonra" dediği şeyi anlatıyor.
 */
export const gun22: Day = {
  day: 22,
  title: 'Sessizlik',
  epigraph: 'Bazı günler kimse bir şey söylemez ve o gün de sayılır.',
  blocks: [
    {
      id: 'd22-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-k1',
          sprite: 'duduk',
          text: 'Yirmi ikinci sabah. Pencereye yağmur vuruyor. Tebeşirde "6", altındaki küçük takvimde bir kutu karalanmış.',
        },
        {
          kind: 'mini',
          id: 'd22-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Yağmurlu sabahın yatağı. Kimse konuşmuyor, herkes topluyor.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Sessiz bir sabah, sessiz bir yatak. İkisi de düzgün.'
              : s > 0.55
                ? 'Olur. Yağmurun sesi dikkatini dağıttı.'
                : 'Köşe kalkık. Yağmur da yatak da seni beklemedi.',
        },
      ],
    },
    {
      id: 'd22-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yağmurda içtima olur. Yağmurda yürüyüş olmaz, bugün sınıftasınız. Bu gece nöbet listesi yine sizden. Yağmur gece de yağacak.',
        },
        {
          kind: 'mini',
          id: 'd22-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yağmur altında yoklama. Kasketlerden su damlıyor, cevaplar kısa.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -5, moral: -1 }),
          verdict: (s) =>
            s > 0.85
              ? 'Islak ama tek seferde.'
              : s > 0.5
                ? 'Yağmur sesi adını bir an bastırdı. Yetiştin.'
                : 'Duymadın. Çavuş adını ikinci kez okurken yağmur da sustu, bütün sıra seni duydu.',
        },
      ],
    },
    {
      id: 'd22-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-m1',
          sprite: 'postal',
          text: 'Islak izmarit süpürgeye yapışıyor. Avlu çamur, köşen çamur. Kedi bugün saçağın altından çıkmadı.',
        },
      ],
    },
    {
      id: 'd22-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-ka1',
          sprite: 'askerEmre',
          text: 'Emre bu sabah konuşmuyor. Dün akşam telefonda uzun kaldı; kuyruk ona söylendi, o duymadı. Çayını karıştırıyor, şeker koymadan.',
          choices: [
            {
              id: 'd22-emre-sor',
              label: '"Bir şey mi oldu?"',
              effect: { moral: 1, dostluk: { kim: 'emre', puan: 4 } },
              outcome: '"Şantiyede bir adam düştü," dedi. "İyiymiş. Ama ben burada tören adımı atıyorum, o orada düşüyor." Kaşığı bıraktı. "Altı gün."',
            },
            {
              id: 'd22-emre-birak',
              label: 'Bir şey sorma, ekmeğini uzat',
              effect: { dostluk: { kim: 'emre', puan: 2 } },
              outcome: 'Ekmeği aldı, teşekkür etmedi. Masadan kalkarken omzuna iki kere vurdu; Emre\'nin dilinde bu uzun bir cümle.',
            },
          ],
        },
      ],
    },
    {
      id: 'd22-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Sınıf Dersi',
      sprite: 'defter',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-e1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Bugün terhis. Evraklar dört kalem: sevk kâğıdı, sağlık, teslim listesi, terhis belgesi. Teslim listesinde ne varsa dolapta olacak. Dolapta olmayan şeyin parası kesilir.',
        },
        {
          kind: 'anlati',
          id: 'd22-e2',
          text: 'Onbaşı teslim listesini tahtaya yazıyor. Her kalemde birinin yüzü değişiyor: biri mataranın kapağını kaybetmiş, biri ikinci çorabı.',
          choices: [
            {
              id: 'd22-liste-yaz',
              label: 'Listeyi deftere eksiksiz yaz',
              effect: { disiplin: 5, enerji: -2 },
              outcome: 'On yedi kalem. Dolabı akşam kontrol edeceksin. Şimdiden iki kalemden emin değilsin.',
            },
            {
              id: 'd22-liste-pencere',
              label: 'Pencereden yağmuru izle',
              effect: { moral: 3, disiplin: -3 },
              outcome: 'Yağmur avluyu dolduruyor. Tahtada liste uzuyor. İkisi de bitince senin defterin boştu.',
            },
          ],
        },
      ],
    },
    {
      id: 'd22-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-o1',
          sprite: 'yemekhaneMasa',
          text: 'Yemekhanenin camları buğulu. Biri buğuya bir takvim çizmiş; altı kutu. Yemek bitmeden kutular akıp birbirine karıştı.',
        },
      ],
    },
    {
      id: 'd22-talim',
      from: '13:30',
      to: '16:30',
      title: 'Silah Bakımı',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Silahlar teslim edilecek. Teslim edilen silah aldığınızdan temiz olacak. Yağmurlu gün silah günü.',
        },
        {
          kind: 'mini',
          id: 'd22-t2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Son söküp takma, bu sefer temizlik için. Her parça bezden geçecek.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 11), moral: Math.round(-1 + s * 3), enerji: -6 }),
          verdict: (s) =>
            s > 0.85
              ? 'Parça parça, sıra sıra. Yirmi gün önce parçaların adını bilmiyordun.'
              : s > 0.5
                ? 'Bir parçayı yanlış yere koydun, fark ettin, düzelttin.'
                : 'Yay masadan fırladı. Onbaşı yayı buldu, sana uzattı, bir şey demedi.',
        },
      ],
    },
    {
      id: 'd22-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Nöbet listesi. 02:00–04:00: adın. Yağmurluk nöbet yerinde asılı. Islanırsanız kuruyacaksınız, uyursanız kurumayacaksınız.',
        },
      ],
    },
    {
      id: 'd22-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-ay1',
          sprite: 'askerTolga',
          speaker: 'Tolga',
          text: 'Tolga zarfı cebinden çıkardı ve bu sefer açtı. İçinde elle çizilmiş bir takvim: yirmi sekiz kutu, on dördü boyanmış. "Kızım," dedi. "Beş yaşında. Her gece bir kutu boyuyormuş. On dördüncü günden sonra zarfı yolladı ki ben de boyayayım. Boyayamadım. Telefonda sesini duyunca ağlıyor, o yüzden aramıyorum."',
          choices: [
            {
              id: 'd22-tolga-boya',
              label: '"Bu akşam boya. Birlikte."',
              effect: { moral: 5, dostluk: { kim: 'tolga', puan: 7 } },
              outcome: 'Tolga kalemi aldı. Sekiz kutu boyadı, her biri için ayrı ayrı. Dokuzuncuda durdu: "Gerisini o boyasın."',
            },
            {
              id: 'd22-tolga-ara',
              label: '"Ara onu. Ağlasın, sen de dinle."',
              effect: { moral: 2, dostluk: { kim: 'tolga', puan: 5 } },
              outcome: 'Tolga bir süre takvime baktı. Sonra kalktı, ankesörün kuyruğuna girdi. Döndüğünde gözleri kızarıktı ve ilk defa gülüyordu.',
            },
            {
              id: 'd22-tolga-dinle',
              label: 'Bir şey söyleme, sadece dinle',
              effect: { dostluk: { kim: 'tolga', puan: 4 } },
              outcome: 'Tolga zarfı katladı, cebine koydu. "Sağ ol." Sekizinci günde de böyle demişti. Bu sefer neye teşekkür ettiğini ikiniz de tam olarak biliyordunuz.',
            },
          ],
        },
      ],
    },
    {
      id: 'd22-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-s1',
          text: 'Yağmur dinmedi; avlu boş, herkes koğuşta. Ankesörün önünde saçağın altına sığan kadar kuyruk var. Bazıları arıyor, açılmayan telefonlar da var. Nöbetten önce birkaç saat uyuyabilirsin.',
        },
      ],
    },
    {
      id: 'd22-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd22-sy1',
          sprite: 'ay',
          text: 'Yirmi iki gün bitti, altı kaldı. Yağmur çatıda. Uyumadan önce Tolga\'nın ranzasından kalem sesi geldi, sonra sustu. 01:45\'te omzunda bir el: "Kalk. Yağmurluğu al."',
        },
      ],
    },
  ],
};
