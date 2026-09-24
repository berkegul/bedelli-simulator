import type { Day } from '../engine/types';

/**
 * 9. gün — ATIŞ. İlk poligon: tüfeğin ağırlığı, tepme, kulak çınlaması.
 * Atış mini oyunu burada ilk kez oynanıyor. Akşam telefonda (g09) atışı
 * nasıl anlattığın (dürüst, iyi, abartılı) 10. günde koğuşta geri dönüyor.
 */
export const gun09: Day = {
  day: 9,
  title: 'Atış',
  epigraph: 'Tüfek bugün ilk defa sesini çıkardı.',
  blocks: [
    {
      id: 'd9-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-k1',
          sprite: 'duduk',
          text: 'Poligon günü. Koğuşta kimse konuşmuyor ama herkes her zamankinden hızlı giyiniyor. Emre postal bağcığını iki kez çözüp bağladı.',
        },
        {
          kind: 'mini',
          id: 'd9-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Heyecan elini hızlandırıyor ama hizayı bozuyor.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 14), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Heyecanı battaniyeye geçirmedin. Kenar düz.'
              : s > 0.55
                ? 'Aceleden bir köşe kaydı, düzelttin.'
                : 'Kafan poligondaydı, battaniye yerdeydi.',
        },
      ],
    },
    {
      id: 'd9-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Poligonda tek kural var: namlu her zaman hedefe bakar. Şakası yok, "pardon"u yok. Kulak tıkaçlarını şimdi takın, benim sesimi zaten duyarsınız.',
        },
        {
          kind: 'mini',
          id: 'd9-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Poligon sabahı yoklaması. Çavuşun sesi her zamankinden kısa.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 15), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Keskin. Bugün Çavuş keskinlik istiyor ve aldı.'
              : s > 0.5
                ? 'Yetişti. Çavuş bugün başka şeylere bakıyor.'
                : 'Geç. "Poligonda da mı geç kalacaksın?"',
        },
      ],
    },
    {
      id: 'd9-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-m1',
          sprite: 'postal',
          text: 'Mıntıkada Serkan fısıldıyor: "Poligonda kovan toplayan olursa bana getirsin, iyi para veren var." Kimse getirmeyecek, Serkan da bunu biliyor. Denemekten zarar gelmez.',
        },
      ],
    },
    {
      id: 'd9-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-ka1',
          sprite: 'tepsi',
          text: 'Tolga ilk defa bir şey sordu: "Sen hiç ateş ettin mi? Ben etmedim. Sınıfta balon patlasa irkiliyorum." Güldü ama çayı soğumuştu ve fark etmedi.',
          choices: [
            {
              id: 'd9-tolga-yan',
              label: '"Poligonda yanında dururum"',
              effect: { moral: 3, dostluk: { kim: 'tolga', puan: 6 } },
              outcome: 'Tolga başını salladı. Sıraya girerken gerçekten yanına geçtin; o da fark etti.',
            },
            {
              id: 'd9-tolga-saka',
              label: '"Balondan büyük değil, merak etme"',
              effect: { moral: 2, dostluk: { kim: 'tolga', puan: 2 } },
              outcome: '"Balondan büyük," dedi. Haklıydı ama güldü.',
            },
          ],
        },
      ],
    },
    {
      id: 'd9-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Poligon',
      sprite: 'hedefTahtasi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-e1',
          sprite: 'tufek',
          speaker: 'Onbaşı Recep',
          text: 'Yüzüstü pozisyon. Dirsekler yerde, dipçik omza. Nefes al, yarısını ver, tut. Tetik çekilmez, sıkılır. Beş mermi. Acele eden karavana yazar.',
        },
        {
          kind: 'mini',
          id: 'd9-e2',
          game: 'atis',
          sprite: 'hedefTahtasi',
          brief: 'Basılı tut: nefesini tut, nişangâh daralsın. Bırak: tetik. Nefes biterse eller titrer.',
          reward: (s) => ({
            disiplin: Math.round(-4 + s * 14),
            moral: Math.round(-4 + s * 10),
            enerji: -8,
          }),
          verdict: (s) =>
            s > 0.8
              ? 'Onbaşı dürbünden baktı, bir daha baktı. "On ikiden iki tane. İlk atış için." Bu onun övgüsü.'
              : s > 0.5
                ? 'Hepsi kartonda. Merkez değil ama karton. Omzun zonkluyor, kulağın çınlıyor.'
                : s > 0.2
                  ? 'İkisi kartonda, üçü toprakta. Tepme seni şaşırttı. Herkesi şaşırtıyor.'
                  : 'Beş mermi, beş karavana. Onbaşı "tepmeye alışınca olur" dedi, bu teselliydi.',
        },
        {
          kind: 'anlati',
          id: 'd9-e3',
          sprite: 'askerTolga',
          text: 'Tolga ilk mermiden sonra bir an durdu, sonra kalan dördünü arka arkaya attı. Sıradan kalkarken ellerine baktı. Titremiyordu.',
        },
      ],
    },
    {
      id: 'd9-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-o1',
          sprite: 'tepsi',
          text: 'Kulakların hâlâ çınlıyor. Yemekhanede herkes her zamankinden yüksek sesle konuşuyor çünkü kimse kimseyi tam duymuyor. Emre dört kartonda olduğunu anlatıyor, beş kez.',
        },
      ],
    },
    {
      id: 'd9-talim',
      from: '13:30',
      to: '16:30',
      title: 'Silah Temizliği',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-t1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Atış bitti, iş bitmedi. Namlunun içi kurum, mekanizma barut. Temiz teslim etmeyen yarın aynı tüfekle bir daha temizler.',
        },
        {
          kind: 'mini',
          id: 'd9-t2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Sök, temizle, tak. Parmakların barut kokuyor.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 11), moral: Math.round(-1 + s * 3) }),
          verdict: (s) =>
            s > 0.85
              ? 'Onbaşı namluya ışık tuttu, baktı, başını salladı. Temiz.'
              : s > 0.5
                ? 'Temiz sayılır. Onbaşı bir yeri bezle bir daha sildi, sana gösterdi.'
                : 'Kurum kaldı. Yarın aynı tüfek, aynı masa.',
        },
      ],
    },
    {
      id: 'd9-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'İlk atış herkesin atışıdır. İyi atan da kötü atan da bugün aynı sesi duydu. Yarın gece nöbet başlıyor; liste panoda, bakın.',
        },
      ],
    },
    {
      id: 'd9-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-ay1',
          sprite: 'tepsi',
          text: 'Serkan kaç attığını söylemiyor. "Esnaf kârını söylemez." Emre dördüncü kez dört kartonu anlatıyor; artık kartonlar merkeze yaklaşmaya başladı.',
        },
      ],
    },
    {
      id: 'd9-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-s1',
          text: 'Ankesör kuyruğunda herkes aynı cümleyi prova ediyor: "Bugün atış vardı." Ne kadar tutturduğunu nasıl anlatacağın ise herkesin kendi kararı.',
        },
      ],
    },
    {
      id: 'd9-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd9-sy1',
          sprite: 'ay',
          text: 'Dokuz gün bitti, on dokuz kaldı. Omzun hâlâ zonkluyor; yastığa değince hatırlıyorsun. Yarın gece ilk nöbet.',
        },
      ],
    },
  ],
};
