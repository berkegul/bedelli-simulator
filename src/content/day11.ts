import type { Day } from '../engine/types';

/**
 * 11. gün — KOĞUŞ. Kaybolan bot. Telefon g11 aynı olayı üç ağızdan
 * anlatıyor (annen anlamıyor, sevgilin gülüyor, kankan yılın haberi
 * sayıyor); burada olayın kendisi yaşanıyor. Sabah ilk nöbetin ertesi:
 * sevgilin de o saatte uyanık kaldıysa (nobet_gecesi) bunu hatırlıyorsun.
 */
export const gun11: Day = {
  day: 11,
  title: 'Koğuş',
  epigraph: 'Bir bot kayboldu ve yirmi sekiz kişi aynı şeyi aradı.',
  blocks: [
    {
      id: 'd11-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-k1',
          sprite: 'ay',
          text: 'Üç buçuk saat uyku. Nöbetten döndüğünde ranzan soğumuştu, şimdi tam ısınmışken düdük çaldı. Gözlerin kum dolu.',
        },
        {
          kind: 'anlati',
          id: 'd11-k-birlikte',
          sprite: 'telefon',
          kosul: { isaret: 'nobet_gecesi', isaretDeger: 'birlikte' },
          text: 'Nöbetin ikinci saatinde, 03:00\'te, aklına dün akşamki telefon geldi: "Bu gece ikimiz de uyanığız." Karanlıkta bir yerde biri daha senin saatinde tavana bakıyordu. Nöbet ondan sonra daha kısa geçti.',
          choices: [
            {
              id: 'd11-birlikte-gulum',
              label: 'Hatırla, gülümse',
              effect: { moral: 6 },
              outcome: 'Uykusuzluğun yarısı geçti. Diğer yarısı hâlâ gözlerinde.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd11-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Nöbet ertesi. Eller uykulu, çubuk hızlı.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 14), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Uykusuz ama kusursuz. Buna disiplin diyorlar galiba.'
              : s > 0.55
                ? 'Yamuk ama geçer. Nöbet ertesine müsamaha var.'
                : 'Battaniye kaydı. Onbaşı nöbet listesine baktı, bu seferlik geçti.',
        },
        {
          kind: 'anlati',
          id: 'd11-k3',
          sprite: 'postal',
          text: 'Koğuşun ucundan bir ses: "Botum yok." Yirmi yedi kişi aynı anda kendi postalına baktı. Tolga\'nın ranzasının altı boş.',
        },
      ],
    },
    {
      id: 'd11-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bir askerin bir botu yoksa, bölüğün bir askeri eksiktir. İçtimaya kadar bulunacak. Bulunmazsa bu koğuş kahvaltıyı bot arayarak geçirir.',
        },
        {
          kind: 'anlati',
          id: 'd11-i2',
          sprite: 'askerTolga',
          text: 'Tolga terlikle sırada duruyor. Yüzü kıpkırmızı. Koğuşun yarısı dolapları açıyor, diğer yarısı ranzaların altına eğilmiş.',
          choices: [
            {
              id: 'd11-bot-ranza',
              label: 'Ranzaların altını tek tek tara',
              effect: { disiplin: 4, enerji: -6, dostluk: { kim: 'tolga', puan: 4 } },
              outcome: 'Yirmi yedi ranzanın altında: bir çorap, iki tespih, bir mektup ve Emre\'nin kayıp tarağı. Bot yok.',
            },
            {
              id: 'd11-bot-serkan',
              label: 'Serkan\'a sor: "Senin defterde bot var mı?"',
              effect: { moral: 3, dostluk: { kim: 'serkan', puan: 2 } },
              outcome: 'Serkan alındı. "Ben bot satmam. Bot kutsaldır." Sonra ekledi: "Ama dünkü nöbetçilerden biri karanlıkta yanlış postal giydi, onu biliyorum."',
            },
            {
              id: 'd11-bot-sakin',
              label: 'Tolga\'nın yanında dur, telaşa katılma',
              effect: { moral: 2, dostluk: { kim: 'tolga', puan: 6 } },
              outcome: 'Tolga bir şey demedi ama omzunu biraz indirdi. Bütün koğuşun gözü üstündeyken yanında biri duruyordu.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd11-i3',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama, Tolga terlikle. Çavuş sayıyor ve sayarken yüzü değişmiyor.',
          reward: (s) => ({ disiplin: Math.round(-7 + s * 15), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Bölük dağınık başladı ama sesin tek çıktı.'
              : s > 0.5
                ? 'Karışık bir sabah, karışık bir yoklama.'
                : 'Bot aramaktan sırayı kaçırdın.',
        },
      ],
    },
    {
      id: 'd11-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-m1',
          sprite: 'postal',
          text: 'Mıntıkada herkes izmarit değil bot arıyor. Çimlerin arasında, çöp kutusunun arkasında, kedinin yattığı köşede. Kedi yerinden kalkmadı; onun botla işi yok.',
        },
      ],
    },
    {
      id: 'd11-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-ka1',
          sprite: 'tepsi',
          text: 'Kahvaltı bot aramakla geçti; tepsiler ayakta yendi. Emre bir elinde ekmek, bir elinde el feneriyle dolapların üstüne bakıyor. Neden dolapların üstüne bakıyor, kimse sormadı.',
        },
      ],
    },
    {
      id: 'd11-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Saha Eğitimi',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-e1',
          sprite: 'askerTolga',
          text: 'Tolga sahaya depodan verilen yedek botla çıktı; iki numara büyük. Her adımda botun içinde ayağı ayrı yürüyor. Kimse gülmedi, en azından yüzüne.',
        },
        {
          kind: 'mini',
          id: 'd11-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Tempo yürüyüşü. Önünde Tolga, iki numara büyük botla. Onun temposu senin temponu da bozuyor.',
          reward: (s) => ({
            kondisyon: Math.round(-3 + s * 9),
            disiplin: Math.round(-2 + s * 7),
            enerji: -13,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Tolga tökezledi, sen tempoyu bozmadan kolundan tuttun. İkiniz de yürümeye devam ettiniz.'
              : s > 0.5
                ? 'Önündeki topallarken tempo tutmak zor. İdare ettin.'
                : 'Tolga\'nın botu senin temponu da götürdü.',
        },
      ],
    },
    {
      id: 'd11-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-o1',
          sprite: 'askerEmre',
          text: 'Emre yemekhaneye girdi ve bir anda durdu. Kendi ayağına baktı. Sonra Tolga\'nın ayağına. Sonra yine kendi ayağına. Emre dün gece 00:00–02:00 nöbetçisiydi.',
          choices: [
            {
              id: 'd11-emre-soyle',
              label: '"Emre... o bot senin mi?"',
              effect: { moral: 8, dostluk: { kim: 'emre', puan: 3 } },
              outcome:
                'Emre\'nin botu kendi dolabında, Tolga\'nınki Emre\'nin ayağında. Karanlıkta yanlış postalı giymiş, bütün sabah bot aramış, el feneriyle dolapların üstüne bakmış. Bütün yemekhane güldü. Tolga en son güldü, en çok o güldü.',
            },
            {
              id: 'd11-emre-bekle',
              label: 'Sus, kendisi fark etsin',
              effect: { moral: 6, dostluk: { kim: 'tolga', puan: 2 } },
              outcome:
                'Emre üç dakika boyunca ayağına baktı. Sonra kalktı, Tolga\'nın önünde durdu, botlarını çıkardı ve tepsinin yanına koydu. "Kardeşim. Bunu kimseye anlatma." Bütün yemekhane zaten duymuştu.',
            },
          ],
        },
      ],
    },
    {
      id: 'd11-talim',
      from: '13:30',
      to: '16:30',
      title: 'Talim',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bot bulundu. Bulan kim, kaybeden kim, giyen kim: ilgilenmiyorum. Ama gece nöbetinden dönen, postalını ışığa tutarak giyecek. Hepiniz. Tekrar edin.',
        },
        {
          kind: 'anlati',
          id: 'd11-t2',
          text: 'Öğleden sonra talim sessiz geçti ama herkesin dudağının kenarında aynı şey vardı. Arada bir biri gülmemek için öksürüyordu; Çavuş öksürenleri saydı, cezaya yazmadı.',
        },
      ],
    },
    {
      id: 'd11-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün bir koğuş bir botu aradı. Yarın aynı koğuş bir askeri arasa aynı hızla bulur mu, onu merak ediyorum. Bulur. Dağılın.',
        },
      ],
    },
    {
      id: 'd11-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-ay1',
          sprite: 'tepsi',
          text: 'Emre bot hikâyesini akşam yemeğinde kendi anlatıyor. Her anlatışta el feneri biraz daha büyüyor, dolaplar biraz daha yükseliyor. Tolga düzeltmiyor, gülüyor.',
        },
      ],
    },
    {
      id: 'd11-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-s1',
          text: 'Ankesör kuyruğunda bile bot konuşuluyor. On bir gündür ilk defa telefonda anlatılacak komik bir şey var. Sen de anlatabilirsin.',
        },
      ],
    },
    {
      id: 'd11-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd11-sy1',
          sprite: 'ay',
          text: 'On bir gün bitti, on yedi kaldı. Işıklar söndü; karanlıkta biri "botum yok" diye fısıldadı ve bütün koğuş yastığına güldü. Emre en yüksek sesle.',
        },
      ],
    },
  ],
};
