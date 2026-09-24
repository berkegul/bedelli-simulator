import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import { useGame } from '../store/gameStore';
import {
  ASKER_HAZIROL,
  ASKER_SELAM,
  CAVUS_BAGIRIYOR,
  CAVUS_HAZIROL,
  KURSU,
} from '../art/sahne/alan';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { Sahne } from '../ui/sahne';
import { Balon, Basan, Bayrak, Damga, Tribun, zeminUstu } from './alanSahnesi';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';

/** Komutanın okuduğu, bölüğün bir ağızdan tekrarladığı satırlar. */
const SATIRLAR = [
  'Türk Milletinin bir ferdi olarak,',
  'Her zaman ve her yerde,',
  'Kanunlarına ve nizamlarına,',
  'Sancağıma ve komutanlarıma',
  'Namusum üzerine and içerim.',
];

/** Satır kelime kelime okunuyor; kelime başına süre. */
const KELIME_MS = 330;

type Faz = 'okuyor' | 'sus' | 'sen' | 'sonuc';

/** Tribündeki yakınlar: rehberde kayıtlı rollerden. Ev kaydı iki kişi getiriyor. */
function izleyiciler(rehber: { ad: string; rol?: string }[]): string[] {
  const adlar: string[] = [];
  for (const k of rehber) {
    if (k.rol === 'ev') adlar.push('Annen', 'Baban');
    else if (k.rol === 'sevgili' || k.rol === 'es' || k.rol === 'kardes') adlar.push(k.ad);
  }
  return adlar.slice(0, 4);
}

/**
 * Yemin töreni. Komutan her satırı okuyor; satır bitince bölük bir ağızdan
 * tekrarlıyor. Doğru an okuma bittikten hemen sonra: erken bağıran tek
 * başına bağırmış olur, geç kalan bölüğün bitirdiği satıra yetişemez.
 * Tribünde rehberdeki yakınlar oturuyor.
 */
export function Yemin({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const z = useZamanlayici();
  const rehber = useGame((s) => s.rehber);
  const [izleyen] = useState(() => izleyiciler(rehber));
  const [en, setEn] = useState(0);
  const [tur, setTur] = useState(0);
  const [faz, setFaz] = useState<Faz>('okuyor');
  const [okunan, setOkunan] = useState(0);
  const [mesaj, setMesaj] = useState('');
  const [puanlar, setPuanlar] = useState<number[]>([]);
  const senAni = useRef(0);
  const cozuldu = useRef(false);
  /** Bu turun zamanlayıcıları: tur çözülünce kalanlar sonraki tura sızmasın. */
  const turZamanlari = useRef<ReturnType<typeof setTimeout>[]>([]);

  const iyiEsik = 380 - zorluk * 80;
  const kotuEsik = 1150 - zorluk * 250;
  const kelimeler = SATIRLAR[tur].split(' ');

  const bitir = useCallback(
    (puan: number, metin: string) => {
      if (cozuldu.current) return;
      cozuldu.current = true;
      turZamanlari.current.forEach(clearTimeout);
      turZamanlari.current = [];
      setFaz('sonuc');
      setMesaj(metin);
      const yeni = [...puanlar, puan];
      setPuanlar(yeni);
      z.sonra(900, () => {
        if (yeni.length >= SATIRLAR.length) {
          onBitti(yeni.reduce((a, b) => a + b, 0) / yeni.length);
          return;
        }
        cozuldu.current = false;
        setOkunan(0);
        setFaz('okuyor');
        setTur((n) => n + 1);
      });
    },
    [puanlar, onBitti, z],
  );

  // Satırı kelime kelime oku, sonra kısa bir sessizlik, sonra bölüğün sırası.
  useEffect(() => {
    const adet = SATIRLAR[tur].split(' ').length;
    const k = turZamanlari.current;
    for (let i = 1; i <= adet; i++) k.push(z.sonra(i * KELIME_MS, () => setOkunan(i)));
    const sus = adet * KELIME_MS + 120;
    k.push(z.sonra(sus, () => setFaz('sus')));
    // Sessizlik düzensiz: ezberlenmiş ritimle değil kulakla yakalansın.
    const sen = sus + 250 + Math.random() * 450;
    k.push(
      z.sonra(sen, () => {
        senAni.current = Date.now();
        setFaz('sen');
        bildir(Bildirim.Warning);
      }),
    );
    k.push(z.sonra(sen + kotuEsik, () => bitir(0, 'BÖLÜK BİTİRDİ')));
    // bitir her turda yenileniyor; zamanlayıcı yalnızca tur değişince kurulmalı.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tur]);

  const dokun = useCallback(() => {
    if (faz === 'sonuc') return;
    if (faz === 'okuyor' || faz === 'sus') {
      bildir(Bildirim.Error);
      bitir(0, 'TEK BAŞINA BAĞIRDIN');
      return;
    }
    const gecikme = Date.now() - senAni.current;
    const puan = clamp01(1 - (gecikme - iyiEsik) / (kotuEsik - iyiEsik));
    titret(puan > 0.6 ? Siddet.Medium : Siddet.Rigid);
    bitir(puan, puan > 0.8 ? 'BİR AĞIZDAN' : puan > 0.4 ? 'YETİŞTİN' : 'SONDAN GELDİN');
  }, [faz, bitir, iyiEsik, kotuEsik]);

  const hata = mesaj === 'TEK BAŞINA BAĞIRDIN' || mesaj === 'BÖLÜK BİTİRDİ';
  const erken = mesaj === 'TEK BAŞINA BAĞIRDIN';
  // Bölük "ŞİMDİ" anında el göğüste; sen ancak dokununca. Erken dokunan
  // hazırol duran bölüğün içinde tek başına el kaldırmış oluyor.
  const bolukSelam = faz === 'sen' || (faz === 'sonuc' && !hata);
  const benSelam = faz === 'sonuc' && mesaj !== 'BÖLÜK BİTİRDİ';
  const okunanMetin = kelimeler.slice(0, faz === 'okuyor' ? okunan : kelimeler.length).join(' ');
  const g = zeminUstu(SAHNE_H, U, ZEMIN_ORANI);

  return (
    <View style={{ alignItems: 'center', gap: SP.md, width: '100%' }}>
      <PixelText font="command" size="h3" color={C.canvasDim}>
        {`YEMİN ${tur + 1} / ${SATIRLAR.length}`}
      </PixelText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Yemini tekrarla"
        onPress={dokun}
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={{ width: '100%', borderWidth: BORDER, borderColor: faz === 'sen' ? C.brass : C.ink }}
      >
        <Sahne
          yukseklik={SAHNE_H}
          u={U}
          zemin="beton"
          zeminOrani={ZEMIN_ORANI}
          saat="10:30"
          ufukVar={false}
          tohum={26}
        >
          {/* Tribün: aileler; rehberdekiler önde, adlarıyla */}
          {en > 0 && (
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: g - 19 * U }}>
              <Tribun u={U} genislik={en} />
            </View>
          )}
          {izleyen.map((ad, i) => {
            const x = 30 + i * (40 / Math.max(1, izleyen.length - 1 || 1));
            return (
              <React.Fragment key={ad}>
                <Basan sprite={sprite('sivil')} u={U - 1} x={x} alt={g + 2} gecikme={i * 300} />
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: g + 3 * U,
                    marginLeft: -30,
                    width: 60,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ backgroundColor: C.ink, paddingHorizontal: 3 }}>
                    <PixelText size="micro" color={C.canvasDim}>
                      {ad}
                    </PixelText>
                  </View>
                </View>
              </React.Fragment>
            );
          })}

          <Bayrak u={U} x="3%" alt={g + 12} boy={52} />

          {/* Arka sıra ve ön sıra: bölük tören kıyafetiyle */}
          {ARKA_SIRA.map((x, i) => (
            <Basan
              key={`a${i}`}
              sprite={bolukSelam ? ASKER_SELAM : ASKER_HAZIROL}
              u={U - 1}
              x={x}
              alt={g + 56}
              gecikme={(i * 190) % 900}
              opaklik={0.8}
            />
          ))}
          {ON_SIRA.map((x, i) => {
            const ben = i === BEN;
            const selam = ben ? benSelam : bolukSelam && !(faz === 'sonuc' && erken);
            return (
              <Basan
                key={`o${i}`}
                sprite={selam ? ASKER_SELAM : ASKER_HAZIROL}
                u={U}
                x={x}
                alt={g + 104}
                gecikme={(i * 260) % 900}
              />
            );
          })}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: `${ON_SIRA[BEN]}%`,
              top: g + 104 - 24 * U - 6 * U,
              marginLeft: -2 * U,
            }}
          >
            <View style={{ width: 4 * U, height: U, backgroundColor: C.brass }} />
            <View style={{ width: 2 * U, height: U, marginLeft: U, backgroundColor: C.brass }} />
          </View>

          {/* Kürsüde komutan: arkada durup kürsünün üstünden okuyor */}
          <Basan
            sprite={faz === 'okuyor' ? CAVUS_BAGIRIYOR : CAVUS_HAZIROL}
            u={U}
            x={84}
            alt={g + 64}
            nefes={faz !== 'okuyor'}
            golge={false}
          />
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: '84%', top: g + 64 - 12 * U, marginLeft: -10 * U }}
          >
            <PixelSprite sprite={KURSU} scale={U} />
          </View>

          {(faz === 'okuyor' || faz === 'sus') && okunanMetin ? (
            <Balon
              metin={okunanMetin}
              u={U}
              kuyruk="sag"
              style={{ right: '3%', maxWidth: '78%', top: g - 34 * U }}
            />
          ) : null}
          {faz === 'sen' && (
            <Balon
              metin={SATIRLAR[tur]}
              u={U}
              kuyruk="orta"
              style={{ left: '6%', right: '24%', top: g + 2 * U }}
            />
          )}
          {faz === 'sen' && (
            <Damga metin="ŞİMDİ" renk={C.brass} style={{ right: '4%', top: g + 26 * U }} />
          )}
          {faz === 'sonuc' && (
            <Damga
              metin={mesaj}
              renk={hata ? C.rust : C.olive}
              style={{ left: '8%', top: g + 8 * U }}
            />
          )}
        </Sahne>
      </Pressable>

      <PixelText size="small" color={C.canvasFaint} center>
        Komutan satırı bitirince bölükle birlikte dokun. Erken bağıran tek kalır.
      </PixelText>
    </View>
  );
}

const U = 3;
const SAHNE_H = 320;
const ZEMIN_ORANI = 0.52;
/** Ön sıradaki askerler (yüzde); BEN sensin. */
const ON_SIRA = [12, 28, 44, 60];
const BEN = 2;
const ARKA_SIRA = [9, 19, 29, 39, 49, 59, 69];
