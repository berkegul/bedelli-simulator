import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geriTusunaBasildi } from './geriTusu';

type Durum = Parameters<typeof geriTusunaBasildi>[0];

const durum = (p: Partial<Durum>) => {
  const cagrilar: string[] = [];
  const g = {
    panel: null,
    ekran: 'oyun',
    gelistirmeDonus: false,
    gorusmeKapat: () => void cagrilar.push('gorusmeKapat'),
    panelAc: (x: unknown) => void cagrilar.push(`panelAc:${x}`),
    anaMenu: () => void cagrilar.push('anaMenu'),
    gelistirmeyeDon: () => void cagrilar.push('gelistirmeyeDon'),
    ...p,
  } as Durum;
  return { g, cagrilar };
};

test('açık panel kapanır, ekran değişmez', () => {
  const { g, cagrilar } = durum({ panel: 'kantin' });
  assert.equal(geriTusunaBasildi(g), true);
  assert.deepEqual(cagrilar, ['panelAc:null']);
});

test('görüşme etkisi uygulanarak kapanır', () => {
  const { g, cagrilar } = durum({ panel: 'gorusme' });
  assert.equal(geriTusunaBasildi(g), true);
  assert.deepEqual(cagrilar, ['gorusmeKapat']);
});

test('zorunlu kararlar geri tuşuyla atlanmaz', () => {
  for (const panel of ['sigaraIstegi', 'izmarit', 'izmaritCezasi'] as const) {
    const { g, cagrilar } = durum({ panel });
    assert.equal(geriTusunaBasildi(g), true);
    assert.deepEqual(cagrilar, []);
  }
});

test('oyundan menüye, geliştirmeden açıldıysa geliştirmeye döner', () => {
  const a = durum({ ekran: 'oyun' });
  assert.equal(geriTusunaBasildi(a.g), true);
  assert.deepEqual(a.cagrilar, ['anaMenu']);

  const b = durum({ ekran: 'oyun', gelistirmeDonus: true });
  geriTusunaBasildi(b.g);
  assert.deepEqual(b.cagrilar, ['gelistirmeyeDon']);
});

test('menüde sistem varsayılanı: uygulamadan çıkar', () => {
  const { g, cagrilar } = durum({ ekran: 'menu' });
  assert.equal(geriTusunaBasildi(g), false);
  assert.deepEqual(cagrilar, []);
});
