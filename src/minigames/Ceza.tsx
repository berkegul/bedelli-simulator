import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import { Siddet, titret } from '../ui/haptik';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { clamp01, type MiniOyunProps } from './types';

const SURE = 18000;
/** İki şınav arası en az bu kadar geçmeli; daha hızlısı sayılmıyor. */
const EN_HIZLI = 260;

/**
 * Ceza şınavı. Ekrana basarak sayıyorsun ama tempoyu tutturman gerek:
 * çok hızlı basmak "yarım şınav" sayılıyor ve Onbaşı saymıyor.
 */
export function Ceza({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const hedef = 20 + Math.round(zorluk * 10);
  const [sayi, setSayi] = useState(0);
  const [kalan, setKalan] = useState(Math.round(SURE / 1000));
  const [uyari, setUyari] = useState(false);
  const [asagida, setAsagida] = useState(false);

  const sonBasis = useRef(0);
  const sayiRef = useRef(0);
  const bitti = useRef(false);

  useEffect(() => {
    const sayac = setInterval(() => setKalan((k) => Math.max(0, k - 1)), 1000);
    const son = setTimeout(() => {
      bitti.current = true;
      onBitti(clamp01(sayiRef.current / hedef));
    }, SURE);
    return () => {
      clearInterval(sayac);
      clearTimeout(son);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bas = useCallback(() => {
    if (bitti.current) return;
    const simdi = Date.now();
    if (simdi - sonBasis.current < EN_HIZLI) {
      setUyari(true);
      setTimeout(() => setUyari(false), 350);
      return;
    }
    sonBasis.current = simdi;
    sayiRef.current += 1;
    setSayi(sayiRef.current);
    setAsagida((a) => !a);
    titret(Siddet.Rigid);

    if (sayiRef.current >= hedef) {
      bitti.current = true;
      setTimeout(() => onBitti(1), 400);
    }
  }, [hedef, onBitti]);

  return (
    <View style={{ gap: SP.md, width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.rust} style={{ flex: 1 }}>
          CEZA ŞINAVI
        </PixelText>
        <PixelText font="command" size="h3" color={kalan <= 5 ? C.rust : C.canvasFaint}>
          {`${kalan} sn`}
        </PixelText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Şınav çek"
        onPress={bas}
        style={{
          minHeight: 230,
          borderWidth: BORDER,
          borderColor: uyari ? C.rust : C.ink,
          backgroundColor: uyari ? '#4A2018' : C.surface,
          alignItems: 'center',
          justifyContent: 'center',
          gap: SP.sm,
        }}
      >
        <PixelText font="command" size={72} color={C.brass}>
          {`${sayi}`}
        </PixelText>
        <View style={{ transform: [{ translateY: asagida ? 8 : 0 }] }}>
          <PixelSprite sprite={sprite(asagida ? 'askerAdim' : 'asker')} scale={3} />
        </View>
        <PixelText font="command" size="h3" color={uyari ? C.rust : C.canvasFaint}>
          {uyari ? 'YARIM SAYILMAZ' : `HEDEF ${hedef}`}
        </PixelText>
      </Pressable>

      <PixelText size="small" color={C.canvasFaint} center line="snug">
        Her dokunuş bir şınav. Çok hızlı basarsan Onbaşı saymıyor.
      </PixelText>
    </View>
  );
}
