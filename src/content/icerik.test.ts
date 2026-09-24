/**
 * İçerik dosyaları elle yazılıyor ve 23 gün daha eklenecek. Bu testler
 * yazım sırasında kolay kaçan yapısal hataları yakalıyor: tekrarlanan
 * kimlik, sırası kaymış saat, boş blok, eksik gün.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { GUNLER, gunGetir, YAZILMIS_GUN_SAYISI } from './index';
import { dakikaya } from '../engine/zaman';
import { gunGorevleri } from './gorevTakvimi';

test('günler 1\'den başlayıp boşluksuz sıralı', () => {
  GUNLER.forEach((g, i) => assert.equal(g.day, i + 1));
  assert.equal(YAZILMIS_GUN_SAYISI, GUNLER.length);
  for (let n = 1; n <= GUNLER.length; n++) assert.ok(gunGetir(n), `${n}. gün yok`);
  assert.equal(gunGetir(GUNLER.length + 1), undefined);
});

test('sahne kimlikleri bütün oyunda tekil', () => {
  // Kimlikler kayıtta ve "görülmüş" listelerinde tutuluyor; çakışma iki
  // farklı sahneyi aynı sahne sayar.
  const gorulen = new Map<string, number>();
  for (const g of GUNLER)
    for (const b of g.blocks)
      for (const s of b.scenes) {
        assert.ok(!gorulen.has(s.id), `${s.id} hem ${gorulen.get(s.id)}. hem ${g.day}. günde`);
        gorulen.set(s.id, g.day);
      }
});

for (const g of GUNLER) {
  describe(`${g.day}. gün · ${g.title}`, () => {
    test('başlık ve en az bir blok var', () => {
      assert.ok(g.title.trim());
      assert.ok(g.blocks.length > 0);
    });

    test('blok kimlikleri tekil ve gün önekli', () => {
      const ids = g.blocks.map((b) => b.id);
      assert.equal(new Set(ids).size, ids.length);
      for (const id of ids) assert.ok(id.startsWith(`d${g.day}-`), id);
    });

    test('her blokta sahne var', () => {
      for (const b of g.blocks) assert.ok(b.scenes.length > 0, b.id);
    });

    test('bloklar zaman sırasında', () => {
      // Gece yarısını aşan son blok (23:00 → 00:30) sıranın sonunda olabilir.
      let onceki = -1;
      for (const b of g.blocks) {
        const bas = dakikaya(b.from);
        assert.match(b.from, /^\d\d:\d\d$/, b.id);
        assert.match(b.to, /^\d\d:\d\d$/, b.id);
        assert.ok(bas >= onceki, `${b.id} ${b.from} bir önceki bloktan önce`);
        onceki = bas;
      }
    });
  });
}

describe('görev takvimi', () => {
  test('ilk nöbet 10. gece, ondan önce nöbet yok', () => {
    for (let gun = 1; gun < 10; gun++) assert.notEqual(gunGorevleri({ day: gun }).nobet, true, `${gun}. gün`);
    assert.equal(gunGorevleri({ day: 10 }).nobet, true);
  });

  test('aynı gün hem nöbet hem ceza yok', () => {
    for (let gun = 1; gun <= 28; gun++) {
      const g = gunGorevleri({ day: gun });
      assert.ok(!(g.nobet && g.ceza), `${gun}. gün`);
    }
  });

  test('gün dosyası takvimi ezebilir', () => {
    assert.equal(gunGorevleri({ day: 10, gorevler: { nobet: false } }).nobet, false);
    assert.equal(gunGorevleri({ day: 11, gorevler: { ceza: true } }).ceza, true);
  });

  test('yazılı günlere eklenen nöbet ve ceza sahneleri takvimle aynı', () => {
    for (const g of GUNLER) {
      const idler = g.blocks.flatMap((b) => b.scenes.map((s) => s.id));
      const beklenen = gunGorevleri(g);
      assert.equal(idler.some((id) => id.endsWith('-nobet')), !!beklenen.nobet, `${g.day}. gün nöbet`);
      assert.equal(idler.some((id) => id.endsWith('-ceza')), !!beklenen.ceza, `${g.day}. gün ceza`);
    }
  });
});

test('kalkış 2. günden itibaren her gün 05:30', () => {
  // Kalkış saati metinlerde, menüde ve açılış saatinde 05:30 geçiyor (K3).
  for (const g of GUNLER.filter((g) => g.day >= 2)) {
    const kalkis = g.blocks.find((b) => b.id === `d${g.day}-kalkis`);
    assert.equal(kalkis?.from, '05:30', `${g.day}. gün`);
  }
});
