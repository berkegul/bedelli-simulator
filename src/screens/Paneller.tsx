import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { sprite, type SpriteKey } from '../art';
import { gunGetir } from '../content';
import { arkadas, oturmaAlanindakiler } from '../content/arkadaslar';
import { sigaraIzni, telefonIzni } from '../engine/kurallar';
import type { ArkadasId } from '../engine/types';
import { KALITE_ADI, esya, kullanilabilirler } from '../content/esyalar';
import { useGame } from '../store/gameStore';
import { DukkanListesi } from '../ui/DukkanListesi';
import { DersSahnesi } from './DersSahnesi';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { PixelSprite } from '../ui/PixelSprite';
import { PixelText } from '../ui/PixelText';

const ARKADAS_SPRITE: Record<ArkadasId, 'askerEmre' | 'askerTolga' | 'askerSerkan'> = {
  emre: 'askerEmre',
  tolga: 'askerTolga',
  serkan: 'askerSerkan',
};

/** Oyun ekranının üstüne binen tam ekran panel; sahne akışı bozulmaz. */
function PanelKabuk({ baslik, alt, children }: { baslik: string; alt?: string; children: React.ReactNode }) {
  const g = useGame();
  const inset = useSafeAreaInsets();

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.bg }}>
      <View
        style={{
          paddingTop: inset.top + SP.md,
          paddingHorizontal: SP.lg,
          paddingBottom: SP.md,
          backgroundColor: C.ink,
          borderBottomWidth: BORDER,
          borderBottomColor: C.line,
          flexDirection: 'row',
          alignItems: 'center',
          gap: SP.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <PixelText font="command" size="h3" color={C.canvas}>
            {baslik}
          </PixelText>
          {alt && (
            <PixelText size="micro" color={C.canvasFaint}>
              {alt}
            </PixelText>
          )}
        </View>
        <PixelText font="command" size="h3" color={C.brass}>
          {`${g.para} TL`}
        </PixelText>
      </View>

      <ScrollView contentContainerStyle={{ padding: SP.lg, gap: SP.lg }} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>

      <View style={{ padding: SP.lg, paddingBottom: inset.bottom + SP.lg, backgroundColor: C.ink }}>
        <PixelButton label="Geri dön" tur="sessiz" onPress={() => g.panelAc(null)} />
      </View>
    </View>
  );
}

export function KantinPaneli() {
  const g = useGame();
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

export function DolapPaneli() {
  const g = useGame();
  const dolu = Object.entries(g.envanter).filter(([, v]) => (v?.adet ?? 0) > 0);
  const kullanilir = kullanilabilirler(g.envanter);

  return (
    <PanelKabuk baslik="DOLABIN" alt="Denetimde açık duracak">
      {g.gun >= 5 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="ANT-41 kâğıdını oku"
          onPress={() => g.panelAc('ant41')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SP.md,
            borderWidth: BORDER,
            borderColor: C.brass,
            backgroundColor: C.surface,
            padding: SP.md,
          }}
        >
          <PixelSprite sprite={sprite('defter')} scale={3} />
          <View style={{ flex: 1 }}>
            <PixelText font="bodySemi" size="body" color={C.brass}>
              ANT-41 kâğıdı
            </PixelText>
            <PixelText size="micro" color={C.canvasFaint}>
              Askerî nezaket kuralları — istediğin zaman bak
            </PixelText>
          </View>
          <PixelText font="command" size="lead" color={C.canvasDim}>
            {'>'}
          </PixelText>
        </Pressable>
      )}

      {dolu.length === 0 ? (
        <PixelText size="lead" color={C.canvasDim} center>
          Dolabın boş. Çarşıda ne aldıysan burada olurdu.
        </PixelText>
      ) : (
        <View style={{ gap: SP.sm }}>
          {dolu.map(([id, kayit]) => {
            const t = esya(id as Parameters<typeof esya>[0]);
            const kullanilabilir = kullanilir.some((k) => k.id === t.id);
            return (
              <View
                key={id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: SP.md,
                  borderWidth: BORDER,
                  borderColor: C.line,
                  backgroundColor: C.surface,
                  padding: SP.md,
                }}
              >
                <PixelSprite sprite={sprite(t.sprite)} scale={3} />
                <View style={{ flex: 1 }}>
                  <PixelText font="bodySemi" size="body" color={C.canvas}>
                    {t.ad}
                  </PixelText>
                  <PixelText size="micro" color={C.canvasFaint}>
                    {[
                      // Kademesiz üründe kalite yazmak bilgi değil gürültü.
                      t.kademeli ? KALITE_ADI[kayit!.kalite] : null,
                      kayit!.adet > 1 ? `${kayit!.adet} ${t.birim ?? 'adet'}` : null,
                      t.tuketilir && kayit!.adet === 1 ? `son bir ${t.birim ?? 'tane'}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || t.aciklama.split('.')[0]}
                  </PixelText>
                </View>
                {kullanilabilir && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${t.ad} kullan`}
                    onPress={() => g.esyaKullan(t.id)}
                    style={{
                      borderWidth: BORDER,
                      borderColor: C.ink,
                      backgroundColor: C.surfaceHi,
                      paddingVertical: SP.sm,
                      paddingHorizontal: SP.md,
                    }}
                  >
                    <PixelText font="command" size="body" color={C.brass}>
                      KULLAN
                    </PixelText>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      )}
    </PanelKabuk>
  );
}

export function RehberPaneli() {
  const g = useGame();
  const [ad, setAd] = useState('');
  const [yakinlik, setYakinlik] = useState('');
  const telefonVar = (g.envanter.kamerasizTelefon?.adet ?? 0) > 0;
  const kontor = g.envanter.kontor?.adet ?? 0;
  const izin = telefonIzni(gunGetir(g.gun)?.blocks[g.blokIndex]?.id, g.miniAktif);

  return (
    <PanelKabuk
      baslik="REHBER"
      alt={telefonVar ? `Kontör: ${kontor}` : 'Telefonun yok — ankesör kuyruğu'}
    >
      {!izin.olur && (
        <View style={{ borderWidth: BORDER, borderColor: C.rust, padding: SP.md }}>
          <PixelText font="command" size="body" color={C.rust}>
            ŞU AN ARANMAZ
          </PixelText>
          <PixelText size="small" color={C.canvasDim} line="snug">
            {izin.sebep}
          </PixelText>
        </View>
      )}
      {!telefonVar && (
        <View style={{ borderWidth: BORDER, borderColor: C.rust, padding: SP.md }}>
          <PixelText size="small" color={C.canvasDim} line="snug">
            Kamerasız telefon almadın. Aramak için ankesör kuyruğuna gireceksin:
            daha uzun, daha yorucu ve her seferinde parası var.
          </PixelText>
        </View>
      )}

      {g.rehber.length === 0 ? (
        <PixelText size="lead" color={C.canvasDim} center>
          Rehberin boş. Aşağıdan birini kaydet.
        </PixelText>
      ) : (
        <View style={{ gap: SP.sm }}>
          {g.rehber.map((k) => (
            <View
              key={k.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.md,
                borderWidth: BORDER,
                borderColor: C.line,
                backgroundColor: C.surface,
                padding: SP.md,
              }}
            >
              <View style={{ flex: 1 }}>
                <PixelText font="bodySemi" size="lead" color={C.canvas}>
                  {k.ad}
                </PixelText>
                <PixelText size="micro" color={C.canvasFaint}>
                  {k.sonArananGun === g.gun ? `${k.yakinlik} · bugün arandı` : k.yakinlik}
                </PixelText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${k.ad} kişisini ara`}
                accessibilityState={{ disabled: !izin.olur }}
                disabled={!izin.olur}
                onPress={() => g.kisiAra(k.id)}
                style={{
                  borderWidth: BORDER,
                  borderColor: C.ink,
                  backgroundColor: C.surfaceHi,
                  paddingVertical: SP.sm,
                  paddingHorizontal: SP.lg,
                  opacity: izin.olur ? 1 : 0.4,
                }}
              >
                <PixelText font="command" size="lead" color={izin.olur ? C.olive : C.canvasFaint}>
                  ARA
                </PixelText>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={{ gap: SP.sm }}>
        <View style={{ flexDirection: 'row', gap: SP.sm }}>
          <View style={{ flex: 3 }}>
            <PixelInput value={ad} onChangeText={setAd} placeholder="İsim" maxLength={16} />
          </View>
          <View style={{ flex: 2 }}>
            <PixelInput value={yakinlik} onChangeText={setYakinlik} placeholder="Yakınlık" maxLength={14} />
          </View>
        </View>
        <PixelButton
          label="Rehbere ekle"
          tur="sessiz"
          onPress={() => {
            g.kisiEkle(ad, yakinlik);
            setAd('');
            setYakinlik('');
          }}
        />
      </View>
    </PanelKabuk>
  );
}

/**
 * Cep: üstünde taşıdıkların. Telefon avluda bir direk değil, cebinde bir
 * eşya — dolap koğuşta kalır, bunlar seninle gelir.
 */
export function CepPaneli() {
  const g = useGame();
  const telefonVar = (g.envanter.kamerasizTelefon?.adet ?? 0) > 0;
  const dal = g.envanter.sigara?.adet ?? 0;
  const kontor = g.envanter.kontor?.adet ?? 0;
  // Cep her yerden açılır ama içindekiler her yerde kullanılmaz.
  const blokId = gunGetir(g.gun)?.blocks[g.blokIndex]?.id;
  const sigaraOk = sigaraIzni(blokId, g.miniAktif);
  const telefonOk = telefonIzni(blokId, g.miniAktif);

  const satirlar: {
    id: string;
    sprite: SpriteKey;
    ad: string;
    alt: string;
    kapali?: boolean;
    onPress: () => void;
  }[] = [];

  if (telefonVar) {
    satirlar.push({
      id: 'telefon',
      sprite: 'telefon',
      ad: 'Kamerasız telefon',
      alt: !telefonOk.olur
        ? telefonOk.sebep!
        : kontor > 0
          ? `${kontor} kontör · rehberi aç`
          : 'Kontörün bitti',
      kapali: !telefonOk.olur,
      onPress: () => g.panelAc('rehber'),
    });
  }

  if (g.profil.sigaraIciyor || dal > 0) {
    satirlar.push({
      id: 'sigara',
      sprite: 'sigara',
      ad: 'Sigara',
      alt: !sigaraOk.olur
        ? sigaraOk.sebep!
        : dal > 0
          ? `${dal} dal kaldı`
          : 'Paket boş — kantinden al',
      kapali: !sigaraOk.olur || dal <= 0,
      onPress: () => g.sigaraIc(),
    });
  }

  if (g.cepteIzmarit > 0) {
    satirlar.push({
      id: 'izmarit',
      sprite: 'atistirmalik',
      ad: 'Cebindeki izmaritler',
      alt: `${g.cepteIzmarit} adet · çöpe at`,
      onPress: () => g.izmaritAt(),
    });
  }

  return (
    <PanelKabuk baslik="CEBİN" alt="Üstünde taşıdıkların">
      {!sigaraOk.olur && !telefonOk.olur && satirlar.length > 0 && (
        <View style={{ borderWidth: BORDER, borderColor: C.line, padding: SP.md }}>
          <PixelText size="small" color={C.canvasDim} line="snug">
            Cebindekiler serbest zamanın işi. Görev başındayken cep kapalı kalır.
          </PixelText>
        </View>
      )}

      {satirlar.length === 0 ? (
        <PixelText size="lead" color={C.canvasDim} center line="body">
          Cebin boş. Telefon ve sigara gibi üstünde taşıdıkların burada durur.
        </PixelText>
      ) : (
        <View style={{ gap: SP.sm }}>
          {satirlar.map((r) => (
            <Pressable
              key={r.id}
              accessibilityRole="button"
              accessibilityLabel={r.ad}
              accessibilityState={{ disabled: !!r.kapali }}
              disabled={r.kapali}
              onPress={r.onPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SP.md,
                borderWidth: BORDER,
                borderColor: C.ink,
                backgroundColor: C.surface,
                padding: SP.md,
                opacity: r.kapali ? 0.45 : 1,
              }}
            >
              <PixelSprite sprite={sprite(r.sprite)} scale={3} />
              <View style={{ flex: 1 }}>
                <PixelText font="bodySemi" size="lead" color={C.canvas}>
                  {r.ad}
                </PixelText>
                <PixelText size="micro" color={C.canvasFaint}>
                  {r.alt}
                </PixelText>
              </View>
              <PixelText font="command" size="lead" color={C.canvasDim}>
                {'>'}
              </PixelText>
            </Pressable>
          ))}
        </View>
      )}
    </PanelKabuk>
  );
}

/** Sigara bitti, elinde izmarit kaldı. Kolay yol her zaman temiz yol değil. */
export function IzmaritPaneli() {
  const g = useGame();
  return (
    <PanelKabuk baslik="ELİNDE İZMARİT" alt="Sigara bitti">
      <View style={{ alignItems: 'center', paddingVertical: SP.md }}>
        <PixelSprite sprite={sprite('sigara')} scale={4} opacity={0.6} />
      </View>

      <PixelText size="lead" color={C.canvas} line="body">
        Son nefesi çektin. Elinde sönmüş bir izmarit var ve etrafta çöp kutusu
        görünmüyor.
      </PixelText>

      <View style={{ gap: SP.sm }}>
        <PixelButton tur="secim" label="Yere at, ayağınla ez" onPress={() => g.izmaritKarar(true)} />
        <PixelButton tur="secim" label="Söndür, cebine koy" onPress={() => g.izmaritKarar(false)} />
      </View>

      <PixelText size="micro" color={C.canvasFaint} center line="snug">
        Yere atmak hızlı. Ama avluda devriye var ve her zaman görmüyor değil.
      </PixelText>
    </PanelKabuk>
  );
}

/** Yakalandın: izmariti topla ve yerden özür dile. */
export function IzmaritCezasiPaneli() {
  const g = useGame();
  const [adim, setAdim] = useState(0);

  const basamaklar = [
    {
      konusan: 'ÇAVUŞ KAYA',
      metin:
        '"Dur bakalım. O attığın ne? Yerdeki şey senin mi değil mi?" Arkanda duruyor ve ne zamandır orada olduğunu bilmiyorsun.',
      buton: 'Eğil, izmariti al',
    },
    {
      konusan: 'ÇAVUŞ KAYA',
      metin:
        '"Aldın. Şimdi o yere bakacaksın. Kirlettiğin yer orası. Yerden özür dileyeceksin, yüksek sesle, bütün bölük duyacak."',
      buton: '"Özür dilerim."',
    },
    {
      konusan: 'ÇAVUŞ KAYA',
      metin: '"Duymadım. Bir daha, daha yüksek."',
      buton: '"ÖZÜR DİLERİM!"',
    },
    {
      konusan: 'ÇAVUŞ KAYA',
      metin:
        '"Tamam. Kalk. Bir daha bu avluda yerde izmarit görmeyeceğim — seninkini de başkasınınkini de."',
      buton: 'Doğrul, sıraya dön',
    },
  ];

  const su = basamaklar[adim];

  return (
    <PanelKabuk baslik="YAKALANDIN" alt={`${adim + 1} / ${basamaklar.length}`}>
      <View style={{ alignItems: 'center', gap: SP.sm }}>
        <PixelSprite sprite={sprite('cavus')} scale={4} />
      </View>

      <View style={{ borderWidth: BORDER, borderColor: C.rust, backgroundColor: C.surface, padding: SP.lg, gap: SP.sm }}>
        <PixelText font="command" size="lead" color={C.rust}>
          {su.konusan}
        </PixelText>
        <PixelText size="lead" color={C.canvas} line="body">
          {su.metin}
        </PixelText>
      </View>

      <PixelButton
        label={su.buton}
        onPress={() => (adim + 1 < basamaklar.length ? setAdim(adim + 1) : g.izmaritCezasiBitir())}
      />
    </PanelKabuk>
  );
}

const OTURAN_SPRITE: Record<ArkadasId, 'oturanEmre' | 'oturanTolga' | 'oturanSerkan'> = {
  emre: 'oturanEmre',
  tolga: 'oturanTolga',
  serkan: 'oturanSerkan',
};

/**
 * Avlunun kenarındaki oturma alanı. Ağacın altında bank var, akşamları
 * birileri orada oturuyor. Oturmak zorunda değilsin — ayakta durup
 * konuşabilir ya da hiç girmeden geçebilirsin.
 */
export function OturmaAlaniPaneli() {
  const g = useGame();
  const oturanlar = oturmaAlanindakiler(g.gun);
  const dal = g.envanter.sigara?.adet ?? 0;

  return (
    <PanelKabuk
      baslik="OTURMA ALANI"
      alt={g.bugunDinlenildi ? 'Bugün bir kere oturdun' : 'Ağacın altı, bank ve gölge'}
    >
      {/* Bankın kendisi ve orada oturanlar */}
      <View
        style={{
          height: 132,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: '#232016',
          overflow: 'hidden',
        }}
      >
        <View style={{ position: 'absolute', left: '4%', bottom: 34 }}>
          <PixelSprite sprite={sprite('agac')} scale={3} opacity={0.75} />
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 26, backgroundColor: '#3A3421' }} />
        <View style={{ position: 'absolute', left: '30%', bottom: 22 }}>
          <PixelSprite sprite={sprite('bank')} scale={3} />
        </View>
        {oturanlar.map((id, i) => (
          <View key={id} style={{ position: 'absolute', left: `${34 + i * 22}%`, bottom: 40 }}>
            <PixelSprite sprite={sprite(OTURAN_SPRITE[id])} scale={3} />
          </View>
        ))}
        {g.bugunDinlenildi && (
          <View style={{ position: 'absolute', left: '58%', bottom: 40 }}>
            <PixelSprite sprite={sprite('oturanAsker')} scale={3} />
          </View>
        )}
      </View>

      <PixelText size="small" color={C.canvasDim} line="body">
        {oturanlar.length
          ? `Bankta ${oturanlar.map((id) => arkadas(id).ad).join(' ve ')} oturuyor. Yer var.`
          : 'Bank boş. Akşam serinliği ve ağacın gölgesi.'}
      </PixelText>

      <View style={{ gap: SP.sm }}>
        <PixelButton
          tur="secim"
          label={g.bugunDinlenildi ? 'Biraz daha otur' : 'Otur, postalları çıkar'}
          onPress={g.golgedeDinlen}
        />

        {oturanlar.map((id) => (
          <PixelButton
            key={id}
            tur="secim"
            label={`${arkadas(id).ad} ile konuş`}
            onPress={() => g.arkadasaGit(id)}
          />
        ))}

        {g.profil.sigaraIciyor && (
          <PixelButton
            tur="secim"
            label={dal > 0 ? `Bir sigara yak (${dal} dal)` : 'Sigaran bitti'}
            disabled={dal <= 0}
            onPress={g.sigaraIc}
          />
        )}
      </View>

      <PixelText size="micro" color={C.canvasFaint} center line="snug">
        Oturmak günde bir kez dinlendirir. Konuşmanın sayısı yoktur.
      </PixelText>
    </PanelKabuk>
  );
}

/** Dolaptaki ANT-41 kâğıdı: ders bittikten sonra istenildiği zaman okunur. */
export function Ant41Paneli() {
  return (
    <PanelKabuk baslik="ANT-41" alt="Cebindeki kâğıt">
      <DersSahnesi tekrar />
    </PanelKabuk>
  );
}

export function SigaraIstegiPaneli() {
  const g = useGame();
  const id = g.aktifIstek;
  if (!id) return null;
  const kisi = arkadas(id);
  const dal = g.envanter.sigara?.adet ?? 0;
  const laf = kisi.sigaraLafi?.[Math.floor(Math.random() * kisi.sigaraLafi.length)] ?? '"Bir dal var mı?"';

  return (
    <PanelKabuk baslik="BİR DAL İSTİYOR" alt={`Cebinde ${dal} dal kaldı`}>
      <View style={{ gap: SP.lg }}>
        <View style={{ alignItems: 'center', gap: SP.xs }}>
          <PixelSprite sprite={sprite(ARKADAS_SPRITE[id])} scale={4} />
          <PixelText font="command" size="lead" color={C.brass} style={{ marginTop: SP.sm }}>
            {kisi.ad.toLocaleUpperCase('tr-TR')}
          </PixelText>
          <PixelText size="micro" color={C.canvasFaint}>
            {`${kisi.meslek} · yakınlık ${g.dostluk[id] ?? 0}`}
          </PixelText>
        </View>

        <View style={{ borderWidth: BORDER, borderColor: C.line, backgroundColor: C.surface, padding: SP.lg }}>
          <PixelText size="lead" color={C.canvas} line="body">
            {laf}
          </PixelText>
        </View>

        <View style={{ gap: SP.sm }}>
          <PixelButton tur="secim" label={`Bir dal ver (${dal} → ${dal - 1})`} onPress={() => g.sigaraVer(true)} />
          <PixelButton tur="secim" label="Yok, bende de az kaldı" onPress={() => g.sigaraVer(false)} />
        </View>

        <PixelText size="micro" color={C.canvasFaint} center line="snug">
          Paket 20 dal. Burada dal dağıtmak parayla değil, arkadaşlıkla ödenir.
        </PixelText>
      </View>
    </PanelKabuk>
  );
}

export function MuhabbetPaneli() {
  const g = useGame();
  const d = g.aktifDiyalog;

  return (
    <PanelKabuk baslik="KOĞUŞ MUHABBETİ">
      {!d ? (
        <PixelText size="lead" color={C.canvasDim} center line="body">
          Koğuşta herkes kendi işinde. Bugünlük muhabbet bu kadar.
        </PixelText>
      ) : (
        <View style={{ gap: SP.lg }}>
          <View style={{ alignItems: 'center', gap: SP.xs }}>
            <PixelSprite sprite={sprite(ARKADAS_SPRITE[d.kim])} scale={4} />
            <PixelText font="command" size="lead" color={C.brass} style={{ marginTop: SP.sm }}>
              {arkadas(d.kim).ad.toLocaleUpperCase('tr-TR')}
            </PixelText>
            <PixelText size="micro" color={C.canvasFaint}>
              {`${arkadas(d.kim).meslek} · yakınlık ${g.dostluk[d.kim] ?? 0}`}
            </PixelText>
          </View>

          <View style={{ borderWidth: BORDER, borderColor: C.line, backgroundColor: C.surface, padding: SP.lg }}>
            <PixelText size="lead" color={C.canvas} line="body">
              {d.metin}
            </PixelText>
          </View>

          <View style={{ gap: SP.sm }}>
            {d.secenekler.map((s, i) => (
              <PixelButton key={i} tur="secim" label={s.label} onPress={() => g.diyalogSec(i)} />
            ))}
          </View>
        </View>
      )}
    </PanelKabuk>
  );
}
