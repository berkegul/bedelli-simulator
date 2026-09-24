import type { Day } from '../engine/types';

/**
 * 28. gün — ÇIKIŞ. Kısa gün, serbest zaman ve yoklama yok. Son kalkış, son
 * içtima, evrak kuyruğu (telefon g28 burada: "çıktım"), dolap boşaltma
 * (ilk günün yerleşiminin tersi: teslim listesi), veda ve nizamiyeye sivil
 * yürüyüş. Gün kapının önünde bitiyor; kapıdan çıkış anı final kartlarında
 * ('kapi'), karne ondan önce ekranda.
 */
export const gun28: Day = {
  day: 28,
  title: 'Çıkış',
  epigraph: 'Aynı kapı. Bu sefer öbür yönden.',
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
          text: 'Son yoklama. Adınız okununca "burada" diyeceksiniz. Yirmi sekiz gün önce bu kelimeyi söyleyemeyenler vardı, sesi çıkmıyordu. Bugün bağırmayın; söyleyin.',
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
      ],
    },
    {
      id: 'd28-evrak',
      from: '07:00',
      to: '08:00',
      title: 'Evrak',
      sprite: 'defter',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-e1',
          sprite: 'defter',
          text: 'Bölük bürosunun önünde kuyruk. İçeride bir masa, bir mühür, bir yazıcı. Her asker üç kâğıt imzalıyor, bir kâğıt alıyor. Terhis belgesi. Kuyrukta herkesin elinde telefonu var; kutudan bu sabah geri verildi, ekranlar kışlanın ışığında tuhaf parlıyor.',
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
      ],
    },
    {
      id: 'd28-kogus',
      from: '08:00',
      to: '08:30',
      title: 'Dolap Boşaltma',
      sprite: 'dolapSirasi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-d1',
          sprite: 'dolapSirasi',
          speaker: 'Onbaşı Recep',
          text: 'Dolaplar boşalıyor. İlk gün ne koyduysanız tersinden çıkacak: üstte ne varsa önce o. Üniforma teslim masasına, sivil üstünüze. Anahtar kapıda. Künye en son, bana.',
        },
        {
          kind: 'anlati',
          id: 'd28-d2',
          sprite: 'uniformaKatli',
          text: 'Üst raftan üniforma çıktı, katlı. Askıdan ceket. Orta raftan kalanlar. Alt gözün dibinde yirmi sekiz gün önce tıkıştırdığın sivil kıyafetin duruyor, buruşuk. Giydin. Pantolon belden biraz bol geldi.',
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
        {
          kind: 'anlati',
          id: 'd28-d3',
          sprite: 'kunye',
          speaker: 'Onbaşı Recep',
          text: 'Künye. Boynundan çıkardın, avucunda tuttun, sıcaktı. Onbaşı elini uzattı, bekledi. Aceleye getirmedi. "Numaran bende kalıyor," dedi. "Adın sende."',
        },
      ],
    },
    {
      id: 'd28-veda',
      from: '08:30',
      to: '09:00',
      title: 'Veda',
      sprite: 'kisla',
      scenes: [
        {
          kind: 'anlati',
          id: 'd28-v1',
          sprite: 'askerEmre',
          text: 'Koğuşun önü. Sivil kıyafetle kimse kimseyi ilk bakışta tanımıyor. Emre gömleğinin yakasını düzeltti, sonra bir daha düzeltti; yirmi sekiz gün boyunca yaka yoktu. Tolga sırtında çantası, kapıya en yakın yerde duruyor. Serkan defterini göğsüne bastırmış.',
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
          id: 'd28-v2',
          sprite: 'askerTolga',
          text: 'Tolga cebinden takvimi çıkardı; kızının çizdiği, yirmi yedi kutusu dolu. Kalemi sana uzattı. Son kutuyu beraber çizdiniz, ikiniz de çizgiyi taşırdınız. Takvim cebe, düğme iliklendi.',
        },
        {
          kind: 'anlati',
          id: 'd28-v-cavus',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Çavuş koğuşun kapısında durdu. Konuşma yapmadı. "Yolunuz açık olsun," dedi, bir kere, herkese. Sonra kendi işine döndü; yarın yeni bir bölük geliyor ve onlar bu kapıdan senin yirmi sekiz gün önce baktığın gibi bakacak.',
        },
      ],
    },
    {
      id: 'd28-nizamiye',
      from: '09:00',
      to: '09:30',
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
          text: 'Avlu, kantin, ankesör, bayrak direği. Her birinin önünden sivil kıyafetle geçtin ve hiçbiri seni tanımadı. Nizamiyede nöbetçi er senden sonra gelen bölükten; seni hiç görmedi. Elini uzattı: "Belge."',
        },
        {
          kind: 'anlati',
          id: 'd28-n-son',
          sprite: 'kisla',
          text: 'Belgeyi uzattın. Kapının öbür tarafında bir şey bekliyor, ne olduğunu biliyorsun ama görmeden bilmek başka. Nöbetçi kâğıda bakıyor. Yirmi sekiz gün önce bu kapıdan girerken arkana bakmamıştın. Şimdi önüne bakıyorsun.',
        },
      ],
    },
  ],
};
