import type { Day } from '../engine/types';

export const gun04: Day = {
  day: 4,
  title: 'Denetim',
  epigraph: 'Bugün bölük tek kişi gibi ya kazanır ya kaybeder.',
  blocks: [
    {
      id: 'd4-kalkis',
      from: '06:00',
      to: '06:30',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-k1',
          sprite: 'duduk',
          speaker: 'Onbaşı Recep',
          text: 'Bugün düdük yok. Onbaşı koğuşa sessizce girdi ve ışığı açtı. "Denetim 09:00’da. Yataklar bugün mükemmel olacak. Mükemmelin altı yok."'
        },
        {
          kind: 'mini',
          id: 'd4-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Denetim yatağı. Hiza payı yok, çubuk hızlı ve dar.',
          reward: (s) => ({ disiplin: Math.round(-8 + s * 22), moral: Math.round(-4 + s * 8) }),
          verdict: (s) =>
            s > 0.85
              ? 'Battaniyenin kenarı jilet gibi. Bu yatak denetimden geçer.'
              : s > 0.55
                ? 'İyi ama denetim iyiyi değil kusursuzu arıyor.'
                : 'Bu yatak denetimde bütün bölüğü yakar. Onbaşı yüzüne baktı, hiçbir şey demedi. Daha kötü.'
        },
      ]
    },
    {
      id: 'd4-ictima',
      from: '06:30',
      to: '07:00',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'mini',
          id: 'd4-i1',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Denetim sabahı. Komutlar hızlı, aralar kısa. Erken davranma.',
          reward: (s) => ({ disiplin: Math.round(-8 + s * 20), enerji: -5, moral: Math.round(-3 + s * 6) }),
          verdict: (s) =>
            s > 0.85
              ? 'Çavuş bölüğün önünde durdu: "Bugün böyle devam ederse akşam izin var."'
              : s > 0.5
                ? 'Fena değil. Çavuş bir şey demedi ama yüzü gevşemedi.'
                : 'Denetim sabahı hiza bozdun. Çavuş isim yazdı.'
        },
      ]
    },
    {
      id: 'd4-denetim',
      from: '07:00',
      to: '07:30',
      title: 'Denetim Hazırlığı',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-d1',
          sprite: 'postal',
          text: 'Mıntıka bugün koğuşun içinde. Yirmi sekiz dolap, yirmi sekiz yatak, elli altı postal. Bir kişi batırırsa hepiniz batıyorsunuz. Tolga’nın dolabı hâlâ dağınık ve Tolga ortalıkta yok.',
          choices: [
            {
              id: 'd4-tolga-topla',
              label: 'Tolga’nın dolabını sen topla',
              effect: { disiplin: 6, moral: 8, enerji: -12, kondisyon: -3 },
              outcome: 'Bitirdin. Tolga revirden döndüğünde dolabını görünce durdu, sonra sana baktı. Dün olanlar kapandı.'
            },
            {
              id: 'd4-tolga-soyle',
              label: 'Onbaşı’ya söyle, senin sorumluluğun değil',
              effect: { disiplin: 4, moral: -8 },
              outcome: 'Onbaşı dolabı kendi topladı ve bütün koğuşa bunu kimin haber verdiğini söyledi.'
            },
            {
              id: 'd4-tolga-hepbirlikte',
              label: 'Koğuşu topla, beraber halledin',
              effect: { disiplin: 8, moral: 14, enerji: -16, kondisyon: -4 },
              outcome: 'Altı kişi, dört dakika. Koğuş bugün ilk defa bölük gibi davrandı.'
            },
          ]
        },
      ]
    },
    {
      id: 'd4-kahvalti',
      from: '07:30',
      to: '08:30',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-ka1',
          sprite: 'tepsi',
          text: 'Kimse konuşmuyor. Herkesin aklı 09:00’da. Emre çayına şeker atarken elleri titriyor: "Ben sivilde otuz kişiye iş veriyorum. Burada bir battaniyeden korkuyorum."'
        },
      ]
    },
    {
      id: 'd4-egitim-sabah',
      from: '08:30',
      to: '12:00',
      title: 'Denetim ve Eğitim',
      sprite: 'cavus',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-es1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Denetim başladı. Yüzbaşı koğuşa girdi. Herkes ranzasının başında, hazır olda. Yüzbaşı hiçbir şey söylemeden yürüyor ve her yatağa iki saniye bakıyor.'
        },
        {
          kind: 'dolapDenetimi',
          id: 'd4-es-dolap',
          sprite: 'postal',
          brief: 'Yüzbaşı senin ranzanın önünde durdu. "Dolap." Kapağı açtın ve geri çekildin. İlk gün nasıl yerleştirdiysen öyle duruyor.',
        },
        {
          kind: 'mini',
          id: 'd4-es2',
          game: 'yurumek',
          sprite: 'postal',
          brief: 'Denetim geçti, eğitim başladı. Bugünkü tempo en zoru.',
          reward: (s) => ({
            kondisyon: Math.round(-5 + s * 16),
            disiplin: Math.round(-4 + s * 14),
            enerji: -22
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Üç gün önce bunu yapamıyordun. Bugün düşünmeden yaptın.'
              : s > 0.5
                ? 'Ayakların öğrendi, kafan hâlâ sayıyor.'
                : 'Bacakların bugün seni taşımadı. Bölüğün gerisinde kaldın.'
        },
      ]
    },
    {
      id: 'd4-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-o1',
          sprite: 'tepsi',
          text: 'Denetim sonucu öğlen açıklandı. Bölük geçti. Yemekhanede ilk defa gürültü var.',
          choices: [
            {
              id: 'd4-ogle-dinlen',
              label: 'Otuz dakika uzan',
              effect: { enerji: 22, kondisyon: 6, moral: 4 },
              outcome: 'Öğleden sonra silah eğitimi var ve dinlenmiş gitmek doğru karardı.'
            },
            {
              id: 'd4-ogle-calis',
              label: 'Dünkü silah dersini tekrar et',
              effect: { disiplin: 10, enerji: -6, moral: -2 },
              outcome: 'Parçaların adlarını kafanda sıraladın: mekanizma, yay, namlu, kabza. Birazdan işine yarayacak.'
            },
          ]
        },
      ]
    },
    {
      id: 'd4-talim',
      from: '13:30',
      to: '16:30',
      title: 'Silah Eğitimi',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-t1',
          sprite: 'tufek',
          speaker: 'Onbaşı Recep',
          text: 'Sökeceksiniz, takacaksınız. Sıra önemli. Yanlış sırayla zorlarsanız parça kırılır ve kırılan parçanın bedeli sizden çıkar. Bakın, bir kere gösteriyorum.'
        },
        {
          kind: 'mini',
          id: 'd4-t2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Parçaları doğru sırayla seç. Yanlış seçim seni başa döndürmez ama puanını götürür.',
          reward: (s) => ({
            disiplin: Math.round(-6 + s * 20),
            moral: Math.round(-4 + s * 12),
            enerji: -10
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Onbaşı arkanda durdu, izledi, bir şey demedi ve gitti. Bu bir onaydır.'
              : s > 0.5
                ? 'İki kere duraksadın. Süre tuttu, sıra doğruydu.'
                : 'Yayı ters taktın. Onbaşı senin adını defterine yazdı, bu sefer iyi anlamda değil.'
        },
      ]
    },
    {
      id: 'd4-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bölük denetimden geçti. Hafta sonu izni duruyor. Bu akşam nöbet listesi çıktı ve bu gece ilk nöbetiniz var. 02:00–04:00.',
          choices: [
            {
              id: 'd4-nobet-kabul',
              label: 'Kabul et, listeye bak',
              effect: { disiplin: 6, moral: -4 },
              outcome: 'Adın 02:00’de. Gecenin en kötü saati ve herkes bunu biliyor.'
            },
            {
              id: 'd4-nobet-takas',
              label: 'Serkan ile saat takası yap',
              effect: { disiplin: -4, moral: 6, para: -80, enerji: 6 },
              outcome: 'Serkan 02:00’yi aldı, sen 22:00’yi. Bu adam gerçekten bir ekonomi kurmuş.'
            },
          ]
        },
      ]
    },
    {
      id: 'd4-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-ay1',
          sprite: 'tepsi',
          text: 'Etli nohut. Emre zeytin saymayı bıraktığını söyledi: "Üç gün oldu. Artık gün saymıyorum, sadece yemek sayıyorum. Daha az acıtıyor."'
        },
      ]
    },
    {
      id: 'd4-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-s1',
          text: 'Üç gün bitiyor. Yirmi beş gün duruyor. Koğuşta ilk defa gerçek bir rahatlama var — denetim geçti, izin duruyor.'
        },
      ]
    },
    {
      id: 'd4-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd4-sy1',
          sprite: 'ay',
          text: 'Yoklama bitti. Yarın dördüncü gün. Ranzana uzandın ve fark ettin: bu sabah düdükten önce uyanmışsın. Vücudun buraya alışmaya başlıyor.'
        },
      ]
    },
  ]
};
