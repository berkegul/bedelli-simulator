import React from 'react';
import { Group, Picture, Skia, createPicture } from '@shopify/react-native-skia';
import type { SkPicture } from '@shopify/react-native-skia';
import { spriteBantlari, type SpriteDef } from '../PixelSprite';

/**
 * Sprite'lar oyunun her yerinde SVG olarak çiziliyor (bkz. PixelSprite).
 * Yol sahnesi tek bir Skia tuvali olduğu için orada aynı sprite'ın Skia
 * karşılığı gerekiyor — ama veri ortak: PixelSprite'ın derleyicisi
 * yatayda ardışık aynı renk pikselleri banda indiriyor, biz o bantları
 * bir SkPicture'a kaydediyoruz.
 *
 * Kayıt sprite başına bir kez yapılıyor; sahne kare kare yalnızca hazır
 * resmi yeni bir dönüşümle yeniden basıyor. Bu yüzden askerin ölçeği
 * kesirli olabiliyor ve pikseller yine de keskin kalıyor: resim
 * örneklenmiyor, dikdörtgenler yeniden çiziliyor.
 */
const onbellek = new WeakMap<SpriteDef, { resim: SkPicture; w: number; h: number }>();

/**
 * Resmin başlangıcı ayağın bastığı nokta: alt-orta. Sahnedeki her şey
 * (asker, ağaç, hedef bina) zemine basıyor ve ölçeklenirken ayağının
 * kaymaması gerekiyor — çapa orada olunca ölçek dönüşümü kendiliğinden
 * ayaktan büyütüyor.
 */
export function spriteResmi(def: SpriteDef) {
  const hit = onbellek.get(def);
  if (hit) return hit;

  const { bands, w, h } = spriteBantlari(def);
  const solUst = -w / 2;
  const ustSatir = -h;

  // Palet küçük; her renk için tek bir boya yeterli.
  const boyalar = new Map<string, ReturnType<typeof Skia.Paint>>();
  const boya = (renk: string) => {
    let b = boyalar.get(renk);
    if (!b) {
      b = Skia.Paint();
      b.setColor(Skia.Color(renk));
      b.setAntiAlias(false);
      boyalar.set(renk, b);
    }
    return b;
  };

  const resim = createPicture(
    (canvas) => {
      for (const b of bands) {
        canvas.drawRect(Skia.XYWHRect(solUst + b.x, ustSatir + b.y, b.w, 1), boya(b.fill));
      }
    },
    Skia.XYWHRect(solUst, ustSatir, w, h),
  );

  const out = { resim, w, h };
  onbellek.set(def, out);
  return out;
}

type Props = {
  sprite: SpriteDef;
  /** Ayağın bastığı nokta. */
  x: number;
  y: number;
  olcek?: number;
  opaklik?: number;
};

/** Kıpırdamayan sprite'lar için; hareketli olanlar kendi Group'unu kuruyor. */
export function SkiaSprite({ sprite, x, y, olcek = 1, opaklik = 1 }: Props) {
  const { resim } = spriteResmi(sprite);
  return (
    <Group transform={[{ translateX: x }, { translateY: y }, { scale: olcek }]} opacity={opaklik}>
      <Picture picture={resim} />
    </Group>
  );
}
