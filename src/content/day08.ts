import type { Day } from '../engine/types';

/**
 * 8. gün — RUTİN. Kısa gün, bilerek: şaşırtıcı bir şey olmuyor ve oyuncu
 * bunu fark etsin. Zilden önce uyanmak, sıranın ezberlenmesi. Tek gerçek
 * olay Tolga'nın mektubu; evdeki sorunun ilk ipucu (20'lerde açılacak).
 */
export const gun08: Day = {
  day: 8,
  title: 'Rutin',
  epigraph: 'Zil çalmadan uyandın. Bu da bir şeydir.',
  blocks: [
    {
      id: 'd8-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-k1',
          sprite: 'ay',
          text: 'Gözünü açtığında koğuş hâlâ karanlıktı. Saat 05:24. Düdük altı dakika sonra çalacak ve sen bunu biliyorsun, çünkü vücudun biliyor.',
          choices: [
            {
              id: 'd8-erken-kalk',
              label: 'Kalk, düdükten önce hazırlan',
              effect: { disiplin: 5, enerji: -3 },
              outcome: 'Düdük çaldığında yatağın toplu, postalın bağlıydı. Onbaşı kapıda durdu, sana baktı, bir şey demedi.',
            },
            {
              id: 'd8-erken-yat',
              label: 'Altı dakika daha yat',
              effect: { enerji: 5, moral: 2 },
              outcome: 'En değerli altı dakika. Tavana baktın ve hiçbir şey düşünmedin.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd8-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Sekizinci gün. Çubuk hızlı, elin daha hızlı.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 14), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Ezber. Kafan başka yerdeyken bile elin doğru yeri buldu.'
              : s > 0.55
                ? 'Tamam. Sıradan bir sabah, sıradan bir yatak.'
                : 'Rutin gevşetti. Onbaşı "sekizinci gün" dedi, sadece bunu.',
        },
      ],
    },
    {
      id: 'd8-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün program bildiğiniz program. Sabah saha, öğleden sonra talim. Yarın poligon, o yüzden bugün kimse yorulmasın diye bir şey demeyeceğim. Yorulun.',
        },
        {
          kind: 'mini',
          id: 'd8-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Sıradan bir yoklama. Sıradan olması iyi.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 15), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Adın okunmadan önce "burada" demeye hazırdın.'
              : s > 0.5
                ? 'Olağan. Çavuş listeyi çevirdi, geçti.'
                : 'Dalgındın. Arkandaki dürttü.',
        },
      ],
    },
    {
      id: 'd8-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-m1',
          sprite: 'postal',
          text: 'Avlunun köşesinde bir kedi var; üç gündür aynı saatte geliyor. Mıntıkayı süpürürken kimse onu kovmuyor. Kışlanın en düzenli askeri o.',
        },
      ],
    },
    {
      id: 'd8-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-ka1',
          sprite: 'tepsi',
          text: 'Aynı masa, aynı sandalye. Kimse bunu kararlaştırmadı ama sekiz günde herkes kendi yerini buldu. Emre karşında, Serkan solunda, Tolga masanın ucunda.',
        },
      ],
    },
    {
      id: 'd8-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Saha Eğitimi',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-e1',
          sprite: 'engel',
          text: 'Engel parkuru, yüz metre sürünme, tekrar. Sekizinci günde bedenin şikâyet etmeyi bıraktı; artık sadece not alıyor.',
        },
        {
          kind: 'mini',
          id: 'd8-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Parkurdan sonra tempo yürüyüşü. Ayaklar ağır, düdük aynı.',
          reward: (s) => ({
            kondisyon: Math.round(-3 + s * 9),
            disiplin: Math.round(-2 + s * 6),
            enerji: -12,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Yorgunken bile tempo. Bu yeni bir şey.'
              : s > 0.5
                ? 'Birkaç adım kaçtı. Parkurdan sonra herkeste kaçıyor.'
                : 'Bacakların parkurda kaldı. Tempo senden önce varış noktasına gitti.',
        },
      ],
    },
    {
      id: 'd8-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-o1',
          sprite: 'askerTolga',
          text: 'Tolga masaya bir zarf getirdi, açmadı. Yemek boyunca zarf tepsisinin yanında durdu. Pul yerine bir çocuk resmi yapıştırılmış.',
          choices: [
            {
              id: 'd8-mektup-sor',
              label: '"Kimden?" diye sor',
              effect: { dostluk: { kim: 'tolga', puan: 3 }, moral: 1 },
              outcome: '"Evden." Bu kadar. Zarfı cebine koydu ve kalktı. Ama giderken omzuna dokundu, ilk defa.',
            },
            {
              id: 'd8-mektup-sus',
              label: 'Bir şey sorma',
              effect: { dostluk: { kim: 'tolga', puan: 5 } },
              outcome: 'Sormadın. Tolga yemeğini bitirince zarfı açtı, okudu, katladı. "Sağ ol," dedi. Neye teşekkür ettiğini ikiniz de biliyordunuz.',
            },
          ],
        },
      ],
    },
    {
      id: 'd8-talim',
      from: '13:30',
      to: '16:30',
      title: 'Talim',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yarın poligon. Tüfek bugün omzunuza alışacak. Hazır ol, sağa bak, omza tüfek. Bir saat. Kimse düşürmesin.',
        },
        {
          kind: 'anlati',
          id: 'd8-t2',
          text: 'Bir saat boyunca tüfek omzunda. Kolun önce yanıyor, sonra hissizleşiyor, sonra yeniden yanıyor.',
          choices: [
            {
              id: 'd8-tufek-dayan',
              label: 'Dişini sık, kıpırdama',
              effect: { disiplin: 6, kondisyon: 3, enerji: -8 },
              outcome: 'Çavuş sıranın önünden üç kez geçti. Üçünde de omzun aynı yükseklikteydi.',
            },
            {
              id: 'd8-tufek-kaydir',
              label: 'Çavuş dönünce omzunu kaydır',
              effect: { disiplin: -3, enerji: -3 },
              outcome: 'İkinci seferde yakaladı. "Yarın poligonda da böyle mi yapacaksın?" Yapmayacağını söyledin.',
            },
          ],
        },
      ],
    },
    {
      id: 'd8-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yarın sabah poligon. Erken yatın. Kulak tıkacı dağıtılacak, takmayan sağır olur, sağır olan beni duymaz, beni duymayan sorun olur.',
        },
      ],
    },
    {
      id: 'd8-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-ay1',
          sprite: 'tepsi',
          text: 'Emre poligonu anlatıyor; hiç gitmemiş ama kayınbiraderi anlatmış. Serkan dinlemiyor, kafasında bir hesap yapıyor. Her akşamki masa.',
        },
      ],
    },
    {
      id: 'd8-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-s1',
          text: 'Aynı avlu, aynı bank, aynı ankesör. Sekiz gün önce her şey yabancıydı; şimdi neyin nerede olduğunu gözün kapalı biliyorsun ve bu biraz korkutucu.',
        },
      ],
    },
    {
      id: 'd8-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd8-sy1',
          sprite: 'ay',
          text: 'Sekiz gün bitti, yirmi kaldı. Yarın ilk defa ateş edeceksin. Uykuya dalmadan önce parmağının tetiğe değdiğini düşündün ve elin kendiliğinden kıpırdadı.',
        },
      ],
    },
  ],
};
