import React from 'react';
import { DersSahnesi } from '../DersSahnesi';
import { PanelKabuk } from './ortak';

/** Dolaptaki ANT-41 kâğıdı: ders bittikten sonra istenildiği zaman okunur. */
export function Ant41Paneli() {
  return (
    <PanelKabuk baslik="ANT-41" alt="Cebindeki kâğıt">
      <DersSahnesi tekrar />
    </PanelKabuk>
  );
}
