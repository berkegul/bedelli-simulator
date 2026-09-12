import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Süreli mini oyunların saati. 100 ms'de bir güncellenir, süre dolunca
 * `bitince` bir kez çağrılır. Oyun kendi bitirirse `durdur` ile saat kesilir.
 */
export function useGeriSayim(toplam: number, bitince: () => void) {
  const [kalan, setKalan] = useState(toplam);
  const basla = useRef(Date.now());
  const durdu = useRef(false);
  const bitinceRef = useRef(bitince);
  bitinceRef.current = bitince;

  useEffect(() => {
    const id = setInterval(() => {
      if (durdu.current) return;
      const k = Math.max(0, toplam - (Date.now() - basla.current));
      setKalan(k);
      if (k <= 0) {
        durdu.current = true;
        bitinceRef.current();
      }
    }, 100);
    return () => clearInterval(id);
  }, [toplam]);

  const durdur = useCallback(() => {
    durdu.current = true;
  }, []);

  return { kalan, oran: kalan / toplam, durdur };
}
