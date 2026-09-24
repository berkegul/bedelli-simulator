/**
 * Kayıt katmanı AsyncStorage ve buluta bağlı; ikisi de burada taklit
 * ediliyor. Asıl sınanan senaryo S3: oyuncu kaydı sildi, ağ yoktu, bulut
 * silinemedi. Bir sonraki açılışta eski oyun buluttan geri gelmemeli.
 */
import { before, beforeEach, mock, test } from 'node:test';
import assert from 'node:assert/strict';

const depo = new Map<string, string>();
const bellekDepo = {
  getItem: async (k: string) => depo.get(k) ?? null,
  setItem: async (k: string, v: string) => void depo.set(k, v),
  removeItem: async (k: string) => void depo.delete(k),
  multiRemove: async (ks: string[]) => ks.forEach((k) => depo.delete(k)),
};

const bulut = {
  kayit: null as unknown,
  silinebilir: false,
  silmeDenemesi: 0,
};

mock.module('@react-native-async-storage/async-storage', { defaultExport: bellekDepo });
mock.module('./bulut', {
  namedExports: {
    bulutaYaz: () => {},
    bulutlaKarsilastir: async () => {},
    buluttanOku: async () => bulut.kayit,
    bulutuSil: async () => {
      bulut.silmeDenemesi++;
      if (bulut.silinebilir) bulut.kayit = null;
      return bulut.silinebilir;
    },
  },
});

type Kayit = typeof import('./save');
type Yuk = Parameters<Kayit['kaydet']>[0];
let kaydet: Kayit['kaydet'];
let sil: Kayit['sil'];
let yukle: Kayit['yukle'];

before(async () => {
  // Taklitler kurulduktan sonra yüklenmeli.
  ({ kaydet, sil, yukle } = await import('./save'));
});

const ornek = (gun: number) =>
  ({
    profil: { ad: 'Berke', sigaraIciyor: false },
    hazirlikBitti: true,
    gun,
    blokIndex: 0,
    sahneIndex: 0,
    stats: { kondisyon: 50, disiplin: 50, moral: 50, enerji: 50, tokluk: 50 },
    para: 100,
    envanter: {},
    dostluk: { emre: 0, tolga: 0, serkan: 0 },
    gorulmusDiyaloglar: [],
    rehber: [],
    nikotin: 0,
    bitenGunler: [],
  }) as unknown as Yuk;

const bekle = () => new Promise((coz) => setTimeout(coz, 5));

beforeEach(() => {
  depo.clear();
  bulut.kayit = null;
  bulut.silinebilir = false;
  bulut.silmeDenemesi = 0;
});

test('cihazda kayıt yoksa buluttaki yedek geri yüklenir', async () => {
  bulut.kayit = { ...ornek(7), version: 3, guncelleme: 1 };
  const k = await yukle();
  assert.equal(k?.gun, 7);
});

test('ağsız silinen oyun buluttan geri gelmez', async () => {
  bulut.kayit = { ...ornek(3), version: 3, guncelleme: 1 };
  await kaydet(ornek(3));
  await sil();
  await bekle();

  assert.equal(await yukle(), null);
  assert.ok(bulut.silmeDenemesi >= 2, 'açılışta silme yeniden denenmeli');
});

test('ağ gelince silme tamamlanır ve işaret kalkar', async () => {
  bulut.kayit = { ...ornek(3), version: 3, guncelleme: 1 };
  await sil();
  await bekle();
  bulut.silinebilir = true;
  assert.equal(await yukle(), null);
  await bekle();
  assert.equal(bulut.kayit, null);
  assert.equal(depo.has('bedelli.save.silindi'), false);
});

test('silmeden sonra yeni oyun kaydedilince işaret kalkar', async () => {
  await sil();
  await bekle();
  assert.equal(depo.has('bedelli.save.silindi'), true);
  await kaydet(ornek(1));
  assert.equal(depo.has('bedelli.save.silindi'), false);
  assert.equal((await yukle())?.gun, 1);
});

test('bozuk kayıt kenara alınır, oyun buluttaki yedekten devam eder', async () => {
  depo.set('bedelli.save.v3', '{"version":3,"gun":"dört"');
  bulut.kayit = { ...ornek(6), version: 3, guncelleme: 1 };
  const k = await yukle();
  assert.equal(k?.gun, 6);
  assert.equal(depo.get('bedelli.save.bozuk'), '{"version":3,"gun":"dört"');
});

test('stats alanı bozuk kayıt çökme yerine reddedilir', async () => {
  depo.set('bedelli.save.v3', JSON.stringify({ ...ornek(2), stats: null, version: 3, guncelleme: 1 }));
  assert.equal(await yukle(), null);
  assert.ok(depo.has('bedelli.save.bozuk'));
});
