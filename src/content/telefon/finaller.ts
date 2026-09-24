import { TOPLAM_GUN } from '../../engine/stats';
import { sayiYaziyla , kosulTutar } from './motor';
import type { Hafiza, Kosul, TelefonDurumu } from './tipler';

/**
 * 28. günün finali tek bir sahne değil: koşulu tutan kartlar sırayla
 * oynanıyor. Bir oyuncu aynı anda hem "sevgiliyle kavuşma" hem "tükenme"
 * kartını alabilir — ilişkiler birbirinden bağımsız geliştiği için final de
 * bölünmüyor, toplanıyor.
 */
export type FinalKarti = {
  id: string;
  /** Sıralama; küçük olan önce oynanır. */
  sira: number;
  baslik: string;
  metin: string;
  kosul?: Kosul;
};

const KARTLAR: FinalKarti[] = [
  {
    id: 'kapi',
    sira: 0,
    baslik: 'NİZAMİYE',
    metin:
      'Kağıdı verdin, nöbetçi baktı, başıyla onayladı. Demir kapı açıldı. Yirmi sekiz gün önce bu kapıdan içeri girerken arkana bakmamıştın. Şimdi baktın.',
  },
  {
    id: 'aile_sicak',
    sira: 10,
    baslik: 'ARABA',
    kosul: { iliskiMin: { anne: 72, baba: 68 } },
    metin:
      'Annen kapıda bekliyordu, sen daha çıkmadan koştu. Baban arabadan inmedi — camı indirdi, seni gördü, indi. Hiçbir şey söylemedi, sadece çantanı aldı. Bütün yol boyunca annen konuştu, baban konuşmadı, ama aynada sana üç kere baktı.',
  },
  {
    id: 'aile_orta',
    sira: 10,
    baslik: 'ARABA',
    kosul: { iliskiMin: { anne: 45 }, iliskiMax: { baba: 69 } },
    metin:
      'Annen kapıdaydı. Sarıldı, koklardı, "zayıflamışsın" dedi. Baban arabada bekledi, sen binince "geldin mi" dedi. Yol uzundu ve çoğunlukla sessiz geçti, ama kötü bir sessizlik değildi.',
  },
  {
    id: 'aile_sessiz',
    sira: 10,
    baslik: 'OTOGAR',
    kosul: { iliskiMax: { anne: 44 } },
    metin:
      'Kimse yoktu. Otobüs durağına yürüdün, bilet aldın, cam kenarına oturdun. Otogarda annen bekliyordu. Sarıldı ve hiçbir şey sormadı. Soramadı — yirmi sekiz günde sorulacak şeyler birikir, sonra sorulmaz olur.',
  },
  {
    id: 'sevgili_kavusma',
    sira: 20,
    baslik: 'KAPIDA',
    kosul: { sevgiliVar: true, iliskiMin: { sevgili: 70 }, gerilimMax: { sevgili: 29 } },
    metin:
      'Kapıdan çıktığında onu gördün. Sabahtan beri oradaymış. Hiçbir şey söylemedi, sen de söylemedin. Yirmi sekiz gün boyunca kelimelerle idare ettiniz; bugün kelimeye ihtiyaç yoktu.',
  },
  {
    id: 'sevgili_mesafe',
    sira: 20,
    baslik: 'AKŞAM',
    kosul: {
      sevgiliVar: true,
      iliskiMin: { sevgili: 45 },
      iliskiMax: { sevgili: 69 },
    },
    metin:
      'Akşam buluştunuz. Oturdunuz, konuştunuz, güldünüz bile. Ama bir yerde bir şey duruyordu — ikiniz de fark ettiniz, ikiniz de o akşam söylemediniz. "Konuşmamız lazım" dedi kapıda ayrılırken. Konuşacaksınız.',
  },
  {
    id: 'sevgili_gergin',
    sira: 20,
    baslik: 'TELEFON',
    kosul: { sevgiliVar: true, gerilimMin: { sevgili: 60 } },
    metin:
      'Aradın, açtı. Sesi yorgundu. "Bugün olmasın" dedi. "Yarın, olur mu?" Olur dedin. Yirmi sekiz gün beklediniz, bir gün daha beklenir. Ama bu bekleme diğerine benzemiyordu.',
  },
  {
    id: 'sevgili_bitis',
    sira: 20,
    baslik: 'MESAJ',
    kosul: { sevgiliVar: true, iliskiMax: { sevgili: 24 } },
    metin:
      'Gelmedi. Bir mesaj vardı: "Hoş geldin." İki kelime. Yirmi sekiz gün önce bu iki kelime bir cümlenin başlangıcı olurdu. Şimdi tamamıydı.',
  },
  {
    id: 'kanka_kapida',
    sira: 30,
    baslik: 'KORNA',
    kosul: { iliskiMin: { kanka: 70 } },
    metin:
      'Yüz metre ötede bir korna çaldı, sonra bir daha, sonra susmadı. Arabanın üstüne çıkmış, bağırıyordu. Yanında birkaç kişi daha vardı. Birkaçtan fazla. Yirmi sekiz gündür bunu planlıyordu ve planı tutmuştu.',
  },
  {
    id: 'kanka_aksam',
    sira: 30,
    baslik: 'AKŞAM',
    kosul: { iliskiMin: { kanka: 40 }, iliskiMax: { kanka: 69 } },
    metin:
      'Akşam aradı. "Geldin mi lan?" Geldin. "Yarın çıkalım o zaman." Yarın çıkacaksınız. Yirmi sekiz gün bazı şeyleri yerinde bırakıyor, bazılarını biraz kaydırıyor.',
  },
  {
    id: 'kanka_sessiz',
    sira: 30,
    baslik: 'SESSİZLİK',
    kosul: { iliskiMax: { kanka: 39 } },
    metin:
      'Telefonda ondan bir şey yoktu. Sen de aramadın. Yirmi sekiz gün, birinin seni unutması için yeterli değil — ama uzaklaşması için yetiyor.',
  },
  {
    id: 'alisma',
    sira: 40,
    baslik: 'ARKANA BAK',
    kosul: { disiplinMin: 70, ozlemMax: 60 },
    metin:
      'Otobüs kalkarken kışla camdan göründü. Bayrak direği, avlu, ankesörün olduğu köşe. Kırk dakika kuyrukta beklediğin o köşe. Garip ama bir şey battı içine. Yirmi sekiz gün, bir yeri sevmek için kısa bir süre. Özlemek için yeterli.',
  },
  {
    id: 'tukenme',
    sira: 50,
    baslik: 'YORGUNLUK',
    kosul: { moralMax: 35 },
    metin:
      'Bitti. Bunu düşünmek için beklediğin sevinç gelmedi, onun yerine bir boşluk geldi. Arabada uyudun. Eve varınca da uyudun. Yirmi sekiz gün insanı bitirmez ama yorar, ve yorgunluk sevinçten daha uzun sürer.',
  },
];

export function finalKartlari(d: TelefonDurumu): FinalKarti[] {
  return KARTLAR.filter((k) => kosulTutar(k.kosul, d)).sort((a, b) => a.sira - b.sira);
}

/**
 * Epilog: elle yazılmış bir kapanış değil, oyuncunun kendi cümlelerinin
 * geri okunması. Övmüyor, yargılamıyor — sadece hatırlıyor. Kötü seçimler
 * de buraya giriyor, özellikle giriyor.
 */
const EPILOG_METIN: Record<string, Record<string, string>> = {
  ilk_gece: {
    iyi: '"İyiyim, her şey yolunda" demiştin.',
    garip: '"Hiçbir şeye benzemiyor" demiştin.',
    dayanamam: '"Ben burada duramam" demiştin.',
  },
  cikis_plani: {
    uyku: 'Kankana "uyuyacağım" demiştin.',
    kanka: 'Kankana "doğru size gelirim" demiştin.',
    yemek: 'Kankana "doğru düzgün bir şey yiyeceğim" demiştin.',
    yok: 'Kankana "onu düşünmüyorum bile" demiştin.',
    degisti: 'Kankana planının değiştiğini söylemiştin.',
  },
  ilk_gorecek: {
    sevgili: 'Sevgiline "çıkınca ilk seni göreceğim" demiştin.',
    aile: 'Sevgiline "önce eve uğrarım" demiştin.',
    uyku: 'Sevgiline "önce iki gün uyuyacağım" demiştin.',
    bilmiyorum: 'Sevgiline "o kadar uzak ki düşünemiyorum" demiştin.',
  },
  yemek_beyani: {
    iyi: 'Annene "yemekler fena değil" demiştin.',
    yemedim: 'Annene "yemedim, iştahım yoktu" demiştin.',
    kotu: 'Annene "iki saat bekledik, soğumuştu" demiştin.',
    alisti: 'Annene yemeğe alıştığını söylemiştin.',
  },
  en_cok_ozlenen: {
    yemek: 'En çok annenin yemeğini özlediğini söylemiştin.',
    sessizlik: 'En çok sessizliği özlediğini söylemiştin.',
    yalnizlik: 'En çok kapıyı kapatabilmeyi özlediğini söylemiştin.',
    aile: 'En çok onları özlediğini söylemiştin.',
  },
};

export type EpilogSatiri = { gun: number; metin: string; gunFarki: string };

/** En eski üç işaret, konduğu günüyle birlikte. */
export function epilog(hafiza: Hafiza, gun = TOPLAM_GUN): EpilogSatiri[] {
  const satirlar: EpilogSatiri[] = [];

  for (const [ad, sozluk] of Object.entries(EPILOG_METIN)) {
    const kayit = hafiza[ad];
    if (!kayit) continue;
    const metin = sozluk[kayit.deger];
    if (!metin) continue;
    satirlar.push({
      gun: kayit.gun,
      metin,
      gunFarki: sayiYaziyla(Math.max(0, gun - kayit.gun)),
    });
  }

  return satirlar.sort((a, b) => a.gun - b.gun).slice(0, 3);
}
