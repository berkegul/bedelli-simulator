import React, { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { ASKIDA_CEKET, ASMA_KILIT } from '../../art/sahne/kogusPanel';
import { KALITE_ADI, esya, kullanilabilirler } from '../../content/esyalar';
import type { EsyaId } from '../../engine/types';
import { KogusFonu } from '../../minigames/KogusFonu';
import { useSecili } from '../../store/secici';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { PanelKabuk } from './ortak';

const YUKSEKLIK = 300;
const ZEMIN_Y = 262;
const SAC = '#5A6150';
const SAC_AC = '#737A66';
const SAC_KOYU = '#3E4337';
const IC = '#23261F';
const RAF = '#7C8272';
/** Raftaki eşyanın ölçeği (12x12 sprite → 24 nokta) ve arası. */
const ESYA_OLCEK = 2;
const ESYA_ADIM = 12 * ESYA_OLCEK + 6;

type Bolme = { ad: string; ust: number; alt: number; raf: boolean };

/**
 * Serbest zamanda dolabın önü: kapak açık, raflarda sahip olduğun her şey.
 * Rafta dokunduğun eşyanın kartı altta açılıyor; kullanılabiliyorsa oradan.
 */
function DolapSahnesi({
  esyalar,
  secili,
  sec,
  kilitli,
  antVar,
  antAc,
}: {
  esyalar: EsyaId[];
  secili: EsyaId | null;
  sec: (id: EsyaId) => void;
  kilitli: boolean;
  antVar: boolean;
  antAc: () => void;
}) {
  const { width } = useWindowDimensions();
  const [en, setEn] = useState(Math.min(width, 480) - 2 * SP.lg);

  const dolapW = Math.round(Math.max(170, Math.min(250, en * 0.56)));
  const dolapX = Math.round(en - dolapW - en * 0.06);
  const dolapY = 22;
  const dolapH = ZEMIN_Y - dolapY - 4;
  const kapakW = Math.round(dolapW * 0.34);
  const kapakX = dolapX - kapakW - 6;
  const icX = dolapX + 6;
  const icW = dolapW - 12;
  const icY = dolapY + 16;
  const icH = dolapH - 22;
  const kat = (o: number) => Math.round(icY + icH * o);
  const bolmeler: Bolme[] = [
    { ad: 'ÜST RAF', ust: kat(0), alt: kat(0.22), raf: true },
    { ad: 'ASKI', ust: kat(0.22), alt: kat(0.56), raf: false },
    { ad: 'ORTA RAF', ust: kat(0.56), alt: kat(0.77), raf: true },
    { ad: 'ALT GÖZ', ust: kat(0.77), alt: kat(1), raf: true },
  ];
  const raflar = bolmeler.filter((b) => b.raf);
  const kapasite = Math.max(1, Math.floor((icW - 6) / ESYA_ADIM));
  // Eşyalar sırayla raflara: önce üst, sonra orta, en sonda alt göz (iki sıra).
  const yerler: { id: EsyaId; x: number; y: number }[] = [];
  // Alt gözde en fazla iki sıra; fazlası sahnenin altında etiket olarak.
  const sigan = kapasite * (raflar.length + 1);
  const tasan = esyalar.slice(sigan);
  esyalar.slice(0, sigan).forEach((id, i) => {
    const rafNo = Math.min(raflar.length - 1, Math.floor(i / kapasite));
    const sira = i - rafNo * kapasite;
    const raf = raflar[rafNo];
    const satir = Math.floor(sira / kapasite);
    const x = icX + 4 + (sira % kapasite) * ESYA_ADIM;
    const y = raf.alt - 4 - 12 * ESYA_OLCEK - satir * (12 * ESYA_OLCEK + 2);
    yerler.push({ id, x, y });
  });

  return (
    <View style={{ gap: SP.sm }}>
      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={{ height: YUKSEKLIK, borderWidth: BORDER, borderColor: C.ink, overflow: 'hidden' }}
      >
        <KogusFonu en={en} yukseklik={YUKSEKLIK} zeminY={ZEMIN_Y} gece={false} />

        {/* Zemine düşen gölge */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: kapakX + 4,
            top: ZEMIN_Y - 2,
            width: dolapX + dolapW - kapakX + 6,
            height: 8,
            backgroundColor: '#000',
            opacity: 0.35,
          }}
        />

        {/* Açık kapak: iç yüzü, yarıklar, ANT-41 kâğıdı bantlı */}
        <View
          style={{
            position: 'absolute',
            left: kapakX,
            top: dolapY + 4,
            width: kapakW,
            height: dolapH - 8,
            backgroundColor: SAC_KOYU,
            borderWidth: 1,
            borderColor: C.ink,
            alignItems: 'center',
            paddingTop: 8,
            gap: 3,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{ width: kapakW - 16, height: 2, backgroundColor: '#1E211B' }} />
          ))}
          {antVar && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="ANT-41 kâğıdını oku"
              onPress={antAc}
              hitSlop={8}
              style={{
                marginTop: 10,
                width: kapakW - 14,
                height: Math.min(96, dolapH * 0.42),
                backgroundColor: C.kagit,
                borderWidth: 1,
                borderColor: C.kagitCizgi,
                transform: [{ rotate: '-3deg' }],
                padding: 4,
                gap: 3,
              }}
            >
              {/* Bant */}
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  left: (kapakW - 14) / 2 - 10,
                  width: 20,
                  height: 7,
                  backgroundColor: '#C9BE96',
                  opacity: 0.85,
                }}
              />
              <PixelText font="command" size="micro" color={C.murekkep}>
                ANT-41
              </PixelText>
              {[0, 1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={{
                    width: `${88 - (i % 3) * 14}%`,
                    height: 1,
                    backgroundColor: C.murekkepSoluk,
                  }}
                />
              ))}
            </Pressable>
          )}
          {/* Kilit dili ve takılıysa asma kilit */}
          <View
            style={{
              position: 'absolute',
              right: 2,
              top: (dolapH - 8) * 0.44,
              alignItems: 'center',
            }}
          >
            <View style={{ width: 6, height: 12, borderWidth: 2, borderColor: RAF }} />
            {kilitli && (
              <View style={{ marginTop: 1 }}>
                <PixelSprite sprite={ASMA_KILIT} scale={2} />
              </View>
            )}
          </View>
        </View>

        {/* Menteşeler */}
        {[0.14, 0.5, 0.84].map((t) => (
          <View
            key={t}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: kapakX + kapakW,
              top: dolapY + dolapH * t,
              width: dolapX - kapakX - kapakW + 2,
              height: 8,
              backgroundColor: RAF,
              borderWidth: 1,
              borderColor: C.ink,
            }}
          />
        ))}

        {/* Gövde ve iç */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: dolapX,
            top: dolapY,
            width: dolapW,
            height: dolapH,
            backgroundColor: SAC,
            borderWidth: 1,
            borderColor: C.ink,
          }}
        >
          {/* Işık alan üst-sol büküm */}
          <View
            style={{
              position: 'absolute',
              left: 1,
              top: 1,
              right: 1,
              height: 2,
              backgroundColor: SAC_AC,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 1,
              top: 1,
              bottom: 1,
              width: 2,
              backgroundColor: SAC_AC,
            }}
          />
          {/* Pirinç numara plakası */}
          <View
            style={{
              alignSelf: 'center',
              marginTop: 3,
              backgroundColor: '#B98A22',
              borderWidth: 1,
              borderColor: '#6E5214',
              paddingHorizontal: 6,
            }}
          >
            <PixelText font="command" size="micro" color="#3A2A08">
              NO 17
            </PixelText>
          </View>
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: icX,
            top: icY,
            width: icW,
            height: icH,
            backgroundColor: IC,
            borderWidth: 1,
            borderColor: C.ink,
          }}
        />
        {bolmeler.map((b) => (
          <React.Fragment key={b.ad}>
            {/* Raf tahtası: bölmenin altında, üst kenarı ışıklı */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: icX,
                top: b.alt - 3,
                width: icW,
                height: 3,
                backgroundColor: RAF,
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: icX,
                top: b.alt - 3,
                width: icW,
                height: 1,
                backgroundColor: '#9AA08E',
              }}
            />
            {/* Bant etiket */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: icX + icW - 50,
                top: b.ust + 2,
                backgroundColor: C.kagit,
                paddingHorizontal: 3,
                opacity: 0.8,
              }}
            >
              <PixelText font="command" size="micro" color={C.murekkep}>
                {b.ad}
              </PixelText>
            </View>
          </React.Fragment>
        ))}
        {/* Askı: boru ve askıda ceket */}
        {(() => {
          const aski = bolmeler[1];
          return (
            <>
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: icX + 4,
                  top: aski.ust + 10,
                  width: icW - 8,
                  height: 3,
                  backgroundColor: '#8A8F96',
                  borderBottomWidth: 1,
                  borderColor: C.ink,
                }}
              />
              <View
                pointerEvents="none"
                style={{ position: 'absolute', left: icX + 12, top: aski.ust + 6 }}
              >
                <PixelSprite
                  sprite={ASKIDA_CEKET}
                  scale={Math.max(2, Math.floor((aski.alt - aski.ust - 10) / 15))}
                />
              </View>
            </>
          );
        })()}

        {/* Raftaki eşyalar: dokununca kartı açılıyor */}
        {yerler.map(({ id, x, y }) => {
          const t = esya(id);
          const aktif = secili === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={t.ad}
              accessibilityState={{ selected: aktif }}
              onPress={() => sec(id)}
              hitSlop={4}
              style={{
                position: 'absolute',
                left: x - 2,
                top: y - 2,
                padding: 1,
                borderWidth: 1,
                borderColor: aktif ? C.brass : 'transparent',
              }}
            >
              <PixelSprite sprite={sprite(t.sprite)} scale={ESYA_OLCEK} />
            </Pressable>
          );
        })}
      </View>
      {tasan.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SP.xs }}>
          {tasan.map((id) => (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={esya(id).ad}
              onPress={() => sec(id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.xs,
                borderWidth: BORDER,
                borderColor: secili === id ? C.brass : C.line,
                backgroundColor: C.surface,
                paddingHorizontal: SP.sm,
                paddingVertical: 2,
              }}
            >
              <PixelSprite sprite={sprite(esya(id).sprite)} scale={1} />
              <PixelText size="micro" color={C.canvasDim}>
                {esya(id).ad}
              </PixelText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export function DolapPaneli() {
  const g = useSecili('envanter', 'esyaKullan', 'gun', 'panelAc');
  const dolu = Object.entries(g.envanter).filter(([, v]) => (v?.adet ?? 0) > 0);
  const kullanilir = kullanilabilirler(g.envanter);
  const ids = dolu.map(([id]) => id as EsyaId);
  const [secim, setSecim] = useState<EsyaId | null>(null);
  // Seçili eşya bitmişse (son sigara) ilk kullanılabilir olana dön.
  const secili =
    secim && ids.includes(secim)
      ? secim
      : (kullanilir.find((k) => ids.includes(k.id))?.id ?? ids[0] ?? null);
  const kayit = secili ? g.envanter[secili] : undefined;
  const t = secili ? esya(secili) : null;
  const kullanilabilir = !!t && kullanilir.some((k) => k.id === t.id);

  return (
    <PanelKabuk baslik="DOLABIN" alt="Denetimde açık duracak">
      <DolapSahnesi
        esyalar={ids}
        secili={secili}
        sec={setSecim}
        kilitli={(g.envanter.dolapKilidi?.adet ?? 0) > 0}
        antVar={g.gun >= 5}
        antAc={() => g.panelAc('ant41')}
      />

      {dolu.length === 0 ? (
        <PixelText size="lead" color={C.canvasDim} center>
          Dolabın boş. Çarşıda ne aldıysan burada olurdu.
        </PixelText>
      ) : (
        t &&
        kayit && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: SP.md,
              borderWidth: BORDER,
              borderColor: C.line,
              backgroundColor: C.surface,
              padding: SP.md,
            }}
          >
            <PixelSprite sprite={sprite(t.sprite)} scale={3} />
            <View style={{ flex: 1 }}>
              <PixelText font="bodySemi" size="body" color={C.canvas}>
                {t.ad}
              </PixelText>
              <PixelText size="micro" color={C.canvasFaint}>
                {[
                  // Kademesiz üründe kalite yazmak bilgi değil gürültü.
                  t.kademeli ? KALITE_ADI[kayit.kalite] : null,
                  kayit.adet > 1 ? `${kayit.adet} ${t.birim ?? 'adet'}` : null,
                  t.tuketilir && kayit.adet === 1 ? `son bir ${t.birim ?? 'tane'}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ') || t.aciklama.split('.')[0]}
              </PixelText>
            </View>
            {kullanilabilir && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${t.ad} kullan`}
                onPress={() => g.esyaKullan(t.id)}
                style={{
                  borderWidth: BORDER,
                  borderColor: C.ink,
                  backgroundColor: C.surfaceHi,
                  paddingVertical: SP.sm,
                  paddingHorizontal: SP.md,
                }}
              >
                <PixelText font="command" size="body" color={C.brass}>
                  KULLAN
                </PixelText>
              </Pressable>
            )}
          </View>
        )
      )}
      {dolu.length > 0 && (
        <PixelText size="micro" color={C.canvasFaint} center>
          {`Rafta ${dolu.length} kalem · ${kullanilir.length} tanesi şimdi kullanılabilir. Bir eşyaya dokun.`}
        </PixelText>
      )}
    </PanelKabuk>
  );
}
