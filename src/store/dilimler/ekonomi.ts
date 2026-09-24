import { esya, fiyat } from '../../content/esyalar';
import type { Effect, Envanter } from '../../engine/types';
import type { Store, StoreGet, StoreSet } from '../tipler';
import { uygulaEtki, persist } from '../yardimcilar';

export const ekonomiDilimi = (
  set: StoreSet,
  get: StoreGet,
): Pick<Store, 'panelAc' | 'satinAl' | 'esyaKullan' | 'yemekYe'> => ({
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
});
