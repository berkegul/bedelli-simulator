import type { Gorusme } from '../tipler';

/**
 * GÜN 28 — ÇIKIŞ. Sabah, evrak kuyruğunda, elinde telefon.
 * Kısa görüşmeler: artık konuşulacak bir şey yok, sadece "çıktım" var.
 */
export const GUN_28: Gorusme[] = [
  {
    id: 'g28-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [28],
    oncelik: 160,
    kok: 'a',
    kapanis: 'Kapattın. Nizamiyeye yüz metre var.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Çıktın mı? Çıktın mı oğlum? Biz buradayız, kapıdayız."',
        secenekler: [
          {
            id: 'cikiyorum',
            label: '"Çıkıyorum. Evrak kuyruğundayım, on dakika."',
            cevap: '"On dakika." Tekrarladı. "Tamam. On dakika bekleriz."',
            etki: { iliski: 8, moral: 10 },
          },
          {
            id: 'gordum',
            label: '"Sizi gördüm. Arabanın yanındasınız."',
            cevap:
              'Telefon düştü galiba, bir gürültü oldu. Sonra çok uzaktan: "Geliyor! Geliyor!"',
            etki: { iliski: 12, moral: 14 },
            isaret: { ad: 'cikis_ani', deger: 'gordu' },
          },
        ],
      },
    },
  },

  {
    id: 'g28-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [28],
    oncelik: 160,
    kosul: { sevgiliVar: true },
    kok: 'a',
    kapanis: 'Kapattın. Yirmi sekiz gün sonra ilk defa telefona ihtiyacın yok.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Çıktın mı?"',
        secenekler: [
          {
            id: 'ciktim',
            label: '"Çıkıyorum. Yirmi dakika sonra oradayım."',
            cevap: '"Ben hazırım." Sesi titriyordu. "Yirmi gündür hazırım."',
            etki: { iliski: 10, moral: 12 },
          },
          {
            id: 'neredesin',
            label: '"Sen neredesin?"',
            cevap:
              '"Kapıda." Kısa bir sessizlik. "Beş dakikadır kapıdayım. Sabah altıda çıktım evden."',
            kosul: { isaret: 'bulusma_yeri', isaretDeger: 'kapi' },
            etki: { iliski: 14, moral: 15 },
            isaret: { ad: 'cikis_ani', deger: 'kapida' },
          },
          {
            id: 'aksam',
            label: '"Akşam görüşürüz. Önce eve gideceğim."',
            cevap: '"Tamam." Kısa. "Akşam."',
            etki: { iliski: 4, moral: 6 },
          },
        ],
      },
    },
  },

  {
    id: 'g28-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [28],
    oncelik: 160,
    kok: 'a',
    kapanis: 'Kapattın. Kapıya doğru yürüdün.',
    replikler: {
      a: {
        id: 'a',
        metin: '"NEREDESİN LAN? Ben buradayım, kapıdayım, üç saattir buradayım!"',
        secenekler: [
          {
            id: 'geliyorum',
            label: '"Geliyorum lan. Kuyruk var."',
            cevap: '"Kuyruk mu? Son gününde bile kuyruk mu?" Buna delirdi.',
            etki: { iliski: 8, moral: 12 },
          },
          {
            id: 'uc_saat',
            label: '"Üç saattir mi bekliyorsun?"',
            cevap:
              '"Bekliyorum lan." Kısa durdu. "Yirmi sekiz gün bekledim, üç saat neyi değiştirir."',
            etki: { iliski: 14, moral: 14 },
            isaret: { ad: 'cikis_ani', deger: 'kanka_bekliyor' },
          },
        ],
      },
    },
  },
];
