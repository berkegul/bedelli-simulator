import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { GUNLER } from '../../content';
import type { Kusur, Scene } from '../../engine/types';
import { denetimSonucu } from '../../content/denetim';
import { DenetimSahnesi } from '../../screens/DenetimSahnesi';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelText } from '../../ui/PixelText';
import { YemekSahnesi } from '../../screens/YemekSahnesi';
import { DersSahnesi } from '../../screens/DersSahnesi';
import { TanitimSahnesi } from '../../screens/TanitimSahnesi';
import { DolapDenetimi, DolapYerlesimi } from '../../screens/DolapYerlesimi';
import { Baslik, Cikti, Kart, Kutu, Satir } from '../parcalar';

type Tur = Scene['kind'];

/** Denetim önizlemesi için: üniforma tamam, postal ve tıraş kusurlu. */
const ORNEK_KUSURLAR: Kusur[] = [
  { kaynak: 'giyinme', puan: 0.8 },
  { kaynak: 'postal', puan: 0.3 },
  { kaynak: 'tiras', puan: 0.4 },
];

const TUR_ADI: Record<Tur, string> = {
  anlati: 'Anlatı',
  mini: 'Mini oyun',
  yemek: 'Yemek (tepsi)',
  serbest: 'Serbest zaman',
  ders: 'ANT-41 dersi',
  tanitim: 'Bölge tanıtımı',
  dolap: 'Dolap yerleşimi',
  dolapDenetimi: 'Dolap denetimi',
  denetim: 'İçtima denetimi',
  yol: 'Yol (konum değiştirme)',
};

const TUR_RENK: Record<Tur, string> = {
  anlati: C.canvasDim,
  mini: C.olive,
  yemek: C.ekmek,
  serbest: C.brass,
  ders: C.steel,
  tanitim: C.tea,
  dolap: C.olive,
  dolapDenetimi: C.rust,
  denetim: C.brass,
  yol: C.steel,
};

type Kayit = { gun: number; blokId: string; bi: number; si: number; sahne: Scene };

function tumSahneler(): Kayit[] {
  const liste: Kayit[] = [];
  for (const g of GUNLER) {
    g.blocks.forEach((b, bi) => {
      b.scenes.forEach((sahne, si) => {
        liste.push({ gun: g.day, blokId: b.id, bi, si, sahne });
      });
    });
  }
  return liste;
}

/**
 * Sahne kataloğu. Oyunun bütün sahneleri türlerine göre listeleniyor;
 * canlı önizlemesi olanlar burada açılıyor, olmayanlara atlanıyor.
 */
export function BolumSahneler() {
  const g = useSecili('dolapDuzeni', 'envanter', 'gelistirmeAtla', 'stats');
  const [tur, setTur] = useState<Tur | null>(null);
  const [onizleme, setOnizleme] = useState<Kayit | null>(null);
  const [cikti, setCikti] = useState<string[]>([]);

  const hepsi = tumSahneler();

  if (onizleme) {
    const s = onizleme.sahne;
    return (
      <View style={{ gap: SP.lg }}>
        <Baslik
          ust={`gün ${onizleme.gun} · ${onizleme.blokId}`}
          ad={TUR_ADI[s.kind]}
          alt={s.id}
        />

        <Kutu baslik="Sahne verisi" renk={TUR_RENK[s.kind]}>
          <Satir ad="kind" deger={s.kind} />
          <Satir ad="id" deger={s.id} />
          {'sprite' in s && s.sprite && <Satir ad="sprite" deger={s.sprite} />}
          {'ogun' in s && <Satir ad="öğün" deger={s.ogun} />}
          {'brief' in s && (
            <PixelText size="small" color={C.canvasDim} line="snug">
              {s.brief}
            </PixelText>
          )}
          {'text' in s && (
            <PixelText size="small" color={C.canvasDim} line="snug">
              {s.speaker ? `${s.speaker}: ` : ''}
              {s.text}
            </PixelText>
          )}
          {'choices' in s && s.choices?.length ? (
            <View style={{ gap: 2, marginTop: SP.xs }}>
              {s.choices.map((c) => (
                <PixelText key={c.id} size="micro" color={C.brass} line="snug">
                  {`› ${c.label} → ${Object.entries(c.effect)
                    .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
                    .join(' ')}`}
                </PixelText>
              ))}
            </View>
          ) : null}
        </Kutu>

        {s.kind === 'yemek' && (
          <Kutu baslik="Canlı önizleme" renk={C.ekmek}>
            <YemekSahnesi
              gun={onizleme.gun}
              blokIndex={onizleme.bi}
              ogun={s.ogun}
              tokluk={g.stats.tokluk}
              onYe={(secilen) =>
                setCikti([
                  'TEPSİ',
                  `${secilen.length} kalem seçildi: ${secilen.map((y) => y.ad).join(', ')}`,
                ])
              }
            />
          </Kutu>
        )}

        {s.kind === 'ders' && (
          <Kutu baslik="Canlı önizleme" renk={C.steel}>
            <DersSahnesi onBitti={() => setCikti(['DERS', 'Bölümler okundu, sahne bitti.'])} />
          </Kutu>
        )}

        {s.kind === 'tanitim' && (
          <Kutu baslik="Canlı önizleme" renk={C.tea}>
            <TanitimSahnesi onBitti={() => setCikti(['TANITIM', 'Bütün noktalar gezildi.'])} />
          </Kutu>
        )}

        {s.kind === 'dolap' && (
          <Kutu baslik="Canlı önizleme" renk={C.olive}>
            <DolapYerlesimi
              envanter={g.envanter}
              onBitti={(c, d) =>
                setCikti([
                  'DOLAP',
                  `${c.label}: ${c.outcome} Kayda geçecek düzen: ${
                    Object.entries(d.yerler)
                      .map(([id, b]) => `${id}→${b}`)
                      .join(', ') || 'boş'
                  }${d.hizli ? ' (yığın)' : ''}`,
                ])
              }
            />
          </Kutu>
        )}

        {s.kind === 'denetim' && (
          <Kutu baslik="Canlı önizleme · örnek kusurlar" renk={C.brass}>
            <DenetimSahnesi
              kusurlar={ORNEK_KUSURLAR}
              onBitti={(skor) => setCikti(['DENETİM', denetimSonucu(ORNEK_KUSURLAR, skor).metin])}
            />
          </Kutu>
        )}

        {s.kind === 'dolapDenetimi' && (
          <Kutu baslik="Canlı önizleme" renk={C.rust}>
            <DolapDenetimi
              duzen={g.dolapDuzeni}
              onBitti={(c) => setCikti(['DENETİM', c.outcome])}
            />
          </Kutu>
        )}

        {(s.kind === 'anlati' || s.kind === 'mini' || s.kind === 'serbest' || s.kind === 'yol') && (
          <Kutu baslik="Önizleme yok" renk={C.line}>
            <PixelText size="small" color={C.canvasDim} line="snug">
              {s.kind === 'serbest'
                ? 'Serbest zaman kışla haritasına ve blok saatine bağlı; oyunda açmak gerekiyor.'
                : s.kind === 'yol'
                  ? 'Yol sahnesi kendi bölümünde canlı duruyor: Konum değiştirme.'
                  : s.kind === 'mini'
                    ? 'Mini oyunlar kendi bölümünde oynanıyor.'
                    : 'Anlatı sahnesi daktilo akışına bağlı; oyunda açmak gerekiyor.'}
            </PixelText>
          </Kutu>
        )}

        <Cikti satirlar={cikti} />

        <View style={{ gap: SP.sm }}>
          <PixelButton
            label="Oyunda bu sahneye atla"
            onPress={() =>
              g.gelistirmeAtla({
                ekran: 'oyun',
                gun: onizleme.gun,
                blokIndex: onizleme.bi,
                sahneIndex: onizleme.si,
              })
            }
          />
          <PixelButton
            label="‹ Sahne listesi"
            tur="sessiz"
            onPress={() => {
              setOnizleme(null);
              setCikti([]);
            }}
          />
        </View>
      </View>
    );
  }

  if (tur) {
    const liste = hepsi.filter((k) => k.sahne.kind === tur);
    return (
      <View style={{ gap: SP.lg }}>
        <Baslik ust="Sahneler" ad={TUR_ADI[tur]} alt={`${liste.length} sahne`} />
        <View style={{ gap: SP.sm }}>
          {liste.map((k) => (
            <Kart
              key={`${k.gun}-${k.blokId}-${k.si}`}
              ad={k.sahne.id}
              alt={`gün ${k.gun} · ${k.blokId} · sahne ${k.si}`}
              saglik={`G${k.gun}`}
              renk={TUR_RENK[tur]}
              onPress={() => setOnizleme(k)}
            />
          ))}
        </View>
        <PixelButton label="‹ Sahne türleri" tur="sessiz" onPress={() => setTur(null)} />
      </View>
    );
  }

  const turler = Object.keys(TUR_ADI) as Tur[];
  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Bölüm 03"
        ad="Sahneler"
        alt={`Yazılı ${GUNLER.length} günde toplam ${hepsi.length} sahne var. Sahne türü, oyunun akışını süren yedi mekanizmadan biri.`}
      />
      <View style={{ gap: SP.sm }}>
        {turler.map((t) => {
          const adet = hepsi.filter((k) => k.sahne.kind === t).length;
          return (
            <Kart
              key={t}
              ad={TUR_ADI[t]}
              alt={`kind: '${t}'`}
              saglik={`${adet}`}
              renk={TUR_RENK[t]}
              onPress={() => setTur(t)}
            />
          );
        })}
      </View>
    </View>
  );
}
