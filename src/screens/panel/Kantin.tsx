import React from 'react';
import { useSecili } from '../../store/secici';
import { DukkanListesi } from '../../ui/DukkanListesi';
import { PanelKabuk } from './ortak';

export function KantinPaneli() {
  const g = useSecili('envanter', 'para', 'profil', 'satinAl');
  return (
    <PanelKabuk baslik="KANTİN" alt="Fiyatlar burada tartışmaya açık değil">
      <DukkanListesi
        dukkan="kantin"
        sigaraIciyor={g.profil.sigaraIciyor}
        envanter={g.envanter}
        para={g.para}
        onSatinAl={(t, k) => g.satinAl(t.id, k)}
      />
    </PanelKabuk>
  );
}
