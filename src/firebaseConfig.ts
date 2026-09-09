/**
 * Firebase yapılandırması. Boş bırakıldığı sürece oyun tamamen cihazda
 * çalışır — bulut kaydı ve olay günlüğü sessizce devre dışı kalır.
 *
 * Doldurmak için: console.firebase.google.com → proje oluştur →
 * Web uygulaması ekle → çıkan config değerlerini buraya yapıştır.
 * Ardından Firestore'u "production mode" ile aç ve Authentication →
 * Sign-in method → Anonymous seçeneğini etkinleştir.
 *
 * Firestore güvenlik kuralı olarak şunu kullan; oyuncu yalnızca kendi
 * kaydını okuyup yazabilsin:
 *
 *   match /oyuncular/{uid} {
 *     allow read, write: if request.auth != null && request.auth.uid == uid;
 *   }
 *   match /olaylar/{belge} {
 *     allow create: if request.auth != null;
 *   }
 */
export const FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export const firebaseKurulu = () =>
  Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
