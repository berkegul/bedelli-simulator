/** `npx tsx src/content/telefon/calistir-dogrula.ts` */
import { dogrula, ozet } from './dogrula';

const sorunlar = dogrula();
const hatalar = sorunlar.filter((s) => s.seviye === 'hata');
const uyarilar = sorunlar.filter((s) => s.seviye === 'uyari');
const o = ozet();

console.log(`\nİÇERİK: ${o.gorusme} görüşme · ${o.replik} replik · ${o.secenek} seçenek\n`);

if (hatalar.length) {
  console.log(`HATA (${hatalar.length}):`);
  for (const s of hatalar) console.log(`  ✗ ${s.nerede} — ${s.ne}`);
  console.log('');
}
if (uyarilar.length) {
  console.log(`UYARI (${uyarilar.length}):`);
  for (const s of uyarilar) console.log(`  · ${s.nerede} — ${s.ne}`);
  console.log('');
}
if (!hatalar.length && !uyarilar.length) console.log('Temiz.\n');

process.exit(hatalar.length ? 1 : 0);
