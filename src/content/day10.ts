import type { Day } from '../engine/types';

/**
 * 10. gün — GECE. İlk nöbet (görev takvimi, son yoklamanın sonunda: 02:00–
 * 04:00). Telefon g10 gece konuşmasını açıyor. Dünün telefonu geri dönüyor:
 * omuz ağrısını anlattıysan sabah hâlâ orada (agri_sikayeti); atışı nasıl
 * anlattıysan koğuş da öyle biliyor (atis_sonucu).
 */
export const gun10: Day = {
  day: 10,
  title: 'Gece',
  epigraph: 'Bu gece kışla uyurken sen uyanık olacaksın.',
  blocks: [
    {
      id: 'd10-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-k1',
          sprite: 'duduk',
          text: 'Onuncu sabah. İki haneli sayıya geçtin. Koridordaki panoda nöbet listesi asılı; adının yanında 02:00–04:00 yazıyor.',
        },
        {
          kind: 'anlati',
          id: 'd10-k-omuz',
          sprite: 'tufek',
          kosul: { isaret: 'agri_sikayeti', isaretDeger: 'omuz' },
          text: 'Dün akşam annene omzunun acıdığını söylemiştin. Sabah battaniyeyi kaldırırken hatırladın: dipçiğin oturduğu yer mosmor. Annen telefonda "revire git" demişti.',
          choices: [
            {
              id: 'd10-omuz-revir',
              label: 'Kahvaltıdan önce revire uğra',
              effect: { kondisyon: 4, disiplin: -2, enerji: -3 },
              outcome: 'Revirdeki er bir tüp krem verdi: "İlk atıştan sonra yarım bölük geliyor." Krem soğuktu, işe yaradı.',
            },
            {
              id: 'd10-omuz-gec',
              label: 'Geçer, önemsizdir',
              effect: { kondisyon: -3, moral: -1 },
              outcome: 'Geçecek. Ama giyinirken ceketin kolunu iki denemede geçirebildin.',
            },
          ],
        },
        {
          kind: 'mini',
          id: 'd10-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Onuncu gün. Yatak artık kendi kendini topluyor gibi.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 14), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'On günde bir alışkanlık. Hiza, çizgi, bitti.'
              : s > 0.55
                ? 'Olur. Kafan bu geceki nöbette.'
                : 'Gece nöbetini düşünürken sabah yatağını unuttun.',
        },
      ],
    },
    {
      id: 'd10-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Bu gece nöbet başlıyor. Nöbette uyuyan kendini değil, yirmi yedi kişiyi yakar. Devriye geçtiğinde ayakta olacaksınız. Oturmak yok, çömelmek yok.',
        },
        {
          kind: 'mini',
          id: 'd10-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Nöbet listesindekiler Çavuşun gözünde bugün ayrıca işaretli.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 15), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Tek seferde. Çavuş nöbet listesine baktı, adının yanına bir şey koymadı.'
              : s > 0.5
                ? 'Normal. Bu gece normalin yetmeyeceğini biliyorsun.'
                : 'Geç kaldın. "Gece de böyle mi olacak?" diye sordu. Cevap vermedin.',
        },
      ],
    },
    {
      id: 'd10-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-m1',
          sprite: 'postal',
          text: 'Mıntıkada eski nöbetçiler anlatıyor: 02:00 en kötüsü, 04:00 en uzunu. Kimse 03:00\'ü anlatmıyor; o saatin anlatılacak bir şeyi yokmuş.',
        },
      ],
    },
    {
      id: 'd10-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-ka1',
          sprite: 'tepsi',
          text: 'Kahvaltıda konu hâlâ dünkü atış. Herkes kendi kartonunu anlatıyor; dünden beri bütün kartonlar biraz daha merkeze yaklaştı.',
        },
        {
          kind: 'anlati',
          id: 'd10-ka-abarti',
          sprite: 'askerSerkan',
          kosul: { isaret: 'atis_sonucu', isaretDeger: 'abartti' },
          speaker: 'Serkan',
          text: '"Duydum ki hepsi on ikiden," dedi Serkan, gözünü tepsiden kaldırmadan. "Kankan bizim çocuğun kuzeni çıktı. Dünya küçük, kışla daha küçük."',
          choices: [
            {
              id: 'd10-abarti-itiraf',
              label: '"Biraz abarttım" de',
              effect: { moral: -2, disiplin: 2, dostluk: { kim: 'serkan', puan: 4 } },
              outcome: 'Serkan güldü. "Herkes abartır. Abarttığını söyleyen tek kişi sensin." Sana karşı bir şey değişti; hesaplı bir saygı.',
            },
            {
              id: 'd10-abarti-sur',
              label: 'Arkasında dur: "On ikiden, evet"',
              effect: { moral: 3, disiplin: -3, dostluk: { kim: 'serkan', puan: -3 } },
              outcome: '"Tabii," dedi Serkan. Kartonun bütün bölükte merkeze taşındı. Onbaşı da duydu ve sonraki atışta seni izleyecek.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd10-ka-kotu',
          sprite: 'askerEmre',
          kosul: { isaret: 'atis_sonucu', isaretDeger: 'kotu' },
          speaker: 'Emre',
          text: 'Emre omzuna vurdu: "Dün telefonda kötü attım diyordun, duydum. Ben de beşte dört diyorum ama aramızda kalsın, ikiydi." İlk defa biri sana kendi yalanını itiraf etti.',
          choices: [
            {
              id: 'd10-kotu-gul',
              label: 'Beraber gülün',
              effect: { moral: 6, dostluk: { kim: 'emre', puan: 6 } },
              outcome: 'Masada kimse neden güldüğünüzü anlamadı. İkiniz de anlatmadınız.',
            },
          ],
        },
      ],
    },
    {
      id: 'd10-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Arazi Yürüyüşü',
      sprite: 'engel',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-e1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Nöbeti olanlar bugün de yürüyor. Gece uyanık kalacak adam gündüz yorulmayı öğrenecek. Sekiz kilometre, tempo.',
        },
        {
          kind: 'mini',
          id: 'd10-e2',
          game: 'yurumek',
          sprite: 'asker',
          brief: 'Sekiz kilometre. Tempo ilk dördünde kolay, son dördünde senin.',
          reward: (s) => ({
            kondisyon: Math.round(-3 + s * 10),
            disiplin: Math.round(-3 + s * 7),
            enerji: -16,
          }),
          verdict: (s) =>
            s > 0.85
              ? 'Son kilometrede bile tempo. Nöbete bu bacaklarla gideceksin.'
              : s > 0.5
                ? 'Birkaç kez tempodan düştün, yetiştin.'
                : 'Son iki kilometre kamyonetle. Çavuş listeye bir şey yazdı.',
        },
      ],
    },
    {
      id: 'd10-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-o1',
          sprite: 'tepsi',
          text: 'Öğle arasında yarım saat izin var. Nöbeti olanlar ranzaya uzanıyor; kimse uyuyamıyor ama herkes gözünü kapatıyor. Uyumaya çalışmak da bir iş.',
          choices: [
            {
              id: 'd10-ogle-uzan',
              label: 'Sen de uzan, gözünü kapat',
              effect: { enerji: 8, moral: 1 },
              outcome: 'Uyumadın. Ama yirmi dakika boyunca hiçbir şey düşünmedin ve bu da sayıldı.',
            },
            {
              id: 'd10-ogle-sohbet',
              label: 'Yemekhanede otur, sohbet et',
              effect: { moral: 3, enerji: -2, dostluk: { kim: 'emre', puan: 2 } },
              outcome: 'Emre ilk nöbetini anlattı, henüz tutmadığı nöbeti. Çok ayrıntılıydı.',
            },
          ],
        },
      ],
    },
    {
      id: 'd10-talim',
      from: '13:30',
      to: '16:30',
      title: 'Nöbet Eğitimi',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-t1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: '"Dur, kimsin?" üç kez. Parola, karşı parola. Nöbet yerinden ayrılmak yok, nöbeti devretmeden gitmek yok. Devriye geldiğinde ayağa kalk, selam ver, durumu bildir.',
        },
        {
          kind: 'anlati',
          id: 'd10-t2',
          text: 'Sırayla uyguladınız. Sıra sana geldiğinde Onbaşı karanlıktan çıkar gibi yaklaştı.',
          choices: [
            {
              id: 'd10-nobet-dogru',
              label: '"Dur! Kimsin? Parola!"',
              effect: { disiplin: 8, moral: 3 },
              outcome: 'Onbaşı durdu, parolayı söyledi. "Doğru. Gece de böyle." Bu gece de böyle olacak.',
            },
            {
              id: 'd10-nobet-selam',
              label: 'Tanıdık yüz: doğrudan selam ver',
              effect: { disiplin: -5, moral: -2 },
              outcome: '"Ya ben değilsem?" Bütün bölüğün önünde parolayı üç kez söyledin.',
            },
          ],
        },
      ],
    },
    {
      id: 'd10-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Nöbet listesi okundu. 02:00–04:00 nöbetçisi: adın. Bu gece uyanık olacak ilk kişilerden birisin.',
        },
      ],
    },
    {
      id: 'd10-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-ay1',
          sprite: 'tepsi',
          text: 'Serkan bir termos çay koydu önüne: "Nöbetçiye benden. Bu seferlik defter yok." Serkan\'ın defterinin dışında bir şey ilk defa oldu.',
        },
      ],
    },
    {
      id: 'd10-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-s1',
          text: 'Nöbetten önce uyumalısın ama saat henüz yedi. Avlu her zamanki gibi. Ankesörün önünde kuyruk; herkes evine bu gece nöbet olduğunu söylüyor, sen de söyleyebilirsin.',
        },
      ],
    },
    {
      id: 'd10-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd10-sy1',
          sprite: 'ay',
          text: 'On gün bitti, on sekiz kaldı. Yattın ama gözün saatte. Saat 01:45\'te biri omzuna dokundu: "Kalk, sıra sende."',
        },
      ],
    },
  ],
};
