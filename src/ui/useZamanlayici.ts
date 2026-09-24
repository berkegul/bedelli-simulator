import { useEffect, useMemo, useRef } from 'react';

type Kimlik = ReturnType<typeof setTimeout>;

/**
 * Bileşenin ömrüne bağlı zamanlayıcılar. Mini oyunlar tur sonunda
 * "600 ms sonra puanı bildir" gibi zamanlayıcı kuruyordu ve bunlar bileşen
 * kalkınca temizlenmiyordu: oyuncu o arada sahneden çıkarsa `onBitti` ya da
 * `onVardi` kapanmış bir ekrandan yine çağrılıyor, akış iki kez ilerliyordu.
 * Buradan kurulan her zamanlayıcı bileşen kalkınca kendiliğinden iptal olur.
 */
export function useZamanlayici() {
  const kimlikler = useRef(new Set<Kimlik>());

  useEffect(() => {
    const acik = kimlikler.current;
    return () => {
      acik.forEach((k) => {
        clearTimeout(k);
        clearInterval(k);
      });
      acik.clear();
    };
  }, []);

  return useMemo(
    () => ({
      /** `ms` sonra bir kez çalışır. */
      sonra(ms: number, is: () => void): Kimlik {
        const k = setTimeout(() => {
          kimlikler.current.delete(k);
          is();
        }, ms);
        kimlikler.current.add(k);
        return k;
      },
      /** Her `ms`'de bir çalışır; `durdur` ile ya da bileşen kalkınca biter. */
      aralik(ms: number, is: () => void): Kimlik {
        const k = setInterval(is, ms);
        kimlikler.current.add(k);
        return k;
      },
      durdur(k: Kimlik | null | undefined) {
        if (k == null) return;
        clearTimeout(k);
        clearInterval(k);
        kimlikler.current.delete(k);
      },
    }),
    [],
  );
}
