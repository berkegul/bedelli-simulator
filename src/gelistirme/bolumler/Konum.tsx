import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { YOLLAR } from '../../content';
import { blokAnahtari } from '../../engine/kurallar';
import { havaDurumu, havaEtkisi } from '../../engine/hava';
import { saate } from '../../engine/zaman';
import { sprite } from '../../art';
import { useGame } from '../../store/gameStore';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { YolSahnesi } from '../../screens/YolSahnesi';
import { Baslik, Cikti, Kart, Kutu, Satir, Sayi, Secenekler } from '../parcalar';

const GUZERGAHLAR = Object.entries(YOLLAR);

/**
 * Konum değiştirme: oyunda blokların arasına giren yürüyüş sahnesi.
 * Burada her güzergâh tek tek açılıyor ve sahnenin beslendiği her şey
 * (hava, saat, gün, manzara dizisi, hedef mekan) aynı ekranda duruyor —
 * yürürken ne olduğunu görmek için 28 günü oynamak gerekmiyor.
 */
export function BolumKonum() {
  const g = useGame();
  const [secili, setSecili] = useState<string | null>(null);
  const [gun, setGun] = useState(g.gun);
  const [blok, setBlok] = useState(g.blokIndex);
  const [saat, setSaat] = useState(g.saat);
  const [vardi, setVardi] = useState(0);

  const yol = secili ? YOLLAR[secili] : undefined;
  const hava = havaDurumu(gun, blok);
  const etki = havaEtkisi(hava);

  if (!yol || !secili) {
    return (
      <View style={{ gap: SP.lg }}>
        <Baslik
          ust="Bölüm 01"
          ad="Konum değiştirme"
          alt={`Oyunda ${GUZERGAHLAR.length} güzergâh var. Her blok kapısından girmeden önce bu sahne oynuyor; 1. günde çalışmıyor çünkü sevk gününde bölge zaten turla geziliyor.`}
        />
        <View style={{ gap: SP.sm }}>
          {GUZERGAHLAR.map(([anahtar, y]) => (
            <Kart
              key={anahtar}
              ad={y.hedef}
              alt={`${anahtar} · ${y.adim} adım · ${y.manzara.length} manzara parçası`}
              saglik={`${y.adim}`}
              renk={C.steel}
              onPress={() => {
                setSecili(anahtar);
                setVardi(0);
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik ust={secili} ad={yol.hedef} alt="Aşağıdaki sahne canlı — dokundukça adım atıyor." />

      <Kutu baslik="Sahne verisi" renk={C.steel}>
        <Satir ad="blok anahtarı" deger={blokAnahtari(secili)} />
        <Satir ad="hedef" deger={yol.hedef} />
        <Satir ad="adım sayısı" deger={yol.adim} />
        <Satir ad="varış mekanı" deger={yol.mekan} />
        <Satir ad="manzara" deger={yol.manzara.join(' → ')} />
      </Kutu>

      <Kutu baslik="Sahneyi besleyen durum" renk={C.brass}>
        <Sayi ad="gün" deger={gun} onDegis={setGun} min={1} max={28} />
        <Sayi ad="blok indeksi" deger={blok} onDegis={setBlok} min={0} max={11} />
        <Sayi ad="saat (dakika)" deger={saat} onDegis={setSaat} adim={30} min={0} max={1439} />
        <Satir ad="saat" deger={saate(saat)} renk={C.brass} />
        <Satir ad="hava" deger={hava} renk={C.steel} />
        <Satir
          ad="havanın etkisi"
          deger={
            Object.entries(etki).length
              ? Object.entries(etki)
                  .map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`)
                  .join(' · ')
              : 'yok'
          }
          renk={C.canvasDim}
        />
      </Kutu>

      <Kutu baslik="Manzara parçaları" renk={C.line}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SP.md, alignItems: 'flex-end' }}>
          {yol.manzara.map((m, i) => (
            <View key={`${m}-${i}`} style={{ alignItems: 'center', gap: 2 }}>
              <PixelSprite sprite={sprite(m)} scale={2} />
              <PixelText size="micro" color={C.canvasFaint}>
                {m}
              </PixelText>
            </View>
          ))}
          <View style={{ alignItems: 'center', gap: 2 }}>
            <PixelSprite sprite={sprite(yol.mekan)} scale={2} />
            <PixelText size="micro" color={C.brass}>
              {yol.mekan} (varış)
            </PixelText>
          </View>
        </View>
      </Kutu>

      <View
        style={{
          borderWidth: 2,
          borderColor: C.line,
          backgroundColor: C.bg,
          padding: SP.sm,
        }}
      >
        <YolSahnesi
          key={`${secili}-${gun}-${blok}-${saat}-${vardi}`}
          hedef={yol.hedef}
          adim={yol.adim}
          mekan={yol.mekan}
          manzara={yol.manzara}
          saat={saate(saat)}
          gun={gun}
          blokIndex={blok}
          onVardi={() => setVardi((v) => v + 1)}
        />
      </View>

      {vardi > 0 && (
        <Cikti
          satirlar={[
            'VARDI',
            `onVardi ${vardi} kez tetiklendi — oyunda bu, bloğun ilk sahnesine geçiyor.`,
          ]}
        />
      )}

      <View style={{ gap: SP.sm }}>
        <PixelButton label="Sahneyi baştan başlat" onPress={() => setVardi((v) => v + 1)} />
        <PixelButton
          label="Oyunda bu bloğa atla"
          tur="sessiz"
          onPress={() =>
            g.gelistirmeAtla({ ekran: 'oyun', gun, blokIndex: blok, sahneIndex: 0, saat })
          }
        />
        <PixelButton label="‹ Güzergâh listesi" tur="sessiz" onPress={() => setSecili(null)} />
      </View>
    </View>
  );
}
