import type { Panel, Store } from '../store/gameStore';

/**
 * Oyuncunun vermesi gereken kararlar: geri tuşu bunları atlatmamalı.
 * Sigara isteyen arkadaşa cevap, izmariti ne yapacağın, yerden özür cezası.
 */
const ZORUNLU_PANELLER: Panel[] = ['sigaraIstegi', 'izmarit', 'izmaritCezasi'];

type Durum = Pick<
  Store,
  | 'panel'
  | 'ekran'
  | 'miniAktif'
  | 'gelistirmeDonus'
  | 'gorusmeKapat'
  | 'panelAc'
  | 'anaMenu'
  | 'gelistirmeyeDon'
>;

/** Store dışındaki katmanlar: ayarlar ve mola menüsü. */
export type Katmanlar = {
  ayarlarAcik: boolean;
  ayarlarKapat: () => void;
  molaAcik: boolean;
  molaAc: () => void;
  molaKapat: () => void;
};

/**
 * Geri tuşuna basılınca ne olacağı. true: olay burada karşılandı; false:
 * sistem varsayılanı (uygulamadan çık).
 *
 * Sıra: ayarları kapat → açık paneli kapat → oyunda mola menüsünü aç/kapat
 * (mini oyun sürerken hiçbir şey yapma) → menüdeysen çık.
 */
export function geriTusunaBasildi(g: Durum, k: Katmanlar): boolean {
  if (k.ayarlarAcik) {
    k.ayarlarKapat();
    return true;
  }

  if (g.panel) {
    if (ZORUNLU_PANELLER.includes(g.panel)) return true;
    // Görüşme kapanırken konuşulanın etkisi uygulanıyor; düz kapatmak onu atlardı.
    if (g.panel === 'gorusme') g.gorusmeKapat();
    else g.panelAc(null);
    return true;
  }

  switch (g.ekran) {
    case 'menu':
    case 'acilis':
      return false;
    case 'gelistirme':
      g.anaMenu();
      return true;
    case 'oyun':
      if (g.gelistirmeDonus) {
        g.gelistirmeyeDon();
        return true;
      }
      // Mini oyunun ortasında çıkmak turu kaybettirir; geri tuşu yok sayılıyor.
      if (g.miniAktif) return true;
      if (k.molaAcik) k.molaKapat();
      else k.molaAc();
      return true;
    default:
      // Künye, çarşı, gün başı/sonu, kilit: ana menüye. Kayıt her adımda
      // yazılıyor, "Devam et" aynı yerden açar.
      if (g.gelistirmeDonus) g.gelistirmeyeDon();
      else g.anaMenu();
      return true;
  }
}
