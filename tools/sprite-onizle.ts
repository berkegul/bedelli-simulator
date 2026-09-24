/**
 * Sprite doğrulayıcı: satır uzunluklarını ve palet kapsamını kontrol eder,
 * istenirse her sprite'ı terminale basar. Yeni sprite çizdikten sonra:
 *
 *     npm run sprite            # yalnızca sorunlar ve özet
 *     npm run sprite -- --goster          # hepsini çiz
 *     npm run sprite -- --goster ASKER    # adında ASKER geçenleri çiz
 *
 * Eskiden Python'du ve sprites.ts'i regex'le okuyordu; `...ARKA_GOVDE` ya
 * da `rows: TISORT.rows` gibi başka tanımdan türeyen sprite'ları göremeyip
 * çöküyordu. Artık modülü doğrudan içe aktarıyor: yardımcı fonksiyonlarla
 * üretilen kareler de dahil, oyunun gördüğü veriyi doğruluyor.
 */
import * as S from '../src/art/sprites';
import type { SpriteDef } from '../src/ui/PixelSprite';

const argumanlar: string[] = process.argv.slice(2);
const goster = argumanlar.includes('--goster');
const suzgec = argumanlar.find((a) => !a.startsWith('--'))?.toUpperCase();

const spriteMi = (d: unknown): d is SpriteDef =>
  typeof d === 'object' &&
  d !== null &&
  Array.isArray((d as SpriteDef).rows) &&
  typeof (d as SpriteDef).palette === 'object';

/** Kare dizileri (giyinme, gece, sınav) tek tek doğrulanıyor. */
const tanimlar: [string, SpriteDef][] = [];
for (const [ad, deger] of Object.entries(S)) {
  if (spriteMi(deger)) tanimlar.push([ad, deger]);
  else if (Array.isArray(deger))
    deger.forEach((kare, i) => spriteMi(kare) && tanimlar.push([`${ad}[${i}]`, kare]));
}

const sorunlu: string[] = [];
for (const [ad, { palette, rows }] of tanimlar) {
  const durum: string[] = [];
  const uzunluklar = [...new Set(rows.map((r) => r.length))];
  const bilinmeyen = [...new Set(rows.join(''))].filter((c) => c !== '.' && !(c in palette)).sort();

  if (rows.length === 0) durum.push('BOŞ');
  if (uzunluklar.length > 1) durum.push(`HİZASIZ ${uzunluklar.sort((a, b) => a - b).join('/')}`);
  if (bilinmeyen.length) durum.push(`PALETTE YOK: ${bilinmeyen.join(' ')}`);
  if (durum.length) sorunlu.push(ad);

  const ciz = goster && (!suzgec || ad.includes(suzgec));
  if (!durum.length && !ciz) continue;

  const en = Math.max(0, ...uzunluklar);
  console.log(`\n== ${ad}  ${en}x${rows.length}  ${durum.join(' | ') || 'ok'}`);
  if (ciz || durum.length)
    for (const r of rows) console.log(`   ${r.replace(/\./g, ' ')}${r.length !== en ? ' <<' : ''}`);
}

console.log(`\n${'-'.repeat(30)}\n${tanimlar.length} sprite, sorunlu: ${sorunlu.length ? sorunlu.join(', ') : 'yok'}`);
process.exit(sorunlu.length ? 1 : 0);
