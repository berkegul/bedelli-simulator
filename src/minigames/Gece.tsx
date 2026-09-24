import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { BORDER, C, SP } from '../theme';
import { type SpriteKey } from '../art';
import { GECE_KARELERI, GIYINME_ASAMALARI } from '../art/sprites';
import { BOLGE_ADI } from '../content/dolap';
import type { DolapBolgesi, DolapDuzeni, Envanter, EsyaId } from '../engine/types';
import { DolapCizimi, SECILMEZ, planKur, yuva } from '../screens/DolapYerlesimi';
import { useGame } from '../store/gameStore';
import { Siddet, titret } from '../ui/haptik';
import { PixelText } from '../ui/PixelText';
import { useGeriSayim } from './geriSayim';
import { AskerDurusu, KogusFonu, RanzaCizimi } from './KogusFonu';
import { TasinanParca } from './TasinanParca';
import { clamp01, type MiniOyunProps } from './types';

/**
 * Yatma hazırlığı. Son yoklamaya on dakika, ışıklar 22:00'de sönüyor.
 * Sabahın tersi: ceket ve pantolon askıya, postal ranzanın altına, çorap
 * kirli çamaşır torbasına — sonra pijama ve terlik dolaptan.
 *
 * Kirli torbası ilk gün koğuş düzen setini nereye koyduysan orada; ipucu
 * "askıda olur" diyor, başka yere koyduysan bırakırken bulamıyorsun.
 * Pijaman yoksa fanilayla, terliğin yoksa yalınayak yatıyorsun; yoklamada
 * ikisi de görünür.
 */

type Yer = DolapBolgesi | 'ranza';
type AdimId = 'ceket' | 'postal' | 'corap' | 'pantolon' | 'pijama' | 'terlik';

type Adim = {
  id: AdimId;
  ad: string;
  /** Çıkar: üstünden hedefe. Giy: dolaptan üstüne. */
  tur: 'cikar' | 'giy';
  sprite: SpriteKey;
  /** Çıkarılan parçanın gideceği ya da giyilecek parçanın durduğu yer. */
  yer: Yer;
  ipucu: string;
  yanlisMesaji: string;
};

function adimlariKur(duzen: DolapDuzeni | null, envanter: Envanter) {
  const varMi = (id: EsyaId) => (envanter[id]?.adet ?? 0) > 0;
  const yeri = (id: EsyaId, olagan: Yer): Yer => duzen?.yerler[id] ?? olagan;
  const torba = varMi('kogusDuzen');

  const adimlar: Adim[] = [
    {
      id: 'ceket',
      ad: 'Ceket',
      tur: 'cikar',
      sprite: 'uniformaKatli',
      yer: 'aski',
      ipucu: 'Ceket askıya.',
      yanlisMesaji: 'Ceket askıya asılır.',
    },
    {
      id: 'postal',
      ad: 'Postal',
      tur: 'cikar',
      sprite: 'postal',
      yer: 'ranza',
      ipucu: 'Postal ranzanın altına, burnu dışarıda.',
      yanlisMesaji: 'Postal dolaba girmez; ranzanın altına.',
    },
    torba
      ? {
          id: 'corap',
          ad: 'Çorap',
          tur: 'cikar',
          sprite: 'corap',
          yer: yeri('kogusDuzen', 'aski'),
          ipucu: 'Çorap kirli çamaşır torbasına. Torba askıda olur.',
          yanlisMesaji: 'Kirli torban orada değil. Nereye koymuştun?',
        }
      : {
          id: 'corap',
          ad: 'Çorap',
          tur: 'cikar',
          sprite: 'corap',
          yer: 'ranza',
          ipucu: 'Kirli torban yok; ranzanın ucuna bırak.',
          yanlisMesaji: 'Kirli torban yok. Ranzanın ucuna.',
        },
    {
      id: 'pantolon',
      ad: 'Pantolon',
      tur: 'cikar',
      sprite: 'pantolon',
      yer: 'aski',
      ipucu: 'Pantolon askıya, ceketin yanına.',
      yanlisMesaji: 'Pantolon askıya asılır.',
    },
  ];
  if (varMi('pijama')) {
    adimlar.push({
      id: 'pijama',
      ad: 'Pijama',
      tur: 'giy',
      sprite: 'pijama',
      yer: yeri('pijama', 'ust'),
      ipucu: 'Pijama katlı çamaşırla, üst rafta olur.',
      yanlisMesaji: '',
    });
  }
  if (varMi('terlik')) {
    adimlar.push({
      id: 'terlik',
      ad: 'Terlik',
      tur: 'giy',
      sprite: 'terlik',
      yer: yeri('terlik', 'alt'),
      ipucu: 'Terlik alt gözde olur.',
      yanlisMesaji: '',
    });
  }

  const eksikler = [
    !torba && 'Kirli torban yok',
    !varMi('pijama') && 'pijaman yok, fanilayla yatacaksın',
    !varMi('terlik') && 'terliğin yok, yalınayaksın',
  ].filter((e): e is string => !!e);

  return { adimlar, eksikler };
}

const ACILAN: DolapBolgesi[] = ['ust', 'aski', 'orta', 'alt'];
const ARAMA_MS = 650;
const YIGIN_MS = 1900;
const ALT_BOY = 150;
const EKSIK_CEZA = 0.12;

export function Gece({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const duzen = useGame((s) => s.dolapDuzeni);
  const envanter = useGame((s) => s.envanter);
  const { adimlar, eksikler } = useMemo(() => adimlariKur(duzen, envanter), [duzen, envanter]);
  // Giyinmeyle aynı oranda (2,5 kat) uzatıldı; 22 saniye altı adıma yetmiyordu.
  const toplam = Math.round((55 - zorluk * 12.5) * 1000);

  const [en, setEn] = useState(0);
  const [adim, setAdim] = useState(0);
  const [acik, setAcik] = useState<Yer[]>(['ranza']);
  const [araniyor, setAraniyor] = useState<Yer | null>(null);
  const [secili, setSecili] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);

  const adimRef = useRef(0);
  adimRef.current = adim;
  const yanlis = useRef(0);
  const bitti = useRef(false);
  const zamanlayicilar = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mesajZamani = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      zamanlayicilar.current.forEach(clearTimeout);
      if (mesajZamani.current) clearTimeout(mesajZamani.current);
    },
    [],
  );

  const sonra = (fn: () => void, ms: number) => {
    zamanlayicilar.current.push(setTimeout(fn, ms));
  };

  const goster = useCallback((m: string) => {
    setMesaj(m);
    if (mesajZamani.current) clearTimeout(mesajZamani.current);
    mesajZamani.current = setTimeout(() => setMesaj(null), 1500);
  }, []);

  const bitir = (tamam: boolean) => {
    if (bitti.current) return;
    bitti.current = true;
    sure.durdur();
    const temel = tamam ? 0.55 + 0.45 * sure.oran : 0.4 * (adimRef.current / adimlar.length);
    onBitti(clamp01(temel - yanlis.current * 0.06 - eksikler.length * EKSIK_CEZA));
  };
  const sure = useGeriSayim(toplam, () => bitir(false));

  // Son adım da bitti: askerin gece hâli bir an görünsün, sonra yoklama.
  useEffect(() => {
    if (adim < adimlar.length || bitti.current) return;
    sure.durdur();
    sonra(() => bitir(true), 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adim, adimlar.length]);

  const plan = useMemo(() => (en > 0 ? planKur(en, 0) : null), [en]);
  const altY = plan ? plan.dolap.h + 12 : 0;
  const ranza = { x: 0, y: altY, w: en * 0.5 - 6, h: ALT_BOY };
  const govde = { x: en * 0.5 + 6, y: altY, w: en * 0.5 - 6, h: ALT_BOY };

  const simdiki = adimlar[adim];

  /** Çıkarılan parçayı bir yere bırakmak: doğru yerse sıradaki adım. */
  const koy = (h: Yer | null) => {
    const a = adimlar[adimRef.current];
    if (!a || a.tur !== 'cikar' || bitti.current || !h) return;
    setSecili(false);
    if (h === a.yer) {
      titret(Siddet.Medium);
      setAdim((x) => x + 1);
      return;
    }
    yanlis.current += 1;
    titret(Siddet.Rigid);
    goster(a.yanlisMesaji);
  };

  const hedefBul = (x: number, y: number): Yer | null => {
    if (!plan) return null;
    if (x >= ranza.x && x <= ranza.x + ranza.w && y >= ranza.y && y <= ranza.y + ranza.h) return 'ranza';
    const r = plan.bolgeler.find(
      (b) =>
        (ACILAN as string[]).includes(b.id) && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h,
    );
    return (r?.id as Yer | undefined) ?? null;
  };

  /** Dolaptan alınan parçayı giymek; sırası değilse uyarı. */
  const giy = (id: AdimId) => {
    const a = adimlar[adimRef.current];
    if (!a || bitti.current) return;
    if (a.id !== id) {
      yanlis.current += 1;
      titret(Siddet.Rigid);
      goster(`Önce ${a.tur === 'cikar' ? 'üstündekini çıkar: ' : ''}${a.ad.toLocaleLowerCase('tr-TR')}.`);
      return;
    }
    titret(Siddet.Medium);
    setAdim((x) => x + 1);
  };

  const ac = (yer: Yer) => {
    if (araniyor || acik.includes(yer) || bitti.current) return;
    const yigin = !!duzen?.hizli && yer === 'alt';
    titret(Siddet.Light);
    setAraniyor(yer);
    sonra(
      () => {
        setAraniyor(null);
        setAcik((a) => [...a, yer]);
        const a = adimlar[adimRef.current];
        if (a?.tur === 'giy' && a.yer !== yer) goster('Burada yok. Nereye koymuştun?');
        else if (yigin) goster('Her şey birbirine girmiş.');
      },
      yigin ? YIGIN_MS : ARAMA_MS,
    );
  };

  /** Rafa ya da ranzaya dokunmak: elde parça varsa oraya koy, yoksa rafa bak. */
  const yereDokun = (yer: Yer) => {
    if (secili) koy(yer);
    else if (yer !== 'ranza') ac(yer);
  };

  // Asker: önce ters sırayla soyunuyor (sabahın aşamaları), sonra pijama ve terlik.
  const tamamlanan = adimlar.slice(0, adim);
  const cikan = tamamlanan.filter((a) => a.tur === 'cikar').length;
  const kare =
    cikan < 4
      ? GIYINME_ASAMALARI[5 - cikan]
      : GECE_KARELERI[tamamlanan.some((a) => a.id === 'pijama') ? 1 : 0][
          tamamlanan.some((a) => a.id === 'terlik') ? 1 : 0
        ];

  const giyilecekler = adimlar.slice(adim).filter((a) => a.tur === 'giy' && acik.includes(a.yer));
  const giyKonum = (a: Adim) => {
    if (!plan) return null;
    const ayni = giyilecekler.filter((g) => g.yer === a.yer);
    const r = plan.bolgeler.find((b) => b.id === a.yer)!;
    return yuva(r, ayni.indexOf(a), ayni.length);
  };

  const dk = Math.ceil(sure.oran * 10);
  const az = sure.oran < 0.3;

  return (
    <View style={{ gap: SP.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          YOKLAMAYA
        </PixelText>
        <PixelText font="command" size="h3" color={az ? C.rust : C.brass}>
          {`${dk} DK`}
        </PixelText>
      </View>
      <View style={{ height: 8, backgroundColor: C.ink, borderWidth: 1, borderColor: C.line }}>
        <View style={{ height: '100%', width: `${sure.oran * 100}%`, backgroundColor: az ? C.rust : C.brass }} />
      </View>

      <PixelText size="small" color={secili ? C.brass : C.canvasDim} line="snug">
        {!simdiki
          ? 'Hazırsın. Ranza başına!'
          : secili
            ? `${simdiki.ad} elinde. Koyacağın yere dokun.`
            : `${simdiki.tur === 'cikar' ? 'Çıkar' : 'Giy'}: ${simdiki.ad}. ${simdiki.ipucu}`}
      </PixelText>
      {eksikler.length > 0 && (
        <PixelText size="micro" color={C.rust} line="snug">
          {eksikler.join(' · ')}
        </PixelText>
      )}

      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={[{ height: plan ? altY + ALT_BOY : 520 }, SECILMEZ]}
      >
        {plan && (
          <>
            {/* Koğuş gece: tek tavan lambası, ranzalar karanlıkta */}
            <KogusFonu en={en} yukseklik={altY + ALT_BOY} zeminY={plan.dolap.h - 6} gece />
            <DolapCizimi plan={plan} />
            {/* Dolabın metali de lambanın dışında kalan loşlukta; eşyalar üstte, okunaklı */}
            <View
              pointerEvents="none"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: plan.dolap.h, backgroundColor: '#0B1026', opacity: 0.28 }}
            />

            {ACILAN.map((yer) => {
              const r = plan.bolgeler.find((b) => b.id === yer)!;
              const kapali = !acik.includes(yer);
              const bakiyor = araniyor === yer;
              return (
                <Pressable
                  key={yer}
                  accessibilityRole="button"
                  accessibilityLabel={kapali ? `${BOLGE_ADI[yer]} rafına bak` : BOLGE_ADI[yer]}
                  onPress={() => yereDokun(yer)}
                  style={{
                    position: 'absolute',
                    left: r.x,
                    top: r.y,
                    width: r.w,
                    height: r.h,
                    backgroundColor: kapali ? (bakiyor ? '#262418' : '#100F0A') : 'transparent',
                    borderWidth: secili ? 1 : 0,
                    borderStyle: 'dashed',
                    borderColor: C.line,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {kapali && (
                    <PixelText font="command" size="small" color={bakiyor ? C.brass : C.canvasFaint}>
                      {bakiyor
                        ? duzen?.hizli && yer === 'alt'
                          ? 'KARIŞTIRIYORSUN…'
                          : 'BAKIYORSUN…'
                        : `${BOLGE_ADI[yer].toLocaleUpperCase('tr-TR')} · BAK`}
                    </PixelText>
                  )}
                </Pressable>
              );
            })}

            {/* Ranza: postal altına, torbası olmayanın çorabı ucuna */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ranza"
              onPress={() => yereDokun('ranza')}
              style={{
                position: 'absolute',
                left: ranza.x,
                top: ranza.y,
                width: ranza.w,
                height: ranza.h,
                borderWidth: secili ? BORDER : 0,
                borderColor: C.brass,
              }}
            >
              <RanzaCizimi kutu={ranza} vurgulu={secili} />
            </Pressable>

            {/* Sen */}
            <View
              style={{
                position: 'absolute',
                left: govde.x,
                top: govde.y,
                width: govde.w,
                height: govde.h,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: '#4A4430',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: SP.xs,
              }}
            >
              <View style={{ position: 'absolute', top: SP.xs, right: SP.sm, backgroundColor: C.ink, paddingHorizontal: 4 }}>
                <PixelText font="command" size="micro" color={C.canvasDim}>
                  ÜSTÜN
                </PixelText>
              </View>
              <AskerDurusu kare={kare} />
            </View>

            {/* Üstündeki sıradaki parça: tut, yerine götür */}
            {simdiki?.tur === 'cikar' && (
              <TasinanParca
                key={simdiki.id}
                id={simdiki.id}
                ad={`${simdiki.ad}, çıkar`}
                sprite={simdiki.sprite}
                cerceve={secili ? C.brass : undefined}
                yanip={!secili}
                x={govde.x + 8}
                y={govde.y + 22}
                onBirak={(_id, x, y) => koy(hedefBul(x, y))}
                onDokun={() => setSecili((s) => !s)}
              />
            )}

            {/* Dolaptan giyilecekler: raf açılınca görünüyor */}
            {giyilecekler.map((a) => {
              const k = giyKonum(a);
              if (!k) return null;
              return (
                <TasinanParca
                  key={a.id}
                  id={a.id}
                  ad={`${a.ad}, giy`}
                  sprite={a.sprite}
                  yanip={a.id === simdiki?.id}
                  x={k.x}
                  y={k.y}
                  onBirak={(id, x, y) => {
                    const icinde =
                      x >= govde.x && x <= govde.x + govde.w && y >= govde.y && y <= govde.y + govde.h;
                    if (icinde) giy(id);
                  }}
                  onDokun={giy}
                />
              );
            })}
          </>
        )}
      </View>

      <View style={{ height: 22, justifyContent: 'center' }}>
        {mesaj && (
          <PixelText size="small" color={C.rust} center>
            {mesaj}
          </PixelText>
        )}
      </View>
    </View>
  );
}
