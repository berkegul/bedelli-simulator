/**
 * İçerik doğrulayıcı. Master prompt'un JSON kuralları burada TypeScript
 * karşılığını buluyor: tekrar eden id, var olmayan `sonraki` hedefi,
 * ulaşılamayan replik, hiç yazılmayan işarete bakan koşul.
 *
 * `npx tsx src/content/telefon/dogrula.ts` ile çalışır; içerik değiştikçe
 * tekrar çalıştırılması gereken tek şey bu.
 */

import { TOPLAM_GUN } from '../../engine/stats';
import { TUM_GORUSMELER } from './index';
import { EPILOG_ISARETLERI } from './finaller';
import { ISARET_PLANI } from './isaretPlani';
import type { Gorusme, KayitRolu, Kosul, Rol } from './tipler';

/** `plan`: henüz okunmayan ama isaretPlani.ts'te bir yere bağlanmış işaret. */
export type Sorun = { seviye: 'hata' | 'uyari' | 'plan'; nerede: string; ne: string };

function kosullariTopla(g: Gorusme): Kosul[] {
  const hepsi: Kosul[] = [];
  if (g.kosul) hepsi.push(g.kosul);
  for (const r of Object.values(g.replikler)) {
    if (r.kosul) hepsi.push(r.kosul);
    for (const s of r.secenekler ?? []) if (s.kosul) hepsi.push(s.kosul);
  }
  return hepsi;
}

export function dogrula(): Sorun[] {
  const sorunlar: Sorun[] = [];
  const gorulenId = new Set<string>();
  const yazilanIsaretler = new Set<string>();
  const okunanIsaretler = new Map<string, string>();

  // Önce bütün işaret yazımlarını topla — koşul kontrolü buna dayanıyor.
  for (const g of TUM_GORUSMELER) {
    for (const r of Object.values(g.replikler)) {
      for (const s of r.secenekler ?? []) {
        if (s.isaret) yazilanIsaretler.add(s.isaret.ad);
      }
    }
  }

  for (const g of TUM_GORUSMELER) {
    const yer = g.id;

    if (gorulenId.has(g.id)) {
      sorunlar.push({ seviye: 'hata', nerede: yer, ne: 'Görüşme id tekrar ediyor' });
    }
    gorulenId.add(g.id);

    if (!g.replikler[g.kok]) {
      sorunlar.push({ seviye: 'hata', nerede: yer, ne: `kok '${g.kok}' repliklerde yok` });
      continue;
    }

    // Referans bütünlüğü
    for (const [id, r] of Object.entries(g.replikler)) {
      if (r.id !== id) {
        sorunlar.push({
          seviye: 'hata',
          nerede: `${yer}/${id}`,
          ne: `replik.id ('${r.id}') anahtarla uyuşmuyor`,
        });
      }
      if (r.sonraki && !g.replikler[r.sonraki]) {
        sorunlar.push({
          seviye: 'hata',
          nerede: `${yer}/${id}`,
          ne: `sonraki '${r.sonraki}' yok`,
        });
      }
      if (r.atla && !g.replikler[r.atla]) {
        sorunlar.push({ seviye: 'hata', nerede: `${yer}/${id}`, ne: `atla '${r.atla}' yok` });
      }
      if (r.kosul && !r.atla) {
        sorunlar.push({
          seviye: 'uyari',
          nerede: `${yer}/${id}`,
          ne: 'koşullu replik ama atla hedefi yok — koşul tutmazsa görüşme kapanır',
        });
      }
      if (!r.secenekler?.length && !r.sonraki) {
        sorunlar.push({
          seviye: 'uyari',
          nerede: `${yer}/${id}`,
          ne: 'ne seçenek ne sonraki var — görüşme burada biter',
        });
      }

      const secenekIdleri = new Set<string>();
      for (const s of r.secenekler ?? []) {
        if (secenekIdleri.has(s.id)) {
          sorunlar.push({
            seviye: 'hata',
            nerede: `${yer}/${id}`,
            ne: `seçenek id '${s.id}' aynı replikte tekrar ediyor`,
          });
        }
        secenekIdleri.add(s.id);
        if (s.sonraki && !g.replikler[s.sonraki]) {
          sorunlar.push({
            seviye: 'hata',
            nerede: `${yer}/${id}/${s.id}`,
            ne: `sonraki '${s.sonraki}' yok`,
          });
        }
      }
    }

    // Ulaşılabilirlik
    const ulasilan = new Set<string>();
    const kuyruk = [g.kok];
    while (kuyruk.length) {
      const id = kuyruk.pop()!;
      if (ulasilan.has(id)) continue;
      ulasilan.add(id);
      const r = g.replikler[id];
      if (!r) continue;
      if (r.sonraki) kuyruk.push(r.sonraki);
      if (r.atla) kuyruk.push(r.atla);
      for (const s of r.secenekler ?? []) if (s.sonraki) kuyruk.push(s.sonraki);
    }
    for (const id of Object.keys(g.replikler)) {
      if (!ulasilan.has(id)) {
        sorunlar.push({ seviye: 'hata', nerede: `${yer}/${id}`, ne: 'replike ulaşılamıyor' });
      }
    }

    // Koşulların baktığı işaretler gerçekten yazılıyor mu
    for (const k of kosullariTopla(g)) {
      for (const ad of [k.isaret, k.isaretYok]) {
        if (!ad) continue;
        okunanIsaretler.set(ad, yer);
        if (!yazilanIsaretler.has(ad)) {
          sorunlar.push({
            seviye: 'hata',
            nerede: yer,
            ne: `koşul '${ad}' işaretine bakıyor ama bu işaret hiçbir yerde yazılmıyor`,
          });
        }
      }
    }

    // Şablon anahtarları
    for (const [id, r] of Object.entries(g.replikler)) {
      const metinler = [r.metin, ...(r.secenekler ?? []).map((s) => s.cevap ?? '')];
      for (const m of metinler) {
        for (const eslesme of m.matchAll(/\{(yas|deger):([a-zA-Z_]+)\}/g)) {
          const ad = eslesme[2];
          if (!yazilanIsaretler.has(ad)) {
            sorunlar.push({
              seviye: 'hata',
              nerede: `${yer}/${id}`,
              ne: `metin '{${eslesme[1]}:${ad}}' kullanıyor ama '${ad}' hiç yazılmıyor`,
            });
          }
        }
        for (const eslesme of m.matchAll(/\{([a-zA-Z]+)\}/g)) {
          const anahtar = eslesme[1];
          if (!['ad', 'kisi', 'gun', 'kalan', 'kalanYazi'].includes(anahtar)) {
            sorunlar.push({
              seviye: 'hata',
              nerede: `${yer}/${id}`,
              ne: `bilinmeyen şablon anahtarı '{${anahtar}}'`,
            });
          }
        }
      }
    }
  }

  // Her günün her ana hattında en az bir görüşme var mı
  const HATLAR: { kayit: KayitRolu; roller: Rol[] }[] = [
    { kayit: 'ev', roller: ['anne', 'baba'] },
    { kayit: 'sevgili', roller: ['sevgili'] },
    { kayit: 'kanka', roller: ['kanka'] },
  ];
  for (let gun = 1; gun <= TOPLAM_GUN; gun++) {
    for (const hat of HATLAR) {
      const varMi = TUM_GORUSMELER.some((g) => {
        if (!hat.roller.includes(g.rol)) return false;
        if (!g.gunler) return true;
        if (Array.isArray(g.gunler)) return g.gunler.includes(gun);
        return gun >= g.gunler.min && gun <= g.gunler.max;
      });
      if (!varMi) {
        sorunlar.push({
          seviye: 'hata',
          nerede: `gün ${gun}`,
          ne: `'${hat.kayit}' hattında oynanabilir görüşme yok`,
        });
      }
    }
  }

  // Epilog de bir okuyucu: "…demiştin" satırları işaretin değerinden geliyor.
  for (const ad of EPILOG_ISARETLERI) {
    okunanIsaretler.set(ad, 'epilog');
    if (!yazilanIsaretler.has(ad)) {
      sorunlar.push({ seviye: 'hata', nerede: 'epilog', ne: `epilog '${ad}' işaretini okuyor ama bu işaret hiç yazılmıyor` });
    }
  }

  // Plan kaydı: her planlı işaret gerçekten yazılıyor olmalı; okunmaya
  // başladıysa kayıttan silinmeli.
  for (const [ad, plan] of Object.entries(ISARET_PLANI)) {
    const nerede = plan.plan === 'gun' ? `plan · gün ${plan.gun}` : 'plan · final';
    if (!yazilanIsaretler.has(ad)) {
      sorunlar.push({ seviye: 'hata', nerede, ne: `planlı '${ad}' işareti hiçbir yerde yazılmıyor` });
    } else if (okunanIsaretler.has(ad)) {
      sorunlar.push({ seviye: 'uyari', nerede, ne: `'${ad}' artık okunuyor; isaretPlani.ts'ten sil` });
    } else {
      sorunlar.push({
        seviye: 'plan',
        nerede,
        ne: plan.plan === 'gun' ? `'${ad}' — ${plan.not}` : `'${ad}'`,
      });
    }
  }

  // Yazılıp hiç okunmayan ve planı da olmayan işaretler — ölü ağırlık.
  for (const ad of yazilanIsaretler) {
    if (!okunanIsaretler.has(ad) && !ISARET_PLANI[ad]) {
      sorunlar.push({
        seviye: 'uyari',
        nerede: 'işaretler',
        ne: `'${ad}' yazılıyor ama hiçbir koşul/metin okumuyor ve planı yok (isaretPlani.ts)`,
      });
    }
  }

  return sorunlar;
}

export function ozet() {
  const gorusme = TUM_GORUSMELER.length;
  const replik = TUM_GORUSMELER.reduce((t, g) => t + Object.keys(g.replikler).length, 0);
  const secenek = TUM_GORUSMELER.reduce(
    (t, g) =>
      t + Object.values(g.replikler).reduce((x, r) => x + (r.secenekler?.length ?? 0), 0),
    0,
  );
  return { gorusme, replik, secenek };
}
