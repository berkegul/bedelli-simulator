import type { Day } from '../engine/types';

/**
 * 21. gün — YEDİ GÜN. Telefonda kanka yirmi bir gündür sakladığını söylüyor.
 * Kışlada yemin provası: tören adımı ve yemin metni ilk defa bir ağızdan.
 * Asıl tören 28. günde, son gün: aileler tribünde, törenden sonra beraber çıkılıyor. Serkan defterini kapatıyor.
 */
export const gun21: Day = {
  day: 21,
  title: 'Yedi Gün',
  epigraph: 'Bir hafta. Buraya geldiğin gün de bir haftayı sayamıyordun.',
  blocks: [
    {
      id: 'd21-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-k1',
          sprite: 'duduk',
          text: 'Yirmi birinci sabah. Tebeşirde "7". Biri altına küçük bir takvim çizmiş: yedi kutu, hepsi boş. Koğuşta yedi günün boş hali ilk defa göz önünde.',
        },
        {
          kind: 'mini',
          id: 'd21-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Yedi yatak kaldı. Bir haftalık yatak.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Düzgün. Bir haftalık bir iş değil artık, bir haftalık bir alışkanlık.'
              : s > 0.55
                ? 'Olur. Prova günü yatağa kimse bakmaz, bakar da.'
                : 'Aceleyle. Onbaşı "bir hafta kaldı diye mi?" dedi. Bir hafta kalmıştı, evet.',
        },
      ],
    },
    {
      id: 'd21-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün yemin provası. Öğleden sonra metni bir ağızdan okuyacaksınız. Yemin ezberden okunmaz, ağızdan okunur; ama ezberlemeyenin ağzı yanlış yerde açılır. Akşama kadar ezberlenecek.',
        },
        {
          kind: 'mini',
          id: 'd21-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Sıra bugün tören düzeninde, boy sırasına göre.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Yeni sırada yeni yerin, tek seferde.'
              : s > 0.5
                ? 'Yerini bir an aradın, buldun.'
                : 'Eski yerine gittin. Yeni yerinde biri seni bekliyordu.',
        },
      ],
    },
    {
      id: 'd21-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-m1',
          sprite: 'postal',
          text: 'Mıntıkada herkes dudaklarını kıpırdatıyor. Kimse izmarite bakmıyor; herkes yemin metninin ilk satırını süpürgeyle sayıyor.',
        },
      ],
    },
    {
      id: 'd21-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-ka1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: 'Serkan defterini masaya koydu ve açık bıraktı. "Yedi gün kaldı. Dükkân kapanıyor. Hesaplar kapanıyor." Sayfaları çevirdi, senin sayfanda durdu. Rakamlar var, üstü çizilmiş rakamlar var.',
          choices: [
            {
              id: 'd21-defter-ode',
              label: '"Ne kadar tutuyorsa öde, kapat"',
              effect: { para: -15, disiplin: 2, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: 'Serkan bir şey hesapladı, bir şey sildi. "On beş." Parayı aldı, sayfanın altına çizgi çekti. "Temiz."',
            },
            {
              id: 'd21-defter-yirt',
              label: '"O sayfayı hatıra olarak bana ver"',
              effect: { moral: 2, dostluk: { kim: 'serkan', puan: 4 } },
              outcome: 'Serkan bir an düşündü, sayfayı dikkatle kopardı, katladı, uzattı. "Borç da içinde ama. Hatıraysa hatıra." Sayfa künyenin yanına girdi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd21-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Tören Adımı',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-e1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Tören adımı. Diz bel hizasına kadar, topuk yere aynı anda. Seksen kişi tek bir ses çıkaracak. İki ses duyarsam baştan.',
        },
        {
          kind: 'mini',
          id: 'd21-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Tören adımı: tempo yavaş, her adım ağır. Hızlanan tek kalır.',
          reward: (s) => ({
            kondisyon: Math.round(-2 + s * 6),
            disiplin: Math.round(-4 + s * 10),
            enerji: -12,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Seksen topuk, bir ses. Onbaşı bir şey demedi; bu, iyi dedi demek.'
              : s > 0.5
                ? 'Arada bir senin topuğun ayrı duyuldu. Az ama duyuldu.'
                : 'Senin adımın ikinci ses oldu. Baştan. Üç kere baştan.',
        },
        {
          kind: 'anlati',
          id: 'd21-e3',
          sprite: 'askerEmre',
          text: 'Molada Emre bacağını ovuyor: "Otuz dört yaşında tören adımı. Şantiyedeki çocuklar görse ne derler." Sonra düşündü: "Görsünler aslında. Yemine çağıracağım hepsini."',
        },
      ],
    },
    {
      id: 'd21-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-o1',
          sprite: 'yemekhaneMasa',
          text: 'Masada biri yemin metninin kâğıdını tuzluğun altına sıkıştırmış. Herkes yemek yerken bir satır okuyor, tuzluk elden ele geçtikçe kâğıt da geçiyor.',
          choices: [
            {
              id: 'd21-o-ezber',
              label: 'Yemeği bırak, metni ezberle',
              effect: { disiplin: 4, enerji: -3 },
              outcome: 'Beş satır. Dördüncüde takıldın, sonra takıldığın yeri de ezberledin.',
            },
            {
              id: 'd21-o-ye',
              label: 'Önce ye, metin akşama',
              effect: { enerji: 3, disiplin: -1 },
              outcome: 'Yedin. Metin tuzlukla birlikte masanın öbür ucuna gitti ve bir daha gelmedi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd21-talim',
      from: '13:30',
      to: '16:30',
      title: 'Yemin Provası',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Ben bir satır okuyacağım, siz bitirdiğim anda tekrar edeceksiniz. Benden önce başlayan tek başına bağırır. Benden sonra yetişen sırayı yarım bırakır. Tribünde anneniz oturacak; tek başına bağıran oğlunu herkes duyar.',
        },
        {
          kind: 'anlati',
          id: 'd21-t2',
          text: 'Üçüncü satırda ses bir an çatallandı: yarısı "kanunlarına", yarısı bir sonraki satır. Çavuş durdu. Bölük sustu. Senin ağzın hangi kelimede kalmıştı?',
          choices: [
            {
              id: 'd21-prova-dogru',
              label: 'Doğru satırdaydın, sesini yükselt',
              effect: { disiplin: 6, moral: 2 },
              outcome: 'Çavuş satırı yeniden okudu. Bu sefer ses tekti ve senin sesin içindeydi. Tribün boştu ama sesin oraya kadar gitti.',
            },
            {
              id: 'd21-prova-kipirdat',
              label: 'Emin değilsin, dudaklarını kıpırdat',
              effect: { disiplin: -3, moral: -2 },
              outcome: 'Kıpırdattın. Çavuş sıraları dolaşırken senin önünde durdu. "Ağzı açık, sesi yok. Tören günü annen de böyle mi duyacak?"',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd21-t3',
          sprite: 'askerTolga',
          text: 'Prova bitince Tolga metnin kâğıdını katlayıp cebine koydu, sekizinci günkü zarfın yanına. İki kâğıt aynı cepte; hangisini daha çok okuduğunu kimse bilmiyor.',
        },
      ],
    },
    {
      id: 'd21-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yemin töreni 28\'inde, son gün, saat onda. Aileler dokuzda kapıda olur. Kim gelecekse haber verin, kapı listesi yazılacak. Kimse gelmeyecekse onu da söyleyin; o da listeye yazılır.',
          choices: [
            {
              id: 'd21-liste-yaz',
              label: 'Gelecekleri yazdır',
              effect: { moral: 2 },
              outcome: 'Kâğıda isim yazdırmak, onları kapının önüne koymak gibi geldi. Bir hafta sonra orada olacaklar; tören bitince de seni oradan alacaklar.',
            },
            {
              id: 'd21-liste-bos',
              label: 'Kimseyi yazdırma, uzak yol',
              effect: { moral: -3, disiplin: 1 },
              outcome: '"Kimse," dedin. Onbaşı yazdı: "—". O çizgi listede senin adının yanında duruyor.',
            },
          ],
        },
      ],
    },
    {
      id: 'd21-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-ay1',
          sprite: 'askerEmre',
          text: 'Emre bir parmağını daha kapattı. Yedi. "Bir el ve iki parmak," dedi. "Böyle söyleyince çok kalmış gibi değil mi?" Kimse cevap vermedi; herkes kendi elini saydı.',
        },
      ],
    },
    {
      id: 'd21-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-s1',
          text: 'Avluda birileri yemin metnini birbirine okutuyor. Ankesörün önünde kuyruk; herkes evine tören saatini söylüyor. Saat onda, kapı dokuzda.',
        },
      ],
    },
    {
      id: 'd21-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd21-sy1',
          sprite: 'ay',
          text: 'Yirmi bir gün bitti, yedi kaldı. Karanlıkta biri yemin metninin ilk satırını fısıldadı. Karşı ranzadan biri ikinci satırla cevap verdi. Üçüncüye kimse devam etmedi; herkes uyudu ya da uyuyor gibi yaptı.',
        },
      ],
    },
  ],
};
