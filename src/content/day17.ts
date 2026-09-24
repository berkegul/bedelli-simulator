import type { Day } from '../engine/types';

/**
 * 17. gün — KOLİ. Anneden gelen koli akşam içtimasında dağıtılıyor. İçi anne
 * ilişkisine göre değişiyor; eşikler telefon g17 ile aynı (75 ve üstü mektup
 * ve kurabiye, 45–74 özenli ama sıradan, altı sade). Telefonda dün ayağını
 * anlattıysan sabah hâlâ orada (hasta_oldu); kolinin yolda olduğunu önceden
 * duyduysan bütün gün onu bekliyorsun (koli_yolda).
 */
export const gun17: Day = {
  day: 17,
  title: 'Koli',
  epigraph: 'Bugün bir kutu gelecek ve içinde on yedi gün olacak.',
  blocks: [
    {
      id: 'd17-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-k1',
          sprite: 'duduk',
          text: 'On yedinci sabah. Düdük çaldı, koğuş kalktı. Kimse söylenmedi; söylenmek de bir enerji ve artık kimsenin fazla enerjisi yok.',
        },
        {
          kind: 'anlati',
          id: 'd17-k-ayak',
          sprite: 'postal',
          kosul: { isaret: 'hasta_oldu', isaretDeger: 'ayak' },
          text: 'Dün akşam telefonda ayağını anlatmıştın. Çorabı çıkardın: topuktaki yara kapanmamış, kenarı kızarmış. Postalı giymeden önce bir süre ona baktın.',
          choices: [
            {
              id: 'd17-ayak-revir',
              label: 'İçtimadan sonra revire çık',
              effect: { kondisyon: 6, disiplin: -2, enerji: -2 },
              outcome: 'Revirdeki er yarayı temizledi, bantladı. "Çorabı günde iki kere değiştir." Yürürken hâlâ hissediyorsun ama artık batmıyor.',
            },
            {
              id: 'd17-ayak-bant',
              label: 'Kendin bantla, devam et',
              effect: { kondisyon: -2, moral: 1 },
              outcome: 'Bant yarım saat tuttu. Sonra kaydı ve yara postalın içinde kendi başına kaldı.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd17-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Yatak. Aklın akşamki posta dağıtımında.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Kafan başka yerdeyken bile düzgün. Eller artık kendi başına çalışıyor.'
              : s > 0.55
                ? 'Olur. Köşe biraz kalkık, kimse bakmadı.'
                : 'Çarşaf buruşuk kaldı. Onbaşı "posta mı bekliyorsun" dedi. Bekliyordun.',
        },
      ],
    },
    {
      id: 'd17-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Akşam posta dağıtılacak. Koli gelen koliyi burada, herkesin önünde açacak. İçinden çıkan yasaksa bana, değilse size. Ağlayan olursa koğuşta ağlasın.',
        },
        {
          kind: 'mini',
          id: 'd17-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. "Posta" kelimesinden sonra sıra biraz kıpırdadı.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Kıpırdayan sıranın içinde kıpırdamayan tek kişi.'
              : s > 0.5
                ? 'Normal. Çavuş postayı söylediği için sıranın biraz dağılacağını biliyordu.'
                : 'Adın okunduğunda koliyi düşünüyordun. "Burada" geç geldi.',
        },
      ],
    },
    {
      id: 'd17-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-m1',
          sprite: 'postal',
          text: 'Mıntıkada posta kamyonetinin nizamiyeden girdiğini gördünüz. Süpürge bir an durdu, sonra herkes aynı anda yeniden süpürmeye başladı.',
        },
      ],
    },
    {
      id: 'd17-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-ka-bekliyor',
          sprite: 'tepsi',
          kosul: { isaret: 'koli_yolda', isaretDeger: 'evet' },
          text: 'Annen koliyi yolladığını söylemişti. Kaç gündür yolda olduğunu hesapladın: bugün gelmesi lazım. Çayını içerken nizamiyeye bakıp durdun.',
        },
        {
          kind: 'anlati',
          id: 'd17-ka-habersiz',
          sprite: 'tepsi',
          kosul: { isaretYok: 'koli_yolda' },
          text: 'Masada konu akşamki posta. Kimin kolisi gelecek, kimin gelmeyecek. Senin için bir şey yollandığını kimse söylemedi; sen de beklemiyorsun. Beklemediğini kendine iki kere söyledin.',
        },
        {
          kind: 'anlati',
          id: 'd17-ka1',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Benimki kesin gelir," dedi Emre. "Annem sucuk koyar. Çavuş sucuğu yasak sayar mı sence?" Sayar mı diye bütün masa bir süre ciddi ciddi tartıştı.',
          choices: [
            {
              id: 'd17-sucuk-sayar',
              label: '"Sayar. Sonra da kendisi yer."',
              effect: { moral: 3, dostluk: { kim: 'emre', puan: 2 } },
              outcome: 'Emre güldü, sonra durdu. "Doğru ya." Kahvaltının geri kalanında sucuğu nereye saklayacağını düşündü.',
            },
            {
              id: 'd17-sucuk-sayamaz',
              label: '"Sucuk silah değil, yasak olamaz."',
              effect: { moral: 2, dostluk: { kim: 'emre', puan: 3 } },
              outcome: '"İşte!" dedi Emre, sanki davayı sen kazanmışsın gibi. Serkan defterine bir şey yazdı; muhtemelen sucuğa biçtiği fiyat.',
            },
          ],
        },
      ],
    },
    {
      id: 'd17-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Arazi Yürüyüşü',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-e1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'On kilometre. Koli bekleyen hızlı yürüsün, erken döneriz. Bekleyen yoksa da hızlı yürüsün, ben bekliyorum.',
        },
        {
          kind: 'mini',
          id: 'd17-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'On kilometre. Postalın içinde on yedi günün izi var.',
          reward: (s) => ({
            kondisyon: Math.round(-4 + s * 10),
            disiplin: Math.round(-3 + s * 7),
            enerji: -16,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Tempodan hiç düşmedin. On yedi gün önce bunun yarısı seni bitirirdi.'
              : s > 0.5
                ? 'Son kilometrelerde topalladın ama bıraktırmadın.'
                : 'Tempo bir yerde kaçtı ve bir daha yakalanmadı. Onbaşı saatine baktı.',
        },
      ],
    },
    {
      id: 'd17-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-o1',
          sprite: 'askerTolga',
          text: 'Tolga posta listesine hiç bakmadı. Emre baktı, iki kere. Tolga\'ya "seninki de gelir" dedi. Tolga "gelmez" dedi, sesinde kırgınlık yoktu. Gelmeyeceğini biliyordu.',
          choices: [
            {
              id: 'd17-tolga-yanina',
              label: 'Tolga\'nın yanına otur',
              effect: { dostluk: { kim: 'tolga', puan: 4 }, moral: -1 },
              outcome: 'Konuşmadınız. Tolga ekmeğini ikiye böldü, yarısını senin tepsine koydu. Tolga\'nın dilinde bunun bir anlamı var.',
            },
            {
              id: 'd17-tolga-birak',
              label: 'Üstüne gitme',
              effect: { moral: 1 },
              outcome: 'Bıraktın. Tolga yemeğini bitirdi, tepsisini herkesten önce götürdü.',
            },
          ],
        },
      ],
    },
    {
      id: 'd17-talim',
      from: '13:30',
      to: '16:30',
      title: 'Talim',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Tören adımı. Yemin töreni yaklaşıyor ve aileniz tribünde oturacak. Aileniz sizi yamuk yürürken görmeyecek. Bugün iki saat, düz.',
        },
        {
          kind: 'anlati',
          id: 'd17-t2',
          text: 'Sıra döndüğünde postalın vuruşu diğerlerinden yarım adım geç kaldı. Çavuş durdurdu, seni öne çağırdı.',
          choices: [
            {
              id: 'd17-toren-tekrar',
              label: 'Tek başına, bütün bölüğün önünde tekrarla',
              effect: { disiplin: 6, moral: -2, enerji: -5 },
              outcome: 'Üçüncü denemede Çavuş başını salladı. Sıraya döndüğünde kimse gülmedi; herkes bir gün öne çağrılacağını biliyor.',
            },
            {
              id: 'd17-toren-ayak',
              label: '"Ayağım, komutanım" de',
              effect: { disiplin: -4, enerji: 2 },
              outcome: 'Çavuş postalına baktı, sonra sana. "Ayak tören günü de acıyacak mı?" Sıraya döndün.',
            },
          ],
        },
      ],
    },
    {
      id: 'd17-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Posta. Adını okuduğum çıksın. Koliyi burada açacaksınız.',
        },
        {
          kind: 'anlati',
          id: 'd17-ai2',
          text: 'Emre\'nin adı ilk okunan oldu. Sucuk çıkmadı; annesi yollamamış, onun yerine bir kavanoz tarhana. Sonra senin adın.',
        },
        // Kolinin içi anne ilişkisine göre; eşikler telefon g17 ile aynı.
        {
          kind: 'anlati',
          id: 'd17-koli-zengin',
          sprite: 'atistirmalik',
          kosul: { iliskiMin: { anne: 75 } },
          text: 'Kutu ağır. Bantlar üç kat, köşeleri gazeteyle desteklenmiş. Açtığında önce kurabiye kokusu geldi: kavanozda, ağzı bezle bağlanmış. Altında kalın çoraplar, pudra, ıslak mendil. En altta katlanmış bir kâğıt var. Çavuş kavanozu kaldırıp kokladı, geri koydu.',
          choices: [
            {
              id: 'd17-zengin-kagit',
              label: 'Kâğıdı açma, koğuşta oku',
              effect: { moral: 8, esya: { id: 'atistirmalik', adet: 3 } },
              outcome: 'Kâğıdı cebine koydun. Bütün içtima boyunca oradaydı. Çavuş "dağıl" dediğinde elin önce cebine gitti.',
            },
            {
              id: 'd17-zengin-ikram',
              label: 'Kavanozu açıp sıraya uzat',
              effect: {
                moral: 6,
                esya: { id: 'atistirmalik', adet: 2 },
                dostluk: { kim: 'emre', puan: 3 },
              },
              outcome: 'Sıra bir anda kalabalıklaştı. Çavuş bile bir tane aldı, bir şey demedi. Emre "annene selam söyle" dedi, ağzı doluyken.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd17-koli-orta',
          sprite: 'corap',
          kosul: { iliskiMin: { anne: 45 }, iliskiMax: { anne: 74 } },
          text: 'Düzgün paketlenmiş bir kutu. İki çift kalın çorap, marketten bir paket bisküvi, pişik pudrası. Her şey yerli yerinde; annen kutuyu kapatmadan önce bir liste yapmış olmalı.',
          choices: [
            {
              id: 'd17-orta-corap',
              label: 'Çorabı hemen değiştir',
              effect: { kondisyon: 3, moral: 4, esya: { id: 'atistirmalik', adet: 1 } },
              outcome: 'İçtima biter bitmez ranzanın kenarında çorabı değiştirdin. Kalın, kuru ve evden. Ayağın ilk defa postalın içinde rahat.',
            },
            {
              id: 'd17-orta-sakla',
              label: 'Kutuyu olduğu gibi dolaba kaldır',
              effect: { moral: 3, disiplin: 2, esya: { id: 'atistirmalik', adet: 1 } },
              outcome: 'Dolap bir raf doldu. Kapağı kapatırken evin kokusunun bir süre dolapta kalacağını düşündün.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd17-koli-sade',
          sprite: 'corap',
          kosul: { iliskiMax: { anne: 44 } },
          text: 'Kutu hafif. İçinde iki çift çorap, bir paket bisküvi. Geri kalanı gazete kâğıdıyla doldurulmuş. Çavuş kutuyu salladı, ses çıkmadı, sana geri verdi.',
          choices: [
            {
              id: 'd17-sade-kabul',
              label: 'Çorapları al, bir şey deme',
              effect: { moral: 2, esya: { id: 'atistirmalik', adet: 1 } },
              outcome: 'Kutuyu katlayıp çöpe attın. Gazetenin bir sayfasında memleketin maç sonucu vardı; onu cebine koydun.',
            },
            {
              id: 'd17-sade-dusun',
              label: 'Kutuya biraz daha bak',
              effect: { moral: -2, esya: { id: 'atistirmalik', adet: 1 } },
              outcome: 'Kutunun dibinde bir şey yok. Olmadığını bilmek için baktın. Son zamanlarda annenle ne konuştuğunu hatırlamaya çalıştın.',
            },
          ],
        },
      ],
    },
    {
      id: 'd17-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-ay1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: '"Tarhana, iki kurabiye, bir sucuk vaadi," dedi Serkan, defterini kapatırken. "Bu akşam koğuşta en zengin olan Emre değil, kavanozu olan. Kavanoz iktidardır." Bu akşam Serkan\'ın kolisi yoktu ve bunu da defterine yazmadı.',
        },
      ],
    },
    {
      id: 'd17-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-s1',
          text: 'Ankesörün önündeki kuyruk bu akşam uzun: koli gelen herkes "geldi" demek istiyor. Gelmeyenler de kuyrukta; onlar da neden gelmediğini soracak.',
        },
      ],
    },
    {
      id: 'd17-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd17-sy1',
          sprite: 'ay',
          text: 'On yedi gün bitti, on bir kaldı. Işıklar söndüğünde koğuşta ambalaj hışırtısı vardı. Biri karanlıkta bir şey yiyordu ve kimse ona kızmadı.',
        },
      ],
    },
  ],
};
