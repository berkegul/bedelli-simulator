import React from 'react';
import type { MiniGameId } from '../engine/types';
import { Atis } from './Atis';
import { Ceza } from './Ceza';
import { Gece } from './Gece';
import { Giyinme } from './Giyinme';
import { PostalParlatma } from './PostalParlatma';
import { Tiras } from './Tiras';
import { Ictima } from './Ictima';
import { IzmaritToplama } from './IzmaritToplama';
import { Nobet } from './Nobet';
import { SilahSokme } from './SilahSokme';
import { YatakToplama } from './YatakToplama';
import { YuruyusRitmi } from './YuruyusRitmi';
import { Yemin } from './Yemin';
import type { MiniOyunProps } from './types';

const HARITA: Record<MiniGameId, React.ComponentType<MiniOyunProps>> = {
  yatak: YatakToplama,
  ictima: Ictima,
  yurumek: YuruyusRitmi,
  silah: SilahSokme,
  nobet: Nobet,
  izmarit: IzmaritToplama,
  ceza: Ceza,
  giyinme: Giyinme,
  postal: PostalParlatma,
  tiras: Tiras,
  gece: Gece,
  atis: Atis,
  yemin: Yemin,
};

export const MINI_BASLIK: Record<MiniGameId, string> = {
  yatak: 'YATAK TOPLAMA',
  ictima: 'İÇTİMA',
  yurumek: 'ADIM TEMPOSU',
  silah: 'SİLAH SÖKME',
  nobet: 'GECE NÖBETİ',
  izmarit: 'BÖLÜK İŞLERİ',
  ceza: 'CEZA',
  giyinme: 'GİYİNME',
  postal: 'POSTAL PARLATMA',
  tiras: 'TIRAŞ',
  gece: 'YATMA HAZIRLIĞI',
  atis: 'ATIŞ POLİGONU',
  yemin: 'YEMİN TÖRENİ',
};

export function MiniOyun({ id, ...props }: { id: MiniGameId } & MiniOyunProps) {
  const Bilesen = HARITA[id];
  return <Bilesen {...props} />;
}
