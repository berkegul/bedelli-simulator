import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { PixelText } from './PixelText';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof PixelText>, 'children'> & {
  text: string;
  /** Harf başına milisaniye. */
  hiz?: number;
  /** true olduğunda kalan metni anında gösterir. */
  atla?: boolean;
  onBitti?: () => void;
};

/**
 * Metni harf harf yazar. Hareket azaltma açıkken tek seferde gösterir —
 * efekt anlatının ritmi için var, okumanın önüne geçmemeli.
 */
export function Daktilo({ text, hiz = 18, atla, onBitti, ...rest }: Props) {
  const [uzunluk, setUzunluk] = useState(0);
  const [yazilan, setYazilan] = useState(text);
  const [azaltilmisHareket, setAzaltilmisHareket] = useState(false);

  const bildirildi = useRef(false);
  const onBittiRef = useRef(onBitti);
  onBittiRef.current = onBitti;

  // Sıfırlamayı effect'e bırakırsak bir önceki metnin uzunluğu yeni ve daha
  // kısa metni "bitmiş" gösteriyor; bitiş sinyali erken yanıp bir daha
  // gelmiyordu. O yüzden metin değişimini render sırasında yakalıyoruz.
  if (yazilan !== text) {
    setYazilan(text);
    setUzunluk(0);
    bildirildi.current = false;
  }

  useEffect(() => {
    let canli = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => canli && setAzaltilmisHareket(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setAzaltilmisHareket);
    return () => {
      canli = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (azaltilmisHareket || atla) {
      setUzunluk(text.length);
      return;
    }
    if (uzunluk >= text.length) return;
    const t = setTimeout(() => setUzunluk((n) => n + 1), hiz);
    return () => clearTimeout(t);
  }, [uzunluk, text, hiz, atla, azaltilmisHareket]);

  useEffect(() => {
    if (yazilan === text && uzunluk >= text.length && !bildirildi.current) {
      bildirildi.current = true;
      onBittiRef.current?.();
    }
  }, [uzunluk, text, yazilan]);

  return <PixelText {...rest}>{text.slice(0, uzunluk)}</PixelText>;
}
