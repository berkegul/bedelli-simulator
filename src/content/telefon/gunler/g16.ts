import type { Gorusme } from '../tipler';

/**
 * GÜN 16 — YORGUNLUK. Ayak yarası, uykusuzluk, bitmiş kondisyon.
 * Bu gün moral ve kondisyona bakıyor: bitkin oyuncuya farklı bir açılış
 * geliyor. Oyunda gerçekten olan şeyin telefona yansıdığı ilk yer.
 */
export const GUN_16: Gorusme[] = [
  {
    id: 'g16-anne-bitkin',
    kayit: 'ev',
    rol: 'anne',
    tur: 'dal',
    gunler: [16],
    oncelik: 140,
    kosul: { moralMax: 45 },
    kok: 'a',
    kapanis: '"Revire git. Duydun mu beni? Revire git." Kapattı ama duyduğundan emin değil.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Sesin ne oldu senin?" Hemen anladı. "Hasta mısın? Doğru söyle, yalan söyleme bana."',
        secenekler: [
          {
            id: 'yorgun',
            label: '"Hasta değilim anne. Sadece çok yoruldum."',
            cevap: '"Yorgunluk da bir şeydir." Ciddiye aldı.',
            etki: { iliski: 6, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'ayak',
            label: '"Ayağım yara oldu. Bot vuruyor."',
            cevap:
              '"Ben sana çorap yollamıştım!" Suçluluk ve öfke aynı cümlede.',
            etki: { iliski: 5, moral: 3 },
            isaret: { ad: 'hasta_oldu', deger: 'ayak' },
            sonraki: 'b',
          },
          {
            id: 'iyiyim',
            label: '"İyiyim. Gerçekten."',
            cevap: '"Değilsin." Kesin konuştu. "Ben senin sesini on beş gündür dinliyorum."',
            etki: { iliski: 2, gerilim: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Beni dinle. On iki gün kaldı. On iki. Sen bunu yaparsın, ben biliyorum."',
        secenekler: [
          {
            id: 'biliyorum',
            label: '"Biliyorum anne."',
            cevap: '"Bilmiyorsun ama ben biliyorum, o yeter." Bu cümle tuttu.',
            etki: { iliski: 8, moral: 9 },
            isaret: { ad: 'anne_destek', deger: 'g16' },
          },
          {
            id: 'yorgunum',
            label: '"Bugün yapamayacakmışım gibi geldi."',
            cevap:
              'Bir sessizlik. "Bugün yapma o zaman. Yarın yaparsın." En doğru cevaptı.',
            etki: { iliski: 10, moral: 10 },
            isaret: { ad: 'anne_destek', deger: 'g16' },
          },
        ],
      },
    },
  },

  {
    id: 'g16-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [16],
    kok: 'a',
    kapanis: '"Kendine iyi bak." Her seferinde aynı, her seferinde gerekli.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Ayakların nasıl? Bot vuruyor mu hâlâ?"',
        secenekler: [
          {
            id: 'alisti',
            label: '"Alıştı artık. İlk hafta zordu."',
            cevap: '"Ayak alışır mı?" Anlamadı ama sevindi.',
            etki: { iliski: 5, moral: 3 },
            sonraki: 'b',
          },
          {
            id: 'vuruyor',
            label: '"Vuruyor. Ama idare ediyorum."',
            cevap: '"İdare etme, revire git." Aynı cümleyi kuracak, biliyorsun.',
            etki: { iliski: 4, moral: 2 },
            isaret: { ad: 'hasta_oldu', deger: 'ayak' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"On iki gün. Bunu her akşam söylüyorum, sıkıldın mı?"',
        secenekler: [
          {
            id: 'sikilmadim',
            label: '"Sıkılmadım. Söyle."',
            cevap: '"On iki gün." Söyledi, iki kere daha söyleyecek.',
            etki: { iliski: 6, moral: 5 },
          },
          {
            id: 'biraz',
            label: '"Biraz. Ama sen söyleyince farklı oluyor."',
            cevap: '"Nasıl farklı?" Cevabı beklemedi, hoşuna gitti yeter.',
            etki: { iliski: 7, moral: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g16-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [16],
    kok: 'a',
    kapanis: 'Kapattın. Yorgundun ama daha az yalnızdın.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Bugün sesin bitik. Konuşmak istemiyorsan konuşmayalım, ben anlarım."',
        secenekler: [
          {
            id: 'konusalim',
            label: '"Konuşalım. Sesini duymak dinlendiriyor."',
            cevap: '"O zaman ben konuşayım." Konuştu, yirmi dakika.',
            etki: { iliski: 9, moral: 8, enerji: 4 },
            sonraki: 'b',
          },
          {
            id: 'sus',
            label: '"Biraz susalım mı? Telefonu açık bırakalım."',
            cevap:
              '"Tamam." Sustunuz. Telefonda sessizlik tuhaftır ama bu tuhaf değildi.',
            etki: { iliski: 12, moral: 9, enerji: 5 },
            isaret: { ad: 'sevgili_derin', deger: 'g16' },
            sonraki: 'b',
          },
          {
            id: 'kapatalim',
            label: '"Bugün kapatalım. Yarın uzun konuşuruz."',
            cevap: '"Tamam." Anladı. Anlamak da bir emek.',
            etki: { iliski: 3, gerilim: 3, enerji: 2 },
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Sana bir şey soracağım. Buradan sonra ne olacak diye korkuyor musun hiç?"',
        secenekler: [
          {
            id: 'evet',
            label: '"Korkuyorum. Alıştığım bir düzen var artık, onu bırakmak da garip."',
            cevap:
              '"Alıştın mı gerçekten?" Bunu duymayı beklemiyordu. "Peki. İyi bir şey bu galiba."',
            etki: { iliski: 8, moral: 5 },
            isaret: { ad: 'alisma_isareti', deger: 'g16' },
          },
          {
            id: 'hayir',
            label: '"Korkmuyorum. Sadece bitmesini istiyorum."',
            cevap: '"Bitecek." Kesin konuştu. "On iki gün."',
            etki: { iliski: 6, moral: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g16-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [16],
    kok: 'a',
    kapanis: '"Dayan lan. On iki gün." Kapattı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Naber? Sesin bok gibi lan, ne oldu?"',
        secenekler: [
          {
            id: 'yoruldum',
            label: '"Yoruldum lan. Basit."',
            cevap: '"Basit değil ki." Ciddileşti bir an. "Ne kadar yorgun?"',
            etki: { iliski: 6, moral: 3 },
            sonraki: 'b',
          },
          {
            id: 'ayak',
            label: '"Ayağım mahvoldu. Yürüyemiyorum neredeyse."',
            cevap: '"Revire çıksana." Herkes aynı şeyi söylüyor.',
            etki: { iliski: 5, moral: 3 },
            isaret: { ad: 'hasta_oldu', deger: 'ayak' },
            sonraki: 'b',
          },
          {
            id: 'iyiyim',
            label: '"İyiyim lan, sesim öyle."',
            cevap: '"Tamam." Israr etmedi, o böyle yapar.',
            etki: { iliski: 2 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bak, bir şey diyeyim mi? Sen şu an en kötü noktadasın. Yarısı geçti, ucu görünmedi. Bundan sonra hızlanır."',
        secenekler: [
          {
            id: 'nereden',
            label: '"Nereden biliyorsun lan sen?"',
            cevap: '"Bilmiyorum." Dürüst. "Ama mantıklı geldi, değil mi?"',
            etki: { iliski: 6, moral: 6 },
          },
          {
            id: 'umarim',
            label: '"Umarım haklısındır."',
            cevap: '"Haklıyım." Değilse bile öyle davranacak.',
            etki: { iliski: 5, moral: 5 },
          },
        ],
      },
    },
  },
];
