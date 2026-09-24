import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { PixelText } from '../ui/PixelText';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

const TUR = 4;
type Faz = 'bekle' | 'komut' | 'sonuc';

/** Reaksiyon oyunu: komut anında dokun. Erken dokunmak o turu sıfırlar. */
export function Ictima({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const [tur, setTur] = useState(0);
  const [faz, setFaz] = useState<Faz>('bekle');
  const [puanlar, setPuanlar] = useState<number[]>([]);
  const [mesaj, setMesaj] = useState('');
  const komutAni = useRef(0);
  const zamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null);

  const iyiEsik = 320 - zorluk * 90;
  const kotuEsik = 900 - zorluk * 220;

  useEffect(() => {
    setFaz('bekle');
    setMesaj('');
    // Aralık düzensiz: oyuncu ritim ezberleyip erken basamasın.
    const gecikme = 900 + Math.random() * (2600 - zorluk * 700);
    zamanlayici.current = setTimeout(() => {
      komutAni.current = Date.now();
      setFaz('komut');
      bildir(Bildirim.Warning);
    }, gecikme);
    return () => {
      if (zamanlayici.current) clearTimeout(zamanlayici.current);
    };
  }, [tur, zorluk]);

  const bitir = useCallback(
    (puan: number, metin: string) => {
      if (zamanlayici.current) clearTimeout(zamanlayici.current);
      setFaz('sonuc');
      setMesaj(metin);
      const yeni = [...puanlar, puan];
      setPuanlar(yeni);
      z.sonra(760, () => {
        if (yeni.length >= TUR) onBitti(yeni.reduce((a, b) => a + b, 0) / yeni.length);
        else setTur((n) => n + 1);
      });
    },
    [puanlar, onBitti, z],
  );

  const dokun = useCallback(() => {
    if (faz === 'sonuc') return;
    if (faz === 'bekle') {
      bildir(Bildirim.Error);
      bitir(0, 'ERKEN ÇIKTIN');
      return;
    }
    const gecikme = Date.now() - komutAni.current;
    const puan = clamp01(1 - (gecikme - iyiEsik) / (kotuEsik - iyiEsik));
    titret(puan > 0.6 ? Siddet.Medium : Siddet.Rigid);
    // Ham süreyi ancak makul aralıkta göster; oyuncu telefonu bıraktıysa
    // "32001 ms" yazmak bilgi değil, gürültü.
    bitir(puan, gecikme > kotuEsik * 2 ? 'GEÇ KALDIN' : `${gecikme} ms`);
  }, [faz, bitir, iyiEsik, kotuEsik]);

  const zeminRenk = faz === 'komut' ? C.rust : faz === 'sonuc' ? C.surfaceHi : C.surface;

  return (
    <View style={{ alignItems: 'center', gap: SP.lg, width: '100%' }}>
      <PixelText font="command" size="h3" color={C.canvasDim}>
        {`YOKLAMA ${tur + 1} / ${TUR}`}
      </PixelText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Komuta cevap ver"
        onPress={dokun}
        style={{
          width: '100%',
          minHeight: 190,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: zeminRenk,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: SP.lg,
        }}
      >
        {faz === 'bekle' && (
          <PixelText font="command" size="h2" color={C.canvasFaint}>
            HAZIRDA BEKLE
          </PixelText>
        )}
        {faz === 'komut' && (
          <PixelText font="command" size="display" color={C.canvas} center>
            HAZIROL
          </PixelText>
        )}
        {faz === 'sonuc' && (
          <PixelText
            font="command"
            size="h2"
            color={mesaj === 'ERKEN ÇIKTIN' || mesaj === 'GEÇ KALDIN' ? C.rust : C.brass}
            center
          >
            {mesaj}
          </PixelText>
        )}
      </Pressable>

      <PixelText size="small" color={C.canvasFaint} center>
        Komut ekrana düştüğü anda dokun. Önce dokunursan hizadan çıkmış sayılırsın.
      </PixelText>
    </View>
  );
}
