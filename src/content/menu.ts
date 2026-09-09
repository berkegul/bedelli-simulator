import type { OgunAdi } from '../engine/types';

export type { OgunAdi };

export type Yemek = {
  ad: string;
  tokluk: number;
  kondisyon?: number;
  moral?: number;
  /** Tabakta görünen kısa not — sevilen ya da zor yenen yemekler için. */
  not?: string;
};

export const OGUN_ADI: Record<OgunAdi, string> = {
  kahvalti: 'Kahvaltı',
  ogle: 'Öğle yemeği',
  aksam: 'Akşam yemeği',
};

type GunlukMenu = Record<OgunAdi, Yemek[]>;

/**
 * Kışla menüsü haftalık döner ve panoda asılıdır. Oyuncu tabaktaki her
 * kalemi tek tek yiyip yemeyeceğine karar veriyor: zeytini bırak, peyniri ye.
 */
const HAFTA: GunlukMenu[] = [
  {
    kahvalti: [
      { ad: 'Siyah zeytin', tokluk: 5 },
      { ad: 'Beyaz peynir', tokluk: 9, kondisyon: 2 },
      { ad: 'Vişne reçeli', tokluk: 6, moral: 2 },
      { ad: 'Ekmek (2 dilim)', tokluk: 12 },
      { ad: 'Çay', tokluk: 2, moral: 3 },
    ],
    ogle: [
      { ad: 'Mercimek çorbası', tokluk: 10, kondisyon: 2 },
      { ad: 'Kuru fasulye', tokluk: 16, kondisyon: 3 },
      { ad: 'Pirinç pilavı', tokluk: 14 },
      { ad: 'Cacık', tokluk: 6, moral: 2 },
      { ad: 'Kavun', tokluk: 5, moral: 3 },
    ],
    aksam: [
      { ad: 'Domates çorbası', tokluk: 9 },
      { ad: 'Fırın makarna', tokluk: 17, kondisyon: 2 },
      { ad: 'Turşu', tokluk: 3 },
      { ad: 'Ayran', tokluk: 6, kondisyon: 2 },
    ],
  },
  {
    kahvalti: [
      { ad: 'Yeşil zeytin', tokluk: 5 },
      { ad: 'Kaşar peyniri', tokluk: 10, kondisyon: 2 },
      { ad: 'Haşlanmış yumurta', tokluk: 11, kondisyon: 3 },
      { ad: 'Ekmek (2 dilim)', tokluk: 12 },
      { ad: 'Çay', tokluk: 2, moral: 3 },
    ],
    ogle: [
      { ad: 'Ezogelin çorbası', tokluk: 10, kondisyon: 2 },
      { ad: 'Etli nohut', tokluk: 18, kondisyon: 4 },
      { ad: 'Bulgur pilavı', tokluk: 13 },
      { ad: 'Yoğurt', tokluk: 7, kondisyon: 2 },
      { ad: 'Karpuz', tokluk: 5, moral: 3 },
    ],
    aksam: [
      { ad: 'Yayla çorbası', tokluk: 9 },
      { ad: 'Patates oturtma', tokluk: 15 },
      { ad: 'Pirinç pilavı', tokluk: 14 },
      { ad: 'Ayran', tokluk: 6, kondisyon: 2 },
    ],
  },
  {
    kahvalti: [
      { ad: 'Siyah zeytin', tokluk: 5 },
      { ad: 'Beyaz peynir', tokluk: 9, kondisyon: 2 },
      { ad: 'Tahin helva', tokluk: 13, moral: 4, not: 'Koğuşun favorisi' },
      { ad: 'Ekmek (2 dilim)', tokluk: 12 },
      { ad: 'Çay', tokluk: 2, moral: 3 },
    ],
    ogle: [
      { ad: 'Tarhana çorbası', tokluk: 10 },
      { ad: 'Etli taze fasulye', tokluk: 16, kondisyon: 3 },
      { ad: 'Pirinç pilavı', tokluk: 14 },
      { ad: 'Cacık', tokluk: 6, moral: 2 },
      { ad: 'Şeftali', tokluk: 5, moral: 3 },
    ],
    aksam: [
      { ad: 'Mercimek çorbası', tokluk: 10, kondisyon: 2 },
      { ad: 'Sebzeli tavuk', tokluk: 18, kondisyon: 4 },
      { ad: 'Şehriyeli pilav', tokluk: 13 },
      { ad: 'Turşu', tokluk: 3 },
    ],
  },
  {
    kahvalti: [
      { ad: 'Siyah zeytin', tokluk: 5 },
      { ad: 'Üçgen peynir', tokluk: 7 },
      { ad: 'Bal', tokluk: 7, moral: 3 },
      { ad: 'Ekmek (2 dilim)', tokluk: 12 },
      { ad: 'Çay', tokluk: 2, moral: 3 },
    ],
    ogle: [
      { ad: 'Domates çorbası', tokluk: 9 },
      { ad: 'Kıymalı ıspanak', tokluk: 15, kondisyon: 3, not: 'Sevmeyen çok' },
      { ad: 'Bulgur pilavı', tokluk: 13 },
      { ad: 'Yoğurt', tokluk: 7, kondisyon: 2 },
      { ad: 'Elma', tokluk: 4, moral: 2 },
    ],
    aksam: [
      { ad: 'Ezogelin çorbası', tokluk: 10, kondisyon: 2 },
      { ad: 'Kuru fasulye', tokluk: 16, kondisyon: 3 },
      { ad: 'Pirinç pilavı', tokluk: 14 },
      { ad: 'Ayran', tokluk: 6, kondisyon: 2 },
    ],
  },
  {
    kahvalti: [
      { ad: 'Yeşil zeytin', tokluk: 5 },
      { ad: 'Beyaz peynir', tokluk: 9, kondisyon: 2 },
      { ad: 'Kaysı reçeli', tokluk: 6, moral: 2 },
      { ad: 'Ekmek (2 dilim)', tokluk: 12 },
      { ad: 'Çay', tokluk: 2, moral: 3 },
    ],
    ogle: [
      { ad: 'Yayla çorbası', tokluk: 9 },
      { ad: 'Etli kabak', tokluk: 15, kondisyon: 3 },
      { ad: 'Pirinç pilavı', tokluk: 14 },
      { ad: 'Cacık', tokluk: 6, moral: 2 },
      { ad: 'Üzüm', tokluk: 5, moral: 3 },
    ],
    aksam: [
      { ad: 'Tarhana çorbası', tokluk: 10 },
      { ad: 'Makarna', tokluk: 16 },
      { ad: 'Mevsim salata', tokluk: 5, kondisyon: 2 },
      { ad: 'Ayran', tokluk: 6, kondisyon: 2 },
    ],
  },
  {
    kahvalti: [
      { ad: 'Siyah zeytin', tokluk: 5 },
      { ad: 'Beyaz peynir', tokluk: 9, kondisyon: 2 },
      { ad: 'Sucuklu yumurta', tokluk: 16, kondisyon: 3, moral: 5, not: 'Haftanın en iyisi' },
      { ad: 'Ekmek (2 dilim)', tokluk: 12 },
      { ad: 'Çay', tokluk: 2, moral: 3 },
    ],
    ogle: [
      { ad: 'Mercimek çorbası', tokluk: 10, kondisyon: 2 },
      { ad: 'Etli pilav', tokluk: 20, kondisyon: 4 },
      { ad: 'Cacık', tokluk: 6, moral: 2 },
      { ad: 'Revani', tokluk: 9, moral: 5 },
    ],
    aksam: [
      { ad: 'Domates çorbası', tokluk: 9 },
      { ad: 'Nohutlu yahni', tokluk: 16, kondisyon: 3 },
      { ad: 'Bulgur pilavı', tokluk: 13 },
      { ad: 'Turşu', tokluk: 3 },
    ],
  },
  {
    kahvalti: [
      { ad: 'Siyah zeytin', tokluk: 5 },
      { ad: 'Beyaz peynir', tokluk: 9, kondisyon: 2 },
      { ad: 'Vişne reçeli', tokluk: 6, moral: 2 },
      { ad: 'Ekmek (2 dilim)', tokluk: 12 },
      { ad: 'Çay', tokluk: 2, moral: 3 },
    ],
    ogle: [
      { ad: 'Ezogelin çorbası', tokluk: 10, kondisyon: 2 },
      { ad: 'Karnıyarık', tokluk: 18, kondisyon: 3, moral: 3 },
      { ad: 'Pirinç pilavı', tokluk: 14 },
      { ad: 'Yoğurt', tokluk: 7, kondisyon: 2 },
      { ad: 'Kavun', tokluk: 5, moral: 3 },
    ],
    aksam: [
      { ad: 'Mercimek çorbası', tokluk: 10, kondisyon: 2 },
      { ad: 'Fırın tavuk', tokluk: 19, kondisyon: 4 },
      { ad: 'Şehriyeli pilav', tokluk: 13 },
      { ad: 'Ayran', tokluk: 6, kondisyon: 2 },
    ],
  },
];

export function ogunMenusu(gun: number, ogun: OgunAdi): Yemek[] {
  return HAFTA[(gun - 1) % HAFTA.length][ogun];
}

/** Panoda asılı haftalık menü — oyuncu ileriye bakabilsin diye. */
export function haftalikMenu() {
  return HAFTA;
}
