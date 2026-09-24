import { create } from 'zustand';

/**
 * Oyun içi duraklatma menüsü açık mı. Oyun kaydının parçası değil; yalnızca
 * arayüz durumu, o yüzden store'da değil burada.
 */
export const useDuraklat = create<{ acik: boolean; ac: () => void; kapat: () => void }>((set) => ({
  acik: false,
  ac: () => set({ acik: true }),
  kapat: () => set({ acik: false }),
}));
