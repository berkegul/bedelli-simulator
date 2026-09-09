import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { clamp01, type MiniOyunProps } from './types';

const SURE = 26000;
const DUSUS = 1.05; // uyanıklık / 100ms
type Faz = 'nobet' | 'devriye' | 'yakalandi' | 'bitti';

/**
 * Gece nöbeti: uyanık kalmak için düzenli dokun. Arada devriye geçiyor —
 * o an oturuyorsan ceza yazılıyor, bu yüzden komut gelince hemen HAZIROL'a
 * basman gerek. İki iş aynı anda: uykuyla ve devriyeyle uğraşmak.
 */
export function Nobet({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const [uyaniklik, setUyaniklik] = useState(72);
  const [faz, setFaz] = useState<Faz>('nobet');
  const [kalan, setKalan] = useState(Math.round(SURE / 1000));
  const [ceza, setCeza] = useState(0);

  const uyaniklikRef = useRef(72);
  const toplamUyku = useRef(0);
  const devriyeAni = useRef(0);
  const ayaktaMi = useRef(false);
  const bittiRef = useRef(false);

  const devriyeSayisi = 2 + Math.round(zorluk * 2);

  // Uyanıklık sürekli düşüyor; dokunmazsan gözlerin kapanıyor.
  useEffect(() => {
    const t = setInterval(() => {
      uyaniklikRef.current = Math.max(0, uyaniklikRef.current - DUSUS);
      setUyaniklik(uyaniklikRef.current);
      if (uyaniklikRef.current < 25) toplamUyku.current += 1;
    }, 100);
    return () => clearInterval(t);
  }, []);

  // Geri sayım
  useEffect(() => {
    const t = setInterval(() => setKalan((k) => Math.max(0, k - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Devriyeler rastgele anlarda geçiyor
  useEffect(() => {
    const zamanlayicilar: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < devriyeSayisi; i++) {
      const an = 4000 + (SURE - 7000) * ((i + Math.random() * 0.6) / devriyeSayisi);
      zamanlayicilar.push(
        setTimeout(() => {
          if (bittiRef.current) return;
          devriyeAni.current = Date.now();
          ayaktaMi.current = false;
          setFaz('devriye');
          bildir(Bildirim.Warning);

          // Tepki penceresi: bu süre içinde ayağa kalkmazsan yakalanırsın.
          zamanlayicilar.push(
            setTimeout(
              () => {
                if (bittiRef.current) return;
                if (!ayaktaMi.current) {
                  setCeza((c) => c + 1);
                  setFaz('yakalandi');
                  bildir(Bildirim.Error);
                  setTimeout(() => !bittiRef.current && setFaz('nobet'), 1400);
                } else {
                  setFaz('nobet');
                }
              },
              1700 - zorluk * 400,
            ),
          );
        }, an),
      );
    }

    zamanlayicilar.push(
      setTimeout(() => {
        bittiRef.current = true;
        setFaz('bitti');
        // Puan: uyanık geçen süre ve yakalanmama.
        const uykuOrani = toplamUyku.current / (SURE / 100);
        const puan = clamp01(1 - uykuOrani * 1.6 - ceza * 0.3);
        setTimeout(() => onBitti(puan), 700);
      }, SURE),
    );

    return () => zamanlayicilar.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dokun = useCallback(() => {
    if (faz === 'bitti') return;
    if (faz === 'devriye') {
      ayaktaMi.current = true;
      titret(Siddet.Medium);
      setFaz('nobet');
      return;
    }
    uyaniklikRef.current = Math.min(100, uyaniklikRef.current + 16);
    setUyaniklik(uyaniklikRef.current);
    titret(Siddet.Light);
  }, [faz]);

  const uykulu = uyaniklik < 25;
  const zeminRenk =
    faz === 'devriye' ? '#4A2018' : faz === 'yakalandi' ? C.rust : uykulu ? '#191710' : C.surface;

  return (
    <View style={{ gap: SP.lg, width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvasDim} style={{ flex: 1 }}>
          {`NÖBET · ${kalan} sn`}
        </PixelText>
        {ceza > 0 && (
          <PixelText font="command" size="body" color={C.rust}>
            {`${ceza} ceza`}
          </PixelText>
        )}
      </View>

      {/* Uyanıklık şeridi */}
      <View style={{ borderWidth: BORDER, borderColor: C.ink, backgroundColor: C.ink, padding: 2 }}>
        <Svg width="100%" height={14}>
          <Rect x="0" y="0" width="100%" height={14} fill={C.bg} />
          <Rect
            x="0"
            y="0"
            width={`${uyaniklik}%`}
            height={14}
            fill={uyaniklik < 25 ? C.rust : uyaniklik < 50 ? C.tea : C.steel}
          />
        </Svg>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={faz === 'devriye' ? 'Ayağa kalk' : 'Uyanık kal'}
        onPress={dokun}
        style={{
          minHeight: 210,
          borderWidth: BORDER,
          borderColor: faz === 'devriye' ? C.brass : C.ink,
          backgroundColor: zeminRenk,
          alignItems: 'center',
          justifyContent: 'center',
          gap: SP.sm,
          paddingHorizontal: SP.lg,
        }}
      >
        {faz === 'devriye' ? (
          <>
            <PixelSprite sprite={sprite('cavus')} scale={4} />
            <PixelText font="command" size="h2" color={C.canvas} center>
              DEVRİYE GELİYOR
            </PixelText>
            <PixelText font="command" size="h3" color={C.brass}>
              HAZIROL — DOKUN
            </PixelText>
          </>
        ) : faz === 'yakalandi' ? (
          <PixelText font="command" size="h2" color={C.canvas} center>
            OTURURKEN YAKALANDIN
          </PixelText>
        ) : faz === 'bitti' ? (
          <PixelText font="command" size="h2" color={C.olive} center>
            NÖBET BİTTİ
          </PixelText>
        ) : (
          <>
            <PixelSprite sprite={sprite('asker')} scale={4} opacity={uykulu ? 0.45 : 1} />
            <PixelText font="command" size="h3" color={uykulu ? C.rust : C.canvasFaint} center>
              {uykulu ? 'GÖZLERİN KAPANIYOR' : 'NÖBETTESİN'}
            </PixelText>
          </>
        )}
      </Pressable>

      <PixelText size="small" color={C.canvasFaint} center line="snug">
        Uyanık kalmak için ara ara dokun. Devriye geçtiğinde hemen ayağa kalk.
      </PixelText>
    </View>
  );
}
