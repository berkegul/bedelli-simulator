/**
 * İçerik simülatörü. İki iş yapıyor:
 *  1) Her görüşmenin her yolunu tüketerek yürüyor — sonlanmayan zincir,
 *     çözülmeyen şablon anahtarı, seçeneksiz çıkmaz var mı diye.
 *  2) Yirmi sekiz günü baştan sona rastgele oynuyor — motor gerçekten her
 *     gün bir şey sunabiliyor mu, ilişki sayıları makul yerde bitiyor mu.
 *
 * `npx tsx src/content/telefon/simule.ts`
 */

import { TOPLAM_GUN } from '../../engine/stats';
import { TUM_GORUSMELER, gunGorusmesi, kayittanRolSec } from './index';
import {
  ihmalSarkmasi,
  iliskiUygula,
  metinDoldur,
  raunt,
  replikCoz,
  secenekleriHazirla,
} from './motor';
import type { Gorusme, Hafiza, KayitRolu, Rol, TelefonDurumu } from './tipler';

const kirp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function bosDurum(gun = 1): TelefonDurumu {
  return {
    gun,
    iliski: { anne: 75, baba: 60, sevgili: 70, kanka: 70, kardes: 65, es: 75, akraba: 55 },
    gerilim: { anne: 0, baba: 0, sevgili: 0, kanka: 0, kardes: 0, es: 0, akraba: 0 },
    ozlem: 20,
    moral: 65,
    disiplin: 50,
    hafiza: {},
    gorulmus: [],
    telefonVar: true,
    sigaraIcen: false,
    sevgiliVar: true,
    sonArama: { anne: 0, baba: 0, sevgili: 0, kanka: 0, kardes: 0, es: 0, akraba: 0 },
  };
}

/** Her işaret konmuş gibi davranan hafıza — şablon anahtarlarını sınamak için. */
function doluHafiza(): Hafiza {
  const h: Hafiza = {};
  for (const g of TUM_GORUSMELER) {
    for (const r of Object.values(g.replikler)) {
      for (const s of r.secenekler ?? []) {
        if (s.isaret) h[s.isaret.ad] = { deger: s.isaret.deger, gun: 1 };
      }
    }
  }
  return h;
}

// ─────────────────────────────── 1. bütün yollar

type Bulgu = { nerede: string; ne: string };

function yollariYuru(g: Gorusme, ankesor: boolean, bulgular: Bulgu[]) {
  const durum = bosDurum(10);
  durum.hafiza = doluHafiza();
  const baglam = { ad: 'Berke', kisi: 'Test', gun: 10, hafiza: durum.hafiza };
  const limit = raunt(!ankesor);

  const yigin: { replikId: string; adim: number; iz: string[] }[] = [];
  const kok = replikCoz(g, g.kok, durum);
  if (!kok) {
    bulgular.push({ nerede: g.id, ne: 'kok replik koşulu hiç tutmuyor' });
    return;
  }
  yigin.push({ replikId: kok.id, adim: 0, iz: [kok.id] });

  let ziyaret = 0;
  while (yigin.length) {
    const { replikId, adim, iz } = yigin.pop()!;
    if (++ziyaret > 20000) {
      bulgular.push({ nerede: g.id, ne: 'yol sayısı patladı — döngü olabilir' });
      return;
    }

    const replik = g.replikler[replikId];
    if (!replik) continue;

    // Şablon anahtarları çözülüyor mu
    const metinler = [replik.metin, ...(replik.secenekler ?? []).map((s) => s.cevap ?? '')];
    for (const m of metinler) {
      const cozulmus = metinDoldur(m, baglam);
      const kalan = cozulmus.match(/\{[a-zA-Z_:]+\}/);
      if (kalan) {
        bulgular.push({
          nerede: `${g.id}/${replikId}`,
          ne: `şablon çözülmedi: ${kalan[0]}`,
        });
      }
    }

    const secenekler = secenekleriHazirla(replik, durum, g.rol, ankesor);
    if (!secenekler.length) {
      if (replik.secenekler?.length) {
        bulgular.push({
          nerede: `${g.id}/${replikId}`,
          ne: 'seçenekler var ama hiçbiri koşulu tutmuyor — çıkmaz',
        });
      }
      continue; // seçeneksiz düğüm: sonraki zaten motor tarafından yürütülüyor
    }

    for (const s of secenekler) {
      if (!s.sonraki) continue; // kapanış, sorun yok
      if (adim + 1 >= limit) continue; // ankesör keser, kapanış devreye girer
      if (iz.includes(s.sonraki)) {
        bulgular.push({
          nerede: `${g.id}/${replikId}/${s.id}`,
          ne: `döngü: '${s.sonraki}' bu yolda zaten geçildi`,
        });
        continue;
      }
      const sonraki = replikCoz(g, s.sonraki, durum);
      if (!sonraki) {
        bulgular.push({
          nerede: `${g.id}/${replikId}/${s.id}`,
          ne: `'${s.sonraki}' koşulu tutmuyor ve atla hedefi yok — görüşme sessizce kapanıyor`,
        });
        continue;
      }
      yigin.push({ replikId: sonraki.id, adim: adim + 1, iz: [...iz, sonraki.id] });
    }
  }
}

// ─────────────────────────────── 2. 28 günlük oynanış

const HATLAR: KayitRolu[] = ['ev', 'sevgili', 'kanka'];

function oyunuOyna(telefonVar: boolean, aramaBasina: number, tohum: string) {
  const d = bosDurum(1);
  d.telefonVar = telefonVar;
  const roller: Rol[] = ['anne', 'baba', 'sevgili', 'kanka'];
  const bosGunler: string[] = [];
  let toplamGorusme = 0;

  for (let gun = 1; gun <= TOPLAM_GUN; gun++) {
    d.gun = gun;

    const ihmal = roller.filter((r) => gun - (d.sonArama[r] || 0) >= 2);
    d.ozlem = kirp(d.ozlem + (ihmal.length >= 2 ? 4 : ihmal.length === 1 ? 2 : 0) - 2);
    const sarkma = ihmalSarkmasi(roller, d);
    for (const [rol, p] of Object.entries(sarkma.iliski)) {
      d.iliski[rol as Rol] = iliskiUygula(d.iliski[rol as Rol], p ?? 0);
    }
    for (const [rol, p] of Object.entries(sarkma.gerilim)) {
      d.gerilim[rol as Rol] = kirp(d.gerilim[rol as Rol] + (p ?? 0));
    }

    // Günde kaç arama yapılabildiği telefona bağlı — kıtlık burada.
    const hatlar = HATLAR.slice(0, aramaBasina);
    for (const kayit of hatlar) {
      const rol = kayittanRolSec(kayit, d);
      const g = gunGorusmesi(rol, d);
      if (!g) {
        bosGunler.push(`gün ${gun} · ${kayit}`);
        continue;
      }
      toplamGorusme++;
      d.gorulmus.push(g.id);
      d.sonArama[rol] = gun;

      // Görüşmeyi yürüt
      let replik = replikCoz(g, g.kok, d);
      let kalan = raunt(telefonVar);
      let aktifRol = rol;
      while (replik && kalan > 0) {
        const secenekler = secenekleriHazirla(replik, d, aktifRol, !telefonVar);
        if (!secenekler.length) break;
        const sec = secenekler[Math.floor(Math.random() * secenekler.length)];
        const e = sec.etki ?? {};
        if (e.iliski) d.iliski[aktifRol] = iliskiUygula(d.iliski[aktifRol], e.iliski);
        if (e.gerilim) d.gerilim[aktifRol] = kirp(d.gerilim[aktifRol] + e.gerilim);
        if (e.digerIliski) {
          d.iliski[e.digerIliski.kim] = iliskiUygula(
            d.iliski[e.digerIliski.kim],
            e.digerIliski.puan,
          );
        }
        if (e.ozlem) d.ozlem = kirp(d.ozlem + Math.round(e.ozlem / 2));
        if (e.moral) d.moral = kirp(d.moral + e.moral);
        if (sec.isaret) d.hafiza[sec.isaret.ad] = { deger: sec.isaret.deger, gun };
        if (sec.rolDegis) aktifRol = sec.rolDegis;
        kalan--;
        replik = sec.sonraki ? replikCoz(g, sec.sonraki, d) : undefined;
      }
    }
  }

  return { d, bosGunler, toplamGorusme, tohum };
}

// ─────────────────────────────── çalıştır

const bulgular: Bulgu[] = [];
for (const g of TUM_GORUSMELER) {
  yollariYuru(g, false, bulgular);
  yollariYuru(g, true, bulgular);
}

console.log(`\n── YOL TARAMASI (${TUM_GORUSMELER.length} görüşme, ankesör + telefon)`);
if (bulgular.length) {
  const benzersiz = [...new Map(bulgular.map((b) => [`${b.nerede}|${b.ne}`, b])).values()];
  console.log(`  ${benzersiz.length} bulgu:`);
  for (const b of benzersiz.slice(0, 30)) console.log(`  ✗ ${b.nerede} — ${b.ne}`);
  if (benzersiz.length > 30) console.log(`  … ${benzersiz.length - 30} tane daha`);
} else {
  console.log('  Temiz — bütün yollar sonlanıyor, bütün şablonlar çözülüyor.');
}

console.log('\n── 28 GÜNLÜK OYNANIŞ');
for (const senaryo of [
  { ad: 'ankesör (telefonsuz, günde 2 arama)', telefon: false, arama: 2 },
  { ad: 'kendi telefonu (günde 3 arama)', telefon: true, arama: 3 },
  { ad: 'ihmalkâr (telefonsuz, günde 1 arama)', telefon: false, arama: 1 },
]) {
  const r = oyunuOyna(senaryo.telefon, senaryo.arama, senaryo.ad);
  const i = r.d.iliski;
  console.log(`\n  ${senaryo.ad}`);
  console.log(`    görüşme: ${r.toplamGorusme} · boş hat: ${r.bosGunler.length}`);
  console.log(
    `    anne ${i.anne} · baba ${i.baba} · sevgili ${i.sevgili} · kanka ${i.kanka}`,
  );
  console.log(`    sevgili gerilim ${r.d.gerilim.sevgili} · özlem ${r.d.ozlem}`);
  console.log(`    hafızada ${Object.keys(r.d.hafiza).length} işaret`);
  if (r.bosGunler.length) console.log(`    ⚠ boş: ${r.bosGunler.slice(0, 6).join(', ')}`);
}
console.log('');
