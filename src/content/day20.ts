import type { Day } from '../engine/types';

/**
 * 20. gün — SÖZ. Telefonda oyunun en uzun callback'i kapanıyor (5. günde
 * sevgiline "çıkınca ilk kimi göreceksin" demiştin). Kışlada da sözler
 * veriliyor: Emre bir sofra kuruyor, Serkan bir iş teklif ediyor. Dün annene
 * yatak toplamayı öğrendiğini söylediysen (yatak_ogrendi) bu sabah o yatağa
 * bakıp evdeki odanı düşünüyorsun.
 */
export const gun20: Day = {
  day: 20,
  title: 'Söz',
  epigraph: 'Burada verilen sözler dışarıda tutulur mu, sekiz gün sonra belli olacak.',
  blocks: [
    {
      id: 'd20-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-k1',
          sprite: 'duduk',
          text: 'Yirminci sabah. Kapıdaki tebeşirde "9" çizilmiş, yanına "8" yazılmış. Yazanı hâlâ kimse bilmiyor; herkes birbirinin ellerine bakıyor, tebeşir tozu arıyor.',
        },
        {
          kind: 'anlati',
          id: 'd20-k-oda',
          sprite: 'ranzaToplu',
          kosul: { isaret: 'yatak_ogrendi', isaretDeger: 'evet' },
          text: 'Dün annene yatak toplamayı öğrendiğini söylemiştin. "Bu askerliğin tek faydası olur," demişti. Bu sabah battaniyenin kenarını kıvırırken evdeki yatağını düşündün: çift kişilik, yumuşak, hiçbir zaman toplanmamış.',
          choices: [
            {
              id: 'd20-oda-soz',
              label: 'Kendine söz ver: evde de toplayacaksın',
              effect: { disiplin: 3, moral: 2 },
              outcome: 'Verdin. İlk hafta tutacağını biliyorsun. İkinci haftayı bilmiyorsun; bunu da biliyorsun.',
            },
            {
              id: 'd20-oda-gul',
              label: 'Güldür geç: evde kimse bakmıyor',
              effect: { moral: 3 },
              outcome: 'Evde Onbaşı yok. Bunu düşünmek bir anda çok hoşuna gitti, sonra bir anda garip geldi.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd20-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Sekiz yatak kaldı. Sayıyla toplanıyor artık.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Tek hamlede. Çarşaf bile senin tarafında.'
              : s > 0.55
                ? 'Olur. Kafan sekizde, eller yatakta.'
                : 'Köşe kalkık. Sekiz gün kaldı diye yatak affetmiyor.',
        },
      ],
    },
    {
      id: 'd20-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Terhis işlemleri dört gün sonra başlıyor. O güne kadar kimse evrak sormayacak, kimse izin sormayacak. Yemine altı gün var. Altı gün boyunca ben size soracağım.',
        },
        {
          kind: 'mini',
          id: 'd20-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Çavuş bugün adları daha yavaş okuyor, sanki her birini tartıyor.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Adın, cevabın, sessizlik. Olması gerektiği gibi.'
              : s > 0.5
                ? 'Yarım saniye geç. Çavuş duydu ama devam etti.'
                : 'Dalgındın. "Sivil misin?" dedi. Sıra güldü, sen gülemedin.',
        },
      ],
    },
    {
      id: 'd20-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-m1',
          sprite: 'postal',
          text: 'Mıntıkada yeni gelen bölüğün ilk sabahı. Senin köşenin yanındaki köşede biri süpürgeyi ters tutuyor. Yirmi gün önce sen de öyle tutuyordun.',
          choices: [
            {
              id: 'd20-yeni-goster',
              label: 'Yanına git, süpürgeyi göster',
              effect: { moral: 3, enerji: -2 },
              outcome: '"Sapı böyle, çalı aşağıda." Çocuk teşekkür etti ve sana "abi" dedi. Burada sana ilk kez abi diyen biri oldu.',
            },
            {
              id: 'd20-yeni-birak',
              label: 'Kendi köşene bak',
              effect: { disiplin: 2 },
              outcome: 'Öğrenecek. Senin kimse göstermedi, sen de öğrendin. Bu cümle aklına gelince hoşuna gitmedi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd20-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-ka1',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Söz veriyorum," dedi Emre ve çayını masaya vurdu. "Çıktıktan sonraki ilk cumartesi, hepiniz bende. Kuzu çevireceğim. Bahçe var, mangal var. Adres de yazarım. Gelmeyen varsa ben gelip alırım."',
          choices: [
            {
              id: 'd20-emre-soz',
              label: '"Geliyorum. Söz."',
              effect: { moral: 5, dostluk: { kim: 'emre', puan: 5 } },
              outcome: 'Emre peçeteye adresini yazdı, dört kopya. Seninkini katladın, künyenin yanına koydun.',
            },
            {
              id: 'd20-emre-bakariz',
              label: '"Bakarız, çıkınca kimin nesi olur belli olmaz"',
              effect: { moral: -2, disiplin: 1, dostluk: { kim: 'emre', puan: -2 } },
              outcome: 'Emre bir saniye sustu. "Doğru," dedi. Yine de peçeteye yazdı ve önüne bıraktı. Peçete tepsiyle birlikte gitti.',
            },
          ],
        },
      ],
    },
    {
      id: 'd20-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Arazi Yürüyüşü',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-e1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'On iki kilometre, teçhizatlı. Bu dönemin en uzun yürüyüşü. Son kilometreyi bitiren bölük yemin günü düz yürür; bitiremeyen yemin günü de bitiremez.',
        },
        {
          kind: 'mini',
          id: 'd20-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'On iki kilometre. İlk sekizi bacak yürür, son dördü kafa.',
          reward: (s) => ({
            kondisyon: Math.round(-4 + s * 10),
            disiplin: Math.round(-3 + s * 7),
            enerji: -18,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'On iki kilometre, tempo hiç düşmedi. Bacakların yirmi gün önceki bacaklar değil.'
              : s > 0.5
                ? 'Onuncu kilometrede bir iki kez düştün, toparladın.'
                : 'Son üç kilometreyi kamyonet kasasında gördün. Bölük seni camdan izledi.',
        },
        {
          kind: 'anlati',
          id: 'd20-e3',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: 'Molada Serkan yanına çöktü, suyunu uzattı. "Ciddi bir şey diyeceğim," dedi, ki bu ondan ilk defa geliyor. "Benim dükkân büyüyor. Güvendiğim adam lazım. Burada yirmi gün seni izledim. Çıkınca bir ara, konuşalım."',
          choices: [
            {
              id: 'd20-serkan-ara',
              label: '"Ararım"',
              effect: { moral: 4, dostluk: { kim: 'serkan', puan: 5 } },
              outcome: 'Serkan defterini açtı, son sayfaya adını yazdı, altına "ararsa" diye not düştü. Bu sayfada borç yok.',
            },
            {
              id: 'd20-serkan-sakala',
              label: '"Defterine borç yazarsın bunu da"',
              effect: { moral: 2, dostluk: { kim: 'serkan', puan: 1 } },
              outcome: 'Güldü. "Yazarım tabii." Ama defteri açmadı. Teklif havada kaldı; ne geri alındı ne cevap verildi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd20-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-o1',
          sprite: 'yemekhaneMasa',
          text: 'Yürüyüşten sonra yemekhanede kimse konuşmadı. Emre de. Emre\'nin konuşmadığı öğle yemekleri artık bu dönemin kısa bir listesi.',
        },
      ],
    },
    {
      id: 'd20-talim',
      from: '13:30',
      to: '16:30',
      title: 'Tören Provası',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün tribünün önünden üç geçiş. Başlar sağa, gözler sancakta. Sandalyeler hâlâ boş; tören günü dolu olacak. Boşken yapamayan doluyken hiç yapamaz.',
        },
        {
          kind: 'anlati',
          id: 'd20-t2',
          text: 'İkinci geçişte yanındaki er adımı kaçırdı, sıra dalgalandı. Senin adımın onunkine uydu mu, sıranınkine mi?',
          choices: [
            {
              id: 'd20-prova-sira',
              label: 'Sıranın adımında kal',
              effect: { disiplin: 5 },
              outcome: 'Kaldın. Yanındaki toparladı, sıra düzeldi. Çavuş ikinci geçişi saymadı ama seni de çağırmadı.',
            },
            {
              id: 'd20-prova-uy',
              label: 'Yanındakine uy, onu yalnız bırakma',
              effect: { disiplin: -3, moral: 2 },
              outcome: 'İkiniz birlikte yanlış adımdaydınız. Çavuş ikinizi öne aldı. Yanındaki sana sonra bir sigara ikram etti; içmesen de aldın.',
            },
          ],
        },
      ],
    },
    {
      id: 'd20-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bu akşam liste yok. Bu akşam kimse kalmıyor. Buna alışmayın.',
        },
      ],
    },
    {
      id: 'd20-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-ay1',
          sprite: 'askerEmre',
          text: 'Emre bir parmağını daha kapattı. Sekiz. Tolga ilk defa onu izledi ve kendi eline baktı; parmaklarını kapatmadı.',
        },
      ],
    },
    {
      id: 'd20-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-s1',
          text: 'Ankesörün önünde kuyruk. Bu akşam herkes bir şey söz veriyor: gelirim, ararım, getiririm. Telefonda verilen sözün süresi sekiz gün.',
        },
      ],
    },
    {
      id: 'd20-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd20-sy1',
          sprite: 'ay',
          text: 'Yirmi gün bitti, sekiz kaldı. Bugün kaç söz verdin, yatınca saydın. Hangisini tutacağını bilmiyorsun; hepsini verirken tutacaktın.',
        },
      ],
    },
  ],
};
