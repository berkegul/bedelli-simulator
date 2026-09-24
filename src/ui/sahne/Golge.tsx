import React from 'react';
import { View } from 'react-native';

/**
 * Sprite'ın ayağının altındaki gölge: iki sıra, ortası geniş. Sahne düz
 * bir fon olmaktan çıkıp üstünde durulan bir yer oluyor.
 */
export function Golge({
  genislik,
  u,
  opaklik = 0.32,
}: {
  genislik: number;
  u: number;
  opaklik?: number;
}) {
  const w = genislik * u;
  return (
    <View pointerEvents="none" style={{ width: w, height: 2 * u, alignItems: 'center' }}>
      <View style={{ width: w - 2 * u, height: u, backgroundColor: '#000', opacity: opaklik }} />
      <View style={{ width: w, height: u, backgroundColor: '#000', opacity: opaklik * 0.8 }} />
    </View>
  );
}
