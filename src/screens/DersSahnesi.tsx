import React, { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { ANT41, TOPLAM_MADDE, type AntBolum } from '../content/ant41';
import { Siddet, titret } from '../ui/haptik';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { PixelSprite } from '../ui/PixelSprite';
import { sprite } from '../art';
import { KURSU } from '../art/sahne/alan';
import { DERS_SIRASI } from '../art/sahne/kogusPanel';
import { Golge, Nefes, Sahne } from '../ui/sahne';

const SINIF_Y = 200;
const SINIF_ZEMIN = Math.round(SINIF_Y * 0.3);
const TEBESIR = '#E4E0D0';

/**
 * Sınıf: kara tahtada açık bölümün başlığı tebeşirle, kürsünün yanında
 * Çavuş, önde sıralarda bölüğün sırtı. Tahta başlığı bölüm değiştikçe değişir.
 */
function Sinif({ tahta }: { tahta: string }) {
  const { width } = useWindowDimensions();
  const [en, setEn] = useState(Math.min(width, 480) - 32);
  const zeminY = SINIF_Y - SINIF_ZEMIN;
  const tahtaW = Math.round(en * 0.6);
  return (
    <View
      onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
      style={{ borderWidth: BORDER, borderColor: C.ink, overflow: 'hidden' }}
    >
      <Sahne
        yukseklik={SINIF_Y}
        u={3}
        duvar="badana"
        zemin="parke"
        zeminOrani={SINIF_ZEMIN / SINIF_Y}
        losluk={0.08}
        lambalar={[
          { x: 30, y: 10, yaricap: 30 },
          { x: 72, y: 10, yaricap: 30 },
        ]}
        tohum={9}
      >
        {/* Kara tahta: ahşap çerçeve, tebeşir yazısı, altında tebeşirlik */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: Math.round(en * 0.06),
            top: 16,
            width: tahtaW,
            height: 78,
            backgroundColor: '#2C3A2C',
            borderWidth: 4,
            borderColor: '#6B4A2C',
            paddingHorizontal: 8,
            justifyContent: 'center',
          }}
        >
          <PixelText font="command" size="body" color={TEBESIR} tracking={1} numberOfLines={2}>
            {tahta}
          </PixelText>
          <View
            style={{
              marginTop: 4,
              width: '40%',
              height: 2,
              backgroundColor: TEBESIR,
              opacity: 0.5,
            }}
          />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: Math.round(en * 0.06) + 6,
            top: 16 + 78,
            width: tahtaW - 12,
            height: 4,
            backgroundColor: '#5A3E24',
          }}
        />
        {/* Çavuş kürsüde */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: en * 0.72,
            top: zeminY - 72 + 6,
            alignItems: 'center',
          }}
        >
          <Nefes u={3}>
            <PixelSprite sprite={sprite('cavus')} scale={3} />
          </Nefes>
          <View style={{ marginTop: -3 }}>
            <Golge genislik={12} u={3} opaklik={0.25} />
          </View>
        </View>
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: en * 0.62, top: zeminY - 28 + 8 }}
        >
          <PixelSprite sprite={KURSU} scale={2} />
        </View>
        {/* Önde sıralar ve bölüğün sırtı */}
        {[0.02, 0.3, 0.58].map((x, i) => (
          <React.Fragment key={x}>
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: en * x + 6, top: SINIF_Y - 36 * 1 - 20 }}
            >
              <Nefes u={3} gecikme={i * 300}>
                <PixelSprite sprite={sprite('askerSirt')} scale={3} />
              </Nefes>
            </View>
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: en * x - 12, top: SINIF_Y - 24 }}
            >
              <PixelSprite sprite={DERS_SIRASI} scale={3} />
            </View>
          </React.Fragment>
        ))}
      </Sahne>
    </View>
  );
}

type Props = {
  /** Ders bitince ilerlemek için; salt okuma modunda verilmez. */
  onBitti?: () => void;
  /** Serbest zamanda tekrar bakarken başlık ve buton değişiyor. */
  tekrar?: boolean;
};

/**
 * ANT-41 dersi. Sınav yok, soru sorulmuyor — bu ekran öğretir, sorgulamaz.
 * Oyuncu bölümleri istediği sırada açar; hepsini görmeden ders bitmez ama
 * bir baskı da yoktur, okuma hızını kendisi belirler.
 */
export function DersSahnesi({ onBitti, tekrar }: Props) {
  const [acik, setAcik] = useState<AntBolum | null>(tekrar ? ANT41[0] : null);
  const [okunan, setOkunan] = useState<string[]>(tekrar ? ANT41.map((b) => b.id) : []);

  const hepsi = okunan.length >= ANT41.length;

  const ac = (b: AntBolum) => {
    titret(Siddet.Light);
    setAcik(b);
    setOkunan((o) => (o.includes(b.id) ? o : [...o, b.id]));
  };

  return (
    <View style={{ gap: SP.lg }}>
      <Sinif tahta={acik ? acik.baslik.toLocaleUpperCase('tr-TR') : 'ANT-41 · ASKERÎ NEZAKET'} />
      <View style={{ gap: SP.xs }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
          <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
            ANT-41
          </PixelText>
          <PixelText font="command" size="body" color={hepsi ? C.olive : C.canvasFaint}>
            {`${okunan.length} / ${ANT41.length} bölüm`}
          </PixelText>
        </View>
        <PixelText size="micro" color={C.canvasFaint}>
          {`Askerî nezaket ve protokol kuralları · ${TOPLAM_MADDE} madde`}
        </PixelText>
      </View>

      {/* Bölüm listesi */}
      <View style={{ gap: SP.sm }}>
        {ANT41.map((b) => {
          const secili = acik?.id === b.id;
          const gorulmus = okunan.includes(b.id);
          return (
            <Pressable
              key={b.id}
              accessibilityRole="button"
              accessibilityLabel={b.baslik}
              accessibilityState={{ selected: secili }}
              onPress={() => ac(b)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.md,
                borderWidth: BORDER,
                borderColor: secili ? C.brass : C.ink,
                backgroundColor: secili ? C.surfaceHi : C.surface,
                paddingVertical: SP.md,
                paddingHorizontal: SP.md,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderWidth: BORDER,
                  borderColor: gorulmus ? C.olive : C.line,
                  backgroundColor: gorulmus ? C.olive : 'transparent',
                }}
              />
              <View style={{ flex: 1 }}>
                <PixelText font="bodySemi" size="lead" color={secili ? C.brass : C.canvas}>
                  {b.baslik}
                </PixelText>
                <PixelText size="micro" color={C.canvasFaint}>
                  {`${b.maddeler.length} madde`}
                </PixelText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Seçili bölümün maddeleri: spiralli defter sayfası, kırmızı kenar çizgisi */}
      {acik && (
        <View
          style={{
            backgroundColor: C.kagit,
            borderWidth: BORDER,
            borderColor: C.ink,
            paddingTop: SP.lg,
            paddingBottom: SP.lg,
            paddingLeft: SP.xl + SP.md,
            paddingRight: SP.lg,
            gap: SP.md,
          }}
        >
          {/* Spiral delikleri */}
          <View
            style={{
              position: 'absolute',
              top: 4,
              left: 8,
              right: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <View key={i} style={{ width: 5, height: 5, backgroundColor: C.murekkepSoluk }} />
            ))}
          </View>
          {/* Kenar çizgisi */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: SP.xl,
              width: 2,
              backgroundColor: C.rust,
              opacity: 0.6,
            }}
          />
          <View style={{ gap: SP.xs }}>
            <PixelText font="command" size="lead" color={C.murekkep}>
              {acik.baslik.toLocaleUpperCase('tr-TR')}
            </PixelText>
            <PixelText size="small" color={C.murekkepSoluk} line="body">
              {acik.giris}
            </PixelText>
          </View>

          <View style={{ gap: SP.md }}>
            {acik.maddeler.map((m, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  gap: SP.sm,
                  borderBottomWidth: 1,
                  borderColor: C.kagitCizgi,
                  paddingBottom: SP.xs,
                }}
              >
                <PixelText font="command" size="body" color={C.murekkepSoluk}>
                  {String(i + 1).padStart(2, '0')}
                </PixelText>
                <PixelText size="lead" color={C.murekkep} line="body" style={{ flex: 1 }}>
                  {m}
                </PixelText>
              </View>
            ))}
          </View>
        </View>
      )}

      {!acik && (
        <PixelText size="small" color={C.canvasFaint} center line="snug">
          Bir bölüme dokun ve maddeleri oku.
        </PixelText>
      )}

      {onBitti && (
        <PixelButton
          label={hepsi ? 'Dersi bitir' : `${ANT41.length - okunan.length} bölüm kaldı`}
          tur={hepsi ? 'ana' : 'sessiz'}
          disabled={!hepsi}
          onPress={onBitti}
        />
      )}
    </View>
  );
}
