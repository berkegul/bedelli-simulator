import AsyncStorage from '@react-native-async-storage/async-storage';
import { bulutaYaz, buluttanOku } from './bulut';
import type { ArkadasId, Envanter, Profil, RehberKisi, Stats } from './types';

const KEY = 'bedelli.save.v2';
/** v1 kayıtları profil/envanter taşımıyordu; taşınamaz, temiz başlanır. */
const ESKI_KEYS = ['bedelli.save.v1'];

export type SaveData = {
  version: 2;
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
  dostluk: Record<ArkadasId, number>;
  gorulmusDiyaloglar: string[];
  rehber: RehberKisi[];
  nikotin: number;
  bitenGunler: { gun: number; not: string; puan: number }[];
  guncelleme: number;
};

export type KayitYuku = Omit<SaveData, 'version' | 'guncelleme'>;

export async function kaydet(data: KayitYuku) {
  const payload: SaveData = { ...data, version: 2, guncelleme: Date.now() };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Kayıt başarısızsa oyun oynanmaya devam eder; tek kayıp ilerleme olur.
  }
  // Bulut yedeği beklenmez: ağ yavaşsa oyun takılmasın.
  void bulutaYaz(payload);
}

export async function yukle(): Promise<SaveData | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SaveData;
      if (parsed?.version === 2) return parsed;
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
    await AsyncStorage.multiRemove([KEY, ...ESKI_KEYS]);
  } catch {
    // yok sayılır
  }
}
