import React, { useCallback, useEffect } from 'react';
import { AppState, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Jersey10_400Regular } from '@expo-google-fonts/jersey-10';
import {
  PixelifySans_400Regular,
  PixelifySans_500Medium,
  PixelifySans_600SemiBold,
  PixelifySans_700Bold,
} from '@expo-google-fonts/pixelify-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { C } from './src/theme';
import { bulutuBosalt } from './src/engine/bulut';
import { useGeriTusu } from './src/ui/useGeriTusu';
import { sesHazirla } from './src/ses';
import { useAyarlar } from './src/ayarlar';
import { AyarlarEkrani } from './src/screens/AyarlarEkrani';
import { HataSiniri } from './src/ui/HataSiniri';
import { useGame } from './src/store/gameStore';
import { MenuEkrani } from './src/screens/MenuEkrani';
import { ProfilEkrani } from './src/screens/ProfilEkrani';
import { CarsiEkrani } from './src/screens/CarsiEkrani';
import { GunBasiEkrani } from './src/screens/GunBasiEkrani';
import { OyunEkrani } from './src/screens/OyunEkrani';
import { GunSonuEkrani } from './src/screens/GunSonuEkrani';
import { KilitEkrani } from './src/screens/KilitEkrani';
import { IcerikSonuEkrani } from './src/screens/IcerikSonuEkrani';
import { GelistirmeEkrani } from './src/gelistirme/GelistirmeEkrani';
import { GelistirmeRozeti } from './src/gelistirme/GelistirmeRozeti';

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontHazir] = useFonts({
    Jersey10_400Regular,
    PixelifySans_400Regular,
    PixelifySans_500Medium,
    PixelifySans_600SemiBold,
    PixelifySans_700Bold,
  });

  const ekran = useGame((s) => s.ekran);
  const hazir = useGame((s) => s.hazir);
  const ilkYukleme = useGame((s) => s.ilkYukleme);
  const ayarlarAcik = useAyarlar((s) => s.acik);

  useEffect(() => {
    void ilkYukleme();
  }, [ilkYukleme]);

  useGeriTusu();

  useEffect(() => {
    void sesHazirla();
    void useAyarlar.getState().yukle();
  }, []);

  // Bulut yazmaları toplanıp aralıklı gidiyor; uygulama arka plana düşerken
  // sonuncusu beklemeden gönderilsin, oyuncu kapatınca kaybolmasın.
  useEffect(() => {
    const abone = AppState.addEventListener('change', (durum) => {
      if (durum !== 'active') void bulutuBosalt();
    });
    return () => abone.remove();
  }, []);

  const yerlesimHazir = useCallback(async () => {
    if (fontHazir && hazir) await SplashScreen.hideAsync();
  }, [fontHazir, hazir]);

  if (!fontHazir || !hazir) return null;

  return (
    // Jestler kökten aşağı dağılıyor: yol sahnesindeki sürükleme bu sarmalın
    // içinde olmazsa dokunmayı hiç görmüyor.
    <HataSiniri onKurtar={() => useGame.getState().anaMenu()}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          {/*
            Oyun alanı en fazla 480 nokta: tablette ve masaüstü tarayıcıda
            düğmeler ekranı boydan boya kaplamasın. Kenarlar en koyu tonda.
          */}
          <View style={{ flex: 1, backgroundColor: C.ink }} onLayout={yerlesimHazir}>
            <View
              style={{
                flex: 1,
                width: '100%',
                maxWidth: 480,
                alignSelf: 'center',
                backgroundColor: C.bg,
              }}
            >
              <StatusBar style="light" />
              {ekran === 'menu' && <MenuEkrani />}
              {ekran === 'profil' && <ProfilEkrani />}
              {ekran === 'carsi' && <CarsiEkrani />}
              {ekran === 'gunBasi' && <GunBasiEkrani />}
              {ekran === 'oyun' && <OyunEkrani />}
              {ekran === 'gunSonu' && <GunSonuEkrani />}
              {ekran === 'kilit' && <KilitEkrani />}
              {ekran === 'icerikSonu' && <IcerikSonuEkrani />}
              {ekran === 'gelistirme' && <GelistirmeEkrani />}
              <GelistirmeRozeti />
              {ayarlarAcik && <AyarlarEkrani />}
            </View>
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </HataSiniri>
  );
}
