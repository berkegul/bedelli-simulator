import type { Gorusme } from '../tipler';

/**
 * GÜN 1 — TESLİM.
 * Kanka bugün aramıyor; ilk günün yalnızlığını bozmaması lazım.
 * Oyuncunun ilk gece beyanı (ilk_gece) bütün oyunun en çok geri dönen işareti.
 */
export const GUN_01: Gorusme[] = [
  {
    id: 'g01-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [1],
    kok: 'a',
    kapanis: 'Telefonu kapattın. Koğuşa döndüğünde kimse konuşmuyordu.',
    ankesorKapanis: 'Arkandaki öksürdü. "Anne kapatmam lazım." Kapatmak istemedin ama kapattın.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Alo? {ad}? Alo, duyuyor musun beni? Kaç saattir bekliyoruz, ses seda yok. Vardın mı oğlum, yerleştirdiler mi seni?"',
        secenekler: [
          {
            id: 'iyi',
            label: '"Vardım anne, iyiyim. Her şey yolunda."',
            cevap: '"Yolundaymış." Bir sessizlik. "Sesin öyle demiyor ama."',
            etki: { iliski: 2, moral: 4 },
            isaret: { ad: 'ilk_gece', deger: 'iyi' },
            sonraki: 'b',
          },
          {
            id: 'garip',
            label: '"Bilmiyorum ya. Çok garip. Hiçbir şeye benzemiyor."',
            cevap:
              '"Aman oğlum, ilk gün öyledir. Herkes öyle diyor." Kendini de ikna etmeye çalışıyor.',
            etki: { iliski: 5, moral: 6, ozlem: 4 },
            isaret: { ad: 'ilk_gece', deger: 'garip' },
            sonraki: 'b',
          },
          {
            id: 'dayanamam',
            label: '"Anne ben burada duramam."',
            cevap:
              'Uzun bir sessizlik oldu. "Duramazsın olur mu... Yirmi sekiz gün. Ben senin yerine sayarım."',
            etki: { iliski: 7, moral: 2, ozlem: 9 },
            isaret: { ad: 'ilk_gece', deger: 'dayanamam' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Saçını kazıttılar mı? Fotoğraf da yok, göremiyorum seni hiç."',
        secenekler: [
          {
            id: 'kaziti',
            label: '"Kazıttılar. Görsen tanımazsın."',
            cevap: '"Tanırım ben seni kel de." Güldü. Sonra gülmesi bitti ve sustu.',
            etki: { iliski: 3, moral: 3 },
            sonraki: 'c',
          },
          {
            id: 'yasak',
            label: '"Kameralı telefon yasak zaten. Fotoğraf çıkmaz."',
            cevap: '"Ay ne biçim yer orası." Ciddi ciddi kızdı buna.',
            etki: { iliski: 1, moral: 2 },
            sonraki: 'c',
          },
          {
            id: 'birak',
            label: '"Anne bırak saçı. İyiyim ben."',
            cevap: '"Tamam tamam, bıraktım." Bırakmadı.',
            etki: { iliski: -1, gerilim: 3 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Akşam bir şey yedin mi bari? Yemek verdiler mi? Sen sabah da doğru düzgün yemedin, biliyorum."',
        secenekler: [
          {
            id: 'yedim',
            label: '"Yedim anne. Fena da değildi."',
            cevap: '"Fena değilmiş." İnanmadı ama üstelemedi.',
            etki: { iliski: 2 },
            isaret: { ad: 'yemek_beyani', deger: 'iyi' },
            sonraki: 'd',
          },
          {
            id: 'yemedim',
            label: '"Yemedim. İştahım yoktu."',
            cevap:
              '"Yemedin mi?" Sesi yükseldi. "Yiyeceksin! Ben burada senin için ne yapıyorum, sen orada aç kalıyorsun."',
            etki: { iliski: 4, moral: -2 },
            isaret: { ad: 'yemek_beyani', deger: 'yemedim' },
            sonraki: 'd',
          },
          {
            id: 'sirada',
            label: '"Sırada iki saat bekledik, sonra soğumuştu."',
            cevap: '"İki saat mi?" Bunu kavrayamadı. "Yemek için mi?"',
            etki: { iliski: 3, moral: 1 },
            isaret: { ad: 'yemek_beyani', deger: 'kotu' },
            sonraki: 'd',
          },
        ],
      },
      d: {
        id: 'd',
        metin:
          '"Baban buradaydı, telefonu vermedim. Bir şey diyecek değil zaten, susup duruyor. Ama seni sordu, üç kere sordu."',
        secenekler: [
          {
            id: 'selam',
            label: '"Selam söyle. İyi olduğumu söyle."',
            cevap: '"Söylerim." Duraksadı. "Sen iyi misin gerçekten?"',
            etki: { iliski: 3, digerIliski: { kim: 'baba', puan: 3 } },
            sonraki: 'e',
          },
          {
            id: 'ver',
            label: '"Ver şunu, iki kelime konuşayım."',
            cevap:
              'Telefon el değiştirdi. Uzun bir hışırtı. "Eee." Baban telefonda hiç rahat olmaz.',
            etki: { iliski: 1, digerIliski: { kim: 'baba', puan: 6 } },
            rolDegis: 'baba',
            sonraki: 'baba1',
          },
        ],
      },
      baba1: {
        id: 'baba1',
        kim: 'baba',
        metin: '"Nasıl, vardın mı?" Kelimelerini sayarak kullanıyor.',
        secenekler: [
          {
            id: 'iyi',
            label: '"Vardım baba. İyiyim."',
            cevap: '"İyi." Bir sessizlik. "İlk gün en zoru. Yarın daha kolay."',
            etki: { iliski: 6, moral: 5 },
            sonraki: 'e',
          },
          {
            id: 'zor',
            label: '"Zor baba."',
            cevap:
              '"Zordur." Uzun bir duraklama. Nefes aldığını duyuyorsun. "Ben de yaptım. Geçer."',
            etki: { iliski: 8, moral: 6 },
            sonraki: 'e',
          },
        ],
      },
      e: {
        id: 'e',
        metin:
          '"Tamam oğlum, kapatalım, kontörün gider. Her akşam ara, tamam mı? Her akşam. Ben telefonun başındayım."',
        secenekler: [
          {
            id: 'soz',
            label: '"Ararım anne. Söz."',
            cevap: '"Söz mü?" Çocuk gibi sordu.',
            etki: { iliski: 5, moral: 3 },
            isaret: { ad: 'anne_soz', deger: 'her_aksam' },
          },
          {
            id: 'calisirim',
            label: '"Her akşam olmayabilir. Sıra var, izin var."',
            cevap: '"Olsun. Olduğunda ara." Anladı ama hoşuna gitmedi.',
            etki: { iliski: 1 },
            isaret: { ad: 'anne_soz', deger: 'belirsiz' },
          },
        ],
      },
    },
  },

  {
    id: 'g01-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [1],
    kok: 'a',
    kapanis: 'Kapattıktan sonra telefonu bir süre kulağından indirmedin.',
    ankesorKapanis: '"Kapatmam lazım, kuyruk var." "Tamam. Tamam, git." Kapatmadı, sen kapattın.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Alooo! Tamam tamam, konuşma, sadece bir şey söyle, sesini duyayım. Bütün gün telefona baktım."',
        secenekler: [
          {
            id: 'ozledim',
            label: '"Seni özledim."',
            cevap: '"Bir gün oldu daha!" Gülüyor. "Ama devam et."',
            etki: { iliski: 6, moral: 8, ozlem: 3 },
            isaret: { ad: 'sevgili_ilk', deger: 'ozledim' },
            sonraki: 'b',
          },
          {
            id: 'sesini',
            label: '"Sesini duymam lazımdı. Başka bir şey değil."',
            cevap: 'Bir sessizlik oldu. "Tamam." Sesi değişti. "Buradayım."',
            etki: { iliski: 8, moral: 9 },
            isaret: { ad: 'sevgili_ilk', deger: 'muhtactim' },
            sonraki: 'b',
          },
          {
            id: 'idare',
            label: '"İyiyim ya. Normal işte."',
            cevap: '"Normal." Tekrarladı. "Tamam."',
            etki: { iliski: 1, gerilim: 6 },
            isaret: { ad: 'sevgili_ilk', deger: 'gecistirdi' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Anlat. Nasıl bir yer? Ne yaptınız bugün?"',
        secenekler: [
          {
            id: 'anlat',
            label: 'Baştan sona anlat: otobüs, nizamiye, kuyruk, koğuş',
            cevap:
              '"Kuyruk kısmında güldüm, kusura bakma." Sonuna kadar dinledi, tek kelime kesmedi.',
            etki: { iliski: 7, moral: 6 },
            sonraki: 'c',
          },
          {
            id: 'kisa',
            label: '"Bekledik. Çok bekledik. Anlatacak bir şey yok aslında."',
            cevap: '"Bekleme de bir şeydir." Üstelemedi.',
            etki: { iliski: 2, gerilim: 4 },
            sonraki: 'c',
          },
          {
            id: 'sacimi',
            label: '"Saçımı kazıttılar. Ondan bahsedelim mi?"',
            cevap: '"YOK ARTIK." Beş dakika bunun üstüne güldünüz.',
            etki: { iliski: 5, moral: 10 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: 'Bir süre ikiniz de konuşmadınız. "Yirmi sekiz gün çok değil, değil mi?"',
        secenekler: [
          {
            id: 'degil',
            label: '"Değil. Göz açıp kapayana kadar."',
            cevap: '"Öyle diyorsun da sesin bitik." Fark etti. Hep fark eder.',
            etki: { iliski: 4, moral: 4 },
          },
          {
            id: 'cok',
            label: '"Bugün çok geldi. Yarın daha az gelir herhalde."',
            cevap: '"Gelir." Kısa durdu. "Ben buradayım, unutma."',
            etki: { iliski: 7, moral: 7, ozlem: 3 },
          },
          {
            id: 'sayma',
            label: '"Sayma. Sayarsak uzuyor."',
            cevap: '"Tamam, saymıyorum." Sayacak.',
            etki: { iliski: 3, moral: 3 },
            isaret: { ad: 'sayma_karari', deger: 'sayma' },
          },
        ],
      },
    },
  },
];
