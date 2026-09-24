import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { olcumIzniAyarla } from '../engine/bulut';
import { sesAyarla } from '../ses';
import { titresimAyarla } from '../ui/haptik';

/**
 * Oyuncu ayarları. Oyun kaydından ayrı tutuluyor: "baştan başla" kaydı
 * siliyor, ayarları silmiyor; sesi kapatan oyuncu yeni oyunda yeniden
 * kapatmak zorunda kalmıyor.
 */
export type MetinHizi = 'yavas' | 'normal' | 'hizli' | 'aninda';

export type Ayarlar = {
  efekt: boolean;
  ambiyans: boolean;
  titresim: boolean;
  metinHizi: MetinHizi;
  /** Sistem ayarından bağımsız, oyun içinde hareketi azaltma. */
  hareketAzalt: boolean;
  /**
   * Kullanım verisi (oyun olayları) gönderilsin mi. null: henüz
   * sorulmadı; o durumda da hiçbir şey gönderilmiyor (KVKK onay ekranı M5).
   */
  olcumIzni: boolean | null;
};

export const VARSAYILAN_AYARLAR: Ayarlar = {
  efekt: true,
  ambiyans: true,
  titresim: true,
  metinHizi: 'normal',
  hareketAzalt: false,
  olcumIzni: null,
};

/** Daktilo için harf başına milisaniye. */
export const HARF_MS: Record<MetinHizi, number> = { yavas: 32, normal: 18, hizli: 8, aninda: 0 };

const ANAHTAR = 'bedelli.ayarlar.v1';

type AyarDeposu = Ayarlar & {
  /** Ayarlar katmanı açık mı (her ekranın üstünde). */
  acik: boolean;
  ac: () => void;
  kapat: () => void;
  degistir: (p: Partial<Ayarlar>) => void;
  yukle: () => Promise<void>;
};

/** Ayarın oyunun başka yerlerine etkisi: ses, titreşim, ölçüm. */
function uygula(a: Ayarlar) {
  sesAyarla({ efekt: a.efekt, ambiyans: a.ambiyans });
  titresimAyarla(a.titresim);
  olcumIzniAyarla(a.olcumIzni === true);
}

function ayarlariAl(s: AyarDeposu): Ayarlar {
  const { efekt, ambiyans, titresim, metinHizi, hareketAzalt, olcumIzni } = s;
  return { efekt, ambiyans, titresim, metinHizi, hareketAzalt, olcumIzni };
}

export const useAyarlar = create<AyarDeposu>((set, get) => ({
  ...VARSAYILAN_AYARLAR,
  acik: false,
  ac: () => set({ acik: true }),
  kapat: () => set({ acik: false }),

  degistir(p) {
    set(p);
    const a = ayarlariAl(get());
    uygula(a);
    void AsyncStorage.setItem(ANAHTAR, JSON.stringify(a)).catch(() => {});
  },

  async yukle() {
    let a = VARSAYILAN_AYARLAR;
    try {
      const ham = await AsyncStorage.getItem(ANAHTAR);
      if (ham) a = { ...VARSAYILAN_AYARLAR, ...(JSON.parse(ham) as Partial<Ayarlar>) };
    } catch {
      // bozuk ya da okunamadı: varsayılanlar
    }
    set(a);
    uygula(a);
  },
}));
