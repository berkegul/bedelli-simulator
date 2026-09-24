import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useGame } from '../store/gameStore';
import { geriTusunaBasildi } from './geriTusu';
import { useAyarlar } from '../ayarlar';
import { useDuraklat } from './duraklat';

/**
 * Android geri tuşu. Eskiden hiç dinlenmiyordu ve her durumda uygulamadan
 * çıkarıyordu: kantini kapatmak isteyen oyuncu kendini ana ekranda buluyordu.
 * iOS'ta ve web'de geri tuşu yok, dinleyici hiç tetiklenmiyor.
 */
export function useGeriTusu() {
  useEffect(() => {
    const abone = BackHandler.addEventListener('hardwareBackPress', () => {
      const ayarlar = useAyarlar.getState();
      const mola = useDuraklat.getState();
      return geriTusunaBasildi(useGame.getState(), {
        ayarlarAcik: ayarlar.acik,
        ayarlarKapat: ayarlar.kapat,
        molaAcik: mola.acik,
        molaAc: mola.ac,
        molaKapat: mola.kapat,
      });
    });
    return () => abone.remove();
  }, []);
}
