import type { MiniGameId } from '../engine/types';

/** Elin gösterdiği hareket: dokun, basılı tut, ov, aşağı çek, sürükle. */
export type Hareket = 'dokun' | 'tut' | 'ov' | 'cek' | 'surukle';

/**
 * Her mini oyunun ilk açılışında bir kez gösterilen "nasıl oynanır" kartı.
 * Tek cümle ve bir el hareketi; oyunun kendi alt satırındaki ipucunun yerini
 * tutmuyor, oyuncu süre işlemeye başlamadan ne yapacağını biliyor.
 */
export const OGRETICI: Record<MiniGameId, { hareket: Hareket; metin: string }> = {
  yatak: {
    hareket: 'dokun',
    metin: 'Gösterge gidip geliyor. Yeşil alanın içindeyken dokun; üç kat, üç dokunuş.',
  },
  ictima: {
    hareket: 'dokun',
    metin: 'Komut ekrana düştüğü anda dokun. Erken dokunan hizadan çıkar.',
  },
  yurumek: {
    hareket: 'dokun',
    metin: 'Her adımda bir dokun, tempoyu tut. Tempo yavaş yavaş artıyor.',
  },
  silah: {
    hareket: 'dokun',
    metin: 'Parçaları sökme sırasıyla seç. Yanlış parça ceza puanı yazar.',
  },
  nobet: {
    hareket: 'dokun',
    metin: 'Ara ara dokunup uyanık kal. Devriye göründüğünde hemen ayağa kalk.',
  },
  izmarit: {
    hareket: 'dokun',
    metin: 'Yerdeki izmaritlere dokunup topla. Süre bitince kalanlar senin hanene yazılır.',
  },
  ceza: {
    hareket: 'tut',
    metin: 'Basılı tut: in. Bırak: kalk. Göğüs yere değmeden kalkan şınav sayılmaz.',
  },
  giyinme: {
    hareket: 'surukle',
    metin: 'Rafı açıp sıradaki parçayı bul, askerin üstüne sürükle. Dolabı ilk gün nasıl dizdiysen orada.',
  },
  postal: {
    hareket: 'ov',
    metin: 'Parmağınla postalı ileri geri ov. İki postal da parlamadan bitmez.',
  },
  tiras: {
    hareket: 'cek',
    metin: 'Jileti yukarıdan aşağı, sakin çek. Hızlı çekersen keser.',
  },
  gece: {
    hareket: 'surukle',
    metin: 'Üniformayı askerden alıp yerine sürükle, sonra pijamayı dolaptan al. Işıklar 22:00’de sönüyor.',
  },
  atis: {
    hareket: 'tut',
    metin: 'Basılı tut: nefesini tut, nişan otursun. Bırak: tetik. Uzun tutarsan nişan titrer.',
  },
  yemin: {
    hareket: 'dokun',
    metin: 'Komutan satırı okur. Bitince "ŞİMDİ" yanar: bölükle birlikte dokun. Erken bağıran tek kalır.',
  },
};
