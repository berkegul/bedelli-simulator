import { registerRootComponent } from 'expo';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

/**
 * Web'de Skia, CanvasKit adında bir WebAssembly modülü. Telefonda motor
 * uygulamanın içinde geliyor, tarayıcıda önce indirilmesi gerekiyor.
 *
 * App'i buradan `import App from './App'` diye çağırmak çalışmıyor:
 * Skia'nın web sürümü modül yüklenirken global.CanvasKit'i okuyup kendini
 * kuruyor, statik import ise App ağacını (ve içindeki Skia'yı) indirme
 * bitmeden değerlendiriyor — Skia boş bir motora bağlanıyor ve yol
 * sahnesi açılırken çöküyordu. Dinamik import yükleme bitene kadar
 * bekletiyor.
 *
 * canvaskit.wasm dosyası `npx setup-skia-web` ile public/ klasörüne
 * kopyalanıyor; postinstall betiği her kurulumdan sonra tazeliyor.
 */
void LoadSkiaWeb().then(async () => {
  const { default: App } = await import('./App');
  registerRootComponent(App);
});
