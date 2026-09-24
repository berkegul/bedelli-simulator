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
  anne_soz: {
    her_aksam: 'Annene "her akşam ararım" diye söz vermiştin.',
    belirsiz: 'Annene "her akşam olmayabilir" demiştin.',
  },
  sevgili_ilk: {
    ozledim: 'İlk gece sevgiline "seni özledim" demiştin.',
    muhtactim: 'İlk gece sevgiline "sesini duymam lazımdı" demiştin.',
    gecistirdi: 'İlk gece sevgiline "normal işte" demiştin.',
  },
  sayma_karari: {
    sayma: 'Sevgiline "sayma, sayarsak uzuyor" demiştin.',
  },
  koli_istegi: {
    kurabiye: 'Annenden koliye kurabiye istemiştin.',
    corap: 'Annenden koliye yalnızca kalın çorap istemiştin.',
    reddetti: 'Annene "gerek yok, her şey var burada" demiştin.',
  },
  hafta_sozu: {
    evet: 'Sevgiline bir haftayı uzun konuşarak geçirmeyi söz vermiştin.',
    tuttu: 'Bir haftanın akşamı bütün kontörü sevgiline ayırmıştın.',
    unuttu: 'Bir haftanın akşamı sevgiline "ne sözü?" demiştin.',
  },
  randevu_sozu: {
    kabul: 'Sevgiline "ben de o saati bekliyorum" demiştin.',
    sartli: 'Sevgiline "bazen arayamıyorum, kızma" demiştin.',
    reddetti: 'Sevgilinin her akşam o saatte beklemesi sana baskı gibi gelmişti.',
    tutuyor: 'O saat tutsun diye telefon sırasına erken girmeye başlamıştın.',
  },
  anne_nobet: {
    uyanik: 'İlk nöbet gecesi annene "uyu sen" demiştin.',
    anlasma: 'İlk nöbet gecesi annenle birlikte uyanık kalmıştınız.',
  },
  donunce_anlatacak: {
    evet: 'Kankana "bot hikâyesini ben gelince kendim anlatırım" demiştin.',
  },
  centik_atiyor: {
    evet: 'Duvara çentik attığını anlatmıştın.',
  },
  durustluk: {
    itiraf: 'Sevgiline yalnızca iyi kısımları anlattığını itiraf etmiştin.',
    inkar: 'Sevgiline "gizlediğim bir şey yok" demiştin.',
    koruma: 'Sevgiline "seni üzmek istemiyorum" demiştin.',
    karsilikli: 'Sevgiline "ben de bazı şeyleri özlemedim" demiştin.',
  },
  kacma_dusundu: {
    evet: 'Babana ilk hafta kaçmayı düşündüğünü söylemiştin.',
  },
  yari_tepkisi: {
    planli: 'Kankana çıkınca ne yapacağını düşündüğünü söylemiştin.',
    kacinan: 'Kankana "düşünmemeye çalışıyorum" demiştin.',
    endise: 'Kankana "çıkınca her şey aynı olacak mı" diye sormuştun.',
  },
  geliyorum: {
    soyledi: 'Annene "yetişmez anne, ben geliyorum zaten" demiştin.',
  },
  sevgili_mektup: {
    yazacak: 'Sevgiline "bir şey yaz, kâğıda yaz" demiştin.',
  },
  ilk_yemek: {
    listeledi: 'Annene ilk gün yiyeceğin üç şeyi saymıştın.',
    uyku_sonra: 'Annene "önce uyuyacağım, sonra yerim" demiştin.',
  },
  cikis_bulusma: {
    evet: 'Sevgiline çıktığın gün onu görmek istediğini söylemiştin.',
    ertesi: 'Sevgiline "ertesi gün görüşelim" demiştin.',
    belirsiz: 'Sevgiline "sen ne istersen" demiştin.',
  },
  kanka_plan: {
    dinledi: 'Kankanın çıkış planını sonuna kadar dinlemiştin.',
    uyku_israri: 'Kankana "ilk gün uyuyacağım demiştim ya" demiştin.',
    kesin: 'Kankanın planı kesinleşmişti: saat sekiz.',
    sade: 'Kankana "kalabalık istemiyorum, sadece sen" demiştin.',
  },
  kanka_guvence: {
    verdi: 'Kankana "sen gibisi yok" demiştin.',
  },
  aramaya_devam: {
    soz: 'Annene "yine ararım, başka yerden ararım" demiştin.',
  },
  son_soz: {
    ozlem: 'Sevgiline özlemini kelimeyle anlatamadığını söylemiştin.',
    tesekkur: 'Sevgiline yirmi beş gün boyunca orada olduğu için teşekkür etmiştin.',
    ozur: 'Sevgiline kötü günler için özür dilemiştin.',
    yuz_yuze: 'Sevgiline "yüz yüze söylerim" demiştin.',
    anneye_tesekkur: 'Annene her akşam orada olduğu için teşekkür etmiştin.',
  },
};

/** Epilogda okunan işaretler; doğrulayıcı bunları "okunuyor" sayar. */
export const EPILOG_ISARETLERI = Object.keys(EPILOG_METIN);

/** Epilog satırları arasında en az bu kadar gün olmalı. */
const EPILOG_ARALIK = 6;

export type EpilogSatiri = { gun: number; metin: string; gunFarki: string };

/**
 * Üç satır, konduğu günüyle birlikte. İlki en eski işaret (en uzun mesafeli
 * geri dönüş); sonrakiler bir öncekinden en az EPILOG_ARALIK gün sonra
 * konmuş olanlardan seçiliyor. Yoksa birinci günün sözleri üç satırı da
 * dolduruyor, oyunun ortası hiç geri gelmiyordu. Aralıklı üç satır
 * çıkmazsa kalanlar sırayla tamamlanır.
 */
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

  const sirali = satirlar.sort((a, b) => a.gun - b.gun);
  const secilen: EpilogSatiri[] = [];
  for (const s of sirali) {
    if (secilen.length === 3) break;
    const son = secilen[secilen.length - 1];
    if (!son || s.gun - son.gun >= EPILOG_ARALIK) secilen.push(s);
  }
  for (const s of sirali) {
    if (secilen.length === 3) break;
    if (!secilen.includes(s)) secilen.push(s);
  }
  return secilen.sort((a, b) => a.gun - b.gun);
}
