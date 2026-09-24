import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buluttanOku, firestoreIcin, sureli } from './bulut';
import type { SaveData } from './save';

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

test('firestoreIcin tanımsız alanları atar, gerisine dokunmaz', () => {
  const kayit = {
    version: 3,
    gun: 4,
    rehber: [{ id: 'k1', ad: 'Annem', yakinlik: 'Annem', rol: 'ev', tur: undefined }],
    dolapDuzeni: null,
    saat: undefined,
  } as unknown as SaveData;
  const temiz = firestoreIcin(kayit) as unknown as Record<string, unknown>;
  assert.equal('saat' in temiz, false);
  assert.equal('tur' in (temiz.rehber as Record<string, unknown>[])[0], false);
  assert.equal(temiz.dolapDuzeni, null);
  assert.equal(temiz.gun, 4);
});
