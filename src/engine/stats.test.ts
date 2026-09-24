import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyEffect,
  BASLANGIC_STATS,
  blokGecisi,
  gunNotu,
  kalanGun,
  TOKLUK_BANT,
  toklukDurumu,
  uykudanSonra,
} from './stats';
import type { Stats } from './types';

const S = (p: Partial<Stats> = {}): Stats => ({ ...BASLANGIC_STATS, ...p });

describe('applyEffect', () => {
  test('değerler 0–100 aralığında kalır', () => {
    const yukari = applyEffect(S({ disiplin: 99 }), 0, { disiplin: 500 });
    const asagi = applyEffect(S({ moral: 2 }), 0, { moral: -500 });
    assert.ok(yukari.stats.disiplin <= 100);
    assert.ok(asagi.stats.moral >= 0);
  });

  test('tavana yaklaştıkça kazanç azalır', () => {
    const alttan = applyEffect(S({ disiplin: 30 }), 0, { disiplin: 12 }).delta.disiplin!;
    const ustten = applyEffect(S({ disiplin: 85 }), 0, { disiplin: 12 }).delta.disiplin!;
    assert.ok(alttan > ustten, `${alttan} > ${ustten}`);
  });

  test('kaybetmek kazanmaktan kolay', () => {
    const kazan = applyEffect(S({ moral: 50 }), 0, { moral: 10 }).delta.moral!;
    const kaybet = applyEffect(S({ moral: 50 }), 0, { moral: -10 }).delta.moral!;
    assert.ok(Math.abs(kaybet) > kazan);
  });

  test('küçük etki en az 1 puan oynatır, uçta oynatmaz', () => {
    assert.equal(applyEffect(S({ disiplin: 60 }), 0, { disiplin: 1 }).delta.disiplin, 1);
    // 92 üstünde "en az 1" garantisi yok: +1 birikip tavana dayanmasın.
    assert.equal(applyEffect(S({ disiplin: 95 }), 0, { disiplin: 1 }).delta.disiplin, undefined);
  });

  test('enerji ve tokluk dirençsiz, tam uygulanır', () => {
    const r = applyEffect(S({ enerji: 90, tokluk: 50 }), 0, { enerji: 5, tokluk: 10 });
    assert.equal(r.stats.enerji, 95);
    assert.equal(r.stats.tokluk, 60);
  });

  test('para sıfırın altına inmez ve delta gerçek farkı gösterir', () => {
    const r = applyEffect(S(), 100, { para: -250 });
    assert.equal(r.para, 0);
    assert.equal(r.delta.para, -100);
  });

  test('değişmeyen stat deltaya girmez, girdi nesnesi değişmez', () => {
    const girdi = S({ moral: 100 });
    const r = applyEffect(girdi, 0, { moral: 5 });
    assert.equal(r.delta.moral, undefined);
    assert.equal(girdi.moral, 100);
  });
});

describe('gunNotu', () => {
  test('enerji ve tokluk nota girmez', () => {
    const a = gunNotu(S({ kondisyon: 70, disiplin: 70, moral: 70, enerji: 0, tokluk: 0 }));
    const b = gunNotu(S({ kondisyon: 70, disiplin: 70, moral: 70, enerji: 100, tokluk: 100 }));
    assert.deepEqual(a, b);
  });

  test('eşikler', () => {
    const not = (n: number) => gunNotu(S({ kondisyon: n, disiplin: n, moral: n })).ad;
    assert.equal(not(90), 'TAKDİR ALDI');
    assert.equal(not(78), 'TAKDİR ALDI');
    assert.equal(not(64), 'TEMİZ İŞ');
    assert.equal(not(50), 'İDARE EDER');
    assert.equal(not(36), 'GAZ YEDİ');
    assert.equal(not(0), 'CEZALI');
  });
});

describe('uykudanSonra', () => {
  test('enerji dolar, tokluk düşer', () => {
    const r = uykudanSonra(S({ enerji: 20, tokluk: 70, moral: 60 }));
    assert.ok(r.enerji > 20);
    assert.equal(r.tokluk, 52);
  });

  test('aç ve moralsiz uyku daha az dinlendirir', () => {
    const iyi = uykudanSonra(S({ enerji: 20, tokluk: 70, moral: 80 }));
    const kotu = uykudanSonra(S({ enerji: 20, tokluk: 20, moral: 20 }));
    assert.ok(iyi.enerji > kotu.enerji);
  });

  test('tükenmiş bitirilen gün kondisyon yıpratır', () => {
    assert.ok(uykudanSonra(S({ enerji: 10, kondisyon: 50 })).kondisyon < 50);
    assert.ok(uykudanSonra(S({ enerji: 80, kondisyon: 50 })).kondisyon > 50);
  });
});

describe('blokGecisi', () => {
  test('her blokta tokluk düşer', () => {
    assert.equal(blokGecisi(S({ tokluk: 70 })).tokluk, 62);
  });

  test('tıka basa dolu mide enerji yakar', () => {
    const r = blokGecisi(S({ tokluk: 100, enerji: 50 }));
    assert.ok(r.tokluk > TOKLUK_BANT.ust);
    assert.equal(r.enerji, 47);
  });

  test('gerçek açlık kondisyon ve morali sızdırır', () => {
    const r = blokGecisi(S({ tokluk: 20, kondisyon: 50, moral: 50 }));
    assert.equal(r.kondisyon, 49);
    assert.equal(r.moral, 49);
  });
});

test('toklukDurumu bantları', () => {
  assert.equal(toklukDurumu(95), 'AĞIR');
  assert.equal(toklukDurumu(TOKLUK_BANT.alt), 'TOK');
  assert.equal(toklukDurumu(40), 'İDARE EDER');
  assert.equal(toklukDurumu(20), 'ACIKTI');
  assert.equal(toklukDurumu(5), 'TAKATSİZ');
});

test('kalanGun', () => {
  assert.equal(kalanGun(1), 28);
  assert.equal(kalanGun(28), 1);
  assert.equal(kalanGun(40), 0);
});
