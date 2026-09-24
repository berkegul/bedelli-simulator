import type { Day } from '../engine/types';

/**
 * 26. gün — İKİ GÜN. Yemin töreni (K5). Aileler tribünde; rehberde kimi
 * yazdıysan o geliyor (Yemin mini oyunu tribünü rehberden diziyor). Telefon
 * g25'te "yüz yüze söylerim" dediysen (son_soz) törenden sonra söylüyorsun.
 * Akşam içtimasında teslim listesi okunuyor: dolap yarın boşalmaya başlıyor.
 */
export const gun26: Day = {
  day: 26,
  title: 'İki Gün',
  epigraph: 'Bugün yüksek sesle bir söz vereceksin ve herkes duyacak.',
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
          text: 'Yirmi altıncı sabah. Düdükten önce koğuşun yarısı uyanıktı. Kimse konuşmuyor ama herkes aynı şeyi düşünüyor: bugün tribün dolu olacak.',
        },
        {
          kind: 'mini',
          id: 'd26-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Tören sabahı. Yatağı bugün kimse denetlemeyecek; yine de topluyorsun.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 11), moral: Math.round(-1 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Kimse bakmayacaktı. Kusursuz yaptın, çünkü artık başka türlü yapamıyorsun.'
              : s > 0.55
                ? 'Toplandı. Aklın tribünde.'
                : 'Köşe kalkık kaldı. Bugün kimse fark etmez; sen fark ettin.',
        },
        {
          kind: 'anlati',
          id: 'd26-k3',
          sprite: 'uniformaKatli',
          speaker: 'Onbaşı Recep',
          text: 'Tören üniforması dolabın üst rafında. Ütü izi tek, kırışık yok, düğme eksik yok. Aileniz sizi ilk defa üniformayla görecek. Rezil etmeyin, kendinizi de beni de.',
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
          text: 'Saat onda tören alanındasınız. Dün prova ettiğiniz gibi: sıra, selam, yemin. Yemini komutan okur, siz tekrarlarsınız. Önüne geçen olursa tribün duyar. Arkada kalan olursa ben duyarım.',
        },
        {
          kind: 'mini',
          id: 'd26-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Bugün isimler iki kez okunuyor: biri burada, biri tören listesinde.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Tek seferde. Bugün sesin herkesinkinden net çıktı.'
              : s > 0.5
                ? 'Normal. Tören sesini saklıyorsun.'
                : 'Geç kaldın. Çavuş bir şey demedi; bugün demeyecek, yarın hatırlayacak.',
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
          text: '"Tribünde otuz aile, altmış kişi, en az yüz yirmi telefon." Serkan hesabı yapmıştı. "Her birimiz en az kırk fotoğrafa gireceğiz. Yüz ifadesi bugün kalıcı. Bunu yemek yerken düşünün."',
          choices: [
            {
              id: 'd26-serkan-gul',
              label: '"Sen hangi yüzü yapacaksın?"',
              effect: { moral: 4, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: 'Serkan kaşlarını çattı, çenesini kaldırdı, gözünü bir noktaya dikti. "Bu. Ciddi ama yorgun değil." Masadakilerin hepsi aynı yüzü denedi.',
            },
            {
              id: 'd26-serkan-sus',
              label: 'Çayını iç, tepsiye bak',
              effect: { enerji: 3 },
              outcome: 'Bugün kalabalık olacak. Şu an sadece çay var, sıcak. Bunu da biriktirdin.',
            },
          ],
        },
      ],
    },
    {
      id: 'd26-toren',
      from: '08:00',
      to: '12:00',
      title: 'Yemin Töreni',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-t1',
          sprite: 'bayrak',
          text: 'Tören alanı. Bayrak direğinin iki yanında hoparlör, karşıda tribün. Tribün sabahtan doldu; yüzler seçilmiyor, sadece renkler ve el sallayanlar. Bölük adım adım yerine yürüdü. Bu sefer kimse ayak saymadı, ayaklar zaten aynıydı.',
        },
        {
          kind: 'anlati',
          id: 'd26-t2',
          sprite: 'askerTolga',
          text: 'Yanındaki Tolga tribüne bakmıyor. Beş gün önce kapı listesine bir isim yazmıştı, sonra üstünü çizmişti, sonra çizginin yanına yeniden yazmıştı. Gelip gelmediğine bakmıyor. Sıra hareketsizken kolunun kolunla aynı hizada durduğunu fark ettin.',
          choices: [
            {
              id: 'd26-tolga-fisilti',
              label: '"Benimkiler seni de alkışlar" diye fısılda',
              effect: { disiplin: -2, moral: 3, dostluk: { kim: 'tolga', puan: 6 } },
              outcome: 'Tolga cevap vermedi, gözünü bayraktan ayırmadı. Ama bir an sonra başını, fark edilmeyecek kadar, salladı.',
            },
            {
              id: 'd26-tolga-dur',
              label: 'Kıpırdama, hizada dur',
              effect: { disiplin: 3 },
              outcome: 'İkiniz de kıpırdamadınız. Hizada durmak da bir şey söylüyordu; Tolga onu da duydu.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd26-t3',
          game: 'yemin',
          sprite: 'bayrak',
          brief: 'Komutan kürsüde. "Yemin için sağ el sol göğse!" Bölük bir ağızdan, yirmi sekiz kişi.',
          reward: (s) => ({
            disiplin: Math.round(-6 + s * 18),
            moral: Math.round(-4 + s * 16),
            enerji: -8,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Tek bir ses gibi çıktı. Son satırda tribünde biri ağladı; seninkiler olup olmadığını bilmiyorsun, olsun istedin.'
              : s > 0.5
                ? 'Birkaç satırda yarım adım geride kaldın, ama söz verildi. Tribünden alkış geldi, herkese.'
                : 'Bir satırda tek başına kaldın. Sesin hoparlörsüz, bütün alanda duyuldu. Yemin yine de yemin.',
        },
        {
          kind: 'anlati',
          id: 'd26-t4',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Rahat. Yarım saat aileleriniz sizin. Tribünün önüne kadar, çitten ileri değil. Yarım saat dediysem otuz dakika; otuz birinci dakikada burada olmayanın ailesi onu bir gün daha görür.',
        },
      ],
    },
    {
      id: 'd26-ziyaret',
      from: '12:00',
      to: '12:30',
      title: 'Ziyaret',
      sprite: 'sivil',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-z1',
          sprite: 'sivil',
          text: 'Çitin önü kalabalık. Birinin annesi oğlunun yüzünü iki eliyle tutmuş, bırakmıyor. Sen kalabalığın içinde seninkileri aradın ve bulduğunda ilk düşündüğün şey, onların seni bulmakta zorlandığıydı. Üniforma herkesi birbirine benzetiyor.',
          choices: [
            {
              id: 'd26-z-saril',
              label: 'Çitin üstünden sarıl',
              effect: { moral: 5, disiplin: -2 },
              outcome: 'Çit göğsüne battı. Farkına bile varmadın. Ağzına bir şey tıkıştırdılar, tadını sonra düşündün: börek.',
            },
            {
              id: 'd26-z-anlat',
              label: 'Yirmi altı günü anlat, kısa kısa',
              effect: { moral: 4, enerji: -2 },
              outcome: 'Telefonda anlattıklarının hepsini bir daha anlattın. Bu sefer yüzlerini gördün; hangisinde güldüklerini, hangisinde sustuklarını.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd26-z-yuz',
          sprite: 'sivil',
          kosul: { isaret: 'son_soz', isaretDeger: 'yuz_yuze' },
          text: 'Telefonda "yüz yüze söylerim" demiştin. Şimdi yüz yüzesin ve yarım saatin on dakikası geçti. Söyleyeceğin şey telefonda daha kolaydı; bunu herkes biliyordu, sen de.',
          choices: [
            {
              id: 'd26-yuz-soyle',
              label: 'Söyle',
              effect: { moral: 4 },
              outcome: 'İki cümleydi. Arkasından ikiniz de başka bir şeyden bahsettiniz, hava gibi. Ama söylendi, ve çitin iki tarafı da bunu duydu.',
            },
            {
              id: 'd26-yuz-sonra',
              label: '"Eve gelince"',
              effect: { moral: -2 },
              outcome: '"Eve gelince," dediler, anlayışla. İki gün sonra da aynı şeyi söyleyeceğini ikiniz de biliyordunuz.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd26-z-sevgili',
          sprite: 'sivil',
          kosul: { sevgiliVar: true },
          text: 'Kalabalığın arkasında biri parmak uçlarına kalkmış seni arıyor. Sesini duymadan tanıdın. Yirmi altı günde onu en çok sesinden tanımaya alışmıştın; şimdi yüzü sese yetişmeye çalışıyor.',
        },
        {
          kind: 'anlati',
          id: 'd26-z2',
          sprite: 'duduk',
          text: 'Düdük. Otuz dakika bitti. Ayrılmak girmekten zor değildi; iki gün sonra aynı kapıdan beraber çıkacaksınız. El salladın, sıraya döndün.',
        },
        {
          kind: 'anlati',
          id: 'd26-z-tolga',
          sprite: 'askerTolga',
          text: 'Çitin en ucunda Tolga diz çökmüş. Karşısında beş yaşında bir kız, elinde katlanmış bir kâğıt: yirmi sekiz kutulu takvim, yirmi altısının üstü çizili. Kız ağlamıyor. Tolga ağlıyor, sesi çıkmadan. Kız kâğıdı babasının cebine koydu, cebin düğmesini kendisi ilikledi.',
          choices: [
            {
              id: 'd26-tolga-uzak',
              label: 'Uzaktan bak, yanlarına gitme',
              effect: { moral: 4, dostluk: { kim: 'tolga', puan: 4 } },
              outcome: 'Yirmi altı gün boyunca Tolga\'nın neden aramadığını kimse sormadı. Şimdi sormaya gerek kalmadı.',
            },
            {
              id: 'd26-tolga-kalem',
              label: 'Kıza kalemini ver: "Kalan iki kutu için"',
              effect: { moral: 3, dostluk: { kim: 'tolga', puan: 7 } },
              outcome: 'Kız kalemi aldı, sana değil babasına baktı. Tolga başını salladı. Kalem gitti; kutular kaldı, iki tane.',
            },
          ],
        },
      ],
    },
    {
      id: 'd26-ogle',
      from: '12:30',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd26-o1',
          sprite: 'yemekhaneMasa',
          text: 'Yemekhanede herkesin cebinde bir şey var: börek, lokum, katlanmış bir kâğıt. Masanın ortasında kimsenin sahiplenmediği bir kutu kurabiye dolaşıyor. Bugün tepsi kimseye yetmiyor, çünkü kimse tepsiye bakmıyor.',
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
          text: 'Teslim listesi. Battaniye iki, çarşaf iki, yastık kılıfı bir, üniforma takımı, postal, matara, künye. Yarın akşam dolaplar kontrol edilir, eksik olan terhis belgesini alamaz. Künyeyi en son teslim edeceksiniz; bu kışlada adınızla birlikte en son o çıkar.',
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
          text: '"Karım düğmeye baktı," dedi Emre, tabağını itip. "Sonra bana baktı. Sonra yine düğmeye. Bir şey diyecekti, demedi." Masada kimse gülmedi; bu defa gülünecek bir şey anlatmıyordu.',
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
          text: 'Avluda ilk defa kimse telefon kuyruğunda acele etmiyor. Aileler öğlen buradaydı; söylenecekler söylendi. Ankesörün önünde bu akşam yalnızca bugün kimsesi gelmemiş olanlar var.',
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
          text: 'Yirmi altı gün bitti, iki kaldı. Işıklar söndü. Koğuşta biri karanlıkta yemini baştan fısıldadı, kelimesi kelimesine. Kimse susturmadı. Son satırda birkaç ses daha katıldı.',
        },
      ],
    },
  ],
};
