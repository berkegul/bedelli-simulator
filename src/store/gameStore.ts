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
import type {
  ArkadasId,
  Choice,
  Effect,
  Envanter,
  EsyaId,
  Kalite,
  Profil,
  RehberKisi,
  Scene,
  Stats,
} from '../engine/types';
import { gunOynanabilirMi } from '../monetization/entitlements';
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
  | 'icerikSonu';

/** Oyun ekranının üstüne açılan panel — sahne akışını bozmadan geri dönülür. */
export type Panel = null | 'kantin' | 'dolap' | 'rehber' | 'muhabbet' | 'sigaraIstegi' | 'ant41' | 'oturma' | 'cep' | 'izmarit' | 'izmaritCezasi';

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

type Store = {
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

  ilkYukleme: () => Promise<void>;
  yeniOyun: () => Promise<void>;
  profilKaydet: (ad: string, sigaraIciyor: boolean) => void;
  kisiEkle: (ad: string, yakinlik: string) => void;
  kisiSil: (id: string) => void;
  carsiyiBitir: () => void;
  devamEt: () => void;
  anaMenu: () => void;
  gunuBaslat: () => void;
  ileri: () => void;
  secimYap: (c: Choice) => void;
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
      dostluk: { ...BOS_DOSTLUK, ...(k.dostluk ?? {}) },
      gorulmusDiyaloglar: k.gorulmusDiyaloglar ?? [],
      rehber: k.rehber ?? [],
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

  kisiEkle(ad, yakinlik) {
    const temiz = ad.trim();
    if (!temiz) return;
    set({
      rehber: [...get().rehber, { id: `k${Date.now()}`, ad: temiz, yakinlik: yakinlik.trim() || 'Yakınım' }],
    });
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
    set({ ekran: 'menu', panel: null });
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

  miniBaslat() {
    set({ miniAktif: true });
  },

  miniBitir(score) {
    const { gun, blokIndex, sahneIndex } = get();
    const sahne = gunGetir(gun)?.blocks[blokIndex]?.scenes[sahneIndex];
    if (!sahne || sahne.kind !== 'mini') return;
    set({ miniAktif: false });
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
    });
    gunlukDolapEtkisi(set, get);
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

  kisiAra(id) {
    const { rehber, envanter, gun, blokIndex, miniAktif, profil } = get();
    const kisi = rehber.find((k) => k.id === id);
    if (!kisi) return;

    const izin = telefonIzni(gunGetir(gun)?.blocks[blokIndex]?.id, miniAktif);
    if (!izin.olur) {
      uygulaEtki(set, get, {}, izin.sebep ?? 'Şimdi olmaz.', 0, false);
      return;
    }

    const telefonVar = (envanter.kamerasizTelefon?.adet ?? 0) > 0;
    const kontor = envanter.kontor?.adet ?? 0;

    // Telefonu olmayan ankesör kuyruğuna giriyor: daha uzun, daha yorucu.
    if (!telefonVar) {
      uygulaEtki(
        set,
        get,
        { moral: 11, enerji: -9, para: -15 },
        `Ankesör kuyruğunda kırk dakika bekleyip ${kisi.ad} ile üç dakika konuştun.`,
        43,
        false,
      );
    } else if (kontor <= 0) {
      uygulaEtki(
        set,
        get,
        { moral: -4 },
        'Kontörün bitmiş. Kantinden almadan arayamazsın.',
        0,
        false,
      );
      return;
    } else {
      const yeniEnv: Envanter = { ...envanter };
      if (kontor - 1 <= 0) delete yeniEnv.kontor;
      else yeniEnv.kontor = { ...envanter.kontor!, adet: kontor - 1 };
      set({ envanter: yeniEnv });

      // Aynı kişiyi her gün aramak ilk seferki kadar iyi gelmiyor.
      const tazelik = kisi.sonArananGun === gun ? 0.35 : 1;
      uygulaEtki(
        set,
        get,
        { moral: Math.round(14 * tazelik), enerji: -4 },
        tazelik === 1
          ? `${kisi.ad} ile konuştun. "${profil.ad || 'Oğlum'}, sesin iyi geliyor" dedi.`
          : `${kisi.ad} bugün ikinci kez seni duydu. Yine de iyi geldi.`,
        9,
        false,
      );
    }

    set({
      rehber: get().rehber.map((k) => (k.id === id ? { ...k, sonArananGun: gun } : k)),
    });
    persist(get);
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
    dostluk: s.dostluk,
    gorulmusDiyaloglar: s.gorulmusDiyaloglar,
    rehber: s.rehber,
    nikotin: s.nikotin,
    bitenGunler: s.bitenGunler,
  });
}

export function aktifSahne(): Scene | undefined {
  const { gun, blokIndex, sahneIndex } = useGame.getState();
  return gunGetir(gun)?.blocks[blokIndex]?.scenes[sahneIndex];
}

export const TOPLAM_YAZILI_GUN = GUNLER.length;
export const TUM_ESYALAR = ESYALAR;
