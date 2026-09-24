import type { Gorusme } from '../tipler';

/** GÜN 2 — YABANCILIK. 05:30 kalkış, ilk içtima. Kanka bugün ilk kez arıyor. */
export const GUN_02: Gorusme[] = [
  {
    id: 'g02-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [2],
    kok: 'a',
    kapanis: 'Kapatmadan önce üç kere "kendine iyi bak" dedi.',
    replikler: {
      a: {
        id: 'a',
        metin:
          '"Kaçta kaldırdılar seni? Beş mi? Beşte mi kalktın sen?" Bunu ilk defa duyuyor gibi soruyor.',
        secenekler: [
          {
            id: 'bes',
            label: '"Beşte. Zil çalmadan önce uyanmışım zaten."',
            cevap: '"Uyuyamadın mı?" Hemen oraya atladı.',
            etki: { iliski: 3, moral: 2 },
            sonraki: 'b',
          },
          {
            id: 'alisirim',
            label: '"Beş buçuk. Alışırım, herkes kalkıyor."',
            cevap: '"Alışırsın tabii." Rahatlamak istiyor, izin ver.',
            etki: { iliski: 4, moral: 3 },
            sonraki: 'b',
          },
          {
            id: 'sikayet',
            label: '"Beşte anne. Beşte. Sen beni okula bile zor kaldırırdın."',
            cevap: '"Kaldırırdım da kaldırmazdım, bırakırdım uyusun derdim." Güldü.',
            etki: { iliski: 5, moral: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"İçtima ne demek? Bugün içtimaya çıktık dedin ya. Neymiş o?" Sorduğuna göre gerçekten merak ediyor.',
        secenekler: [
          {
            id: 'anlat',
            label: 'Sıra, yoklama, sayım — tek tek anlat',
            cevap:
              '"Yani sırada duruyorsunuz." Özetledi. "Bunun için mi beş buçukta kalkıyorsunuz?" Haklı aslında.',
            etki: { iliski: 5, moral: 3 },
            sonraki: 'c',
          },
          {
            id: 'kisa',
            label: '"Uzun hikaye anne."',
            cevap: '"Uzunsa anlat, zamanım var." Ama senin yok.',
            etki: { iliski: -1, gerilim: 4 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Üşüdün mü sabah? O çorapları giydin mi, ince olanları giyme demiştim."',
        secenekler: [
          {
            id: 'giydim',
            label: '"Giydim anne. Merak etme."',
            cevap: '"İyi. Babana da söyleyeyim, o da merak ediyor ama sormuyor."',
            etki: { iliski: 4, digerIliski: { kim: 'baba', puan: 2 } },
          },
          {
            id: 'usumedim',
            label: '"Üşümeye vakit yok burada, sürekli koşturuyoruz."',
            cevap: '"Koşturuyor musunuz? Yorulma çok." Neyi dinlediği belli değil.',
            etki: { iliski: 3, enerji: 2 },
          },
          {
            id: 'usudum',
            label: '"Üşüdüm. Sabah beş buçukta hava buz gibiydi."',
            cevap: '"Biliyordum!" Bunu kazanmış gibi söyledi. "Koli yollayacağım ben sana."',
            etki: { iliski: 5, moral: 2 },
          },
        ],
      },
    },
  },

  {
    id: 'g02-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [2],
    kok: 'a',
    kapanis: 'Telefonu kapattın. Avluda hava kararmıştı.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Eee? İlk tam gün. Nasıl geçti?"',
        secenekler: [
          {
            id: 'uzun',
            label: '"Uzun. Çok uzun. Öğlen oldu sandım, saat dokuzmuş."',
            cevap: '"Ay o duyguyu biliyorum." Biliyor mu gerçekten, tartışılır ama iyi niyetli.',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'iyi',
            label: '"İyi geçti aslında. Fena değil."',
            cevap: '"Fena değil mi?" Bir şey daha bekliyor.',
            etki: { iliski: 2, gerilim: 3 },
            sonraki: 'b',
          },
          {
            id: 'bitkin',
            label: '"Ayaktayım ama uyuyorum sanki. Anlatması zor."',
            cevap: '"Anlatma o zaman. Ben konuşayım, sen dinle."',
            etki: { iliski: 6, moral: 7, enerji: 3 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ben bugün ne yaptım biliyor musun? Hiçbir şey. Cidden hiçbir şey. Kalktım, çalıştım, eve geldim. Anlatacak bir şeyim yok ve bu beni rahatsız etti."',
        secenekler: [
          {
            id: 'anlat',
            label: '"Anlat yine de. Ben de normal bir şey duymak istiyorum."',
            cevap:
              '"Tamam." Yirmi dakika mutfak dolabının kapağından bahsetti. Hiç sıkılmadın.',
            etki: { iliski: 7, moral: 8 },
            sonraki: 'c',
          },
          {
            id: 'kiskandim',
            label: '"Hiçbir şey yapmamak şu an bana lüks geliyor."',
            cevap: '"Haklısın." Sesinde bir suçluluk vardı, hemen geçti.',
            etki: { iliski: 4, moral: 3 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Bir şey soracağım. Orada senden başka kim var? Kimlerle konuşuyorsun?"',
        secenekler: [
          {
            id: 'kimse',
            label: '"Kimseyi tanımıyorum daha. İsimleri bile bilmiyorum."',
            cevap: '"Tanırsın. Sen çabuk kaynarsın." Bunu söylerken emin değildi.',
            etki: { iliski: 3, ozlem: 3 },
          },
          {
            id: 'birkac',
            label: '"Ranzanın altında bir çocuk var, Emre. Biraz konuştuk."',
            cevap: '"Emre." Adı kaydetti. Bundan sonra her konuşmada soracak.',
            etki: { iliski: 4, moral: 3 },
          },
          {
            id: 'saka',
            label: '"Yüz kişi var ve hepsi erkek. Endişelenme."',
            cevap: '"Endişelenmiyordum ki." Şimdi endişelenmiyor değil, gülüyor.',
            etki: { iliski: 5, moral: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g02-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [2],
    kok: 'a',
    kapanis: '"Kendine iyi bak lan." Onda bu, sarılmak demek.',
    replikler: {
      a: {
        id: 'a',
        metin: '"LAN {ad}! Yaşıyor musun? Kazıttılar mı? Kazıttılar değil mi, söyle."',
        secenekler: [
          {
            id: 'kazitti',
            label: '"Kazıttılar. Kafam yumurta gibi."',
            cevap: '"OHA." Bir sessizlik. "Fotoğraf yok mu?" Var olmadığını biliyor, umutlanıyor.',
            etki: { iliski: 5, moral: 8 },
            sonraki: 'b',
          },
          {
            id: 'yasak',
            label: '"Kameralı telefon yasak. Kurtuldun."',
            cevap: '"Ya be. Herkese gösterecektim." Gerçekten üzüldü.',
            etki: { iliski: 4, moral: 6 },
            sonraki: 'b',
          },
          {
            id: 'sira',
            label: '"Sıra sana da gelecek, o zaman konuşuruz."',
            cevap: '"Bak şimdi ciddileşti." Ama sesinde bir şey var — merak ediyor aslında.',
            etki: { iliski: 3, moral: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Anlat lan. Nasıl orası? Film gibi mi? Bağırıyorlar mı sürekli?"',
        secenekler: [
          {
            id: 'film',
            label: '"Film gibi değil. Daha çok... kuyruk gibi."',
            cevap: '"Kuyruk mu?" Duraksadı. "Yani sıkıcı mı?" Öyle olduğunu duyunca rahatladı.',
            etki: { iliski: 4, moral: 5 },
            sonraki: 'c',
          },
          {
            id: 'bagiriyorlar',
            label: '"Bağırıyorlar. Sabah bir çavuş beni de ayırdı."',
            cevap: '"HAHAHA. Anlat anlat." Senin başına gelen kötü şey onun günü oluyor.',
            etki: { iliski: 5, moral: 7 },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin:
          '"Neyse, bak, sen orada takılma kafana. Yirmi sekiz gün. Ben burada seni bekliyorum, hiçbir yere gitmiyorum."',
        secenekler: [
          {
            id: 'sag',
            label: '"Sağ ol lan."',
            cevap: '"Sağ olma, ara beni." Hemen bozdu ortamı, o öyledir.',
            etki: { iliski: 5, moral: 6 },
          },
          {
            id: 'gitme',
            label: '"Gidersin. Herkes gider zaten."',
            cevap: 'Bir sessizlik oldu. "Ben gitmem." Bu sefer şaka yapmadı.',
            etki: { iliski: 7, moral: 4, ozlem: 4 },
          },
        ],
      },
    },
  },
];
