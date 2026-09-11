import type { Gorusme } from '../tipler';

/** GÜN 23 — ÖZÜR. Dünkü sessizliğin karşılığı. Beş gün kaldı. */
export const GUN_23: Gorusme[] = [
  {
    id: 'g23-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [23],
    oncelik: 150,
    kok: 'a',
    kapanis: '"Beş gün. Beş." Bu sefer sayıyı sakin söyledi.',
    replikler: {
      a: {
        id: 'a',
        kosul: { isaret: 'kanka_cevapsiz' },
        atla: 'genel',
        metin:
          '"Lan dün açamadım, kusura bakma. Telefonu evde unuttum, akşam gördüm aradığını. Kaç kere aramışsın."',
        secenekler: [
          {
            id: 'sorun_degil',
            label: '"Sorun değil lan. Bir şey olmadı."',
            cevap:
              '"Oldu." Israr etti. "Sen oradasın, ben açmıyorum. Olmaz öyle şey."',
            etki: { iliski: 8, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'merak',
            label: '"Merak ettim biraz. Aptalca ama merak ettim."',
            cevap:
              'Bir sessizlik. "Aptalca değil." Sesi ciddileşti. "Bir daha olmaz."',
            etki: { iliski: 11, moral: 7 },
            isaret: { ad: 'kanka_ozur', deger: 'kabul' },
            sonraki: 'b',
          },
          {
            id: 'bozuldum',
            label: '"Açıkçası bozuldum. Yirmi iki gündür ilk defa yoktun."',
            cevap:
              '"Haklısın." Savunmaya geçmedi. "Özür dilerim. Cidden özür dilerim."',
            etki: { iliski: 9, moral: 5 },
            isaret: { ad: 'kanka_ozur', deger: 'sitem' },
            sonraki: 'b',
          },
        ],
      },
      genel: {
        id: 'genel',
        metin: '"Beş gün lan! Beş! Bu hafta bitiyor bu iş."',
        secenekler: [
          {
            id: 'bitiyor',
            label: '"Bitiyor. İnanamıyorum hâlâ."',
            cevap: '"İnan lan." Kesin konuştu.',
            etki: { iliski: 6, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Plan kesin. Beş gün sonra, saat dörtte kapıdayım. Araba ayarladım, benzin aldım, her şey hazır."',
        secenekler: [
          {
            id: 'dort',
            label: '"Dörtte mi? Ben on birde çıkıyorum."',
            cevap:
              '"O zaman on birde oradayım." Hemen değiştirdi. "Sabahtan beklerim lan."',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'kanka_kapida', deger: 'evet' },
            sonraki: 'c',
          },
          {
            id: 'aile',
            label: '"Beni ailem alacak lan. Sen akşam gel."',
            cevap:
              '"Ha, tamam." Sesi biraz düştü, hemen toparladı. "Akşam gelirim o zaman. Daha iyi."',
            etki: { iliski: 5, moral: 5 },
            isaret: { ad: 'kanka_kapida', deger: 'aksam' },
            sonraki: 'c',
          },
          {
            id: 'ikisi',
            label: '"Ailem alacak ama sen de gel. Kalabalık olsun."',
            cevap: '"Gelirim!" Bunu duymayı bekliyordu. "Tanışırım onlarla."',
            etki: { iliski: 12, moral: 9 },
            isaret: { ad: 'kanka_kapida', deger: 'evet' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Bir şey daha. Sürpriz demiştim ya. Söyleyeyim mi, yoksa dursun mu?"',
        secenekler: [
          {
            id: 'dursun',
            label: '"Dursun. Beş gün beklerim."',
            cevap: '"İyi. Zaten söylemeyecektim." Söyleyecekti.',
            etki: { iliski: 7, moral: 7 },
            isaret: { ad: 'kanka_surpriz', deger: 'saklandi' },
          },
          {
            id: 'soyle',
            label: '"Söyle lan, dayanamıyorum."',
            cevap:
              '"Herkes geliyor. Sadece ben değil. Hepsi. Yirmi kişi falan." Sustun.',
            etki: { iliski: 9, moral: 11 },
            isaret: { ad: 'kanka_surpriz', deger: 'acildi' },
          },
        ],
      },
    },
  },

  {
    id: 'g23-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [23],
    kok: 'a',
    kapanis: '"Beş gün. Beş parmağım kadar." Elini saydı, telefonda.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Beş gün. Hazırlık yapıyorum, ne yalan söyleyeyim. Evi topluyorum."',
        secenekler: [
          {
            id: 'toplama',
            label: '"Toplama anne, yorulma."',
            cevap: '"Toplarım." Tartışma kapandı.',
            etki: { iliski: 5, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'iyi',
            label: '"Sen yaparken mutluysan yap."',
            cevap: '"Mutluyum." Kısa ve net. "Yirmi üç gündür ilk defa mutluyum."',
            etki: { iliski: 9, moral: 8 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir şey sorayım. Bu yirmi üç günde en çok neyi özledin? Merak ediyorum, cidden."',
        secenekler: [
          {
            id: 'yemek',
            label: '"Senin yemeğini. Bunu yüz kere düşündüm."',
            cevap: '"Biliyordum!" Zaferle söyledi. "Listeyi yaptım zaten."',
            etki: { iliski: 9, moral: 8 },
            isaret: { ad: 'en_cok_ozlenen', deger: 'yemek' },
          },
          {
            id: 'sessizlik',
            label: '"Sessizliği. Burada hiç sessiz olmuyor."',
            cevap: '"Aa." Bunu beklemiyordu. "Ev sessiz. Ev çok sessiz."',
            etki: { iliski: 8, moral: 6, ozlem: 6 },
            isaret: { ad: 'en_cok_ozlenen', deger: 'sessizlik' },
          },
          {
            id: 'kendi_yatagim',
            label: '"Kendi yatağımı. Bir de kapıyı kapatabilmeyi."',
            cevap: '"Kapını kimse açmayacak, söz." Bunu ciddi söyledi.',
            etki: { iliski: 8, moral: 7 },
            isaret: { ad: 'en_cok_ozlenen', deger: 'yalnizlik' },
          },
          {
            id: 'sizi',
            label: '"Sizi. Onu söylemem gerekiyordu galiba."',
            cevap: 'Sesi doldu. "Gerekmiyordu ama iyi oldu."',
            etki: { iliski: 12, moral: 8, ozlem: 8 },
            isaret: { ad: 'en_cok_ozlenen', deger: 'aile' },
          },
        ],
      },
    },
  },

  {
    id: 'g23-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [23],
    kok: 'a',
    kapanis: 'Beş gün. Konuşacak yeni şey kalmadı ve bu bir sorun değil.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Beş gün. Artık gerçekten yakın. Ben bugün heyecandan iş yapamadım."',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de bugün iki kere ceza yedim, dalgınlıktan."',
            cevap: '"Benim yüzümden mi?" Sevindi buna, saklamadı.',
            etki: { iliski: 9, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'sakin',
            label: '"Ben sakinim. Alışkanlık oldu galiba beklemek."',
            cevap: '"Sakin olma." Güldü. "Biraz heyecanlan, ben yalnız kalmayayım."',
            etki: { iliski: 7, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir şey fark ettim. Artık konuşacak yeni bir şeyimiz kalmadı ve bu beni rahatsız etmiyor."',
        secenekler: [
          {
            id: 'iyi',
            label: '"Ben de aynısını düşündüm. İyi bir yerdeyiz galiba."',
            cevap: '"İyi bir yerdeyiz." Bu cümleyi tekrar etti, hoşuna gitti.',
            etki: { iliski: 11, gerilim: -8, moral: 8 },
            isaret: { ad: 'sevgili_ekseni', deger: 'acik' },
          },
          {
            id: 'endise',
            label: '"Konuşacak şey kalmaması iyi mi kötü mü?"',
            cevap:
              '"İyi." Kesin konuştu. "Kötü olan, konuşacak şey varken konuşmamak."',
            etki: { iliski: 8, moral: 6 },
          },
        ],
      },
    },
  },
];
