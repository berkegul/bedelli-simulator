import type { Gorusme } from '../tipler';

/**
 * GÜN 17 — KOLİ. Anne ilişkisinin tek somut ödülü.
 * Kolinin içi puanla değişiyor: yüksekse mektup ve kurabiye çıkıyor,
 * düşükse sadece çorap. Oyuncuya puan gösterilmiyor ama on yedi günün
 * karşılığı bir kutunun içinde duruyor.
 */
export const GUN_17: Gorusme[] = [
  {
    id: 'g17-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [17],
    oncelik: 140,
    kok: 'a',
    kapanis: 'Koliyi dolaba kaldırdın. Kutu boşaldı ama ağırlığı kalmadı gitmedi.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Geldi mi? Söyle, geldi mi?"',
        secenekler: [
          {
            id: 'geldi',
            label: '"Geldi anne. Bugün dağıttılar."',
            cevap: '"Açtın mı? Aç, telefonda açsana, ben duyayım."',
            etki: { iliski: 5, moral: 6 },
            sonraki: 'ac',
          },
          {
            id: 'actim',
            label: '"Geldi, açtım bile."',
            cevap: '"Beni beklemeden mi açtın?" Kırıldı ama iki saniye sürdü.',
            etki: { iliski: 3, moral: 5 },
            sonraki: 'ac',
          },
        ],
      },
      ac: {
        id: 'ac',
        kim: 'anlatici',
        metin: 'Kutuyu ankesörün yanında, dizinin üstünde açtın.',
        sonraki: 'zengin',
      },
      zengin: {
        id: 'zengin',
        kim: 'anlatici',
        kosul: { iliskiMin: { anne: 75 } },
        atla: 'orta',
        metin:
          'Kalın çorap. İki kat. Kurabiye — kavanozda, ağzı bezle bağlanmış. Pişik pudrası. Bir paket ıslak mendil. Ve en altta, katlanmış bir kağıt: babanın el yazısı. Üç satır.',
        secenekler: [
          {
            id: 'oku',
            label: 'Kağıdı aç ve oku',
            cevap:
              '"Oğlum. Ayağını üşütme. Bitiyor." İmza yok. Baban imza atmaz.',
            etki: { iliski: 10, moral: 12, ozlem: 8, digerIliski: { kim: 'baba', puan: 12 } },
            isaret: { ad: 'koli_icerigi', deger: 'mektup' },
            sonraki: 'son',
          },
          {
            id: 'kurabiye',
            label: '"Kurabiye yapmışsın. Kavanozla yapmışsın."',
            cevap:
              '"Kavanozda bozulmuyor." Sesi çok mutluydu. "Paylaş arkadaşlarınla, tamam mı?"',
            etki: { iliski: 12, moral: 10, ozlem: 6 },
            isaret: { ad: 'koli_icerigi', deger: 'kurabiye' },
            sonraki: 'son',
          },
        ],
      },
      orta: {
        id: 'orta',
        kim: 'anlatici',
        kosul: { iliskiMin: { anne: 45 } },
        atla: 'sade',
        metin:
          'Kalın çorap, iki çift. Bir paket bisküvi, marketten. Pişik pudrası. Düzgün yerleştirilmiş, özenli.',
        secenekler: [
          {
            id: 'tesekkur',
            label: '"Her şeyi düşünmüşsün."',
            cevap: '"Düşünürüm tabii." Memnun oldu.',
            etki: { iliski: 7, moral: 7 },
            isaret: { ad: 'koli_icerigi', deger: 'normal' },
            sonraki: 'son',
          },
          {
            id: 'corap',
            label: '"Çorap tam lazımdı. Nereden bildin?"',
            cevap: '"Bilmez miyim?" Bilir.',
            etki: { iliski: 8, moral: 6 },
            isaret: { ad: 'koli_icerigi', deger: 'normal' },
            sonraki: 'son',
          },
        ],
      },
      sade: {
        id: 'sade',
        kim: 'anlatici',
        metin:
          'İki çift çorap. Bir paket bisküvi. Kutunun geri kalanı boş — gazete kağıdıyla doldurulmuş.',
        secenekler: [
          {
            id: 'sagol',
            label: '"Sağ ol anne."',
            cevap:
              '"Ne isteyeceğini bilemedim." Bir sessizlik. "Sormak istedim ama... neyse."',
            etki: { iliski: 4, moral: 3, ozlem: 5 },
            isaret: { ad: 'koli_icerigi', deger: 'sade' },
            sonraki: 'son',
          },
          {
            id: 'soracaktin',
            label: '"Sorsaydın. Ben söylerdim."',
            cevap:
              '"Sormadım işte." Sesi düştü. "Son zamanlarda pek konuşamıyoruz da."',
            etki: { iliski: 6, moral: 2, ozlem: 7 },
            isaret: { ad: 'koli_icerigi', deger: 'sade' },
            sonraki: 'son',
          },
        ],
      },
      son: {
        id: 'son',
        kim: 'anne',
        metin: '"On bir gün kaldı. On bir. Bir koli daha yollasam yetişir mi?"',
        secenekler: [
          {
            id: 'yetismez',
            label: '"Yetişmez anne. Ben geliyorum zaten."',
            cevap:
              '"Sen geliyorsun." Bu cümleyi ilk defa böyle kurdu. Ağladı biraz.',
            etki: { iliski: 10, moral: 8, ozlem: 6 },
            isaret: { ad: 'geliyorum', deger: 'soyledi' },
          },
          {
            id: 'yolla',
            label: '"Yolla. Yetişmese de yolla."',
            cevap: '"Yollarım." Yollayacak, yetişmeyeceğini bilse de.',
            etki: { iliski: 8, moral: 7 },
          },
        ],
      },
    },
  },

  {
    id: 'g17-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [17],
    kok: 'a',
    kapanis: 'On bir gün. Artık cümlelerde "gelince" diye başlayanlar çoğaldı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Koli geldi mi? Annen yolladı demiştin."',
        secenekler: [
          {
            id: 'geldi',
            label: '"Geldi. Açarken tuhaf oldum biraz."',
            cevap: '"Niye tuhaf oldun?" Yumuşak sordu.',
            etki: { iliski: 6, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'kurabiye',
            label: '"Kurabiye yollamış. Koğuşta dağıttım, on saniyede bitti."',
            cevap: '"On saniye mi?" Güldü. "Sana kaldı mı bari?"',
            etki: { iliski: 7, moral: 7 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ben de bir şey yollamak istiyorum ama ne yollayacağımı bilemedim. Annenle yarışamam."',
        secenekler: [
          {
            id: 'yarisma',
            label: '"Yarışma zaten. Sen başka bir şeysin."',
            cevap: '"Başka bir şey." Bu cevabı beğendi. "Tamam."',
            etki: { iliski: 10, moral: 7 },
            sonraki: 'c',
          },
          {
            id: 'mektup',
            label: '"Bir şey yaz. Kağıda yaz, yolla."',
            cevap: '"Mektup mu?" Sustu. "Tamam. Yazarım."',
            etki: { iliski: 12, moral: 8 },
            isaret: { ad: 'sevgili_mektup', deger: 'yazacak' },
            sonraki: 'c',
          },
          {
            id: 'gerek_yok',
            label: '"Gerek yok, on bir gün kaldı."',
            cevap: '"Haklısın." Vazgeçti. Vazgeçmesini istemiyordun aslında.',
            etki: { iliski: 2, gerilim: 5 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"On bir gün. Ben artık \'gelince\' diye cümle kuruyorum. Fark ettin mi?"',
        secenekler: [
          {
            id: 'ben_de',
            label: '"Ben de kuruyorum. Bugün üç kere kurdum."',
            cevap: '"Say bakalım." Saydın, güldü.',
            etki: { iliski: 9, moral: 8 },
          },
          {
            id: 'erken',
            label: '"Erken değil mi biraz?"',
            cevap: '"Erken değil." Kesin konuştu. "On bir gün erken değil."',
            etki: { iliski: 5, moral: 5 },
          },
        ],
      },
    },
  },

  {
    id: 'g17-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [17],
    kok: 'a',
    kapanis: '"On bir gün lan. On bir." Bu cümle onun için de bir şey ifade ediyor artık.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Koli geldi mi? Ne yolladı annen? Yemek var mı?"',
        secenekler: [
          {
            id: 'kurabiye',
            label: '"Kurabiye. Ama bitti, koğuş yedi."',
            cevap: '"Sen yemedin mi?" "Bir tane yedim." "Vah lan."',
            etki: { iliski: 5, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'corap',
            label: '"Çorap. Heyecanlanma."',
            cevap: '"Çorap da lazım lan, küçümseme." Haklı.',
            etki: { iliski: 4, moral: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ben de bir şey yollayacaktım ama nasıl yollanır bilmiyorum. Adres falan lazım galiba."',
        secenekler: [
          {
            id: 'gerek_yok',
            label: '"Gerek yok lan. On bir gün kaldı."',
            cevap: '"Tamam o zaman." Rahatladı, aslında yollamayacaktı.',
            etki: { iliski: 4, moral: 4 },
          },
          {
            id: 'dusunmus',
            label: '"Düşünmüş olman yeter zaten."',
            cevap: '"Lan duygusallaşma." Ama hoşuna gitti.',
            etki: { iliski: 7, moral: 6 },
          },
        ],
      },
    },
  },
];
