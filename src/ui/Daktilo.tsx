import React, { useEffect, useEffectEvent, useRef, useState } from 'react';
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

  // Hangi metin için bitiş bildirildiği; aynı metin için bir kez.
  const bildirilen = useRef<string | null>(null);

  // Sıfırlamayı effect'e bırakırsak bir önceki metnin uzunluğu yeni ve daha
  // kısa metni "bitmiş" gösteriyor; bitiş sinyali erken yanıp bir daha
  // gelmiyordu. O yüzden metin değişimini render sırasında yakalıyoruz.
  if (yazilan !== text) {
    setYazilan(text);
    setUzunluk(0);
  }

  const aninda = azaltilmisHareket || !!atla || harfMs === 0;
  const gorunen = aninda ? text.length : uzunluk;

  useEffect(() => {
    if (aninda || uzunluk >= text.length) return;
    const t = setTimeout(() => setUzunluk((n) => n + 1), harfMs);
    return () => clearTimeout(t);
  }, [uzunluk, text, harfMs, aninda]);

  const bitti = useEffectEvent(() => onBitti?.());
  useEffect(() => {
    if (yazilan === text && gorunen >= text.length && bildirilen.current !== text) {
      bildirilen.current = text;
      bitti();
    }
  }, [gorunen, text, yazilan]);

  return <PixelText {...rest}>{text.slice(0, gorunen)}</PixelText>;
}
