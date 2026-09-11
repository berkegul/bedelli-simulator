import type { Gorusme } from '../tipler';

/**
 * GÜN 22 — SESSİZLİK. Kanka bugün ne arıyor ne açıyor.
 * Boşluk da bir anlatı aracı: yirmi bir gün boyunca hep orada olan kişinin
 * bir gün olmaması, ertesi günkü özrü anlamlı kılıyor. Oyuncu ararsa
 * telefon çalıyor ve açılmıyor — sessizliği duyması lazım.
 */
export const GUN_22: Gorusme[] = [
  {
    id: 'g22-kanka-cevapsiz',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [22],
    oncelik: 200,
    kok: 'a',
    kapanis: 'Kontörün gitti, konuşma olmadı. Bu his tuhaf.',
    ankesorKapanis: 'Kırk dakika kuyrukta bekledin ve kimse açmadı.',
    replikler: {
      a: {
        id: 'a',
        kim: 'anlatici',
        metin:
          'Telefon çaldı. Bir kere, iki kere, beş kere. Açılmadı. Yirmi bir gündür ilk defa açılmadı.',
        secenekler: [
          {
            id: 'tekrar',
            label: 'Bir daha ara',
            cevap: 'Yine açılmadı. Kontörün yarısı gitti.',
            etki: { moral: -6, ozlem: 6 },
            isaret: { ad: 'kanka_cevapsiz', deger: 'g22' },
            sonraki: 'b',
          },
          {
            id: 'kapat',
            label: 'Kapat',
            cevap: 'Kapattın. Meşguldür diye düşündün. Düşünmeye çalıştın.',
            etki: { moral: -3, ozlem: 4 },
            isaret: { ad: 'kanka_cevapsiz', deger: 'g22' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        kim: 'anlatici',
        metin:
          'Ankesörün önünde durdun. Arkanda kuyruk vardı, biri "bitti mi?" dedi. Bitti.',
        secenekler: [
          {
            id: 'bosver',
            label: '"Bitti." Sıradan çık.',
            cevap: 'Çıktın. Akşam boyunca telefona baktın, çalmadı.',
            etki: { moral: -2 },
          },
          {
            id: 'sevgili',
            label: 'Sırayı bırakma — başkasını ara',
            cevap: 'Sırada kaldın. Kimi arayacağını biliyorsun.',
            etki: { moral: 2 },
          },
        ],
      },
    },
  },

  {
    id: 'g22-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [22],
    kok: 'a',
    kapanis: '"Altı gün." Sayı küçüldükçe sesi yükseliyor.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Altı gün! Altı! Bugün çarşıya gittim, sana bir şeyler aldım."',
        secenekler: [
          {
            id: 'ne',
            label: '"Ne aldın?"',
            cevap: '"Söylemem." Gülüyor. "Gelince görürsün."',
            etki: { iliski: 7, moral: 7 },
            sonraki: 'b',
          },
          {
            id: 'gerek',
            label: '"Alma bir şey anne, geliyorum zaten."',
            cevap: '"Aldım bile." Geç kaldın.',
            etki: { iliski: 5, moral: 6 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Sesin bugün düşük. Bir şey mi oldu?"',
        secenekler: [
          {
            id: 'kanka',
            label: '"Bir arkadaşımı aradım, açmadı. Saçma ama moralim bozuldu."',
            kosul: { isaret: 'kanka_cevapsiz' },
            cevap:
              '"Saçma değil." Ciddiye aldı. "Alışıyorsun insanlara, olmayınca fark ediyorsun."',
            etki: { iliski: 8, moral: 6 },
          },
          {
            id: 'yorgun',
            label: '"Yorgunum sadece."',
            cevap: '"Altı gün. Altı gün sonra dinlenirsin." Tek ilacı bu.',
            etki: { iliski: 5, moral: 5 },
          },
        ],
      },
    },
  },

  {
    id: 'g22-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [22],
    kok: 'a',
    kapanis: 'Kapattın. Altı gün.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Altı gün. Bugün nasıl geçti?"',
        secenekler: [
          {
            id: 'bos',
            label: '"Boş geçti. Anlatacak bir şey yok bugün."',
            cevap: '"Olsun." Israr etmedi, o artık öğrendi.',
            etki: { iliski: 4 },
            sonraki: 'b',
          },
          {
            id: 'kanka',
            label: '"Kankamı aradım, açmadı. Ufak bir şey ama kafamı meşgul etti."',
            kosul: { isaret: 'kanka_cevapsiz' },
            cevap:
              '"Bir sebebi vardır." Sonra: "Sen de her gün açamıyorsun ama, değil mi?" Haklı.',
            etki: { iliski: 8, moral: 5 },
            sonraki: 'b',
          },
          {
            id: 'iyi',
            label: '"Normal geçti. Artık her gün normal."',
            cevap: '"Normal iyidir." Bunu inanarak söyledi.',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Altı gün sonra bu konuşmaları özleyecek miyiz sence?"',
        secenekler: [
          {
            id: 'evet',
            label: '"Özleyeceğiz bence. Garip ama özleyeceğiz."',
            cevap: '"Ben de öyle düşündüm ve kendime kızdım." Güldü.',
            etki: { iliski: 10, moral: 7 },
            isaret: { ad: 'telefon_ozlemi', deger: 'evet' },
          },
          {
            id: 'hayir',
            label: '"Asla. Yüz yüze varken telefon niye özlensin?"',
            cevap: '"Haklısın." Ama tam ikna olmadı.',
            etki: { iliski: 5, moral: 5 },
          },
        ],
      },
    },
  },
];
