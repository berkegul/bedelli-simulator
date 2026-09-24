import { acikSahne, gunGetir } from '../content';
import { gunlukEsyaEtkisi } from '../content/esyalar';
import { applyEffect } from '../engine/stats';
import { kaydet } from '../engine/save';
import { blokSonu, dakikaya, sahneSaati } from '../engine/zaman';
import type { Effect, Envanter, KayitRolu, RehberKisi, Rol } from '../engine/types';
import {
  ROL_ADI,
  TUM_ROLLER,
  eskiTurdenRol,
  gelenAramaKurasi,
  gunGorusmesi,
  ihmalSarkmasi,
  iliskiUygula,
  kayittanRolSec,
  metinDoldur,
  raunt,
  replikCoz,
  type Gorusme,
  type Hafiza,
  type Replik,
  type TelefonDurumu,
} from '../content/telefon';
import type { AktifGorusme, Store } from './tipler';

// ─────────────────────────────────────────── telefon yardımcıları

export const kirp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Rehberdeki hangi kayıt bu rolü konuşturur. */
export function rolunKaydi(get: () => Store, rol: Rol): RehberKisi | undefined {
  const hedef: KayitRolu = rol === 'anne' || rol === 'baba' ? 'ev' : (rol as KayitRolu);
  return get().rehber.find((k) => (k.rol ?? eskiTurdenRol(k.tur)) === hedef);
}

/** Rehberde karşılığı olan roller; kimse eklenmemişse motor boşa çalışmaz. */
export function aktifRoller(get: () => Store): Rol[] {
  const s = get();
  return TUM_ROLLER.filter((rol) => {
    if (rol === 'sevgili' && !s.sevgiliVar) return false;
    return !!rolunKaydi(get, rol);
  });
}

export function telefonDurumu(get: () => Store): TelefonDurumu {
  const s = get();
  return {
    gun: s.gun,
    iliski: s.iliski,
    gerilim: s.gerilim,
    ozlem: s.ozlem,
    moral: s.stats.moral,
    disiplin: s.stats.disiplin,
    hafiza: s.hafiza,
    gorulmus: s.gorulmusGorusmeler,
    telefonVar: (s.envanter.kamerasizTelefon?.adet ?? 0) > 0,
    sigaraIcen: s.profil.sigaraIciyor,
    sevgiliVar: s.sevgiliVar,
    sonArama: s.sonArama,
  };
}

/** Transkriptte görünen ad: ev kaydında "Annen"/"Baban", diğerlerinde kişinin adı. */
export function konusanAdi(get: () => Store, rol: Rol): string {
  if (rol === 'anne' || rol === 'baba') return ROL_ADI[rol];
  return rolunKaydi(get, rol)?.ad ?? ROL_ADI[rol];
}

/**
 * Seçeneksiz replikleri (anlatıcı araları, tek cümlelik geçişler) zincirleme
 * okur ve ilk seçenekli düğümde durur. Durmazsa görüşme kapanıyor demektir.
 */
export function zinciriYurut(
  gorusme: Gorusme,
  baslangic: Replik,
  durum: TelefonDurumu,
  baglam: { ad: string; kisi: string; gun: number; hafiza: Hafiza },
  get: () => Store,
  rol: Rol,
) {
  const gecmis: AktifGorusme['gecmis'] = [];
  const gorulen = new Set<string>();
  let su: Replik | undefined = baslangic;

  while (su && !gorulen.has(su.id)) {
    gorulen.add(su.id);
    const kim = su.kim === 'anlatici' ? '' : konusanAdi(get, (su.kim as Rol) ?? rol);
    gecmis.push({ kim, metin: metinDoldur(su.metin, baglam) });
    if (su.secenekler?.length) return { replik: su, gecmis };
    su = su.sonraki ? replikCoz(gorusme, su.sonraki, durum) : undefined;
  }
  return { replik: undefined, gecmis };
}

export function gorusmeAc(
  set: (p: Partial<Store>) => void,
  get: () => Store,
  kisiId: string,
  gelen: boolean,
): boolean {
  const kisi = get().rehber.find((k) => k.id === kisiId);
  if (!kisi) return false;

  const durum = telefonDurumu(get);
  const kayit: KayitRolu = kisi.rol ?? eskiTurdenRol(kisi.tur);
  const rol = kayittanRolSec(kayit, durum);
  const gorusme = gunGorusmesi(rol, durum);
  if (!gorusme) {
    uygulaEtki(set, get, {}, 'Telefon çaldı, çaldı, kimse açmadı.', 0, false);
    return false;
  }

  const telefonVar = durum.telefonVar;
  const baglam = { ad: get().profil.ad, kisi: kisi.ad, gun: get().gun, hafiza: get().hafiza };
  const kok = replikCoz(gorusme, gorusme.kok, durum);
  if (!kok) return false;

  const { replik, gecmis } = zinciriYurut(gorusme, kok, durum, baglam, get, rol);

  set({
    aktifGorusme: {
      kisiId,
      gorusmeId: gorusme.id,
      rol,
      replikId: replik?.id ?? gorusme.kok,
      gecmis,
      ankesor: !telefonVar && !gelen,
      kalanRaunt: raunt(telefonVar),
      birikenIliski: {},
      birikenGerilim: {},
      birikenMoral: 0,
      birikenEnerji: 0,
      birikenOzlem: 0,
      isaretler: [],
      gelen,
      kapanis: replik ? null : gorusme.kapanis,
    },
    panel: 'gorusme',
    sonArama: { ...get().sonArama, [rol]: get().gun },
    rehber: get().rehber.map((k) => (k.id === kisiId ? { ...k, sonArananGun: get().gun } : k)),
  });
  persist(get);
  return true;
}

/**
 * Görüşme kapanışı: biriken her şey burada tek seferde işleniyor.
 * Ankesör hem kırk dakika hem on lira yakıyor; kendi telefonun neredeyse
 * bedava — çarşıdaki o kalemin asıl karşılığı bu.
 */
export function gorusmeBitir(set: (p: Partial<Store>) => void, get: () => Store, g: AktifGorusme) {
  const s = get();
  const iliski = { ...s.iliski };
  for (const [rol, puan] of Object.entries(g.birikenIliski)) {
    iliski[rol as Rol] = iliskiUygula(iliski[rol as Rol], puan ?? 0);
  }
  const gerilim = { ...s.gerilim };
  for (const [rol, puan] of Object.entries(g.birikenGerilim)) {
    gerilim[rol as Rol] = kirp(gerilim[rol as Rol] + (puan ?? 0));
  }

  const hafiza: Hafiza = { ...s.hafiza };
  for (const isaret of g.isaretler) hafiza[isaret.ad] = { deger: isaret.deger, gun: s.gun };

  const kullanilan = Math.max(1, raunt(!g.ankesor) - g.kalanRaunt);
  const sure = g.gelen ? 6 : g.ankesor ? 40 + kullanilan * 2 : 4 + kullanilan * 2;

  set({
    iliski,
    gerilim,
    hafiza,
    // Duygusal anlar özlemi kışkırtıyor; yarım ağırlıkla, yoksa tek bir
    // konuşma sayacı tavana vurduruyor.
    ozlem: kirp(s.ozlem + Math.round(g.birikenOzlem / 2)),
    gorulmusGorusmeler: s.gorulmusGorusmeler.includes(g.gorusmeId)
      ? s.gorulmusGorusmeler
      : [...s.gorulmusGorusmeler, g.gorusmeId],
    aktifGorusme: null,
  });

  uygulaEtki(
    set,
    get,
    {
      moral: g.birikenMoral,
      enerji: g.birikenEnerji - (g.ankesor ? 8 : 3),
      para: g.ankesor ? -10 : 0,
    },
    g.kapanis ?? 'Telefonu kapattın.',
    sure,
    false,
  );
}

/**
 * Gün başı telefon işleri: aranmayan ilişkiler sarkıyor, karşı taraf
 * belirli bir noktadan sonra seni arıyor. Telefonun yoksa arayamazlar —
 * nöbetçi haber veriyor, geri araman gerekiyor.
 */
export function gunBasiTelefon(set: (p: Partial<Store>) => void, get: () => Store) {
  const roller = aktifRoller(get);
  if (!roller.length) return;

  const durum = telefonDurumu(get);
  const sarkma = ihmalSarkmasi(roller, durum);

  const iliski = { ...get().iliski };
  for (const [rol, puan] of Object.entries(sarkma.iliski)) {
    iliski[rol as Rol] = iliskiUygula(iliski[rol as Rol], puan ?? 0);
  }
  const gerilim = { ...get().gerilim };
  for (const [rol, puan] of Object.entries(sarkma.gerilim)) {
    gerilim[rol as Rol] = kirp(gerilim[rol as Rol] + (puan ?? 0));
  }
  const hafiza: Hafiza = { ...get().hafiza };
  for (const rol of sarkma.isaretler) {
    hafiza.uzun_sessizlik = { deger: rol, gun: get().gun };
  }

  const arayan = gelenAramaKurasi(roller, telefonDurumu(get));
  const kisi = arayan ? rolunKaydi(get, arayan) : undefined;
  const telefonVar = durum.telefonVar;

  // Özlem yalnızlıktan büyüyor, alışmayla sönüyor. İçerik 28 günde ~165
  // puan üretiyor ve hiç boşalmasa herkes tavana vuruyordu; günlük sönüm
  // sayacı anlamlı tutuyor. Alışma finali buna bakıyor.
  const ihmalEdilen = roller.filter((rol) => get().gun - (get().sonArama[rol] || 0) >= 2);
  const ozlemArtisi = (ihmalEdilen.length >= 2 ? 4 : ihmalEdilen.length === 1 ? 2 : 0) - 2;

  set({
    iliski,
    gerilim,
    hafiza,
    ozlem: kirp(get().ozlem + ozlemArtisi),
    gelenArama: arayan && kisi && telefonVar ? { rol: arayan, kisiId: kisi.id } : null,
    bekleyenArama: arayan && kisi && !telefonVar ? [arayan] : [],
  });
}

/** Etkiyi uygular, sonuç kartını hazırlar ve kaydeder — tek yerden. */
export function uygulaEtki(
  set: (p: Partial<Store>) => void,
  get: () => Store,
  effect: Effect,
  metin: string,
  /** Eylemin kaç dakika sürdüğü; saat kadar ilerler. */
  sure = 0,
  /** Sonuç kartı kapanınca sahne ilerlesin mi? Cep işlerinde ilerlemez. */
  ilerletme = true,
) {
  const { stats, para, nikotin, dostluk, envanter } = get();
  const sonrasi = applyEffect(stats, para, effect);

  const yamalar: Partial<Store> = {
    stats: sonrasi.stats,
    para: sonrasi.para,
    sonuc: { metin, delta: sonrasi.delta, ilerletme },
    panel: null,
  };

  if (sure > 0) yamalar.saat = ilerletilmisSaat(get, sure);

  if (effect.nikotin !== undefined) {
    yamalar.nikotin = Math.max(0, Math.min(100, nikotin + effect.nikotin));
  }
  if (effect.dostluk) {
    yamalar.dostluk = {
      ...dostluk,
      [effect.dostluk.kim]: (dostluk[effect.dostluk.kim] ?? 0) + effect.dostluk.puan,
    };
  }
  if (effect.esya) {
    const { id, adet } = effect.esya;
    const mevcut = envanter[id];
    const yeniAdet = (mevcut?.adet ?? 0) + adet;
    const yeni: Envanter = { ...envanter };
    if (yeniAdet <= 0) delete yeni[id];
    else yeni[id] = { adet: yeniAdet, kalite: mevcut?.kalite ?? 'standart' };
    yamalar.envanter = yeni;
  }

  set(yamalar);
  persist(get);
}

/** Bir eylemin süresi; blok bitişini aşmaz, gün bir anda ertesi güne kaymaz. */
export function ilerletilmisSaat(get: () => Store, dakika: number) {
  const { gun, blokIndex, saat } = get();
  const blok = gunGetir(gun)?.blocks[blokIndex];
  if (!blok) return saat + dakika;
  return Math.min(blokSonu(blok), saat + dakika);
}

/** Kayıttan dönerken ya da güne başlarken saatin doğal karşılığı. */
export function sahneninSaati(gun: number, blokIndex: number, sahneIndex: number) {
  const blok = gunGetir(gun)?.blocks[blokIndex];
  return blok ? sahneSaati(blok, sahneIndex) : dakikaya('05:30');
}

/** Sigara krizi büyüdükçe moral ve dikkat gider. */
export function krizCezasi(set: (p: Partial<Store>) => void, get: () => Store) {
  const { nikotin, profil, stats } = get();
  if (!profil.sigaraIciyor || nikotin < 55) return;
  const siddet = nikotin >= 85 ? 3 : 1;
  set({
    stats: {
      ...stats,
      moral: Math.max(0, stats.moral - siddet),
      disiplin: Math.max(0, stats.disiplin - Math.round(siddet / 2)),
    },
  });
}

/** Gün başında dolaptaki eşyaların 28 güne yayılan karşılığı. */
export function gunlukDolapEtkisi(set: (p: Partial<Store>) => void, get: () => Store) {
  const { envanter, stats, para } = get();
  const { etki, satirlar } = gunlukEsyaEtkisi(envanter);
  const sonrasi = applyEffect(stats, para, etki);
  set({ stats: sonrasi.stats, para: sonrasi.para, dolapOzeti: satirlar });
}

/** Blok başında koşulu tutmayan sahneler varsa ilk açık sahneye geçer. */
export function ilkAcikSahneye(set: (p: Partial<Store>) => void, get: () => Store) {
  const { gun, blokIndex } = get();
  const blok = gunGetir(gun)?.blocks[blokIndex];
  if (!blok) return;
  const ilk = acikSahne(blok, 0, telefonDurumu(get)) ?? 0;
  if (ilk !== get().sahneIndex) set({ sahneIndex: ilk, saat: sahneSaati(blok, ilk) });
}

export function persist(get: () => Store) {
  const s = get();
  void kaydet({
    profil: s.profil,
    hazirlikBitti: s.hazirlikBitti,
    gun: s.gun,
    blokIndex: s.blokIndex,
    sahneIndex: s.sahneIndex,
    saat: s.saat,
    stats: s.stats,
    para: s.para,
    envanter: s.envanter,
    dolapDuzeni: s.dolapDuzeni,
    bekleyenKusurlar: s.bekleyenKusurlar,
    dostluk: s.dostluk,
    gorulmusDiyaloglar: s.gorulmusDiyaloglar,
    rehber: s.rehber,
    nikotin: s.nikotin,
    bitenGunler: s.bitenGunler,
    iliski: s.iliski,
    gerilim: s.gerilim,
    ozlem: s.ozlem,
    hafiza: s.hafiza,
    sonArama: s.sonArama,
    gorulmusGorusmeler: s.gorulmusGorusmeler,
    sevgiliVar: s.sevgiliVar,
    cepteIzmarit: s.cepteIzmarit,
    bugunIsteyenler: s.bugunIsteyenler,
    bugunDinlenildi: s.bugunDinlenildi,
    gelenArama: s.gelenArama,
    bekleyenArama: s.bekleyenArama,
    yarimGorusme: s.aktifGorusme,
  });
}
