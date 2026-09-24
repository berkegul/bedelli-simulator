import { gunGetir } from '../../content';
import { telefonIzni } from '../../engine/kurallar';
import type { Envanter } from '../../engine/types';
import {
  KAYIT_ADI,
  TUM_GORUSMELER,
  ankesorKapanisi,
  metinDoldur,
  replikCoz,
  secenekleriHazirla,
  type Hafiza,
} from '../../content/telefon';
import type { AktifGorusme, Store, StoreGet, StoreSet } from '../tipler';
import {
  telefonDurumu,
  konusanAdi,
  zinciriYurut,
  gorusmeAc,
  gorusmeBitir,
  uygulaEtki,
  persist,
} from '../yardimcilar';

export const telefonDilimi = (
  set: StoreSet,
  get: StoreGet,
): Pick<
  Store,
  | 'kisiEkle'
  | 'sevgiliVarMi'
  | 'kisiSil'
  | 'kisiAra'
  | 'gelenAramayiAc'
  | 'gelenAramayiGecistir'
  | 'gorusmeCevapla'
  | 'gorusmeKapat'
> => ({
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
    }

    // Kart ancak hat açılınca yanar: kimse açmadıysa ankesör kartı geri verir.
    if (!gorusmeAc(set, get, id, false) || telefonVar) return;
    const yeniEnv: Envanter = { ...get().envanter };
    if (kontor - 1 <= 0) delete yeniEnv.kontor;
    else yeniEnv.kontor = { ...envanter.kontor!, adet: kontor - 1 };
    set({ envanter: yeniEnv });
    persist(get);
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

    const sonraki = secenek.sonraki ? replikCoz(gorusme, secenek.sonraki, durum) : undefined;

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
});
