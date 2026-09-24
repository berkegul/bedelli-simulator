import type { Day } from '../engine/types';

/**
 * 28. gün — YEMİN VE ÇIKIŞ. Gerçekteki gibi yemin töreni son gün: tören
 * biter, aile tribünden iner, asker evrakını alıp sivilini giyer ve onlarla
 * nizamiyeden çıkar. Serbest zaman ve yoklama yok. Sıra: son kalkış, son
 * yoklama, kahvaltı, dolap boşaltma (tören kıyafeti üstte, sivil çantada),
 * yemin töreni (Yemin mini oyunu tribünü rehberden diziyor), aileyle yarım
 * saat (telefonda "yüz yüze söylerim" dediysen: son_soz), evrak ve künye
 * teslimi, sivil, veda, nizamiye. Gün kapının önünde bitiyor; kapıdan çıkış
 * anı final kartlarında ('kapi'), karne ondan önce ekranda.
 */
export const gun28: Day = {
  day: 28,
  title: 'Yemin',
  epigraph: 'Bugün yüksek sesle bir söz vereceksin, sonra aynı kapıdan öbür yöne çıkacaksın.',
  blocks: [
    {
      id: 'd28-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-k1',
          sprite: 'duduk',
          text: 'Yirmi sekizinci sabah. Düdük çalmadan kalktın; düdük yine de çaldı, son kez, herkes için. Kapıdaki tebeşirde tek çentik açık kalmıştı. Emre ranzadan inip ona parmağını bastırdı, sildi. Kimse bir şey demedi; herkes baktı.',
        },
        {
          kind: 'mini',
          id: 'd28-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Son yatak. Toplayacaksın, sonra çarşafı sökecek, teslim edeceksin. Yine de topluyorsun.',
          reward: (s) => ({ disiplin: Math.round(-3 + s * 9), moral: Math.round(s * 5) }),
          verdict: (s) =>
            s > 0.85
              ? 'Kusursuz, son kez. Birkaç dakika sonra bozacaksın; önemli değil, kimin topladığı belli.'
              : s > 0.55
                ? 'Toplandı. Bu yatak yarın başkasının.'
                : 'Köşe kalkık. Son sabah, eller titriyor; yorgunluktan değil.',
        },
      ],
    },
    {
      id: 'd28-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Son Yoklama',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Son yoklama. Adınız okununca "burada" diyeceksiniz. Yirmi sekiz gün önce bu kelimeyi söyleyemeyenler vardı, sesi çıkmıyordu. Bugün bağırmayın; söyleyin. Sesinizi saat ona saklayın.',
        },
        {
          kind: 'mini',
          id: 'd28-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Son yoklama. Adın okunacak, bir kez.',
          reward: (s) => ({ disiplin: Math.round(-3 + s * 10), moral: Math.round(s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? '"Burada." Çavuş başını kaldırdı, sana baktı, bir sonraki adı okudu.'
              : s > 0.5
                ? 'Söyledin. Sesin koğuşun sesine karıştı.'
                : 'Bir an geç kaldın. Çavuş adını bir daha okumadı; bekledi. Söyledin.',
        },
      ],
    },
    {
      id: 'd28-kahvalti',
      from: '06:30',
      to: '07:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-ka1',
          sprite: 'yemekhaneMasa',
          text: 'Son tepsi. Yemekhane her sabahki kadar gürültülü, belki biraz fazla. Kimse "son" demiyor; herkes aynı sırada, aynı tepsiyle, aynı çayla. Çaycı er seni görünce bardağı doldurdu ve bu sefer şekeri sormadı.',
        },
        {
          kind: 'anlati',
          id: 'd28-ka2',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: '"Tribünde otuz aile, altmış kişi, en az yüz yirmi telefon." Serkan hesabı yapmıştı. "Her birimiz en az kırk fotoğrafa gireceğiz. Yüz ifadesi bugün kalıcı. Bunu yemek yerken düşünün."',
          choices: [
            {
              id: 'd28-serkan-gul',
              label: '"Sen hangi yüzü yapacaksın?"',
              effect: { moral: 4, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: 'Serkan kaşlarını çattı, çenesini kaldırdı, gözünü bir noktaya dikti. "Bu. Ciddi ama yorgun değil." Masadakilerin hepsi aynı yüzü denedi.',
            },
            {
              id: 'd28-serkan-sus',
              label: 'Çayını iç, tepsiye bak',
              effect: { enerji: 3 },
              outcome: 'Bugün kalabalık olacak. Şu an sadece çay var, sıcak. Bunu da biriktirdin.',
            },
          ],
        },
      ],
    },
    {
      id: 'd28-kogus',
      from: '07:00',
      to: '08:30',
      title: 'Dolap Boşaltma',
      sprite: 'dolapSirasi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-d1',
          sprite: 'dolapSirasi',
          speaker: 'Onbaşı Recep',
          text: 'Dolaplar boşalıyor. İlk gün ne koyduysanız tersinden çıkacak: üstte ne varsa önce o. Tören kıyafeti üstünüze, gerisi teslim masasına, siviller çantaya. Anahtar kapıda. Künye boynunuzda kalsın; törenden sonra, en son, bana.',
        },
        {
          kind: 'anlati',
          id: 'd28-d2',
          sprite: 'uniformaKatli',
          text: 'Üst raftan tören kıyafeti çıktı, ütülü. Askıdan günlük ceket, teslim masasına. Orta raftan kalanlar. Alt gözün dibinde yirmi sekiz gün önce tıkıştırdığın sivil kıyafetin duruyor, buruşuk; çantaya koydun. Tören kıyafetini giydin, düğmeleri aynaya bakmadan ilikledin.',
          choices: [
            {
              id: 'd28-dolap-sil',
              label: 'Boş dolabın rafını bir kez sil',
              effect: { disiplin: 4, moral: 2 },
              outcome: 'Kimse istemedi. Rafta ilk gün kalmış bir toz izi vardı; sildin. Yarın gelecek adam temiz bir dolap bulacak ve bunu bilmeyecek.',
            },
            {
              id: 'd28-dolap-bak',
              label: 'Boş dolaba bir süre bak',
              effect: { moral: 3 },
              outcome: 'Dar, derin, boş. İlk gün ne kadar küçük gelmişti. Şimdi de küçük. Ama içine yirmi sekiz gün sığdı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd28-toren',
      from: '08:30',
      to: '11:00',
      title: 'Yemin Töreni',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-t1',
          sprite: 'bayrak',
          text: 'Tören alanı. Bayrak direğinin iki yanında hoparlör, karşıda tribün. Dokuzda kapı açıldı, tribün yarım saatte doldu; yüzler seçilmiyor, sadece renkler ve el sallayanlar. Bölük adım adım yerine yürüdü. Bu sefer kimse ayak saymadı, ayaklar zaten aynıydı.',
        },
        {
          kind: 'anlati',
          id: 'd28-t2',
          sprite: 'askerTolga',
          text: 'Yanındaki Tolga tribüne bakmıyor. Bir hafta önce kapı listesine bir isim yazmıştı, sonra üstünü çizmişti, sonra çizginin yanına yeniden yazmıştı. Gelip gelmediğine bakmıyor. Sıra hareketsizken kolunun kolunla aynı hizada durduğunu fark ettin.',
          choices: [
            {
              id: 'd28-tolga-fisilti',
              label: '"Benimkiler seni de alkışlar" diye fısılda',
              effect: { disiplin: -2, moral: 3, dostluk: { kim: 'tolga', puan: 6 } },
              outcome: 'Tolga cevap vermedi, gözünü bayraktan ayırmadı. Ama bir an sonra başını, fark edilmeyecek kadar, salladı.',
            },
            {
              id: 'd28-tolga-dur',
              label: 'Kıpırdama, hizada dur',
              effect: { disiplin: 3 },
              outcome: 'İkiniz de kıpırdamadınız. Hizada durmak da bir şey söylüyordu; Tolga onu da duydu.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd28-t3',
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
          id: 'd28-t4',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Rahat. Yarım saat aileleriniz sizin, tribünün önüne kadar. Sonra evrak; aileleriniz sizi nizamiyenin önünde bekler. Yarım saat dediysem otuz dakika. Bugün kimse geç kalmasın; son gün geç kalanı en son ben bırakırım.',
        },
      ],
    },
    {
      id: 'd28-ziyaret',
      from: '11:00',
      to: '11:30',
      title: 'Aileler',
      sprite: 'sivil',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-z1',
          sprite: 'sivil',
          text: 'Tribün boşaldı, herkes aşağıda. Birinin annesi oğlunun yüzünü iki eliyle tutmuş, bırakmıyor. Sen kalabalığın içinde seninkileri aradın ve bulduğunda ilk düşündüğün şey, onların seni bulmakta zorlandığıydı. Üniforma herkesi birbirine benzetiyor.',
          choices: [
            {
              id: 'd28-z-saril',
              label: 'Sarıl',
              effect: { moral: 5, disiplin: -2, tokluk: 20 },
              outcome: 'Tören kıyafetinin düğmeleri araya girdi, farkına bile varmadın. Ağzına bir şey tıkıştırdılar, tadını sonra düşündün: börek.',
            },
            {
              id: 'd28-z-anlat',
              label: 'Yirmi sekiz günü anlat, kısa kısa',
              effect: { moral: 4, enerji: -2, tokluk: 20 },
              outcome: 'Telefonda anlattıklarının hepsini bir daha anlattın; anlatırken elinden börek eksik olmadı. Bu sefer yüzlerini gördün; hangisinde güldüklerini, hangisinde sustuklarını.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd28-z-yuz',
          sprite: 'sivil',
          kosul: { isaret: 'son_soz', isaretDeger: 'yuz_yuze' },
          text: 'Telefonda "yüz yüze söylerim" demiştin. Şimdi yüz yüzesin ve yarım saatin on dakikası geçti. Söyleyeceğin şey telefonda daha kolaydı; bunu herkes biliyordu, sen de.',
          choices: [
            {
              id: 'd28-yuz-soyle',
              label: 'Söyle',
              effect: { moral: 4 },
              outcome: 'İki cümleydi. Arkasından ikiniz de başka bir şeyden bahsettiniz, hava gibi. Ama söylendi, ve ikiniz de bunu duydunuz.',
            },
            {
              id: 'd28-yuz-sonra',
              label: '"Eve gelince"',
              effect: { moral: -2 },
              outcome: '"Eve gelince," dediler, anlayışla. Arabada da aynı şeyi söyleyeceğini ikiniz de biliyordunuz.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd28-z-sevgili',
          sprite: 'sivil',
          kosul: { sevgiliVar: true },
          text: 'Kalabalığın arkasında biri parmak uçlarına kalkmış seni arıyor. Sesini duymadan tanıdın. Yirmi sekiz günde onu en çok sesinden tanımaya alışmıştın; şimdi yüzü sese yetişmeye çalışıyor.',
        },
        {
          kind: 'anlati',
          id: 'd28-z-emre',
          sprite: 'askerEmre',
          text: 'Biraz ötede Emre\'nin karısı önce düğmeye baktı, sonra Emre\'ye, sonra yine düğmeye. Bir şey diyecekti, demedi. Çocuklar Emre\'nin bacaklarına yapışmış; Emre ikisini birden kaldırdı, tören kıyafeti umurunda değil.',
        },
        {
          kind: 'anlati',
          id: 'd28-z-tolga',
          sprite: 'askerTolga',
          text: 'Tribünün en ucunda Tolga diz çökmüş. Karşısında beş yaşında bir kız, elinde katlanmış bir kâğıt: yirmi sekiz kutulu takvim, yirmi yedisi çizili. Kız ağlamıyor. Tolga ağlıyor, sesi çıkmadan. Tolga başını kaldırdı, seni gördü. Dün gece "sonuncuyu beraber çizeriz" demişti.',
          choices: [
            {
              id: 'd28-tolga-kiz',
              label: 'Kalemini kıza ver: "Sonuncuyu sen çiz"',
              effect: { moral: 3, dostluk: { kim: 'tolga', puan: 7 } },
              outcome: 'Kız kalemi aldı, sana değil babasına baktı. Tolga başını salladı. Çizgi kutudan taştı, kimse düzeltmedi. Kız kâğıdı babasının cebine koydu, cebin düğmesini kendisi ilikledi.',
            },
            {
              id: 'd28-tolga-uzak',
              label: 'Uzaktan bak, yanlarına gitme',
              effect: { moral: 3, dostluk: { kim: 'tolga', puan: 4 } },
              outcome: 'Son kutuyu ikisi çizdi, Tolga\'nın eli kızının elinin üstünde. Yirmi sekiz gün boyunca Tolga\'nın neden aramadığını kimse sormadı. Şimdi sormaya gerek kalmadı.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd28-z2',
          sprite: 'duduk',
          text: 'Düdük. Otuz dakika bitti. Aileler nizamiyenin önüne, siz bölük bürosuna. Ayrılmak bu sefer kolaydı; bir saat sonra aynı kapıdan beraber çıkacaksınız. El salladın, sıraya döndün.',
        },
      ],
    },
    {
      id: 'd28-evrak',
      from: '11:30',
      to: '12:30',
      title: 'Evrak',
      sprite: 'defter',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-e1',
          sprite: 'defter',
          text: 'Bölük bürosunun önünde kuyruk. İçeride bir masa, bir mühür, bir yazıcı. Her asker üç kâğıt imzalıyor, bir kâğıt alıyor: terhis belgesi. Kuyrukta herkesin elinde telefonu var; kutudan bu sabah geri verildi, ekranlar kışlanın ışığında tuhaf parlıyor.',
        },
        {
          kind: 'anlati',
          id: 'd28-e2',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: 'Serkan kuyrukta önünde. Sırası geldiğinde imzaları attı, belgesini aldı, katlamadan cebine koydu. Dönüp sana baktı: "Katlama. Katlanmış belge kaybolmuş belgedir." Yirmi sekiz gün boyunca verdiği son tavsiye.',
          choices: [
            {
              id: 'd28-belge-duz',
              label: 'Belgeyi katlamadan defterin arasına koy',
              effect: { disiplin: 3, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: 'Defterin ilk sayfası çarşı listesi, son sayfası teslim listesi. Terhis belgesi ortada, düz. Serkan başıyla onayladı.',
            },
            {
              id: 'd28-belge-bak',
              label: 'Belgeyi okuyarak yürü',
              effect: { moral: 4 },
              outcome: 'Adın, numaran, iki tarih. Arasındaki yirmi sekiz gün belgede tek bir satır: "Temel askerlik eğitimini tamamlamıştır." Bir satır. Yeterli.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd28-e3',
          sprite: 'kunye',
          speaker: 'Onbaşı Recep',
          text: 'Künye. Boynundan çıkardın, avucunda tuttun, sıcaktı. Onbaşı elini uzattı, bekledi. Aceleye getirmedi. "Numaran bende kalıyor," dedi. "Adın sende."',
        },
        {
          kind: 'anlati',
          id: 'd28-e4',
          sprite: 'uniformaKatli',
          text: 'Koğuşta tören kıyafetini son kez katladın, teslim masasına bıraktın. Çantadan sivil kıyafetin çıktı, buruşuk. Giydin. Pantolon belden biraz bol geldi. Aynada bir an kendini tanımadın; saç kısa, yüz esmer, duruş başka.',
        },
      ],
    },
    {
      id: 'd28-veda',
      from: '12:30',
      to: '13:00',
      title: 'Veda',
      sprite: 'kisla',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-v1',
          sprite: 'askerEmre',
          text: 'Koğuşun önü. Sivil kıyafetle kimse kimseyi ilk bakışta tanımıyor. Emre gömleğinin yakasını düzeltti, sonra bir daha düzeltti; yirmi sekiz gün boyunca yaka yoktu. Tolga sırtında çantası, kapıya en yakın yerde; cebinin düğmesi hâlâ ilikli. Serkan defterini göğsüne bastırmış.',
          choices: [
            {
              id: 'd28-veda-sarilma',
              label: 'Üçüne de sarıl, sırayla',
              effect: {
                moral: 4,
                dostluk: { kim: 'tolga', puan: 5 },
              },
              outcome: 'Emre seni kaldırdı, yere indirdi: "Cumartesi." Serkan sarılırken defteri araya aldı, sonra fark etti ve koltuğunun altına sıkıştırdı. Tolga en son; kısa, sıkı, konuşmadan.',
            },
            {
              id: 'd28-veda-el',
              label: 'El sıkış, "görüşürüz" de',
              effect: { moral: 4, dostluk: { kim: 'emre', puan: 2 } },
              outcome: '"Görüşürüz" dedin ve herkes aynı şeyi söyledi. Bu kelimeyi yirmi sekiz gün önce söyleseniz kimse inanmazdı. Şimdi de kimse emin değil; ama söylendi.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd28-v-cavus',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Çavuş koğuşun kapısında durdu. Konuşma yapmadı. "Yolunuz açık olsun," dedi, bir kere, herkese. Sonra kendi işine döndü; iki gün sonra yeni bir bölük geliyor ve onlar bu kapıdan senin yirmi sekiz gün önce baktığın gibi bakacak.',
        },
      ],
    },
    {
      id: 'd28-nizamiye',
      from: '13:00',
      to: '13:30',
      title: 'Nizamiye',
      sprite: 'kisla',
      scenes: [
        {
          kind: 'yol',
          id: 'd28-nizamiye-yol',
          hedef: 'Nizamiyeye',
          adim: 7,
          mekan: 'bayrak',
          manzara: ['kisla', 'agac', 'kantinBina', 'ankesor', 'agac', 'bayrak'],
          bakis: 'perspektif',
          sivil: true,
        },
        {
          kind: 'anlati',
          id: 'd28-n1',
          sprite: 'kisla',
          text: 'Avlu, kantin, ankesör, bayrak direği. Her birinin önünden sivil kıyafetle geçtin ve hiçbiri seni tanımadı. Nizamiyenin demir parmaklıklarının ardında bir kalabalık bekliyor; sabah tribündeki renkler. Nöbetçi er elini uzattı: "Belge."',
        },
        {
          kind: 'anlati',
          id: 'd28-n-son',
          sprite: 'kisla',
          text: 'Belgeyi uzattın. Kapının öbür tarafında seninkiler duruyor; öğlen tribünün önünde gördüğün yüzler, bu sefer arada çit yok, tören yok, düdük yok. Nöbetçi kâğıda bakıyor. Bir saniye. Bir saniye daha.',
        },
      ],
    },
  ],
};
