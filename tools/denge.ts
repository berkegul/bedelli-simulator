/**
 * Denge raporu: üç profil gün gün, ardından 200 rastgele ortalama oyuncunun
 * gün sonu not dağılımı. Yeni gün yazdıktan sonra çalıştır.
 *
 *     npm run denge                 # rapor
 *     npm run denge -- --ayrinti    # her profil için gün içi blok blok
 *
 * Aranan tablo: üç profil farklı notlar alıyor, hiçbir istatistik 0 ya da
 * 100'e yapışmıyor, 28 güne yayılacak ilerleme payı kalıyor.
 */
import { oyna, PROFILLER } from './oyuncu';

// ── Rapor ─────────────────────────────────────────────────────────────
const UC_UST = 97;
const UC_ALT = 3;
const pad = (x: string | number, n: number) => String(x).padStart(n);

async function main() {
  const ayrinti = process.argv.includes('--ayrinti');

  for (const p of PROFILLER) {
    console.log(`\n${p.ad}`);
    console.log(' gün   KOND  DİSİP  MORAL  ENERJİ  TOKLUK   PARA   NOT');
    const gunler = await oyna(p, 1, ayrinti);
    for (const r of gunler) {
      const s = r.stats;
      const uc = (['kondisyon', 'disiplin', 'moral'] as const).filter((k) => s[k] >= UC_UST || s[k] <= UC_ALT);
      console.log(
        `${pad(r.gun, 4)}  ${pad(s.kondisyon, 5)}  ${pad(s.disiplin, 5)}  ${pad(s.moral, 5)}  ${pad(s.enerji, 6)}  ${pad(s.tokluk, 6)}  ${pad(r.para, 5)}   ${r.not} (${r.puan})${uc.length ? `  ⚠ uçta: ${uc.join(', ')}` : ''}`,
      );
    }
  }

  const N = 200;
  const dagilim = new Map<number, Map<string, number>>();
  for (let i = 0; i < N; i++) {
    for (const r of await oyna(PROFILLER[1], 1000 + i)) {
      const m = dagilim.get(r.gun) ?? new Map<string, number>();
      m.set(r.not, (m.get(r.not) ?? 0) + 1);
      dagilim.set(r.gun, m);
    }
  }
  console.log(`\n${N} RASTGELE ORTALAMA OYUNCU · gün sonu not dağılımı (%)`);
  const NOTLAR = ['TAKDİR ALDI', 'TEMİZ İŞ', 'İDARE EDER', 'GAZ YEDİ', 'CEZALI'];
  console.log(` gün  ${NOTLAR.map((n) => pad(n, 12)).join('')}`);
  for (const [gun, m] of [...dagilim].sort((a, b) => a[0] - b[0])) {
    console.log(`${pad(gun, 4)}  ${NOTLAR.map((n) => pad(Math.round(((m.get(n) ?? 0) / N) * 100), 12)).join('')}`);
  }
  console.log('\nKapsam dışı: telefon, sigara, kantin, muhabbet (serbest zamanda yalnızca dinlenme).');
}

void main();
