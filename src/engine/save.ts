import AsyncStorage from '@react-native-async-storage/async-storage';
import { bulutaYaz, bulutlaKarsilastir, buluttanOku } from './bulut';
import type { ArkadasId, DolapDuzeni, Envanter, Kusur, Profil, RehberKisi, Rol, Stats } from './types';

const KEY = 'bedelli.save.v3';
/** v1 kayıtları profil/envanter taşımıyordu; taşınamaz, temiz başlanır. */
const ESKI_KEYS = ['bedelli.save.v1'];
/** v2 taşınabilir: telefon alanları varsayılanla doldurulur, rehber role çevrilir. */
const V2_KEY = 'bedelli.save.v2';

export type SaveData = {
  version: 3;
  profil: Profil;
  /** Çarşı bitmeden oyun başlamaz. */
  hazirlikBitti: boolean;
  gun: number;
  blokIndex: number;
  sahneIndex: number;
  /** Gün içindeki saat (dakika). Eski kayıtlarda yok; sahneden türetilir. */
  saat?: number;
  stats: Stats;
  para: number;
  envanter: Envanter;
  /** İlk gün dolaba ne nereye kondu; denetim buna bakıyor. Eski kayıtlarda yok. */
  dolapDuzeni?: DolapDuzeni | null;
  /** Kalkıştan içtimaya (ya da geceden yoklamaya) kalan, denetimi bekleyen işler. */
  bekleyenKusurlar?: Kusur[];
  dostluk: Record<ArkadasId, number>;
  gorulmusDiyaloglar: string[];
  rehber: RehberKisi[];
  nikotin: number;
  bitenGunler: { gun: number; not: string; puan: number }[];
  /** Telefon motoru v2 alanları; v2 kayıtlarında yoktur. */
  iliski?: Record<Rol, number>;
  gerilim?: Record<Rol, number>;
  ozlem?: number;
  hafiza?: Record<string, { deger: string; gun: number }>;
  sonArama?: Record<Rol, number>;
  gorulmusGorusmeler?: string[];
  sevgiliVar?: boolean;
  guncelleme: number;
};

export type KayitYuku = Omit<SaveData, 'version' | 'guncelleme'>;

export async function kaydet(data: KayitYuku) {
  const payload: SaveData = { ...data, version: 3, guncelleme: Date.now() };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Kayıt başarısızsa oyun oynanmaya devam eder; tek kayıp ilerleme olur.
  }
  // Bulut yedeği beklenmez: ağ yavaşsa oyun takılmasın. Yazmalar toplanıp
  // aralıklı gidiyor (bulut.ts).
  bulutaYaz(payload);
}

export async function yukle(): Promise<SaveData | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SaveData;
      if (parsed?.version === 3) {
        void bulutlaKarsilastir(parsed);
        return parsed;
      }
    }

    // v2 kaydı duruyorsa taşı: ilerleme, envanter ve rehber korunur.
    const eski = await AsyncStorage.getItem(V2_KEY);
    if (eski) {
      const parsed = JSON.parse(eski) as Omit<SaveData, 'version'> & { version: number };
      if (parsed?.version === 2) {
        const tasinan: SaveData = { ...parsed, version: 3, guncelleme: Date.now() };
        await AsyncStorage.setItem(KEY, JSON.stringify(tasinan));
        return tasinan;
      }
    }
  } catch {
    // düşer ve buluta bakarız
  }

  // Cihazda kayıt yok: telefon değişmiş olabilir, buluttaki yedeği getir.
  const bulut = await buluttanOku();
  if (bulut) {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(bulut));
    } catch {
      // yerelde tutamasak da oyuna devam edilebilir
    }
  }
  return bulut;
}

export async function sil() {
  try {
    await AsyncStorage.multiRemove([KEY, V2_KEY, ...ESKI_KEYS]);
  } catch {
    // yok sayılır
  }
}
