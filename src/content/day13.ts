import type { Day } from '../engine/types';

/**
 * 13. gün — ÖLÇÜM. Kondisyon ölçümü: şınav, mekik, koşu. On iki günün
 * bedende ne bıraktığı bir kâğıda yazılıyor. Gece nöbet (görev takvimi),
 * ikincisi. Telefonda annenin ya da kankanın yemeğini özlediğini
 * söylediysen (ev_yemegi) akşam yemekhanede o özlem tabağa oturuyor.
 * Telefon g13 sevgili eksenini ikiye ayırıyor; gün aynı "ölçülme" duygusunu
 * taşıyor.
 */
export const gun13: Day = {
  day: 13,
  title: 'Ölçüm',
  epigraph: 'Bugün bir kâğıda senin hakkında sayılar yazılacak.',
  blocks: [
    {
      id: 'd13-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-k1',
          sprite: 'duduk',
          text: 'On üçüncü sabah. Panoda iki kâğıt var: biri bu gecenin nöbet listesi, öbürü "Kondisyon ölçümü — 08:00, eğitim sahası". İkisinde de adın yazıyor.',
        },
        {
          kind: 'mini',
          id: 'd13-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Ölçüm günü. Yatak ölçülmüyor ama Onbaşı her gün ölçüyor.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Köşeler keskin. Bugünün ilk sayısı tam puan.'
              : s > 0.55
                ? 'Olur. Aklın sahada.'
                : 'Battaniye kaydı. Günün ilk ölçümü kötü geçti.',
        },
      ],
    },
    {
      id: 'd13-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün şınav, mekik, koşu. Sayılar dosyanıza girer. Dosyayı kimse okumaz ama dosya vardır. Birbirinize saydırmak yok, ben sayarım.',
        },
        {
          kind: 'mini',
          id: 'd13-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Sıra ölçüm için boylara göre yeniden dizildi; yerin değişti.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Yeni yerini ilk seferde buldun.'
              : s > 0.5
                ? 'Eski yerine gidip geri döndün. Kimse fark etmedi sayılır.'
                : 'İki sıra arasında kaldın. Çavuş seni eliyle yerine itti.',
        },
      ],
    },
    {
      id: 'd13-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-m1',
          sprite: 'postal',
          text: 'Mıntıkada herkes bacaklarını esnetiyor. Emre bir yandan izmarit topluyor, bir yandan eğilip kalkmayı "ısınma" sayıyor.',
        },
      ],
    },
    {
      id: 'd13-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-ka1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: '"Koşudan önce yemek dert, yememek de dert." Serkan iki yumurtayı tepsisinden alıp masanın ortasına koydu. "Borsa açık. Yumurta bugün değerli."',
          choices: [
            {
              id: 'd13-ka-hafif',
              label: 'Hafif ye, midende ağırlık olmasın',
              effect: { enerji: -2, kondisyon: 2 },
              outcome: 'Yarım ekmek, bir bardak çay. Karnın biraz aç ama bacakların hafif.',
            },
            {
              id: 'd13-ka-yumurta',
              label: 'Serkan\'ın yumurtasını al',
              effect: { enerji: 4, para: -15, dostluk: { kim: 'serkan', puan: 2 } },
              outcome: 'On beş lira. Serkan deftere yazdı: "Ölçüm günü fiyatı." Yarın normal fiyata dönecekmiş.',
            },
          ],
        },
      ],
    },
    {
      id: 'd13-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Kondisyon Ölçümü',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-e1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Önce şınav. İki dakika. Göğüs yere değmezse sayılmaz, kalça havada kalırsa sayılmaz. Ben "bir" demeden sen bir deme.',
        },
        {
          kind: 'anlati',
          id: 'd13-e2',
          sprite: 'askerSerkan',
          text: 'Onbaşı iki sıra ötede başkasını sayıyor. Senin yanına sayması için Serkan düştü. Otuzu geçtiğinde kolların titriyor; Serkan göz kırpıp fısıldadı: "Kaç yazayım?"',
          choices: [
            {
              id: 'd13-sinav-dogru',
              label: '"Kaç yaptıysam onu"',
              effect: { disiplin: 4, moral: -1, dostluk: { kim: 'serkan', puan: 2 } },
              outcome: 'Otuz dört. Serkan dürüstçe yazdı, sonra kâğıda bakıp "fena değil" dedi. Hesabı bilen biri söyleyince inanıyorsun.',
            },
            {
              id: 'd13-sinav-kirk',
              label: '"Kırk yaz"',
              effect: { moral: 3, disiplin: -4, dostluk: { kim: 'serkan', puan: 1 } },
              outcome: 'Kırk. Serkan yazdı ve defterine ayrıca bir şey not etti. Onbaşı kâğıdı toplarken seninkinde bir saniye fazla durdu.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd13-e3',
          sprite: 'engel',
          text: 'Mekik geçti, kimse sayısını hatırlamıyor. Sonra saha kenarında düdük: üç bin metre, süreli. Pist toprak, kenarda Çavuş elinde kronometreyle bekliyor.',
        },
        {
          kind: 'mini',
          id: 'd13-e4',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Koşu: üç bin metre, pist etrafında yedi buçuk tur. Temponu koru; ilk turda koşan son turda yürür.',
          reward: (s) => ({
            kondisyon: Math.round(-4 + s * 11),
            disiplin: Math.round(-3 + s * 6),
            enerji: -18,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'On dört dakikanın altında. Çavuş kronometreye iki kez baktı.'
              : s > 0.5
                ? 'Ortalarda bitirdin. Son turda biri seni geçti, sen de birini.'
                : 'Son iki turu yürüdün. Kâğıda süre yerine "tamamladı" yazıldı.',
        },
      ],
    },
    {
      id: 'd13-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-o1',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"On üç dakika kırk saniye." Emre kâğıdı yüksek sesle okudu, sonra katlayıp cebine koydu. "Sivilde merdiven çıkınca soluyordum. Bunu karıma göstereceğim."',
          choices: [
            {
              id: 'd13-emre-tebrik',
              label: '"Helal olsun"',
              effect: { moral: 3, dostluk: { kim: 'emre', puan: 4 } },
              outcome: 'Emre kâğıdı bir daha açtı, bir daha okudu. Yemeğin geri kalanında iki kez daha okudu.',
            },
            {
              id: 'd13-emre-kiyas',
              label: 'Kendi süreni söyle',
              effect: { moral: 1, dostluk: { kim: 'emre', puan: -1 } },
              outcome: 'Emre sayıları karşılaştırdı, bir şey demedi. Kâğıdı cebinden bir daha çıkarmadı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd13-talim',
      from: '13:30',
      to: '16:30',
      title: 'Nizam Talimi',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-t1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Sabah bacaklarınızı ölçtük, öğleden sonra kulaklarınızı. Sağa dön, sola dön, geri dön. Komutu duyan döner, tahmin eden yanlış döner.',
        },
        {
          kind: 'anlati',
          id: 'd13-t2',
          text: 'Üçüncü turda bacakların sabahki koşuyu hatırladı. "Geri dön" komutunda ağırlığın yanlış ayağa bindi.',
          choices: [
            {
              id: 'd13-talim-dik',
              label: 'Sendelemeden toparlan, dik dur',
              effect: { disiplin: 4, enerji: -5 },
              outcome: 'Bir an eğildin, düzeldin. Onbaşı görmedi ya da görmezden geldi.',
            },
            {
              id: 'd13-talim-bos',
              label: 'Sendele, geç',
              effect: { disiplin: -3, enerji: 2 },
              outcome: 'Sıra dalgalandı. Onbaşı "yorgun olan kendini değil sırayı bozar" dedi ve bir tur daha yaptırdı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd13-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Ölçüm sonuçları dosyaya girdi. Bölük ortalaması ilk haftadan iyi. Kimse sevinmesin: iyi olan ortalama, siz değilsiniz. Bu gece nöbet listesi ikinci tur.',
        },
      ],
    },
    {
      id: 'd13-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-ay1',
          sprite: 'tepsi',
          text: 'Koşudan sonra yemekhanede kimse konuşmuyor. Çatal sesinden başka bir şey yok; bu da bir tür sohbet.',
        },
        {
          kind: 'anlati',
          id: 'd13-ay-ev',
          sprite: 'yemekhaneMasa',
          kosul: { isaret: 'ev_yemegi', isaretDeger: 'ozledi' },
          text: 'Bugün kuru fasulye çıktı. Telefonda evin yemeğini özlediğini söylemiştin; ilk kaşıkta bunun o olmadığını biliyordun, ikincide yine de gözünü kapattın.',
          choices: [
            {
              id: 'd13-ev-hayal',
              label: 'Gözün kapalı ye, evdeymiş gibi',
              effect: { moral: 4, enerji: 2 },
              outcome: 'Üç kaşık boyunca işe yaradı. Dördüncüde tepsinin kenarı eline değdi ve yemekhaneye döndün.',
            },
            {
              id: 'd13-ev-liste',
              label: 'Çıkınca ilk yiyeceğin şeyi düşün',
              effect: { moral: 2 },
              outcome: 'Liste uzadı. Kuru fasulye listede yok; bu yemekhanenin sana verdiği tek şey belki de bu listeydi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd13-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-s1',
          text: 'Avluda herkes bacaklarını ovuyor. Ankesörün önünde kuyruk yine uzun; kondisyon puanını evine söyleyen de var, söylemeyen de. Nöbetten önce birkaç saat uyuyabilirsin.',
        },
      ],
    },
    {
      id: 'd13-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd13-sy1',
          sprite: 'ay',
          text: 'On üç gün bitti, on beş kaldı. Bacakların yatağa girince sızladı. Saat 01:45\'te omzunda bir el: "Kalk, nöbet." İkinci nöbet ilkinden kolay değil; sadece yolunu biliyorsun.',
        },
      ],
    },
  ],
};
