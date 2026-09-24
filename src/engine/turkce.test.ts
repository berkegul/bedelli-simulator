import { test } from 'node:test';
import assert from 'node:assert/strict';
import { belirtme, yonelme } from './turkce';

test('yönelme hâli: arkadaş adları', () => {
  assert.equal(yonelme('Serkan'), "Serkan'a");
  assert.equal(yonelme('Emre'), "Emre'ye");
  assert.equal(yonelme('Tolga'), "Tolga'ya");
});

test('yönelme hâli: ünlü uyumu ve Türkçe harfler', () => {
  assert.equal(yonelme('Mehmet'), "Mehmet'e");
  assert.equal(yonelme('Ümit'), "Ümit'e");
  assert.equal(yonelme('Oğuz'), "Oğuz'a");
  assert.equal(yonelme('Ali'), "Ali'ye");
  assert.equal(yonelme('Yıldız'), "Yıldız'a");
  assert.equal(yonelme('İSMAİL'), "İSMAİL'e");
});

test('belirtme hâli: dar ünlü ve kaynaştırma', () => {
  assert.equal(belirtme('Serkan'), "Serkan'ı");
  assert.equal(belirtme('Emre'), "Emre'yi");
  assert.equal(belirtme('Tolga'), "Tolga'yı");
  assert.equal(belirtme('Oğuz'), "Oğuz'u");
  assert.equal(belirtme('Göktürk'), "Göktürk'ü");
  assert.equal(belirtme('Mehmet'), "Mehmet'i");
});
