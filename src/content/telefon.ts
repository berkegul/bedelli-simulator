import type { YakinlikTuru } from '../engine/types';

export const YAKINLIK_ADI: Record<YakinlikTuru, string> = {
  ebeveyn: 'Annem / Babam',
  sevgili: 'Sevgilim',
  es: 'Eşim',
  kardes: 'Kardeşim',
  arkadas: 'Arkadaşım',
};

export const YAKINLIK_KISA: Record<YakinlikTuru, string> = {
  ebeveyn: 'Ebeveyn',
  sevgili: 'Sevgili',
  es: 'Eş',
  kardes: 'Kardeş',
  arkadas: 'Arkadaş',
};

export type TelefonSecenek = {
  label: string;
  /** Karşı tarafın buna verdiği cevap. */
  cevap: string;
  moral: number;
  /** Bazı cevaplar seni de toparlıyor. */
  enerji?: number;
};

export type TelefonKonusma = {
  id: string;
  /** Telefon açıldığında ilk duyduğun cümle. {ad} oyuncunun adıyla değişir. */
  acilis: string;
  secenekler: TelefonSecenek[];
  /** Konuşmanın kapanışı; seçimden bağımsız. */
  kapanis: string;
};

/**
 * Her yakınlık kendi diliyle konuşuyor. Anneyle yemek ve üşüme konuşulur,
 * sevgiliyle özlem, kankayla dalga geçilir. Aynı cümleyi herkese
 * söyletmek bu mekaniği tatsız yapıyordu.
 */
export const TELEFON_KONUSMALARI: Record<YakinlikTuru, TelefonKonusma[]> = {
  ebeveyn: [
    {
      id: 'eb-yemek',
      acilis:
        '"Alo {ad}? Sesin iyi geliyor mu bakayım... Yemekler nasıl, doyuyor musun? Zayıflamışsındır sen."',
      secenekler: [
        {
          label: '"İyiyim anne, yemekler güzel."',
          cevap: '"Güzelmiş diyor ama ben bilirim. Kantinden bir şeyler al, parayı idareli kullan."',
          moral: 12,
        },
        {
          label: '"Doğru düzgün yemiyorum aslında."',
          cevap:
            '"Aman oğlum, yiyeceksin! Ben burada senin için dua ediyorum, sen orada aç kalıyorsun." Sesi titredi.',
          moral: 6,
        },
        {
          label: 'Sesini çıkarma, sadece dinle',
          cevap: '"Konuşmuyorsun... Zor mu geliyor? Yirmi sekiz gün çabuk geçer oğlum, bak geçer."',
          moral: 9,
        },
      ],
      kapanis: 'Telefonu kapattığında kulağında hâlâ sesi vardı.',
    },
    {
      id: 'eb-usume',
      acilis:
        '"Hava soğudu burada, orada nasıl? Üşüyor musun? O aldığımız çorapları giy, ince olanları giyme."',
      secenekler: [
        {
          label: '"Giyiyorum anne, merak etme."',
          cevap: '"Tamam tamam. Babana da söyleyeyim, o da merak ediyor ama sormuyor. Bilirsin."',
          moral: 11,
        },
        {
          label: '"Burada üşümeye vakit yok, sürekli koşturuyoruz."',
          cevap: '"Koşturuyor musun? Yorulma çok. Ayağını da üşütme." Neyi dinlediği belli değil.',
          moral: 8,
          enerji: 2,
        },
      ],
      kapanis: 'Kapatmadan önce üç kere "kendine iyi bak" dedi.',
    },
    {
      id: 'eb-baba',
      acilis:
        'Telefonu baban açtı. Bir sessizlik oldu. "Eee. Nasıl gidiyor orada?" Baban telefonda hiç rahat olmaz.',
      secenekler: [
        {
          label: '"İyi gidiyor baba. Alıştım."',
          cevap: '"Hı. İyi. Alışırsın." Duraksadı. "Ben de yapmıştım. Zor değil." Bu, onun övgüsü.',
          moral: 14,
        },
        {
          label: '"Zor baba. Çok zor."',
          cevap:
            '"Zordur." Uzun bir sessizlik. "Ama sen yaparsın." Bunu ondan duymak beklediğinden ağır geldi.',
          moral: 10,
        },
      ],
      kapanis: '"Anneni vereyim" dedi ve rahatladı.',
    },
  ],

  sevgili: [
    {
      id: 'sv-ozlem',
      acilis: '"Aşkııım! Sonunda! Kaç gündür bekliyorum bu telefonu. Çok özledim seni."',
      secenekler: [
        {
          label: '"Ben daha çok özledim."',
          cevap: '"Yalancı." Gülüyor. "Ama devam et, hoşuma gidiyor."',
          moral: 16,
        },
        {
          label: '"Burada seni düşünmeye bile vakit yok." (şaka)',
          cevap: '"Ne?! Kapatıyorum ha!" Kapatmadı tabii. On dakika bunun üstüne güldünüz.',
          moral: 13,
        },
        {
          label: '"Sesini duymak iyi geldi, gerçekten."',
          cevap: '"Sesin yorgun geliyor. İyi misin sen?" Fark etti. Hep fark eder.',
          moral: 14,
          enerji: 3,
        },
      ],
      kapanis: 'Kapatırken ikiniz de kapatmadınız. Sonunda o kapattı.',
    },
    {
      id: 'sv-kavga',
      acilis:
        '"Neden aramadın dün? Bütün gün telefonun başında bekledim." Sesi kırgın, kızgın değil.',
      secenekler: [
        {
          label: '"Nöbetteydim, gerçekten arayamadım."',
          cevap: '"Biliyorum... Biliyorum. Sadece zor. Sen orada, ben burada." Sesi yumuşadı.',
          moral: 10,
        },
        {
          label: '"Özür dilerim. Haklısın."',
          cevap: '"Kızmadım ki. Sadece seni merak ediyorum." Bir süre sessiz kaldınız, iyi bir sessizlikti.',
          moral: 13,
        },
        {
          label: '"Burası asker ocağı, otel değil."',
          cevap: '"Biliyorum ne olduğunu." Ses tonu değişti. Konuşma orada bitti.',
          moral: -6,
        },
      ],
      kapanis: 'Telefonu kapattın ve bir süre ankesörün önünde durdun.',
    },
    {
      id: 'sv-gun',
      acilis: '"Anlat bakalım, günün nasıl geçti? Her şeyi anlat, hiçbir şeyi atlama."',
      secenekler: [
        {
          label: 'Bütün günü tek tek anlat',
          cevap:
            '"Yatak toplamayı bu kadar heyecanla anlatan başka biri yoktur." Gülüyor ama sonuna kadar dinledi.',
          moral: 15,
        },
        {
          label: '"Her gün aynı. Anlatacak bir şey yok."',
          cevap: '"Olsun, aynısını anlat. Sesini dinliyorum ben zaten."',
          moral: 12,
        },
      ],
      kapanis: 'Üç dakika üç saniye gibi geçti.',
    },
  ],

  es: [
    {
      id: 'es-ev',
      acilis:
        '"Merhaba. Ev sessiz, alışamadım. Çocuk her akşam kapıya bakıyor, sen geleceksin sanıyor."',
      secenekler: [
        {
          label: '"Söyle ona, yakında geliyorum."',
          cevap: '"Söylüyorum. Bugün resmini yapmış, üniformalı. Kepini yamuk çizmiş." Gülüyor.',
          moral: 15,
        },
        {
          label: '"Sen nasılsın? Yalnız başına zor olmalı."',
          cevap:
            '"İdare ediyorum." Kısa bir duraklama. "Sormana sevindim." Bunu söylemesi ona zor gelir.',
          moral: 13,
        },
      ],
      kapanis: 'Kapatmadan önce çocuğun sesini duydun: "Babaaa!"',
    },
    {
      id: 'es-isler',
      acilis: '"Faturaları ödedim, merak etme. Sen kendine bak, buradaki işleri ben hallederim."',
      secenekler: [
        {
          label: '"Sana çok yük bindi, biliyorum."',
          cevap: '"Yük değil. Yirmi sekiz gün. Sen daha zorunu yapıyorsun."',
          moral: 12,
        },
        {
          label: '"Bir şeye ihtiyacın olursa ablamı ara."',
          cevap: '"Aradım bile. Bize yemek getirdi." Her şeyi düşünmüş, her zamanki gibi.',
          moral: 10,
        },
      ],
      kapanis: 'Telefonu kapattın. Evin döndüğünde yerinde duracağını biliyorsun.',
    },
  ],

  kardes: [
    {
      id: 'kd-dalga',
      acilis: '"Ooo asker abi! Saçları kazıttılar mı? Fotoğraf yok mu, göremiyoruz seni."',
      secenekler: [
        {
          label: '"Kameralı telefon yasak, kurtuldun."',
          cevap: '"Ne yazık. Ben de herkese göstereceğim diyordum." Gülüyor, sen de gülüyorsun.',
          moral: 12,
        },
        {
          label: '"Sıra sana da gelecek, o zaman konuşuruz."',
          cevap: '"Bak şimdi ciddileşti." Ama sesinde bir şey var — merak ediyor aslında.',
          moral: 10,
        },
      ],
      kapanis: '"Annem seni soruyor sürekli, ara onu" dedi ve kapattı.',
    },
    {
      id: 'kd-ev',
      acilis: '"Evde sen yokken sessiz. Annem sürekli senin odana giriyor, bir şey aramıyor da."',
      secenekler: [
        {
          label: '"Ona göz kulak ol."',
          cevap: '"Oluyorum zaten." Bir an durdu. "Sen de kendine dikkat et."',
          moral: 13,
        },
        {
          label: '"Odama girme sakın."',
          cevap: '"Girdim bile." Gülüşme. Bu kadar normal bir şey duymak iyi geldi.',
          moral: 11,
        },
      ],
      kapanis: 'Kardeşinle konuşmak, bir anlığına sivil hayata dönmek gibiydi.',
    },
  ],

  arkadas: [
    {
      id: 'ar-naber',
      acilis: '"Lan {ad}! Yaşıyor musun? Nasıl gidiyor orada, dayanabiliyor musun?"',
      secenekler: [
        {
          label: '"Dayanıyorum kanka. Alıştım sayılır."',
          cevap: '"Helal. Ben iki gün dayanamazdım." Abartıyor ama iyi geliyor.',
          moral: 12,
        },
        {
          label: '"Zor lan. Hiç anlatacak gibi değil."',
          cevap:
            '"Anlatma zaten, döndüğünde anlatırsın. Çay ısmarlarım, bütün gece dinlerim." Söz verdi.',
          moral: 14,
        },
      ],
      kapanis: '"Kendine iyi bak lan" dedi. Onda bu, sarılmak demek.',
    },
    {
      id: 'ar-disari',
      acilis:
        '"Dün herkes toplandı, sen yoktun. Masada bir sandalye boş bıraktık, şaka olsun diye."',
      secenekler: [
        {
          label: '"Salaklar." (gülerek)',
          cevap: '"Fotoğrafını da çektik. Döndüğünde göstereceğiz." Bunu gerçekten yapmışlar.',
          moral: 13,
        },
        {
          label: '"Özledim sizi ya."',
          cevap: 'Bir sessizlik oldu. "Biz de seni." Sonra hemen konuyu değiştirdi, o öyledir.',
          moral: 15,
        },
      ],
      kapanis: 'Kapattıktan sonra bir süre gülümsedin.',
    },
  ],
};

/** Aynı kişiyle üst üste aynı konuşma geçmesin diye görülenler dışlanıyor. */
export function konusmaSec(
  tur: YakinlikTuru,
  gorulmus: string[],
): TelefonKonusma | undefined {
  const havuz = TELEFON_KONUSMALARI[tur];
  const taze = havuz.filter((k) => !gorulmus.includes(k.id));
  const liste = taze.length ? taze : havuz;
  return liste[Math.floor(Math.random() * liste.length)];
}
