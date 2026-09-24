import React, { useEffect, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { C, SP } from "../theme";
import { gunGetir } from "../content";
import { sprite } from "../art";
import { MINI_BASLIK, MiniOyun } from "../minigames";
import { saate } from "../engine/zaman";
import { useSecili } from "../store/secici";
import { Daktilo } from "../ui/Daktilo";
import { PixelButton } from "../ui/PixelButton";
import { DiyalogKutusu } from "../ui/DiyalogKutusu";
import { DereceDamgasi } from "../ui/DereceDamgasi";
import { OgreticiKarti } from "../ui/OgreticiKarti";
import { OGRETICI } from "../minigames/ogretici";
import { useAyarlar } from "../ayarlar";
import { MekanSeridi, mekanBul } from "../ui/MekanSeridi";
import { PixelSprite } from "../ui/PixelSprite";
import { PixelText } from "../ui/PixelText";
import { OyunKabugu } from "./OyunKabugu";
import {
  Ant41Paneli,
  CepPaneli,
  GorusmePaneli,
  IzmaritCezasiPaneli,
  IzmaritPaneli,
  KantinPaneli,
  DolapPaneli,
  MuhabbetPaneli,
  OturmaAlaniPaneli,
  RehberPaneli,
  SigaraIstegiPaneli,
} from "./panel";
import { SerbestSahnesi } from "./SerbestSahnesi";
import { YemekSahnesi } from "./YemekSahnesi";
import { DenetimSahnesi } from "./DenetimSahnesi";
import { DersSahnesi } from "./DersSahnesi";
import { DolapDenetimi, DolapYerlesimi } from "./DolapYerlesimi";
import { TanitimSahnesi } from "./TanitimSahnesi";
import { YolSahnesi } from "./YolSahnesi";
import { DuraklatmaMenusu } from "./DuraklatmaMenusu";
import { useDuraklat } from "../ui/duraklat";
import { ambiyansCal, sesCal } from "../ses";

export function OyunEkrani() {
  const gorulenOgreticiler = useAyarlar((s) => s.gorulenOgreticiler);
  const ogreticiGoruldu = useAyarlar((s) => s.ogreticiGoruldu);
  const g = useSecili('bekleyenKusurlar', 'blokIndex', 'denetimBitir', 'dolapDuzeni', 'dolapKapat', 'envanter', 'gun', 'ileri', 'miniAktif', 'miniBaslat', 'miniBitir', 'nikotin', 'panel', 'para', 'profil', 'saat', 'sahneIndex', 'secimYap', 'sonuc', 'sonucuKapat', 'stats', 'yemekYe', 'yoldaVar');
  const gunData = gunGetir(g.gun);
  const blok = gunData?.blocks[g.blokIndex];
  const sahne = blok?.scenes[g.sahneIndex];

  // Ortam sesi bloğa göre: serbest zamanda avlu rüzgârı, gece yoklamasında
  // cırcır böcekleri; diğer bloklarda sessizlik. Ekrandan çıkınca susuyor.
  const blokAnahtari = blok?.id.replace(/^d\d+-/, '');
  useEffect(() => {
    ambiyansCal(blokAnahtari === 'serbest' ? 'avlu' : blokAnahtari === 'son-yoklama' ? 'gece' : null);
  }, [blokAnahtari]);
  useEffect(
    () => () => {
      ambiyansCal(null);
      useDuraklat.getState().kapat();
    },
    [],
  );
  const molaAcik = useDuraklat((s) => s.acik);
  // Uzun telefonda sahne iki kat: 300 nokta, sprite'lar tam sayı büyüklükte.
  const { height: ekranYuksekligi } = useWindowDimensions();
  const carpan = ekranYuksekligi >= 720 ? 2 : 1;
  // Sahne ekranın ~%38'i: alttaki diyalog kutusu kısa, eskiden altında
  // boşluk kalıyordu. Fazlası gökyüzüne/duvara gidiyor; zemin ve figürler yerinde.
  const sahneEk = Math.max(0, Math.round(ekranYuksekligi * 0.38) - 150 * carpan);

  const [yazildi, setYazildi] = useState(false);
  const [atla, setAtla] = useState(false);
  const sahneAnahtari = `${g.gun}-${g.blokIndex}-${g.sahneIndex}`;

  // Yalnızca sahne değişince sıfırla. Sonuç kartı da bağımlılık olsaydı
  // serbest zamanda her eylemden sonra tanıtım metni baştan yazılıyor,
  // menü geri gelene kadar oyuncu bekliyordu.
  const [giris] = useState(() => new Animated.Value(0));
  useEffect(() => {
    setYazildi(false);
    setAtla(false);
    // Sahne aniden yerine geçmiyor, aşağıdan süzülüyor: ekranın değiştiği
    // fark ediliyor ve kesik kesik gelen içerik akıcı duruyor.
    giris.setValue(0);
    Animated.timing(giris, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [sahneAnahtari, giris]);

  if (!gunData || !blok || !sahne) return null;

  const zorluk = Math.min(1, (g.gun - 1) / 8);
  const metinBitti = yazildi || atla;
  // Sonuç kartı gösterilirken sahne sprite'ı gizlenir; ikisi aynı anda kalabalık.
  const spriteKey =
    g.sonuc ||
    sahne.kind === "yol" ||
    sahne.kind === "tanitim" ||
    sahne.kind === "ders"
      ? undefined
      : sahne.sprite;
  const mekanVar = !!mekanBul(blok.id);

  return (
    <>
      <OyunKabugu
        gun={g.gun}
        gunBasligi={gunData.title}
        saat={g.saat}
        blokBaslangic={blok.from}
        blokBitis={blok.to}
        blokAd={blok.title.toLocaleUpperCase("tr-TR")}
        stats={g.stats}
        para={g.para}
        delta={g.sonuc?.delta}
        nikotin={g.profil.sigaraIciyor ? g.nikotin : undefined}
        cepKapali={g.miniAktif}
      >
        {g.miniAktif && sahne.kind === "mini" ? (
          // Kenar boşluğu yok: oyunlar kendi sahnelerini kenardan kenara çiziyor,
          // metin ve düğme boşluğunu kendileri veriyor.
          <View style={{ flex: 1, justifyContent: "center" }}>
            {/* İlk açılışta önce kart: süre oyuncu okurken işlemesin */}
            {!gorulenOgreticiler.includes(sahne.game) ? (
              <View style={{ padding: SP.lg }}>
                <OgreticiKarti
                  baslik={MINI_BASLIK[sahne.game]}
                  {...OGRETICI[sahne.game]}
                  onTamam={() => ogreticiGoruldu(sahne.game)}
                />
              </View>
            ) : (
              <MiniOyun
                id={sahne.game}
                zorluk={zorluk}
                onBitti={(skor) => {
                  sesCal(skor >= 0.6 ? 'basari' : 'basarisiz');
                  g.miniBitir(skor);
                }}
              />
            )}
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {/*
              Sahne kenardan kenara ve animasyonun dışında: aynı mekânda
              sahneler değişirken arka plan yerinde kalıyor, yalnızca
              diyalog değişiyor.
            */}
            {sahne.kind !== "yol" && sahne.kind !== "tanitim" && mekanVar ? (
              <MekanSeridi
                blokId={blok.id}
                saat={saate(g.saat)}
                carpan={carpan}
                ekYukseklik={sahne.kind === "anlati" || sahne.kind === "mini" ? sahneEk : 0}
                cercevesiz
              />
            ) : (
              spriteKey && (
                <View
                  style={{
                    height: 150 * carpan,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#232016",
                    borderBottomWidth: 2,
                    borderColor: C.ink,
                  }}
                >
                  <PixelSprite
                    sprite={sprite(spriteKey)}
                    scale={(spriteKey === "kisla" || spriteKey === "tufek" ? 7 : 6) + (carpan > 1 ? 2 : 0)}
                  />
                </View>
              )
            )}
            {/*
              Dokununca daktilo metni tamamlanıyor. Bu Pressable eskiden
              ScrollView'ı sarıyordu; dokunma sorumlusunu kaptığı için ekranın
              çoğu yerinden kaydırma çalışmıyordu. Artık listenin içinde.
            */}
            <Pressable
              style={{ flexGrow: 1, padding: SP.lg }}
              onPress={() => setAtla(true)}
              accessibilityRole="none"
            >
              <Animated.View
                style={{
                  flexGrow: 1,
                  gap: SP.lg,
                  opacity: giris,
                  transform: [
                    {
                      translateY: giris.interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, 0],
                      }),
                    },
                  ],
                }}
              >
                {g.sonuc ? (
                  <SonucKarti metin={g.sonuc.metin} derece={g.sonuc.derece} />
                ) : sahne.kind === "yol" ? (
                  <YolSahnesi
                    key={sahneAnahtari}
                    hedef={sahne.hedef}
                    adim={sahne.adim}
                    mekan={sahne.mekan}
                    manzara={sahne.manzara}
                    bakis={sahne.bakis}
                    sivil={sahne.sivil}
                    saat={saate(g.saat)}
                    gun={g.gun}
                    blokIndex={g.blokIndex}
                    onVardi={g.yoldaVar}
                  />
                ) : sahne.kind === "anlati" ? (
                  <DiyalogKutusu konusan={sahne.speaker}>
                    <Daktilo
                      key={sahneAnahtari}
                      text={sahne.text}
                      atla={atla}
                      onBitti={() => setYazildi(true)}
                      size="lead"
                      line="body"
                      color={sahne.speaker ? C.canvas : C.canvasDim}
                    />
                  </DiyalogKutusu>
                ) : sahne.kind === "mini" ? (
                  <DiyalogKutusu baslik={MINI_BASLIK[sahne.game]}>
                    <Daktilo
                      key={sahneAnahtari}
                      text={sahne.brief}
                      atla={atla}
                      onBitti={() => setYazildi(true)}
                      size="lead"
                      color={C.canvasDim}
                    />
                  </DiyalogKutusu>
                ) : (
                  <DiyalogKutusu>
                    <Daktilo
                      key={sahneAnahtari}
                      text={sahne.brief}
                      atla={atla}
                      onBitti={() => setYazildi(true)}
                      size="lead"
                      color={C.canvasDim}
                    />
                  </DiyalogKutusu>
                )}

                {/* Etkileşimli sahneler metin bittikten sonra açılır */}
                {!g.sonuc && metinBitti && sahne.kind === "yemek" && (
                  <YemekSahnesi
                    gun={g.gun}
                    blokIndex={g.blokIndex}
                    ogun={sahne.ogun}
                    tokluk={g.stats.tokluk}
                    onYe={(secilen) => {
                      if (secilen.length) sesCal('tepsi');
                      g.yemekYe(secilen);
                    }}
                  />
                )}
                {!g.sonuc && metinBitti && sahne.kind === "serbest" && (
                  <SerbestSahnesi />
                )}
                {!g.sonuc && metinBitti && sahne.kind === "tanitim" && (
                  <TanitimSahnesi onBitti={g.ileri} />
                )}
                {!g.sonuc && metinBitti && sahne.kind === "ders" && (
                  <DersSahnesi onBitti={g.ileri} />
                )}
                {!g.sonuc && metinBitti && sahne.kind === "dolap" && (
                  <DolapYerlesimi envanter={g.envanter} onBitti={g.dolapKapat} />
                )}
                {!g.sonuc && metinBitti && sahne.kind === "denetim" && (
                  <DenetimSahnesi kusurlar={g.bekleyenKusurlar} onBitti={g.denetimBitir} />
                )}
                {!g.sonuc && metinBitti && sahne.kind === "dolapDenetimi" && (
                  <DolapDenetimi duzen={g.dolapDuzeni} onBitti={g.secimYap} />
                )}

                <View style={{ flex: 1 }} />

                <View style={{ gap: SP.sm }}>
                  {g.sonuc ? (
                    <PixelButton label="Devam" onPress={g.sonucuKapat} />
                  ) : sahne.kind === "mini" ? (
                    <PixelButton
                      label="Başla"
                      onPress={g.miniBaslat}
                      disabled={!metinBitti}
                    />
                  ) : sahne.kind === "anlati" && sahne.choices?.length ? (
                    metinBitti &&
                    sahne.choices
                      .filter(
                        (c) =>
                          (!c.gerekliEsya ||
                            (g.envanter[c.gerekliEsya]?.adet ?? 0) > 0) &&
                          (!c.sadeceSigaraIcen || g.profil.sigaraIciyor),
                      )
                      .map((c) => (
                        <PixelButton
                          key={c.id}
                          tur="secim"
                          label={c.label}
                          onPress={() => g.secimYap(c)}
                        />
                      ))
                  ) : sahne.kind === "anlati" ? (
                    <PixelButton
                      label="Devam"
                      onPress={g.ileri}
                      disabled={!metinBitti}
                    />
                  ) : null}
                </View>
              </Animated.View>
            </Pressable>
          </ScrollView>
        )}
      </OyunKabugu>
      {molaAcik && !g.miniAktif && <DuraklatmaMenusu />}

      {g.panel === "kantin" && <KantinPaneli />}
      {g.panel === "dolap" && <DolapPaneli />}
      {g.panel === "rehber" && <RehberPaneli />}
      {g.panel === "muhabbet" && <MuhabbetPaneli />}
      {g.panel === "sigaraIstegi" && <SigaraIstegiPaneli />}
      {g.panel === "ant41" && <Ant41Paneli />}
      {g.panel === "oturma" && <OturmaAlaniPaneli />}
      {g.panel === "cep" && <CepPaneli />}
      {g.panel === "izmarit" && <IzmaritPaneli />}
      {g.panel === "izmaritCezasi" && <IzmaritCezasiPaneli />}
      {g.panel === "gorusme" && <GorusmePaneli />}
    </>
  );
}

/** Sonuç kartı kayarak giriyor: ekranın değiştiğini fark etmek kolaylaşıyor. */
function SonucKarti({ metin, derece }: { metin: string; derece?: number }) {
  const [giris] = useState(() => new Animated.Value(0));

  useEffect(() => {
    giris.setValue(0);
    Animated.timing(giris, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [metin, giris]);

  return (
    <Animated.View
      style={{
        borderLeftWidth: 4,
        borderLeftColor: C.brass,
        paddingLeft: SP.lg,
        gap: SP.sm,
        opacity: giris,
        transform: [
          {
            translateX: giris.interpolate({
              inputRange: [0, 1],
              outputRange: [-14, 0],
            }),
          },
        ],
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <PixelText font="command" size="body" color={C.brass}>
          SONUÇ
        </PixelText>
        {derece !== undefined && <DereceDamgasi skor={derece} />}
      </View>
      <PixelText size="lead" color={C.canvas} line="body">
        {metin}
      </PixelText>
    </Animated.View>
  );
}
