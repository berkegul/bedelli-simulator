import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import { useGame } from '../store/gameStore';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
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

  return (
    <View style={{ alignItems: 'center', gap: SP.md, width: '100%' }}>
      <PixelText font="command" size="h3" color={C.canvasDim}>
        {`YEMİN ${tur + 1} / ${SATIRLAR.length}`}
      </PixelText>

      {/* Tribün: aile sivil kıyafetle arka sırada */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: SP.md,
          paddingVertical: SP.sm,
          borderBottomWidth: BORDER,
          borderColor: C.line,
          backgroundColor: '#2B2719',
        }}
      >
        <PixelSprite sprite={sprite('bayrak')} scale={2} />
        {izleyen.length ? (
          izleyen.map((ad) => (
            <View key={ad} style={{ alignItems: 'center' }}>
              <PixelSprite sprite={sprite('sivil')} scale={2} />
              <PixelText size="micro" color={C.canvasDim}>
                {ad}
              </PixelText>
            </View>
          ))
        ) : (
          <PixelText size="small" color={C.canvasFaint}>
            Tribün kalabalık; seninkiler arada bir yerde.
          </PixelText>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Yemini tekrarla"
        onPress={dokun}
        style={{
          width: '100%',
          minHeight: 180,
          borderWidth: BORDER,
          borderColor: faz === 'sen' ? C.brass : C.ink,
          backgroundColor: faz === 'sen' ? '#4A4327' : C.surface,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: SP.lg,
          gap: SP.md,
        }}
      >
        <PixelText size="micro" color={C.canvasFaint} tracking={1}>
          {faz === 'sen' ? 'BÖLÜK' : 'KOMUTAN'}
        </PixelText>
        <PixelText font="bodySemi" size="lead" color={C.canvas} center line="body">
          {kelimeler.slice(0, faz === 'okuyor' ? okunan : kelimeler.length).join(' ') || ' '}
        </PixelText>
        {faz === 'sen' && (
          <PixelText font="command" size="h2" color={C.brass}>
            ŞİMDİ
          </PixelText>
        )}
        {faz === 'sonuc' && (
          <PixelText font="command" size="h3" color={hata ? C.rust : C.olive}>
            {mesaj}
          </PixelText>
        )}
      </Pressable>

      <PixelText size="small" color={C.canvasFaint} center>
        Komutan satırı bitirince bölükle birlikte dokun. Erken bağıran tek kalır.
      </PixelText>
    </View>
  );
}
