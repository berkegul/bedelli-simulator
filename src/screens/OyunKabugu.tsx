import React, { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, HIT_SLOP, SP, STAT_COLOR } from '../theme';
import { sprite } from '../art';
import { TUM_STATLAR, kalanGun, toklukDurumu } from '../engine/stats';
import { STAT_META, type StatKey, type Stats } from '../engine/types';
import { saate } from '../engine/zaman';
import { useGame } from '../store/gameStore';
import { useDuraklat } from '../ui/duraklat';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';
import { StatBar } from '../ui/StatBar';

/** Şeritte tam ad sığmıyor; açılan panelde zaten tam hâli yazıyor. */
const KISA: Record<StatKey, string> = {
  kondisyon: 'KOND',
  disiplin: 'DİSİP',
  moral: 'MORAL',
  enerji: 'ENERJİ',
  tokluk: 'TOKLUK',
};

const SEGMENT = 8;

type Props = {
  gun: number;
  gunBasligi: string;
  /** Gün içindeki saat, dakika cinsinden — blok boyunca ilerler. */
  saat: number;
  blokBaslangic?: string;
  blokBitis?: string;
  blokAd?: string;
  stats: Stats;
  para: number;
  delta?: Partial<Stats> & { para?: number };
  /** Sigara içmeyen oyuncuda gösterilmez. */
  nikotin?: number;
  /** Mini oyun sürerken cep kapalı: sayaç işlerken panel açmak haksızlık. */
  cepKapali?: boolean;
  children: React.ReactNode;
};

/**
 * Durum göstergesi ekranın altından üstüne taşındı: saat, blok ve
 * istatistikler tek yerde, tek dokunuşla genişliyor. Altta dururken hem
 * küçük kalıyordu hem de gözün gittiği yerin uzağındaydı.
 */
export function OyunKabugu({
  gun,
  gunBasligi,
  saat,
  blokBaslangic,
  blokBitis,
  blokAd,
  stats,
  para,
  delta,
  nikotin,
  cepKapali,
  children,
}: Props) {
  const inset = useSafeAreaInsets();
  const [acik, setAcik] = useState(false);
  const panelAc = useGame((s) => s.panelAc);
  const duraklatAc = useDuraklat((s) => s.ac);
  const envanter = useGame((s) => s.envanter);
  const cepteIzmarit = useGame((s) => s.cepteIzmarit);
  const sigaraIciyor = useGame((s) => s.profil.sigaraIciyor);

  const telefonVar = (envanter.kamerasizTelefon?.adet ?? 0) > 0;
  const dal = envanter.sigara?.adet ?? 0;
  const cepDolu = telefonVar || dal > 0 || cepteIzmarit > 0;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View
        style={{
          paddingTop: inset.top + SP.sm,
          backgroundColor: C.ink,
          borderBottomWidth: BORDER,
          borderBottomColor: C.line,
        }}
      >
        {/* Gün ve sivile kalan: gün boyunca değişmeyen çerçeve */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: SP.sm,
            paddingHorizontal: SP.lg,
          }}
        >
          <PixelText font="command" size="body" color={C.brass}>
            {`GÜN ${String(gun).padStart(2, '0')}`}
          </PixelText>
          <PixelText font="bodyMed" size="small" color={C.canvasDim} style={{ flex: 1 }} numberOfLines={1}>
            {gunBasligi}
          </PixelText>
          <PixelText font="command" size="small" color={C.canvasFaint}>
            {`SİVİLE ${kalanGun(gun)} GÜN`}
          </PixelText>
        </View>

        {/* Saat, blok ve cep: gün içinde akan satır */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SP.md,
            paddingHorizontal: SP.lg,
            marginTop: SP.xs,
          }}
        >
          <PixelText font="command" size="h3" color={C.canvas}>
            {saate(saat)}
          </PixelText>

          <View style={{ flex: 1 }}>
            {blokAd && (
              <PixelText font="bodySemi" size="small" color={C.canvasDim} numberOfLines={1}>
                {blokAd}
              </PixelText>
            )}
            {blokBaslangic && (
              <PixelText size="micro" color={C.canvasFaint}>
                {`${blokBaslangic} — ${blokBitis}`}
              </PixelText>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.xs }}>
            <PixelText font="command" size="body" color={C.brass}>
              {`${para} TL`}
            </PixelText>
            {delta?.para !== undefined && delta.para !== 0 && (
              <PixelText font="command" size="small" color={delta.para > 0 ? C.olive : C.rust}>
                {delta.para > 0 ? `+${delta.para}` : `${delta.para}`}
              </PixelText>
            )}
          </View>

          {!cepKapali && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cebine bak"
              hitSlop={HIT_SLOP}
              onPress={() => panelAc('cep')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.xs,
                borderWidth: BORDER,
                borderColor: cepDolu ? C.line : C.canvasFaint,
                backgroundColor: C.surface,
                paddingHorizontal: SP.sm,
                paddingVertical: SP.xs,
              }}
            >
              <PixelSprite
                sprite={sprite(telefonVar ? 'telefon' : 'sigara')}
                scale={2}
                opacity={cepDolu ? 1 : 0.5}
              />
              <PixelText font="command" size="body" color={cepDolu ? C.brass : C.canvasFaint}>
                CEP
              </PixelText>
            </Pressable>
          )}

          {!cepKapali && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mola ver"
              hitSlop={HIT_SLOP}
              onPress={duraklatAc}
              style={{
                borderWidth: BORDER,
                borderColor: C.line,
                backgroundColor: C.surface,
                paddingHorizontal: SP.sm,
                paddingVertical: SP.xs,
              }}
            >
              <PixelText font="command" size="body" color={C.canvasDim}>
                ||
              </PixelText>
            </Pressable>
          )}
        </View>

        {/* Beş gösterge tek satırda; dokununca tam panel açılıyor */}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: acik }}
          accessibilityLabel={acik ? 'Durum panelini kapat' : 'Durum panelini aç'}
          onPress={() => setAcik((o) => !o)}
          style={{ paddingHorizontal: SP.lg, paddingTop: SP.sm, paddingBottom: SP.sm }}
        >
          <View style={{ flexDirection: 'row', gap: SP.sm }}>
            {TUM_STATLAR.map((k) => (
              <Cetele key={k} stat={k} value={stats[k]} delta={delta?.[k]} />
            ))}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SP.sm, marginTop: SP.xs }}>
            <PixelText font="command" size="small" color={stats.tokluk < 35 ? C.rust : C.canvasFaint}>
              {toklukDurumu(stats.tokluk)}
            </PixelText>
            {nikotin !== undefined && nikotin > 25 && (
              <PixelText
                font="command"
                size="small"
                color={nikotin >= 85 ? C.rust : nikotin >= 55 ? C.tea : C.canvasDim}
              >
                {nikotin >= 85 ? 'SİGARA KRİZİ' : nikotin >= 55 ? 'ÇOK İSTİYOR' : 'CANIN ÇEKTİ'}
              </PixelText>
            )}
            <View style={{ flex: 1 }} />
            <PixelText font="command" size="small" color={C.brass}>
              {acik ? 'KAPAT' : 'DURUM'}
            </PixelText>
          </View>
        </Pressable>

        {acik && (
          <View
            style={{
              paddingHorizontal: SP.lg,
              paddingBottom: SP.lg,
              paddingTop: SP.md,
              gap: SP.md,
              borderTopWidth: BORDER,
              borderTopColor: C.line,
              backgroundColor: C.bg,
            }}
          >
            {TUM_STATLAR.map((k) => (
              <View key={k} style={{ gap: 2 }}>
                <StatBar stat={k} value={stats[k]} delta={delta?.[k]} />
                <PixelText size="micro" color={C.canvasFaint}>
                  {STAT_META[k].ipucu}
                </PixelText>
              </View>
            ))}

            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
              <PixelText font="bodyMed" size="small" color={C.canvasDim} style={{ flex: 1 }}>
                Kantin hesabı
              </PixelText>
              <PixelText font="command" size="lead" color={C.brass}>
                {`${para} TL`}
              </PixelText>
            </View>

            {sigaraIciyor && nikotin !== undefined && (
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
                <PixelText font="bodyMed" size="small" color={C.canvasDim} style={{ flex: 1 }}>
                  Sigara isteği
                </PixelText>
                <PixelText font="command" size="lead" color={nikotin >= 55 ? C.rust : C.canvasDim}>
                  {`${nikotin}`}
                </PixelText>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

/** Şeritteki tek gösterge: ad, değer, ince çubuk. */
function Cetele({ stat, value, delta }: { stat: StatKey; value: number; delta?: number }) {
  const renk = STAT_COLOR[stat];
  const dolu = Math.round((value / 100) * SEGMENT);
  const [vurgu] = useState(() => new Animated.Value(0));

  // Değer değişince gösterge bir kez zıplıyor: sayının kıpırdadığı
  // gözden kaçmıyor, oyuncu seçiminin karşılığını görüyor.
  useEffect(() => {
    if (!delta) return;
    vurgu.setValue(0);
    Animated.sequence([
      Animated.timing(vurgu, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(vurgu, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delta, value, vurgu]);

  return (
    <Animated.View
      style={{
        flex: 1,
        gap: 2,
        transform: [
          { scale: vurgu.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) },
        ],
      }}
    >
      <PixelText font="bodyMed" size="micro" color={C.canvasFaint} numberOfLines={1}>
        {KISA[stat]}
      </PixelText>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
        <PixelText font="command" size="lead" color={renk}>
          {value}
        </PixelText>
        {delta !== undefined && delta !== 0 && (
          <PixelText font="command" size="small" color={delta > 0 ? C.olive : C.rust}>
            {delta > 0 ? `+${delta}` : `${delta}`}
          </PixelText>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: 1 }}>
        {Array.from({ length: SEGMENT }, (_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 5,
              backgroundColor: i < dolu ? renk : C.ink,
              opacity: i < dolu ? 1 : 0.55,
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
}
