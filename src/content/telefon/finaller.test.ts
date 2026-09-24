import { test } from 'node:test';
import assert from 'node:assert/strict';
import { epilog } from './finaller';
import type { Hafiza } from './tipler';

test('epilog üç ayrı haftadan satır seçer, birinci gün hepsini doldurmaz', () => {
  const hafiza: Hafiza = {
    ilk_gece: { deger: 'garip', gun: 1 },
    anne_soz: { deger: 'her_aksam', gun: 1 },
    sevgili_ilk: { deger: 'ozledim', gun: 1 },
    randevu_sozu: { deger: 'kabul', gun: 7 },
    kacma_dusundu: { deger: 'evet', gun: 14 },
    son_soz: { deger: 'tesekkur', gun: 25 },
  };
  const satirlar = epilog(hafiza);
  assert.equal(satirlar.length, 3);
  assert.equal(satirlar[0].gun, 1);
  for (let i = 1; i < satirlar.length; i++) assert.ok(satirlar[i].gun - satirlar[i - 1].gun >= 6);
});

test('aralıklı üç satır çıkmazsa kalanlarla tamamlanır', () => {
  const hafiza: Hafiza = {
    ilk_gece: { deger: 'iyi', gun: 1 },
    anne_soz: { deger: 'belirsiz', gun: 1 },
    sayma_karari: { deger: 'sayma', gun: 1 },
  };
  assert.equal(epilog(hafiza).length, 3);
});

test('bilinmeyen değer satır üretmez', () => {
  assert.equal(epilog({ anne_soz: { deger: 'yok_boyle', gun: 1 } }).length, 0);
});
