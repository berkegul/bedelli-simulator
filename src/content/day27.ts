import type { Day } from '../engine/types';

/**
 * 27. gün — SON GECE. Nöbet de ceza da yok. Yarın yemin töreni ve çıkış.
 * Gündüz teslim başlıyor: yedek battaniye, matara, teçhizat. Gece koğuşta üç veda: Emre, Tolga, Serkan.
 * Vedalar dostluk puanına bağlı değil, herkese geliyor; ne söyleyeceğin
 * seçim. Telefonun son gecesi (g27) serbest zamanda.
 */
export const gun27: Day = {
  day: 27,
  title: 'Son Gece',
  epigraph: 'Yarın bu saatte bu koğuşta başka biri uyuyacak.',
  blocks: [
    {
      id: 'd27-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-k1',
          sprite: 'duduk',
          text: 'Yirmi yedinci sabah. Düdük çaldı ve ilk defa kimse "beş dakika daha" demedi. Beş dakikanın kıymeti değişti; artık kalan dakikalar sayılıyor, uyunmuyor.',
        },
        {
          kind: 'mini',
          id: 'd27-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Sondan bir önceki yatak. Yarın bu çarşafı teslim edeceksin.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 11), moral: Math.round(-1 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Köşeler keskin. Elin bunu bir süre daha yapacak, istesen de istemesen de.'
              : s > 0.55
                ? 'Toplandı. Yarın bir kez daha, sonra bir daha hiç.'
                : 'Gevşek. Onbaşı geçti, baktı, geçti. Artık o da sayıyor.',
        },
      ],
    },
    {
      id: 'd27-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün son tam gün. Kimse yarın çıkıyorum diye bugün çıkmış gibi davranmasın. Kışla sizi yarın yeminden, evraktan sonra bırakır, bir dakika önce değil.',
        },
        {
          kind: 'mini',
          id: 'd27-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Sondan bir önceki.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Tam zamanında. Sesin yirmi yedi gün önceki sesin değil.'
              : s > 0.5
                ? 'Normal. Çavuş başını kaldırmadan geçti.'
                : 'Geç. "Yarın da mı?" dedi Çavuş. Yarın da.',
        },
      ],
    },
    {
      id: 'd27-kahvalti',
      from: '06:30',
      to: '07:30',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-ka1',
          sprite: 'yemekhaneMasa',
          text: 'Yemekhanedeki çaycı er seninle aynı gün gelmişti. Bugün bardağını doldururken "yarın mı?" diye sordu. Yarın. "Ben daha on dört gün buradayım," dedi, çaydanlığı kaldırdı. Sana ilk defa iki şeker attı.',
        },
      ],
    },
    {
      id: 'd27-egitim-sabah',
      from: '07:30',
      to: '12:00',
      title: 'Son Yürüyüş',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-e1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Son yürüyüş. İlk gün yürüdüğünüz yol, aynı tempo. İlk gün dört kişi kamyonete binmişti. Bugün kimse binmeyecek; kamyonet de yok zaten.',
        },
        {
          kind: 'mini',
          id: 'd27-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'İlk günün yolu. Tempo aynı, bacaklar değil.',
          reward: (s) => ({
            kondisyon: Math.round(-2 + s * 9),
            disiplin: Math.round(-3 + s * 7),
            enerji: -14,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Ağacı, çukuru, virajı tanıyarak yürüdün. İlk gün burada nefesin kesilmişti; şimdi yol kısa geldi.'
              : s > 0.5
                ? 'Birkaç kez tempodan düştün. İlk gündekinden az.'
                : 'Son kilometrede geride kaldın. Emre yavaşladı, seninle beraber geldi.',
        },
        {
          kind: 'anlati',
          id: 'd27-e3',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Bunu yirmi sekiz gün önce yürüsem ölürdüm," dedi Emre, suyunu içerken. "Sivilde bir şantiyede iki kat merdiven çıkınca oturuyordum. Karım bana bunu anlatınca inanmayacak."',
          choices: [
            {
              id: 'd27-emre-inanir',
              label: '"İnanır. Yarın tribünden görecek."',
              effect: { moral: 4, dostluk: { kim: 'emre', puan: 4 } },
              outcome: 'Emre sustu, sonra güldü. "Önce düğmeye bakar, sonra bana." Suyunu sana uzattı; senin mataran boştu.',
            },
            {
              id: 'd27-emre-merdiven',
              label: '"Merdiveni de yürüyerek çık artık"',
              effect: { moral: 3, dostluk: { kim: 'emre', puan: 2 } },
              outcome: '"Otuz kişi çalışıyor yanımda. Patron merdivenden yürürse işçi ne der?" Bir an düşündü. "Yürür der herhalde."',
            },
          ],
        },
      ],
    },
    {
      id: 'd27-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-o1',
          sprite: 'tepsi',
          text: 'Kuru fasulye, yine. Bugün masada kimse şikâyet etmedi; birisi "bunu özleyeceğim" dedi ve herkes ona baktı, sonra kendi tabağına.',
        },
      ],
    },
    {
      id: 'd27-talim',
      from: '13:30',
      to: '16:30',
      title: 'Teslim',
      sprite: 'defter',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-t1',
          sprite: 'defter',
          speaker: 'Onbaşı Recep',
          text: 'Yedek battaniye, katlanmış, dört köşe. Matara boş ve kuru. Kemer, eldiven, yağmurluk. Listede ne varsa masaya, listede olmayan dolaba geri. Yarın sabah dolap boş olacak, bugün yarı boş.',
        },
        {
          kind: 'anlati',
          id: 'd27-t2',
          sprite: 'uniformaKatli',
          text: 'Mataran dolabın arkasında, bir poşetin içinde duruyordu. Onbaşının masasına sırayla koydun: battaniye, matara, kemer. Her biri bir işaret aldı. İlk gün bunları eline tutuştururken kimse işaret koymamıştı.',
          choices: [
            {
              id: 'd27-teslim-duzgun',
              label: 'Battaniyeyi denetim katında katla',
              effect: { disiplin: 5, enerji: -2 },
              outcome: 'Onbaşı katı açmadı, üstüne bastırdı, ölçtü gibi baktı. "Yirmi sekiz günde öğrendin," dedi. Övgü mü, hesap mı, anlayamadın.',
            },
            {
              id: 'd27-teslim-hizli',
              label: 'Katla, ver, geç',
              effect: { disiplin: -1, enerji: 2 },
              outcome: 'Onbaşı katı açtı, kendi katladı, işaret koydu. Yarın kim bu battaniyeyi alacaksa senin katını değil, onunkini açacak.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd27-t3',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: 'Serkan\'ın defteri altı gündür kapalı. Teslim masasının kenarına koydu, açmadı. "Kırk bir borç açıldı, otuz dokuzu kapandı. İkisini yarın kapatırım." Sana baktı. "Seninki kapandı bu arada. Hep kapalıydı aslında, ben öyle yazmadım."',
          choices: [
            {
              id: 'd27-serkan-neden',
              label: '"Neden yazmadın?"',
              effect: { moral: 3, dostluk: { kim: 'serkan', puan: 4 } },
              outcome: '"Açık hesap insanı konuşturur," dedi. "Kapalı hesapla kimse kimseyle konuşmaz." Defteri kapattı. Yirmi yedi gün boyunca defterin ne işe yaradığını ilk defa söylüyordu.',
            },
            {
              id: 'd27-serkan-bir-tane',
              label: '"O zaman bir çay borcum olsun"',
              effect: { moral: 3, dostluk: { kim: 'serkan', puan: 6 } },
              outcome: 'Serkan defterin kapağına dokundu, açmadı. "Kapattım onu," dedi. "Bu hesap deftere girmez. Vadesiz."',
            },
          ],
        },
      ],
    },
    {
      id: 'd27-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yarın 06:00 son yoklama. 07:00 dolaplar boşalır, tören kıyafeti üstünüzde, siviller çantada. 09:00 aileler kapıda, 10:00 yemin. Sonra evrak, sonra nizamiye; aileleriniz sizi kapının önünde bekler. Bu gece nöbet yok. Uyuyun. Uyuyamayacaksınız, biliyorum; yine de yatın.',
        },
      ],
    },
    {
      id: 'd27-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-ay1',
          sprite: 'askerTolga',
          text: 'Tolga tepsisini senin yanına koydu. Yirmi yedi gün boyunca hep masanın ucunda oturmuştu; bugün ortada oturdu. Bir şey söylemedi. Yemeğini bitirince senin ekmeğinin yarısını aldı, sordu gibi yaptı, sormadı.',
        },
      ],
    },
    {
      id: 'd27-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-s1',
          text: 'Son serbest akşam. Ankesörün önündeki kuyruk bu gece uzun ama yavaş; kimse kısa konuşmuyor, arkadaki de acele etmiyor. Avluda bank dolu. Biri gitarı olmayan bir şarkıyı mırıldanıyor, herkes nakaratı biliyor.',
        },
      ],
    },
    {
      id: 'd27-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd27-sy1',
          sprite: 'ay',
          text: 'Emre kapıdaki tebeşir çentiklerinden birini daha parmağıyla kapattı; bir tane açık kaldı. "O sabaha," dedi. Işıklar söndü. Koğuş karanlık ama uyuyan yok. Ranzaların arasından fısıltılar geçiyor, adresler, telefon numaraları, "gelirsen haber ver"ler. Karanlıkta biri kalkıp ranzasının başında oturdu. Emre.',
        },
        {
          kind: 'anlati',
          id: 'd27-sy-emre',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Kardeşim." Fısıldadı ama Emre fısıldayınca da yarım koğuş duyuyor. "İlk gün yemekhanede yanına oturdum ya. Kimseyi tanımıyordum. Sen de tanımıyordun. Neyse. Numaramı yazdım, dolabına koydum. Cumartesi sofra, unutma. Şantiyede iş olursa da ara, olmasa da."',
          choices: [
            {
              id: 'd27-emre-ara',
              label: '"Ararım"',
              effect: { moral: 3, dostluk: { kim: 'emre', puan: 5 } },
              outcome: '"Arama," dedi Emre, "gel." Sonra ranzasına döndü ve iki dakika sonra horluyordu. Yirmi sekiz gün boyunca herkes ondan önce uyumaya çalışmıştı.',
            },
            {
              id: 'd27-emre-tesekkur',
              label: '"O gün iyi ki oturdun"',
              effect: { moral: 4, dostluk: { kim: 'emre', puan: 7 } },
              outcome: 'Emre bir şey söyleyecekti, söylemedi. Yirmi sekiz günde Emre\'nin cümlesini bitirmediği tek an buydu.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd27-sy-tolga',
          sprite: 'askerTolga',
          speaker: 'Tolga',
          text: 'Üst ranzadan bir el uzandı, bir kâğıt bıraktı. Tolga. Kızının takviminin bir fotokopisi değil, elle çizilmiş bir kopyası: yirmi sekiz kutu, yirmi yedisi çizili. Altında tek satır: "Sonuncuyu beraber çizeriz."',
          choices: [
            {
              id: 'd27-tolga-cevap',
              label: 'Arkasına kendi numaranı yazıp geri uzat',
              effect: { moral: 4, dostluk: { kim: 'tolga', puan: 8 } },
              outcome: 'El bir süre gelmedi. Sonra geldi, kâğıdı aldı. Ranzanın yayları gıcırdadı; Tolga yan döndü.',
            },
            {
              id: 'd27-tolga-sakla',
              label: 'Kâğıdı künyenin yanına koy',
              effect: { moral: 3, dostluk: { kim: 'tolga', puan: 3 } },
              outcome: 'Künye yarın teslim edilecek. Kâğıt edilmeyecek. Son kutu boş, yarına.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd27-sy-serkan',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: 'Karşı ranzadan Serkan\'ın sesi: "Toplam: yirmi sekiz gün, dört yüz kırk üç tepsi, on dört nöbet, bir kayıp bot. Bir de bu koğuş." Durdu. "Sonuncusu deftere sığmadı."',
          choices: [
            {
              id: 'd27-serkan-gul',
              label: '"Bir de çay borcu"',
              effect: { moral: 3, dostluk: { kim: 'serkan', puan: 4 } },
              outcome: '"Vadesiz," dedi Serkan karanlıkta. Koğuşun yarısı güldü, ne olduğunu bilmeden.',
            },
            {
              id: 'd27-serkan-sus',
              label: 'Sus, dinle',
              effect: { moral: 3, enerji: 2 },
              outcome: 'Kimse cevap vermedi. Serkan da beklemedi. Koğuş yavaş yavaş sustu, sesler birer birer uykuya karıştı.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd27-sy2',
          sprite: 'ay',
          text: 'Yirmi yedi gün bitti. Bir gün kaldı: bir yemin, bir kapı. Duvardaki çentiklere dokundun karanlıkta. Yirmi yedi. Sayılabiliyor.',
        },
      ],
    },
  ],
};
