import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseApp } from 'firebase/app';
import type { Persistence, ReactNativeAsyncStorage } from 'firebase/auth';

/**
 * @firebase/auth'un export haritasında "types" anahtarı "react-native"
 * koşulundan önce geldiği için TypeScript web tiplerini görüyor ve bu
 * fonksiyonu tanımıyor. Metro "types" koşulunu tanımıyor, telefonda RN
 * girişini yüklüyor; fonksiyon orada var. Eksik bildirimi buradan ekliyoruz.
 */
declare module '@firebase/auth' {
  export function getReactNativePersistence(depo: ReactNativeAsyncStorage): Persistence;
}

/**
 * Telefonda Firebase Auth kendiliğinden kalıcı değil: `getAuth` ile açılınca
 * oturum yalnızca bellekte tutuluyor ve her açılışta yeni bir anonim kimlik
 * doğuyordu. Bulut yedeği hiç bulunmuyor, ölçüm her oturumu ayrı oyuncu
 * sayıyordu. Oturumu AsyncStorage'a yazan kalıcılıkla başlatıyoruz.
 *
 * Web karşılığı `kimlik.ts` (yalnızca geliştirme önizlemesi): tarayıcıda
 * kalıcılık zaten varsayılan.
 */
export async function kimlikBaslat(app: FirebaseApp) {
  const { getAuth, getReactNativePersistence, initializeAuth } = await import('firebase/auth');
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // Aynı uygulamada ikinci kez başlatılamıyor (hızlı yenilemede olur);
    // ilk başlatılan örnek zaten kalıcı.
    return getAuth(app);
  }
}
