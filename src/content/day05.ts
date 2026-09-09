import type { Day } from '../engine/types';

export const gun05: Day = {
  day: 5,
  title: 'Nezaket Dersi',
  epigraph: 'Bugün silah yok, kâğıt var.',
  blocks: [
    {
      id: 'd5-kalkis',
      from: '06:00',
      to: '06:30',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-k1',
          sprite: 'duduk',
          text: 'Beşinci gün. Düdükten önce uyanmayı öğrendin, yatağı düşünmeden topluyorsun. Vücudun programı ezberledi, sıra kafada.',
        },
        {
          kind: 'mini',
          id: 'd5-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Artık rutin. Yine de çubuk her gün biraz daha hızlı.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 15), moral: Math.round(-2 + s * 5) }),
          verdict: (s) =>
            s > 0.85
              ? 'Düşünmeden yaptın. Beş gün önce bu yatak seni ağlatıyordu.'
              : s > 0.55
                ? 'Yetişti. Kenar bir daha çekildi ama kimse görmedi.'
                : 'Bugün elin ağır. Onbaşı geçerken battaniyeye baktı.',
        },
        {
          kind: 'anlati',
          id: 'd5-ko1',
          sprite: 'postal',
          text: 'Dolap düzeni, postal, askı. Beş günde bu işin kaç adım olduğunu öğrendin ve artık saymıyorsun.',
        },
      ],
    },
    {
      id: 'd5-ictima',
      from: '06:30',
      to: '07:00',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün eğitim sahasına çıkmıyorsunuz. Bugün sınıftasınız. Askerliğin yarısı ne yaptığın, yarısı nasıl davrandığındır. Bugün ikincisini öğreneceksiniz.',
        },
        {
          kind: 'mini',
          id: 'd5-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Beşinci gün, artık standart bekleniyor.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 16), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Bölük tek ses. Çavuş sıranın önünden hızlı geçti.'
              : s > 0.5
                ? 'Ufak bir gecikme. Kimse üstünde durmadı.'
                : 'Geç kaldın. Beşinci günde bu affedilmiyor.',
        },
      ],
    },
    {
      id: 'd5-mintika',
      from: '07:00',
      to: '07:30',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-m1',
          sprite: 'postal',
          text: 'Avlu her sabah aynı avlu, izmaritler her sabah yeni. Beşinci günde artık nereye bakacağını biliyorsun.',
        },
      ],
    },
    {
      id: 'd5-kahvalti',
      from: '07:30',
      to: '08:30',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-ka1',
          sprite: 'tepsi',
          text: 'Emre karşına oturdu: "Bugün ders varmış. Ben okulu sevmezdim ama burada sınıf, sahadan iyidir. En azından oturuyorsun."',
        },
      ],
    },
    {
      id: 'd5-ders',
      from: '08:30',
      to: '12:00',
      title: 'ANT-41 Dersi',
      sprite: 'defter',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-e1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Elinizdeki kâğıdın adı ANT-41. Askerî nezaket kuralları. Kimin ne dediği, kime nasıl cevap verildiği, hangi kapıdan nasıl girildiği burada yazıyor.',
        },
        {
          kind: 'anlati',
          id: 'd5-e2',
          sprite: 'defter',
          speaker: 'Onbaşı Recep',
          text: 'Sizi sınava çekmeyeceğim. Burada ezber sökmez, alışkanlık söker. Bu maddeleri bugün okuyacaksınız, kalan yirmi üç günde de yaşayacaksınız. Okuyun.',
        },
        {
          kind: 'ders',
          id: 'd5-e3',
          brief: 'Bölümlere sırayla göz at. Acele yok, sınavı yok.',
        },
        {
          kind: 'anlati',
          id: 'd5-e4',
          text: 'Kâğıdı katlayıp cebine koydun. Çoğu şey zaten yaptığın şeylerin adı konmuş hâliymiş — ama bazıları bugüne kadar yanlış yaptığın şeylermiş.',
          choices: [
            {
              id: 'd5-ant-defter',
              label: 'Önemli maddeleri deftere geçir',
              effect: { disiplin: 9, moral: 3, enerji: -5 },
              gerekliEsya: 'defterKalem',
              outcome:
                'Yazarken aklında kaldı. "Komutanlarla görüşmeye defter ve kalemle gidilir" maddesini yazarken güldün — zaten öyle yapıyordun.',
            },
            {
              id: 'd5-ant-oku',
              label: 'Bir daha baştan oku',
              effect: { disiplin: 6, enerji: -4 },
              outcome: 'İkinci okumada "ast üstün solunda yürür" maddesi gözüne çarptı. Dün tam tersini yapmışsın.',
            },
            {
              id: 'd5-ant-gec',
              label: 'Kâğıdı kaldır, yeter',
              effect: { disiplin: -3, moral: 4, enerji: 3 },
              outcome: 'Dört saat sınıfta oturmak da yorucu. En azından bugün koşmadın.',
            },
          ],
        },
      ],
    },
    {
      id: 'd5-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-o1',
          sprite: 'tepsi',
          text: 'Yemekhanede Onbaşı masaya yaklaştı. Bölükten biri refleksle "tamam komutanım" dedi ve kendini yakaladı: "Emredersiniz." Onbaşı başını salladı ve geçti. Ders tutmuş.',
        },
      ],
    },
    {
      id: 'd5-talim',
      from: '13:30',
      to: '16:30',
      title: 'Uygulama',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Öğleden sonra uygulama. Kapı çalma, izin isteme, selamlama. Sabah okuduğunuz kâğıt ayağa kalkacak. Sırayla geleceksiniz.',
        },
        {
          kind: 'anlati',
          id: 'd5-t2',
          text: 'Sıra sana geldi. Kapıyı çaldın, "Gel" sesini bekledin, iki saniye durdun, girdin, selam verdin, masanın üç adım gerisinde durdun.',
          choices: [
            {
              id: 'd5-uyg-tam',
              label: 'Sözünü "Arz ederim" ile bitir',
              effect: { disiplin: 11, moral: 5 },
              outcome: 'Çavuş arkana yaslandı. "Bu bölükte ilk doğru yapan sensin." Bölük sana baktı.',
            },
            {
              id: 'd5-uyg-tamam',
              label: '"Tamam komutanım" de',
              effect: { disiplin: -6, moral: -3 },
              outcome: '"Tamam ne demek?" Bütün bölüğün önünde maddeyi yüksek sesle okudun.',
            },
          ],
        },
      ],
    },
    {
      id: 'd5-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün kâğıt okudunuz. Yarın sahadasınız ve o kâğıt sizinle geliyor. Bir daha "ağabey" diyeni duymayacağım.',
        },
      ],
    },
    {
      id: 'd5-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-ay1',
          sprite: 'tepsi',
          text: 'Serkan sofrada: "Ben o kâğıdın yarısını zaten biliyordum. Esnaflık da aynı iş — kime nasıl konuşacağını bileceksin, gerisi teferruat."',
        },
      ],
    },
    {
      id: 'd5-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-s1',
          text: 'Koğuşta birkaç kişi hâlâ ANT-41 kâğıdına bakıyor. Biri yüksek sesle okuyor, diğerleri düzeltiyor. Beş gün önce birbirini tanımayan adamlar.',
        },
      ],
    },
    {
      id: 'd5-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd5-sy1',
          sprite: 'ay',
          text: 'Işıklar söndü. Yirmi üç gün kaldı. Bugün hiç koşmadın, hiç ter dökmedin — ama akşam yoklamasında sırtın dünkünden dik duruyordu.',
        },
      ],
    },
  ],
};
