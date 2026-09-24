/**
 * Oynanış testi: her profil yazılı bütün günleri baştan sona oynayabilmeli.
 * İçerik yazarken takılıp kalan bir sahne (ilerlemeyen blok, eksik tepsi,
 * bozuk görev) burada yakalanır.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { oyna, PROFILLER } from './oyuncu';
import { YAZILMIS_GUN_SAYISI } from '../src/content';

for (const p of PROFILLER) {
  test(`${p.ad} oyuncu yazılı ${YAZILMIS_GUN_SAYISI} günü bitirir`, async () => {
    const gunler = await oyna(p, 7);
    assert.deepEqual(
      gunler.map((g) => g.gun),
      Array.from({ length: YAZILMIS_GUN_SAYISI }, (_, i) => i + 1),
    );
  });
}

test('aynı tohumla aynı oyun: simülasyon tekrarlanabilir', async () => {
  const a = await oyna(PROFILLER[1], 42);
  const b = await oyna(PROFILLER[1], 42);
  assert.deepEqual(a, b);
});

test('28. gün kapanınca oyun karneye çıkıyor', async () => {
  const { useGame } = await import('../src/store/gameStore');
  await oyna(PROFILLER[1], 3);
  assert.equal(YAZILMIS_GUN_SAYISI, 28);
  assert.equal(useGame.getState().ekran, 'karne');
  useGame.getState().finalAc();
  assert.equal(useGame.getState().ekran, 'final');
});
