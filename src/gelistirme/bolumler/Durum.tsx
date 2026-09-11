import React from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { TUM_ROLLER, bant } from '../../content/telefon';
import type { Rol } from '../../content/telefon';
import { TUM_STATLAR } from '../../engine/stats';
import { useGame } from '../../store/gameStore';
import { PixelButton } from '../../ui/PixelButton';
import { PixelText } from '../../ui/PixelText';
import { Baslik, Kutu, Satir, Sayi } from '../parcalar';

/**
 * Durum: oyunun bütün sayıları tek ekranda, hepsi düzenlenebilir.
 * Hazır senaryolar, tek tek ayarlamak yerine bir duruma zıplamak için.
 */
export function BolumDurum() {
  const g = useGame();

  const stat = (k: (typeof TUM_STATLAR)[number], v: number) =>
    g.gelistirmeAtla({ stats: { ...g.stats, [k]: v }, ekran: 'gelistirme' });

  const iliskiAyar = (rol: Rol, v: number) =>
    g.gelistirmeAtla({ iliski: { ...g.iliski, [rol]: v }, ekran: 'gelistirme' });

  const senaryo = (ad: string, yama: Parameters<typeof g.gelistirmeAtla>[0]) => (
    <PixelButton
      key={ad}
      label={ad}
      tur="sessiz"
      onPress={() => g.gelistirmeAtla({ ...yama, ekran: 'gelistirme' })}
    />
  );

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Bölüm 09"
        ad="Durum"
        alt="Oyunun tuttuğu her sayı. Değiştirdiğin an oyuna yansıyor, kayda da yazılıyor."
      />

      <Kutu baslik="Hazır senaryo" renk={C.brass}>
        {senaryo('Örnek kadro yükle (Ev · İrem · Barış)', {
          rehber: [
            { id: 'dev-ev', ad: 'Ev', yakinlik: 'Ev', rol: 'ev' },
            { id: 'dev-sevgili', ad: 'İrem', yakinlik: 'Sevgilim', rol: 'sevgili' },
            { id: 'dev-kanka', ad: 'Barış', yakinlik: 'Kankam', rol: 'kanka' },
          ],
          profil: { ad: g.profil.ad || 'Berke', sigaraIciyor: g.profil.sigaraIciyor },
          sevgiliVar: true,
        })}
        {senaryo('Kendi telefonu + bol kontör', {
          envanter: {
            ...g.envanter,
            kamerasizTelefon: { adet: 1, kalite: 'standart' },
            kontor: { adet: 20, kalite: 'standart' },
            sigara: { adet: 10, kalite: 'standart' },
          },
        })}
        {senaryo('Ankesör senaryosu (telefonsuz, 3 kontör)', {
          envanter: { ...g.envanter, kamerasizTelefon: undefined, kontor: { adet: 3, kalite: 'standart' } },
        })}
        {senaryo('İlişkiler tavanda', {
          iliski: { anne: 95, baba: 92, sevgili: 95, kanka: 95, kardes: 90, es: 90, akraba: 80 },
          gerilim: { anne: 0, baba: 0, sevgili: 0, kanka: 0, kardes: 0, es: 0, akraba: 0 },
        })}
        {senaryo('İlişkiler dibde (kötü final)', {
          iliski: { anne: 35, baba: 30, sevgili: 15, kanka: 20, kardes: 30, es: 30, akraba: 30 },
          gerilim: { anne: 20, baba: 10, sevgili: 85, kanka: 40, kardes: 0, es: 0, akraba: 0 },
          stats: { ...g.stats, moral: 28 },
        })}
        {senaryo('Örnek hafıza yükle (epilog dolsun)', {
          hafiza: {
            ilk_gece: { deger: 'dayanamam', gun: 1 },
            cikis_plani: { deger: 'uyku', gun: 5 },
            ilk_gorecek: { deger: 'sevgili', gun: 5 },
            yemek_beyani: { deger: 'kotu', gun: 2 },
            en_cok_ozlenen: { deger: 'aile', gun: 23 },
          },
        })}
        {senaryo('Dostlukları aç (muhabbet havuzu dolsun)', {
          dostluk: { emre: 30, tolga: 25, serkan: 20 },
        })}
      </Kutu>

      <Kutu baslik="İstatistikler" renk={C.olive}>
        {TUM_STATLAR.map((k) => (
          <Sayi key={k} ad={k} deger={g.stats[k]} onDegis={(v) => stat(k, v)} adim={5} />
        ))}
        <Sayi
          ad="para"
          deger={g.para}
          onDegis={(v) => g.gelistirmeAtla({ para: v, ekran: 'gelistirme' })}
          adim={100}
          max={99999}
        />
        <Sayi
          ad="nikotin"
          deger={g.nikotin}
          onDegis={(v) => g.gelistirmeAtla({ nikotin: v, ekran: 'gelistirme' })}
          adim={10}
        />
      </Kutu>

      <Kutu baslik="İlerleme" renk={C.ekmek}>
        <Sayi
          ad="gün"
          deger={g.gun}
          onDegis={(v) => g.gelistirmeAtla({ gun: v, ekran: 'gelistirme' })}
          min={1}
          max={28}
        />
        <Sayi
          ad="blok"
          deger={g.blokIndex}
          onDegis={(v) => g.gelistirmeAtla({ blokIndex: v, sahneIndex: 0, ekran: 'gelistirme' })}
          max={11}
        />
        <Sayi
          ad="sahne"
          deger={g.sahneIndex}
          onDegis={(v) => g.gelistirmeAtla({ sahneIndex: v, ekran: 'gelistirme' })}
          max={20}
        />
        <Satir ad="biten gün" deger={g.bitenGunler.length} />
        <Satir ad="cepte izmarit" deger={g.cepteIzmarit} />
      </Kutu>

      <Kutu baslik="Telefon ilişkileri" renk={C.tea}>
        {TUM_ROLLER.map((rol) => (
          <View key={rol} style={{ gap: 2 }}>
            <Sayi ad={rol} deger={g.iliski[rol]} onDegis={(v) => iliskiAyar(rol, v)} adim={5} />
            <Satir
              ad={`  bant · gerilim`}
              deger={`${bant(g.iliski[rol])} · ${g.gerilim[rol]}`}
              renk={g.gerilim[rol] >= 25 ? C.rust : C.canvasFaint}
            />
          </View>
        ))}
        <Sayi
          ad="özlem"
          deger={g.ozlem}
          onDegis={(v) => g.gelistirmeAtla({ ozlem: v, ekran: 'gelistirme' })}
          adim={5}
        />
      </Kutu>

      <Kutu baslik={`Hafıza (${Object.keys(g.hafiza).length} işaret)`} renk={C.canvasDim}>
        {Object.keys(g.hafiza).length === 0 ? (
          <PixelText size="small" color={C.canvasFaint}>
            Boş.
          </PixelText>
        ) : (
          Object.entries(g.hafiza).map(([ad, v]) => (
            <Satir key={ad} ad={ad} deger={`${v.deger} · g${v.gun}`} />
          ))
        )}
        {Object.keys(g.hafiza).length > 0 && (
          <PixelButton
            label="Hafızayı temizle"
            tur="sessiz"
            onPress={() =>
              g.gelistirmeAtla({ hafiza: {}, gorulmusGorusmeler: [], ekran: 'gelistirme' })
            }
          />
        )}
      </Kutu>

      <Kutu baslik={`Envanter (${Object.keys(g.envanter).length})`} renk={C.line}>
        {Object.entries(g.envanter).map(([id, v]) => (
          <Satir key={id} ad={id} deger={`${v?.adet} · ${v?.kalite}`} />
        ))}
      </Kutu>
    </View>
  );
}
