import { acikSahne, gunGetir, konumDuzelt } from '../../content';
import { applyEffect, blokGecisi, gunNotu, uykudanSonra } from '../../engine/stats';
import { sil, yukle } from '../../engine/save';
import { blokSonu, dakikaya, sahneSaati } from '../../engine/zaman';
import { olayYaz } from '../../engine/bulut';
import { denetimSonucu } from '../../content/denetim';
import { eskiTurdenRol } from '../../content/telefon';
import { gunOynanabilirMi } from '../../monetization/entitlements';
import { havaDurumu, havaEtkisi } from '../../engine/hava';
import type { Store, StoreGet, StoreSet } from '../tipler';
import {
  BOS_ROL_SAYISI,
  BASLANGIC_ILISKI,
  NIKOTIN_ARTIS,
  BOS_DOSTLUK,
  ilkDurum,
} from '../ilkDurum';
import {
  telefonDurumu,
  gorusmeBitir,
  gunBasiTelefon,
  uygulaEtki,
  sahneninSaati,
  krizCezasi,
  gunlukDolapEtkisi,
  ilkAcikSahneye,
  persist,
} from '../yardimcilar';

export const akisDilimi = (
  set: StoreSet,
  get: StoreGet,
): Pick<
  Store,
  | 'ilkYukleme'
  | 'yeniOyun'
  | 'profilKaydet'
  | 'carsiyiBitir'
  | 'devamEt'
  | 'anaMenu'
  | 'gelistirmeAc'
  | 'gelistirmeyeDon'
  | 'gelistirmeAtla'
  | 'gunuBaslat'
  | 'ileri'
  | 'secimYap'
  | 'dolapKapat'
  | 'denetimBitir'
  | 'miniBaslat'
  | 'miniBitir'
  | 'sonucuKapat'
  | 'sonrakiGun'
  | 'sifirla'
  | 'yoldaVar'
> => ({
  async ilkYukleme() {
    const k = await yukle();
    if (!k) {
      set({ hazir: true, kayitVar: false, ekran: 'menu' });
      return;
    }
    // Güncellemeyle içerik değiştiyse kayıttaki sahne artık olmayabilir.
    const konum = konumDuzelt(k.gun, k.blokIndex, k.sahneIndex);
    const konumDegisti = konum.blokIndex !== k.blokIndex || konum.sahneIndex !== k.sahneIndex;
    set({
      hazir: true,
      kayitVar: true,
      ekran: 'menu',
      profil: k.profil,
      hazirlikBitti: k.hazirlikBitti,
      gun: k.gun,
      blokIndex: konum.blokIndex,
      sahneIndex: konum.sahneIndex,
      saat: konumDegisti
        ? sahneninSaati(k.gun, konum.blokIndex, konum.sahneIndex)
        : (k.saat ?? sahneninSaati(k.gun, k.blokIndex, k.sahneIndex)),
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
      cepteIzmarit: k.cepteIzmarit ?? 0,
      bugunIsteyenler: k.bugunIsteyenler ?? [],
      bugunDinlenildi: k.bugunDinlenildi ?? false,
      gelenArama: k.gelenArama ?? null,
      bekleyenArama: k.bekleyenArama ?? [],
    });

    // Uygulama bir görüşmenin ortasında kapanmıştı: hat kesilmiş sayılır,
    // o ana kadar konuşulanın etkisi uygulanır. Sonuç kartı oyuna dönünce görünür.
    if (k.yarimGorusme) {
      gorusmeBitir(set, get, { ...k.yarimGorusme, kapanis: 'Hat kesildi. Konuşma yarım kaldı.' });
      const kart = get().sonuc;
      if (kart) set({ sonuc: { ...kart, acilistan: true } });
    }
  },

  async yeniOyun() {
    await sil();
    set({ ...ilkDurum, kayitVar: false, ekran: 'profil' });
  },

  profilKaydet(ad, sigaraIciyor) {
    set({ profil: { ad: ad.trim() || 'Er', sigaraIciyor }, ekran: 'carsi' });
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
    const kart = get().sonuc;
    set({
      ekran: gunOynanabilirMi(gun) ? 'oyun' : 'kilit',
      sonuc: kart?.acilistan ? kart : null,
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
    // Koşulu tutmayan sahneler (telefon hafızasına bağlı olanlar) atlanıyor.
    const sonraki = acikSahne(blok, sahneIndex + 1, telefonDurumu(get));
    if (sonraki !== null) {
      set({
        sahneIndex: sonraki,
        sonuc: null,
        miniAktif: false,
        // Sahne ilerledi, saat de ilerler. Bu blokta eylemlerle kazanılmış
        // fazladan dakikalar varsa geri alınmaz — saat geriye akmaz.
        saat: Math.min(blokSonu(blok), Math.max(get().saat, sahneSaati(blok, sonraki))),
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
      ilkAcikSahneye(set, get);
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
        bitenGunler: [
          ...bitenGunler.filter((b) => b.gun !== gun),
          { gun, not: not.ad, puan: not.puan },
        ].sort((a, b) => a.gun - b.gun),
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
    const sonuc = get().sonuc;
    if (sonuc) set({ sonuc: { ...sonuc, derece: score } });
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
    ilkAcikSahneye(set, get);
    gunlukDolapEtkisi(set, get);
    gunBasiTelefon(set, get);
    persist(get);
  },

  async sifirla() {
    await sil();
    set({ ...ilkDurum, kayitVar: false, ekran: 'menu' });
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
});
