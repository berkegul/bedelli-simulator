import type { Gorusme } from '../tipler';

/** GÜN 9 — ATIŞ. İlk atış, tüfeğin ağırlığı. Babanın ikinci görünmesi. */
export const GUN_09: Gorusme[] = [
  {
    id: 'g09-baba',
    kayit: 'ev',
    rol: 'baba',
    tur: 'omurga',
    gunler: [9],
    kok: 'a',
    kapanis: '"Anneni vereyim." Ama vermeden önce bir şey daha söyledi: "Aferin."',
    replikler: {
      a: {
        id: 'a',
        metin: 'Baban açtı. "Bugün atış var demiştin. Oldu mu?"',
        secenekler: [
          {
            id: 'oldu',
            label: '"Oldu. İlk defa tüfek tuttum."',
            cevap: '"Nasıldı?" Bu soruyu sormak için bekliyormuş belli ki.',
            etki: { iliski: 6, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'agir',
            label: '"Ağırmış baba. Hiç böyle beklemiyordum."',
            cevap: '"Ağırdır." Kısa durdu. "İlk tutan herkes şaşırır."',
            etki: { iliski: 7, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'kotu',
            label: '"Kötü attım. Hiçbirini tutturamadım."',
            cevap:
              '"Ben de tutturamamıştım." Bunu çok hızlı söyledi, seni rahatlatmak için.',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'atis_sonucu', deger: 'kotu' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bizim zamanımızda eski tüfekler vardı. Omzunda iz bırakırdı. Hâlâ var bende, bak dursa da."',
        secenekler: [
          {
            id: 'goster',
            label: '"Gelince gösterirsin."',
            cevap:
              '"Gösteririm." Bunu söylerken sesi değişti. Gelmeni bekliyor, söylemiyor ama bekliyor.',
            etki: { iliski: 10, moral: 7 },
            isaret: { ad: 'baba_anisi', deger: 'tufek' },
            sonraki: 'c',
          },
          {
            id: 'anlat',
            label: '"Sen nasıl atardın? İyi miydin?"',
            cevap:
              '"Kötüydüm." Güldü, gerçekten güldü. "Bölükte en kötü bendim. Onbaşı bana \'sen taşı yeter\' derdi."',
            etki: { iliski: 11, moral: 9 },
            isaret: { ad: 'baba_anisi', deger: 'kotu_atici' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Annen yanımda, kulağını dayamış dinliyor. Vereyim mi?"',
        secenekler: [
          {
            id: 'ver',
            label: '"Ver."',
            cevap: '"Al bakalım." Telefon el değiştirdi. "Ne konuştunuz siz?"',
            etki: { iliski: 3, digerIliski: { kim: 'anne', puan: 4 } },
            rolDegis: 'anne',
            sonraki: 'anne1',
          },
          {
            id: 'seninle',
            label: '"Biraz daha seninle konuşalım."',
            cevap:
              'Bir sessizlik. Sonra annene: "Dur, benimle konuşuyor." Sesinde bir şey vardı, gurur diyelim.',
            etki: { iliski: 12, moral: 8 },
            isaret: { ad: 'baba_yumusadi', deger: 'g9' },
          },
        ],
      },
      anne1: {
        id: 'anne1',
        kim: 'anne',
        metin: '"Tüfek mi tuttun sen? Tehlikeli değil mi o?"',
        secenekler: [
          {
            id: 'degil',
            label: '"Değil anne. Herkes yapıyor, eğitim bu."',
            cevap: '"Yine de dikkat et." Neye dikkat edileceğini o da bilmiyor.',
            etki: { iliski: 4, moral: 2 },
          },
          {
            id: 'saka',
            label: '"Çok tehlikeli. Bana bakma, ben kaçtım."',
            cevap: '"{ad}!" Bir an inandı. Sonra: "Şaka yapma öyle şeylerle."',
            etki: { iliski: 5, moral: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g09-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [9],
    kok: 'a',
    kapanis: 'Kapatırken hâlâ atıştan bahsediyordu.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Bugün silah mı verdiler sana? Baban söyledi, atış varmış."',
        secenekler: [
          {
            id: 'evet',
            label: '"Verdiler. Eğitim işte, herkes yapıyor."',
            cevap: '"Herkes yapıyorsa tamam." Mantığı bu, işe yarıyor.',
            etki: { iliski: 4, moral: 3 },
            sonraki: 'b',
          },
          {
            id: 'anlat',
            label: '"Ağırdı. Omzum acıyor şu an."',
            cevap: '"Omzun mu acıyor? Revire git!" Bir anda ciddileşti.',
            etki: { iliski: 5, moral: 2 },
            isaret: { ad: 'agri_sikayeti', deger: 'omuz' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Baban seninle konuşunca iyi oluyor, biliyor musun? Sonra bir saat susuyor ama iyi oluyor."',
        secenekler: [
          {
            id: 'ararim',
            label: '"Daha sık konuşurum onunla."',
            cevap: '"Konuş. Sana bir şey demez ama bekler." Bunu sır verir gibi söyledi.',
            etki: { iliski: 6, digerIliski: { kim: 'baba', puan: 5 } },
            isaret: { ad: 'baba_bilgisi', deger: 'bekliyor' },
          },
          {
            id: 'zor',
            label: '"Onunla konuşmak zor ya. Ne diyeceğimi bilmiyorum."',
            cevap: '"O da bilmiyor." Güldü. "İkiniz de aynısınız."',
            etki: { iliski: 5, moral: 4 },
          },
        ],
      },
    },
  },

  {
    id: 'g09-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [9],
    kok: 'a',
    kapanis: '"Yarın yine ara." Randevu artık kurulmuş durumda.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Silah tuttun mu bugün? Nasıl bir his?"',
        secenekler: [
          {
            id: 'garip',
            label: '"Garip. Ağır ve soğuk. Ondan başka bir şey hissetmedim."',
            cevap: '"İyi." Sesi rahatladı. "Başka bir şey hissetmeni istemem."',
            etki: { iliski: 7, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'heyecan',
            label: '"Biraz heyecanlıydı aslında."',
            cevap: '"Heyecanlı mı?" Bunu sevmedi ama saygı duydu. "Sen bilirsin."',
            etki: { iliski: 4, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'konusmayalim',
            label: '"Onu konuşmayalım. Başka bir şey anlat."',
            cevap: '"Tamam." Israr etmedi, hemen konu değiştirdi. İyi ki öyle.',
            etki: { iliski: 5, moral: 2 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ben bugün arkadaşlarla buluştum. Senin adın geçti. Herkes selam söyledi, ciddiyim, herkes."',
        secenekler: [
          {
            id: 'selam',
            label: '"Selam söyle onlara da."',
            cevap: '"Söylerim." Bu basit alışveriş ikinizi de rahatlattı.',
            etki: { iliski: 5, moral: 5 },
          },
          {
            id: 'ozledim',
            label: '"Orada olmak isterdim şu an."',
            cevap:
              '"Biliyorum." Kısa durdu. "Ama bir dahakinde olacaksın. Bekletiyorum onları."',
            etki: { iliski: 8, moral: 4, ozlem: 7 },
          },
        ],
      },
    },
  },

  {
    id: 'g09-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [9],
    kok: 'a',
    kapanis: '"Nişancı çıktı bizimki." Kapattı, hâlâ gülüyordu.',
    replikler: {
      a: {
        id: 'a',
        metin: '"ATIŞ VAR DEMİŞTİN! Kaç tutturdun? Söyle, kaç?"',
        secenekler: [
          {
            id: 'iyi',
            label: '"Fena değildim aslında."',
            cevap: '"Fena değil ne demek lan, sayı söyle." Sayı vermedin, bıraktı.',
            etki: { iliski: 5, moral: 6 },
            isaret: { ad: 'atis_sonucu', deger: 'iyi' },
            sonraki: 'b',
          },
          {
            id: 'kotu',
            label: '"Hiçbirini tutturamadım lan."',
            cevap: '"HAHAHAHA." Uzun uzun güldü. "Seni cepheye göndermesinler."',
            etki: { iliski: 6, moral: 7 },
            isaret: { ad: 'atis_sonucu', deger: 'kotu' },
            sonraki: 'b',
          },
          {
            id: 'abart',
            label: '"Hepsi on ikiden. Komutan bile şaşırdı."',
            cevap: '"Yalan." Bir sessizlik. "Yalan değil mi?" Emin olamadı.',
            etki: { iliski: 6, moral: 8 },
            isaret: { ad: 'atis_sonucu', deger: 'abartti' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Bak on dokuz gün kaldı. On dokuz. Ben takvimi duvara astım, çiziyorum."',
        secenekler: [
          {
            id: 'sen',
            label: '"Sen mi çiziyorsun? Ben çizmiyorum bile."',
            cevap: '"Birimiz çizmeli lan." Bunu çok ciddi söyledi.',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'kanka_takvim', deger: 'var' },
          },
          {
            id: 'bende',
            label: '"Ben de sayıyorum. Herkes sayıyor burada."',
            cevap: '"O zaman beraber sayıyoruz." Bunu bir bağ saydı.',
            etki: { iliski: 6, moral: 5 },
          },
        ],
      },
    },
  },
];
