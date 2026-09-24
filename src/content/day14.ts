import type { Day } from '../engine/types';

/**
 * 14. gün — YARISI. İkinci eşik: 28'in 14'ü. Nöbetten çıkılan sabah, uykusuz
 * bir yarı yol. Çavuşun 12. gündeki "gevşeyeni ben sertleştiririm"i bugün
 * akşam içtimasında cezaya dönüyor (görev takvimi). Telefon g14'te baba
 * "yarısı bitti" demek için bekliyor; gün de aynı cümlenin etrafında dönüyor.
 */
export const gun14: Day = {
  day: 14,
  title: 'Yarısı',
  epigraph: 'On dört gün geride, on dört gün önünde. Ortası tam burası.',
  blocks: [
    {
      id: 'd14-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-k1',
          sprite: 'duduk',
          text: 'Nöbetten döneli bir buçuk saat oldu. Düdük çaldığında gözlerin kum dolu. Koridordaki panoya biri tebeşirle "14/28" yazmış; altına başka biri "YARISI" eklemiş, harfler yamuk.',
          choices: [
            {
              id: 'd14-k-kalk',
              label: 'Tek hamlede kalk',
              effect: { disiplin: 3, enerji: -3 },
              outcome: 'Ayaklar yerde. Kafa henüz yastıkta ama o da gelir.',
            },
            {
              id: 'd14-k-oyalan',
              label: 'Bir dakika daha tavana bak',
              effect: { enerji: 3, disiplin: -2 },
              outcome: 'Bir dakika. Tavandaki leke on dört gündür aynı yerde; bugün ilk defa bir şeye benzetmedin.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd14-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Yarı yolun yatağı. Uykusuz eller ezberi hatırlıyor mu?',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Uykusuz ama kusursuz. Ezber bunun için var.'
              : s > 0.55
                ? 'Köşelerden biri yumuşak kaldı. Nöbetin izi.'
                : 'Battaniyeyi iki kez serdin, iki kez kaydı. Gece hâlâ üstünde.',
        },
      ],
    },
    {
      id: 'd14-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Panoya yazı yazanı bulmayacağım. Ama yarıya geldiğinizi bilmeniz iyi: bundan sonra kimse "yeniyim" diyemez. Bu akşam listede kimler var, akşam görürsünüz.',
        },
        {
          kind: 'mini',
          id: 'd14-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Dünkü nöbetçiler sırada göz kırpmamaya çalışıyor.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Uykusuz ve tam zamanında. Çavuş listeye bakıp geçti.'
              : s > 0.5
                ? 'Bir an geciktin. Nöbetçiye tanınan bir an.'
                : 'Adın okunduğunda gözün kapalıydı. Çavuş bir şey yazdı; akşam anlarsın.',
        },
      ],
    },
    {
      id: 'd14-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-m1',
          sprite: 'postal',
          text: 'Mıntıkada Tolga bir izmariti eline alıp baktı: "İlk gün bundan yüz tane vardı." Bugün yirmi. Ya bölük değişti ya da avlu yorgun düştü.',
        },
      ],
    },
    {
      id: 'd14-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-ka1',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Yarısını kutlamamız lazım." Emre çay bardağını kaldırdı. "Sivilde bir işin yarısını bitirince ekibe kuzu çevirirdim. Burada çay var." Masadakiler bardakları kaldırmak mı yoksa gülmek mi gerektiğini bilemedi.',
          choices: [
            {
              id: 'd14-ka-kaldir',
              label: 'Bardağını kaldır',
              effect: { moral: 4, dostluk: { kim: 'emre', puan: 3 } },
              outcome: 'Dört çay bardağı havada tokuştu. Karşı masadan biri de kaldırdı, neden olduğunu bilmeden.',
            },
            {
              id: 'd14-ka-erken',
              label: '"Yarısı daha bitmedi, akşam bitecek"',
              effect: { disiplin: 2, moral: -1, dostluk: { kim: 'emre', puan: -1 } },
              outcome: 'Emre bardağı indirdi. "Akşam da kaldırırız." Kaldırmayacağını ikiniz de biliyorsunuz.',
            },
          ],
        },
      ],
    },
    {
      id: 'd14-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Çantalı Yürüyüş',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-e1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Sırt çantası, on iki kilo. Arazide on kilometre. Yarıda yürüdüğünüz yolun yarısını geri döneceksiniz; bugün simgesel bir gün, simgeyi sırtınızda taşıyacaksınız.',
        },
        {
          kind: 'mini',
          id: 'd14-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'On kilometre, sırtta on iki kilo, gözde nöbet uykusu. Tempo senden kopmasın.',
          reward: (s) => ({
            kondisyon: Math.round(-3 + s * 10),
            disiplin: Math.round(-3 + s * 7),
            enerji: -17,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Çanta sırtına alıştı, sen tempoya. Dönüşte kimseyi beklemedin.'
              : s > 0.5
                ? 'Omuz kayışları battı, yetiştin.'
                : 'Beşinci kilometrede sıra seni geride bıraktı. Çavuş yanında yürüdü, bir şey demeden.',
        },
      ],
    },
    {
      id: 'd14-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-o1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: 'Serkan defterini açtı, son sayfaya bir çizgi çekti. "Yarı dönem kapanışı. Kimin kime borcu var, bugün sıfırlanabilir. Yüzde on indirimle."',
          choices: [
            {
              id: 'd14-o-kapat',
              label: 'Hesabını kapat',
              effect: { para: -30, moral: 3, dostluk: { kim: 'serkan', puan: 4 } },
              outcome: 'Serkan senin satırını çizdi. "Temiz sayfa." Bir kalemin çizgisi bu kadar rahatlatıcı olabiliyormuş.',
            },
            {
              id: 'd14-o-ertele',
              label: '"İkinci yarıda kapatırım"',
              effect: { moral: -1, dostluk: { kim: 'serkan', puan: -2 } },
              outcome: '"İndirim bugünlük." Serkan sayfayı çevirdi. Senin satırın ikinci yarıya taşındı, faiziyle.',
            },
          ],
        },
      ],
    },
    {
      id: 'd14-talim',
      from: '13:30',
      to: '16:30',
      title: 'Silah Eğitimi',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-t1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Yarıya gelen asker silahı elinden bırakmayı unutur, ilk günkü dikkati unutur. Bugün ikinciyi hatırlatacağım. Sök, tak, arkadaşının silahını kontrol et.',
        },
        {
          kind: 'mini',
          id: 'd14-t2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Sök, sırala, tak. Sonra yanındakinin tüfeğine bakacaksın; önce kendininki doğru olsun.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 11), moral: Math.round(-1 + s * 3) }),
          verdict: (s) =>
            s > 0.85
              ? 'Eller önden gitti, göz arkadan kontrol etti. İlk günün tersi.'
              : s > 0.5
                ? 'Bir pimi iki kez yokladın. Süre yetti.'
                : 'Yayı ters taktın. On dört gün sonra bile, bir kez.',
        },
        {
          kind: 'anlati',
          id: 'd14-t3',
          sprite: 'askerTolga',
          text: 'Tolga\'nın tüfeğini kontrol ederken sürgü kilidinin tam oturmadığını gördün. Tolga fark etmemiş; gözü tüfekte değil, bir yerlerde.',
          choices: [
            {
              id: 'd14-t-sessiz',
              label: 'Sessizce göster, düzeltsin',
              effect: { disiplin: 2, dostluk: { kim: 'tolga', puan: 5 } },
              outcome: 'Tolga baktı, düzeltti, başını salladı. Onbaşı gelmeden bitti. Akşam yemeğinde sana ekmeğini uzattı.',
            },
            {
              id: 'd14-t-bildir',
              label: '"Onbaşım, burada kilit oturmamış"',
              effect: { disiplin: 4, dostluk: { kim: 'tolga', puan: -4 } },
              outcome: 'Onbaşı Tolga\'ya on şınav verdi, sana "gözün açık" dedi. Tolga şınav çekerken sana bakmadı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd14-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'İki gün önce söyledim: yarıya gelen ya gevşer ya sertleşir. Bu hafta kimin gevşediğini not ettim. Onbaşı listeyi okuyacak. Adı okunan kalır, gerisi yemeğe.',
        },
      ],
    },
    {
      id: 'd14-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-ay1',
          sprite: 'tepsi',
          text: 'Yemekhane bugün her zamankinden gürültülü. Yarısı bitti; bunu kimse yüksek sesle söylemiyor, ama herkes birbirine bir tuzluk, bir ekmek fazla uzatıyor.',
        },
      ],
    },
    {
      id: 'd14-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-s1',
          text: 'Ankesörün önündeki kuyrukta herkes aynı cümleyi prova ediyor: "Yarısı bitti." Bazıları "bitti" diyor, bazıları "kaldı". Aynı sayı, iki ayrı gün.',
          choices: [
            {
              id: 'd14-s-bitti',
              label: 'Sen de "bitti" diye düşün',
              effect: { moral: 3 },
              outcome: 'On dört gün bitti. Arkada bırakılmış on dört gün, önünde duran on dörtten hafif.',
            },
            {
              id: 'd14-s-kaldi',
              label: '"Kaldı" diye düşün',
              effect: { moral: -2, disiplin: 2 },
              outcome: 'On dört gün kaldı. Sayı ağır ama yalan söylemiyor; ikinci yarıya gözün açık giriyorsun.',
            },
          ],
        },
      ],
    },
    {
      id: 'd14-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd14-sy1',
          sprite: 'ay',
          text: 'On dört gün bitti, on dört kaldı. Bu gece ilk defa iki sayı eşit. Yarından itibaren geride kalan hep daha çok olacak.',
        },
      ],
    },
  ],
};
