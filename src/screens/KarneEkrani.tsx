import React, { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { gunGetir } from '../content';
import { ROL_ADI, TUM_GORUSMELER } from '../content/telefon';
import { arkadas } from '../content/arkadaslar';
import { karneHesapla } from '../engine/karne';
import { STAT_META } from '../engine/types';
import { STAT_ORDER, TOPLAM_GUN } from '../engine/stats';
import { useGame } from '../store/gameStore';
import { useSecili } from '../store/secici';
import { CentikTakvim } from '../ui/CentikTakvim';
import { Bolum, Damga, Kagit, Satir } from '../ui/Kagit';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { sesCal } from '../ses';

/** Karnede notun mürekkebi: kâğıt üstünde okunur tonlar. */
const NOT_MUREKKEP: Record<string, string> = {
  'TAKDİR ALDI': '#7A5A12',
  'TEMİZ İŞ': '#4B5A22',
  'İDARE EDER': C.murekkep,
  'GAZ YEDİ': '#7A4A22',
  CEZALI: C.rust,
};

/**
 * Terhis karnesi. 28. gün kapanınca açılıyor: sicil defterinden gün notları,
 * son durum, koğuştaki yakınlıklar ve telefonda en çok kiminle konuşulduğu.
 * Sevk belgesiyle aynı kâğıt; oyun bir evrakla başlayıp bir evrakla bitiyor.
 */
export function KarneEkrani() {
  const g = useSecili('anaMenu', 'bitenGunler', 'dostluk', 'finalAc', 'profil', 'stats');
  const gorulmus = useGame((s) => s.gorulmusGorusmeler);
  const inset = useSafeAreaInsets();
  const k = useMemo(
    () => karneHesapla(g.bitenGunler, gorulmus, TUM_GORUSMELER, g.dostluk),
    [g.bitenGunler, gorulmus, g.dostluk],
  );

  useEffect(() => {
    sesCal('damga');
  }, []);

  const gunAdi = (gun: number) => `${gun}. gün · ${gunGetir(gun)?.title ?? ''}`;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{
        paddingTop: inset.top + SP.lg,
        paddingBottom: inset.bottom + SP.xl,
        paddingHorizontal: SP.lg,
        gap: SP.lg,
      }}
    >
      <PixelText size="small" color={C.canvasDim} center>
        Bölük yazıcısı kâğıdı daktilodan çekti, mührü bastı, sana uzattı.
      </PixelText>

      <Kagit>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: SP.md }}>
          <View style={{ flex: 1, gap: 2 }}>
            <PixelText font="command" size="small" color={C.murekkepSoluk} tracking={1}>
              BEDELLİ · TEMEL EĞİTİM
            </PixelText>
            <PixelText font="command" size="h2" color={C.murekkep} tracking={1}>
              TERHİS KARNESİ
            </PixelText>
            <PixelText font="command" size="small" color={C.murekkepSoluk}>
              {`ER ${g.profil.ad.toLocaleUpperCase('tr-TR')} · ${g.bitenGunler.length} / ${TOPLAM_GUN} GÜN`}
            </PixelText>
          </View>
          <Damga metin="TERHİS" />
        </View>

        <Bolum no="1." baslik="SİCİL">
          <View style={{ alignItems: 'center', paddingVertical: SP.sm, gap: 2 }}>
            <PixelText
              font="command"
              size="h1"
              color={g.bitenGunler.length ? NOT_MUREKKEP[k.genel.ad] : C.murekkepSoluk}
              tracking={2}
            >
              {g.bitenGunler.length ? k.genel.ad : 'KAYIT YOK'}
            </PixelText>
            <PixelText size="small" color={C.murekkepSoluk}>
              {g.bitenGunler.length
                ? `${g.bitenGunler.length} günün ortalaması ${k.genel.puan}`
                : 'Sicil defterine henüz gün işlenmedi.'}
            </PixelText>
          </View>
          {k.dagilim.map((d) => (
            <Satir key={d.ad} etiket={d.ad} deger={`${d.adet} gün`} renk={NOT_MUREKKEP[d.ad]} />
          ))}
          {k.enIyiGun && <Satir etiket="En iyi gün" deger={gunAdi(k.enIyiGun.gun)} />}
          {k.enKotuGun && k.enKotuGun.gun !== k.enIyiGun?.gun && (
            <Satir etiket="En zor gün" deger={gunAdi(k.enKotuGun.gun)} />
          )}
        </Bolum>

        <Bolum no="2." baslik="ÇENTİKLER">
          <View
            style={{
              alignItems: 'center',
              padding: SP.md,
              borderWidth: BORDER,
              borderColor: C.ink,
              backgroundColor: '#2B2719',
            }}
          >
            <CentikTakvim bitenGunler={g.bitenGunler} aktifGun={TOPLAM_GUN} aciklamasiz />
          </View>
        </Bolum>

        <Bolum no="3." baslik="ÇIKIŞTA DURUM">
          {STAT_ORDER.map((s) => (
            <Satir key={s} etiket={STAT_META[s].ad} deger={String(g.stats[s])} />
          ))}
        </Bolum>

        <Bolum no="4." baslik="KOĞUŞ">
          {k.arkadaslar.map((a) => (
            <Satir key={a.id} etiket={arkadas(a.id).ad} deger={a.derece} />
          ))}
        </Bolum>

        <Bolum no="5." baslik="ANKESÖR">
          {k.enCokKonusulan ? (
            <>
              <Satir etiket="En çok konuşulan" deger={ROL_ADI[k.enCokKonusulan.rol]} />
              <Satir etiket="Toplam görüşme" deger={String(k.toplamGorusme)} />
            </>
          ) : (
            <PixelText size="body" color={C.murekkepSoluk}>
              Yirmi sekiz gün boyunca kimseyi aramadın.
            </PixelText>
          )}
        </Bolum>

        <PixelText font="command" size="small" color={C.murekkepSoluk} center>
          {`TESLİM ALAN: ${g.profil.ad.toLocaleUpperCase('tr-TR')}`}
        </PixelText>
      </Kagit>

      <View style={{ gap: SP.sm }}>
        <PixelButton label="Nizamiyeden çık" onPress={g.finalAc} />
        <PixelButton label="Ana menü" tur="sessiz" onPress={g.anaMenu} />
      </View>
    </ScrollView>
  );
}
