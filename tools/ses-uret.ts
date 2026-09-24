/**
 * Oyunun sesleri burada sentezleniyor: kare dalga, gürültü ve zarflarla
 * 8-bit efektler. Hazır ses kütüphanesi kullanılmadı; lisans sorunu yok,
 * palete benzer tutarlı bir ses dili var ve bir ses değişecekse bu dosya
 * değişiyor.
 *
 *     npm run ses        # assets/ses/*.wav dosyalarını yeniden üretir
 *
 * Çıktı 22 050 Hz, mono, 16 bit WAV. Tohumlu gürültü: her üretim aynı dosya.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const HZ = 22050;
const KLASOR = join(__dirname, '..', 'assets', 'ses');

// ── Temel parçalar ───────────────────────────────────────────────────
let tohum = 7;
const gurultu = () => {
  tohum = (tohum * 1103515245 + 12345) & 0x7fffffff;
  return (tohum / 0x7fffffff) * 2 - 1;
};
const kare = (faz: number) => (faz % 1 < 0.5 ? 1 : -1);
const sin = (faz: number) => Math.sin(faz * 2 * Math.PI);

type Ornekler = Float32Array;
const bos = (sn: number): Ornekler => new Float32Array(Math.round(sn * HZ));

/** Saldırı / düşüş zarfı (saniye). */
function zarf(i: number, n: number, saldiri: number, dusus = 0.02) {
  const t = i / HZ;
  const kalan = (n - i) / HZ;
  return Math.min(1, t / Math.max(1e-4, saldiri), kalan / Math.max(1e-4, dusus));
}

/** Frekansı zamana göre değişen ton (Hz fonksiyonu). */
function ton(
  sn: number,
  frekans: (t: number) => number,
  dalga: (faz: number) => number,
  hacim: (t: number) => number,
): Ornekler {
  const o = bos(sn);
  let faz = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / HZ;
    faz += frekans(t) / HZ;
    o[i] = dalga(faz) * hacim(t) * zarf(i, o.length, 0.004);
  }
  return o;
}

/** Tek kutuplu alçak geçiren; `k` küçüldükçe boğuk. */
function alcak(o: Ornekler, k: number) {
  let y = 0;
  for (let i = 0; i < o.length; i++) o[i] = y += k * (o[i] - y);
  return o;
}

function karistir(...parcalar: [Ornekler, number, number?][]): Ornekler {
  const uzunluk = Math.max(...parcalar.map(([p, , bas = 0]) => p.length + Math.round(bas * HZ)));
  const o = new Float32Array(uzunluk);
  for (const [p, kazanc, bas = 0] of parcalar) {
    const k = Math.round(bas * HZ);
    for (let i = 0; i < p.length; i++) o[i + k] += p[i] * kazanc;
  }
  return o;
}

const sonum = (t: number, hiz: number) => Math.exp(-t * hiz);

// ── Sesler ───────────────────────────────────────────────────────────
const SESLER: Record<string, () => Ornekler> = {
  // Onbaşı düdüğü: tiz, hafif titreyen, bir uzun.
  duduk: () =>
    ton(0.55, (t) => 2750 + Math.sin(t * 2 * Math.PI * 28) * 70, sin, (t) => 0.5 * (t < 0.05 ? t / 0.05 : 1)),

  // Çakıl/postal: kısa, boğuk gürültü patlaması. İki varyant, sağ-sol.
  adim1: () => {
    const o = bos(0.07);
    for (let i = 0; i < o.length; i++) o[i] = gurultu() * sonum(i / HZ, 60);
    return alcak(o, 0.25);
  },
  adim2: () => {
    const o = bos(0.07);
    for (let i = 0; i < o.length; i++) o[i] = gurultu() * sonum(i / HZ, 70) * 0.85;
    return alcak(o, 0.18);
  },

  // Düğme: kısa kare tık.
  tik: () => ton(0.03, () => 1400, kare, () => 0.18),

  // Tepsi: metal, uyumsuz kısmi tonlar, hızlı sönüm.
  tepsi: () =>
    karistir(
      [ton(0.4, () => 410, sin, (t) => sonum(t, 9)), 0.35],
      [ton(0.4, () => 1170, sin, (t) => sonum(t, 12)), 0.25],
      [ton(0.4, () => 2310, sin, (t) => sonum(t, 16)), 0.18],
      [alcak(Float32Array.from(bos(0.03), () => gurultu()), 0.5), 0.3],
    ),

  // Telefon zili: 450 Hz, iki kısa çalış.
  telefon: () =>
    karistir(
      [ton(0.35, () => 450, kare, () => 0.14), 1],
      [ton(0.35, () => 450, kare, () => 0.14), 1, 0.5],
    ),

  // Kontör kartı / para: iki notalı yükselen kare.
  kontor: () =>
    karistir([ton(0.07, () => 988, kare, () => 0.16), 1], [ton(0.16, () => 1319, kare, (t) => 0.16 * sonum(t, 12)), 1, 0.07]),

  // Devriye: üç ağır adım yaklaşıyor.
  devriye: () => {
    const adim = () => {
      const o = bos(0.1);
      for (let i = 0; i < o.length; i++) o[i] = gurultu() * sonum(i / HZ, 45);
      return alcak(o, 0.12);
    };
    return karistir([adim(), 0.5], [adim(), 0.7, 0.35], [adim(), 0.95, 0.7]);
  },

  // Gün sonu damgası: kalın darbe.
  damga: () =>
    karistir(
      [ton(0.18, (t) => 110 - t * 200, sin, (t) => 0.8 * sonum(t, 22)), 1],
      [alcak(Float32Array.from(bos(0.05), () => gurultu()), 0.3), 0.5],
    ),

  // Atış: keskin patlama ve kısa yankı.
  atis: () => {
    const patlama = bos(0.45);
    for (let i = 0; i < patlama.length; i++) patlama[i] = gurultu() * sonum(i / HZ, 18);
    alcak(patlama, 0.45);
    const bum = ton(0.3, (t) => 70 - t * 60, sin, (t) => sonum(t, 10));
    return karistir([patlama, 0.8], [bum, 0.7], [Float32Array.from(patlama), 0.18, 0.12]);
  },

  // Mini oyun sonucu: yükselen ya da inen üç nota.
  basari: () =>
    karistir(
      [ton(0.08, () => 523, kare, () => 0.14), 1],
      [ton(0.08, () => 659, kare, () => 0.14), 1, 0.08],
      [ton(0.22, () => 784, kare, (t) => 0.14 * sonum(t, 6)), 1, 0.16],
    ),
  basarisiz: () =>
    karistir(
      [ton(0.1, () => 392, kare, () => 0.14), 1],
      [ton(0.28, () => 262, kare, (t) => 0.14 * sonum(t, 5)), 1, 0.1],
    ),

  // Gece ambiyansı (döngü): cırcır böceği cıvıltıları, 4 sn periyot.
  gece: () => {
    const o = bos(4);
    for (let i = 0; i < o.length; i++) {
      const t = i / HZ;
      // Saniyede ~3 cıvıltı; her cıvıltı 4.6 kHz'de dört hızlı titreşim.
      const cvt = (t * 3) % 1;
      const titresim = cvt < 0.12 ? 0.5 + 0.5 * Math.sin(cvt * 2 * Math.PI * 33) : 0;
      o[i] = sin(t * 4600) * titresim * 0.07 + sin(t * 4150) * titresim * 0.03;
    }
    return o;
  },

  // Avlu ambiyansı (döngü): yavaş dalgalanan rüzgâr gürültüsü.
  avlu: () => {
    const uzun = bos(5);
    for (let i = 0; i < uzun.length; i++) {
      const t = i / HZ;
      uzun[i] = gurultu() * (0.35 + 0.25 * Math.sin(t * 2 * Math.PI * 0.25));
    }
    alcak(uzun, 0.03);
    // Son saniye ilk saniyeye çapraz geçişle karışıyor: döngü noktasında tık yok.
    const n = 4 * HZ;
    const gecis = HZ;
    const o = new Float32Array(n);
    for (let i = 0; i < n; i++) o[i] = uzun[i];
    for (let i = 0; i < gecis; i++) {
      const a = i / gecis;
      o[i] = uzun[i] * a + uzun[n + i] * (1 - a);
    }
    return o;
  },
};

// ── WAV ──────────────────────────────────────────────────────────────
function wav(o: Ornekler): Buffer {
  const tepe = Math.max(1e-6, ...o.map(Math.abs));
  const olcek = Math.min(1, 0.9 / tepe);
  const veri = Buffer.alloc(o.length * 2);
  for (let i = 0; i < o.length; i++) {
    veri.writeInt16LE(Math.round(Math.max(-1, Math.min(1, o[i] * olcek)) * 32767), i * 2);
  }
  const bas = Buffer.alloc(44);
  bas.write('RIFF', 0);
  bas.writeUInt32LE(36 + veri.length, 4);
  bas.write('WAVE', 8);
  bas.write('fmt ', 12);
  bas.writeUInt32LE(16, 16);
  bas.writeUInt16LE(1, 20); // PCM
  bas.writeUInt16LE(1, 22); // mono
  bas.writeUInt32LE(HZ, 24);
  bas.writeUInt32LE(HZ * 2, 28);
  bas.writeUInt16LE(2, 32);
  bas.writeUInt16LE(16, 34);
  bas.write('data', 36);
  bas.writeUInt32LE(veri.length, 40);
  return Buffer.concat([bas, veri]);
}

mkdirSync(KLASOR, { recursive: true });
for (const [ad, uret] of Object.entries(SESLER)) {
  tohum = 7;
  const dosya = join(KLASOR, `${ad}.wav`);
  const b = wav(uret());
  writeFileSync(dosya, b);
  console.log(`${ad.padEnd(12)} ${(b.length / 1024).toFixed(1).padStart(6)} KB`);
}
