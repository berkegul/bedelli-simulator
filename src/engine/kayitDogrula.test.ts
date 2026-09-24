import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { kayitDogrula } from './kayitDogrula';

const gecerli = () => ({
  version: 3,
  profil: { ad: 'Berke', sigaraIciyor: true },
  hazirlikBitti: true,
  gun: 4,
  blokIndex: 2,
  sahneIndex: 1,
  saat: 420,
  stats: { kondisyon: 55, disiplin: 60, moral: 48, enerji: 70, tokluk: 66 },
  para: 1800,
  envanter: { sigara: { adet: 12, kalite: 'orta' } },
  dolapDuzeni: { yerler: { fanila: 'ust' } },
  bekleyenKusurlar: [{ kaynak: 'yatak', puan: 0.4 }],
  dostluk: { emre: 12, tolga: 3, serkan: 8 },
  gorulmusDiyaloglar: ['d1'],
  rehber: [{ id: 'k1', ad: 'Annem', yakinlik: 'Annem', rol: 'ev' }],
  nikotin: 30,
  bitenGunler: [{ gun: 1, not: 'TEMİZ İŞ', puan: 66 }],
  iliski: { anne: 70 },
  gerilim: { anne: 5 },
  ozlem: 22,
  hafiza: { ilk_gece: { deger: 'garip', gun: 1 } },
  sonArama: { anne: 3 },
  gorulmusGorusmeler: ['g01-anne'],
  sevgiliVar: false,
  guncelleme: 1_700_000_000_000,
});

describe('reddedilen kayıtlar', () => {
  for (const [ad, ham] of [
    ['null', null],
    ['dizi', []],
    ['boş nesne', {}],
    ['bilinmeyen sürüm', { ...gecerli(), version: 9 }],
    ['v1', { ...gecerli(), version: 1 }],
    ['stats yok', { ...gecerli(), stats: undefined }],
    ['stats eksik alanlı', { ...gecerli(), stats: { kondisyon: 50 } }],
    ['stats metin', { ...gecerli(), stats: { ...gecerli().stats, moral: '50' } }],
    ['gün metin', { ...gecerli(), gun: '4' }],
    ['gün sıfır', { ...gecerli(), gun: 0 }],
    ['blok negatif', { ...gecerli(), blokIndex: -1 }],
    ['profil adı yok', { ...gecerli(), profil: {} }],
    ['para NaN', { ...gecerli(), para: NaN }],
  ] as const) {
    test(ad, () => assert.equal(kayitDogrula(ham), null));
  }
});

test('geçerli v3 kaydı olduğu gibi döner', () => {
  // Kayıt JSON olarak saklanıyor; tanımsız opsiyonel alanlar orada düşüyor.
  assert.deepEqual(JSON.parse(JSON.stringify(kayitDogrula(gecerli()))), gecerli());
});

test('v2 kaydı v3e taşınır, telefon alanları boş kalır', () => {
  const { iliski, gerilim, ozlem, hafiza, sonArama, gorulmusGorusmeler, sevgiliVar, ...v2 } = gecerli();
  void [iliski, gerilim, ozlem, hafiza, sonArama, gorulmusGorusmeler, sevgiliVar];
  const k = kayitDogrula({ ...v2, version: 2 });
  assert.equal(k?.version, 3);
  assert.equal(k?.gun, 4);
  assert.equal(k?.iliski, undefined);
});

test('opsiyonel alan yanlış tipteyse düşer, kayıt kurtulur', () => {
  const k = kayitDogrula({
    ...gecerli(),
    iliski: 'bozuk',
    dostluk: { emre: 'çok' },
    gorulmusDiyaloglar: 5,
    rehber: [{ id: 'k1', ad: 'Annem', yakinlik: 'Annem' }, { ad: 'kimliksiz' }, null],
    saat: '07:00',
  });
  assert.ok(k);
  assert.equal(k.iliski, undefined);
  assert.deepEqual(k.dostluk, {});
  assert.deepEqual(k.gorulmusDiyaloglar, []);
  assert.equal(k.rehber.length, 1);
  assert.equal(k.saat, undefined);
});

test('istatistikler 0–100e, para sıfırın altına düşmeyecek şekilde kırpılır', () => {
  const k = kayitDogrula({ ...gecerli(), stats: { ...gecerli().stats, moral: 140, enerji: -5 }, para: -20 });
  assert.equal(k?.stats.moral, 100);
  assert.equal(k?.stats.enerji, 0);
  assert.equal(k?.para, 0);
});

const yarim = {
  kisiId: 'k1',
  gorusmeId: 'g03-anne',
  rol: 'anne',
  replikId: 'b',
  gecmis: [],
  ankesor: true,
  kalanRaunt: 1,
  birikenIliski: { anne: 4 },
  birikenGerilim: {},
  birikenMoral: 5,
  birikenEnerji: 0,
  birikenOzlem: 2,
  isaretler: [{ ad: 'ilk_gece', deger: 'garip' }],
  gelen: false,
  kapanis: null,
};

test('günlük alanlar ve yarım görüşme kayıttan geri gelir', () => {
  const k = kayitDogrula({
    ...gecerli(),
    cepteIzmarit: 3,
    bugunIsteyenler: ['emre'],
    bugunDinlenildi: true,
    gelenArama: { rol: 'anne', kisiId: 'k1' },
    bekleyenArama: ['kanka'],
    yarimGorusme: yarim,
  });
  assert.equal(k?.cepteIzmarit, 3);
  assert.deepEqual(k?.bugunIsteyenler, ['emre']);
  assert.equal(k?.bugunDinlenildi, true);
  assert.deepEqual(k?.gelenArama, { rol: 'anne', kisiId: 'k1' });
  assert.deepEqual(k?.bekleyenArama, ['kanka']);
  assert.equal(k?.yarimGorusme?.gorusmeId, 'g03-anne');
});

test('eksik alanlı yarım görüşme düşer, kayıt kurtulur', () => {
  const { birikenIliski, ...eksik } = yarim;
  void birikenIliski;
  const k = kayitDogrula({ ...gecerli(), yarimGorusme: eksik, cepteIzmarit: -2 });
  assert.ok(k);
  assert.equal(k.yarimGorusme, undefined);
  assert.equal(k.cepteIzmarit, undefined);
});
