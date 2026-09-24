import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dostlukDerecesi, karneHesapla } from './karne';

const gorusmeler = [
  { id: 'g1-anne', rol: 'anne' as const },
  { id: 'g2-anne', rol: 'anne' as const },
  { id: 'g3-baba', rol: 'baba' as const },
];

test('karne: ortalama, not dağılımı, en iyi ve en kötü gün', () => {
  const k = karneHesapla(
    [
      { gun: 1, not: 'İDARE EDER', puan: 58 },
      { gun: 2, not: 'TEMİZ İŞ', puan: 70 },
      { gun: 3, not: 'TAKDİR ALDI', puan: 82 },
      { gun: 4, not: 'TEMİZ İŞ', puan: 70 },
    ],
    [],
    gorusmeler,
    { emre: 0, tolga: 0, serkan: 0 },
  );
  assert.equal(k.genel.puan, 70);
  assert.equal(k.genel.ad, 'TEMİZ İŞ');
  assert.deepEqual(k.dagilim, [
    { ad: 'TAKDİR ALDI', adet: 1 },
    { ad: 'TEMİZ İŞ', adet: 2 },
    { ad: 'İDARE EDER', adet: 1 },
  ]);
  assert.equal(k.enIyiGun?.gun, 3);
  assert.equal(k.enKotuGun?.gun, 1);
});

test('karne: en çok konuşulan rol görüşme kaydından sayılıyor', () => {
  const k = karneHesapla([], ['g1-anne', 'g3-baba', 'g2-anne', 'bilinmeyen'], gorusmeler, {
    emre: 0,
    tolga: 0,
    serkan: 0,
  });
  assert.deepEqual(k.enCokKonusulan, { rol: 'anne', adet: 2 });
  assert.equal(k.toplamGorusme, 3);
});

test('karne: hiç gün ve görüşme yoksa çökmeden boş döner', () => {
  const k = karneHesapla([], [], gorusmeler, { emre: 30, tolga: 50, serkan: 5 });
  assert.equal(k.enIyiGun, null);
  assert.equal(k.enCokKonusulan, null);
  assert.deepEqual(
    k.arkadaslar.map((a) => [a.id, a.derece]),
    [
      ['tolga', 'kanka'],
      ['emre', 'yakın'],
      ['serkan', 'uzak'],
    ],
  );
  assert.equal(dostlukDerecesi(10), 'tanıdık');
});
