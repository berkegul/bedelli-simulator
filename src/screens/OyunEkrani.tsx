import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, View } from "react-native";
import { C, SP } from "../theme";
import { gunGetir } from "../content";
import { sprite } from "../art";
import { MINI_BASLIK, MiniOyun } from "../minigames";
import { saate } from "../engine/zaman";
import { useGame } from "../store/gameStore";
import { Daktilo } from "../ui/Daktilo";
import { PixelButton } from "../ui/PixelButton";
import { PixelPanel } from "../ui/PixelPanel";
import { MekanSeridi, mekanBul } from "../ui/MekanSeridi";
import { PixelSprite } from "../ui/PixelSprite";
import { PixelText } from "../ui/PixelText";
import { OyunKabugu } from "./OyunKabugu";
import {
  Ant41Paneli,
  CepPaneli,
  IzmaritCezasiPaneli,
  IzmaritPaneli,
  KantinPaneli,
  DolapPaneli,
  MuhabbetPaneli,
  OturmaAlaniPaneli,
  RehberPaneli,
  SigaraIstegiPaneli,
} from "./Paneller";
import { SerbestSahnesi } from "./SerbestSahnesi";
import { YemekSahnesi } from "./YemekSahnesi";
import { DersSahnesi } from "./DersSahnesi";
import { TanitimSahnesi } from "./TanitimSahnesi";
import { YolSahnesi } from "./YolSahnesi";

export function OyunEkrani() {
  const g = useGame();
  const gunData = gunGetir(g.gun);
  const blok = gunData?.blocks[g.blokIndex];
  const sahne = blok?.scenes[g.sahneIndex];

  const [yazildi, setYazildi] = useState(false);
  const [atla, setAtla] = useState(false);
  const sahneAnahtari = `${g.gun}-${g.blokIndex}-${g.sahneIndex}`;

  // Yalnızca sahne değişince sıfırla. Sonuç kartı da bağımlılık olsaydı
  // serbest zamanda her eylemden sonra tanıtım metni baştan yazılıyor,
  // menü geri gelene kadar oyuncu bekliyordu.
  const giris = useRef(new Animated.Value(0)).current;
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
          <View style={{ flex: 1, padding: SP.lg, justifyContent: "center" }}>
            <MiniOyun id={sahne.game} zorluk={zorluk} onBitti={g.miniBitir} />
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
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
                {/* Nerede olduğunu gösteren mekan kesiti; yoksa sahnenin kendi görseli */}
                {sahne.kind !== "yol" &&
                sahne.kind !== "tanitim" &&
                mekanVar ? (
                  <MekanSeridi blokId={blok.id} saat={saate(g.saat)} />
                ) : (
                  spriteKey && (
                    <View
                      style={{ alignItems: "center", paddingVertical: SP.md }}
                    >
                      <PixelSprite
                        sprite={sprite(spriteKey)}
                        scale={
                          spriteKey === "kisla" || spriteKey === "tufek" ? 7 : 6
                        }
                      />
                    </View>
                  )
                )}

                {g.sonuc ? (
                  <SonucKarti metin={g.sonuc.metin} />
                ) : sahne.kind === "yol" ? (
                  <YolSahnesi
                    key={sahneAnahtari}
                    hedef={sahne.hedef}
                    adim={sahne.adim}
                    mekan={sahne.mekan}
                    manzara={sahne.manzara}
                    saat={saate(g.saat)}
                    gun={g.gun}
                    blokIndex={g.blokIndex}
                    onVardi={g.yoldaVar}
                  />
                ) : sahne.kind === "anlati" ? (
                  <PixelPanel style={{ padding: SP.lg }}>
                    {sahne.speaker && (
                      <PixelText
                        font="command"
                        size="lead"
                        color={C.brass}
                        style={{ marginBottom: SP.sm }}
                      >
                        {sahne.speaker.toLocaleUpperCase("tr-TR")}
                      </PixelText>
                    )}
                    <Daktilo
                      key={sahneAnahtari}
                      text={sahne.text}
                      atla={atla}
                      onBitti={() => setYazildi(true)}
                      size="lead"
                      line="body"
                      color={sahne.speaker ? C.canvas : C.canvasDim}
                    />
                  </PixelPanel>
                ) : sahne.kind === "mini" ? (
                  <PixelPanel style={{ padding: SP.lg }}>
                    <PixelText
                      font="command"
                      size="h3"
                      color={C.brass}
                      style={{ marginBottom: SP.sm }}
                    >
                      {MINI_BASLIK[sahne.game]}
                    </PixelText>
                    <Daktilo
                      key={sahneAnahtari}
                      text={sahne.brief}
                      atla={atla}
                      onBitti={() => setYazildi(true)}
                      size="lead"
                      color={C.canvasDim}
                    />
                  </PixelPanel>
                ) : (
                  <PixelPanel style={{ padding: SP.lg }}>
                    <Daktilo
                      key={sahneAnahtari}
                      text={sahne.brief}
                      atla={atla}
                      onBitti={() => setYazildi(true)}
                      size="lead"
                      color={C.canvasDim}
                    />
                  </PixelPanel>
                )}

                {/* Etkileşimli sahneler metin bittikten sonra açılır */}
                {!g.sonuc && metinBitti && sahne.kind === "yemek" && (
                  <YemekSahnesi
                    gun={g.gun}
                    blokIndex={g.blokIndex}
                    ogun={sahne.ogun}
                    tokluk={g.stats.tokluk}
                    onYe={g.yemekYe}
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
    </>
  );
}

/** Sonuç kartı kayarak giriyor: ekranın değiştiğini fark etmek kolaylaşıyor. */
function SonucKarti({ metin }: { metin: string }) {
  const giris = useRef(new Animated.Value(0)).current;

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
      <PixelText font="command" size="body" color={C.brass}>
        SONUÇ
      </PixelText>
      <PixelText size="lead" color={C.canvas} line="body">
        {metin}
      </PixelText>
    </Animated.View>
  );
}
