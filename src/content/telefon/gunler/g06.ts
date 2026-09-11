import type { Gorusme } from '../tipler';

/** GÜN 6 — HESAP. Para bitiyor, kontör bitiyor. Kışlanın en sıradan sıkıntısı. */
export const GUN_06: Gorusme[] = [
  {
    id: 'g06-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [6],
    kok: 'a',
    kapanis: '"Parayı bugün yollatırım." Yollattı, konuşma biter bitmez.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Para bitti mi? Doğru söyle, bitti mi?"',
        secenekler: [
          {
            id: 'bitti',
            label: '"Azaldı. Kantin pahalı, kontör de gidiyor."',
            cevap: '"Neden söylemedin?" Kızmadı, üzüldü. Bu daha kötü.',
            etki: { iliski: 5, moral: 2 },
            isaret: { ad: 'para_durumu', deger: 'bitti' },
            sonraki: 'b',
          },
          {
            id: 'var',
            label: '"Var anne. İdare ediyorum."',
            cevap: '"İdare etme, harca." Bu cümleyi hayatında ilk defa kuruyor.',
            etki: { iliski: 3 },
            isaret: { ad: 'para_durumu', deger: 'idare' },
            sonraki: 'b',
          },
          {
            id: 'utaniyorum',
            label: '"İstemeye utanıyorum ya."',
            cevap:
              '"Neden utanıyorsun?" Sesi sertleşti. "Sen benim oğlumsun. Utanacak bir şey yok."',
            etki: { iliski: 8, moral: 5 },
            isaret: { ad: 'para_durumu', deger: 'utandi' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Sigara da alıyor musun oradan? Alma diyeceğim ama sen beni dinlemezsin."',
        secenekler: [
          {
            id: 'aliyorum',
            label: '"Alıyorum. Burada herkes içiyor."',
            kosul: { sigaraIcen: true },
            cevap: '"Biliyorum." Kavga etmedi bu sefer. "Sen bilirsin artık."',
            etki: { iliski: 2 },
          },
          {
            id: 'icmiyorum',
            label: '"İçmiyorum ben anne, biliyorsun."',
            kosul: { sigaraIcen: false },
            cevap: '"Biliyorum, biliyorum. Başlama sakın, orada herkes başlıyor."',
            etki: { iliski: 4, moral: 3 },
          },
          {
            id: 'cay',
            label: '"Çay içiyorum sadece. Günde on bardak."',
            cevap: '"On bardak mı?" Yeni endişe konusu. "Miden bozulur."',
            etki: { iliski: 4, moral: 4 },
          },
        ],
      },
    },
  },

  {
    id: 'g06-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [6],
    kok: 'a',
    kapanis: 'Kapattın. Yarın bir hafta olacak.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Bugün canım sıkkın. Seninle ilgili değil, işle ilgili. Ama sana anlatmak istiyorum, dinler misin?"',
        secenekler: [
          {
            id: 'anlat',
            label: '"Anlat. Bütün üç dakika senin."',
            cevap:
              'Anlattı. Üç dakikayı aştı, umursamadın. Sonunda: "Off, iyi geldi. Sağ ol."',
            etki: { iliski: 10, moral: 5 },
            isaret: { ad: 'dinleyen', deger: 'evet' },
            sonraki: 'b',
          },
          {
            id: 'kisa',
            label: '"Anlat ama kısa tut, kuyruk var arkamda."',
            cevap: '"Boş ver o zaman. Önemli değildi." Önemliydi.',
            etki: { iliski: -1, gerilim: 8 },
            sonraki: 'b',
          },
          {
            id: 'sonra',
            label: '"Yarın uzun uzun konuşalım mı? Bugün kafam çok dağınık."',
            cevap: '"Tamam." Anladı. Kırılmadı ama bir şey eksik kaldı.',
            etki: { iliski: 2, gerilim: 3 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Yarın bir hafta oluyor. Bir şey yapalım mı? Bilmiyorum, ne yapabiliriz ki."',
        secenekler: [
          {
            id: 'konusalim',
            label: '"Yarın uzun konuşalım. Kontörü ona saklayayım."',
            cevap: '"Tamam." Sesi aydınlandı. "Ben de saat ayarlarım."',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'hafta_sozu', deger: 'evet' },
          },
          {
            id: 'yapamayiz',
            label: '"Ne yapabiliriz ki gerçekten. Ben buradayım."',
            cevap: '"Haklısın." Kısa cevap. Konuyu kapattı.',
            etki: { iliski: 0, gerilim: 5 },
          },
        ],
      },
    },
  },

  {
    id: 'g06-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [6],
    kok: 'a',
    kapanis: '"Yarın bir hafta. Ararım." Aradı.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Lan bugün ne oldu biliyor musun? Senin sevdiğin o dükkan kapanmış. Yıkıyorlar."',
        secenekler: [
          {
            id: 'yok',
            label: '"Yok artık. Kaç senedir oradaydı."',
            cevap: '"Aynen. Ben de öyle dedim." İkiniz de bir süre sustunuz.',
            etki: { iliski: 5, moral: -2, ozlem: 5 },
            sonraki: 'b',
          },
          {
            id: 'anlatma',
            label: '"Ben buradayken dışarısı değişmesin lan."',
            cevap:
              '"Değişiyor işte." Sonra fark etti ne dediğini. "Ama çok değil. Sen gelene kadar kalanı dururum ben."',
            etki: { iliski: 6, moral: 2, ozlem: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Sen orada ne yiyorsun? Ciddi soruyorum, ne yediriyorlar?"',
        secenekler: [
          {
            id: 'fasulye',
            label: '"Kuru fasulye. Her gün. Bazen pilavla, bazen pilavsız."',
            cevap: '"Her gün mü?" Güldü. "Ben olsam çıldırırım."',
            etki: { iliski: 4, moral: 5 },
          },
          {
            id: 'idare',
            label: '"İdare eder aslında. Alıştım."',
            cevap: '"Alışmışsın. Kötü bu." Şaka yaptı ama bir doğruluk payı var.',
            etki: { iliski: 3, moral: 3 },
          },
          {
            id: 'ozlem',
            label: '"Annemin yemeğini özledim lan. Onu söyleyeyim."',
            cevap:
              '"Bizim evde de var. Çıkınca gelirsin, annem yapar." Bunu çok doğal söyledi.',
            etki: { iliski: 8, moral: 6, ozlem: 6 },
            isaret: { ad: 'ev_yemegi', deger: 'ozledi' },
          },
        ],
      },
    },
  },
];
