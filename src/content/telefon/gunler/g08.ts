import type { Gorusme } from '../tipler';

/** GÜN 8 — RUTİN. Zilden önce uyanıyorsun. Artık şaşırtıcı bir şey yok. */
export const GUN_08: Gorusme[] = [
  {
    id: 'g08-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [8],
    kok: 'a',
    kapanis: 'Kısa konuştunuz. İkiniz de bunu normal buldu — bu da bir ilerleme.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Ne yaptınız bugün?" Artık her gün bunu soruyor ve cevabı hep aynı.',
        secenekler: [
          {
            id: 'ayni',
            label: '"Aynı şeyler anne. Gerçekten aynı."',
            cevap: '"Olsun, yine anlat." Anlatmanı istiyor, bilgiyi değil sesi istiyor.',
            etki: { iliski: 4, moral: 3 },
            sonraki: 'b',
          },
          {
            id: 'uyandim',
            label: '"Bugün zil çalmadan uyandım. Kendiliğinden."',
            cevap: '"Aa." Duraksadı. "Alışmışsın demek." Bu ona hem iyi hem kötü geldi.',
            etki: { iliski: 5, moral: 4 },
            isaret: { ad: 'alisma_isareti', deger: 'g8' },
            sonraki: 'b',
          },
          {
            id: 'anlatmak',
            label: 'Her şeyi tek tek anlat — kalkış, içtima, yemek, temizlik',
            cevap:
              '"Tamam tamam, anladım." Yarısında kesti ama sonuna kadar dinlemek istedi.',
            etki: { iliski: 6, moral: 3 },
            isaret: { ad: 'anlatan', deger: 'evet' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Koli yolladım bu sabah. Üç gün sonra elinde olur dediler."',
        secenekler: [
          {
            id: 'sagol',
            label: '"Sağ ol anne. Ne koydun içine?"',
            cevap: '"Söylemem." Gülüyor. "Açınca görürsün."',
            etki: { iliski: 6, moral: 6 },
            isaret: { ad: 'koli_yolda', deger: 'evet' },
          },
          {
            id: 'gerekyoktu',
            label: '"Gerek yoktu ya."',
            cevap: '"Vardı." Tartışma bitti.',
            etki: { iliski: 3 },
            isaret: { ad: 'koli_yolda', deger: 'evet' },
          },
        ],
      },
    },
  },

  {
    id: 'g08-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [8],
    kok: 'a',
    kapanis: 'Aynı saatte, aynı yerde. Bir düzen kuruldu.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Tam zamanında aradın. Saate bakıyordum." Sesinde bir memnuniyet var, saklamıyor.',
        secenekler: [
          {
            id: 'ayarladim',
            label: '"Ayarladım. Sıraya erken giriyorum bu saat tutsun diye."',
            cevap:
              '"Erken mi giriyorsun?" Bunu duymayı beklemiyordu. "Off. Tamam. Sus."',
            etki: { iliski: 10, moral: 7 },
            isaret: { ad: 'randevu_sozu', deger: 'tutuyor' },
            sonraki: 'b',
          },
          {
            id: 'tesadüf',
            label: '"Tesadüf oldu aslında."',
            cevap: '"Tesadüf mü?" Hafif bozuldu. "Tamam."',
            etki: { iliski: 1, gerilim: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bugün bir şey fark ettim. Seninle konuşurken günümü anlatmak için gün boyu bir şeyler biriktiriyorum. Sen de öyle misin?"',
        secenekler: [
          {
            id: 'aynen',
            label: '"Aynen öyle. Bugün şunu anlatırım diyorum sabahtan."',
            cevap: '"Biz aynı şeyi yapıyoruz o zaman." Bu ona iyi geldi.',
            etki: { iliski: 9, moral: 7 },
            isaret: { ad: 'biriktiren', deger: 'evet' },
            sonraki: 'c',
          },
          {
            id: 'bende',
            label: '"Bende biriken bir şey yok ki. Her gün aynı."',
            cevap: '"O zaman ben iki kişilik biriktiririm." Çözüm buldu yine.',
            etki: { iliski: 6, moral: 5 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Yirmi gün kaldı. Yirmi. Artık iki haneli ama sonu gelecek gibi duruyor."',
        secenekler: [
          {
            id: 'geliyor',
            label: '"Geliyor. Bu hafta hızlı geçti."',
            cevap: '"Bana yavaş geçti." Hemen düzeltti: "Ama sorun değil."',
            etki: { iliski: 5, moral: 4 },
          },
          {
            id: 'yavas',
            label: '"Bana da yavaş geçti. İkimiz için de zor."',
            cevap: '"Zor olduğunu söylemen iyi geldi." Beklemiyordu.',
            etki: { iliski: 9, moral: 5, ozlem: 5 },
            isaret: { ad: 'sevgili_derin', deger: 'g8' },
          },
        ],
      },
    },
  },

  {
    id: 'g08-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [8],
    kok: 'a',
    kapanis: '"Hadi lan, işe geç kalıyorum." Geç kaldı, umursamadı.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Lan bugün işte olay çıktı. Müdür bana bağırdı, ben de ona bağırdım. Sonra özür diledik ikimiz de."',
        secenekler: [
          {
            id: 'anlat',
            label: '"Anlat lan. Detaylı anlat."',
            cevap:
              'Anlattı. Yarısı abartıydı, farkındasın. İyi geldi yine de — dışarıda hayat sürüyor.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'kiskandim',
            label: '"Bağırabiliyor olman bile lüks lan."',
            cevap: '"Haklısın." Güldü. "Burada özür dilemek serbest."',
            etki: { iliski: 5, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Sen ne yapıyorsun? Aynı mı her gün?"',
        secenekler: [
          {
            id: 'ayni',
            label: '"Aynı. Ama artık rahatsız etmiyor."',
            cevap: '"Bu iyi mi kötü mü bilemedim." Sen de bilemiyorsun.',
            etki: { iliski: 4, moral: 4 },
            isaret: { ad: 'alisma_isareti', deger: 'g8' },
          },
          {
            id: 'sikildim',
            label: '"Sıkıldım lan. Zor değil, sıkıcı."',
            cevap: '"Sıkıcı olan daha kötü aslında." Bunu iyi anladı.',
            etki: { iliski: 5, moral: 2 },
          },
        ],
      },
    },
  },
];
