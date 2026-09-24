import type { FirebaseApp } from 'firebase/app';

/**
 * Tarayıcıda Firebase Auth oturumu kendiliğinden kalıcı (IndexedDB).
 * Telefon karşılığı `kimlik.native.ts`.
 */
export async function kimlikBaslat(app: FirebaseApp) {
  const { getAuth } = await import('firebase/auth');
  return getAuth(app);
}
