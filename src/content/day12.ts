import type { Day } from '../engine/types';

/**
 * 12. gün — HATIRLAMA. Telefonun ilk büyük geri dönüş günü (g12); gün de
 * geriye bakıyor. Bot hikâyesini telefonda anlattıysan koğuşta senin
 * anlattığın hâliyle dolaşıyor (komik_olay); telefonda anlatmak için gün
 * boyu hikâye biriktirdiğini söylediysen bunu kendinde fark ediyorsun
 * (biriktiren).
 */
export const gun12: Day = {
  day: 12,
  title: 'Hatırlama',
  epigraph: 'On iki gün önce bu kapıdan başka biri girdi.',
  blocks: [
    {
      id: 'd12-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-k1',
          sprite: 'duduk',
          text: 'On ikinci sabah. Aynaya baktığında yüzünün değiştiğini fark ettin: saçlar kısa, yanaklar içeri, gözlerin altı koyu. Ama bakışın ilk günkü gibi kaçmıyor.',
        },
        {
          kind: 'mini',
          id: 'd12-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'On ikinci yatak. İlk gün bu yatak seni ağlatıyordu, hatırlıyor musun?',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-1 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'İlk günkü sen bu yatağı görse inanmazdı.'
              : s > 0.55
                ? 'Olur. İlk günden çok daha iyi, dünden biraz kötü.'
                : 'Bazı sabahlar eller ilk güne döner.',
        },
      ],
    },
    {
      id: 'd12-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'İki gün sonra yarısı. Yarıya gelen asker ya gevşer ya sertleşir. Ben ikincisini istiyorum. Gevşeyeni ben sertleştiririm.',
        },
        {
          kind: 'mini',
          id: 'd12-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Çavuş "gevşeyen" dediği için herkes biraz fazla dik duruyor.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Kusursuz. Çavuş gevşeyen aradı, bulamadı.'
              : s > 0.5
                ? 'İyi. Mükemmel değil, iyi.'
                : 'Bir an geç. Çavuş "işte gevşeyen" dedi, bakmadan.',
        },
      ],
    },
    {
      id: 'd12-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-m1',
          sprite: 'postal',
          text: 'Mıntıkada kedinin yanında bir tabak var. Kimin koyduğunu kimse söylemiyor ama tabakta Serkan\'ın kantinden aldığı konserve balığın kokusu var.',
        },
      ],
    },
    {
      id: 'd12-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-ka1',
          sprite: 'tepsi',
          text: 'Emre ilk günü anlatıyor: otobüs, nizamiye, telefonların kutuya atılışı. "O gün buradan iki gün sonra kaçarım sanıyordum." On iki gün olmuş, kimse kaçmamış.',
          choices: [
            {
              id: 'd12-ilkgun-anlat',
              label: 'Kendi ilk gününü anlat',
              effect: { moral: 5, dostluk: { kim: 'emre', puan: 3 } },
              outcome: 'Anlatırken fark ettin: ilk günün yarısını hatırlamıyorsun. Hatırladığın yarısı da artık komik.',
            },
            {
              id: 'd12-ilkgun-dinle',
              label: 'Dinle',
              effect: { moral: 3 },
              outcome: 'Emre anlatmayı seviyor, sen dinlemeyi öğreniyorsun. Masa böyle dengede.',
            },
          ],
        },
      ],
    },
    {
      id: 'd12-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Engel Parkuru',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-e1',
          sprite: 'engel',
          text: 'Engel parkuru süreyle. İlk hafta duvarın önünde duran bölük bugün duvara koşuyor. Kimse bunu söylemiyor ama herkes fark ediyor.',
        },
        {
          kind: 'mini',
          id: 'd12-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Parkurdan dönüş temposu. Düdük sert, bölük kararlı.',
          reward: (s) => ({
            kondisyon: Math.round(-3 + s * 10),
            disiplin: Math.round(-2 + s * 7),
            enerji: -14,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Bölük tek adım. Çavuş arkadan izledi ve ilk defa düdüğü indirdi.'
              : s > 0.5
                ? 'Birkaç kaçak adım. Parkur ağırdı.'
                : 'Parkur bacaklarında kaldı.',
        },
      ],
    },
    {
      id: 'd12-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-o1',
          sprite: 'askerTolga',
          text: 'Tolga yemekte ilk defa kendiliğinden bir şey anlattı: öğrencileri ona yeni yıl kartı yollamış, zarfın üstüne "Öğretmenim askerde" yazmışlar. Pul yerine çizdikleri resim bir tank. Tankın namlusunda çiçek var.',
          choices: [
            {
              id: 'd12-tolga-kart',
              label: '"Görebilir miyim?"',
              effect: { moral: 5, dostluk: { kim: 'tolga', puan: 6 } },
              outcome: 'Kartı uzattı. Otuz iki imza, bir tank, bir çiçek. Geri verirken Tolga kartı iki eliyle aldı.',
            },
            {
              id: 'd12-tolga-soru',
              label: '"Eve dönünce önce okula mı gideceksin?"',
              effect: { moral: 2, dostluk: { kim: 'tolga', puan: 3 } },
              outcome: '"Önce eve." Bir an durdu. "Evde biri bekliyor." Başka bir şey söylemedi, sen de sormadın.',
            },
          ],
        },
      ],
    },
    {
      id: 'd12-talim',
      from: '13:30',
      to: '16:30',
      title: 'Silah Eğitimi',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-t1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Söküp takmayı ilk gün yavaş öğrendiniz. Bugün gözünüz kapalı. Bendeki kronometre gözünüzün kapalı olduğunu bilmiyor, ona göre.',
        },
        {
          kind: 'mini',
          id: 'd12-t2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Sök, sırala, tak. Parçaları gözle değil elle tanıyacaksın.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 12), moral: Math.round(-1 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Gözün kapalı, elin emin. On iki gün önce yayı ters takıyordun.'
              : s > 0.5
                ? 'Bir parçayı yokladın, buldun. Süre yetti.'
                : 'Parçalar elinde karıştı. Onbaşı "gözünü aç" dedi, bu bir ceza değildi, bir öneriydi.',
        },
      ],
    },
    {
      id: 'd12-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yarın gece nöbet listesi yeniden işliyor. Bu hafta her şey ikinci kez oluyor; ikinci kez olan şey birinciden kolay olmaz, sadece tanıdık olur.',
        },
      ],
    },
    {
      id: 'd12-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-ay1',
          sprite: 'tepsi',
          text: 'Serkan kediye konserve koyduğunu inkâr ediyor. "Ben yatırım yaparım, hayır işi yapmam." Kimse inanmıyor. Serkan da inandırmaya çalışmıyor.',
        },
      ],
    },
    {
      id: 'd12-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-s1',
          text: 'Bankta oturanlar çıkınca ne yapacağını anlatıyor. Kimsenin planı ilk günkü planı değil. İlk gün herkes "uyuyacağım" diyordu; şimdi herkes birini görecek.',
        },
        {
          kind: 'anlati',
          id: 'd12-s-bot',
          sprite: 'askerEmre',
          kosul: { isaret: 'komik_olay', isaretDeger: 'bot' },
          text: 'Emre\'nin kuzeni başka bölükte. Bugün ona bir mektup gelmiş: "Sizin koğuşta bot kaybolmuş, doğru mu?" Hikâye senin telefonda anlattığın hâliyle evden eve, oradan kışlanın öbür ucuna gitmiş; yolda el feneri de büyümüş.',
          choices: [
            {
              id: 'd12-bot-sahiplen',
              label: '"O hikâyeyi ben anlattım" de',
              effect: { moral: 5, dostluk: { kim: 'emre', puan: -2 } },
              outcome: 'Emre sana baktı: "Demek sensin." Sonra güldü: "Bari doğru anlatsaydın, fener o kadar büyük değildi."',
            },
            {
              id: 'd12-bot-sus',
              label: 'Sus, hikâye artık kışlanın',
              effect: { moral: 4, dostluk: { kim: 'emre', puan: 3 } },
              outcome: 'Hikâyeler bir yerden sonra sahibini bırakıyor. Bu hikâye artık Emre\'nin değil, senin de değil; kışlanın.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd12-s-biriktir',
          sprite: 'defter',
          kosul: { isaret: 'biriktiren', isaretDeger: 'evet' },
          text: 'Kedinin tabağını, Tolga\'nın kartını, Emre\'nin fenerini bir kenara koyduğunu fark ettin. Telefonda anlatmak için gün boyu biriktiriyorsun; kışla senin için artık bir hikâye malzemesi.',
          choices: [
            {
              id: 'd12-biriktir-yaz',
              label: 'Bir kâğıda not al, unutmasın',
              effect: { moral: 4, disiplin: 2 },
              gerekliEsya: 'defterKalem',
              outcome: 'Üç satır: kedi, kart, fener. Bu akşam telefonda üçünü de anlatacaksın, belki biriyle başlayıp sesin yetene kadar.',
            },
            {
              id: 'd12-biriktir-akil',
              label: 'Aklında tut',
              effect: { moral: 3 },
              outcome: 'Kedi, kart, fener. Kuyrukta bekleyene kadar tekrar ettin.',
            },
          ],
        },
      ],
    },
    {
      id: 'd12-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd12-sy1',
          sprite: 'ay',
          text: 'On iki gün bitti, on altı kaldı. Yarından sonra yarısı. Uykuya dalmadan önce ilk geceyi hatırlamaya çalıştın; aynı tavan, başka bir sen.',
        },
      ],
    },
  ],
};
