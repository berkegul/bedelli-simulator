import React from 'react';
import { View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { useAyarlar } from '../ayarlar';
import { useGame } from '../store/gameStore';
import { useDuraklat } from '../ui/duraklat';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';

/**
 * Oyun içinden çıkış. Kayıt her adımda yazıldığı için "ana menü" ilerleme
 * kaybettirmiyor; "Devam et" aynı sahneden açar. Mini oyun sürerken bu menü
 * açılmıyor (düğme gizli, geri tuşu yok sayılıyor): yarım kalan bir tur,
 * zamanlayıcıları durdurulamadığı için kaybedilirdi.
 */
export function DuraklatmaMenusu() {
  const kapat = useDuraklat((s) => s.kapat);
  const ayarlarAc = useAyarlar((s) => s.ac);
  const anaMenu = useGame((s) => s.anaMenu);
  const gun = useGame((s) => s.gun);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 14, 9, 0.86)',
        justifyContent: 'center',
        paddingHorizontal: SP.xl,
      }}
    >
      <View
        style={{
          borderWidth: BORDER,
          borderColor: C.line,
          backgroundColor: C.surface,
          padding: SP.lg,
          gap: SP.md,
          maxWidth: 420,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <PixelText font="command" size="h2" color={C.brass} center tracking={2}>
          MOLA
        </PixelText>
        <PixelText size="small" color={C.canvasDim} center>
          {`${gun}. gün. Kayıt her adımda tutuluyor; çıksan da buradan devam edersin.`}
        </PixelText>
        <PixelButton label="Devam" onPress={kapat} />
        <PixelButton label="Ayarlar" tur="sessiz" onPress={ayarlarAc} />
        <PixelButton
          label="Ana menü"
          tur="sessiz"
          onPress={() => {
            kapat();
            anaMenu();
          }}
        />
      </View>
    </View>
  );
}
