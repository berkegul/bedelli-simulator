import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blokSonu, blokSuresi, dakikaya, kalanSure, sahneSaati, saate } from './zaman';
import { havaDurumu, zeminTipi } from './hava';
import type { TimeBlock } from './types';

const blok = (from: string, to: string, sahne = 3) =>
  ({ id: 'd1-x', from, to, title: '', scenes: Array(sahne).fill({}) }) as unknown as TimeBlock;

test('dakikaya / saate gidiş dönüş', () => {
  assert.equal(dakikaya('06:30'), 390);
  assert.equal(saate(390), '06:30');
  assert.equal(saate(1440 + 15), '00:15');
  assert.equal(saate(-30), '23:30');
});

test('gece yarısını aşan blok süresi', () => {
  assert.equal(blokSuresi(blok('23:00', '00:30')), 90);
  assert.equal(blokSuresi(blok('06:00', '06:30')), 30);
});

test('sahne saati blok içinde ilerler ve bitişe değmez', () => {
  const b = blok('06:00', '07:00', 3);
  const saatler = [0, 1, 2].map((i) => sahneSaati(b, i));
  assert.equal(saatler[0], 360);
  assert.ok(saatler[1] > saatler[0] && saatler[2] > saatler[1]);
  assert.ok(saatler[2] < dakikaya('07:00'));
  assert.equal(blokSonu(b), 419);
});

test('kalanSure insan diliyle', () => {
  assert.equal(kalanSure(35), '35 dk');
  assert.equal(kalanSure(60), '1 sa');
  assert.equal(kalanSure(70), '1 sa 10 dk');
  assert.equal(kalanSure(-5), '0 dk');
});

test('hava ve zemin deterministik: kayıttan dönünce değişmez', () => {
  for (let gun = 1; gun <= 28; gun++)
    for (let b = 0; b < 12; b++) {
      assert.equal(havaDurumu(gun, b), havaDurumu(gun, b));
      assert.equal(zeminTipi(gun, b), zeminTipi(gun, b));
    }
});

test('hava gün içinde en fazla bir kez döner', () => {
  for (let gun = 1; gun <= 28; gun++) {
    const farkli = new Set(Array.from({ length: 12 }, (_, b) => havaDurumu(gun, b)));
    assert.ok(farkli.size <= 2, `${gun}. gün: ${[...farkli]}`);
  }
});
