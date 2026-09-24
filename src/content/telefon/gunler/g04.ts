import type { Gorusme } from '../tipler';

/** GÜN 4 — İSİMLER. Koğuştakiler artık isimli; sevgili bunu fark ediyor. */
export const GUN_04: Gorusme[] = [
  {
    id: 'g04-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [4],
    kok: 'a',
    kapanis: '"Yarın yine ara." Her kapanışta aynı cümle.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Arkadaş edindin mi? Yalnız kalma orada, konuş insanlarla."',
        secenekler: [
          {
            id: 'emre',
            label: '"Emre diye biri var, altımdaki ranzada. Onunla takılıyoruz."',
            cevap: '"Emre." Adını not etti. "Nereli? Ailesi ne iş yapıyor?" Başladı.',
            etki: { iliski: 6, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'birkac',
            label: '"Birkaç kişi. Daha isimlerini yeni öğrendim."',
            cevap: '"Öğrenirsin. Sen çabuk kaynarsın." Bunu her zaman söyler.',
            etki: { iliski: 3, moral: 3 },
            sonraki: 'b',
          },
          {
            id: 'yok',
            label: '"Kimseyle konuşmuyorum pek."',
            cevap:
              '"Niye konuşmuyorsun?" Sesi endişeli. "Konuş oğlum. Yalnız kalınca insan daralıyor."',
            etki: { iliski: 4, moral: -3, ozlem: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Para lazım mı? Babana söyleyeyim yollasın."',
        secenekler: [
          {
            id: 'yok',
            label: '"Yok anne, var param."',
            cevap: '"Yine de yollatayım." Yollatacak.',
            etki: { iliski: 3 },
          },
          {
            id: 'kontor',
            label: '"Kontör bitiyor çabuk. Telefon pahalı burada."',
            cevap:
              '"Ne kadar tutuyor?" Hesap yapmaya başladı. "Sen konuş, parayı ben hallederim."',
            etki: { iliski: 5, moral: 3 },
            isaret: { ad: 'para_durumu', deger: 'kontor' },
          },
        ],
      },
    },
  },

  {
    id: 'g04-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [4],
    kok: 'a',
    kapanis: 'Kapattın, telefonu cebine koydun, bir daha çıkardın, bir daha koydun.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Dün Emre dedin. Bugün de Emre dedin. Emre kim oluyor, bir tanışayım bari." Şaka yapıyor. Yarısı şaka.',
        secenekler: [
          {
            id: 'anlat',
            label: '"Aynı ranzada kalıyoruz. İyi çocuk, memleketten uzak o da."',
            cevap: '"Tamam tamam. Sadece adını çok duydum, kıskandım biraz." Güldü.',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'takil',
            label: '"Kıskandın mı sen?"',
            cevap: '"Kıskanmadım!" Kıskandı. "Kapatıyorum ha." Kapatmadı.',
            etki: { iliski: 6, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'bosver',
            label: '"Burada tek konuşacak insan o. Sen ne diyorsun ya."',
            cevap: 'Bir sessizlik. "Şaka yapıyordum." Yapıyordu ama böyle bir cevap beklemiyordu.',
            etki: { iliski: -2, gerilim: 9 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ben bugün senin sokağından geçtim. Bilerek değil, otobüs oradan geçiyor. Sonra bilerek gibi oldu."',
        secenekler: [
          {
            id: 'guzel',
            label: '"İyi yapmışsın. Geçtiğini bilmek iyi geldi."',
            cevap: '"Öyle mi?" Sesi yumuşadı. "Yarın da geçerim o zaman."',
            etki: { iliski: 8, moral: 7, ozlem: 4 },
          },
          {
            id: 'uzulme',
            label: '"Kendini üzme öyle."',
            cevap: '"Üzülmüyorum ki." Üzülüyordu, artık söylemeyecek.',
            etki: { iliski: 1, gerilim: 6 },
          },
          {
            id: 'ozlem',
            label: '"Ben de senin sokağını düşünüyorum burada. Sırayla, ev ev."',
            cevap: '"Yapma böyle şeyler." Ama devam etmeni istiyor.',
            etki: { iliski: 9, moral: 6, ozlem: 7 },
          },
        ],
      },
    },
  },

  {
    id: 'g04-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [4],
    kok: 'a',
    kapanis: 'Kapattıktan sonra bir süre gülümsedin.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Naber asker. Bugün ne yaptınız, vatanı mı kurtardınız?"',
        secenekler: [
          {
            id: 'temizlik',
            label: '"Mıntıka temizliği yaptık. İzmarit topladık iki saat."',
            cevap: '"Vatanı izmaritten kurtardınız yani." Kendi esprisine kendi güldü.',
            etki: { iliski: 5, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'bekledik',
            label: '"Bekledik. Sabahtan öğlene kadar bir yerde bekledik."',
            cevap:
              '"Niye?" "Bilmiyorum." "Kimse bilmiyor mu?" "Kimse bilmiyor." Bunu çok komik buldu.',
            etki: { iliski: 4, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Bak sana bir şey diyeceğim, bozulma. Ben de düşündüm askerliği yapayım mı diye."',
        secenekler: [
          {
            id: 'yapma',
            label: '"Yapma. Yapma derim ben sana."',
            cevap: '"Niye?" Gerçekten soruyor.',
            etki: { iliski: 4, moral: 2 },
            sonraki: 'c',
          },
          {
            id: 'yap',
            label: '"Yap. Bir gün nasılsa yapacaksın."',
            cevap: '"Haklısın da..." Sesi düştü. "Ertelemek kolay geliyor."',
            etki: { iliski: 5, moral: 3 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Neyse. Sen bir çık, ondan sonra konuşuruz. Çıkınca ilk ne yapacağız, onu düşün sen."',
        secenekler: [
          {
            id: 'dusunmedim',
            label: '"Daha düşünmedim."',
            cevap: '"Düşün. Burada plan yapacak adam lazım bana."',
            etki: { iliski: 3 },
          },
          {
            id: 'dusundum',
            label: '"Düşündüm zaten. Sürekli düşünüyorum."',
            cevap: '"HA ŞÖYLE." Sesi yükseldi. "Anlat bakalım."',
            etki: { iliski: 6, moral: 6 },
          },
        ],
      },
    },
  },
];
