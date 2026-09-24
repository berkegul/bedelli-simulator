import React from 'react';
import { View } from 'react-native';
import { C, SP } from '../theme';
import { PixelButton } from './PixelButton';
import { PixelText } from './PixelText';
import { raporla } from '../engine/rapor';

type Props = { children: React.ReactNode; onKurtar: () => void };
type Durum = { hata: Error | null };

/**
 * Bir bileşen çökerse bütün uygulama boş ekrana dönüyordu ve oyuncunun
 * geri dönüş yolu yoktu. Hata sınırı ağacı yakalıyor, oyunun dilinde bir
 * ekran gösteriyor; kayıt her adımda yazıldığı için ana menüye dönmek
 * ilerleme kaybettirmiyor. Hata raporlama (Sentry, M6) buraya bağlanacak.
 */
export class HataSiniri extends React.Component<Props, Durum> {
  state: Durum = { hata: null };

  static getDerivedStateFromError(hata: Error): Durum {
    return { hata };
  }

  componentDidCatch(hata: Error) {
    if (__DEV__) console.error('[HataSiniri]', hata);
    raporla(hata, 'HataSiniri');
  }

  render() {
    if (!this.state.hata) return this.props.children;
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', padding: SP.xl, gap: SP.lg }}>
        <PixelText font="command" size="h2" color={C.rust} center>
          BİR ŞEY TERS GİTTİ
        </PixelText>
        <PixelText size="body" color={C.canvasDim} center>
          Onbaşı da ne olduğunu anlamadı. İlerlemen kayıtlı; ana menüden kaldığın yere dönebilirsin.
        </PixelText>
        <PixelButton
          label="Ana menüye dön"
          onPress={() => {
            this.props.onKurtar();
            this.setState({ hata: null });
          }}
        />
      </View>
    );
  }
}
