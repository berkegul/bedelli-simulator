import React, { useEffect, useRef, useState } from 'react';
import { PixelText } from './PixelText';
import type { ComponentProps } from 'react';
import { useHareketAzalt } from './useHareketAzalt';
import { HARF_MS, useAyarlar } from '../ayarlar';

type Props = Omit<ComponentProps<typeof PixelText>, 'children'> & {
  text: string;
  /** Harf başına milisaniye; verilmezse ayarlardaki metin hızı. */
  hiz?: number;
  /** true olduğunda kalan metni anında gösterir. */
  atla?: boolean;
  onBitti?: () => void;
};

/**
 * Metni harf harf yazar. Hareket azaltma açıkken tek seferde gösterir —
 * efekt anlatının ritmi için var, okumanın önüne geçmemeli.
 */
export function Daktilo({ text, hiz, atla, onBitti, ...rest }: Props) {
  const ayarHizi = useAyarlar((a) => HARF_MS[a.metinHizi]);
  const harfMs = hiz ?? ayarHizi;
  const [uzunluk, setUzunluk] = useState(0);
  const [yazilan, setYazilan] = useState(text);
  const azaltilmisHareket = useHareketAzalt();

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
    if (azaltilmisHareket || atla || harfMs === 0) {
      setUzunluk(text.length);
      return;
    }
    if (uzunluk >= text.length) return;
    const t = setTimeout(() => setUzunluk((n) => n + 1), harfMs);
    return () => clearTimeout(t);
  }, [uzunluk, text, harfMs, atla, azaltilmisHareket]);

  useEffect(() => {
    if (yazilan === text && uzunluk >= text.length && !bildirildi.current) {
      bildirildi.current = true;
      onBittiRef.current?.();
    }
  }, [uzunluk, text, yazilan]);

  return <PixelText {...rest}>{text.slice(0, uzunluk)}</PixelText>;
}
