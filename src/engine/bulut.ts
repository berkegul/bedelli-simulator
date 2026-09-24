import { FIREBASE_CONFIG, firebaseKurulu } from '../firebaseConfig';
import { kimlikBaslat } from './kimlik';
import type { SaveData } from './save';

/**
 * Bulut katmanı isteğe bağlı: yapılandırma yoksa bütün çağrılar sessizce
 * hiçbir şey yapmaz. Oyun her hâlükârda cihazdaki kayıtla çalışır, bulut
 * yalnızca yedek ve ölçüm için var.
 *
 * Firebase modülleri ancak yapılandırma varsa yükleniyor — kurulmadığı
 * sürece paket uygulamanın açılışını yavaşlatmıyor.
 */
type Oturum = { db: unknown; uid: string };

/**
 * Açılışta buluttan okuma bu kadar beklenir. Splash ekranı bunu bekliyor:
 * internetsiz ilk açılışta oyuncu saniyelerce boş ekrana bakmasın.
 */
export const ACILIS_BEKLEME_MS = 4000;

/** Bağlantı başarısız olunca bu süre boyunca yeniden denenmez. */
const YENIDEN_DENEME_MS = 60_000;

let hazirlik: Promise<Oturum | null> | null = null;
let sonHata = 0;

async function baglan(): Promise<Oturum | null> {
  try {
    const [{ initializeApp, getApps }, firestore] = await Promise.all([
      import('firebase/app'),
      import('firebase/firestore'),
    ]);

    const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    const auth = await kimlikBaslat(app);
    // Kalıcı oturum diskten asenkron geri yükleniyor; o bitmeden
    // currentUser null görünür. Beklemeden anonim giriş yapmak her
    // açılışta yeni bir kimlik açardı.
    await auth.authStateReady();
    const { signInAnonymously } = await import('firebase/auth');
    // Anonim oturum: oyuncudan hesap istemeden cihaz başına kimlik verir.
    const kimlik = auth.currentUser ?? (await signInAnonymously(auth)).user;
    return { db: firestore.getFirestore(app), uid: kimlik.uid };
  } catch {
    // Ağ yok, kural reddetti ya da yapılandırma hatalı — oyun etkilenmesin.
    return null;
  }
}

/**
 * Tek bağlantı paylaşılıyor. Başarısız olursa önbelleğe alınmıyor: ağsız
 * açılan oyun, ağ gelince bir dakika içinde yedeklemeye başlıyor.
 */
function oturum(): Promise<Oturum | null> {
  if (!firebaseKurulu()) return Promise.resolve(null);
  if (!hazirlik) {
    if (Date.now() - sonHata < YENIDEN_DENEME_MS) return Promise.resolve(null);
    hazirlik = baglan().then((o) => {
      if (!o) {
        hazirlik = null;
        sonHata = Date.now();
      }
      return o;
    });
  }
  return hazirlik;
}

/** Söz verilen süre içinde bitmezse yedek değeri döner; iş arkada sürer. */
export function sureli<T>(is: Promise<T>, ms: number, yedek: T): Promise<T> {
  let zamanlayici: ReturnType<typeof setTimeout> | undefined;
  const sure = new Promise<T>((coz) => {
    zamanlayici = setTimeout(() => coz(yedek), ms);
  });
  return Promise.race([is, sure]).finally(() => clearTimeout(zamanlayici));
}

/**
 * Firestore `undefined` değer taşıyan belgeyi bütünüyle reddediyor; hata da
 * aşağıda sessizce yutulduğu için yedek fark edilmeden dururdu. Kayıttaki
 * opsiyonel alanlardan (saat, rol, sonArananGun…) biri tanımsız kalırsa diye
 * JSON'dan geçiriyoruz: tanımsız alanlar düşüyor, cihazdaki kayıtla aynı
 * şekil buluta gidiyor.
 */
export function firestoreIcin(data: SaveData): SaveData {
  return JSON.parse(JSON.stringify(data)) as SaveData;
}

/**
 * `persist` her sahnede çağrılıyor; her çağrıyı buluta göndermek hem yazım
 * maliyeti hem boşuna trafik. Yazmalar toplanıp en fazla bu aralıkla, en son
 * hâliyle gidiyor. Uygulama arka plana düşerken `bulutuBosalt` bekleyeni
 * hemen gönderiyor.
 */
const YAZMA_ARALIGI_MS = 1500;
let bekleyen: SaveData | null = null;
let yazmaZamanlayici: ReturnType<typeof setTimeout> | null = null;

/** Kaydı buluta yazar. Başarısız olursa yutar; cihazdaki kayıt zaten var. */
export function bulutaYaz(data: SaveData) {
  if (!firebaseKurulu()) return;
  bekleyen = data;
  if (!yazmaZamanlayici) yazmaZamanlayici = setTimeout(() => void bulutuBosalt(), YAZMA_ARALIGI_MS);
}

/** Bekleyen yazmayı hemen gönderir. */
export async function bulutuBosalt() {
  if (yazmaZamanlayici) clearTimeout(yazmaZamanlayici);
  yazmaZamanlayici = null;
  const veri = bekleyen;
  bekleyen = null;
  if (!veri) return;

  const o = await oturum();
  if (!o) return;
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    // Birleştirme yok: kaydın tamamı değişiyor. `merge: true` yerelde
    // silinen alanları (son sigara, önceki oyunun envanteri) bulutta
    // bırakıyor, geri yüklenen kayıt iki oyunun karışımı oluyordu.
    await setDoc(doc(o.db as never, 'oyuncular', o.uid), firestoreIcin(veri) as never);
  } catch {
    // sessiz
  }
}

/** Gönderilmemiş yazmayı atar: yeni oyunda eski kayıt buluta gitmesin. */
export function bekleyenYazmayiIptalEt() {
  if (yazmaZamanlayici) clearTimeout(yazmaZamanlayici);
  yazmaZamanlayici = null;
  bekleyen = null;
}

/**
 * Cihazda kayıt yoksa buluttan geri yükler — telefon değiştiren oyuncu için.
 * Açılışı tuttuğu için süreli: ağ yavaşsa oyun cihazdan temiz başlar.
 */
export function buluttanOku(): Promise<SaveData | null> {
  return sureli(bulutKaydiniGetir(), ACILIS_BEKLEME_MS, null);
}

async function bulutKaydiniGetir(): Promise<SaveData | null> {
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
 * Cihazdaki kayıt her zaman kazanıyor; birleştirme yapılmıyor. Ama bulutta
 * daha yeni bir kayıt varsa (oyuncu başka cihazda oynamış) bunu ölçüyoruz:
 * sık görülürse bir seçim ekranı gerekecek. Açılışı beklemeden arkada koşar.
 */
export async function bulutlaKarsilastir(yerel: SaveData) {
  const bulut = await bulutKaydiniGetir();
  if (bulut && bulut.guncelleme > yerel.guncelleme + 60_000) {
    void olayYaz('kayit_cakismasi', { yerelGun: yerel.gun, bulutGun: bulut.gun });
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
