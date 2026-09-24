import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { useAyarlar } from '../ayarlar';
import { useGame } from '../store/gameStore';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';

/** Madde işaretli satır. */
function Madde({ baslik, children }: { baslik: string; children: string }) {
  return (
    <View style={{ gap: 2, borderLeftWidth: 4, borderLeftColor: C.brass, paddingLeft: SP.md }}>
      <PixelText font="command" size="body" color={C.brass}>
        {baslik}
      </PixelText>
      <PixelText size="body" color={C.canvas} line="body">
        {children}
      </PixelText>
    </View>
  );
}

/**
 * İlk açılışta, oyundan önce (KVKK, yayin-plani.md · M5). Seçilene kadar
 * bulut yedeği de kullanım verisi de kapalı; seçim ayarlardan değişir.
 * Metin taslak: yayından önce hukuki kontrolden geçecek.
 */
export function OnayEkrani() {
  const inset = useSafeAreaInsets();
  const degistir = useAyarlar((s) => s.degistir);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: C.bg,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: inset.top + SP.xl,
          paddingBottom: inset.bottom + SP.xl,
          paddingHorizontal: SP.xl,
          gap: SP.lg,
        }}
      >
        <PixelText font="command" size="h2" color={C.canvas} tracking={1}>
          VERİLERİN
        </PixelText>
        <PixelText size="lead" color={C.canvasDim} line="body">
          Oyun telefonunda çalışır, internetsiz de oynanır. İzin verirsen şu ikisi buluta gider:
        </PixelText>

        <Madde baslik="İLERLEME YEDEĞİ">
          Kayıt dosyan: künyeye yazdığın ad ve rehbere eklediğin kişilerin adları da içinde. Telefon
          değiştirirsen oyunun kaldığı yerden devam etsin diye.
        </Madde>
        <Madde baslik="KULLANIM VERİSİ">
          Hangi günde bıraktığın, çarşıda ne kadar harcadığın gibi anonim oyun olayları. Oyunu
          dengelemek için.
        </Madde>

        <View
          style={{
            borderWidth: BORDER,
            borderColor: C.line,
            backgroundColor: C.surface,
            padding: SP.md,
            gap: SP.xs,
          }}
        >
          <PixelText size="small" color={C.canvasDim} line="body">
            Hesap açmazsın; cihazına rastgele bir kimlik verilir. Veriler Google Firebase
            sunucularında (yurt dışında) saklanır, reklam için kullanılmaz, kimseyle paylaşılmaz.
            Ayarlardan istediğin an kapatabilirsin; yedeği kapatınca buluttaki kopya silinir.
          </PixelText>
        </View>

        <View style={{ gap: SP.sm }}>
          <PixelButton
            label="Kabul, yedekle"
            onPress={() => {
              degistir({ bulutIzni: true, olcumIzni: true });
              // Telefon değiştiren oyuncu: açılışta izin yoktu, bulut okunmadı.
              // Cihazda kayıt yoksa şimdi buluttan geri yüklensin.
              if (!useGame.getState().kayitVar) void useGame.getState().ilkYukleme();
            }}
          />
          <PixelButton
            label="Yalnızca cihazda oyna"
            tur="sessiz"
            onPress={() => degistir({ bulutIzni: false, olcumIzni: false })}
          />
        </View>
      </ScrollView>
    </View>
  );
}
