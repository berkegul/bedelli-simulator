import type { Day } from '../engine/types';

/**
 * 25. gün — SON SERBEST. Öğleden sonra eğitim yok: son uzun serbest zaman
 * (13:30–18:30), akşam yemeği ve yoklama geç. Sabah teslim listesi çıkıyor,
 * dolap sayılıyor (telefonda anneye "teslim listesi çıktı" denebiliyor,
 * g25). Gece son nöbet (görev takvimi).
 */
export const gun25: Day = {
  day: 25,
  title: 'Son Serbest',
  epigraph: 'Bugün kimse sana ne yapacağını söylemeyecek. Birkaç saatliğine.',
  blocks: [
    {
      id: 'd25-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-k1',
          sprite: 'duduk',
          text: 'Yirmi beşinci sabah. Kapıda "3". Rakamın altına biri küçük harflerle "pazar gibi" yazmış. Takvime göre pazar değil; panoya göre öğleden sonra eğitim yok.',
        },
        {
          kind: 'mini',
          id: 'd25-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Üç yatak kaldı. Serbest gün de yatakla başlıyor.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Kusursuz. Serbest günün yatağı da kusursuz olur; Onbaşı serbest değil.'
              : s > 0.55
                ? 'Toplandı. Aklın öğleden sonrada.'
                : 'Köşe kalkık. "Serbest akşamdan sonra," dedi Onbaşı, "sabah değil."',
        },
      ],
    },
    {
      id: 'd25-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'mini',
          id: 'd25-i1',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Sıranın her yerinde aynı yarım gülümseme.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Temiz. Gülümsemeyi sıraya bırakmadın.'
              : s > 0.5
                ? 'Olur. Çavuş bu sabah gülümsemelere dokunmadı.'
                : 'Geç kaldın. "Öğleden sonra serbest," dedi Çavuş, "şimdi değil."',
        },
      ],
    },
    {
      id: 'd25-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-m1',
          sprite: 'postal',
          text: 'Mıntıkada Onbaşı yeni gelecek bölüğü anlattı: "Siz çıktıktan iki gün sonra otobüsler giriyor. Bu köşeyi onlar süpürecek." Süpürgeye baktın. Sapında senin elinin yerini bulmuş bir aşınma var.',
        },
      ],
    },
    {
      id: 'd25-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-ka1',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Öğleden sonra ne yapacağız?" dedi Emre. Masada kimsenin planı yok. Yirmi dört gündür her saatin planı vardı; planı olmayan beş saat ürkütücü.',
          choices: [
            {
              id: 'd25-plan-uyu',
              label: '"Uyuyacağım. Beş saat."',
              effect: { moral: 1, enerji: 2 },
              outcome: 'Emre güldü. "Uyuyamazsın," dedi. "Vücudun izin vermez." Haklı olabilir; yirmi dört gündür kimse gündüz uyumadı.',
            },
            {
              id: 'd25-plan-bank',
              label: '"Bankta oturalım. Hepimiz."',
              effect: { moral: 3, dostluk: { kim: 'emre', puan: 2 } },
              outcome: '"Tamam," dedi Emre, çok hızlı. Bunu bekliyormuş. Tolga başını salladı. Serkan "bank dört kişilik değil" dedi ve geleceğini de söylemiş oldu.',
            },
          ],
        },
      ],
    },
    {
      id: 'd25-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Teslim Listesi',
      sprite: 'dolapSirasi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-e1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Teslim listesi. Size ne verildiyse o geri gelecek: üniforma iki takım, postal bir çift, battaniye iki, çarşaf iki, matara, kemer, bere. Eksik olan yazılır. Yazılan ödenir.',
        },
        {
          kind: 'anlati',
          id: 'd25-e2',
          sprite: 'dolapSirasi',
          text: 'Dolabı açıp saydın. Her şey var; yalnız bir çarşafın köşesinde yirmi beş günde oluşmuş bir yırtık. Onbaşı listeyle dolap dolap geziyor, iki dolap ötede.',
          choices: [
            {
              id: 'd25-yirtik-soyle',
              label: 'Onbaşı gelince yırtığı göster',
              effect: { disiplin: 3, para: -15 },
              outcome: '"Yazıyorum," dedi Onbaşı. Listeye bir satır: çarşaf, yırtık, on beş lira. "Söylediğin için yarısı." Yarısının neyin yarısı olduğunu sormadın.',
            },
            {
              id: 'd25-yirtik-katla',
              label: 'Yırtık içe gelecek şekilde katla',
              effect: { disiplin: -3, moral: 1 },
              outcome: 'Onbaşı yığına baktı, saydı, geçti. Çarşafı açmadı. Yeni gelen biri açacak.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd25-e3',
          sprite: 'uniformaKatli',
          text: 'Öğleye kadar dolaplar boşalıp yeniden doldu: teslim edilecekler üst rafa, senin olanlar alt rafa. Alt raf daha az yer tutuyor. Yirmi beş gün önce getirdiğin her şey bir torbaya sığacak.',
        },
      ],
    },
    {
      id: 'd25-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-o1',
          sprite: 'askerSerkan',
          text: 'Serkan defterin son sayfasını yırttı ve sana uzattı. Üstünde bir telefon numarası, altında "sivilde iş lazım olursa". Defterin geri kalanı çantasına girdi. "Onu kimse görmeyecek," dedi. "Kışlada kalır, kışla gibi."',
          choices: [
            {
              id: 'd25-serkan-al',
              label: 'Kâğıdı cüzdanına koy',
              effect: { moral: 3, dostluk: { kim: 'serkan', puan: 4 } },
              outcome: 'Serkan kâğıdın nereye gittiğini izledi, başını salladı. Sanki bir yatırımın doğru hesaba geçtiğini görmüş gibi.',
            },
            {
              id: 'd25-serkan-numara',
              label: 'Kendi numaranı da yaz, ver',
              effect: { moral: 2, dostluk: { kim: 'serkan', puan: 5 } },
              outcome: 'Serkan senin numaranı defterin iç kapağına yazdı; defterin kimsenin görmeyeceği tek sayfası. "Faizsiz," dedi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd25-serbest',
      from: '13:30',
      to: '18:30',
      title: 'Son Serbest',
      sprite: 'bank',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-s1',
          sprite: 'bank',
          text: 'Beş saat. Avlu hiç bu kadar kalabalık ve bu kadar sessiz olmamıştı. Biri güneşte uzanmış, biri dolabın önünde postalını son kez boyuyor, biri ankesör kuyruğunda iki kez sıraya girmiş.',
        },
        {
          kind: 'anlati',
          id: 'd25-s2',
          sprite: 'oturanTolga',
          text: 'Bankın bir ucunda Tolga, öbür ucunda Emre. Serkan ayakta, "dört kişilik değil" diye. Yer yok ama Tolga kaydı, bir kişilik yer açtı. Dizinin üstünde kızının çizdiği takvim: yirmi beş kutu karalanmış, üçü boş.',
          choices: [
            {
              id: 'd25-bank-otur',
              label: 'Otur, bir şey söyleme',
              effect: { moral: 5, enerji: 3 },
              outcome: 'Kimse bir şey söylemedi. Bir saat geçti. Sonra Emre bir şey söyledi ve herkes güldü; ne dediğini sonradan kimse hatırlamadı.',
            },
            {
              id: 'd25-bank-soru',
              label: '"İlk gün ne düşünmüştünüz?"',
              effect: { moral: 4, dostluk: { kim: 'tolga', puan: 2 } },
              outcome: 'Emre battaniyeyi anlattı, Serkan kantin fiyatlarını. Tolga sustu, sonra "kimseyle konuşmayacağımı" dedi. Sonra yine sustu, ama bu sefer bankta.',
            },
          ],
        },
      ],
    },
    {
      id: 'd25-aksam-ictima',
      from: '18:30',
      to: '19:00',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Serbest bitti. Bu gece son nöbet listesi. 02:00–04:00: adın. Bu bölüğün tuttuğu son nöbet, sonra kulübe yeni gelenlerin. Temiz teslim edin.',
        },
      ],
    },
    {
      id: 'd25-aksam-yemek',
      from: '19:00',
      to: '20:00',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-ay1',
          sprite: 'askerSerkan',
          text: 'Serkan termosu önüne koydu. Bu sefer defter yok, fiyat yok, espri yok. "Son nöbet," dedi. O kadar.',
        },
      ],
    },
    {
      id: 'd25-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd25-sy1',
          sprite: 'ay',
          text: 'Yirmi beş gün bitti, üç kaldı. 01:45\'te omzuna dokunan eli bekledin ve geldi. Son kez parolayı ezberledin; yarın akşam bu parolanın bir anlamı kalmayacak.',
        },
      ],
    },
  ],
};
