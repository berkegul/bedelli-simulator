import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geriTusunaBasildi, type Katmanlar } from './geriTusu';

type Durum = Parameters<typeof geriTusunaBasildi>[0];

const kur = (p: Partial<Durum> = {}, katman: Partial<Katmanlar> = {}) => {
  const cagrilar: string[] = [];
  const g = {
    panel: null,
    ekran: 'oyun',
    miniAktif: false,
    gelistirmeDonus: false,
    gorusmeKapat: () => void cagrilar.push('gorusmeKapat'),
    panelAc: (x: unknown) => void cagrilar.push(`panelAc:${x}`),
    anaMenu: () => void cagrilar.push('anaMenu'),
    gelistirmeyeDon: () => void cagrilar.push('gelistirmeyeDon'),
    ...p,
  } as Durum;
  const k: Katmanlar = {
    ayarlarAcik: false,
    ayarlarKapat: () => void cagrilar.push('ayarlarKapat'),
    molaAcik: false,
    molaAc: () => void cagrilar.push('molaAc'),
    molaKapat: () => void cagrilar.push('molaKapat'),
    ...katman,
  };
  return { sonuc: geriTusunaBasildi(g, k), cagrilar };
};

test('ayarlar açıksa önce ayarlar kapanır', () => {
  const { sonuc, cagrilar } = kur({ panel: 'kantin' }, { ayarlarAcik: true });
  assert.equal(sonuc, true);
  assert.deepEqual(cagrilar, ['ayarlarKapat']);
});

test('açık panel kapanır, ekran değişmez', () => {
  const { sonuc, cagrilar } = kur({ panel: 'kantin' });
  assert.equal(sonuc, true);
  assert.deepEqual(cagrilar, ['panelAc:null']);
});

test('görüşme etkisi uygulanarak kapanır', () => {
  assert.deepEqual(kur({ panel: 'gorusme' }).cagrilar, ['gorusmeKapat']);
});

test('zorunlu kararlar geri tuşuyla atlanmaz', () => {
  for (const panel of ['sigaraIstegi', 'izmarit', 'izmaritCezasi'] as const) {
    const { sonuc, cagrilar } = kur({ panel });
    assert.equal(sonuc, true);
    assert.deepEqual(cagrilar, []);
  }
});

test('oyunda mola menüsü açılır, açıksa kapanır', () => {
  assert.deepEqual(kur({ ekran: 'oyun' }).cagrilar, ['molaAc']);
  assert.deepEqual(kur({ ekran: 'oyun' }, { molaAcik: true }).cagrilar, ['molaKapat']);
});

test('mini oyun sürerken geri tuşu yok sayılır', () => {
  const { sonuc, cagrilar } = kur({ ekran: 'oyun', miniAktif: true });
  assert.equal(sonuc, true);
  assert.deepEqual(cagrilar, []);
});

test('geliştirmeden açılan oyun geliştirmeye döner', () => {
  assert.deepEqual(kur({ ekran: 'oyun', gelistirmeDonus: true }).cagrilar, ['gelistirmeyeDon']);
});

test('künye, çarşı gibi ekranlardan ana menüye', () => {
  assert.deepEqual(kur({ ekran: 'carsi' }).cagrilar, ['anaMenu']);
});

test('menüde sistem varsayılanı: uygulamadan çıkar', () => {
  const { sonuc, cagrilar } = kur({ ekran: 'menu' });
  assert.equal(sonuc, false);
  assert.deepEqual(cagrilar, []);
});
