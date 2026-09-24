import { test } from 'node:test';
import assert from 'node:assert/strict';
import { raporIzniAyarla, raporla, raporlayiciKur } from './rapor';

test('rapor: izin yoksa raporlayıcıya gitmiyor, varsa gidiyor, fırlatmıyor', () => {
  const gelen: string[] = [];
  raporlayiciKur((_, yer) => gelen.push(yer));
  raporIzniAyarla(false);
  raporla(new Error('x'), 'a');
  assert.deepEqual(gelen, []);
  raporIzniAyarla(true);
  raporla(new Error('x'), 'b');
  assert.deepEqual(gelen, ['b']);
  raporlayiciKur(() => {
    throw new Error('raporlayıcı bozuk');
  });
  assert.doesNotThrow(() => raporla(new Error('x'), 'c'));
  raporlayiciKur(null);
  raporIzniAyarla(false);
});
