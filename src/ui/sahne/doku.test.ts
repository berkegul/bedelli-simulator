import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DUVARLAR, ZEMINLER, benek, ufuk } from './doku';

const A = { x: 0, y: 0, w: 120, h: 40 };

test('doku: aynı tohum aynı çizim, farklı tohum farklı', () => {
  assert.deepEqual(ZEMINLER.toprak(A, 3), ZEMINLER.toprak(A, 3));
  assert.notDeepEqual(ZEMINLER.toprak(A, 3), ZEMINLER.toprak(A, 4));
});

test('doku: her piksel alanın içinde ve düğüm sayısı makul', () => {
  const hepsi = [
    ...Object.values(ZEMINLER).map((f) => f(A, 1)),
    ...Object.values(DUVARLAR).map((f) => f(A, 1)),
    ufuk(A, 1, false),
  ];
  for (const liste of hepsi) {
    // Telefon SVG'si yüzlerce düğümü kaldırır, binlercesi kasar.
    assert.ok(liste.length < 1500, `çok düğüm: ${liste.length}`);
    for (const p of liste) {
      assert.ok(p.w > 0 && p.h > 0, 'boş piksel');
      assert.ok(p.x >= A.x - 1 && p.x + p.w <= A.x + A.w + 1, `taşan x ${p.x}+${p.w}`);
    }
  }
});

test('benek: yan yana aynı renk birleşiyor', () => {
  const b = benek({ x: 0, y: 0, w: 50, h: 1 }, [{ c: '#fff', oran: 1 }], 0);
  assert.deepEqual(b, [{ x: 0, y: 0, w: 50, h: 1, c: '#fff' }]);
});
