/**
 * Cepteki şeyler her an kullanılmaz. Sigara ve telefon serbest zamanın
 * işidir; içtimada sigara yakmak, derste telefon çıkarmak koğuşa mal olur.
 * Cep paneli her yerden açılır — açılan panelin ne diyeceği burada belli.
 */

export type Izin = { olur: boolean; sebep?: string };

export const OLUR: Izin = { olur: true };

/** 'd2-ictima' -> 'ictima'. Gün numarası kuralı değiştirmiyor. */
export function blokAnahtari(blokId: string): string {
  return blokId.replace(/^d\d+-/, '');
}

/** Sigara da telefon da yalnızca burada serbest. */
const SERBEST = new Set(['serbest']);

/** Duvarların arası: koğuş, yemekhane, sınıf. */
const KAPALI: Record<string, string> = {
  kalkis: 'Koğuşta sigara içilmez.',
  kogus: 'Koğuşta sigara içilmez.',
  denetim: 'Denetim var, koğuşta sigara içilmez.',
  ders: 'Derste sigara içilmez.',
  kahvalti: 'Yemekhanede sigara içilmez.',
  ogle: 'Yemekhanede sigara içilmez.',
  'aksam-yemek': 'Yemekhanede sigara içilmez.',
  'son-yoklama': 'Yoklama sırasında koğuşta sigara içilmez.',
};

/** Açık hava ama görev başı: sıradasın, elin cebine gitmez. */
const GOREV: Record<string, string> = {
  ictima: 'İçtimadasın. Sırada sigara yakılmaz.',
  'aksam-ictima': 'İçtimadasın. Sırada sigara yakılmaz.',
  talim: 'Talimdesin. Elinde tüfek varken olmaz.',
  'egitim-sabah': 'Eğitim sürüyor. Mola verilmedi.',
  mintika: 'Mıntıka temizliğindesin, izmarit toplayan sensin.',
  nizamiye: 'Daha nizamiyedesin. Burada sigara yakılmaz.',
  tanitim: 'Bölük seni geziyor, sıradan çıkamazsın.',
};

const TELEFON_GOREV: Record<string, string> = {
  ictima: 'İçtimada telefon çıkarmak bütün koğuşa ceza yazdırır.',
  'aksam-ictima': 'İçtimada telefon çıkarmak bütün koğuşa ceza yazdırır.',
  talim: 'Talimde telefon açılmaz.',
  'egitim-sabah': 'Eğitim sürüyor. Telefon dolapta kalmalıydı.',
  mintika: 'Mıntıka temizliğindesin, önce iş biter.',
  nizamiye: 'Daha teslim olmadın. Telefon şimdilik cebinde kalsın.',
  tanitim: 'Bölük seni geziyor, sıradan çıkamazsın.',
  kalkis: 'Kalkışta on dakikan var, telefona değil yatağa yetecek.',
  kogus: 'Koğuşta onbaşı dolaşıyor. Telefonu şimdi çıkarma.',
  denetim: 'Denetim var. Telefonun görünmesi en kötü ihtimal.',
  ders: 'Derste telefon çıkaran bir daha oturamaz.',
  kahvalti: 'Sofradasın. Telefon serbest zamanda.',
  ogle: 'Sofradasın. Telefon serbest zamanda.',
  'aksam-yemek': 'Sofradasın. Telefon serbest zamanda.',
  'son-yoklama': 'Yoklama sürüyor. Sıradan çıkamazsın.',
};

const MINI_SEBEP = 'Görevin ortasındasın, bitmeden olmaz.';

export function sigaraIzni(blokId: string | undefined, miniAktif = false): Izin {
  if (miniAktif) return { olur: false, sebep: MINI_SEBEP };
  if (!blokId) return { olur: false, sebep: 'Şu an olmaz.' };

  const k = blokAnahtari(blokId);
  if (SERBEST.has(k)) return OLUR;
  return {
    olur: false,
    sebep: KAPALI[k] ?? GOREV[k] ?? 'Şimdi olmaz. Serbest zamanı bekle.',
  };
}

export function telefonIzni(blokId: string | undefined, miniAktif = false): Izin {
  if (miniAktif) return { olur: false, sebep: MINI_SEBEP };
  if (!blokId) return { olur: false, sebep: 'Şu an olmaz.' };

  const k = blokAnahtari(blokId);
  if (SERBEST.has(k)) return OLUR;
  return { olur: false, sebep: TELEFON_GOREV[k] ?? 'Şimdi olmaz. Serbest zamanı bekle.' };
}
