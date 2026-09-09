import type { Day } from '../engine/types';

export const gun03: Day = {
  day: 3,
  title: 'Kas Ağrısı',
  epigraph: 'Vücudun dün ne yaptığını bugün öğreniyor.',
  blocks: [
    {
      id: 'd3-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-k1',
          sprite: 'duduk',
          text: 'Düdük. Gözlerini açtın ve baldırlarındaki ağrı seni ranzaya çiviledi. Dün dört saat yürümüşsün, vücudun bunu bugün fatura ediyor.'
        },
        {
          kind: 'mini',
          id: 'd3-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Aynı iş, daha az zaman. Çubuk artık daha hızlı.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 15), moral: Math.round(-2 + s * 5) }),
          verdict: (s) =>
            s > 0.85
              ? 'İkinci gün, ilk günden hızlısın. Fark ediliyor.'
              : s > 0.55
                ? 'Yetişti. Kenarı hâlâ tam oturmuyor ama yetişti.'
                : 'Onbaşı geçerken battaniyeyi çekti. Bir daha.'
        },
      ]
    },
    {
      id: 'd3-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün hava soğuk ve sizin ısınmanız için elimde bir yöntem var. Şınav. Ama önce bakalım kaç kişi geç kalacak.'
        },
        {
          kind: 'mini',
          id: 'd3-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Komut anında dokun. Bugün komutlar arasındaki boşluk daha düzensiz.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 16), enerji: -5 }),
          verdict: (s) =>
            s > 0.85
              ? 'Bölük tek ses. Şınav yok. Herkes sana borçlu.'
              : s > 0.5
                ? 'Kısmen tuttu. Yirmi şınav, hep beraber.'
                : 'Sen erken çıktın, bölük kırk şınav yaptı. Kimse yüzüne bakmadı.'
        },
      ]
    },
    {
      id: 'd3-kahvalti',
      from: '06:30',
      to: '07:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-ka1',
          sprite: 'tepsi',
          text: 'Aynı tepsi, aynı zeytin. Emre karşına oturdu: "Ben bu zeytini sayacağım. Yirmi sekiz gün, günde altı zeytin. Yüz altmış sekiz zeytin sonra evdeyiz."'
        },
      ]
    },
    {
      id: 'd3-kogus',
      from: '07:00',
      to: '08:00',
      title: 'Koğuş Düzeni',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-ko1',
          sprite: 'postal',
          text: 'Postal boyama. Onbaşı herkesin postalını tek tek eline alıp ışığa tutuyor. "Bu postal bugün ölmüş. Diriltin."',
          choices: [
            {
              id: 'd3-boya-ozen',
              label: 'Uzun uzun boya, parlat',
              effect: { disiplin: 9, enerji: -7, moral: -2 },
              outcome: 'Postalın ayna gibi. Onbaşı hiçbir şey demedi, en iyi yorum bu.'
            },
            {
              id: 'd3-boya-hizli',
              label: 'Üstünkörü geç, kimse bakmaz',
              effect: { disiplin: -7, enerji: 2, moral: 3 },
              outcome: 'Baktı. "Bunu bir daha görürsem hafta sonu izin yok."'
            },
          ]
        },
      ]
    },
    {
      id: 'd3-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Temel Eğitim',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-es1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Bugün tempo artıyor. Dün yürüdünüz, bugün bölük halinde yürüyeceksiniz. Aradaki fark, birinizin hatası hepinizin hatası olması.'
        },
        {
          kind: 'mini',
          id: 'd3-es2',
          game: 'yurumek',
          sprite: 'postal',
          brief: 'Bölük temposu. Ritim dünkünden hızlı ve arada duraklıyor.',
          reward: (s) => ({
            kondisyon: Math.round(-4 + s * 14),
            disiplin: Math.round(-4 + s * 13),
            enerji: -20
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Yirmi sekiz çift postal aynı anda yere indi. Tüyleriniz diken diken oldu, kimse söylemedi.'
              : s > 0.5
                ? 'İki kere bozuldu, iki kere toparlandı.'
                : 'Bölük senin yüzünden üç kere baştan başladı. Öğle yemeğinden on beş dakika yediniz.'
        },
      ]
    },
    {
      id: 'd3-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-o1',
          sprite: 'tepsi',
          text: 'Tolga yemekhaneye gelmedi. Ranzasında oturuyormuş. Dün gece annesiyle konuşmuş, kız kardeşi hastanedeymiş.',
          choices: [
            {
              id: 'd3-tolga-git',
              label: 'Yemeğini al, yanına git',
              effect: { moral: 10, enerji: -6, kondisyon: -2 },
              outcome: 'Konuşmadınız. Yan yana oturdunuz. Tolga yemeği yedi.'
            },
            {
              id: 'd3-tolga-birak',
              label: 'Kendi haline bırak, herkesin günü var',
              effect: { enerji: 16, kondisyon: 5, moral: -5 },
              outcome: 'Dinlendin. Akşam Tolga’nın yüzüne bakarken içinde bir şey battı.'
            },
            {
              id: 'd3-tolga-onbasi',
              label: 'Onbaşı’ya haber ver',
              effect: { disiplin: 7, moral: -3, enerji: -2 },
              outcome: 'Onbaşı Tolga’yı revire gönderdi. Doğru işti ama Tolga bunu senin yaptığını öğrendi.'
            },
          ]
        },
      ]
    },
    {
      id: 'd3-talim',
      from: '13:30',
      to: '17:00',
      title: 'Talim',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-t1',
          sprite: 'tufek',
          speaker: 'Onbaşı Recep',
          text: 'Bugün silahı elinize alıyorsunuz. Ağırlığı dört kilo. Yere düşürürseniz, o silahı bir daha yerden ben kaldırmam, siz kaldırırsınız. Yirmi şınav çekerek.'
        },
        {
          kind: 'anlati',
          id: 'd3-t2',
          text: 'Silah beklediğinden ağır. İki saat boyunca omzunda taşıdın, nizami tutuşu öğrendin, namluyu bir kere bile kimseye çevirmedin.',
          choices: [
            {
              id: 'd3-silah-odak',
              label: 'Onbaşı’nın her sözünü dinle',
              effect: { disiplin: 11, kondisyon: -4, enerji: -14 },
              outcome: 'Yarınki sökme takma eğitiminde bu iki saat işine yarayacak.'
            },
            {
              id: 'd3-silah-dalgin',
              label: 'Kolun ağrıyor, dikkatin dağılıyor',
              effect: { disiplin: -5, kondisyon: 2, enerji: -8, moral: 2 },
              outcome: 'Yarım dinledin. Yarın bunun sınavı var ve haberin yok.'
            },
          ]
        },
      ]
    },
    {
      id: 'd3-aksam-ictima',
      from: '17:00',
      to: '18:00',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yarın bölük denetimi var. Koğuş, dolap, postal, yatak — hepsi. Bir kişi batırırsa bütün bölük hafta sonu izni kaybeder. Bunu size şimdiden söylüyorum ki gece rahat uyuyun.'
        },
      ]
    },
    {
      id: 'd3-aksam-yemek',
      from: '18:00',
      to: '19:00',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-ay1',
          sprite: 'tepsi',
          text: 'Nohut, bulgur, turşu. Serkan masaya oturdu: "Kantinde enerji içeceği var. Yarın denetim var. Anlarsın ya. Adedi elli."',
          choices: [
            {
              id: 'd3-serkan-al',
              label: 'İki tane al',
              effect: { enerji: 14, moral: 3, para: -100, kondisyon: -3 },
              outcome: 'Gece koğuş temizliğinde işe yaradı. Cüzdanında yaramadı.'
            },
            {
              id: 'd3-serkan-red',
              label: 'Reddet',
              effect: { moral: -2, disiplin: 3 },
              outcome: 'Serkan omuz silkti. "Yarın sabah aynı fiyata olmayacak ama."'
            },
          ]
        },
      ]
    },
    {
      id: 'd3-serbest',
      from: '19:00',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-s1',
          text: 'Denetim yarın. Koğuşta herkes bir şeyler ovalıyor. Sen ne yapacaksın?'
        },
      ]
    },
    {
      id: 'd3-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd3-sy1',
          sprite: 'ay',
          text: 'Işıklar söndü. Koğuşta yirmi sekiz kişinin nefesi. Birisi hâlâ postal boyuyor, karanlıkta. Yarın denetim var.'
        },
      ]
    },
  ]
};
