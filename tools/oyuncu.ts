/**
 * Sanal oyuncu: oyunun gerçek store'unu (src/store/gameStore.ts) bir oyuncu
 * gibi sürer. Denge raporu (tools/denge.ts) ve oynanış testi
 * (tools/oyuncu.test.ts) bunu kullanıyor. Çalıştırmak için Node'un
 * `--experimental-test-module-mocks` bayrağı gerekiyor (AsyncStorage taklidi).
 *
 * Store'un kendisini çalıştırdığı için oyunda ne varsa onu ölçer: yeni bir
 * gün ya da mekanik eklenince burası güncellenmez. Yalnızca yeni bir sahne
 * türü (Scene.kind) eklenince aşağıdaki switch'e bir dal girer.
 *
 * Kapsam dışı (bilerek): telefon görüşmeleri, sigara, kantin alışverişi,
 * arkadaş muhabbeti. Bunlar serbest zamanda oyuncunun tercihine bağlı ve
 * ölçümü bulandırıyor; profiller serbest zamanda yalnızca dinlenir ya da yatar.
 */
import { mock } from 'node:test';
import type { Choice, DolapDuzeni, Effect, Kalite, Stats } from '../src/engine/types';

// ── Ortam: AsyncStorage bellekte, Math.random tohumlu ──────────────────
const depo = new Map<string, string>();
mock.module('@react-native-async-storage/async-storage', {
  defaultExport: {
    getItem: async (k: string) => depo.get(k) ?? null,
    setItem: async (k: string, v: string) => void depo.set(k, v),
    removeItem: async (k: string) => void depo.delete(k),
    multiRemove: async (ks: string[]) => ks.forEach((k) => depo.delete(k)),
  },
});

// Sanal oyuncu satın alma yapmıyor; içerik ölçülürken bütün günler açık.
mock.module('../src/monetization/entitlements.ts', {
  namedExports: {
    BEDAVA_GUN: 28,
    TAM_SURUM_ACIK: true,
    gunOynanabilirMi: () => true,
    kilitliMi: () => false,
  },
});

export function tohumla(tohum: number) {
  let a = tohum >>> 0;
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Profiller ─────────────────────────────────────────────────────────
export type Profil = {
  ad: string;
  /** Anlatı seçimi: etkilerin puanına göre en iyi / en kötü / rastgele. */
  secim: 'en-iyi' | 'en-kotu' | 'rastgele';
  /** Mini oyun skoru üreteci. */
  skor: () => number;
  /** Tepside hedeflenen tokluk; null → hiç yemez. */
  tokluk: number | null;
  /** Çarşıda alınan kalite; null → hiçbir şey almaz. */
  kalite: Kalite | null;
  /** Dolaba yerleştirmenin doğruluğu (0–1); null → torbayı boşaltır. */
  dolap: number | null;
  /** Serbest zamanda gölgede dinlenir mi. */
  dinlenir: boolean;
};

export const PROFILLER: Profil[] = [
  { ad: 'EN İYİ', secim: 'en-iyi', skor: () => 0.92, tokluk: 78, kalite: 'kaliteli', dolap: 1, dinlenir: true },
  {
    ad: 'ORTALAMA',
    secim: 'rastgele',
    skor: () => 0.45 + Math.random() * 0.35,
    tokluk: 66,
    kalite: 'standart',
    dolap: 0.7,
    dinlenir: true,
  },
  { ad: 'EN KÖTÜ', secim: 'en-kotu', skor: () => 0, tokluk: null, kalite: null, dolap: null, dinlenir: false },
];

/** Seçimin oyuncuya "iyi" görünen değeri: not üç statı ölçüyor, enerji ikincil. */
const deger = (e: Effect) =>
  (e.kondisyon ?? 0) + (e.disiplin ?? 0) + (e.moral ?? 0) + 0.3 * (e.enerji ?? 0);

// ── Tek oyun ──────────────────────────────────────────────────────────
export type GunSonu = { gun: number; stats: Stats; para: number; not: string; puan: number };

/** Kaynak → [kondisyon, disiplin, moral] toplam değişimi. */
export type KaynakDokumu = Map<string, [number, number, number]>;

export async function oyna(
  p: Profil,
  tohum: number,
  ayrinti = false,
  dokum?: KaynakDokumu,
): Promise<GunSonu[]> {
  tohumla(tohum);
  depo.clear();
  const { useGame, aktifSahne } = await import('../src/store/gameStore');
  const { ogunMenusu } = await import('../src/content/menu');
  const { dukkanKatalogu, fiyat } = await import('../src/content/esyalar');
  const { torbadakiler, yiginDuzeni, dolapDenetimi } = await import('../src/content/dolap');
  const { hataSayisi } = await import('../src/content/denetim');
  const g = () => useGame.getState();

  await g().yeniOyun();
  g().profilKaydet('Sim', false);

  if (p.kalite) {
    for (const t of dukkanKatalogu('hazirlik', false)) {
      const kalite = t.kademeli ? p.kalite : 'standart';
      if (g().para >= fiyat(t, kalite)) g().satinAl(t.id, kalite);
    }
  }
  g().carsiyiBitir();

  /** Eylemin not statlarına etkisini kaynağına yazar. */
  const olc = (kaynak: string, eylem: () => void) => {
    const once = g().stats;
    const blok = g().blokIndex;
    eylem();
    if (!dokum) return;
    const sonra = g().stats;
    const ad = g().blokIndex !== blok && kaynak === 'ilerle' ? 'blok geçişi (açlık)' : kaynak;
    const t = dokum.get(ad) ?? [0, 0, 0];
    t[0] += sonra.kondisyon - once.kondisyon;
    t[1] += sonra.disiplin - once.disiplin;
    t[2] += sonra.moral - once.moral;
    dokum.set(ad, t);
  };

  const sonuclar: GunSonu[] = [];
  let adim = 0;
  for (; adim < 20_000; adim++) {
    const s = g();
    if (s.ekran === 'gunBasi') {
      s.gunuBaslat();
      continue;
    }
    if (s.ekran === 'gunSonu') {
      const son = s.bitenGunler.find((b) => b.gun === s.gun)!;
      sonuclar.push({ gun: s.gun, stats: { ...s.stats }, para: s.para, not: son.not, puan: son.puan });
      olc('gece: uyku + dolap eşyaları', () => s.sonrakiGun());
      continue;
    }
    if (s.ekran !== 'oyun') break; // içerik sonu ya da kilit

    if (s.sonuc) {
      olc('ilerle', () => s.sonucuKapat());
      continue;
    }

    const sahne = aktifSahne();
    if (!sahne) break;
    if (ayrinti && s.sahneIndex === 0) {
      const b = s.stats;
      console.log(
        `   ${s.gun}/${String(s.blokIndex).padStart(2)} K${b.kondisyon} D${b.disiplin} M${b.moral} E${b.enerji} T${b.tokluk}`,
      );
    }

    const kaynak =
      sahne.kind === 'mini'
        ? `mini: ${sahne.game}`
        : sahne.kind === 'anlati'
          ? sahne.choices?.length
            ? 'anlatı seçimi'
            : 'ilerle'
          : sahne.kind === 'serbest'
            ? 'serbest (dinlenme / yatma)'
            : sahne.kind === 'yol'
              ? 'yol (hava)'
              : sahne.kind === 'ders' || sahne.kind === 'tanitim'
                ? 'ilerle'
                : sahne.kind;
    olc(kaynak, () => {
      switch (sahne.kind) {
        case 'anlati': {
          const secenekler = sahne.choices ?? [];
          if (!secenekler.length) {
            s.ileri();
            break;
          }
          const sirali = [...secenekler].sort((a, b) => deger(b.effect) - deger(a.effect));
          const c =
            p.secim === 'en-iyi'
              ? sirali[0]
              : p.secim === 'en-kotu'
                ? sirali[sirali.length - 1]
                : secenekler[Math.floor(Math.random() * secenekler.length)];
          s.secimYap(c);
          break;
        }
        case 'mini':
          s.miniBaslat();
          g().miniBitir(p.skor());
          break;
        case 'yemek': {
          if (p.tokluk === null) {
            s.yemekYe([]);
            break;
          }
          const menu = [...ogunMenusu(s.gun, sahne.ogun)].sort(
            (a, b) => (b.kondisyon ?? 0) + (b.moral ?? 0) - ((a.kondisyon ?? 0) + (a.moral ?? 0)),
          );
          let tokluk = s.stats.tokluk;
          const tabak = menu.filter((y) => {
            if (tokluk + y.tokluk > p.tokluk!) return false;
            tokluk += y.tokluk;
            return true;
          });
          s.yemekYe(tabak.length ? tabak : menu.slice(0, 1));
          break;
        }
        case 'serbest':
          if (p.dinlenir && !s.bugunDinlenildi) s.golgedeDinlen();
          else s.ileri();
          break;
        case 'yol':
          s.yoldaVar();
          break;
        case 'ders':
        case 'tanitim':
          s.ileri();
          break;
        case 'dolap': {
          // DolapYerlesimi.tsx'in iki çıkışıyla aynı etkiler.
          if (p.dolap === null) {
            const c: Choice = { id: 'sim-hizli', label: '', effect: { disiplin: -4, enerji: 4, moral: 3 }, outcome: '' };
            s.dolapKapat(c, yiginDuzeni(s.envanter));
            break;
          }
          const parcalar = torbadakiler(s.envanter);
          const dogruSayisi = Math.round(parcalar.length * p.dolap);
          const duzen: DolapDuzeni = {
            yerler: Object.fromEntries(
              parcalar.map((x, i) => [x.id, i < dogruSayisi ? x.dogru : x.dogru === 'alt' ? 'ust' : 'alt']),
            ),
          };
          const oran = parcalar.length ? dogruSayisi / parcalar.length : 1;
          const c: Choice = {
            id: 'sim-duzenli',
            label: '',
            effect: { disiplin: Math.round(-2 + oran * 10), enerji: -6, ...(oran === 1 && { moral: 3 }) },
            outcome: '',
          };
          s.dolapKapat(c, duzen);
          break;
        }
        case 'dolapDenetimi': {
          const d = dolapDenetimi(s.dolapDuzeni);
          s.secimYap({ id: 'sim-dolap-denetimi', label: '', effect: d.etki, outcome: d.metin });
          break;
        }
        case 'denetim':
          s.denetimBitir(hataSayisi(s.bekleyenKusurlar) > 0 ? p.skor() : null);
          break;
      }
    });
  }
  // Adım sınırı doldu: bir sahne ilerlemiyor (oynanış kilitlendi).
  if (adim >= 20_000) {
    const s = g();
    throw new Error(`Oyun ilerlemiyor: ${s.gun}. gün, blok ${s.blokIndex}, sahne ${s.sahneIndex}`);
  }
  return sonuclar;
}
