import type { Day } from '../engine/types';

/**
 * 18. gün — ON GÜN. Üçüncü eşik; akşam içtimasında ceza var (görev
 * takvimi). Dünkü koli koğuşta dolaşıyor: telefonda kutudan ne çıktığını
 * nasıl anlattıysan (koli_icerigi) kahvaltıda o paylaşılıyor. Baba telefonda
 * az konuşuyor; gün de az konuşuyor.
 */
export const gun18: Day = {
  day: 18,
  title: 'On Gün',
  epigraph: 'On gün, iki elin parmakları kadar.',
  blocks: [
    {
      id: 'd18-kalkis',
      from: '05:30',
      to: '06:00',
      title: 'Kalkış',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-k1',
          sprite: 'duduk',
          text: 'On sekizinci sabah. Biri koğuşun kapısının iç yüzüne tebeşirle "10" yazmış. Kimse silmedi. Onbaşı gördü, o da silmedi.',
        },
        {
          kind: 'mini',
          id: 'd18-k2',
          game: 'yatak',
          sprite: 'ranzaToplu',
          brief: 'Kapıda "10" yazıyor. Yatak her zamanki yatak.',
          reward: (s) => ({ disiplin: Math.round(-5 + s * 13), moral: Math.round(-2 + s * 4) }),
          verdict: (s) =>
            s > 0.85
              ? 'Kusursuz. On gün sonra bunu kimse istemeyecek; sen yine de yapacaksın.'
              : s > 0.55
                ? 'Olur. Son on günün ilki böyle başladı.'
                : 'Gevşek. Kapıdaki rakam insanın elini de gevşetiyor.',
        },
      ],
    },
    {
      id: 'd18-ictima',
      from: '06:00',
      to: '06:30',
      title: 'Sabah İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-i1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Kapıya rakam yazan kim bilmiyorum. Bilmek de istemiyorum. On gün kaldı diye kendini sivil sanan olursa akşam listede adını görür.',
        },
        {
          kind: 'mini',
          id: 'd18-i2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'Yoklama. Akşam listesi sözünden sonra kimse "sivil" görünmek istemiyor.',
          reward: (s) => ({ disiplin: Math.round(-6 + s * 14), enerji: -4 }),
          verdict: (s) =>
            s > 0.85
              ? 'Tek seferde, tek sesle. Çavuş listeye bakmadı bile.'
              : s > 0.5
                ? 'İyi. Akşam listesinde adın olmayacak kadar iyi, belki.'
                : 'Geç kaldın. Çavuş sana baktı ve kalemini çıkardı.',
        },
      ],
    },
    {
      id: 'd18-mintika',
      from: '06:30',
      to: '07:00',
      title: 'Mıntıka Temizliği',
      sprite: 'postal',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-m1',
          sprite: 'postal',
          text: 'Mıntıkada dünden kalma bir kurabiye kırıntısı izi var: koğuştan avluya, avludan bankın altına. Kediyi suçladınız. Kedi itiraz etmedi.',
        },
      ],
    },
    {
      id: 'd18-kahvalti',
      from: '07:00',
      to: '08:00',
      title: 'Kahvaltı',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-ka1',
          sprite: 'tepsi',
          text: 'Kahvaltıda koliler masaya geldi. Emre\'nin tarhanası, birinin kolonyası, bir başkasının annesinin ördüğü bere. Sıra sana geldi.',
        },
        // Telefonda kutudan çıkanı nasıl anlattıysan masada o paylaşılıyor.
        {
          kind: 'anlati',
          id: 'd18-ka-kurabiye',
          sprite: 'atistirmalik',
          kosul: { isaret: 'koli_icerigi', isaretDeger: ['kurabiye', 'mektup'] },
          text: 'Kavanozu masaya koydun. Bezi çözünce masa sustu. Annen "paylaş" demişti; demese de paylaşılacaktı, bu masada kavanoz kimsenin tek başına olmaz.',
          choices: [
            {
              id: 'd18-kurabiye-herkes',
              label: 'Masanın ortasına koy',
              effect: {
                moral: 5,
                dostluk: { kim: 'emre', puan: 3 },
              },
              outcome: 'Kavanoz iki turda boşaldı. Emre son kurabiyeyi ikiye böldü, yarısını sana verdi. "Senin annen," dedi, "benim annemden iyi yapıyor. Ona söyleme."',
            },
            {
              id: 'd18-kurabiye-tolga',
              label: 'Önce Tolga\'ya uzat',
              effect: { moral: 3, dostluk: { kim: 'tolga', puan: 6 } },
              outcome: 'Dün Tolga\'nın adı okunmamıştı. Kavanozu önüne koyduğunda bir an baktı, bir tane aldı. "Sağ ol." Gözünü kaldırmadan.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd18-ka-mektup',
          sprite: 'defter',
          kosul: { isaret: 'koli_icerigi', isaretDeger: 'mektup' },
          text: 'Babanın kâğıdı cebinde. Üç satır. Sabah bir kere daha okudun, yine üç satırdı. Baban hayatında sana kaç satır yazdı, saymaya çalıştın: bu dahil üç.',
        },
        {
          kind: 'anlati',
          id: 'd18-ka-normal',
          sprite: 'atistirmalik',
          kosul: { isaret: 'koli_icerigi', isaretDeger: 'normal' },
          text: 'Bisküvi paketini açtın. Market bisküvisi, herkesin evinde olan cinsten. Masada kimse yüzünü buruşturmadı; herkesin evinde olan şey bu masada çok değerli.',
          choices: [
            {
              id: 'd18-biskuvi-dagit',
              label: 'Paketi masada dolaştır',
              effect: { moral: 4, dostluk: { kim: 'serkan', puan: 3 } },
              outcome: 'Serkan bir tane aldı, sonra bir tane daha. "Bunu defterde yazmıyorum," dedi. "Bu hediye." Serkan\'ın ağzından ilk defa çıktı bu kelime.',
            },
            {
              id: 'd18-biskuvi-sakla',
              label: 'Nöbet gecesi için sakla',
              effect: { moral: 1, enerji: 2 },
              outcome: 'Paketi dolaba kaldırdın. Masada kimse bir şey demedi ama Emre paketin nereye gittiğini gözüyle takip etti.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd18-ka-sade',
          sprite: 'corap',
          kosul: { isaret: 'koli_icerigi', isaretDeger: 'sade' },
          text: 'Senin kolinden masaya konacak bir şey yok; iki çift çorap masaya konmaz. Tolga\'nın postalından çıkan çorabın topuğu delik, dün gördün.',
          choices: [
            {
              id: 'd18-corap-tolga',
              label: 'Bir çift çorabı Tolga\'ya ver',
              effect: { moral: 3, kondisyon: -1, dostluk: { kim: 'tolga', puan: 7 } },
              outcome: 'Tolga çoraba baktı. "Annen senin için yollamış." "İki tane yollamış." Aldı. Akşam içtimasında onun postalı da yenisiyle giyilmiş gibi duruyordu.',
            },
            {
              id: 'd18-corap-sus',
              label: 'Sıranı geç, bir şey koyma',
              effect: { moral: -1 },
              outcome: 'Sıran geçti. Kimse bir şey sormadı. Kahvaltının sonunda Emre tarhanasından bir kaşık senin çorbana koydu.',
            },
          ],
        },
      ],
    },
    {
      id: 'd18-egitim-sabah',
      from: '08:00',
      to: '12:00',
      title: 'Silah Eğitimi',
      sprite: 'tufek',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-e1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Sökme takma, süreli. İlk gün iki dakikada bitiremeyenler vardı. Bugün bir dakikanın altına inmeyen tekrar edecek.',
        },
        {
          kind: 'mini',
          id: 'd18-e2',
          game: 'silah',
          sprite: 'tufek',
          brief: 'Sökme takma. İlk gün parçaların adını bilmiyordun.',
          reward: (s) => ({ disiplin: Math.round(-4 + s * 11), moral: Math.round(-2 + s * 5), enerji: -8 }),
          verdict: (s) =>
            s > 0.85
              ? 'Bir dakikanın altında. Onbaşı saatine baktı, bir daha baktı.'
              : s > 0.5
                ? 'Bir dakika civarı. Tekrar etmedin ama kıl payı.'
                : 'Yay bir kere elinden kaçtı. Tekrar ettin, bütün bölük seni bekledi.',
        },
      ],
    },
    {
      id: 'd18-ogle',
      from: '12:00',
      to: '13:30',
      title: 'Öğle Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-o1',
          sprite: 'askerSerkan',
          speaker: 'Serkan',
          text: '"On gün," dedi Serkan. "Hesapladım: otuz öğün, on yoklama, bir yemin, bir teslim. Dokuz yüz küsur şınav ihtimali." Defteri açık. Sonra sana döndü: "Sen çıkınca ne yapacaksın? İlk gün."',
          choices: [
            {
              id: 'd18-ilk-gun-uyku',
              label: '"Öğlene kadar uyuyacağım."',
              effect: { moral: 3, dostluk: { kim: 'serkan', puan: 2 } },
              outcome: '"Uyuyamazsın," dedi Serkan. "05:30\'da uyanırsın. Bak, yazıyorum." Yazdı. Tarih attı.',
            },
            {
              id: 'd18-ilk-gun-bilmem',
              label: '"Bilmiyorum. Düşünmedim hiç."',
              effect: { moral: -1, dostluk: { kim: 'serkan', puan: 4 } },
              outcome: 'Serkan kalemini bıraktı. "Ben de," dedi. Defteri kapattı. On sekiz günde ilk defa kalemsiz konuştu.',
            },
          ],
        },
      ],
    },
    {
      id: 'd18-talim',
      from: '13:30',
      to: '16:30',
      title: 'Tören Provası',
      sprite: 'bayrak',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-t1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Yemin töreninin ilk provası. Sıra, selam, geçiş. Tribünün yerinde bugün boş sandalyeler var. Sandalyelere bakın ve orada kimin oturacağını düşünün. Sonra düşünmeyi bırakın ve yürüyün.',
        },
        {
          kind: 'anlati',
          id: 'd18-t2',
          text: 'Boş sandalyelerin önünden geçerken birine bakmamak zor. Çavuş başların öne dönük kalmasını istiyor.',
          choices: [
            {
              id: 'd18-prova-one',
              label: 'Gözün önde, adım düz',
              effect: { disiplin: 6, enerji: -6 },
              outcome: 'Geçiş temizdi. Çavuş ikinci turda seni sıranın önüne aldı. Kimse sebebini söylemedi.',
            },
            {
              id: 'd18-prova-sandalye',
              label: 'Bir sandalyeye bak, kimin olacağını düşün',
              effect: { moral: 4, disiplin: -4, enerji: -4 },
              outcome: 'Üçüncü sıradaki sandalye. Oraya kimin oturacağını bildin. Adımın kaydı; Çavuş gördü, bir şey demedi. Bugün demedi.',
            },
          ],
        },
      ],
    },
    {
      id: 'd18-aksam-ictima',
      from: '16:30',
      to: '17:30',
      title: 'Akşam İçtiması',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'Sabah söylemiştim. Liste. On gün kaldı diye gevşeyenler, sayıyı buradan biliyorsunuz.',
        },
      ],
    },
    {
      id: 'd18-aksam-yemek',
      from: '17:30',
      to: '18:30',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-ay1',
          sprite: 'askerEmre',
          text: 'Emre parmaklarıyla sayıyor: iki eli açık, on parmak. Her akşam bir parmağı kapatacakmış. "Yirmi sekizde yumruk olacak," dedi. "Onunla nizamiyeden çıkacağım." Bunu gerçekten planlamış.',
        },
      ],
    },
    {
      id: 'd18-serbest',
      from: '18:30',
      to: '21:00',
      title: 'Serbest Zaman',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-s1',
          text: 'Avlu bu akşam sessiz. On gün kaldığında insan ya herkesi arar ya kimseyi. Ankesörün önünde kuyruk yarım.',
        },
      ],
    },
    {
      id: 'd18-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd18-sy1',
          sprite: 'ay',
          text: 'On sekiz gün bitti, on kaldı. Yarın tek haneye iniyor. Uyumadan önce kapıdaki tebeşire baktın; biri "10"un üstünü çizmiş, yanına henüz bir şey yazmamış.',
        },
      ],
    },
  ],
};
