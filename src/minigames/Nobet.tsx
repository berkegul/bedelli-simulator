import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BORDER, C, SP } from '../theme';
import { sprite } from '../art';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { ASKER_HAZIROL, CAVUS_BAGIRIYOR, CAVUS_HAZIROL, NOBET_KULUBESI } from '../art/sahne/alan';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { PikselKatman, Sahne, ZEMINLER, type Piksel } from '../ui/sahne';
import { Balon, Basan, Damga, Projektor, Zzz, zeminUstu } from './alanSahnesi';
import { clamp01, type MiniOyunProps } from './types';
import { useZamanlayici } from '../ui/useZamanlayici';
import { sesCal } from '../ses';

const SURE = 26000;

/** Sahne ölçüsü. */
const U = 3;
/** Kulübe ve nöbetçi yakın planda: sahnenin yarısına yakın boy. */
const B = 5;
const SAHNE_H = 300;
const ZEMIN_ORANI = 0.4;
/** Kulübenin sol kenarı ve nöbetçinin yeri (yüzde). */
const KULUBE_X = 8;
const NOBETCI_X = 56;
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
  const [en, setEn] = useState(0);
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
  /** Ayakların bastığı çizgi: ön planda, zeminin ortası. */
  const taban = g + 26 * U;
  const kulubeW = NOBET_KULUBESI.rows[0].length * B;
  const kulubeMerkez = en ? (((en * KULUBE_X) / 100 + kulubeW / 2) / en) * 100 : KULUBE_X + 12;
  const lambalar = [
    // Kulübenin saçağındaki ampul: sarı havuz kapıya ve askere düşüyor
    { x: kulubeMerkez, y: ((taban - 24 * B) / SAHNE_H) * 100, yaricap: 26, guc: 0.34 },
    // Projektör: yere düşen geniş havuz
    { x: 72, y: ((taban - 2 * U) / SAHNE_H) * 100, yaricap: 44, guc: 0.22 },
    ...(faz === 'devriye'
      ? [{ x: 90, y: ((g + 4 * U) / SAHNE_H) * 100, yaricap: 10, guc: 0.45 }]
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
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={{ borderWidth: BORDER, borderColor: faz === 'devriye' ? C.brass : C.ink }}
      >
        <Sahne
          yukseklik={SAHNE_H}
          u={U}
          zemin="toprak"
          zeminOrani={ZEMIN_ORANI}
          saat="20:30"
          lambalar={lambalar}
          tohum={10}
        >
          {en > 0 && (
            <>
              {/* Uzakta koğuş binası: karanlık, iki pencere hâlâ yanık */}
              <PikselKatman
                pikseller={kisla(Math.ceil(en / U))}
                u={U}
                w={Math.ceil(en / U)}
                h={18}
                style={{ position: 'absolute', left: 0, top: g - 18 * U }}
              />
              {/* Tel örgü hattı: direkler, kafes, üstte dikenli tel */}
              <PikselKatman
                pikseller={telOrgu(Math.ceil(en / U))}
                u={U}
                w={Math.ceil(en / U)}
                h={16}
                style={{ position: 'absolute', left: 0, top: g - 12 * U }}
              />
              {/* Kulübe önü beton: nöbet yeri */}
              <PikselKatman
                pikseller={ZEMINLER.beton({ x: 0, y: 0, w: Math.ceil((en * 0.62) / U), h: 16 }, 4)}
                u={U}
                w={Math.ceil((en * 0.62) / U)}
                h={16}
                style={{ position: 'absolute', left: 0, top: taban - 10 * U }}
              />
            </>
          )}
          <Projektor u={U} x="80%" alt={taban - 6 * U} boy={44} />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: `${KULUBE_X}%`,
              top: taban - NOBET_KULUBESI.rows.length * B + 2 * B,
            }}
          >
            <PixelSprite sprite={NOBET_KULUBESI} scale={B} />
            {/* Saçaktaki ampul */}
            <View
              style={{
                position: 'absolute',
                left: kulubeW / 2 - B,
                top: 5 * B,
                width: 2 * B,
                height: B,
                backgroundColor: '#FFE08A',
              }}
            />
          </View>

          {oturuyor ? (
            <Basan sprite={sprite('oturanAsker')} u={B} x={NOBETCI_X - 4} alt={taban + 2 * B} />
          ) : (
            <Basan sprite={ASKER_HAZIROL} u={B} x={NOBETCI_X} alt={taban} />
          )}
          {faz === 'nobet' && uykulu && (
            <Zzz u={U} style={{ left: `${NOBETCI_X}%`, top: taban - 22 * B }} />
          )}

          {/* Devriye: uzaktan fenerle geliyor; yakalayınca yanına dikiliyor */}
          {faz === 'devriye' && <Basan sprite={CAVUS_HAZIROL} u={U - 1} x={90} alt={g + 12 * U} />}
          {faz === 'yakalandi' && (
            <>
              <Basan sprite={CAVUS_BAGIRIYOR} u={B - 1} x={82} alt={taban} nefes={false} />
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

// ─────────────────────────────────────────── sahne dokuları

/** Uzak koğuş binası: düz çatı, sıra pencere; ikisi yanık. */
function kisla(w: number): Piksel[] {
  const x0 = Math.round(w * 0.36);
  const x1 = Math.round(w * 0.98);
  const out: Piksel[] = [
    { x: x0, y: 4, w: x1 - x0, h: 14, c: '#23251E' },
    { x: x0 - 1, y: 3, w: x1 - x0 + 2, h: 1, c: '#2E3028' },
    { x: x0 + 3, y: 0, w: 2, h: 3, c: '#23251E' },
  ];
  let i = 0;
  for (let x = x0 + 3; x < x1 - 3; x += 5) {
    for (const y of [7, 12]) {
      const yanik = i === 3 || i === 8;
      out.push({ x, y, w: 2, h: 3, c: yanik ? '#E8C060' : '#30332A' });
      if (yanik) out.push({ x: x - 1, y: y + 3, w: 4, h: 1, c: '#E8C060', o: 0.25 });
      i++;
    }
  }
  return out;
}

/** Tel örgü: direk, çapraz kafes, gergi telleri, dikenli üst tel. */
function telOrgu(w: number): Piksel[] {
  const out: Piksel[] = [];
  const H = 16;
  for (let y = 3; y < H - 1; y++) {
    for (let x = 0; x < w; x++) {
      if ((x + y) % 6 === 0 || (x - y + 600) % 6 === 0) {
        out.push({ x, y, w: 1, h: 1, c: '#6A6D62', o: 0.55 });
      }
    }
  }
  for (const y of [3, 9, H - 2]) out.push({ x: 0, y, w, h: 1, c: '#85887C' });
  for (let x = 1; x < w; x += 12) {
    out.push({ x, y: 0, w: 1, h: H, c: '#9A9C92' }, { x: x + 1, y: 0, w: 1, h: H, c: '#55584E' });
  }
  for (let x = 0; x < w; x += 3) out.push({ x, y: 1, w: 1, h: 1, c: '#9A9C92' });
  out.push({ x: 0, y: 2, w, h: 1, c: '#6A6D62' });
  return out;
}
