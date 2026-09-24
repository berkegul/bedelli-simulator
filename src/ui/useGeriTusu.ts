import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useGame } from '../store/gameStore';
import { geriTusunaBasildi } from './geriTusu';

/**
 * Android geri tuşu. Eskiden hiç dinlenmiyordu ve her durumda uygulamadan
 * çıkarıyordu: kantini kapatmak isteyen oyuncu kendini ana ekranda buluyordu.
 * iOS'ta ve web'de geri tuşu yok, dinleyici hiç tetiklenmiyor.
 */
export function useGeriTusu() {
  useEffect(() => {
    const abone = BackHandler.addEventListener('hardwareBackPress', () =>
      geriTusunaBasildi(useGame.getState()),
    );
    return () => abone.remove();
  }, []);
}
