/**
 * Firebase yapılandırması ortam değişkenlerinden geliyor (M4). Tanımlı
 * değilse oyun tamamen cihazda çalışır — bulut kaydı ve olay günlüğü
 * sessizce devre dışı kalır.
 *
 * Değerler: console.firebase.google.com → proje → Web uygulaması ekle.
 *  - Yerelde: `.env.example`'ı `.env.local` olarak kopyalayıp doldur
 *    (repoya girmez).
 *  - EAS derlemesinde: `eas env:create` ile aynı adlar, ortam başına.
 * Expo, `EXPO_PUBLIC_` önekli değişkenleri derleme anında koda gömer; bu
 * anahtarlar gizli değildir, erişimi `firestore.rules` sınırlar.
 *
 * Konsolda ayrıca: Firestore "production mode", Authentication → Anonymous
 * açık, kurallar `firebase deploy --only firestore:rules` ile.
 */
export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const firebaseKurulu = () => Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
