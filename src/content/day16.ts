import type { Day } from '../engine/types';

/**
 * 16. gün — YORGUNLUK. Dün akşam fark edilen kabarcık bu sabah yara.
 * Revir dalı: sabah herkes yarayla karşılaşıyor (revire uğra / idare et);
 * kötü giden oyuncuyu (moral 45 ve altı) Çavuş talimin ortasında kendisi
 * revire gönderiyor ve öğleden sonra istirahat büyük bir toparlanma.
 * Gece nöbet var (görev takvimi). Sevgili 15. günde sürpriz planladığını
 * söylediyse (sevgili_surpriz) öğle postasında ondan bir kart geliyor.
 * Akşam telefonda ayağı anlatmanın zemini (g16 → hasta_oldu) burada.
 */
export const gun16: Day = {
  day: 16,
  title: 'Yorgunluk',
  epigraph: 'Beden on beş gün sustu. Bugün konuşuyor.',
  blocks: [
    {
      id: 'd16-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-k1',
          sprite: 'duduk',
          text: 'Düdük. Ayağını yere bastığında dünkü kabarcık patlamış, çorap yaraya yapışmış. Postalı giymeden önce bir saniye durdun.',
          choices: [
            {
              id: 'd16-ayak-revir',
              label: 'Kahvaltıdan önce revire uğra',
              effect: { disiplin: -2, kondisyon: 4, enerji: 3 },
              outcome: 'Revirdeki er yarayı temizledi, bantladı, bir çift yedek çorap verdi. "Kuru tut. Kuru tutamazsın ama kuru tut." İçtimaya son giren sendin.',
            },
            {
              id: 'd16-ayak-idare',
              label: 'Bantla, idare et',
              effect: { kondisyon: -4, moral: -1 },
              outcome: 'Tuvalet kâğıdı ve bant. Postalın içinde her adımda yeniden hatırlıyorsun.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd16-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'On altıncı yatak. Tek ayağın üstünde toplanıyor.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Ayağın ne derse desin elin işini biliyor.'
              : s > 0.55
                ? 'Olur. Bugün "olur" yeter.'
                : 'Topallarken yatak da topal kaldı.',
        },
      ],
    },
    {
      id: 'd16-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yarıyı geçtiniz, beden bunu biliyor. Bugün herkes bir yerinden şikâyet edecek. Şikâyet edin, ama yürüyün. Revir açık; yalan söyleyen revire bir kere gider.',
        },
        {
          kind: 'mini',
          id: 'd16-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Sıranın yarısı bir ayağından ötekine ağırlık veriyor.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Dimdik. Ayağını kimse görmedi.'
              : s > 0.5
                ? 'Normal. Hafif bir yalpa, Çavuş görmezden geldi.'
                : 'Sıra kaydı, sen de kaydın. "Ayağın mı?" diye sordu. "Yok komutanım." Yalan.',
        },
      ],
    },
    {
      id: 'd16-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-m1',
          sprite: 'postal',
          text: 'Mıntıkada eğilip kalkmak ayağa değil, bele vuruyor. Herkes bir yerinden topallıyor; bölük yavaş çekimde çalışıyor.',
        },
      ],
    },
    {
      id: 'd16-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-ka1',
          sprite: 'askerTolga',
          speaker: 'Tolga',
          text: 'Tolga masanın altından bir paket uzattı: pudra. "Pişik için ama ayağa da iyi gelir. Çorabın içine. Babam hep öyle yapardı." Babasından ilk defa bahsetti.',
          choices: [
            {
              id: 'd16-tolga-al',
              label: 'Al, teşekkür et',
              effect: { kondisyon: 2, moral: 2, dostluk: { kim: 'tolga', puan: 4 } },
              outcome: 'Pudra işe yaradı, biraz. Babası hakkında başka bir şey sormadın; o da anlatmadı.',
            },
            {
              id: 'd16-tolga-baba',
              label: '"Baban da mı asker?" diye sor',
              effect: { moral: 1, dostluk: { kim: 'tolga', puan: 2 } },
              outcome: '"Uzun hikâye." Paketi yine de eline bıraktı. Hikâye başka bir güne kaldı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd16-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Uzun Yürüyüş',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-e1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'On iki kilometre, teçhizatla. Durmak yok, oturmak yok. Suyunuzu idareli için, yolda çeşme yok.',
        },
        {
          kind: 'mini',
          id: 'd16-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'On iki kilometre. İlk dördü bacak, ikinci dördü nefes, son dördü kafa.',
          reward: (s) => ({
            kondisyon: Math.round(-4 + s * 10),
            disiplin: Math.round(-3 + s * 7),
            enerji: -18,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'On iki kilometre, tempo hiç düşmedi. Ayağın kanıyordu, farkına varışta vardın.'
              : s > 0.5
                ? 'Son kilometrelerde düştün, kalktın. Vardın.'
                : 'Son üç kilometrede sıranın sonundaydın. Çavuş yanında yürüdü, hiç konuşmadı.',
        },
      ],
    },
    {
      id: 'd16-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-o1',
          sprite: 'tepsi',
          text: 'Yemekhanede kimse konuşmuyor; çatallar bile yavaş. Masanın altında on iki postal, çoğunun bağcığı gevşetilmiş.',
        },
        {
          kind: 'anlati',
          id: 'd16-o-kart',
          sprite: 'defter',
          kosul: { isaret: 'sevgili_surpriz', isaretDeger: 'var' },
          text: 'Posta dağıtıldı. Senin adına küçük bir zarf: içinde tek bir kart, üstünde sadece bir tarih. Çıkış günün. Altında: "Sürpriz bu değil."',
          choices: [
            {
              id: 'd16-kart-sakla',
              label: 'Kartı göğüs cebine koy',
              effect: { moral: 6, enerji: 2 },
              outcome: 'Öğleden sonra her yorulduğunda cebine dokundun. Kâğıt ısınmıştı.',
            },
            {
              id: 'd16-kart-goster',
              label: 'Emre\'ye göster',
              effect: { moral: 4, dostluk: { kim: 'emre', puan: 3 } },
              outcome: 'Emre kartı iki kez çevirdi. "Sürpriz bu değilse sürpriz ne lan?" Bütün öğleden sonra tahmin yürüttü.',
            },
          ],
        },
      ],
    },
    {
      id: 'd16-talim',
      from: '13:30',
      to: '16:30',
      title: 'Talim',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-t1',
          text: 'Yürüyüşün üstüne talim. Sıra dönerken ayağın yere her değişinde postalın içinde bir şey kayıyor.',
          choices: [
            {
              id: 'd16-talim-dayan',
              label: 'Belli etme, devam et',
              effect: { disiplin: 5, kondisyon: -3, enerji: -6 },
              outcome: 'Çavuş bir şey görmedi. Sen gördün: çorabın koyulaştı.',
            },
            {
              id: 'd16-talim-soyle',
              label: 'Onbaşıya ayağını söyle',
              effect: { disiplin: -2, kondisyon: 2, enerji: -2 },
              outcome: 'Onbaşı baktı, "sıranın sonuna geç" dedi. Dönüşlerde daha az adım attın. Kimse sana laf etmedi.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd16-t-revir',
          sprite: 'revir',
          speaker: 'Çavuş Kaya',
          kosul: { moralMax: 45 },
          text: 'Talimin ortasında Çavuş sırayı durdurdu, doğrudan sana geldi. Yüzüne baktı. "Sen. Çık sıradan. Revire. Akşam içtimasına kadar istirahat. Nöbetin duruyor, o yüzden şimdi uyu." Tartışma değildi.',
          choices: [
            {
              id: 'd16-revir-git',
              label: '"Emredersiniz komutanım"',
              effect: { enerji: 24, kondisyon: 9, moral: 5, disiplin: -3 },
              outcome: 'Revirdeki yatak kışladakinden yumuşak değildi ama sessizdi. Ayağın temizlendi. Üç saat uyudun. Uyandığında on altı günden beri ilk defa bir şey acımıyordu.',
            },
            {
              id: 'd16-revir-direnme',
              label: '"İyiyim komutanım, devam ederim"',
              effect: { enerji: 10, kondisyon: 4, moral: 2, disiplin: -1 },
              outcome: '"Sana sormadım." Yine de gittin. Bir saat sonra kendin döndün; Çavuş seni sıranın sonuna koydu ve bir daha bakmadı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd16-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Nöbet listesi. 02:00–04:00: adın. Ayağı olan nöbette oturmaz, ayakta durur. Ayak da bunu öğrenir.',
        },
      ],
    },
    {
      id: 'd16-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-ay1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: 'Serkan termosu yine önüne koydu. "Yine nöbet. Bu sefer deftere yazıyorum." Yazdı. Tutarın yanına küçük bir ayak çizdi.',
        },
      ],
    },
    {
      id: 'd16-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-s1',
          text: 'Postalı çıkardın, çorabı yavaşça. Yara dünkünden büyük değil ama dünkünden kırmızı. Ankesörde sıra var; evden biri sesinden anlar, bunu biliyorsun.',
        },
      ],
    },
    {
      id: 'd16-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd16-sy1',
          sprite: 'ay',
          text: 'On altı gün bitti, on iki kaldı. Uyumaya çalıştın; ayağın zonkluyordu. Saat 01:45\'te omzuna dokundular. Bu nöbet öncekilerden ağır.',
        },
      ],
    },
  ],
};
