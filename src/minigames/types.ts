export type MiniOyunProps = {
  /** 0–1 arası başarı puanı. */
  onBitti: (score: number) => void;
  /** Gün ilerledikçe artan zorluk: 0 = ilk gün, 1 = en zor. */
  zorluk?: number;
};

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
