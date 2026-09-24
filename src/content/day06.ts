import type { Day } from '../engine/types';

/**
 * 6. gün — HESAP. Para azalıyor, kontör azalıyor; Serkan'ın koğuş ekonomisi
 * ilk kez gerçek bir seçenek oluyor. İlk ceza akşam içtimasında (görev
 * takvimi). Telefon g06 aynı temayı açıyor: annen paranın bitip bitmediğini
 * soruyor.
 */
export const gun06: Day = {
  day: 6,
  title: 'Hesap',
  epigraph: 'Cüzdan inceliyor, gün aynı kalıyor.',
  blocks: [
    {
      id: 'd6-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-k1',
          sprite: 'duduk',
          text: 'Düdük. Sayfayı çevirir gibi kalktın. Ranzanın altındaki cüzdana baktın; dün akşam kantinde bıraktığın paranın hesabı sabaha kadar kafanda döndü.',
        },
        {
          kind: 'mini',
          id: 'd6-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Battaniye, çarşaf, hiza. Altıncı sabah; Onbaşı artık iki saniyede bakıp geçiyor.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 15), moral: Math.round(-2 + s * 5) }),
          verdict: (s) =>
            s > 0.85
              ? 'Kenar jilet gibi. Onbaşı durmadı bile.'
              : s > 0.55
                ? 'Yetişti. Bir köşe hafif kalkık ama kimse eğilip bakmadı.'
                : 'Çarşaf dalgalı kaldı. Onbaşı çekip yere attı, baştan.',
        },
      ],
    },
    {
      id: 'd6-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Alıştırma bitti. Bu hafta her şey sayılıyor: geç kalan, eksik giyinen, sırada konuşan. Akşam içtimasında liste okunacak.',
        },
        {
          kind: 'mini',
          id: 'd6-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Çavuş "sayılıyor" dediği için bölük her zamankinden gergin.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 16), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Adın okununca sesin tek seferde çıktı. Çavuş kalemi kaldırmadı.'
              : s > 0.5
                ? 'Bir an geç kaldın. Çavuş baktı, yazmadı. Bugünlük.'
                : 'Adın ikinci kez okundu. Çavuş bir şey yazdı ve sana göstermedi.',
        },
      ],
    },
    {
      id: 'd6-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-m1',
          sprite: 'postal',
          text: 'Serkan eğilmiş izmarit topluyor, bir yandan konuşuyor: "Kantinde kontör yirmi, bende on sekiz. Nakit olmazsa da yazarım, akşam ödersin."',
        },
      ],
    },
    {
      id: 'd6-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-ka1',
          sprite: 'tepsi',
          text: 'Emre çayını karıştırırken cüzdanını masaya boşalttı. İki kâğıt para, bir bozuk. "Altı günde bu kadar harcanır mı? Sivilde bir öğle yemeğine bu kadar verirdim."',
          choices: [
            {
              id: 'd6-emre-hesap',
              label: 'Kantin masraflarını beraber hesaplayın',
              effect: { moral: 3, disiplin: 3, dostluk: { kim: 'emre', puan: 4 } },
              outcome:
                'Peçeteye yazdınız. Çayın yarısı, kontörün tamamı gereksizmiş. Emre peçeteyi katlayıp cebine koydu: "Müteahhitlik bu işte, kalem kalem."',
            },
            {
              id: 'd6-emre-sakala',
              label: 'Şakaya vur: "Burada para değil sabır harcanıyor"',
              effect: { moral: 5, dostluk: { kim: 'emre', puan: 2 } },
              outcome: 'Emre güldü, çayını bitirdi. Hesap peçeteye geçmedi ama kahvaltı hafif geçti.',
            },
          ],
        },
      ],
    },
    {
      id: 'd6-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Arazi Yürüyüşü',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-e1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bugün ilk defa sahanın dışına çıkıyorsunuz. Adım bir, nefes bir. Önündekinin ensesine bakacaksın, gökyüzüne değil.',
        },
        {
          kind: 'mini',
          id: 'd6-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Dört kilometre tempo. Sol ayak düdükle yere değecek; bir kişi şaşırırsa arkadaki yirmi kişi şaşırıyor.',
          reward: (s) => ({
            kondisyon: Math.round(-3 + s * 10),
            disiplin: Math.round(-3 + s * 8),
            enerji: -14,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Tempodan bir kez bile çıkmadın. Dönüşte ayakların değil, kafan yorgundu.'
              : s > 0.5
                ? 'İki kez adım kaçırdın, arkadaki topuğuna bastı. Kimse bir şey demedi.'
                : 'Tempoyu tutturamadın. Çavuş seni kolondan çıkarıp en arkaya aldı.',
        },
      ],
    },
    {
      id: 'd6-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-o1',
          sprite: 'tepsi',
          text: 'Tolga tepsisini aldı, masaya oturmadan önce bir an durdu. Kantinden aldığı bisküvi paketini açmadan cebine geri koydu. Kimseye bir şey demedi.',
          choices: [
            {
              id: 'd6-tolga-sor',
              label: '"Her şey yolunda mı?" diye sor',
              effect: { moral: 2, dostluk: { kim: 'tolga', puan: 5 } },
              outcome:
                '"Yolunda." Bir süre sonra ekledi: "Eve para yolluyorum da. Burada az harcarsam orada biri eksik kalmıyor." Sonra konuyu değiştirdi.',
            },
            {
              id: 'd6-tolga-ekmek',
              label: 'Kendi ekmeğinin yarısını tepsisine bırak',
              effect: { tokluk: -6, moral: 4, dostluk: { kim: 'tolga', puan: 7 } },
              outcome: 'Tolga baktı, itiraz edecekti, etmedi. Ekmeği yedi. Yemek boyunca konuşmadınız ama o sessizlik iyi bir sessizlikti.',
            },
            {
              id: 'd6-tolga-karisma',
              label: 'Karışma, yemeğini ye',
              effect: {},
              outcome: 'Herkesin kendi hesabı var. Tolga yemeğini bitirdi, tepsiyi götürdü.',
            },
          ],
        },
      ],
    },
    {
      id: 'd6-talim',
      from: '13:30',
      to: '16:30',
      title: 'Silah Bakımı',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-t1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Üç gün önce sökmeyi gösterdim. Bugün süreyle yapıyorsunuz. Parçayı yere koyan bütün bölüğe çay ısmarlar.',
        },
        {
          kind: 'mini',
          id: 'd6-t2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Sök, sırala, tak. Masanın üstü dar, yanındakinin parçası seninkine karışmasın.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 12), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Sıra, süre, temizlik. Onbaşı sayacı durdurdu ve tahtaya adını yazdı.'
              : s > 0.5
                ? 'Yayı bir kez ters tuttun, çevirdin. Süre yetti.'
                : 'Bir parça masadan düştü. Akşam bütün bölüğe çay senden.',
        },
      ],
    },
    {
      id: 'd6-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Sabah söyledim, akşam okuyorum. Listede adı olan kalsın, diğerleri dağılsın. Yarın bu listede kimseyi görmek istemiyorum.',
        },
      ],
    },
    {
      id: 'd6-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-ay1',
          sprite: 'tepsi',
          text: 'Yemekhanede herkes birbirinin tepsisine bakıyor. Kimin kantinden ek aldığı, kimin sadece tabildotla idare ettiği altıncı günde belli olmaya başladı.',
        },
      ],
    },
    {
      id: 'd6-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-s1',
          sprite: 'kantinBina',
          speaker: 'Serkan',
          text: '"Teklif basit. Bir hafta boyunca akşam çayı benden, sen de bana kontör kartının yarısını ver. Ya da nakit, ne istersen. Burada herkes bir şeye muhtaç, ben sadece defteri tutuyorum."',
          choices: [
            {
              id: 'd6-serkan-kabul',
              label: 'Anlaş: haftalık çay karşılığı 60 TL ver',
              effect: { para: -60, moral: 6, enerji: 4, dostluk: { kim: 'serkan', puan: 6 } },
              outcome:
                'Serkan defterine bir satır yazdı, adının yanına tik attı. "Hayırlı olsun. Akşam dokuzda termos bende."',
            },
            {
              id: 'd6-serkan-pazarlik',
              label: 'Pazarlık et',
              effect: { para: -35, moral: 3, disiplin: -2, dostluk: { kim: 'serkan', puan: 3 } },
              outcome:
                'On dakika sürdü. Otuz beşte anlaştınız, Serkan yenilmiş gibi yaptı ama defterdeki gülümsemeyi saklayamadı.',
            },
            {
              id: 'd6-serkan-red',
              label: 'Nazikçe reddet, paranı tut',
              effect: { moral: -2, disiplin: 2 },
              outcome: '"Kapım açık," dedi Serkan. Defteri kapattı ama sayfayı işaretledi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd6-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd6-sy1',
          sprite: 'ay',
          text: 'Işıklar söndü. Altı gün bitti, yirmi iki kaldı. Karanlıkta birinin cüzdan fermuarını açıp kapattığını duydun; herkes aynı hesabı yapıyor.',
        },
      ],
    },
  ],
};
