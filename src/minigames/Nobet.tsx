import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { ASKER_HAZIROL, CAVUS_BAGIRIYOR, CAVUS_HAZIROL, NOBET_KULUBESI } from '../art/sahne/alan';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { Sahne } from '../ui/sahne';
import { Balon, Basan, Damga, Projektor, Zzz, zeminUstu } from './alanSahnesi';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';
import { sesCal } from '../ses';

const SURE = 26000;

/** Sahne ölçüsü. */
const U = 3;
const SAHNE_H = 260;
const ZEMIN_ORANI = 0.4;
const DUSUS = 1.05; // uyanıklık / 100ms
type Faz = 'nobet' | 'devriye' | 'yakalandi' | 'bitti';

/**
 * Gece nöbeti: uyanık kalmak için düzenli dokun. Arada devriye geçiyor —
 * o an oturuyorsan ceza yazılıyor, bu yüzden komut gelince hemen HAZIROL'a
 * basman gerek. İki iş aynı anda: uykuyla ve devriyeyle uğraşmak.
 */
export function Nobet({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const [uyaniklik, setUyaniklik] = useState(72);
  const [faz, setFaz] = useState<Faz>('nobet');
  const [kalan, setKalan] = useState(Math.round(SURE / 1000));
  const [ceza, setCeza] = useState(0);
  // Bitiş zamanlayıcısı açılışta bir kez kuruluyor; state'teki `ceza` orada
  // hep 0 görünüyordu ve yakalanmak puanı hiç düşürmüyordu. Sayı ref'ten okunuyor.
  const cezaRef = useRef(0);

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
          sesCal('devriye');
          bildir(Bildirim.Warning);

          // Tepki penceresi: bu süre içinde ayağa kalkmazsan yakalanırsın.
          zamanlayicilar.push(
            setTimeout(
              () => {
                if (bittiRef.current) return;
                if (!ayaktaMi.current) {
                  cezaRef.current += 1;
                  setCeza(cezaRef.current);
                  setFaz('yakalandi');
                  bildir(Bildirim.Error);
                  z.sonra(1400, () => !bittiRef.current && setFaz('nobet'));
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
        const puan = clamp01(1 - uykuOrani * 1.6 - cezaRef.current * 0.3);
        z.sonra(700, () => onBitti(puan));
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
  // Asker uyuklarken kulübeye yaslanıp çöküyor; devriye geldiğinde de
  // oturuyor sayılıyor, dokunana kadar (mantıktaki ayaktaMi ile aynı).
  const oturuyor = faz === 'devriye' || faz === 'yakalandi' || (faz === 'nobet' && uykulu);
  const g = zeminUstu(SAHNE_H, U, ZEMIN_ORANI);
  const lambalar = [
    { x: 16, y: ((g + 6 * U) / SAHNE_H) * 100, yaricap: 30 },
    ...(faz === 'devriye'
      ? [{ x: 86, y: ((g + 14 * U) / SAHNE_H) * 100, yaricap: 12, guc: 0.3 }]
      : []),
  ];

  return (
    <View style={{ gap: SP.md, width: '100%' }}>
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
        style={{ borderWidth: BORDER, borderColor: faz === 'devriye' ? C.brass : C.ink }}
      >
        <Sahne
          yukseklik={SAHNE_H}
          u={U}
          zemin="toprak"
          zeminOrani={ZEMIN_ORANI}
          saat="02:40"
          lambalar={lambalar}
          tohum={10}
        >
          <Projektor u={U} x="12%" alt={g + 8 * U} />
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: '26%', top: g + 12 * U - 30 * U }}
          >
            <PixelSprite sprite={NOBET_KULUBESI} scale={U} />
          </View>

          {oturuyor ? (
            <Basan sprite={sprite('oturanAsker')} u={U} x={43} alt={g + 13 * U} gecikme={0} />
          ) : (
            <Basan sprite={ASKER_HAZIROL} u={U} x={47} alt={g + 18 * U} />
          )}
          {faz === 'nobet' && uykulu && <Zzz u={U} style={{ left: '49%', top: g - 4 * U }} />}

          {/* Devriye: uzaktan fenerle geliyor; yakalayınca yanına dikiliyor */}
          {faz === 'devriye' && <Basan sprite={CAVUS_HAZIROL} u={U - 1} x={86} alt={g + 12 * U} />}
          {faz === 'yakalandi' && (
            <>
              <Basan sprite={CAVUS_BAGIRIYOR} u={U} x={72} alt={g + 18 * U} nefes={false} />
              <Balon
                metin="UYUYOR MUSUN SEN?!"
                u={U}
                kuyruk="sag"
                style={{ right: '4%', top: g - 26 * U }}
              />
            </>
          )}

          {/* Uyku bastıkça gözün kararıyor */}
          {uykulu && faz === 'nobet' && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#000',
                opacity: Math.min(0.55, ((25 - uyaniklik) / 25) * 0.55 + 0.15),
              }}
            />
          )}

          {faz === 'devriye' && (
            <Damga metin="DEVRİYE · HAZIROL!" renk={C.brass} style={{ left: '8%', top: 6 * U }} />
          )}
          {faz === 'yakalandi' && (
            <Damga metin="OTURURKEN YAKALANDIN" renk={C.rust} style={{ left: '6%', top: 6 * U }} />
          )}
          {faz === 'bitti' && (
            <Damga metin="NÖBET BİTTİ" renk={C.olive} style={{ left: '10%', top: 6 * U }} />
          )}
          {faz === 'nobet' && (
            <View pointerEvents="none" style={{ position: 'absolute', left: 3 * U, top: 3 * U }}>
              <PixelText font="command" size="body" color={uykulu ? C.rust : C.canvasFaint}>
                {uykulu ? 'GÖZLERİN KAPANIYOR' : 'NÖBETTESİN'}
              </PixelText>
            </View>
          )}
        </Sahne>
      </Pressable>

      <PixelText size="small" color={C.canvasFaint} center line="snug">
        Uyanık kalmak için ara ara dokun. Devriye geçtiğinde hemen ayağa kalk.
      </PixelText>
    </View>
  );
}
