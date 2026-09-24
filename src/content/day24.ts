import type { Day } from '../engine/types';

/**
 * 24. gün — EVRAK. Terhis işlemleri başlıyor. Günün olayı bölük yazıcısının
 * önündeki kuyruk: eksik belge, yanlış yazılmış künye numarası, cüzdan
 * kontrolü. Mini oyun değil, sırayla gelen küçük kararlar; kışlada kâğıt
 * işi de bir tür talim. Telefonda baba çıkış saatini soruyor (g24).
 */
export const gun24: Day = {
  day: 24,
  title: 'Evrak',
  epigraph: 'Buraya bir kâğıtla girdin, bir kâğıtla çıkacaksın.',
  blocks: [
    {
      id: 'd24-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-k1',
          sprite: 'duduk',
          text: 'Yirmi dördüncü sabah. Kapıda "4". Koridordaki panoya yeni bir liste asılmış: "Terhis evrakı — sıra ile." Adın on yedinci satırda.',
        },
        {
          kind: 'mini',
          id: 'd24-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Dört yatak kaldı. Listeyi okumak için erken bitir.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Düdükle birlikte bitti. Panonun önünde ilk sen vardın.'
              : s > 0.55
                ? 'Toplandı. Panonun önünde kalabalık vardı ama adını buldun.'
                : 'Köşe kalkık kaldı. Listeye koşarken dönüp düzelttin, yine de kalkıktı.',
        },
      ],
    },
    {
      id: 'd24-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün öğleden sonra evrak. Kimliğiniz, askerlik cüzdanınız, künyeniz yanınızda olacak. Eksik belgeyle gelen sıranın sonuna gider. Sıranın sonu bugün bitmeyebilir.',
        },
        {
          kind: 'mini',
          id: 'd24-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Herkes cebini yokluyor; cüzdan orada mı.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Temiz. Elin cebine gitmeden cevap verdin.'
              : s > 0.5
                ? 'Olur. Cevap verirken bir elin cebindeydi.'
                : 'Adın okunduğunda cüzdanı arıyordun. Çavuş iki kere okudu.',
        },
      ],
    },
    {
      id: 'd24-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-m1',
          sprite: 'postal',
          text: 'Mıntıkada kimse izmarit konuşmuyor; herkes belge konuşuyor. Birinin kimliği sevk gününden beri dolabın arkasına düşmüş. Birinin cüzdanı ıslanmış, mührü okunmuyor.',
        },
      ],
    },
    {
      id: 'd24-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-ka1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: '"Sıra listesi alfabetik değil," dedi Serkan. "Kayıt sırası. Ben dördüncüyüm, sen on yedinci. On üç kişi fark, her biri beş dakika: bir saatten fazla." Durdu. "Yerini değiştirmek istersen konuşabiliriz."',
          choices: [
            {
              id: 'd24-sira-al',
              label: 'Serkan\'ın yerini satın al',
              effect: { para: -25, enerji: 3, disiplin: -2, dostluk: { kim: 'serkan', puan: 2 } },
              outcome: 'Yirmi beş lira. Serkan defteri açmadı. "Defter kapalı," dedi, "bu defter dışı. Son işlem." Dördüncü sen oldun.',
            },
            {
              id: 'd24-sira-kal',
              label: 'Sıranda bekle',
              effect: { disiplin: 2 },
              outcome: '"Doğru," dedi Serkan. "Bekleyen adamın evrakı eksik çıkmaz. Acele eden unutur." Bunu bir sonraki müşteriye de söyleyecek.',
            },
          ],
        },
      ],
    },
    {
      id: 'd24-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Tören Provası',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-e1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Aklınız öğleden sonrada, biliyorum. Öğleden sonrası gelmeden bu tören yürüyecek. Kâğıt sizi evden çıkarır, tören sizi buradan çıkarır.',
        },
        {
          kind: 'mini',
          id: 'd24-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Tören geçişi, iki tekrar. Düdük tempo veriyor.',
          reward: (s) => ({
            kondisyon: Math.round(-2 + s * 7),
            disiplin: Math.round(-3 + s * 8),
            enerji: -11,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'İki geçiş, tek bir ritim. Çavuş düdüğü indirdi, bir şey demedi.'
              : s > 0.5
                ? 'İkinci geçişte biraz toparlandınız.'
                : 'Aklın kuyruktaydı, ayakların da oraya gitti. Tempodan iki kere düştün.',
        },
      ],
    },
    {
      id: 'd24-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-o1',
          sprite: 'askerEmre',
          text: 'Emre cüzdanını yemek boyunca üç kere açıp kapattı. "Mühür yerinde mi? Yerinde. Fotoğraf? Yerinde." Dördüncüde Tolga elini cüzdanın üstüne koydu ve Emre yemeğini bitirdi.',
        },
      ],
    },
    {
      id: 'd24-talim',
      from: '13:30',
      to: '16:30',
      title: 'Terhis Evrakı',
      sprite: 'defter',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-t1',
          sprite: 'defter',
          text: 'Bölük yazıcısının odası. Masada iki mühür, bir damga ıstampası, bir yığın dosya. Kapının önünde kuyruk koridora taşmış. Yazıcı başını kaldırmadan konuşuyor: "Sıradaki."',
        },
        {
          kind: 'anlati',
          id: 'd24-t2',
          sprite: 'cuzdan',
          speaker: 'Bölük yazıcısı',
          text: '"Askerlik cüzdanı." Elini uzattı, bekledi.',
          choices: [
            {
              id: 'd24-cuzdan-ver',
              label: 'Boynundaki cüzdandan çıkar',
              gerekliEsya: 'askerCuzdani',
              effect: { disiplin: 4, moral: 2 },
              outcome: 'Çarşıdan aldığın boyun cüzdanında, künyenin yanında; köşesi bile bükülmemiş. Yazıcı ilk defa başını kaldırdı: "Böyle gelen az." Mühür tek seferde oturdu.',
            },
            {
              id: 'd24-cuzdan-kimlik',
              label: 'Ceplerini yokla',
              effect: { disiplin: -3, enerji: -5 },
              outcome: 'Ceplerde yok. Koğuşa koştun, dolapta iki gömleğin arasında buldun, geri koştun. Sıra seni beklemedi; yeniden girdin.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd24-t3',
          sprite: 'kunye',
          speaker: 'Bölük yazıcısı',
          text: '"Künye numaran dosyada farklı yazılmış. Bir rakam." Kâğıdı çevirdi, gösterdi: sevk günü kim doldurduysa bir yedi ile bir biri karıştırmış. "Düzeltirim ama dilekçe lazım. Ya da böyle kalır, çıkışta sorun olmaz herhalde."',
          choices: [
            {
              id: 'd24-kunye-dilekce',
              label: 'Dilekçe yaz, düzelsin',
              effect: { disiplin: 3, enerji: -4, moral: -1 },
              outcome: 'Koridorda duvara dayayıp yazdın. "Arz ederim" kısmını Tolga yazdırdı. Yazıcı dilekçeyi dosyaya zımbaladı, zımba iki kez takıldı.',
            },
            {
              id: 'd24-kunye-birak',
              label: '"Herhalde" yeterli',
              effect: { moral: 1, disiplin: -4 },
              outcome: 'Yazıcı omuz silkti. Dosya kapandı. Yirmi dört gündür boynunda taşıdığın numara kâğıtta başka bir numara oldu.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd24-t4',
          sprite: 'defter',
          text: 'İmza. Üç yere. Yazıcı her imzanın yanına bir tarih damgası bastı; üçüncüsünde ıstampa kurumuştu, tarih soluk çıktı. "Geçerli," dedi. Soluk da olsa, o tarih senin çıkış günün.',
        },
      ],
    },
    {
      id: 'd24-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Evrakı bitmeyen üç kişi var. Adlarını okumayacağım, kendileri biliyor. Yarın sabah yazıcının önünde olacaklar. Geri kalanınız: kâğıdınız bitti diye işiniz bitmedi.',
        },
      ],
    },
    {
      id: 'd24-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-ay1',
          sprite: 'askerTolga',
          speaker: 'Tolga',
          text: '"Soluk damga geçerli mi sence?" diye sordu Tolga. Kendi kâğıdındaki tarih de soluk. Cevabı ikiniz de biliyordunuz; soru başka bir soruydu.',
          choices: [
            {
              id: 'd24-soluk-gecerli',
              label: '"Geçerli. Dört gün sonra kapıdayız"',
              effect: { moral: 3, dostluk: { kim: 'tolga', puan: 3 } },
              outcome: 'Tolga kâğıdı katlayıp göğüs cebine koydu, düğmesini ilikledi. Bir daha çıkarmadı.',
            },
            {
              id: 'd24-soluk-sus',
              label: 'Kendi kâğıdını da yanına koy',
              effect: { moral: 2, dostluk: { kim: 'tolga', puan: 2 } },
              outcome: 'İki soluk tarih yan yana. Aynı gün. Tolga "aynı otobüs" dedi, sonra düzeltti: "Aynı gün. Otobüs başka."',
            },
          ],
        },
      ],
    },
    {
      id: 'd24-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-s1',
          text: 'Avluda herkes evden soruyor aynı soruyu: kaçta çıkıyorsun? Ankesör kuyruğunda saatler dolaşıyor. On bir, dokuz, "belli değil." Ailen de soracak.',
        },
      ],
    },
    {
      id: 'd24-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd24-sy1',
          sprite: 'ay',
          text: 'Yirmi dört gün bitti, dört kaldı. Dosyan yazıcının masasında, yığının içinde bir yerde. Bu gece kışlada senin adına bir kâğıt uyuyor.',
        },
      ],
    },
  ],
};
