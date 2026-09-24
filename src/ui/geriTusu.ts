import type { Panel, Store } from '../store/gameStore';

/**
 * Oyuncunun vermesi gereken kararlar: geri tuşu bunları atlatmamalı.
 * Sigara isteyen arkadaşa cevap, izmariti ne yapacağın, yerden özür cezası.
 */
const ZORUNLU_PANELLER: Panel[] = ['sigaraIstegi', 'izmarit', 'izmaritCezasi'];

type Durum = Pick<
  Store,
  'panel' | 'ekran' | 'gelistirmeDonus' | 'gorusmeKapat' | 'panelAc' | 'anaMenu' | 'gelistirmeyeDon'
>;

/**
 * Geri tuşuna basılınca ne olacağı. true: olay burada karşılandı; false:
 * sistem varsayılanı (uygulamadan çık).
 *
 * Sıra: açık paneli kapat → oyundaysan menüye dön → menüdeysen çık.
 */
export function geriTusunaBasildi(g: Durum): boolean {
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
    default:
      // Duraklatma menüsü (C3) gelene kadar oyundan ana menüye. Kayıt her
      // adımda yazılıyor, "Devam et" aynı yerden açar.
      if (g.gelistirmeDonus) g.gelistirmeyeDon();
      else g.anaMenu();
      return true;
  }
}
