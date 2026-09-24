import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { OLAY_ADLARI } from './olaylar';

test('firestore.rules olay listesi koddakiyle aynı', () => {
  const kural = readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8');
  const blok = kural.match(/request\.resource\.data\.ad in \[([^\]]*)\]/);
  assert.ok(blok, 'kuralda olay listesi bulunamadı');
  const adlar = [...blok[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort();
  assert.deepEqual(adlar, [...OLAY_ADLARI].sort());
});
