import type { Day } from '../engine/types';

/**
 * 26. gün — İKİ GÜN. Genel prova: tören kıyafetiyle, boş tribünün önünde.
 * Yemin töreni son gün (28); gerçekte tören biter, aile tribünden iner ve
 * asker onlarla kışladan çıkar. Bugün kapı listesinde son değişiklik,
 * öğleden sonra silahların son sökümü ve teslimi, akşam teslim listesi:
 * dolap yarın boşalmaya başlıyor.
 */
export const gun26: Day = {
  day: 26,
  title: 'İki Gün',
  epigraph: 'Boş sandalyelerin önünde, iki gün sonra dolu olacakmış gibi.',
  blocks: [
    {
      id: 'd26-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-k1',
          sprite: 'duduk',
          text: 'Yirmi altıncı sabah. Kapıdaki tebeşirde "2". Düdükten önce koğuşun yarısı uyanıktı; kimse konuşmuyor, herkes aynı hesabı yapıyor: iki sabah daha, sonra tribün.',
        },
        {
          kind: 'mini',
          id: 'd26-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Genel prova sabahı. Yatağı bugün kimse denetlemeyecek; yine de topluyorsun.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 11), moral: Math.round(-1 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Kimse bakmayacaktı. Kusursuz yaptın, çünkü artık başka türlü yapamıyorsun.'
              : s > 0.55
                ? 'Toplandı. Aklın provada.'
                : 'Köşe kalkık kaldı. Bugün kimse fark etmez; sen fark ettin.',
        },
        {
          kind: 'anlati',
          id: 'd26-k3',
          sprite: 'uniformaKatli',
          speaker: 'Onbaşı Recep',
          text: 'Tören üniforması dolabın üst rafında. Bugün prova onunla; ütü izi tek, kırışık yok, düğme eksik yok. İki gün sonra aileniz sizi ilk defa üniformayla görecek. Provada ne giyerseniz törende de o.',
          choices: [
            {
              id: 'd26-utu',
              label: 'Pantolonun çizgisini bir daha ütüle',
              effect: { disiplin: 5, enerji: -3 },
              outcome: 'Koğuşta tek ütü var ve önünde altı kişi bekliyor. Sıran geldiğinde çizgi zaten düzdü. Yine de ütüledin.',
            },
            {
              id: 'd26-emre-dugme',
              label: 'Emre\'nin kopan düğmesini dik',
              effect: { disiplin: 1, moral: 4, dostluk: { kim: 'emre', puan: 5 } },
              outcome: 'İğne iplik tıraş çantasının dibindeydi. Emre ceketini tutarken hiç konuşmadı, bu onun için bir rekor. "Karım bu düğmeye bakacak," dedi sonunda.',
            },
          ],
        },
      ],
    },
    {
      id: 'd26-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün genel prova, tören kıyafetiyle. Sandalyeler dizildi, tribün boş. Sıra, selam, yemin; iki gün sonra aynısı, aileleriniz önünde. Provada hata yapan törende de yapar, yalnızca bu sefer tribün duyar.',
        },
        {
          kind: 'mini',
          id: 'd26-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. İsimler bugün tören listesindeki sırayla okunuyor.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Tek seferde. Sesin tören listesine yakışır çıktı.'
              : s > 0.5
                ? 'Normal. Tören sesini saklıyorsun.'
                : 'Geç kaldın. "Törende de mi?" dedi Çavuş. Cevap vermedin.',
        },
      ],
    },
    {
      id: 'd26-kahvalti',
      from: '06:30',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-ka1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: '"İki gün. Kırk sekiz saat eksi uyku, yani otuz iki." Serkan defteri kapalı olsa da hesabı bırakmamıştı. "Dört tepsi, bir prova, bir son gece, bir tören. Bir de kapı." Parmaklarını saydı, sonra saymayı bıraktı.',
          choices: [
            {
              id: 'd26-serkan-gul',
              label: '"Kapıyı hesaba katma, o sayılmaz"',
              effect: { moral: 3, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: '"En çok o sayılır," dedi Serkan. "Ama haklısın, deftere yazılmaz." Çayını sana doğru kaydırdı; kendi bardağı doluydu.',
            },
            {
              id: 'd26-serkan-sus',
              label: 'Çayını iç, tepsiye bak',
              effect: { enerji: 3 },
              outcome: 'Hesap onun işi. Şu an sadece çay var, sıcak. Bunu da biriktirdin.',
            },
          ],
        },
      ],
    },
    {
      id: 'd26-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Genel Prova',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-e1',
          sprite: 'bayrak',
          text: 'Tören alanı. Bayrak direğinin iki yanında hoparlör, karşıda sandalye sıraları. Hepsi boş; yalnızca ön sırada bir er oturuyor, "aile" rolünde, elinde bir kâğıt, üzerinde "TRİBÜN" yazıyor. Kimse gülmedi. Kuralı iki gün sonra kimin bozacağını herkes biliyor: kendi annesi.',
        },
        {
          kind: 'mini',
          id: 'd26-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Tören geçişi, tribünün önünden. Tempo yavaş, her adım ağır; hızlanan tek kalır.',
          reward: (s) => ({
            kondisyon: Math.round(-2 + s * 6),
            disiplin: Math.round(-4 + s * 11),
            enerji: -12,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Tek bir vuruş gibi geçtiniz. "TRİBÜN" yazılı kâğıdı tutan er bile başını çevirdi.'
              : s > 0.5
                ? 'Bir iki adımda senin topuğun ayrı duyuldu. Az ama duyuldu.'
                : 'Senin adımın ikinci ses oldu. Baştan. Tribün boş olduğu için baştan.',
        },
        {
          kind: 'anlati',
          id: 'd26-e3',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yemin satırları, son kez provada. Ben okurum, bitirdiğim anda siz. Sağ el sol göğüste; kol düşerse göğüs de düşer. Kapı listesinde son değişiklik bugün öğlene kadar. Gelmeyecek diye yazdırdığınız biri gelecekse, kapıda bekletmeyin.',
          choices: [
            {
              id: 'd26-liste-ekle',
              label: 'Kapı listesine bir isim daha ekle',
              effect: { moral: 3, disiplin: -1 },
              outcome: 'Molada bölük yazıcısının masasına gittin. Listenin altına bir satır. Yazıcı başını kaldırmadan "son değişiklik bu" dedi. Son değişiklik buydu.',
            },
            {
              id: 'd26-liste-tamam',
              label: 'Liste tamam, satırları tekrarla',
              effect: { disiplin: 3 },
              outcome: 'Beş satır, bir kez daha, dudaklarını oynatmadan. Son satırda "and içerim" derken sesin çıktı; yanındaki de öyle.',
            },
          ],
        },
      ],
    },
    {
      id: 'd26-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-o1',
          sprite: 'yemekhaneMasa',
          text: 'Yemekhanede tören kıyafetleri askıda, herkes fanilayla yiyor; kimse çorbayı ceketine dökmek istemiyor. Masada konu iki gün sonrası: kim gelecek, kaçta yola çıkacaklar, otoparkta yer bulabilecekler mi.',
        },
      ],
    },
    {
      id: 'd26-talim',
      from: '13:30',
      to: '16:30',
      title: 'Teçhizat Sayımı',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-ta1',
          sprite: 'tufek',
          speaker: 'Onbaşı Recep',
          text: 'Silahlar temizlenip depoya. Namlu ağzından içeri bakacağım; tek bir toz tanesi görürsem o tüfek sizinle terhis olur, sonra geri gelir, siz de onunla gelirsiniz.',
        },
        {
          kind: 'mini',
          id: 'd26-ta2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Son sökme. Parçaları bir kez daha sırayla, bu sefer teslim için.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 12), moral: Math.round(-1 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Gözün kapalı yapardın. Onbaşı namluya baktı, tüfeği rafa koydu.'
              : s > 0.5
                ? 'Bir parçada durdun, hatırladın. Teslim edildi.'
                : 'Yay yere düştü. Onbaşı aldı, sana uzatmadı, kendisi taktı.',
        },
      ],
    },
    {
      id: 'd26-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-ai1',
          sprite: 'defter',
          speaker: 'Çavuş Kaya',
          text: 'Teslim listesi. Battaniye iki, çarşaf iki, yastık kılıfı bir, üniforma takımı, postal, matara, künye. Yarın yedekler ve teçhizat, öbür sabah üstünüzdekiler. Eksik olan terhis belgesini alamaz. Künye en son, törenden sonra; bu kışlada adınızla birlikte en son o çıkar.',
          choices: [
            {
              id: 'd26-liste-yaz',
              label: 'Listeyi deftere geçir',
              effect: { disiplin: 4 },
              outcome: 'Defterin son sayfası. İlk sayfada çarşıdan alınacaklar yazıyordu. Aradaki sayfalar yirmi altı gündü.',
            },
            {
              id: 'd26-liste-akil',
              label: 'Akılda tutarsın',
              effect: { moral: 1, disiplin: -2 },
              outcome: 'Battaniye iki, çarşaf iki... Matara. Mataran nerede? Yarın bulursun.',
            },
          ],
        },
      ],
    },
    {
      id: 'd26-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-ay1',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Karım yemine geliyor," dedi Emre, tabağını itip. "Çocukları da getiriyor. Yirmi sekiz gün beni telefonda dinlediler; şimdi görecekler." Sonra düğmesine baktı, dikili olana. Masada kimse gülmedi; bu defa gülünecek bir şey anlatmıyordu.',
        },
      ],
    },
    {
      id: 'd26-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-s1',
          text: 'Ankesörün önünde herkes evine aynı şeyi söylüyor: saat onda tören, kapı dokuzda, erken gelin, otopark küçük. Bir kişi ahizeye "üniformayla göreceksin beni" dedi ve sesini alçalttı, arkadaki duymasın diye. Arkadaki duydu.',
        },
      ],
    },
    {
      id: 'd26-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-sy1',
          sprite: 'ay',
          text: 'Yirmi altı gün bitti, iki kaldı. Işıklar söndü. Koğuşta biri karanlıkta yemini baştan fısıldadı, kelimesi kelimesine. Kimse susturmadı. Son satırda birkaç ses daha katıldı; prova, törenden önceki son.',
        },
      ],
    },
  ],
};
