import { useEffect, useRef, useState } from 'react';
import { useHareketAzalt } from './useHareketAzalt';

/**
 * Gösterilen sayı yeni değere birer birer yürüsün: 62 → 70 değişimini oyuncu
 * bir anda değil sayarken görüyor. Hareket azaltma açıksa doğrudan atlar.
 * İkinci değer sayım sürerken true: çağıran rengi o sırada vurgulayabilir.
 */
export function useSayac(hedef: number, sure = 420): [number, boolean] {
  const azalt = useHareketAzalt();
  const [gosterilen, setGosterilen] = useState(hedef);
  const simdiki = useRef(hedef);

  useEffect(() => {
    const baslangic = simdiki.current;
    if (azalt || baslangic === hedef) {
      simdiki.current = hedef;
      setGosterilen(hedef);
      return;
    }
    const t0 = Date.now();
    let kare = 0;
    const adim = () => {
      const oran = Math.min(1, (Date.now() - t0) / sure);
      // Sonda yavaşlıyor: son birkaç sayı okunabilsin.
      const yumusak = 1 - (1 - oran) * (1 - oran);
      const deger = Math.round(baslangic + (hedef - baslangic) * yumusak);
      simdiki.current = deger;
      setGosterilen(deger);
      if (oran < 1) kare = requestAnimationFrame(adim);
    };
    kare = requestAnimationFrame(adim);
    return () => cancelAnimationFrame(kare);
  }, [hedef, sure, azalt]);

  return [gosterilen, gosterilen !== hedef];
}
