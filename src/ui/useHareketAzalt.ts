import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useAyarlar } from '../ayarlar';

/**
 * Hareket azaltılsın mı: sistemin erişilebilirlik ayarı ya da oyun içi ayar.
 * İkisi de değişince anında yansıyor; eskiden her bileşen sistemi açılışta
 * bir kez okuyordu ve oyun içinden kapatmanın yolu yoktu.
 */
export function useHareketAzalt() {
  const oyunIci = useAyarlar((s) => s.hareketAzalt);
  const [sistem, setSistem] = useState(false);
  useEffect(() => {
    let canli = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => canli && setSistem(v));
    const abone = AccessibilityInfo.addEventListener('reduceMotionChanged', setSistem);
    return () => {
      canli = false;
      abone.remove();
    };
  }, []);
  return sistem || oyunIci;
}
