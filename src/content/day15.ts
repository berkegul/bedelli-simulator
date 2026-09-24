import type { Day } from '../engine/types';

/**
 * 15. gün — SAYIM. Kısa gün, bilerek: yarıdan sonraki ilk sabah ve hiçbir
 * şey olmuyor. Gün sayısı artık ilerlemiyor, azalıyor; on üç kaldı. Kankan
 * duvar takvimini anlattıysa (kanka_takvim, 9. gün) çentik atarken onu
 * düşünüyorsun.
 */
export const gun15: Day = {
  day: 15,
  title: 'Sayım',
  epigraph: 'On üç. Dün "on dört gün geçti" diyordun, bugün "on üç kaldı".',
  blocks: [
    {
      id: 'd15-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-k1',
          sprite: 'duduk',
          text: 'Düdük. Ranzanın demirine tırnakla bir çizgi daha çektin. Saymadın; saymana gerek yok, kaç tane olduğunu biliyorsun.',
        },
        {
          kind: 'anlati',
          id: 'd15-k-takvim',
          sprite: 'kunye',
          kosul: { isaret: 'kanka_takvim', isaretDeger: 'var' },
          text: 'Kankan duvara takvim asmıştı, telefonda anlatmıştı. Şu an o da çiziyordur. Aynı sabah, iki ayrı duvar, iki ayrı çizgi.',
          choices: [
            {
              id: 'd15-takvim-gul',
              label: 'Düşün ve gülümse',
              effect: { moral: 4 },
              outcome: 'Kimse neden güldüğünü sormadı. Burada kimse sabah altıda sebepsiz gülen adama bir şey sormaz.',
            },
            {
              id: 'd15-takvim-gec',
              label: 'Düşünme, giyin',
              effect: { disiplin: 2, moral: -1 },
              outcome: 'Kafanı boşalttın. Takvim dışarıda kaldı, sen içeride.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd15-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'On beşinci yatak. El ezbere, göz saatte.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Bitti bile. Onbaşı geçerken bakmadı; bakmasına gerek kalmadı.'
              : s > 0.55
                ? 'Normal. Artık normal diye bir şey var.'
                : 'Köşe kalktı. Sayıyla uğraşırken yatağı unuttun.',
        },
      ],
    },
    {
      id: 'd15-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Gün sayanları görüyorum. Sayın. Ama benim sıramda sayı yok, sıra var.',
        },
        {
          kind: 'mini',
          id: 'd15-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Herkes kafasında başka bir sayı tutuyor.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Adın okundu, cevap verdin. Sayı değil, sıra.'
              : s > 0.5
                ? 'Olağan bir yoklama. Olağan iyidir.'
                : 'Dalgındın. Çavuş adını iki kez okudu.',
        },
      ],
    },
    {
      id: 'd15-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-m1',
          sprite: 'postal',
          text: 'Aynı köşe, aynı izmaritler. Kimin içtiğini artık markasından biliyorsun.',
        },
      ],
    },
    {
      id: 'd15-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-ka1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: '"On üç gün, üç öğün, otuz dokuz tepsi," dedi Serkan. "Kırk değil, otuz dokuz. Son gün kahvaltıdan sonra çıkıyoruz." Hesabı yapmış, kontrol etmiş.',
          choices: [
            {
              id: 'd15-serkan-hesap',
              label: '"Nöbet gecesi çayını da say"',
              effect: { moral: 3, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: 'Serkan durdu, düşündü, defterine bir satır ekledi. "Haklısın. Kırk bir."',
            },
            {
              id: 'd15-serkan-sayma',
              label: '"Sayma şunu Serkan"',
              effect: { moral: -1, dostluk: { kim: 'serkan', puan: -2 } },
              outcome: '"Saymazsan geçmez," dedi. Defteri kapattı, ama sayı kafanda kaldı: otuz dokuz.',
            },
          ],
        },
      ],
    },
    {
      id: 'd15-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Saha Eğitimi',
      sprite: 'engel',
      scenes: [
        {
          kind: 'mini',
          id: 'd15-e1',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Dünkü yol, dünkü tempo. Farkı bacakların biliyor.',
          reward: (s) => ({
            kondisyon: Math.round(-3 + s * 9),
            disiplin: Math.round(-2 + s * 6),
            enerji: -12,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'İki hafta önce bu yol seni bitiriyordu. Bugün düşünecek vaktin bile oldu.'
              : s > 0.5
                ? 'Tempo tuttu. Birkaç adım kaydı, kimse görmedi.'
                : 'Geride kaldın. Sayı azaldı ama yol aynı uzunlukta.',
        },
      ],
    },
    {
      id: 'd15-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-o1',
          sprite: 'tepsi',
          text: 'Nohut. Pazartesi nohut, perşembe nohut. Menüyü artık panoya bakmadan biliyorsun.',
        },
      ],
    },
    {
      id: 'd15-talim',
      from: '13:30',
      to: '16:30',
      title: 'Talim',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-t1',
          sprite: 'askerEmre',
          text: 'Talimde Emre\'nin adımı kaydı, bütün sıra kaydı. Çavuş durdurdu: "Kim?" Emre\'nin yüzü kızardı. Ondan önce sen vardın; bir adım öne çıkıp üstüne alabilirsin.',
          choices: [
            {
              id: 'd15-talim-ustlen',
              label: 'Öne çık: "Bendim komutanım"',
              effect: { disiplin: -4, moral: 2, dostluk: { kim: 'emre', puan: 6 } },
              outcome: 'On şınav. Emre sonra bir şey demedi; akşam tepsisindeki tatlıyı senin tepsine koydu.',
            },
            {
              id: 'd15-talim-sus',
              label: 'Kıpırdama',
              effect: { disiplin: 2, dostluk: { kim: 'emre', puan: -2 } },
              outcome: 'Emre kendi söyledi. Şınavını çekti. Sana bakmadı, ama bakmaması bir şeydi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd15-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yarın uzun yürüyüş, yarın gece nöbet listesi. Ayağında su toplayan bu akşam söylesin, yarın değil.',
        },
      ],
    },
    {
      id: 'd15-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-ay1',
          sprite: 'tepsi',
          text: 'Masada kimse konuşmuyor. Yorgunluktan değil; söylenecek bir şey yok. Bu da iki haftanın sonunda gelen bir rahatlık.',
        },
      ],
    },
    {
      id: 'd15-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-s1',
          text: 'Postalını çıkardığında çorabın topuğa yapışmıştı. Sağ ayakta bir kabarcık, bozuk para büyüklüğünde. Şimdilik acımıyor.',
        },
      ],
    },
    {
      id: 'd15-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd15-sy1',
          sprite: 'ay',
          text: 'On beş gün bitti, on üç kaldı. Işıklar söndü. Yastığın altında parmaklarınla saydın; iki el yetmedi, bir el daha lazım.',
        },
      ],
    },
  ],
};
