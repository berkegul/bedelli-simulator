/** `npx tsx src/content/telefon/calistir-dogrula.ts` */
import { dogrula, ozet } from './dogrula';

const sorunlar = dogrula();
const hatalar = sorunlar.filter((s) => s.seviye === 'hata');
const uyarilar = sorunlar.filter((s) => s.seviye === 'uyari');
const planlar = sorunlar.filter((s) => s.seviye === 'plan');
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
if (planlar.length) {
  const final = planlar.filter((s) => s.nerede === 'plan · final').length;
  console.log(`PLANLI (${planlar.length}): ${final} işaret final kartlarını, ${planlar.length - final} işaret gün içeriğini bekliyor`);
  for (const s of planlar.filter((s) => s.nerede !== 'plan · final')) console.log(`  → ${s.nerede}: ${s.ne}`);
  console.log('');
}
if (!hatalar.length && !uyarilar.length) console.log('Temiz.\n');

process.exit(hatalar.length ? 1 : 0);
