import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { useSecili } from '../store/secici';
import { YAZILMIS_GUN_SAYISI } from '../content';
import { BEDAVA_GUN, TAM_SURUM_ACIK } from '../monetization/entitlements';
import { CentikTakvim } from '../ui/CentikTakvim';
import { useAyarlar } from '../ayarlar';
import { MekanSeridi } from '../ui/MekanSeridi';
import { OnayliButon } from '../ui/OnayliButon';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { GELISTIRME_ACIK } from '../gelistirme/ayar';

/** Başlık açık gökyüzünün önünde de okunsun: koyu, piksel keskin gölge. */
const GOLGE = {
  textShadowColor: C.ink,
  textShadowOffset: { width: 3, height: 3 },
  textShadowRadius: 0,
};

/**
 * Menü oyunun dışında değil: nizamiyenin önünde, sevkiyat kalabalığıyla.
 * Gökyüzü cihazın saatine göre boyanıyor; oyunu gece açan yıldızları,
 * sabah açan şafağı görüyor. Çentikler duvarda, düğmeler altında.
 */
export function MenuEkrani() {
  const g = useSecili(
    'bitenGunler',
    'blokIndex',
    'devamEt',
    'gelistirmeAc',
    'gun',
    'kayitVar',
    'profil',
    'sahneIndex',
    'yeniOyun',
  );
  const inset = useSafeAreaInsets();
  const devamEdilebilir =
    g.kayitVar || g.bitenGunler.length > 0 || g.blokIndex > 0 || g.sahneIndex > 0 || !!g.profil.ad;

  const simdi = useMemo(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingBottom: inset.bottom + SP.xl, flexGrow: 1 }}
    >
      <MekanSeridi blokId="d1-nizamiye" saat={simdi} carpan={2} cercevesiz etiketsiz>
        <View
          style={{
            position: 'absolute',
            top: inset.top + SP.lg,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <PixelText font="command" size={72} color={C.canvas} tracking={2} style={GOLGE}>
            BEDELLİ
          </PixelText>
          <PixelText font="command" size="h2" color={C.brass} tracking={6} style={GOLGE}>
            SİMÜLATÖR
          </PixelText>
        </View>
      </MekanSeridi>

      <View style={{ paddingHorizontal: SP.xl, paddingTop: SP.xl, gap: SP.xl, flexGrow: 1 }}>
        {/* Duvar: çentikler kireç üstüne kazınmış gibi */}
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            gap: SP.sm,
            paddingVertical: SP.md,
            paddingHorizontal: SP.lg,
            borderWidth: BORDER,
            borderColor: C.line,
            backgroundColor: '#2B2719',
          }}
        >
          <CentikTakvim
            bitenGunler={g.bitenGunler}
            aktifGun={g.gun}
            acikGunSayisi={
              TAM_SURUM_ACIK ? YAZILMIS_GUN_SAYISI : Math.min(BEDAVA_GUN, YAZILMIS_GUN_SAYISI)
            }
            aciklamasiz
          />
          <PixelText size="small" color={C.canvasDim} center>
            {g.bitenGunler.length
              ? `${g.bitenGunler.length} çentik. Sivile ${28 - g.bitenGunler.length} gün. Rengi o günün notu.`
              : '28 gün. Her gün 05:30’da başlar.'}
          </PixelText>
        </View>

        <View style={{ gap: SP.sm }}>
          {devamEdilebilir && (
            <PixelButton
              label={
                g.bitenGunler.length || g.blokIndex > 0 ? `Devam et · ${g.gun}. gün` : 'Devam et'
              }
              onPress={g.devamEt}
            />
          )}
          {devamEdilebilir ? (
            <OnayliButon
              label="Baştan başla"
              onayLabel={`${g.gun}. gündeki kayıt silinecek. Emin misin?`}
              onPress={() => void g.yeniOyun()}
            />
          ) : (
            <PixelButton label="Sevk kâğıdını al" onPress={() => void g.yeniOyun()} />
          )}
          <PixelButton label="Ayarlar" tur="sessiz" onPress={useAyarlar.getState().ac} />
        </View>

        {GELISTIRME_ACIK && (
          <View style={{ gap: SP.xs }}>
            <PixelButton label="Geliştirme kontrol alanı" tur="sessiz" onPress={g.gelistirmeAc} />
            <PixelText size="micro" color={C.canvasFaint} center>
              Bütün mekanizmalar tek tek · yayın derlemesinde görünmez
            </PixelText>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
