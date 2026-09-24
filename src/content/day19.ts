import type { Day } from '../engine/types';

/**
 * 19. gün — TEK HANE. Kısa gün, bilerek (8 ve 15 gibi). Gece nöbet var
 * (görev takvimi). Üçüncü günün azarı geri dönüyor: telefonda yatağın yirmi
 * kere toplatıldığını anlattıysan (ilk_azar) bu sabah aynı yatağa bakıyorsun.
 */
export const gun19: Day = {
  day: 19,
  title: 'Tek Hane',
  epigraph: 'Dokuz. Parmakla sayılır bir şey oldu.',
  blocks: [
    {
      id: 'd19-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-k1',
          sprite: 'duduk',
          text: 'On dokuzuncu sabah. Kapıdaki tebeşirde artık "9" yazıyor. Tek hane.',
        },
        {
          kind: 'anlati',
          id: 'd19-k-azar',
          sprite: 'ranzaToplu',
          kosul: { isaret: 'ilk_azar', isaretDeger: 'yatak' },
          text: 'Üçüncü gün annene yatağını yirmi kere toplattıklarını anlatmıştın. Bu sabah aynı yatağı tek seferde, düdükten önce topladın. Onbaşı geçerken çarşafın köşesine baktı, parmağını sürmedi.',
          choices: [
            {
              id: 'd19-azar-hatirla',
              label: 'O sabahı hatırla, gül',
              effect: { moral: 4 },
              outcome: 'Yirmi kere. Ellerin titriyordu. Şimdi elin çarşafın nerede kıvrılacağını senden önce biliyor.',
            },
            {
              id: 'd19-azar-emre',
              label: 'Emre\'nin yatağına da el at',
              effect: { disiplin: 2, enerji: -2, dostluk: { kim: 'emre', puan: 3 } },
              outcome: 'Emre\'nin köşesi hâlâ kalkık. Düzelttin. "Ne zaman öğrendin bunu?" dedi. Üçüncü gün, diyemedin; yirmi kerede öğrendin.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd19-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Tek hanenin ilk yatağı.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Kusursuz. Kimse bakmadı, bakması da gerekmedi.'
              : s > 0.55
                ? 'Olur. Dokuz gün daha olur.'
                : 'Köşe kalkık. Tek hane olunca eller de gevşiyor.',
        },
      ],
    },
    {
      id: 'd19-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'mini',
          id: 'd19-i1',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Çavuş bu sabah hiçbir şey söylemedi, sadece okudu.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Sessiz bir yoklama, temiz bir cevap.'
              : s > 0.5
                ? 'Sıradan. Sıradan olması bugün iyi.'
                : 'Dalgındın. Çavuş adını iki kere okudu.',
        },
      ],
    },
    {
      id: 'd19-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-m1',
          sprite: 'postal',
          text: 'Aynı köşe, aynı süpürge, aynı kedi. Dokuz sabah daha.',
        },
      ],
    },
    {
      id: 'd19-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-ka1',
          sprite: 'askerEmre',
          text: 'Emre sağ elinin bir parmağını kapattı. Dokuz. Kimse bir şey demedi, herkes parmağa baktı.',
        },
      ],
    },
    {
      id: 'd19-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Saha Eğitimi',
      sprite: 'engel',
      scenes: [
        {
          kind: 'mini',
          id: 'd19-e1',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Parkur ve tempo. On dokuzuncu kez aynı yol.',
          reward: (s) => ({
            kondisyon: Math.round(-3 + s * 9),
            disiplin: Math.round(-2 + s * 6),
            enerji: -12,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Yol ezber, bacaklar ezber. Tempo kendiliğinden.'
              : s > 0.5
                ? 'Birkaç adım kaçtı, yetiştin.'
                : 'Bugün bacaklar gelmedi. Gece nöbeti daha başlamadan yordu.',
        },
      ],
    },
    {
      id: 'd19-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-o1',
          sprite: 'askerTolga',
          text: 'Tolga cebinden sekizinci günkü zarfı çıkardı. Kenarları yıpranmış; on bir gündür cebinde taşıyor. Açmadı, masaya koydu, sonra geri cebine koydu.',
          choices: [
            {
              id: 'd19-zarf-bak',
              label: 'Zarfa değil Tolga\'ya bak',
              effect: { dostluk: { kim: 'tolga', puan: 3 }, moral: -1 },
              outcome: 'Tolga fark etti. "Sonra," dedi. "Sonra anlatırım." Bu sefer "sonra" bir tarih gibi söylendi.',
            },
            {
              id: 'd19-zarf-gec',
              label: 'Yemeğine dön',
              effect: { moral: 1 },
              outcome: 'Yemeğine döndün. Tolga da. Zarf cepte kaldı, bir gün daha.',
            },
          ],
        },
      ],
    },
    {
      id: 'd19-talim',
      from: '13:30',
      to: '16:30',
      title: 'Tören Provası',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Dünkünden iyi. Yarınki bugünkünden iyi olacak. Gece nöbeti olanlar son geçişten sonra çıkabilir.',
          choices: [
            {
              id: 'd19-prova-kal',
              label: 'Nöbetin var ama son geçişe kal',
              effect: { disiplin: 4, enerji: -5 },
              outcome: 'Kaldın. Çavuş listede adını gördü, sonra seni sırada gördü. Kalemini cebine koydu.',
            },
            {
              id: 'd19-prova-cik',
              label: 'Nöbetten önce dinlenmeye çık',
              effect: { enerji: 6, disiplin: -1 },
              outcome: 'Ranzaya uzandın. Uyumadın ama bir saat boyunca kimse sana bağırmadı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd19-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Nöbet listesi. 02:00–04:00: adın. Tek hanede nöbet daha kısa sürmez, uyarayım.',
        },
      ],
    },
    {
      id: 'd19-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-ay1',
          sprite: 'askerSerkan',
          text: 'Serkan termosu yine önüne koydu. Defteri açmadı. "Geçen sefer bedavaydı," dedi. "Bu sefer de. Tek hane indirimi."',
        },
      ],
    },
    {
      id: 'd19-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-s1',
          text: 'Nöbetten önce iki saat. Ankesör, bank, dolap. Hepsi yerli yerinde; dokuz akşam daha yerli yerinde olacak.',
        },
      ],
    },
    {
      id: 'd19-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd19-sy1',
          sprite: 'ay',
          text: 'On dokuz gün bitti, dokuz kaldı. Yattın, gözün saatte. 01:45\'te omzuna dokunan eli bu sefer uyanık karşıladın.',
        },
      ],
    },
  ],
};
