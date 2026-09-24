import { gunGetir } from '../../content';
import { arkadas, uygunDiyaloglar } from '../../content/arkadaslar';
import { applyEffect } from '../../engine/stats';
import { sigaraIzni } from '../../engine/kurallar';
import type { Envanter } from '../../engine/types';
import { yonelme } from '../../engine/turkce';
import type { Store, StoreGet, StoreSet } from '../tipler';
import { uygulaEtki, ilerletilmisSaat, persist } from '../yardimcilar';

export const avluDilimi = (
  set: StoreSet,
  get: StoreGet,
): Pick<
  Store,
  | 'muhabbetBaslat'
  | 'arkadasaGit'
  | 'golgedeDinlen'
  | 'sigaraIc'
  | 'izmaritKarar'
  | 'izmaritCezasiBitir'
  | 'izmaritAt'
  | 'sigaraVer'
  | 'diyalogSec'
> => ({
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
      // Moral +6'ydı; her gün tekrarlanan en büyük pasif kaynaklardan biriydi.
      { enerji: 12, moral: 3, kondisyon: 1 },
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
});
