import type { Day } from '../engine/types';
import { tirasSahnesi } from './rutin';

export const gun02: Day = {
  day: 2,
  title: 'İlk Tam Gün',
  epigraph: 'Kışladaki ilk sabahın. Bundan sonrası hep böyle başlayacak.',
  blocks: [
    {
      id: 'd2-kalkis',
      from: '06:00',
      to: '06:30',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-k1',
          sprite: 'duduk',
          speaker: 'Onbaşı Recep',
          text: 'KALKKKKIŞ! Ayağa! Yataklar toplanacak, on dakika! Kim son kalkarsa bütün koğuş onun yüzünden bekler!'
        },
        {
          kind: 'mini',
          id: 'd2-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Battaniyenin kenarı ranzanın çizgisiyle hizalanacak. Çubuk hizaya gelince bırak.',
          reward: (s) => ({
            disiplin: Math.round(-4 + s * 14),
            moral: Math.round(-2 + s * 6)
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Onbaşı yatağa baktı, bir şey demedi. Bu iyi bir şey.'
              : s > 0.55
                ? 'İdare eder. Kenarı bir daha çekmen gerekti ama sıraya yetiştin.'
                : 'Onbaşı battaniyeyi tek hamlede yere attı. Baştan.'
        },
        tirasSahnesi(
          'd2-k3',
          'Lavaboda on kişi, dört musluk var. Aynada kendine bakıyorsun; saçın dün bu kadar kısa değildi. Jileti aşağı doğru çek, acele eden yüzünü keser.'
        ),
        {
          kind: 'anlati',
          id: 'd2-ko1',
          sprite: 'postal',
          speaker: 'Onbaşı Recep',
          text: 'Dolaplar açık kalacak. Postallar ranzanın altında, burunları dışarı, hizalı. Bir tanesi bile yamuksa bütün koğuş bahçeye iner.'
        },
        {
          kind: 'anlati',
          id: 'd2-ko2',
          text: 'Yan ranzadaki Tolga hâlâ dolabını toplamamış, oturmuş boşluğa bakıyor. Onbaşı iki dakikaya burada olur.',
          choices: [
            {
              id: 'kogus-yardim',
              label: 'Tolga’nın dolabını topla',
              effect: { moral: 7, disiplin: 3, enerji: -6 },
              outcome: 'İkiniz yetiştirdiniz. Tolga sadece başını salladı ama bunu unutmayacak.'
            },
            {
              id: 'kogus-kendi',
              label: 'Kendi işine bak',
              effect: { disiplin: 5, moral: -4, enerji: -2 },
              outcome: 'Senin dolabın kusursuz. Tolga bahçede tur atarken sen koğuştaydın.'
            },
            {
              id: 'kogus-uyar',
              label: 'Uyar ama karışma',
              effect: { disiplin: 2, moral: 2, enerji: -1 },
              outcome: 'Tolga son anda toparladı. Kimse ceza almadı.'
            },
          ]
        },
      ]
    },
    {
      id: 'd2-ictima',
      from: '06:30',
      to: '07:00',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bölük hizada. Soğuk. Nefesin buhar oluyor. Çavuş sıranın önünde yürüyor ve herkesin yakasına tek tek bakıyor.'
        },
        {
          kind: 'mini',
          id: 'd2-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Komut geldiği anda dokun. Erken dokunursan da ceza, geç kalırsan da.',
          reward: (s) => ({
            disiplin: Math.round(-6 + s * 18),
            enerji: -4
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Bütün bölük tek ses çıkardı. Çavuş başını salladı.'
              : s > 0.5
                ? 'Yarım saniye geç kaldın. Kimse fark etmedi. Sen fark ettin.'
                : 'Sıradan bir adım dışarı çıktın. Bütün bölük seni bekledi.'
        },
      ]
    },
    {
      id: 'd2-mintika',
      from: '07:00',
      to: '07:30',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-m1',
          sprite: 'postal',
          text: 'Süpürge ve faraş dağıtıldı. Mıntıka dediğin şey avlunun sana düşen köşesi; ilk sabahından itibaren burası senin. Onbaşı köşeleri tek tek gösterdi, sonra saatine baktı.'
        },
      ]
    },
    {
      id: 'd2-kahvalti',
      from: '07:30',
      to: '08:30',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-ka1',
          sprite: 'tepsi',
          text: 'Yemekhane. Tepsi, iki dilim ekmek, zeytin, reçel, bir parça peynir, çay. Yanına oturan adam elini uzattı: "Emre. Müteahhitim. Yani sivilde. Burada neysem oyum artık."'
        },
      ]
    },
    {
      id: 'd2-egitim-sabah',
      from: '08:30',
      to: '12:00',
      title: 'Temel Eğitim',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-es1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Bugün yürüyeceğiz. Sadece yürüyeceğiz. Sol ayak, sağ ayak. Basit geliyor değil mi? Dört saat sonra konuşuruz.'
        },
        {
          kind: 'mini',
          id: 'd2-es2',
          game: 'yurumek',
          sprite: 'postal',
          brief: 'Tempoyu tuttur. Her "SOL" komutunda dokun. Ritim hızlanacak.',
          reward: (s) => ({
            kondisyon: Math.round(-2 + s * 12),
            disiplin: Math.round(-3 + s * 12),
            enerji: -18
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Bölük tek vücut gibi yürüdü. Bu hissi ilk defa anladın.'
              : s > 0.5
                ? 'Birkaç kez adımı şaşırdın, hemen toparladın.'
                : 'Sürekli yanlış ayak. Onbaşı senin için ayrı tempo tuttu, bütün bölük izledi.'
        },
        {
          kind: 'anlati',
          id: 'd2-es3',
          text: 'Postalların ayağını vurmaya başladı. Topuğunda bir sıcaklık var, sonra yanma. Su toplamış olmalı.'
        },
      ]
    },
    {
      id: 'd2-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-o1',
          sprite: 'tepsi',
          text: 'Kuru fasulye, pilav, cacık, bir dilim kavun. Herkes sessiz yiyor çünkü herkes yorgun. Yemekten sonra otuz dakika serbest.',
          choices: [
            {
              id: 'ogle-uyu',
              label: 'Ranzaya uzan, gözünü kapat',
              effect: { enerji: 20, kondisyon: 4, moral: 2 },
              outcome: 'Yirmi dakika. Bir asker için yirmi dakika çok şey.'
            },
            {
              id: 'ogle-ayak',
              label: 'Topuğundaki suyu patlat, sarayım',
              effect: { kondisyon: 10, enerji: -4, moral: -3 },
              outcome: 'Acıttı ama akşam yürüyüşünde bunu kendine teşekkür edeceksin.'
            },
            {
              id: 'ogle-muhabbet',
              label: 'Emre ve Tolga ile muhabbet et',
              effect: { moral: 12, enerji: -3 },
              outcome: 'Emre’nin sivildeki hikâyeleri saçma ama otuz dakika hızlı geçti.'
            },
          ]
        },
      ]
    },
    {
      id: 'd2-talim',
      from: '13:30',
      to: '16:30',
      title: 'Talim',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-eo1',
          sprite: 'tufek',
          speaker: 'Onbaşı Recep',
          text: 'Bugün silaha dokunmayacaksınız. Sadece bakacaksınız. Yarın elinize vereceğim ve o zaman ona nasıl davranacağınızı bileceksiniz.'
        },
        {
          kind: 'anlati',
          id: 'd2-eo2',
          text: 'Öğleden sonra nizami duruş, selamlama ve komut çalışıldı. "HAZIROL" ile "RAHAT" arasında bir gün geçirdin. Güneş tam tepende.',
          choices: [
            {
              id: 'talim-dik',
              label: 'Dimdik dur, kıpırdama',
              effect: { disiplin: 10, kondisyon: -6, enerji: -12 },
              outcome: 'Bacakların titredi ama bir kere bile bozulmadın. Onbaşı senin önünde iki saniye fazla durdu.'
            },
            {
              id: 'talim-rahat',
              label: 'Arada ağırlığını değiştir, belli etme',
              effect: { disiplin: -3, kondisyon: 3, enerji: -6 },
              outcome: 'Kimse görmedi. Bacakların hâlâ seninle.'
            },
          ]
        },
      ]
    },
    {
      id: 'd2-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Mevcut sayıldı. Eksik yok. Bölük işleri dağıtıldı: çöp, koridor, lavabo, nöbet listesi. Senin adın çöpte.',
          choices: [
            {
              id: 'is-yap',
              label: 'Söylenmeden yap',
              effect: { disiplin: 8, enerji: -8, moral: -2 },
              outcome: 'On beş dakikada bitti. Çavuş listeye senin yanına bir işaret koydu.'
            },
            {
              id: 'is-degistir',
              label: 'Serkan ile takas etmeye çalış',
              effect: { disiplin: -4, moral: 5, para: -20 },
              outcome: 'Serkan koridoru senin yerine aldı, karşılığında kantin borcu. Bu adam burada ekonomi kurmuş.'
            },
          ]
        },
      ]
    },
    {
      id: 'd2-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-ay1',
          sprite: 'tepsi',
          text: 'Çorba, makarna, ayran. Bugün ilk günün ve tepsiyi bitirebiliyorsun. İlk gün için iyi bir işaret.'
        },
      ]
    },
    {
      id: 'd2-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-s1',
          text: 'İki saat. Kantin açık, ankesörlü telefonun önünde kuyruk var, koğuşta televizyon çalışıyor. İlk gecen.'
        },
      ]
    },
    {
      id: 'd2-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd2-sy1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Ranza başı! Mevcut sayılacak. Yarın sabah 05:30, bugünkünden hızlı olacaksınız. Işıklar 22:00’de sönüyor.'
        },
        {
          kind: 'anlati',
          id: 'd2-sy2',
          sprite: 'ay',
          text: 'Ranzana uzandın. Tavan çok yakın. Bugün 05:00’te bir otobüsteydin ve şimdi 28 günün 1’i bitti. Yirmi yedi tane daha var.'
        },
      ]
    },
  ]
};
