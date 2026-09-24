import type { Day } from '../engine/types';

/**
 * 23. gün — ÖZÜR. Dün kanka aramadı; bugün telefonda özür geliyor (g23).
 * Gün de o havada: koğuşta küçük hesaplar kapanıyor. Dün akşam telefon
 * görüşmelerini özleyeceğini söylediysen (telefon_ozlemi) ankesör kuyruğu
 * bu akşam başka görünüyor.
 */
export const gun23: Day = {
  day: 23,
  title: 'Özür',
  epigraph: 'Beş gün kala herkes birine bir şey borçlu olduğunu hatırlıyor.',
  blocks: [
    {
      id: 'd23-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaToplu',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-k1',
          sprite: 'duduk',
          text: 'Yirmi üçüncü sabah. Kapıdaki tebeşirde "5". Biri gece rakamın yanına küçük bir çizgi daha çekmiş, sonra silmeye çalışmış. İz kalmış.',
        },
        {
          kind: 'mini',
          id: 'd23-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Beş yatak daha. Sonra bu çarşaf başkasının.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Köşeler keskin. Bu yatağı toplamayı sivilde de unutmayacaksın, istesen de.'
              : s > 0.55
                ? 'Düzgün. Kimse bakmadı.'
                : 'Çarşaf kaydı. Beş gün kaldı diye çarşaf da gevşiyor.',
        },
      ],
    },
    {
      id: 'd23-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Dün bu bölükten biri nöbette oturdu. Kim olduğunu biliyorum, o da biliyor. Bu sabah yanıma gelip söylerse konu kapanır. Gelmezse konu yeni açılır.',
        },
        {
          kind: 'mini',
          id: 'd23-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Sıranın bir yerinde biri kıpırdanıyor; Çavuşun sözü havada.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Adın okundu, cevabın hazırdı. Bugün kimse seni konuşmayacak.'
              : s > 0.5
                ? 'Normal. Çavuşun aklı başka yerde.'
                : 'Geç kaldın. Çavuş bir an sana baktı; dünkü o sen misin diye.',
        },
      ],
    },
    {
      id: 'd23-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-m1',
          sprite: 'askerEmre',
          text: 'Mıntıkada Emre dünkü nöbetçiyle konuşuyor, alçak sesle. Sonra ikisi birlikte Çavuşun odasına yürüdü. Emre kapıda bekledi, içeri girmedi.',
        },
      ],
    },
    {
      id: 'd23-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-ka1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: '"Defteri kapattım, biliyorsun." Serkan defteri yine de masaya koydu, arka sayfadan açtı. "Kapatırken bir satır açık kalmış. Senin hanende. Beş gün kala sıfırlayalım dedim."',
          choices: [
            {
              id: 'd23-defter-ode',
              label: 'Satırı öde, kapansın',
              effect: { para: -20, moral: 2, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: 'Serkan satırın üstünü cetvelle çizdi. Cetveli nereden bulduğunu sormadın. "Temiz," dedi. "Bu koğuşta temiz çıkan az."',
            },
            {
              id: 'd23-defter-sil',
              label: '"Termoslar hediyeydi demiştin"',
              effect: { moral: 1, dostluk: { kim: 'serkan', puan: -2 } },
              outcome: 'Serkan defteri bir daha okudu. "Termoslar ayrı sayfada," dedi. "Bu başka." Sonra satırı sildi, ama cetvelsiz.',
            },
          ],
        },
      ],
    },
    {
      id: 'd23-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Tören Provası',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-e1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Beş gün sonra aileleriniz karşınızda. Yemin metnini ezbere bilmeyen kalmayacak. Satır satır: ben okurum, siz tekrar edersiniz. Bir ağızdan.',
        },
        {
          kind: 'mini',
          id: 'd23-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Tören adımı, tribünün önünden geçiş. Tempo Çavuşun düdüğünde.',
          reward: (s) => ({
            kondisyon: Math.round(-2 + s * 7),
            disiplin: Math.round(-3 + s * 8),
            enerji: -12,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Tribünün önünden tek bir vuruş gibi geçtiniz. Boş sandalyeler bile dikildi sanki.'
              : s > 0.5
                ? 'Bir iki adım kaydı. Üç günde düzelir.'
                : 'Tempodan düştün. Çavuş seni ön sıradan arka sıraya aldı.',
        },
      ],
    },
    {
      id: 'd23-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-o1',
          sprite: 'askerTolga',
          text: 'Tolga peçetenin arkasına yemin metnini yazmış, beş satır, düzgün bir el yazısıyla. "Öğrencilere şiir ezberletirken böyle yaparım," dedi. "Her satırın ilk kelimesi. Gerisi arkasından gelir." Peçeteyi masanın ortasına koydu.',
          choices: [
            {
              id: 'd23-tolga-ezber',
              label: 'İlk kelimelerle ezberle',
              effect: { disiplin: 3, moral: 1, dostluk: { kim: 'tolga', puan: 4 } },
              outcome: 'Türk. Her. Kanunlarına. Sancağıma. Namusum. Beşinci denemede Tolga başını salladı: "Olmuş. Şimdi unutmaya çalış, çalışamazsın."',
            },
            {
              id: 'd23-tolga-gerek',
              label: '"Çavuş zaten okuyor, biz tekrarlıyoruz"',
              effect: { moral: 1, dostluk: { kim: 'tolga', puan: -1 } },
              outcome: '"Doğru," dedi Tolga. Peçeteyi katlayıp cebine koydu. "Ama tekrarlarken ne dediğini bilmek başka."',
            },
          ],
        },
      ],
    },
    {
      id: 'd23-talim',
      from: '13:30',
      to: '16:30',
      title: 'Silah Bakımı',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-t1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Teslimden önce son bakım. Bu tüfeği sizden sonra başkası alacak. Namlu temiz gidecek, kayıt temiz gidecek. Pas görürsem teslim tarihiniz de paslanır.',
        },
        {
          kind: 'mini',
          id: 'd23-t2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Sök, temizle, tak. Son bakımdan biri.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 11), moral: Math.round(-1 + s * 3) }),
          verdict: (s) =>
            s > 0.85
              ? 'Parçalar ellerinden kendi sırasıyla çıktı. Onbaşı namluya baktı, ışığa tuttu, geri verdi.'
              : s > 0.5
                ? 'Bir parçayı ters taktın, fark ettin, düzelttin.'
                : 'Yay yere düştü. Beş dakika tüfeğin altında aradın.',
        },
      ],
    },
    {
      id: 'd23-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Sabahki konu kapandı. Gelen geldi, söyleyen söyledi. Bu bölükte hata yapan var, hatasını saklayan yok. Böyle kalsın.',
        },
      ],
    },
    {
      id: 'd23-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-ay1',
          sprite: 'askerEmre',
          speaker: 'Emre',
          text: '"Dünkü nöbetçi bizim ranzanın çocuğu," dedi Emre. "Gidip söylemeye korkuyordu. Kapıya kadar yürüdüm, gerisini o yaptı." Bir süre tepsisine baktı. "Sivilde otuz kişiye bağırıyorum. Burada birini bir kapıya kadar yürüttüm, daha çok işe yaradı."',
          choices: [
            {
              id: 'd23-emre-iyi',
              label: '"İyi yapmışsın"',
              effect: { moral: 2, dostluk: { kim: 'emre', puan: 3 } },
              outcome: 'Emre omuz silkti ama tepsisindeki ekmeğin yarısını sana verdi. Emre\'de teşekkür böyle.',
            },
            {
              id: 'd23-emre-sustur',
              label: 'Sus, adını duyan olmasın',
              effect: { disiplin: 2, dostluk: { kim: 'emre', puan: 1 } },
              outcome: 'Emre sesini alçalttı. Haklıydın; masanın ucunda Onbaşı oturuyordu, duymamış gibi yapıyordu.',
            },
          ],
        },
      ],
    },
    {
      id: 'd23-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-s1',
          sprite: 'ankesor',
          text: 'Ankesörün önünde kuyruk. Beş gün kala kuyruk kısalmıyor, uzuyor: herkes son aramaları erken yapmak istiyor.',
        },
        {
          kind: 'anlati',
          id: 'd23-s-ozlem',
          sprite: 'ankesor',
          kosul: { isaret: 'telefon_ozlemi', isaretDeger: 'evet' },
          text: 'Dün akşam bu konuşmaları özleyeceğini söylemiştin. Bu akşam kuyruğa başka baktın: ahizenin kulağa değen yeri eskimiş, rakamların üçü silik, cam kenarında yirmi üç günlük parmak izi. Beş gün sonra bu cihaz senin olmayacak.',
          choices: [
            {
              id: 'd23-ozlem-bekle',
              label: 'Sıranı bekle, acele etme',
              effect: { moral: 4, enerji: -2 },
              outcome: 'Önündekiler konuşurken dinlemedin ama seslerini duydun. Herkes aynı şeyi farklı söylüyordu: "Geliyorum."',
            },
            {
              id: 'd23-ozlem-yaz',
              label: 'Ankesörün yanındaki duvara çentik at',
              effect: { moral: 3, disiplin: -2 },
              outcome: 'Tırnağınla küçük bir çizgi. Duvarda senden önce atılmış yüzlercesi var. Hangisinin kimin olduğunu kimse bilmiyor, bu da iyi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd23-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd23-sy1',
          sprite: 'ay',
          text: 'Yirmi üç gün bitti, beş kaldı. Işıklar söndü. Koğuşun bir ucunda biri alçak sesle birinden özür diledi. Kim olduğunu anlamadın; karşı taraf "tamam" dedi ve konu orada kaldı.',
        },
      ],
    },
  ],
};
