import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { GIYINME_ASAMALARI } from '../art/sprites';
import { BOLGE_ADI, duzendekiler } from '../content/dolap';
import type { DolapBolgesi, DolapDuzeni, Envanter } from '../engine/types';
import { KUTU, SECILMEZ, planKur, yuva } from '../screens/DolapYerlesimi';
import { useGame } from '../store/gameStore';
import { Siddet, titret } from '../ui/haptik';
import { PixelText } from '../ui/PixelText';
import { AskerDurusu, KapaliGoz, KogusFonu, Paspas, RafEsyalari, RanzaCizimi, SacDolap } from './KogusFonu';
import { TasinanParca } from './TasinanParca';
import { clamp01, type MiniOyunProps } from './types';

/**
 * Sabah giyinme. Yatak toplandı, içtimaya on dakika var. Fanila, pantolon,
 * çorap, postal, ceket — sırayla, dolabın içinden.
 *
 * Dolap ilk gün nasıl yerleştirildiyse öyle: raflar kapalı, bakmak zaman
 * alıyor. İpucu olağan yeri söylüyor ("çamaşır üst rafta olur"); ilk gün
 * yanlış rafa koyduysan orada bulamıyor, aramaya devam ediyorsun. Torbayı
 * dolaba boşaltmış olan alt gözdeki yığını karıştırıyor. Dolap kaydının
 * her sabah bir karşılığı var.
 */

type Yer = DolapBolgesi | 'ranza';
type GiysiId = 'fanila' | 'pantolon' | 'corap' | 'postal' | 'ceket';

type Tanim = {
  id: GiysiId;
  ad: string;
  sprite: SpriteKey;
  /** Dolaptaki hangi eşyanın içinden çıkıyor. Postal dolapta değil, ranzanın altında. */
  kaynak: 'askerSeti' | 'uniforma' | null;
  /** Onbaşı'nın öğrettiği yer: ipucu bunu söylüyor, dolap başka bir şey diyebilir. */
  olagan: Yer;
  ipucu: string;
};

/** Giyinme sırası. Postal çoraptan sonra, ceket her şeyden sonra. */
const SIRA: Tanim[] = [
  { id: 'fanila', ad: 'Fanila', sprite: 'tisort', kaynak: 'askerSeti', olagan: 'ust', ipucu: 'Çamaşır üst rafta olur.' },
  { id: 'pantolon', ad: 'Pantolon', sprite: 'pantolon', kaynak: 'uniforma', olagan: 'aski', ipucu: 'Üniforma askıda.' },
  { id: 'corap', ad: 'Çorap', sprite: 'corap', kaynak: 'askerSeti', olagan: 'ust', ipucu: 'Çorap çamaşırla beraber durur.' },
  { id: 'postal', ad: 'Postal', sprite: 'postal', kaynak: null, olagan: 'ranza', ipucu: 'Postal ranzanın altında.' },
  { id: 'ceket', ad: 'Ceket', sprite: 'uniformaKatli', kaynak: 'uniforma', olagan: 'aski', ipucu: 'Ceket askıda, pantolonun yanında.' },
];

type Giysi = Tanim & { yer: Yer; dunku: boolean };

function giysileriYerlestir(duzen: DolapDuzeni | null, envanter: Envanter): Giysi[] {
  const setVar = (envanter.askerSeti?.adet ?? 0) > 0;
  return SIRA.map((t) => {
    if (!t.kaynak) return { ...t, yer: 'ranza', dunku: false };
    // Çamaşır seti yoksa temiz fanila ve çorap da yok: dünküler ranzanın ucunda.
    if (t.kaynak === 'askerSeti' && !setVar) {
      return {
        ...t,
        ad: `Dünkü ${t.ad.toLocaleLowerCase('tr-TR')}`,
        ipucu: 'Temizi yok. Dünkü ranzanın ucunda.',
        yer: 'ranza',
        dunku: true,
      };
    }
    return { ...t, yer: duzen?.yerler[t.kaynak] ?? t.olagan, dunku: false };
  });
}

const ACILAN: DolapBolgesi[] = ['ust', 'aski', 'orta', 'alt'];
const ARAMA_MS = 650;
const YIGIN_MS = 1900;
const ALT_BOY = 150;

export function Giyinme({ onBitti, zorluk = 0 }: MiniOyunProps) {
  const duzen = useGame((s) => s.dolapDuzeni);
  const envanter = useGame((s) => s.envanter);
  const giysiler = useMemo(() => giysileriYerlestir(duzen, envanter), [duzen, envanter]);
  // İlk sürüm 24 saniyeydi; rafları açıp beş parçayı taşımaya yetmiyordu.
  const toplam = Math.round((60 - zorluk * 15) * 1000);

  const [en, setEn] = useState(0);
  const [asama, setAsama] = useState(0);
  const [acik, setAcik] = useState<Yer[]>(['ranza']);
  const [araniyor, setAraniyor] = useState<Yer | null>(null);
  const [kalan, setKalan] = useState(toplam);
  const [mesaj, setMesaj] = useState<string | null>(null);

  // Zamanlayıcılardan okunan aşama; artış yalnızca `giy` içinde.
  const asamaRef = useRef(0);
  const yanlis = useRef(0);
  const durdu = useRef(false);
  const bitti = useRef(false);
  const basla = useRef(0);
  const zamanlayicilar = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mesajZamani = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sonra = useCallback((fn: () => void, ms: number) => {
    zamanlayicilar.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      zamanlayicilar.current.forEach(clearTimeout);
      if (mesajZamani.current) clearTimeout(mesajZamani.current);
    },
    [],
  );

  const goster = useCallback((m: string) => {
    setMesaj(m);
    if (mesajZamani.current) clearTimeout(mesajZamani.current);
    mesajZamani.current = setTimeout(() => setMesaj(null), 1500);
  }, []);

  const bitir = useCallback(
    (tamam: boolean, kalanMs: number, giyilen: number) => {
      if (bitti.current) return;
      bitti.current = true;
      const dunku = giysiler.filter((g) => g.dunku).length;
      const temel = tamam ? 0.55 + 0.45 * (kalanMs / toplam) : 0.4 * (giyilen / SIRA.length);
      onBitti(clamp01(temel - yanlis.current * 0.06 - dunku * 0.1));
    },
    [giysiler, onBitti, toplam],
  );

  // İçtimaya kalan süre. Biterse giyindiğin kadarıyla çıkıyorsun.
  useEffect(() => {
    basla.current = Date.now();
    const id = setInterval(() => {
      if (durdu.current) return;
      const k = Math.max(0, toplam - (Date.now() - basla.current));
      setKalan(k);
      if (k <= 0) {
        durdu.current = true;
        bitir(false, 0, asamaRef.current);
      }
    }, 100);
    return () => clearInterval(id);
  }, [bitir, toplam]);

  // Son parça da giyildi: askerin tam hâli bir an görünsün, sonra içtimaya.
  useEffect(() => {
    if (asama < SIRA.length || durdu.current) return;
    durdu.current = true;
    const k = Math.max(0, toplam - (Date.now() - basla.current));
    sonra(() => bitir(true, k, SIRA.length), 700);
  }, [asama, bitir, sonra, toplam]);

  const ac = (yer: Yer) => {
    if (araniyor || acik.includes(yer) || durdu.current) return;
    const yigin = !!duzen?.hizli && yer === 'alt';
    titret(Siddet.Light);
    setAraniyor(yer);
    sonra(
      () => {
        setAraniyor(null);
        setAcik((a) => [...a, yer]);
        const burada = giysiler.slice(asamaRef.current).some((g) => g.yer === yer);
        if (!burada) goster('Burada yok. Nereye koymuştun?');
        else if (yigin) goster('Her şey birbirine girmiş. Sonunda buldun.');
      },
      yigin ? YIGIN_MS : ARAMA_MS,
    );
  };

  const giy = useCallback(
    (id: GiysiId) => {
      if (durdu.current) return;
      const beklenen = giysiler[asamaRef.current];
      if (!beklenen) return;
      if (beklenen.id !== id) {
        yanlis.current += 1;
        titret(Siddet.Rigid);
        goster(`Önce ${beklenen.ad.toLocaleLowerCase('tr-TR')}.`);
        return;
      }
      titret(Siddet.Medium);
      asamaRef.current += 1;
      setAsama(asamaRef.current);
    },
    [giysiler, goster],
  );

  const plan = useMemo(() => (en > 0 ? planKur(en, 0) : null), [en]);
  const altY = plan ? plan.dolap.h + 12 : 0;
  const ranza = { x: 0, y: altY, w: en * 0.5 - 6, h: ALT_BOY };
  const govde = { x: en * 0.5 + 6, y: altY, w: en * 0.5 - 6, h: ALT_BOY };

  const onBirak = useCallback(
    (id: GiysiId, x: number, y: number) => {
      const icinde = x >= govde.x && x <= govde.x + govde.w && y >= govde.y && y <= govde.y + govde.h;
      if (icinde) giy(id);
    },
    [giy, govde.h, govde.w, govde.x, govde.y],
  );

  const sonraki = giysiler[asama];
  const kalanlar = giysiler.slice(asama);
  const dk = Math.ceil((kalan / toplam) * 10);

  // Oyuna konu olan (çamaşır seti, üniforma) dışındaki dolap eşyaları süs olarak rafta.
  const rafSuslari = (yer: DolapBolgesi) =>
    duzen
      ? duzendekiler(duzen)
          .filter((p) => duzen.yerler[p.id] === yer && p.id !== 'askerSeti' && p.id !== 'uniforma')
          .map((p) => sprite(p.sprite))
      : [];

  const konum = (g: Giysi) => {
    if (!plan) return null;
    const ayni = kalanlar.filter((k) => k.yer === g.yer);
    const sira = ayni.indexOf(g);
    if (g.yer === 'ranza') return { x: ranza.x + 8 + sira * (KUTU + 6), y: ranza.y + 34 };
    const r = plan.bolgeler.find((b) => b.id === g.yer)!;
    return yuva(r, sira, ayni.length);
  };

  return (
    <View style={{ gap: SP.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SP.sm }}>
        <PixelText font="command" size="h3" color={C.canvas} style={{ flex: 1 }}>
          İÇTİMAYA
        </PixelText>
        <PixelText font="command" size="h3" color={kalan / toplam < 0.3 ? C.rust : C.brass}>
          {`${dk} DK`}
        </PixelText>
      </View>
      <View style={{ height: 8, backgroundColor: C.ink, borderWidth: 1, borderColor: C.line }}>
        <View
          style={{
            height: '100%',
            width: `${(kalan / toplam) * 100}%`,
            backgroundColor: kalan / toplam < 0.3 ? C.rust : C.brass,
          }}
        />
      </View>

      <PixelText size="small" color={C.brass} line="snug">
        {sonraki ? `Sıradaki: ${sonraki.ad}. ${sonraki.ipucu}` : 'Hazırsın. İçtimaya!'}
      </PixelText>

      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={[{ height: plan ? altY + ALT_BOY : 520 }, SECILMEZ]}
      >
        {plan && (
          <>
            {/* Koğuş sabahı: dolabın arkasında duvar, önünde karo, pencereden ışık */}
            <KogusFonu en={en} yukseklik={altY + ALT_BOY} zeminY={plan.dolap.h - 6} gece={false} />
            <SacDolap plan={plan} />

            {/* Kapalı raflar: bakana kadar içi görünmüyor */}
            {/* Açık gözlerde rafta duran, oyuna konu olmayan eşyalar */}
            {ACILAN.filter((yer) => acik.includes(yer)).map((yer) => (
              <RafEsyalari
                key={`raf-${yer}`}
                r={plan.bolgeler.find((b) => b.id === yer)!}
                spritelar={rafSuslari(yer)}
              />
            ))}

            {/* Kapalı gözler: sac kapak; bakana kadar içi görünmüyor */}
            {ACILAN.filter((yer) => !acik.includes(yer)).map((yer) => {
              const r = plan.bolgeler.find((b) => b.id === yer)!;
              const bakiyor = araniyor === yer;
              return (
                <Pressable
                  key={yer}
                  accessibilityRole="button"
                  accessibilityLabel={`${BOLGE_ADI[yer]} rafına bak`}
                  onPress={() => ac(yer)}
                  style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h }}
                >
                  <KapaliGoz
                    r={r}
                    ad={BOLGE_ADI[yer]}
                    nabiz={!araniyor && sonraki?.olagan === yer}
                    bakiyor={bakiyor}
                    karistiriyor={!!duzen?.hizli && yer === 'alt'}
                  />
                </Pressable>
              );
            })}

            {/* Ranza: postal altında, dünkü çamaşır ucunda */}
            <View
              style={{
                position: 'absolute',
                left: ranza.x,
                top: ranza.y,
                width: ranza.w,
                height: ranza.h,
              }}
            >
              <RanzaCizimi kutu={ranza} />
            </View>

            {/* Sen: parçaları buraya sürükle */}
            <View
              style={{
                position: 'absolute',
                left: govde.x,
                top: govde.y,
                width: govde.w,
                height: govde.h,
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: SP.xs,
              }}
            >
              {/* Ranzanın dibinde, paspasın üstünde sen */}
              <AskerDurusu kare={GIYINME_ASAMALARI[Math.min(asama, SIRA.length)]} />
              <View style={{ marginTop: -6 }}>
                <Paspas en={Math.min(govde.w - 20, 110)} />
              </View>
            </View>

            {kalanlar
              .filter((g) => acik.includes(g.yer))
              .map((g) => {
                const k = konum(g);
                if (!k) return null;
                return (
                  <TasinanParca
                    key={g.id}
                    id={g.id}
                    ad={`${g.ad}, giy`}
                    sprite={g.sprite}
                    cerceve={g.dunku ? C.rust : undefined}
                    yanip={g.id === sonraki?.id}
                    x={k.x}
                    y={k.y}
                    onBirak={onBirak}
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
