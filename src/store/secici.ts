import { useShallow } from 'zustand/react/shallow';
import { useGame, type Store } from './gameStore';

/**
 * Store'un yalnızca verilen alanlarına abone olur. `useGame()` bütün store'a
 * abone oluyordu: her `set` (saat ilerlemesi, bir kart) o ekranı baştan
 * çiziyordu. Burada seçilen alanlar sığ karşılaştırılıyor; eylemler sabit
 * olduğu için onları istemek aboneliği büyütmüyor.
 *
 *     const g = useSecili('gun', 'para', 'ileri');
 */
export function useSecili<K extends keyof Store>(...anahtarlar: K[]): Pick<Store, K> {
  return useGame(
    useShallow((s) => {
      const secilen = {} as Pick<Store, K>;
      for (const k of anahtarlar) secilen[k] = s[k];
      return secilen;
    }),
  );
}
