import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import {
  KAYIT_ADI,
  ROL_ADI,
  TUM_GORUSMELER,
  bant,
  gorusmeSec,
  kosulTutar,
  replikCoz,
  secenekleriHazirla,
} from '../../content/telefon';
import type { Gorusme, Rol } from '../../content/telefon';
import { telefonDurumuOku } from '../../store/gameStore';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelText } from '../../ui/PixelText';
import { GorusmePaneli } from '../../screens/Paneller';
import { Baslik, Cikti, Kart, Kutu, Satir, Secenekler } from '../parcalar';

const ROLLER: Rol[] = ['anne', 'baba', 'sevgili', 'kanka', 'kardes', 'es', 'akraba'];
const GUNLER_28 = Array.from({ length: 28 }, (_, i) => i + 1);

const ROL_RENK: Record<Rol, string> = {
  anne: C.tea,
  baba: C.steel,
  sevgili: '#C4707A',
  kanka: C.olive,
  kardes: C.ekmek,
  es: C.tea,
  akraba: C.canvasDim,
};

/**
 * Telefon motoru: 28 günün tamamı burada. Gün ve rol seçince motorun o
 * koşullarda hangi görüşmeyi seçtiği, kaç raunt vereceği ve hangi
 * seçeneklerin açılacağı görünüyor — oyunu oynamadan.
 */
export function BolumTelefon() {
  const g = useSecili('aktifGorusme', 'gelistirmeAtla', 'gun', 'kisiAra', 'rehber');
  const [gun, setGun] = useState(g.gun);
  const [rol, setRol] = useState<Rol>('anne');
  const [ayrinti, setAyrinti] = useState<Gorusme | null>(null);
  const [panelAcik, setPanelAcik] = useState(false);

  if (panelAcik && g.aktifGorusme) {
    return <GorusmePaneli />;
  }

  const durum = { ...telefonDurumuOku(), gun };
  const secilen = gorusmeSec(TUM_GORUSMELER, rol, durum);
  const gunHavuzu = TUM_GORUSMELER.filter(
    (x) => x.rol === rol && (!x.gunler || (Array.isArray(x.gunler) ? x.gunler.includes(gun) : gun >= x.gunler.min && gun <= x.gunler.max)),
  );

  if (ayrinti) {
    const kok = replikCoz(ayrinti, ayrinti.kok, durum);
    const secenekler = kok ? secenekleriHazirla(kok, durum, ayrinti.rol, !durum.telefonVar) : [];
    return (
      <View style={{ gap: SP.lg }}>
        <Baslik ust={ayrinti.id} ad={ROL_ADI[ayrinti.rol]} alt={`${ayrinti.tur} · kayıt: ${KAYIT_ADI[ayrinti.kayit]}`} />

        <Kutu baslik="Görüşme verisi" renk={ROL_RENK[ayrinti.rol]}>
          <Satir ad="replik sayısı" deger={Object.keys(ayrinti.replikler).length} />
          <Satir
            ad="seçenek sayısı"
            deger={Object.values(ayrinti.replikler).reduce(
              (t, r) => t + (r.secenekler?.length ?? 0),
              0,
            )}
          />
          <Satir ad="öncelik" deger={ayrinti.oncelik ?? '-'} />
          <Satir ad="tek sefer" deger={ayrinti.tekSefer === false ? 'hayır' : 'evet'} />
          <Satir
            ad="günler"
            deger={
              !ayrinti.gunler
                ? 'her gün'
                : Array.isArray(ayrinti.gunler)
                  ? ayrinti.gunler.join(', ')
                  : `${ayrinti.gunler.min}–${ayrinti.gunler.max}`
            }
          />
          <Satir ad="koşul tutuyor mu" deger={kosulTutar(ayrinti.kosul, durum) ? 'evet' : 'HAYIR'} renk={kosulTutar(ayrinti.kosul, durum) ? C.olive : C.rust} />
          <PixelText size="micro" color={C.canvasFaint} line="snug">
            {`Kapanış: ${ayrinti.kapanis}`}
          </PixelText>
        </Kutu>

        <Kutu baslik="Açılış repliği" renk={C.line}>
          {kok ? (
            <>
              <PixelText size="small" color={C.canvas} line="snug">
                {kok.metin}
              </PixelText>
              <View style={{ gap: 2, marginTop: SP.xs }}>
                {secenekler.map((s) => (
                  <PixelText key={s.id} size="micro" color={C.brass} line="snug">
                    {`› ${s.label}`}
                  </PixelText>
                ))}
              </View>
              <PixelText size="micro" color={C.canvasFaint}>
                {`${secenekler.length} / ${kok.secenekler?.length ?? 0} seçenek açık — ilişki bandı: ${bant(durum.iliski[ayrinti.rol])}`}
              </PixelText>
            </>
          ) : (
            <PixelText size="small" color={C.rust}>
              Kök repliğin koşulu bu durumda tutmuyor.
            </PixelText>
          )}
        </Kutu>

        <PixelButton label="‹ Görüşme listesi" tur="sessiz" onPress={() => setAyrinti(null)} />
      </View>
    );
  }

  const kisi = g.rehber.find(
    (k) => (k.rol ?? 'akraba') === (rol === 'anne' || rol === 'baba' ? 'ev' : rol),
  );

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Bölüm 05"
        ad="Telefon"
        alt={`${TUM_GORUSMELER.length} görüşme. Motor gün + rol + ilişki + gerilim + hafızaya bakıp birini seçiyor; aşağıda o seçimi ve neden onu seçtiğini görüyorsun.`}
      />

      <Kutu baslik="Gün" renk={C.brass}>
        <Secenekler liste={GUNLER_28} secili={gun} onSec={setGun} />
      </Kutu>

      <Kutu baslik="Rol" renk={ROL_RENK[rol]}>
        <Secenekler liste={ROLLER} secili={rol} onSec={setRol} etiket={(r) => ROL_ADI[r]} />
        <Satir ad="ilişki" deger={durum.iliski[rol]} renk={ROL_RENK[rol]} />
        <Satir ad="bant" deger={bant(durum.iliski[rol])} />
        <Satir ad="gerilim" deger={durum.gerilim[rol]} renk={durum.gerilim[rol] >= 25 ? C.rust : C.canvasDim} />
        <Satir ad="son arandığı gün" deger={durum.sonArama[rol] || 'hiç'} />
        <Satir ad="raunt" deger={durum.telefonVar ? '4 (kendi telefonu)' : '2 (ankesör)'} />
      </Kutu>

      <Cikti
        satirlar={
          secilen
            ? [
                'MOTORUN SEÇİMİ',
                `${secilen.id} · ${secilen.tur} · öncelik ${secilen.oncelik ?? (secilen.tur === 'omurga' ? 100 : secilen.tur === 'dal' ? 50 : 0)}`,
                `${Object.keys(secilen.replikler).length} replik`,
              ]
            : ['SEÇİM YOK', `${gun}. günde ${ROL_ADI[rol]} için oynanabilir görüşme bulunamadı.`]
        }
      />

      {kisi && (
        <PixelButton
          label={`${kisi.ad} kişisini gerçekten ara`}
          onPress={() => {
            g.gelistirmeAtla({ gun, ekran: 'gelistirme' });
            g.kisiAra(kisi.id);
            setPanelAcik(true);
          }}
        />
      )}
      {!kisi && (
        <Kutu baslik="Rehberde yok" renk={C.rust}>
          <PixelText size="small" color={C.canvasDim} line="snug">
            {`${ROL_ADI[rol]} için rehberde kayıt yok. Künye ekranından ekle ya da Durum bölümünden örnek kadroyu yükle.`}
          </PixelText>
        </Kutu>
      )}

      <Baslik ad={`${gun}. günün havuzu`} alt={`${gunHavuzu.length} görüşme bu güne uygun`} />
      <View style={{ gap: SP.sm }}>
        {gunHavuzu.map((x) => {
          const tutuyor = kosulTutar(x.kosul, durum);
          const gorulmus = durum.gorulmus.includes(x.id);
          return (
            <Kart
              key={x.id}
              ad={x.id}
              alt={`${x.tur} · ${Object.keys(x.replikler).length} replik${tutuyor ? '' : ' · koşul tutmuyor'}${gorulmus ? ' · görülmüş' : ''}`}
              saglik={x.id === secilen?.id ? 'SEÇİLDİ' : undefined}
              renk={x.id === secilen?.id ? C.brass : tutuyor ? ROL_RENK[rol] : C.line}
              onPress={() => setAyrinti(x)}
            />
          );
        })}
      </View>
    </View>
  );
}
