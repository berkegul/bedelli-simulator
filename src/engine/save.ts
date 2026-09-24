import AsyncStorage from '@react-native-async-storage/async-storage';
import { kayitDogrula } from './kayitDogrula';
import { bulutaYaz, bulutlaKarsilastir, buluttanOku, bulutuSil } from './bulut';
import type { AktifGorusme } from '../store/gameStore';
import type { ArkadasId, DolapDuzeni, Envanter, Kusur, Profil, RehberKisi, Rol, Stats } from './types';

const KEY = 'bedelli.save.v3';
/** v1 kayıtları profil/envanter taşımıyordu; taşınamaz, temiz başlanır. */
const ESKI_KEYS = ['bedelli.save.v1'];
/** v2 taşınabilir: telefon alanları varsayılanla doldurulur, rehber role çevrilir. */
const V2_KEY = 'bedelli.save.v2';
/**
 * Oyuncu "baştan başla" dedi ama buluttaki kayıt henüz silinemedi (ağ yok).
 * Bu işaret dururken buluttan geri yükleme yapılmaz; yoksa silinen oyun
 * bir sonraki açılışta geri geliyordu.
 */
const SILINDI_KEY = 'bedelli.save.silindi';
/** Okunamayan son kayıt; oyun onu atlayıp devam eder. */
const BOZUK_KEY = 'bedelli.save.bozuk';
/** İşaretin bellekteki kopyası: her kayıtta diske sormamak için. */
let silindiIsareti = false;

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
  /**
   * Gün içinde biriken küçük durumlar. Eskiden kaydedilmiyordu: uygulamayı
   * kapatıp açan oyuncunun cebindeki izmaritler kayboluyor, bugün dal
   * isteyen arkadaş yeniden istiyordu.
   */
  cepteIzmarit?: number;
  bugunIsteyenler?: ArkadasId[];
  bugunDinlenildi?: boolean;
  gelenArama?: { rol: Rol; kisiId: string } | null;
  bekleyenArama?: Rol[];
  /**
   * Uygulama bir görüşmenin ortasında kapandı. Açılışta görüşme "hat
   * kesildi" diye kapatılıyor ve o ana kadar birikenler uygulanıyor; yoksa
   * kontör ve günün arama hakkı gidiyor, konuşmanın etkisi kayboluyordu.
   */
  yarimGorusme?: AktifGorusme | null;
  guncelleme: number;
};

export type KayitYuku = Omit<SaveData, 'version' | 'guncelleme'>;

function jsonOku(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function kaydet(data: KayitYuku) {
  const payload: SaveData = { ...data, version: 3, guncelleme: Date.now() };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
    // Yeni oyunun kaydı var ve buluta giden yazma eski kaydın üstüne
    // yazacak: bekleyen silmeye artık gerek yok. İşaret kalsaydı, cihaz
    // verisi bir gün silinince yeni oyunun yedeğini de sildirirdi.
    if (silindiIsareti) {
      silindiIsareti = false;
      await AsyncStorage.removeItem(SILINDI_KEY);
    }
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
      const kayit = kayitDogrula(jsonOku(raw));
      if (kayit) {
        void bulutlaKarsilastir(kayit);
        return kayit;
      }
      // Bozuk kayıt silinmiyor, kenara alınıyor: destek için incelenebilsin.
      // Oyun buluttaki yedekten ya da temiz başlar.
      await AsyncStorage.setItem(BOZUK_KEY, raw);
      await AsyncStorage.removeItem(KEY);
    }

    // v2 kaydı duruyorsa taşı: ilerleme, envanter ve rehber korunur.
    const eski = await AsyncStorage.getItem(V2_KEY);
    if (eski) {
      const tasinan = kayitDogrula(jsonOku(eski));
      if (tasinan) {
        tasinan.guncelleme = Date.now();
        await AsyncStorage.setItem(KEY, JSON.stringify(tasinan));
        return tasinan;
      }
    }
  } catch {
    // düşer ve buluta bakarız
  }

  // Oyuncu kaydı sildi ve bulut henüz silinemedi: geri getirme, yeniden sil.
  if (await silinmeyiBekliyor()) {
    void bulutuSilVeIsaretiKaldir();
    return null;
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

/** Kaydı cihazdan ve buluttan siler. Bulut silinemezse işaret bırakır. */
export async function sil() {
  try {
    silindiIsareti = true;
    await AsyncStorage.setItem(SILINDI_KEY, '1');
    await AsyncStorage.multiRemove([KEY, V2_KEY, ...ESKI_KEYS]);
  } catch {
    // yok sayılır
  }
  void bulutuSilVeIsaretiKaldir();
}

async function silinmeyiBekliyor() {
  try {
    silindiIsareti = (await AsyncStorage.getItem(SILINDI_KEY)) !== null;
    return silindiIsareti;
  } catch {
    return false;
  }
}

async function bulutuSilVeIsaretiKaldir() {
  if (!(await bulutuSil())) return;
  // Silme sürerken yeni oyun kaydedildiyse işaret zaten kalktı.
  if (!silindiIsareti) return;
  silindiIsareti = false;
  try {
    await AsyncStorage.removeItem(SILINDI_KEY);
  } catch {
    // işaret kalırsa bir sonraki açılışta silme yeniden denenir
  }
}
