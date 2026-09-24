import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buluttanOku, sureli } from './bulut';

const bekle = <T>(ms: number, deger: T) => new Promise<T>((coz) => setTimeout(() => coz(deger), ms));

test('sureli: iş zamanında biterse sonucu döner', async () => {
  assert.equal(await sureli(bekle(5, 'kayit'), 200, null), 'kayit');
});

test('sureli: iş gecikirse yedeğe düşer', async () => {
  const bas = Date.now();
  assert.equal(await sureli(bekle(500, 'kayit'), 30, null), null);
  assert.ok(Date.now() - bas < 300);
});

test('Firebase kurulu değilken bulut sessizce boş döner', async () => {
  assert.equal(await buluttanOku(), null);
});
