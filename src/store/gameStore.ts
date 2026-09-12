import { create } from 'zustand';
import { GUNLER, gunGetir } from '../content';
import { arkadas, uygunDiyaloglar, type Diyalog } from '../content/arkadaslar';
import { ESYALAR, esya, fiyat, gunlukEsyaEtkisi } from '../content/esyalar';
import type { Yemek } from '../content/menu';
import {
  BASLANGIC_PARA,
  BASLANGIC_STATS,
  applyEffect,
  blokGecisi,
  gunNotu,
  uykudanSonra,
} from '../engine/stats';
import { kaydet, sil, yukle } from '../engine/save';
import { blokSonu, dakikaya, sahneSaati } from '../engine/zaman';
import { olayYaz } from '../engine/bulut';
import { sigaraIzni, telefonIzni } from '../engine/kurallar';
import type { DolapDuzeni, Kusur } from '../engine/types';
import { denetimSonucu } from '../content/denetim';
import {
  KAYIT_ADI,
  ROL_ADI,
  TUM_GORUSMELER,
  TUM_ROLLER,
  ankesorKapanisi,
  eskiTurdenRol,
  gelenAramaKurasi,
  gunGorusmesi,
  ihmalSarkmasi,
  iliskiUygula,
  kayittanRolSec,
  metinDoldur,
  raunt,
  replikCoz,
  secenekleriHazirla,
  type Gorusme,
  type Hafiza,
  type Replik,
  type TelefonDurumu,
} from '../content/telefon';
import type {
  ArkadasId,
  Choice,
  Effect,
  Envanter,
  EsyaId,
  KayitRolu,
  Kalite,
  Profil,
  RehberKisi,
  Rol,
  Scene,
  Stats,
  YakinlikTuru,
} from '../engine/types';
import { gunOynanabilirMi } from '../monetization/entitlements';
import { havaDurumu, havaEtkisi } from '../engine/hava';
import { yonelme } from '../engine/turkce';

export type Ekran =
  | 'acilis'
  | 'menu'
  | 'profil'
  | 'carsi'
  | 'gunBasi'
  | 'oyun'
  | 'gunSonu'
  | 'kilit'
  | 'icerikSonu'
  | 'gelistirme';

/** Oyun ekranının üstüne açılan panel — sahne akışını bozmadan geri dönülür. */
export type Panel = null | 'kantin' | 'dolap' | 'rehber' | 'muhabbet' | 'sigaraIstegi' | 'ant41' | 'oturma' | 'cep' | 'izmarit' | 'izmaritCezasi' | 'gorusme';

/**
 * Süren görüşmenin imleci. Etkiler anında uygulanmıyor, burada birikiyor:
 * oyuncu konuşurken üstteki çubukların oynamasına bakıp seçim yapmasın diye.
 */
export type AktifGorusme = {
  kisiId: string;
  gorusmeId: string;
  /** Şu an konuşan; 'ev' kaydında görüşme ortasında değişebilir. */
  rol: Rol;
  replikId: string;
  /** Transkript: baştan beri söylenenler. */
  gecmis: { kim: string; metin: string; ben?: boolean }[];
  ankesor: boolean;
  kalanRaunt: number;
  birikenIliski: Partial<Record<Rol, number>>;
  birikenGerilim: Partial<Record<Rol, number>>;
  birikenMoral: number;
  birikenEnerji: number;
  birikenOzlem: number;
  isaretler: { ad: string; deger: string }[];
  /** Karşı taraf aradıysa kontör yakmıyor ve açılış farklı. */
  gelen: boolean;
  /** Görüşme bittiğinde dolan kapanış cümlesi; dolunca seçenek kalmaz. */
  kapanis: string | null;
};

const BOS_ROL_SAYISI = (): Record<Rol, number> => ({
  anne: 0, baba: 0, sevgili: 0, kanka: 0, kardes: 0, es: 0, akraba: 0,
});

/** Başlangıç ilişkileri: annenle zaten yakınsın, babanla mesafe var. */
const BASLANGIC_ILISKI: Record<Rol, number> = {
  anne: 75, baba: 60, sevgili: 70, kanka: 70, kardes: 65, es: 75, akraba: 55,
};

export type Sonuc = {
  metin: string;
  delta: Partial<Stats> & { para?: number };
  /**
   * Kart kapanınca sahne ilerlesin mi? Sahnenin kendi sonucu ilerletir;
   * cepten yapılan iş (sigara, telefon, eşya) ilerletmez — yoksa sigara
   * yakmak o anki görevi atlıyordu.
   */
  ilerletme?: boolean;
};

/** Sigara içen oyuncuda her blokta biriken kriz. */
const NIKOTIN_ARTIS = 9;

const BOS_DOSTLUK: Record<ArkadasId, number> = { emre: 0, tolga: 0, serkan: 0 };

export type Store = {
  ekran: Ekran;
  panel: Panel;
  hazir: boolean;
  kayitVar: boolean;

  profil: Profil;
  hazirlikBitti: boolean;
  gun: number;
  blokIndex: number;
  sahneIndex: number;
  /** Gün içindeki saat, gece yarısından beri dakika. Üst şeritte akar. */
  saat: number;
  stats: Stats;
  para: number;
  envanter: Envanter;
  /** İlk gün dolaba ne nereye kondu. Dördüncü gün denetimi buna bakıyor. */
  dolapDuzeni: DolapDuzeni | null;
  /** Sabah ya da gece rutininden kalan, içtimada/yoklamada bakılacak işler. */
  bekleyenKusurlar: Kusur[];
  dostluk: Record<ArkadasId, number>;
  gorulmusDiyaloglar: string[];
  rehber: RehberKisi[];
  nikotin: number;
  bitenGunler: { gun: number; not: string; puan: number }[];

  sonuc: Sonuc | null;
  miniAktif: boolean;
  /** Gün başında gösterilen dolap özeti. */
  dolapOzeti: string[];
  aktifDiyalog: Diyalog | null;
  /** Şu an senden sigara isteyen arkadaş. */
  aktifIstek: ArkadasId | null;
  /** Aynı gün aynı kişi ikinci kez istemesin. */
  bugunIsteyenler: ArkadasId[];
  /** Gölgede dinlenme günde bir kez. */
  bugunDinlenildi: boolean;
  /** Cepte biriken izmarit; yere atmak yerine saklayınca artıyor. */
  cepteIzmarit: number;
  /** Süren telefon görüşmesi. */
  aktifGorusme: AktifGorusme | null;
  /** Oynanmış görüşme id'leri; omurga beat'leri tekrar etmesin diye. */
  gorulmusGorusmeler: string[];
  /** Rol başına ilişki (0-100) ve gerilim (0-100). */
  iliski: Record<Rol, number>;
  gerilim: Record<Rol, number>;
  /** Ev özlemi; gün sonu ve final kartları buna bakıyor. */
  ozlem: number;
  /** Oyuncunun söyledikleri ve başına gelenler — işaret + konduğu gün. */
  hafiza: Hafiza;
  /** Rol başına en son arandığı gün. */
  sonArama: Record<Rol, number>;
  /** Oyuncunun sevgilisi var mı — kurulumda soruluyor. */
  sevgiliVar: boolean;
  /** Bugün seni arayan; serbest blokta açılabilir. */
  gelenArama: { rol: Rol; kisiId: string } | null;
  /** Telefonun yokken gelen aramalar: nöbetçi haber veriyor, sen geri arıyorsun. */
  bekleyenArama: Rol[];
  /**
   * Geliştirme alanından bir yere atlandı mı. Doğruysa ekranın üstünde
   * geri dönüş rozeti duruyor; oyunun kendi akışına dokunmuyor.
   */
  gelistirmeDonus: boolean;

  ilkYukleme: () => Promise<void>;
  yeniOyun: () => Promise<void>;
  profilKaydet: (ad: string, sigaraIciyor: boolean) => void;
  kisiEkle: (ad: string, yakinlik: string, rol: KayitRolu) => void;
  sevgiliVarMi: (v: boolean) => void;
  gorusmeCevapla: (index: number) => void;
  gorusmeKapat: () => void;
  gelenAramayiAc: () => void;
  gelenAramayiGecistir: () => void;
  kisiSil: (id: string) => void;
  carsiyiBitir: () => void;
  devamEt: () => void;
  anaMenu: () => void;
  gelistirmeAc: () => void;
  gelistirmeyeDon: () => void;
  /** Geliştirme alanından oyuna atlama; dönüş rozetini de kuruyor. */
  gelistirmeAtla: (p: Partial<Store>) => void;
  gunuBaslat: () => void;
  ileri: () => void;
  secimYap: (c: Choice) => void;
  /** Dolap yerleşimi bitti: düzen kayda geçer, seçimin etkisi uygulanır. */
  dolapKapat: (c: Choice, duzen: DolapDuzeni) => void;
  /** Denetim bitti: kusurlar ve varsa şınav skoru etkiye çevrilir, liste boşalır. */
  denetimBitir: (cezaSkoru: number | null) => void;
  miniBaslat: () => void;
  miniBitir: (score: number) => void;
  sonucuKapat: () => void;
  sonrakiGun: () => void;
  sifirla: () => Promise<void>;

  panelAc: (p: Panel) => void;
  satinAl: (id: EsyaId, kalite: Kalite) => boolean;
  esyaKullan: (id: EsyaId) => void;
  yemekYe: (secilen: Yemek[]) => void;
  kisiAra: (id: string) => void;
  muhabbetBaslat: () => void;
  diyalogSec: (index: number) => void;
  arkadasaGit: (id: ArkadasId) => void;
  sigaraVer: (ver: boolean) => void;
  golgedeDinlen: () => void;
  yoldaVar: () => void;
  sigaraIc: () => void;
  izmaritKarar: (yereAt: boolean) => void;
  izmaritCezasiBitir: () => void;
  izmaritAt: () => void;
};

const ilkDurum = {
  panel: null as Panel,
  profil: { ad: '', sigaraIciyor: false } as Profil,
  hazirlikBitti: false,
  gun: 1,
  blokIndex: 0,
  sahneIndex: 0,
  saat: dakikaya('05:30'),
  stats: { ...BASLANGIC_STATS },
  para: BASLANGIC_PARA,
  envanter: {} as Envanter,
  dolapDuzeni: null as DolapDuzeni | null,
  bekleyenKusurlar: [] as Kusur[],
  dostluk: { ...BOS_DOSTLUK },
  gorulmusDiyaloglar: [] as string[],
  rehber: [] as RehberKisi[],
  nikotin: 0,
  bitenGunler: [] as { gun: number; not: string; puan: number }[],
  sonuc: null as Sonuc | null,
  miniAktif: false,
  dolapOzeti: [] as string[],
  aktifDiyalog: null as Diyalog | null,
  aktifIstek: null as ArkadasId | null,
  bugunIsteyenler: [] as ArkadasId[],
  bugunDinlenildi: false,
  cepteIzmarit: 0,
  aktifGorusme: null as AktifGorusme | null,
  gorulmusGorusmeler: [] as string[],
  iliski: { ...BASLANGIC_ILISKI },
  gerilim: BOS_ROL_SAYISI(),
  ozlem: 20,
  hafiza: {} as Hafiza,
  sonArama: BOS_ROL_SAYISI(),
  sevgiliVar: true,
  gelenArama: null as { rol: Rol; kisiId: string } | null,
  bekleyenArama: [] as Rol[],
  gelistirmeDonus: false,
};

export const useGame = create<Store>((set, get) => ({
  ekran: 'acilis',
  hazir: false,
  kayitVar: false,
  ...ilkDurum,

  async ilkYukleme() {
    const k = await yukle();
    if (!k) {
      set({ hazir: true, kayitVar: false, ekran: 'menu' });
      return;
    }
    set({
      hazir: true,
      kayitVar: true,
      ekran: 'menu',
      profil: k.profil,
      hazirlikBitti: k.hazirlikBitti,
      gun: k.gun,
      blokIndex: k.blokIndex,
      sahneIndex: k.sahneIndex,
      saat: k.saat ?? sahneninSaati(k.gun, k.blokIndex, k.sahneIndex),
      stats: k.stats,
      para: k.para,
      envanter: k.envanter ?? {},
      dolapDuzeni: k.dolapDuzeni ?? null,
      bekleyenKusurlar: k.bekleyenKusurlar ?? [],
      dostluk: { ...BOS_DOSTLUK, ...(k.dostluk ?? {}) },
      gorulmusDiyaloglar: k.gorulmusDiyaloglar ?? [],
      rehber: (k.rehber ?? []).map((kisi) => ({
        ...kisi,
        // v2 kayıtlarında rol yok, eski türden türetiliyor.
        rol: kisi.rol ?? eskiTurdenRol(kisi.tur),
      })),
      iliski: { ...BASLANGIC_ILISKI, ...(k.iliski ?? {}) },
      gerilim: { ...BOS_ROL_SAYISI(), ...(k.gerilim ?? {}) },
      ozlem: k.ozlem ?? 20,
      hafiza: k.hafiza ?? {},
      sonArama: { ...BOS_ROL_SAYISI(), ...(k.sonArama ?? {}) },
      gorulmusGorusmeler: k.gorulmusGorusmeler ?? [],
      sevgiliVar: k.sevgiliVar ?? true,
      nikotin: k.nikotin ?? 0,
      bitenGunler: k.bitenGunler ?? [],
    });
  },

  async yeniOyun() {
    await sil();
    set({ ...ilkDurum, kayitVar: false, ekran: 'profil' });
  },

  profilKaydet(ad, sigaraIciyor) {
    set({ profil: { ad: ad.trim() || 'Er', sigaraIciyor }, ekran: 'carsi' });
    persist(get);
  },

  kisiEkle(ad, yakinlik, rol) {
    const temiz = ad.trim();
    if (!temiz) return;
    // Ev tek satır: annen de baban da aynı numaradan açar.
    if (rol === 'ev' && get().rehber.some((k) => k.rol === 'ev')) return;
    set({
      rehber: [
        ...get().rehber,
        {
          id: `k${Date.now()}${Math.floor(Math.random() * 1000)}`,
          ad: temiz,
          yakinlik: yakinlik.trim() || KAYIT_ADI[rol],
          rol,
        },
      ],
    });
    persist(get);
  },

  sevgiliVarMi(v) {
    set({ sevgiliVar: v });
    if (!v) set({ rehber: get().rehber.filter((k) => k.rol !== 'sevgili') });
    persist(get);
  },

  kisiSil(id) {
    set({ rehber: get().rehber.filter((k) => k.id !== id) });
    persist(get);
  },

  carsiyiBitir() {
    const { para, envanter, profil } = get();
    void olayYaz('carsi_bitti', {
      kalanPara: para,
      alinan: Object.keys(envanter).length,
      sigaraIciyor: profil.sigaraIciyor,
    });
    set({ hazirlikBitti: true, ekran: 'gunBasi' });
    gunlukDolapEtkisi(set, get);
    gunBasiTelefon(set, get);
    persist(get);
  },

  devamEt() {
    const { gun, bitenGunler, hazirlikBitti, profil } = get();
    if (!profil.ad) {
      set({ ekran: 'profil' });
      return;
    }
    if (!hazirlikBitti) {
      set({ ekran: 'carsi' });
      return;
    }
    // Gün zaten kapanmışsa oyuncuyu son sahneye geri atma — o sahneyi tekrar
    // oynatıp yeniden gün sonuna çıkarıyor, çıkışı olmayan bir döngü oluyordu.
    if (bitenGunler.some((b) => b.gun === gun)) {
      get().sonrakiGun();
      return;
    }
    set({
      ekran: gunOynanabilirMi(gun) ? 'oyun' : 'kilit',
      sonuc: null,
      miniAktif: false,
      panel: null,
      saat: sahneninSaati(gun, get().blokIndex, get().sahneIndex),
    });
  },

  anaMenu() {
    set({ ekran: 'menu', panel: null, gelistirmeDonus: false });
  },

  gelistirmeAc() {
    set({ ekran: 'gelistirme', panel: null, gelistirmeDonus: false });
  },

  gelistirmeyeDon() {
    set({
      ekran: 'gelistirme',
      panel: null,
      sonuc: null,
      miniAktif: false,
      aktifGorusme: null,
      aktifDiyalog: null,
      gelistirmeDonus: false,
    });
  },

  gelistirmeAtla(p) {
    set({ ...p, gelistirmeDonus: true, panel: null, sonuc: null, miniAktif: false });
  },

  gunuBaslat() {
    const { gun, blokIndex, sahneIndex } = get();
    set({
      ekran: 'oyun',
      sonuc: null,
      miniAktif: false,
      panel: null,
      saat: sahneninSaati(gun, blokIndex, sahneIndex),
    });
  },

  ileri() {
    const { gun, blokIndex, sahneIndex, profil } = get();
    const gunData = gunGetir(gun);
    if (!gunData) return;

    const blok = gunData.blocks[blokIndex];
    if (sahneIndex + 1 < blok.scenes.length) {
      set({
        sahneIndex: sahneIndex + 1,
        sonuc: null,
        miniAktif: false,
        // Sahne ilerledi, saat de ilerler. Bu blokta eylemlerle kazanılmış
        // fazladan dakikalar varsa geri alınmaz — saat geriye akmaz.
        saat: Math.min(blokSonu(blok), Math.max(get().saat, sahneSaati(blok, sahneIndex + 1))),
      });
    } else if (blokIndex + 1 < gunData.blocks.length) {
      // Blok değişimi zamanın geçmesi demek: acıkırsın, sigara krizi büyür.
      set({
        blokIndex: blokIndex + 1,
        sahneIndex: 0,
        sonuc: null,
        miniAktif: false,
        saat: dakikaya(gunData.blocks[blokIndex + 1].from),
        stats: blokGecisi(get().stats),
        nikotin: profil.sigaraIciyor ? Math.min(100, get().nikotin + NIKOTIN_ARTIS) : 0,
      });
      krizCezasi(set, get);
    } else {
      const { stats, bitenGunler } = get();
      const not = gunNotu(stats);
      // Asıl merak edilen: oyuncular hangi günde bırakıyor.
      void olayYaz('gun_bitti', { gun, not: not.ad, puan: not.puan });
      set({
        ekran: 'gunSonu',
        sonuc: null,
        miniAktif: false,
        panel: null,
        bitenGunler: [...bitenGunler.filter((b) => b.gun !== gun), { gun, not: not.ad, puan: not.puan }].sort(
          (a, b) => a.gun - b.gun,
        ),
      });
    }
    persist(get);
  },

  secimYap(c) {
    uygulaEtki(set, get, c.effect, c.outcome);
  },

  dolapKapat(c, duzen) {
    // Önce düzen: uygulaEtki kaydı yazarken düzen de onunla birlikte gidiyor.
    set({ dolapDuzeni: duzen });
    uygulaEtki(set, get, c.effect, c.outcome);
  },

  denetimBitir(cezaSkoru) {
    const { etki, metin } = denetimSonucu(get().bekleyenKusurlar, cezaSkoru);
    set({ bekleyenKusurlar: [] });
    uygulaEtki(set, get, etki, metin);
  },

  miniBaslat() {
    set({ miniAktif: true });
  },

  miniBitir(score) {
    const { gun, blokIndex, sahneIndex } = get();
    const sahne = gunGetir(gun)?.blocks[blokIndex]?.scenes[sahneIndex];
    if (!sahne || sahne.kind !== 'mini') return;
    set({ miniAktif: false });
    // Sabah ve gece rutinleri hemen değil, içtimada/yoklamada denetleniyor.
    // Aynı iş iki kez yapılırsa (geliştirmeden tekrar) son sonuç geçerli.
    if (sahne.denetimde) {
      set({
        bekleyenKusurlar: [
          ...get().bekleyenKusurlar.filter((k) => k.kaynak !== sahne.game),
          { kaynak: sahne.game, puan: score },
        ],
      });
    }
    uygulaEtki(set, get, sahne.reward(score), sahne.verdict(score));
  },

  sonucuKapat() {
    // Cepten yapılan iş sahneyi ilerletmez: sigara yakmak içtimayı atlamaz.
    // Serbest zamanda da hiçbir şey ilerletmez; günü bitiren tek şey
    // "Yat, gün bitsin".
    const { gun, blokIndex, sahneIndex, sonuc } = get();
    const sahne = gunGetir(gun)?.blocks[blokIndex]?.scenes[sahneIndex];
    if (sonuc?.ilerletme === false || sahne?.kind === 'serbest') {
      set({ sonuc: null });
      return;
    }
    get().ileri();
  },

  sonrakiGun() {
    const { gun, stats } = get();
    const hedef = gun + 1;

    if (!gunGetir(hedef)) {
      set({ ekran: 'icerikSonu' });
      return;
    }
    if (!gunOynanabilirMi(hedef)) {
      void olayYaz('kilit_gorundu', { gun: hedef });
      set({ ekran: 'kilit' });
      return;
    }
    set({
      gun: hedef,
      blokIndex: 0,
      sahneIndex: 0,
      saat: sahneninSaati(hedef, 0, 0),
      stats: uykudanSonra(stats),
      sonuc: null,
      miniAktif: false,
      panel: null,
      ekran: 'gunBasi',
      bugunIsteyenler: [],
      bugunDinlenildi: false,
      nikotin: get().profil.sigaraIciyor ? Math.min(100, get().nikotin + 15) : 0,
      gelenArama: null,
      bekleyenArama: [],
      // Dünden denetlenmemiş iş kalmışsa yeni güne taşınmıyor.
      bekleyenKusurlar: [],
    });
    gunlukDolapEtkisi(set, get);
    gunBasiTelefon(set, get);
    persist(get);
  },

  async sifirla() {
    await sil();
    set({ ...ilkDurum, kayitVar: false, ekran: 'menu' });
  },

  panelAc(p) {
    set({ panel: p, aktifDiyalog: p === 'muhabbet' ? get().aktifDiyalog : null });
  },

  satinAl(id, kalite) {
    const t = esya(id);
    const { para, envanter } = get();
    const tutar = fiyat(t, kalite);
    const mevcut = envanter[id];
    const adet = mevcut?.adet ?? 0;

    if (para < tutar) return false;
    if (t.maxAdet !== undefined && adet >= t.maxAdet) return false;

    // Sigara pakette satılır ama dal dal harcanır: bir alışveriş 20 dal ekler.
    const eklenen = t.birimAdet ?? 1;
    set({
      para: para - tutar,
      // Kademeli eşyada son alınan kalite geçerli olur; oyuncu isterse yükseltir.
      envanter: {
        ...envanter,
        [id]: { adet: Math.min(adet + eklenen, t.maxAdet ?? adet + eklenen), kalite },
      },
    });
    persist(get);
    return true;
  },

  esyaKullan(id) {
    // Sigara nereden içilirse içilsin aynı akıştan geçmeli: sonunda elinde
    // izmarit kalıyor ve onu ne yapacağına karar veriyorsun.
    if (id === 'sigara') {
      get().sigaraIc();
      return;
    }
    const t = esya(id);
    const { envanter } = get();
    const kayit = envanter[id];
    if (!kayit || kayit.adet <= 0 || !t.kullanimEtkisi) return;

    const kalan = t.tuketilir ? kayit.adet - 1 : kayit.adet;
    const yeni: Envanter = { ...envanter };
    if (kalan <= 0) delete yeni[id];
    else yeni[id] = { ...kayit, adet: kalan };

    set({ envanter: yeni });
    uygulaEtki(set, get, t.kullanimEtkisi, `${t.ad} kullandın.`, 0, false);
  },

  yemekYe(secilen) {
    if (!secilen.length) {
      uygulaEtki(set, get, { moral: -3 }, 'Tepsiye dokunmadın. Öğlene kadar bunu düşüneceksin.');
      return;
    }
    const toplam: Effect = {};
    for (const y of secilen) {
      toplam.tokluk = (toplam.tokluk ?? 0) + y.tokluk;
      if (y.kondisyon) toplam.kondisyon = (toplam.kondisyon ?? 0) + y.kondisyon;
      if (y.moral) toplam.moral = (toplam.moral ?? 0) + y.moral;
    }
    const adlar = secilen.map((y) => y.ad.toLocaleLowerCase('tr-TR')).join(', ');
    uygulaEtki(set, get, toplam, `Tepsiden ${adlar} yedin.`, 18);
  },

  /**
   * Arama. Kendi telefonun varsa kontör gerekmiyor — hattın sende, paket
   * senin. Kontör yalnızca ankesör için: telefonsuz kalanın tek yolu o.
   * Konuşmanın kendisi panelde geçiyor, kiminle konuştuğuna göre değişiyor.
   */
  kisiAra(id) {
    const { rehber, envanter, gun, blokIndex, miniAktif } = get();
    const kisi = rehber.find((k) => k.id === id);
    if (!kisi) return;

    const izin = telefonIzni(gunGetir(gun)?.blocks[blokIndex]?.id, miniAktif);
    if (!izin.olur) {
      uygulaEtki(set, get, {}, izin.sebep ?? 'Şimdi olmaz.', 0, false);
      return;
    }

    const telefonVar = (envanter.kamerasizTelefon?.adet ?? 0) > 0;
    const kontor = envanter.kontor?.adet ?? 0;

    // Ankesör kartı yalnızca kendi telefonu olmayan için gerekli.
    if (!telefonVar) {
      if (kontor <= 0) {
        uygulaEtki(
          set,
          get,
          { moral: -4 },
          'Ankesör kartın bitmiş. Kantinden almadan bu telefondan arayamazsın.',
          0,
          false,
        );
        return;
      }
      const yeniEnv: Envanter = { ...envanter };
      if (kontor - 1 <= 0) delete yeniEnv.kontor;
      else yeniEnv.kontor = { ...envanter.kontor!, adet: kontor - 1 };
      set({ envanter: yeniEnv });
    }

    gorusmeAc(set, get, id, false);
  },

  gelenAramayiAc() {
    const gelen = get().gelenArama;
    if (!gelen) return;
    set({ gelenArama: null });
    gorusmeAc(set, get, gelen.kisiId, true);
  },

  gelenAramayiGecistir() {
    const gelen = get().gelenArama;
    if (!gelen) return;
    // Açmamak da bir cevap. Ertesi günün açılışı bunu biliyor.
    const hafiza: Hafiza = {
      ...get().hafiza,
      cevapsiz: { deger: gelen.rol, gun: get().gun },
    };
    set({
      gelenArama: null,
      hafiza,
      iliski: { ...get().iliski, [gelen.rol]: Math.max(0, get().iliski[gelen.rol] - 3) },
      gerilim: { ...get().gerilim, [gelen.rol]: Math.min(100, get().gerilim[gelen.rol] + 5) },
    });
    persist(get);
  },

  gorusmeCevapla(index) {
    const g = get().aktifGorusme;
    if (!g || g.kapanis) return;

    const gorusme = TUM_GORUSMELER.find((x) => x.id === g.gorusmeId);
    if (!gorusme) return;

    const durum = telefonDurumu(get);
    const replik = gorusme.replikler[g.replikId];
    if (!replik) return;

    const secenekler = secenekleriHazirla(replik, durum, g.rol, g.ankesor);
    const secenek = secenekler[index];
    if (!secenek) return;

    const kisi = get().rehber.find((k) => k.id === g.kisiId);
    const baglam = {
      ad: get().profil.ad,
      kisi: kisi?.ad ?? '',
      gun: get().gun,
      hafiza: get().hafiza,
    };

    const gecmis = [...g.gecmis, { kim: 'Sen', metin: secenek.label, ben: true }];
    if (secenek.cevap) {
      gecmis.push({ kim: konusanAdi(get, g.rol), metin: metinDoldur(secenek.cevap, baglam) });
    }

    // Etki o an konuşan role işliyor; rolDegis'ten sonrası yeni role.
    const hedef = g.rol;
    const birikenIliski = { ...g.birikenIliski };
    const birikenGerilim = { ...g.birikenGerilim };
    const e = secenek.etki ?? {};
    if (e.iliski) birikenIliski[hedef] = (birikenIliski[hedef] ?? 0) + e.iliski;
    if (e.gerilim) birikenGerilim[hedef] = (birikenGerilim[hedef] ?? 0) + e.gerilim;
    if (e.digerIliski) {
      const d = e.digerIliski;
      birikenIliski[d.kim] = (birikenIliski[d.kim] ?? 0) + d.puan;
    }

    const isaretler = secenek.isaret ? [...g.isaretler, secenek.isaret] : g.isaretler;
    const kalanRaunt = g.kalanRaunt - 1;
    const yeniRol = secenek.rolDegis ?? g.rol;

    const ara: AktifGorusme = {
      ...g,
      rol: yeniRol,
      gecmis,
      kalanRaunt,
      birikenIliski,
      birikenGerilim,
      birikenMoral: g.birikenMoral + (e.moral ?? 0),
      birikenEnerji: g.birikenEnerji + (e.enerji ?? 0),
      birikenOzlem: g.birikenOzlem + (e.ozlem ?? 0),
      isaretler,
    };

    // Kuyruk seni kesiyor: ankesörde raunt bitince konuşma yarıda kalıyor.
    if (secenek.sonraki && kalanRaunt <= 0) {
      set({ aktifGorusme: { ...ara, kapanis: ankesorKapanisi(gorusme) } });
      return;
    }

    const sonraki = secenek.sonraki
      ? replikCoz(gorusme, secenek.sonraki, durum)
      : undefined;

    if (!sonraki) {
      set({ aktifGorusme: { ...ara, kapanis: gorusme.kapanis } });
      return;
    }

    // Seçeneksiz düğümler (anlatıcı araları) zincirleme okunur.
    const { replik: durak, gecmis: eklenen } = zinciriYurut(
      gorusme,
      sonraki,
      durum,
      baglam,
      get,
      yeniRol,
    );

    if (!durak) {
      set({
        aktifGorusme: {
          ...ara,
          gecmis: [...gecmis, ...eklenen],
          kapanis: gorusme.kapanis,
        },
      });
      return;
    }

    set({
      aktifGorusme: {
        ...ara,
        gecmis: [...gecmis, ...eklenen],
        replikId: durak.id,
      },
    });
  },

  gorusmeKapat() {
    const g = get().aktifGorusme;
    if (!g) {
      set({ panel: null });
      return;
    }
    gorusmeBitir(set, get, g);
  },

  muhabbetBaslat() {
    const { gun, dostluk, gorulmusDiyaloglar } = get();
    const havuz = uygunDiyaloglar(gun, dostluk, gorulmusDiyaloglar);
    if (!havuz.length) {
      set({ panel: 'muhabbet', aktifDiyalog: null });
      return;
    }
    set({ panel: 'muhabbet', aktifDiyalog: havuz[Math.floor(Math.random() * havuz.length)] });
  },

  /**
   * Haritada bir arkadaşa gidiyorsun. Sigara içen ve senden bugün henüz
   * istememiş biriyse dal isteyebilir; yoksa muhabbet açılır.
   */
  arkadasaGit(id) {
    const { gun, dostluk, gorulmusDiyaloglar, envanter, bugunIsteyenler } = get();
    const kisi = arkadas(id);
    const dal = envanter.sigara?.adet ?? 0;
    const havuz = uygunDiyaloglar(gun, dostluk, gorulmusDiyaloglar).filter((d) => d.kim === id);

    const isteyebilir = kisi.sigaraIcer && dal > 0 && !bugunIsteyenler.includes(id);
    // Muhabbet kalmadıysa kesin ister; kaldıysa arada bir.
    if (isteyebilir && (havuz.length === 0 || Math.random() < 0.45)) {
      set({ panel: 'sigaraIstegi', aktifIstek: id, aktifDiyalog: null });
      return;
    }
    set({
      panel: 'muhabbet',
      aktifIstek: null,
      aktifDiyalog: havuz.length ? havuz[Math.floor(Math.random() * havuz.length)] : null,
    });
  },

  /**
   * Yürüyüş bitti. Havanın bedeli burada ödeniyor — yağmurda yürümek
   * bedava değil, açık havada yürümek iyi geliyor. Etki sessiz uygulanıyor,
   * sonuç kartı çıkarmıyor: her yolda kart göstermek akışı boğuyordu.
   */
  yoldaVar() {
    const { gun, blokIndex, stats, para } = get();
    const etki = havaEtkisi(havaDurumu(gun, blokIndex));
    if (Object.keys(etki).length) {
      const sonrasi = applyEffect(stats, para, etki);
      set({ stats: sonrasi.stats, para: sonrasi.para });
    }
    get().ileri();
  },

  /** Avludaki ağacın altında kısa mola. Günde bir kez işe yarıyor. */
  golgedeDinlen() {
    if (get().bugunDinlenildi) {
      uygulaEtki(
        set,
        get,
        {},
        'Bugün zaten oturdun. İkinci kez oturmak dinlendirmiyor, sadece vakit geçiriyor.',
        20,
        false,
      );
      return;
    }
    set({ bugunDinlenildi: true });
    uygulaEtki(
      set,
      get,
      { enerji: 12, moral: 6, kondisyon: 2 },
      'Ağacın altına oturdun. Postalları çıkardın, ayakların hava aldı. On beş dakika ama iyi geldi.',
      15,
      false,
    );
  },

  /**
   * Sigarayı içmek tek adım değil: bitince elinde izmarit kalıyor ve onu
   * ne yapacağın ayrı bir karar. Kolay yol yere atmak, ama riski var.
   */
  sigaraIc() {
    const { envanter, profil, gun, blokIndex, miniAktif } = get();
    const dal = envanter.sigara?.adet ?? 0;
    if (dal <= 0) return;

    // İçtimada, derste, yemekhanede sigara yakılmaz. Panel zaten kapalı
    // gösteriyor; buraya düşen çağrı olursa sebebiyle geri çevrilir.
    const izin = sigaraIzni(gunGetir(gun)?.blocks[blokIndex]?.id, miniAktif);
    if (!izin.olur) {
      uygulaEtki(set, get, {}, izin.sebep ?? 'Şimdi olmaz.', 0, false);
      return;
    }

    const kalan = dal - 1;
    const yeni: Envanter = { ...envanter };
    if (kalan <= 0) delete yeni.sigara;
    else yeni.sigara = { ...envanter.sigara!, adet: kalan };

    const sonrasi = applyEffect(get().stats, get().para, {
      moral: profil.sigaraIciyor ? 8 : 2,
      kondisyon: -3,
    });

    set({
      envanter: yeni,
      stats: sonrasi.stats,
      para: sonrasi.para,
      nikotin: Math.max(0, get().nikotin - 60),
      // Sonuç kartı yerine doğrudan izmarit kararına geçiyoruz.
      panel: 'izmarit',
      sonuc: null,
      saat: ilerletilmisSaat(get, 7),
    });
    persist(get);
  },

  izmaritKarar(yereAt) {
    if (!yereAt) {
      set({ cepteIzmarit: get().cepteIzmarit + 1, panel: null });
      uygulaEtki(
        set,
        get,
        { moral: -1 },
        'İzmariti söndürüp cebine koydun. Hoş değil ama kimse görmedi.',
        0,
        false,
      );
      return;
    }

    // Yere atmak hızlı ama devriye her an geçebilir.
    const yakalandi = Math.random() < 0.15;
    if (!yakalandi) {
      set({ panel: null });
      uygulaEtki(
        set,
        get,
        { moral: 2 },
        'İzmariti yere attın, ayağınla ezdin ve yürüdün. Bu sefer kimse görmedi.',
        0,
        false,
      );
      return;
    }
    set({ panel: 'izmaritCezasi' });
  },

  izmaritCezasiBitir() {
    set({ panel: null });
    uygulaEtki(
      set,
      get,
      { disiplin: -9, moral: -12 },
      'İzmariti aldın, yerden özür diledin, bölük izledi. Bir daha yere atmadan önce iki kere düşüneceksin.',
      0,
      false,
    );
  },

  /** Cepte biriken izmaritleri çöpe atmak. */
  izmaritAt() {
    const adet = get().cepteIzmarit;
    if (adet <= 0) return;
    set({ cepteIzmarit: 0, panel: null });
    uygulaEtki(
      set,
      get,
      { disiplin: 3, moral: 3 },
      `Cebindeki ${adet} izmariti çöpe attın. Cebin de vicdanın da rahatladı.`,
      0,
      false,
    );
  },

  sigaraVer(ver) {
    const id = get().aktifIstek;
    if (!id) return;
    const kisi = arkadas(id);
    const { envanter } = get();
    const dal = envanter.sigara?.adet ?? 0;

    set({ aktifIstek: null, bugunIsteyenler: [...get().bugunIsteyenler, id] });

    if (!ver) {
      uygulaEtki(
        set,
        get,
        { moral: -2, dostluk: { kim: id, puan: -7 } },
        `"Yok, bende de az kaldı" dedin. ${kisi.ad} bir şey demedi ama not aldı.`,
        0,
        false,
      );
      return;
    }
    if (dal <= 0) return;

    const kalan = dal - 1;
    const yeni: Envanter = { ...envanter };
    if (kalan <= 0) delete yeni.sigara;
    else yeni.sigara = { ...envanter.sigara!, adet: kalan };
    set({ envanter: yeni });

    uygulaEtki(
      set,
      get,
      { moral: 3, dostluk: { kim: id, puan: 9 } },
      `${yonelme(kisi.ad)} bir dal verdin. ${kalan} dal kaldı. Burada bu, para değil, arkadaşlık.`,
      0,
      false,
    );
  },

  diyalogSec(index) {
    const d = get().aktifDiyalog;
    if (!d) return;
    const s = d.secenekler[index];
    if (!s) return;

    set({
      gorulmusDiyaloglar: [...get().gorulmusDiyaloglar, d.id],
      dostluk: { ...get().dostluk, [d.kim]: (get().dostluk[d.kim] ?? 0) + s.dostluk },
      aktifDiyalog: null,
      panel: null,
    });
    uygulaEtki(
      set,
      get,
      { moral: s.moral, disiplin: s.disiplin, para: s.para },
      s.outcome,
      12,
      false,
    );
  },
}));

// ─────────────────────────────────────────── telefon yardımcıları

const kirp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Rehberdeki hangi kayıt bu rolü konuşturur. */
function rolunKaydi(get: () => Store, rol: Rol): RehberKisi | undefined {
  const hedef: KayitRolu = rol === 'anne' || rol === 'baba' ? 'ev' : (rol as KayitRolu);
  return get().rehber.find((k) => (k.rol ?? eskiTurdenRol(k.tur)) === hedef);
}

/** Rehberde karşılığı olan roller; kimse eklenmemişse motor boşa çalışmaz. */
function aktifRoller(get: () => Store): Rol[] {
  const s = get();
  return TUM_ROLLER.filter((rol) => {
    if (rol === 'sevgili' && !s.sevgiliVar) return false;
    return !!rolunKaydi(get, rol);
  });
}

function telefonDurumu(get: () => Store): TelefonDurumu {
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
function konusanAdi(get: () => Store, rol: Rol): string {
  if (rol === 'anne' || rol === 'baba') return ROL_ADI[rol];
  return rolunKaydi(get, rol)?.ad ?? ROL_ADI[rol];
}

/**
 * Seçeneksiz replikleri (anlatıcı araları, tek cümlelik geçişler) zincirleme
 * okur ve ilk seçenekli düğümde durur. Durmazsa görüşme kapanıyor demektir.
 */
function zinciriYurut(
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

function gorusmeAc(
  set: (p: Partial<Store>) => void,
  get: () => Store,
  kisiId: string,
  gelen: boolean,
) {
  const kisi = get().rehber.find((k) => k.id === kisiId);
  if (!kisi) return;

  const durum = telefonDurumu(get);
  const kayit: KayitRolu = kisi.rol ?? eskiTurdenRol(kisi.tur);
  const rol = kayittanRolSec(kayit, durum);
  const gorusme = gunGorusmesi(rol, durum);
  if (!gorusme) {
    uygulaEtki(set, get, {}, 'Telefon çaldı, çaldı, kimse açmadı.', 0, false);
    return;
  }

  const telefonVar = durum.telefonVar;
  const baglam = { ad: get().profil.ad, kisi: kisi.ad, gun: get().gun, hafiza: get().hafiza };
  const kok = replikCoz(gorusme, gorusme.kok, durum);
  if (!kok) return;

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
    rehber: get().rehber.map((k) =>
      k.id === kisiId ? { ...k, sonArananGun: get().gun } : k,
    ),
  });
  persist(get);
}

/**
 * Görüşme kapanışı: biriken her şey burada tek seferde işleniyor.
 * Ankesör hem kırk dakika hem on lira yakıyor; kendi telefonun neredeyse
 * bedava — çarşıdaki o kalemin asıl karşılığı bu.
 */
function gorusmeBitir(
  set: (p: Partial<Store>) => void,
  get: () => Store,
  g: AktifGorusme,
) {
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
function gunBasiTelefon(set: (p: Partial<Store>) => void, get: () => Store) {
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
  const ozlemArtisi =
    (ihmalEdilen.length >= 2 ? 4 : ihmalEdilen.length === 1 ? 2 : 0) - 2;

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
function uygulaEtki(
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
function ilerletilmisSaat(get: () => Store, dakika: number) {
  const { gun, blokIndex, saat } = get();
  const blok = gunGetir(gun)?.blocks[blokIndex];
  if (!blok) return saat + dakika;
  return Math.min(blokSonu(blok), saat + dakika);
}

/** Kayıttan dönerken ya da güne başlarken saatin doğal karşılığı. */
function sahneninSaati(gun: number, blokIndex: number, sahneIndex: number) {
  const blok = gunGetir(gun)?.blocks[blokIndex];
  return blok ? sahneSaati(blok, sahneIndex) : dakikaya('05:30');
}

/** Sigara krizi büyüdükçe moral ve dikkat gider. */
function krizCezasi(set: (p: Partial<Store>) => void, get: () => Store) {
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
function gunlukDolapEtkisi(set: (p: Partial<Store>) => void, get: () => Store) {
  const { envanter, stats, para } = get();
  const { etki, satirlar } = gunlukEsyaEtkisi(envanter);
  const sonrasi = applyEffect(stats, para, etki);
  set({ stats: sonrasi.stats, para: sonrasi.para, dolapOzeti: satirlar });
}

function persist(get: () => Store) {
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
  });
}

/**
 * Panelin koşul değerlendirmesi için durum görüntüsü. Bileşen zaten
 * useGame ile abone olduğu için her render'da güncel okunur.
 */
export function telefonDurumuOku(): TelefonDurumu {
  return telefonDurumu(() => useGame.getState());
}

export function aktifSahne(): Scene | undefined {
  const { gun, blokIndex, sahneIndex } = useGame.getState();
  return gunGetir(gun)?.blocks[blokIndex]?.scenes[sahneIndex];
}

export const TOPLAM_YAZILI_GUN = GUNLER.length;
export const TUM_ESYALAR = ESYALAR;
