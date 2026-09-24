import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/**
 * Oyunun sesleri. Dosyalar tools/ses-uret.ts ile sentezleniyor (8-bit, lisans
 * derdi yok); burada yalnızca çalınıyor.
 *
 * Sesler store'dan değil arayüzden tetikleniyor: store saf kalıyor ve Node'da
 * koşan testler ses modülüne hiç dokunmuyor. Oynatıcılar ilk kullanımda
 * kuruluyor ve saklanıyor; aynı ses üst üste gelirse baştan başlıyor.
 *
 * Web'de tarayıcı ilk dokunuştan önce ses çaldırmıyor; o çağrılar sessizce
 * düşüyor, oyun etkilenmiyor.
 */
const EFEKTLER = {
  duduk: require('../../assets/ses/duduk.wav'),
  adim1: require('../../assets/ses/adim1.wav'),
  adim2: require('../../assets/ses/adim2.wav'),
  tik: require('../../assets/ses/tik.wav'),
  tepsi: require('../../assets/ses/tepsi.wav'),
  telefon: require('../../assets/ses/telefon.wav'),
  kontor: require('../../assets/ses/kontor.wav'),
  devriye: require('../../assets/ses/devriye.wav'),
  damga: require('../../assets/ses/damga.wav'),
  atis: require('../../assets/ses/atis.wav'),
  basari: require('../../assets/ses/basari.wav'),
  basarisiz: require('../../assets/ses/basarisiz.wav'),
} as const;

const AMBIYANSLAR = {
  gece: require('../../assets/ses/gece.wav'),
  avlu: require('../../assets/ses/avlu.wav'),
} as const;

export type Efekt = keyof typeof EFEKTLER;
export type Ambiyans = keyof typeof AMBIYANSLAR;

/** Efektlerin sesi; UI tıkı gibi sık sesler için ayrıca kısılıyor. */
const EFEKT_SESI: Partial<Record<Efekt, number>> = { tik: 0.35, adim1: 0.5, adim2: 0.5 };
const AMBIYANS_SESI = 0.3;

let ayar = { efekt: true, ambiyans: true };
const efektler = new Map<Efekt, AudioPlayer>();
let calanAmbiyans: { ad: Ambiyans; oynatici: AudioPlayer } | null = null;

/**
 * Açılışta bir kez. iOS'ta sessiz anahtarı efektleri susturuyor (oyun
 * beklentisi bu); başka uygulamanın müziği kesilmiyor, üstüne karışıyor.
 */
export async function sesHazirla() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: false,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    });
  } catch {
    // web ya da desteklemeyen platform
  }
}

export function sesAyarla(yeni: Partial<typeof ayar>) {
  ayar = { ...ayar, ...yeni };
  if (!ayar.ambiyans) ambiyansCal(null);
}

export function sesCal(ad: Efekt) {
  if (!ayar.efekt) return;
  try {
    let o = efektler.get(ad);
    if (!o) {
      o = createAudioPlayer(EFEKTLER[ad]);
      o.volume = EFEKT_SESI[ad] ?? 1;
      efektler.set(ad, o);
    }
    void o.seekTo(0);
    o.play();
  } catch {
    // ses yoksa oyun sürer
  }
}

/** Döngü ambiyansı; null ya da aynı ad değilse öncekini durdurur. */
export function ambiyansCal(ad: Ambiyans | null) {
  if (calanAmbiyans?.ad === ad) return;
  try {
    calanAmbiyans?.oynatici.pause();
    calanAmbiyans?.oynatici.remove();
  } catch {
    // zaten kapanmış
  }
  calanAmbiyans = null;
  if (!ad || !ayar.ambiyans) return;
  try {
    const o = createAudioPlayer(AMBIYANSLAR[ad]);
    o.loop = true;
    o.volume = AMBIYANS_SESI;
    o.play();
    calanAmbiyans = { ad, oynatici: o };
  } catch {
    // ses yoksa oyun sürer
  }
}
