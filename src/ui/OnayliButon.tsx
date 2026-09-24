import React, { useEffect, useState } from 'react';
import type { ViewStyle } from 'react-native';
import { Siddet, titret } from './haptik';
import { PixelButton } from './PixelButton';

type Props = {
  label: string;
  /** İlk dokunuştan sonra butonun gösterdiği soru. */
  onayLabel: string;
  onPress: () => void;
  tur?: 'ana' | 'secim' | 'sessiz';
  style?: ViewStyle;
};

/** İkinci dokunuş bu süre içinde gelmezse buton eski hâline döner. */
const ONAY_SURESI_MS = 3000;

/**
 * Geri alınamayan eylemler için iki dokunuşlu buton: ilk dokunuş soruyu
 * gösterir, ikincisi eylemi yapar. Sistem diyaloğu (Alert/confirm) yerine
 * bu var: oyunun görsel dilinde kalıyor ve her platformda aynı çalışıyor.
 */
export function OnayliButon({ label, onayLabel, onPress, tur = 'sessiz', style }: Props) {
  const [soruyor, setSoruyor] = useState(false);

  useEffect(() => {
    if (!soruyor) return;
    const id = setTimeout(() => setSoruyor(false), ONAY_SURESI_MS);
    return () => clearTimeout(id);
  }, [soruyor]);

  return (
    <PixelButton
      label={soruyor ? onayLabel : label}
      tur={soruyor ? 'ana' : tur}
      style={style}
      onPress={() => {
        if (!soruyor) {
          setSoruyor(true);
          titret(Siddet.Medium);
          return;
        }
        setSoruyor(false);
        onPress();
      }}
    />
  );
}
