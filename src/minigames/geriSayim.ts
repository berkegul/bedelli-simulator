import { useEffect, useEffectEvent, useState } from 'react';

/**
 * Süreli mini oyunların saati. 100 ms'de bir güncellenir, süre dolunca
 * `bitince` bir kez çağrılır. Oyun kendi bitirirse `durdu` true verilir,
 * saat o anki değerinde donar.
 */
export function useGeriSayim(toplam: number, bitince: () => void, durdu = false) {
  const [kalan, setKalan] = useState(toplam);
  const bitir = useEffectEvent(bitince);

  useEffect(() => {
    if (durdu) return;
    // Başlangıç anı effect içinde alınıyor; render saf kalsın.
    const basla = Date.now();
    const id = setInterval(() => {
      const k = Math.max(0, toplam - (Date.now() - basla));
      setKalan(k);
      if (k <= 0) {
        clearInterval(id);
        bitir();
      }
    }, 100);
    return () => clearInterval(id);
  }, [toplam, durdu]);

  return { kalan, oran: kalan / toplam };
}
