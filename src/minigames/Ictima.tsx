import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { ASKER_HAZIROL, ASKER_RAHAT, CAVUS_BAGIRIYOR, CAVUS_HAZIROL } from '../art/sahne/alan';
import { PixelText } from '../ui/PixelText';
import { Sahne } from '../ui/sahne';
import { Balon, Basan, Bayrak, Damga, zeminUstu } from './alanSahnesi';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

const TUR = 4;
type Faz = 'bekle' | 'komut' | 'sonuc';

/** Sahne ölçüsü: piksel hücresi ve zemin payı. */
const U = 3;
const SAHNE_H = 260;
const ZEMIN_ORANI = 0.45;
/** Ön sıradaki askerlerin yatay yeri (yüzde); BEN sensin. */
const ON_SIRA = [12, 29, 46, 63];
const BEN = 2;
const ARKA_SIRA = [8, 18, 28, 38, 48, 58, 68];

/**
 * Reaksiyon oyunu: komut anında dokun. Erken dokunmak o turu sıfırlar.
 * Sahne içtima alanı: bölük rahatta bekliyor, Çavuş "Bölük…" diye
 * hazırlıyor, "HAZIROL!" anında bölük tek hareketle topuk vuruyor; sen
 * ancak dokununca.
 */
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

  const erken = mesaj === 'ERKEN ÇIKTIN';
  const gec = mesaj === 'GEÇ KALDIN';
  // Bölük komutla hazırola geçiyor; oyuncu ancak dokununca. Erken dokunan
  // rahattaki bölüğün içinde tek başına topuk vurmuş oluyor.
  const bolukHazirol = faz === 'komut' || (faz === 'sonuc' && !erken);
  const benHazirol = faz === 'sonuc';
  const g = zeminUstu(SAHNE_H, U, ZEMIN_ORANI);

  return (
    <View style={{ alignItems: 'center', gap: SP.md, width: '100%' }}>
      <PixelText font="command" size="h3" color={C.canvasDim}>
        {`YOKLAMA ${tur + 1} / ${TUR}`}
      </PixelText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Komuta cevap ver"
        onPress={dokun}
        style={{
          width: '100%',
          borderWidth: BORDER,
          borderColor: faz === 'komut' ? C.brass : C.ink,
        }}
      >
        <Sahne
          yukseklik={SAHNE_H}
          u={U}
          zemin="beton"
          zeminOrani={ZEMIN_ORANI}
          saat="06:10"
          tohum={7}
        >
          <Bayrak u={U} x="3%" alt={g + 3 * U} />
          {/* Arka sıra: bölüğün geri kalanı, küçük ve soluk */}
          {ARKA_SIRA.map((x, i) => (
            <Basan
              key={`a${i}`}
              sprite={bolukHazirol ? ASKER_HAZIROL : ASKER_RAHAT}
              u={U - 1}
              x={x}
              alt={g + 14}
              gecikme={(i * 170) % 900}
              opaklik={0.72}
            />
          ))}
          {/* Ön sıra: sen ve yanındakiler */}
          {ON_SIRA.map((x, i) => {
            const ben = i === BEN;
            const hazirol = ben ? benHazirol : bolukHazirol;
            return (
              <Basan
                key={`o${i}`}
                sprite={hazirol ? ASKER_HAZIROL : ASKER_RAHAT}
                u={U}
                x={x}
                alt={g + 62}
                gecikme={(i * 230) % 900}
              />
            );
          })}
          {/* Senin yerini gösteren ok */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: `${ON_SIRA[BEN]}%`,
              top: g + 62 - 24 * U - 7 * U,
              marginLeft: -2 * U,
            }}
          >
            <View style={{ width: 4 * U, height: U, backgroundColor: C.brass }} />
            <View style={{ width: 2 * U, height: U, marginLeft: U, backgroundColor: C.brass }} />
          </View>

          <Basan
            sprite={faz === 'komut' ? CAVUS_BAGIRIYOR : CAVUS_HAZIROL}
            u={U}
            x={85}
            alt={g + 48}
            nefes={faz !== 'komut'}
          />
          {faz === 'bekle' && (
            <Balon metin="BÖLÜK…" u={U} kuyruk="sag" style={{ right: '4%', top: g - 26 * U }} />
          )}
          {faz === 'komut' && (
            <Balon
              metin="HAZIROL!"
              u={U}
              kuyruk="sag"
              buyuk
              style={{ right: '3%', top: g - 30 * U }}
            />
          )}
          {faz === 'sonuc' && (
            <Damga
              metin={mesaj}
              renk={erken || gec ? C.rust : C.brass}
              style={{ left: '22%', top: g - 22 * U }}
            />
          )}
        </Sahne>
      </Pressable>

      <PixelText size="small" color={C.canvasFaint} center>
        Komut ekrana düştüğü anda dokun. Önce dokunursan hizadan çıkmış sayılırsın.
      </PixelText>
    </View>
  );
}
