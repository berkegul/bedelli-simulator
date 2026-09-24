import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { HAVA_METNI, HAVA_YOL_NOTU, havaDurumu, havaEtkisi, zeminTipi } from '../../engine/hava';
import {
  BLOK_BASINA_ACLIK,
  TOKLUK_BANT,
  applyEffect,
  blokGecisi,
  gunNotu,
  toklukDurumu,
  uykudanSonra,
} from '../../engine/stats';
import { sigaraIzni, telefonIzni, blokAnahtari } from '../../engine/kurallar';
import { GUNLER } from '../../content';
import { sil } from '../../engine/save';
import type { StatKey } from '../../engine/types';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelText } from '../../ui/PixelText';
import { Baslik, Cikti, Kart, Kutu, Satir, Sayi, Secenekler } from '../parcalar';

type Alt = 'hava' | 'stat' | 'izin' | 'nikotin' | 'kayit';

/** Sistemler: oyunun arka planında sessizce çalışan hesaplar. */
export function BolumSistemler() {
  const [alt, setAlt] = useState<Alt | null>(null);

  if (!alt) {
    return (
      <View style={{ gap: SP.lg }}>
        <Baslik
          ust="Bölüm 07"
          ad="Sistemler"
          alt="Ekranı olmayan mekanizmalar. Hepsi bir yerde bir sayıyı değiştiriyor ve oyuncu sonucu görüyor, sebebini görmüyor."
        />
        <View style={{ gap: SP.sm }}>
          <Kart ad="Hava" alt="28 gün × blok · hava, zemin, etkisi" renk={C.steel} onPress={() => setAlt('hava')} />
          <Kart ad="Stat eğrisi" alt="applyEffect · tavana yaklaşınca kazanç söner" renk={C.olive} onPress={() => setAlt('stat')} />
          <Kart ad="İzin kuralları" alt="Hangi blokta sigara/telefon serbest" renk={C.rust} onPress={() => setAlt('izin')} />
          <Kart ad="Uyku ve tokluk" alt="Gece dolumu, blok başına açlık, bant" renk={C.ekmek} onPress={() => setAlt('nikotin')} />
          <Kart ad="Kayıt" alt="Kaydı sil, v2→v3 taşımayı sınama" renk={C.tea} onPress={() => setAlt('kayit')} />
        </View>
      </View>
    );
  }

  if (alt === 'hava') return <Hava geri={() => setAlt(null)} />;
  if (alt === 'stat') return <Stat geri={() => setAlt(null)} />;
  if (alt === 'izin') return <Izin geri={() => setAlt(null)} />;
  if (alt === 'nikotin') return <Uyku geri={() => setAlt(null)} />;
  return <Kayit geri={() => setAlt(null)} />;
}

function Geri({ geri }: { geri: () => void }) {
  return <PixelButton label="‹ Sistemler" tur="sessiz" onPress={geri} />;
}

function Hava({ geri }: { geri: () => void }) {
  const [gun, setGun] = useState(1);
  const gunData = GUNLER.find((d) => d.day === gun);

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik ust="Sistem" ad="Hava" alt="Gün ve blok numarasından türüyor — rastgele ama her oynayışta aynı." />
      <Kutu baslik="Gün" renk={C.steel}>
        <Secenekler liste={Array.from({ length: 28 }, (_, i) => i + 1)} secili={gun} onSec={setGun} />
      </Kutu>
      <Kutu baslik={`Gün ${gun} blokları`} renk={C.line}>
        {(gunData?.blocks ?? Array.from({ length: 8 }, (_, i) => ({ id: `blok-${i}` }))).map(
          (b, i) => {
            const h = havaDurumu(gun, i);
            const e = havaEtkisi(h);
            return (
              <View key={i} style={{ paddingVertical: SP.xs, gap: 2 }}>
                <Satir ad={`${i} · ${b.id}`} deger={h} renk={C.steel} />
                <PixelText size="micro" color={C.canvasFaint} line="snug">
                  {`${HAVA_METNI[h]} · zemin: ${zeminTipi(gun, i)}`}
                </PixelText>
                <PixelText size="micro" color={C.canvasDim} line="snug">
                  {`Yolda: ${HAVA_YOL_NOTU[h]}`}
                </PixelText>
                <PixelText size="micro" color={C.olive}>
                  {Object.entries(e).length
                    ? Object.entries(e).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(' · ')
                    : 'etkisi yok'}
                </PixelText>
              </View>
            );
          },
        )}
      </Kutu>
      <Geri geri={geri} />
    </View>
  );
}

function Stat({ geri }: { geri: () => void }) {
  const g = useSecili('para', 'stats');
  const [key, setKey] = useState<StatKey>('disiplin');
  const [degisim, setDegisim] = useState(10);

  const noktalar = [10, 30, 50, 70, 85, 95];

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Sistem"
        ad="Stat eğrisi"
        alt="Kondisyon, disiplin ve moral tavana yaklaştıkça kazanmak zorlaşıyor; kaybetmek aynı hızda kalıyor. Enerji ve tokluk düz uygulanıyor."
      />
      <Kutu baslik="Deneme" renk={C.olive}>
        <Secenekler
          liste={['kondisyon', 'disiplin', 'moral', 'enerji', 'tokluk'] as StatKey[]}
          secili={key}
          onSec={setKey}
        />
        <Sayi ad="değişim" deger={degisim} onDegis={setDegisim} adim={5} min={-50} max={50} />
      </Kutu>
      <Kutu baslik={`${key} için ${degisim > 0 ? '+' : ''}${degisim} ne getirir`} renk={C.line}>
        {noktalar.map((n) => {
          const once = { ...g.stats, [key]: n };
          const sonra = applyEffect(once, g.para, { [key]: degisim });
          const fark = sonra.delta[key] ?? 0;
          return (
            <Satir
              key={n}
              ad={`${n} →`}
              deger={`${sonra.stats[key]}  (${fark > 0 ? '+' : ''}${fark})`}
              renk={fark === 0 ? C.canvasFaint : fark > 0 ? C.olive : C.rust}
            />
          );
        })}
      </Kutu>
      <Kutu baslik="Gün notu eşikleri" renk={C.brass}>
        {[85, 70, 57, 43, 20].map((p) => {
          const not = gunNotu({ ...g.stats, kondisyon: p, disiplin: p, moral: p });
          return <Satir key={p} ad={`ortalama ${p}`} deger={`${not.ad} (${not.puan})`} />;
        })}
      </Kutu>
      <Geri geri={geri} />
    </View>
  );
}

function Izin({ geri }: { geri: () => void }) {
  const bloklar = [
    ...new Set(GUNLER.flatMap((d) => d.blocks.map((b) => blokAnahtari(b.id)))),
  ];
  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Sistem"
        ad="İzin kuralları"
        alt="Cepteki şeyler her an kullanılmaz. Sigara ve telefon yalnızca serbest zamanda; kalan her blok kendi sebebini söylüyor."
      />
      {bloklar.map((b) => {
        const s = sigaraIzni(b);
        const t = telefonIzni(b);
        return (
          <Kutu key={b} baslik={b} renk={s.olur ? C.olive : C.line}>
            <Satir ad="sigara" deger={s.olur ? 'SERBEST' : 'yasak'} renk={s.olur ? C.olive : C.rust} />
            {!s.olur && (
              <PixelText size="micro" color={C.canvasFaint} line="snug">
                {s.sebep}
              </PixelText>
            )}
            <Satir ad="telefon" deger={t.olur ? 'SERBEST' : 'yasak'} renk={t.olur ? C.olive : C.rust} />
            {!t.olur && (
              <PixelText size="micro" color={C.canvasFaint} line="snug">
                {t.sebep}
              </PixelText>
            )}
          </Kutu>
        );
      })}
      <Geri geri={geri} />
    </View>
  );
}

function Uyku({ geri }: { geri: () => void }) {
  const g = useSecili('stats');
  const [moral, setMoral] = useState(g.stats.moral);
  const [enerji, setEnerji] = useState(g.stats.enerji);
  const [tokluk, setTokluk] = useState(g.stats.tokluk);

  const once = { ...g.stats, moral, enerji, tokluk };
  const sabah = uykudanSonra(once);
  const blokSonrasi = blokGecisi(once);

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Sistem"
        ad="Uyku ve tokluk"
        alt={`Uyku kalitesi morale ve tokluğa bakıyor. Her blokta ${BLOK_BASINA_ACLIK} tokluk gidiyor; ideal bant ${TOKLUK_BANT.alt}–${TOKLUK_BANT.ust}.`}
      />
      <Kutu baslik="Yatarken" renk={C.steel}>
        <Sayi ad="moral" deger={moral} onDegis={setMoral} adim={5} />
        <Sayi ad="enerji" deger={enerji} onDegis={setEnerji} adim={5} />
        <Sayi ad="tokluk" deger={tokluk} onDegis={setTokluk} adim={5} />
        <Satir ad="tokluk durumu" deger={toklukDurumu(tokluk)} renk={C.ekmek} />
      </Kutu>
      <Cikti
        satirlar={[
          'SABAH',
          `enerji ${once.enerji} → ${sabah.enerji}`,
          `kondisyon ${once.kondisyon} → ${sabah.kondisyon}`,
          `tokluk ${once.tokluk} → ${sabah.tokluk}`,
        ]}
      />
      <Cikti
        satirlar={[
          'BİR BLOK SONRA',
          `tokluk ${once.tokluk} → ${blokSonrasi.tokluk} (${toklukDurumu(blokSonrasi.tokluk)})`,
          `kondisyon ${once.kondisyon} → ${blokSonrasi.kondisyon}`,
          `moral ${once.moral} → ${blokSonrasi.moral}`,
        ]}
      />
      <Geri geri={geri} />
    </View>
  );
}

function Kayit({ geri }: { geri: () => void }) {
  const g = useSecili('bitenGunler', 'envanter', 'gorulmusGorusmeler', 'gun', 'hafiza', 'rehber');
  const [cikti, setCikti] = useState<string[]>([]);
  return (
    <View style={{ gap: SP.lg }}>
      <Baslik ust="Sistem" ad="Kayıt" alt="AsyncStorage + bulut yedeği. Sürüm 3; v2 kayıtları taşınıyor." />
      <Kutu baslik="Şu anki kayıt" renk={C.tea}>
        <Satir ad="gün" deger={g.gun} />
        <Satir ad="biten gün" deger={g.bitenGunler.length} />
        <Satir ad="rehber" deger={g.rehber.length} />
        <Satir ad="hafıza işareti" deger={Object.keys(g.hafiza).length} />
        <Satir ad="görülmüş görüşme" deger={g.gorulmusGorusmeler.length} />
        <Satir ad="envanter kalemi" deger={Object.keys(g.envanter).length} />
      </Kutu>
      <Cikti satirlar={cikti} />
      <PixelButton
        label="Kaydı sil (oyun sıfırlanır)"
        onPress={() => {
          void sil().then(() => setCikti(['SİLİNDİ', 'Uygulamayı yeniden yükle.']));
        }}
      />
      <Geri geri={geri} />
    </View>
  );
}
