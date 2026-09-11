/**
 * Telefon motoru — seçim, koşul, sarkma ve metin doldurma.
 *
 * İçerik dosyaları (gunler/g01.ts …) yalnızca veri; hangi görüşmenin ne zaman
 * açılacağına dair bütün karar burada. Böylece 28 günün tamamı tek bir
 * algoritmayla yönetiliyor ve yeni bir gün eklemek kod değil veri işi oluyor.
 */

import { TOPLAM_GUN } from '../../engine/stats';
import {
  GENEL_ANKESOR_KAPANIS,
  KAYIT_ROLLERI,
  RAUNT_ANKESOR,
  RAUNT_TELEFON,
  type Gorusme,
  type Hafiza,
  type KayitRolu,
  type Kosul,
  type Replik,
  type Rol,
  type Secenek,
  type TelefonDurumu,
} from './tipler';

// ─────────────────────────────────────────── sayılar

const BIRLER = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ONLAR = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];

/** 17 -> "on yedi". Callback replikleri sayıyı rakamla yazmıyor, konuşma dili bu. */
export function sayiYaziyla(n: number): string {
  if (n <= 0) return 'sıfır';
  if (n >= 100) return String(n);
  const on = Math.floor(n / 10);
  const bir = n % 10;
  return [ONLAR[on], BIRLER[bir]].filter(Boolean).join(' ') || String(n);
}

/** Bugün dahil değil: 1. günde 27, 27. günde 1, 28. günde 0. */
export function kalanGunSayisi(gun: number) {
  return Math.max(0, TOPLAM_GUN - gun);
}

// ─────────────────────────────────────────── bantlar

export type Bant = 'yakin' | 'iyi' | 'mesafeli' | 'kirgin' | 'kopuk';

export function bant(puan: number): Bant {
  if (puan >= 80) return 'yakin';
  if (puan >= 60) return 'iyi';
  if (puan >= 40) return 'mesafeli';
  if (puan >= 20) return 'kirgin';
  return 'kopuk';
}

/**
 * İlişki bozuldukça söyleyebileceklerin azalıyor. Puanı hiç göstermeden
 * oyuncuya durumu hissettiren şey bu — ekranda daha az düğme var.
 */
const BANT_SECENEK: Record<Bant, number> = {
  yakin: 4,
  iyi: 4,
  mesafeli: 3,
  kirgin: 2,
  kopuk: 2,
};

// ─────────────────────────────────────────── ilişki eğrisi

const kirp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * İlişki tavana yaklaştıkça kazanmak zorlaşıyor, kaybetmek aynı hızda kalıyor.
 * Bu olmadan her rol daha ikinci haftada 100'e dayanıyor ve bantlar da,
 * finaller de, seçenek kısıtlaması da anlamsızlaşıyordu — oyunda
 * `stats.ts` aynı sorunu aynı şekilde çözüyor.
 */
export function iliskiUygula(mevcut: number, degisim: number): number {
  if (!degisim) return mevcut;

  if (degisim > 0) {
    const olceklenmis = degisim * (1 - mevcut / 100);
    // Uçta garanti hareket yok, yoksa +1'ler birikip tavana çiviliyor.
    return kirp(mevcut + (mevcut >= 88 ? olceklenmis : Math.max(1, olceklenmis)));
  }

  const dusus = -degisim * Math.pow(mevcut / 100, 0.4);
  return kirp(mevcut - (mevcut <= 6 ? dusus : Math.max(1, dusus)));
}

/** Gerilim ve özlem düz uygulanır — ikisi de birikip boşalan sayaçlar. */
export function sayacUygula(mevcut: number, degisim: number): number {
  return kirp(mevcut + degisim);
}

// ─────────────────────────────────────────── koşullar

function isaretTutar(kosul: Kosul, hafiza: Hafiza, gun: number): boolean {
  if (kosul.isaretYok && hafiza[kosul.isaretYok]) return false;
  if (!kosul.isaret) return true;

  const kayit = hafiza[kosul.isaret];
  if (!kayit) return false;
  if (kosul.isaretYas !== undefined && gun - kayit.gun < kosul.isaretYas) return false;
  if (kosul.isaretDeger !== undefined) {
    const kabul = Array.isArray(kosul.isaretDeger) ? kosul.isaretDeger : [kosul.isaretDeger];
    if (!kabul.includes(kayit.deger)) return false;
  }
  return true;
}

export function kosulTutar(kosul: Kosul | undefined, d: TelefonDurumu): boolean {
  if (!kosul) return true;

  if (kosul.gunMin !== undefined && d.gun < kosul.gunMin) return false;
  if (kosul.gunMax !== undefined && d.gun > kosul.gunMax) return false;

  for (const [rol, esik] of Object.entries(kosul.iliskiMin ?? {})) {
    if (d.iliski[rol as Rol] < esik) return false;
  }
  for (const [rol, esik] of Object.entries(kosul.iliskiMax ?? {})) {
    if (d.iliski[rol as Rol] > esik) return false;
  }
  for (const [rol, esik] of Object.entries(kosul.gerilimMin ?? {})) {
    if (d.gerilim[rol as Rol] < esik) return false;
  }
  for (const [rol, esik] of Object.entries(kosul.gerilimMax ?? {})) {
    if (d.gerilim[rol as Rol] > esik) return false;
  }

  if (kosul.moralMin !== undefined && d.moral < kosul.moralMin) return false;
  if (kosul.moralMax !== undefined && d.moral > kosul.moralMax) return false;
  if (kosul.ozlemMin !== undefined && d.ozlem < kosul.ozlemMin) return false;
  if (kosul.ozlemMax !== undefined && d.ozlem > kosul.ozlemMax) return false;
  if (kosul.disiplinMin !== undefined && d.disiplin < kosul.disiplinMin) return false;

  if (kosul.telefonVar !== undefined && kosul.telefonVar !== d.telefonVar) return false;
  if (kosul.sigaraIcen !== undefined && kosul.sigaraIcen !== d.sigaraIcen) return false;
  if (kosul.sevgiliVar !== undefined && kosul.sevgiliVar !== d.sevgiliVar) return false;

  return isaretTutar(kosul, d.hafiza, d.gun);
}

function gunUygun(g: Gorusme, gun: number): boolean {
  if (!g.gunler) return true;
  if (Array.isArray(g.gunler)) return g.gunler.includes(gun);
  return gun >= g.gunler.min && gun <= g.gunler.max;
}

// ─────────────────────────────────────────── görüşme seçimi

const TUR_ONCELIK: Record<Gorusme['tur'], number> = { omurga: 100, dal: 50, dolgu: 0 };

/**
 * Rol + gün + koşul → en yüksek öncelikli, görülmemiş görüşme.
 * Hiçbiri tutmazsa dolgu havuzuna düşülür; telefon hiçbir zaman sessiz kalmaz.
 */
export function gorusmeSec(
  havuz: Gorusme[],
  rol: Rol,
  d: TelefonDurumu,
): Gorusme | undefined {
  const uygun = havuz.filter(
    (g) =>
      g.rol === rol &&
      gunUygun(g, d.gun) &&
      kosulTutar(g.kosul, d) &&
      !(g.tekSefer !== false && d.gorulmus.includes(g.id)),
  );

  if (uygun.length) {
    const puanli = uygun
      .map((g) => ({ g, p: (g.oncelik ?? TUR_ONCELIK[g.tur]) }))
      .sort((a, b) => b.p - a.p);
    const enYuksek = puanli[0].p;
    const esitler = puanli.filter((x) => x.p === enYuksek).map((x) => x.g);
    return esitler[Math.floor(Math.random() * esitler.length)];
  }

  // Görülmüşleri de kabul eden son çare: dolgu havuzu tekrar edebilir.
  const tekrar = havuz.filter(
    (g) => g.rol === rol && g.tur === 'dolgu' && kosulTutar(g.kosul, d) && gunUygun(g, d.gun),
  );
  return tekrar[Math.floor(Math.random() * tekrar.length)];
}

/**
 * Ev kaydında telefonu kim açar. Baban telefonda rahat değil, çoğu zaman
 * anneni verir — ama üst üste anne açtıkça babanın açma ihtimali yükseliyor,
 * yoksa oyuncu babayı hiç tanımadan 28 günü bitirebiliyor.
 */
export function evdeKimAcar(d: TelefonDurumu, zorla?: Rol): Rol {
  if (zorla) return zorla;
  const anneFarki = d.gun - (d.sonArama.anne || 0);
  const babaFarki = d.gun - (d.sonArama.baba || 0);
  // Baban ne kadar uzun süredir konuşulmadıysa o kadar olası.
  const babaSans = Math.min(0.75, 0.3 + Math.max(0, babaFarki - anneFarki) * 0.08);
  return Math.random() < babaSans ? 'baba' : 'anne';
}

export function kayittanRol(kayit: KayitRolu, d: TelefonDurumu, zorla?: Rol): Rol {
  if (kayit === 'ev') return evdeKimAcar(d, zorla);
  return KAYIT_ROLLERI[kayit][0];
}

// ─────────────────────────────────────────── seçenek filtresi

/**
 * Koşulu tutmayan seçenek elenir; kalanlar ilişki bandının izin verdiği
 * sayıya indirilir. Koşullu seçenekler her zaman korunur (özel olarak
 * açılmışlar), budama sırasız/genel olanların sonundan yapılır.
 */
export function secenekleriHazirla(
  replik: Replik,
  d: TelefonDurumu,
  rol: Rol,
  ankesor: boolean,
): Secenek[] {
  const hepsi = (replik.secenekler ?? []).filter((s) => kosulTutar(s.kosul, d));
  if (hepsi.length <= 2) return hepsi;

  const limitBant = BANT_SECENEK[bant(d.iliski[rol])];
  // Ankesörde kuyruk var; uzun menü hem tempoya hem kurguya aykırı.
  const limit = Math.max(2, ankesor ? Math.min(limitBant, 3) : limitBant);
  if (hepsi.length <= limit) return hepsi;

  const ozel = hepsi.filter((s) => s.kosul);
  const genel = hepsi.filter((s) => !s.kosul);
  const secilen = [...ozel, ...genel.slice(0, Math.max(0, limit - ozel.length))];
  // Yazıldığı sırayı koru: menü her açılışta yer değiştirmesin.
  return hepsi.filter((s) => secilen.includes(s));
}

/**
 * Koşulu tutmayan replikleri atlayarak oynanabilir ilk düğümü bulur.
 * İçerik yazarken `atla` zinciri kurmak serbest; döngüye girmemesi için
 * ziyaret edilen düğümler tutuluyor.
 */
export function replikCoz(
  g: Gorusme,
  id: string | undefined,
  d: TelefonDurumu,
): Replik | undefined {
  const gorulen = new Set<string>();
  let su = id;
  while (su && !gorulen.has(su)) {
    gorulen.add(su);
    const r = g.replikler[su];
    if (!r) return undefined;
    if (kosulTutar(r.kosul, d)) return r;
    su = r.atla;
  }
  return undefined;
}

export function raunt(telefonVar: boolean) {
  return telefonVar ? RAUNT_TELEFON : RAUNT_ANKESOR;
}

export function ankesorKapanisi(g: Gorusme) {
  return g.ankesorKapanis ?? GENEL_ANKESOR_KAPANIS;
}

// ─────────────────────────────────────────── metin

export type MetinBaglami = {
  ad: string;
  kisi: string;
  gun: number;
  hafiza: Hafiza;
};

/**
 * {ad} {kisi} {gun} {kalan} {kalanYazi} {yas:isaret} {deger:isaret}
 * Bulunamayan işaret sessizce boş bırakılmaz — koşulu tutmayan bir replikte
 * kullanılmış demektir, geliştirme sırasında görünsün diye işaret adı kalır.
 */
export function metinDoldur(metin: string, c: MetinBaglami): string {
  return metin
    .replace(/\{ad\}/g, c.ad || 'evlat')
    .replace(/\{kisi\}/g, c.kisi)
    .replace(/\{gun\}/g, String(c.gun))
    .replace(/\{kalan\}/g, String(kalanGunSayisi(c.gun)))
    .replace(/\{kalanYazi\}/g, sayiYaziyla(kalanGunSayisi(c.gun)))
    .replace(/\{yas:([a-zA-Z_]+)\}/g, (t, ad: string) => {
      const k = c.hafiza[ad];
      return k ? sayiYaziyla(c.gun - k.gun) : t;
    })
    .replace(/\{deger:([a-zA-Z_]+)\}/g, (t, ad: string) => c.hafiza[ad]?.deger ?? t);
}

// ─────────────────────────────────────────── ihmal sarkması

/** Kanka en çabuk sarkar, anne en affedicidir, amcanı aramamak normaldir. */
const SARKMA_KATSAYI: Record<Rol, number> = {
  anne: 0.6,
  baba: 0.8,
  sevgili: 1.2,
  kanka: 1.4,
  kardes: 1.0,
  es: 1.0,
  akraba: 0.3,
};

export type SarkmaSonuc = {
  iliski: Partial<Record<Rol, number>>;
  gerilim: Partial<Record<Rol, number>>;
  /** 6 günü geçen sessizlikler işaretleniyor; kapanışta geri okunuyor. */
  isaretler: Rol[];
};

/**
 * Gün başında bir kez. Aranmayan her rol için ilişki düşer, gerilim birikir.
 * Üç gün eşiği önemli: orada karşı taraf artık seni aramaya başlıyor.
 */
export function ihmalSarkmasi(
  roller: Rol[],
  d: Pick<TelefonDurumu, 'gun' | 'sonArama'>,
): SarkmaSonuc {
  const sonuc: SarkmaSonuc = { iliski: {}, gerilim: {}, isaretler: [] };

  for (const rol of roller) {
    const fark = d.gun - (d.sonArama[rol] || 0);
    if (fark <= 1) continue;

    let dusus = 0;
    let gerilim = 0;
    if (fark === 2) {
      dusus = 1;
    } else if (fark === 3) {
      dusus = 3;
      gerilim = rol === 'sevgili' ? 8 : 4;
    } else if (fark <= 5) {
      dusus = 5;
      gerilim = 6;
    } else {
      dusus = 7;
      gerilim = 8;
      sonuc.isaretler.push(rol);
    }

    const k = SARKMA_KATSAYI[rol];
    sonuc.iliski[rol] = -Math.max(1, Math.round(dusus * k));
    if (gerilim) sonuc.gerilim[rol] = Math.round(gerilim * k);
  }

  return sonuc;
}

// ─────────────────────────────────────────── gelen arama

/** Kim ne sıklıkla kendisi arar. Baban neredeyse hiç aramaz, annen sürekli. */
const ARAMA_EGILIMI: Record<Rol, number> = {
  anne: 0.45,
  baba: 0.04,
  sevgili: 0.3,
  kanka: 0.15,
  kardes: 0.14,
  es: 0.3,
  akraba: 0.05,
};

const BANT_ARAMA: Record<Bant, number> = {
  yakin: 1.3,
  iyi: 1,
  mesafeli: 0.7,
  kirgin: 0.3,
  kopuk: 0,
};

/** Senaryonun sessiz bırakmayı seçtiği günler — boşluk da bir anlatı aracı. */
const SESSIZ_GUNLER: Partial<Record<Rol, number[]>> = {
  kanka: [1, 22],
};

/**
 * Gün başında tek bir arama kurası. Birden fazla kişi aynı akşam ararsa
 * serbest zaman telefon kuyruğuna dönüyor; en yüksek çıkan kazanıyor.
 */
export function gelenAramaKurasi(roller: Rol[], d: TelefonDurumu): Rol | null {
  let enIyi: { rol: Rol; puan: number } | null = null;

  for (const rol of roller) {
    if (SESSIZ_GUNLER[rol]?.includes(d.gun)) continue;
    if (rol === 'sevgili' && !d.sevgiliVar) continue;

    const fark = d.gun - (d.sonArama[rol] || 0);
    const ihmal = fark >= 3 ? 2 : 1;
    const sans = ARAMA_EGILIMI[rol] * BANT_ARAMA[bant(d.iliski[rol])] * ihmal;
    if (sans <= 0) continue;

    const puan = Math.random() * sans;
    if (!enIyi || puan > enIyi.puan) enIyi = { rol, puan };
  }

  // Eşik: kura kazananın gerçekten araması için yeterince yüksek çıkmalı.
  return enIyi && enIyi.puan > 0.12 ? enIyi.rol : null;
}
