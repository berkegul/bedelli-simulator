import type { Gorusme } from '../tipler';

/**
 * GÜN 13 — ÖLÇÜM. Sevgili ekseni burada ikiye ayrılıyor.
 * Gerilim eşiği 25: altındaysa yakınlaşma, üstündeyse hesap sorma.
 * Gerilim oyuncuya hiç gösterilmedi; bugün ilk defa yüzüne çıkıyor ve
 * oyuncu son on iki günün nasıl geçtiğini burada öğreniyor.
 * Her iki dal da `sevgili_ekseni` işaretini koyup 14-17. günleri belirliyor.
 */
export const GUN_13: Gorusme[] = [
  {
    id: 'g13-sevgili-kapali',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'dal',
    gunler: [13],
    oncelik: 150,
    kosul: { gerilimMin: { sevgili: 25 } },
    kok: 'a',
    kapanis: 'Telefonu kapattın ve bir süre ankesörün önünde durdun.',
    ankesorKapanis: '"Kuyruk var, kapatmam lazım." "Tabii. Tabii, kuyruk var." Kapattı.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Bir şey söyleyeceğim ve sözümü kesme. Sen benimle hiçbir şey paylaşmıyorsun. On üç gündür konuşuyoruz ve ben senin orada nasıl olduğunu bilmiyorum."',
        secenekler: [
          {
            id: 'haklisin',
            label: '"Haklısın. Gerçekten haklısın."',
            cevap:
              'Beklediği bu değildi. "Haklıyım, evet." Sesi yumuşadı ama bırakmadı. "Peki neden?"',
            etki: { iliski: 6, gerilim: -12 },
            sonraki: 'neden',
          },
          {
            id: 'buradayim',
            label: '"Ne yapayım? Buradayım işte."',
            cevap:
              '"Orada olman bahane değil." Sesi yükseldi. "Ben de buradayım. Ben anlatıyorum."',
            etki: { iliski: -4, gerilim: 10 },
            sonraki: 'sert',
          },
          {
            id: 'simdi_olmaz',
            label: '"Bunu şimdi konuşmayalım."',
            cevap:
              '"Ne zaman konuşacağız?" Kısa durdu. "Her seferinde şimdi olmaz diyorsun."',
            etki: { iliski: -6, gerilim: 14 },
            sonraki: 'sert',
          },
          {
            id: 'anla',
            label: '"Sen de beni anlamaya çalış biraz."',
            cevap:
              '"Çalışıyorum." Sesi çatladı. "On üç gündür sadece onu yapıyorum."',
            etki: { iliski: -3, gerilim: 8 },
            sonraki: 'sert',
          },
        ],
      },
      neden: {
        id: 'neden',
        metin: '"Neden anlatmıyorsun? Bunu bilmek istiyorum, kavga etmek istemiyorum."',
        secenekler: [
          {
            id: 'uzulme',
            label: '"Üzülmeni istemiyorum. O kadar basit."',
            cevap:
              '"Ben zaten üzülüyorum." Sesi sakindi. "Bilmeyince daha çok üzülüyorum."',
            etki: { iliski: 8, gerilim: -18, moral: 4 },
            isaret: { ad: 'sevgili_ekseni', deger: 'onarildi' },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'anlatamiyorum',
            label: '"Anlatamıyorum. Kelime bulamıyorum, o kadar."',
            cevap:
              'Uzun bir sessizlik. "Tamam." Sonra: "O zaman anlatma. Sadece sus, ama benimle sus."',
            etki: { iliski: 10, gerilim: -20, moral: 6 },
            isaret: { ad: 'sevgili_ekseni', deger: 'onarildi' },
            sonraki: 'kapanis_iyi',
          },
          {
            id: 'aliskanlik',
            label: '"Alışkanlık galiba. Hep böyleydim, sen de biliyorsun."',
            cevap:
              '"Biliyorum." Bunu kabullenerek söyledi, hoşnut değil. "Ama denemeni isterdim."',
            etki: { iliski: 3, gerilim: -6 },
            isaret: { ad: 'sevgili_ekseni', deger: 'askida' },
            sonraki: 'kapanis_orta',
          },
        ],
      },
      sert: {
        id: 'sert',
        metin:
          'Bir sessizlik oldu. Telefonda sessizlik pahalıdır, ikiniz de biliyorsunuz. "Peki. Ne yapmamı istiyorsun?"',
        secenekler: [
          {
            id: 'geri_al',
            label: '"Özür dilerim. Böyle söylemek istemedim."',
            cevap:
              '"Tamam." Kabul etti ama sesi eski hâline dönmedi. "Yarın konuşuruz."',
            etki: { iliski: 5, gerilim: -10 },
            isaret: { ad: 'sevgili_ekseni', deger: 'askida' },
            sonraki: 'kapanis_orta',
          },
          {
            id: 'bekle',
            label: '"Sadece beklemeni. On beş gün daha."',
            cevap:
              '"Bekliyorum zaten." Sesi düzleşti. "Ama beklerken de yalnızım, onu bil."',
            etki: { iliski: -2, gerilim: 4 },
            isaret: { ad: 'sevgili_ekseni', deger: 'kapali' },
            sonraki: 'kapanis_kotu',
          },
          {
            id: 'birak',
            label: '"Bilmiyorum. Gerçekten bilmiyorum."',
            cevap:
              '"Ben de bilmiyorum." Uzun bir sessizlik. "İkimiz de bilmiyoruz demek ki."',
            etki: { iliski: -4, gerilim: 8 },
            isaret: { ad: 'sevgili_ekseni', deger: 'kapali' },
            sonraki: 'kapanis_kotu',
          },
        ],
      },
      kapanis_iyi: {
        id: 'kapanis_iyi',
        metin:
          '"Bugünü kavga olarak hatırlamayalım, tamam mı? Konuşma olarak hatırlayalım."',
        secenekler: [
          {
            id: 'tamam',
            label: '"Tamam. Konuşma olarak."',
            cevap: '"İyi." Sesinde bir yorgunluk vardı ama iyi bir yorgunluk.',
            etki: { iliski: 6, moral: 5 },
          },
        ],
      },
      kapanis_orta: {
        id: 'kapanis_orta',
        metin: '"Neyse. Kapatalım artık, kontörün gidiyor."',
        secenekler: [
          {
            id: 'tamam',
            label: '"Tamam."',
            cevap: '"İyi geceler." Hızlı söyledi.',
            etki: { moral: -2 },
          },
          {
            id: 'yarin',
            label: '"Yarın ararım. Söz."',
            cevap: '"Ararsın." Emin değildi ama duymak istedi.',
            etki: { iliski: 4, gerilim: -4 },
          },
        ],
      },
      kapanis_kotu: {
        id: 'kapanis_kotu',
        metin: '"Kapatıyorum. Kızgın değilim, yorgunum. Farklı şeyler."',
        secenekler: [
          {
            id: 'tamam',
            label: '"Tamam."',
            cevap: 'Kapattı. Kapatma sesi telefonda çok yüksek çıkıyor.',
            etki: { moral: -6, ozlem: 8 },
          },
          {
            id: 'dur',
            label: '"Dur. Kapatma."',
            cevap: 'Kapatmadı. İkiniz de konuşmadınız. Sonra o kapattı.',
            etki: { iliski: 3, gerilim: -5, moral: -3, ozlem: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g13-sevgili-acik',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'dal',
    gunler: [13],
    oncelik: 150,
    kosul: { gerilimMax: { sevgili: 24 } },
    kok: 'a',
    kapanis: 'Kapattın. On üç gün, ve bugün en iyisiydi.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Bugün tuhaf bir şey fark ettim. Sana her şeyi anlatabiliyorum ve sen de bana anlatıyorsun. Bu, sen gitmeden önce böyle değildi."',
        secenekler: [
          {
            id: 'haklisin',
            label: '"Haklısın. Burada konuşmaktan başka bir şey yok, o yüzden."',
            cevap: '"Sebebi o mu sadece?" Gülüyor ama cevabı gerçekten istiyor.',
            etki: { iliski: 5 },
            sonraki: 'b',
          },
          {
            id: 'ozledim',
            label: '"Uzak olmak bazı şeyleri kolaylaştırıyor galiba."',
            cevap: '"Tuhaf ama doğru." Bunu düşünmemişti.',
            etki: { iliski: 8, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'degisim',
            label: '"Ben değiştim. Sen de değiştin bence."',
            cevap: '"İkimiz de mi?" Bunu sevdi. "İyi o zaman, beraber değişiyoruz."',
            etki: { iliski: 9, moral: 6 },
            isaret: { ad: 'sevgili_derin', deger: 'g13' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir şey soracağım. Bu bittiğinde, yani sen çıktığında, biz nasıl olacağız? Aynı mı kalacağız?"',
        secenekler: [
          {
            id: 'daha_iyi',
            label: '"Daha iyi olacağız. Buna eminim."',
            cevap:
              '"Nasıl bu kadar eminsin?" Emin olmanı istiyor. "Tamam, ben de inanıyorum."',
            etki: { iliski: 12, gerilim: -8, moral: 8 },
            isaret: { ad: 'sevgili_ekseni', deger: 'acik' },
            sonraki: 'c',
          },
          {
            id: 'bilmiyorum',
            label: '"Bilmiyorum. Ama kötü olacağını da düşünmüyorum."',
            cevap:
              '"Dürüst cevap." Kabul etti. "Bilmemek de bir şeydir. En azından yalan değil."',
            etki: { iliski: 8, moral: 4 },
            isaret: { ad: 'sevgili_ekseni', deger: 'acik' },
            sonraki: 'c',
          },
          {
            id: 'korkuyorum',
            label: '"Biraz korkuyorum aslında."',
            cevap:
              'Bir sessizlik. "Ben de." Sonra güldü. "İyi, ikimiz de korkuyoruz. Eşitiz."',
            etki: { iliski: 11, moral: 6, ozlem: 4 },
            isaret: { ad: 'sevgili_ekseni', deger: 'acik' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Şunu bilmeni istiyorum: bu on üç gün bana çok şey öğretti. Sen orada değişirken ben burada değişmişim."',
        secenekler: [
          {
            id: 'anlat',
            label: '"Nasıl değiştin? Anlat."',
            cevap:
              '"Daha sabırlıyım. Daha az soru soruyorum." Güldü. "Yalan, aynı kadar soruyorum."',
            etki: { iliski: 9, moral: 8 },
          },
          {
            id: 'ben_de',
            label: '"İkimiz de aynı şeyden geçiyoruz sayılır."',
            cevap: '"Sayılır." Bu kelimeyi beğendi. "Sayılır, evet."',
            etki: { iliski: 10, moral: 7 },
          },
        ],
      },
    },
  },

  {
    id: 'g13-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [13],
    kok: 'a',
    kapanis: '"Yarın yarısı. Yarısı oğlum."',
    replikler: {
      a: {
        id: 'a',
        metin: '"Koli geldi mi? Üç gün oldu, gelmesi lazımdı."',
        secenekler: [
          {
            id: 'gelmedi',
            label: '"Gelmedi anne. Bekliyorum."',
            cevap: '"Kayboldu mu acaba?" Yeni bir endişe kaynağı doğdu.',
            etki: { iliski: 3 },
            sonraki: 'b',
          },
          {
            id: 'yarin',
            label: '"Yarın dağıtacaklarmış. Listede var."',
            cevap: '"İyi. İçini açınca ara beni, ne olduğunu görmek istiyorum."',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Yarın on dördüncü gün. Yarısı. Bunu düşününce bir tuhaf oldum bugün, iyi anlamda."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de öyle. Yarısı garip bir sayı."',
            cevap: '"Garip evet. Hem çok hem az." Tam olarak bu.',
            etki: { iliski: 6, moral: 5 },
          },
          {
            id: 'gecer',
            label: '"Kalanı daha hızlı geçer anne."',
            cevap: '"Geçer inşallah." Duaya bağladı, her zamanki gibi.',
            etki: { iliski: 5, moral: 4 },
          },
        ],
      },
    },
  },

  {
    id: 'g13-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [13],
    kok: 'a',
    kapanis: '"Yarın yarıladın. Kutlarız." Kutladı, tek başına.',
    replikler: {
      a: {
        id: 'a',
        metin: '"On üç lan. Uğursuz sayı. Yarın on dört, o iyi."',
        secenekler: [
          {
            id: 'inanmam',
            label: '"Sen uğura mı inanıyorsun şimdi?"',
            cevap: '"İnanmam ama on üç yine de on üç." Mantık yok, umursamıyor.',
            etki: { iliski: 5, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'kotu',
            label: '"Bugün gerçekten kötü geçti bu arada."',
            cevap: '"Gördün mü!" Haklı çıkmanın keyfi. "Ne oldu, anlat."',
            etki: { iliski: 6, moral: 3 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Yarın yarıladığında ben burada bir şeyler yapacağım. Sen orada ne yapacaksın?"',
        secenekler: [
          {
            id: 'hicbir',
            label: '"Hiçbir şey. Aynı gün işte."',
            cevap: '"Olmaz." Ciddi. "Bir şey yap. Çay iç, sigara yak, bir şey yap."',
            etki: { iliski: 5, moral: 4 },
          },
          {
            id: 'centik',
            label: '"Duvara on dördüncü çentiği atarım."',
            cevap: '"İşte bu." Bunu çok beğendi. "Ben de burada bir kadeh kaldırırım."',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'centik_atiyor', deger: 'evet' },
          },
        ],
      },
    },
  },
];
