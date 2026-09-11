import { FIREBASE_CONFIG, firebaseKurulu } from '../firebaseConfig';
import type { SaveData } from './save';

/**
 * Bulut katmanı isteğe bağlı: yapılandırma yoksa bütün çağrılar sessizce
 * hiçbir şey yapmaz. Oyun her hâlükârda cihazdaki kayıtla çalışır, bulut
 * yalnızca yedek ve ölçüm için var.
 *
 * Firebase modülleri ancak yapılandırma varsa yükleniyor — kurulmadığı
 * sürece paket uygulamanın açılışını yavaşlatmıyor.
 */
let hazirlik: Promise<{ db: unknown; uid: string } | null> | null = null;

async function baglan() {
  if (!firebaseKurulu()) return null;
  try {
    const [{ initializeApp, getApps }, { getAuth, signInAnonymously }, firestore] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);

    const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    const auth = getAuth(app);
    // Anonim oturum: oyuncudan hesap istemeden cihaz başına kimlik verir.
    const kimlik = auth.currentUser ?? (await signInAnonymously(auth)).user;
    return { db: firestore.getFirestore(app), uid: kimlik.uid };
  } catch {
    // Ağ yok, kural reddetti ya da yapılandırma hatalı — oyun etkilenmesin.
    return null;
  }
}

function oturum() {
  if (!hazirlik) hazirlik = baglan();
  return hazirlik;
}

/** Kaydı buluta yazar. Başarısız olursa yutar; cihazdaki kayıt zaten var. */
export async function bulutaYaz(data: SaveData) {
  const o = await oturum();
  if (!o) return;
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(doc(o.db as never, 'oyuncular', o.uid), data as never, { merge: true });
  } catch {
    // sessiz
  }
}

/** Cihazda kayıt yoksa buluttan geri yükler — telefon değiştiren oyuncu için. */
export async function buluttanOku(): Promise<SaveData | null> {
  const o = await oturum();
  if (!o) return null;
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const anlik = await getDoc(doc(o.db as never, 'oyuncular', o.uid));
    const veri = anlik.exists()
      ? (anlik.data() as Omit<SaveData, 'version'> & { version?: number })
      : null;
    if (!veri) return null;
    // v2 buluttan da taşınabilir: eksik telefon alanları store'da dolduruluyor.
    if (veri.version === 3) return veri as SaveData;
    if (veri.version === 2) return { ...veri, version: 3 } as SaveData;
    return null;
  } catch {
    return null;
  }
}

/**
 * Ölçüm olayı. Asıl merak edilen soru şu: oyuncular hangi günde bırakıyor?
 * Kilit ekranına kaç kişi geliyor? Satış kararları buna bakılarak verilecek.
 */
export async function olayYaz(ad: string, veri: Record<string, unknown> = {}) {
  const o = await oturum();
  if (!o) return;
  try {
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
    await addDoc(collection(o.db as never, 'olaylar'), {
      ad,
      uid: o.uid,
      ...veri,
      zaman: serverTimestamp(),
    });
  } catch {
    // sessiz
  }
}
