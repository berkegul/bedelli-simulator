import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Line, Rect } from "react-native-svg";
import { BORDER, C, SP } from "../theme";
import { sprite, type SpriteKey } from "../art";
import {
  arkadas,
  avludakiler,
  oturmaAlanindakiler,
} from "../content/arkadaslar";
import { useSecili } from "../store/secici";
import { PixelSprite } from "../ui/PixelSprite";
import { PixelText } from "../ui/PixelText";
import { DUVARLAR, PikselKatman, ZEMINLER, type Piksel } from "../ui/sahne";

const HARITA_YUKSEKLIK = 360;


const ARKADAS_SPRITE: Record<string, SpriteKey> = {
  emre: "askerEmre",
  tolga: "askerTolga",
  serkan: "askerSerkan",
};

type Nokta = {
  id: string;
  ad: string;
  sprite: SpriteKey;
  olcek: number;
  /** Kapsayıcıya göre yüzde konum; sol üst köşe. */
  x: number;
  y: number;
  onPress: () => void;
  rozet?: string;
  /** Tek sprite yerine birkaç parçalı çizim (ağaç, bank, oturanlar). */
  cizim?: React.ReactNode;
};

const OTURAN_SPRITE: Record<string, SpriteKey> = {
  emre: "oturanEmre",
  tolga: "oturanTolga",
  serkan: "oturanSerkan",
};

/**
 * Serbest zamanın liste hâli yerine avlunun kendisi. Nereye gideceğini
 * haritadan seçiyorsun; arkadaşlar da avluda duruyor ve üstlerine gidip
 * konuşuyorsun.
 */
/** Harita zemininin hücresi: sprite'ların 3 katlı ölçeğiyle aynı ızgara. */
const U = 3;

/**
 * Avlu zemini sahne kitinin dokularıyla: her yer sıkışmış toprak, ortada
 * beton içtima alanı ve ona inen yollar, sol altta çim, üstte tuğla duvar.
 */
function AvluZemini({ en }: { en: number }) {
  const W = Math.ceil(en / U);
  const H = Math.ceil(HARITA_YUKSEKLIK / U);
  const pikseller = useMemo<Piksel[]>(() => {
    if (!W) return [];
    const alan = (x: number, y: number, w: number, h: number) => ({
      x: Math.round(x * W),
      y: Math.round(y * H),
      w: Math.round(w * W),
      h: Math.round(h * H),
    });
    return [
      ...ZEMINLER.toprak({ x: 0, y: 0, w: W, h: H }, 7),
      ...ZEMINLER.beton(alan(0.26, 0.3, 0.5, 0.36), 8),
      ...ZEMINLER.beton(alan(0.12, 0.26, 0.04, 0.74), 9),
      ...ZEMINLER.beton(alan(0.68, 0.26, 0.04, 0.05), 10),
      ...ZEMINLER.cim(alan(0, 0.64, 0.34, 0.36), 11),
      ...DUVARLAR.tugla({ x: 0, y: 0, w: W, h: 5 }, 12),
    ];
  }, [W, H]);
  if (!W) return null;
  return <PikselKatman pikseller={pikseller} u={U} w={W} h={H} />;
}

export function KislaHaritasi() {
  const [en, setEn] = useState(0);
  const g = useSecili(
    "arkadasaGit",
    "cepteIzmarit",
    "dostluk",
    "envanter",
    "gun",
    "panelAc",
  );
  const telefonVar = (g.envanter.kamerasizTelefon?.adet ?? 0) > 0;
  const dal = g.envanter.sigara?.adet ?? 0;
  // Akşamları bir kısmı bankta oturuyor; avluda ayakta duranlar kalanlar.
  const oturanlar = oturmaAlanindakiler(g.gun);
  const ayaktakiler = avludakiler(g.gun);

  const mekanlar: Nokta[] = [
    {
      id: "kogus",
      ad: "Koğuş",
      sprite: "kisla",
      olcek: 3,
      x: 2,
      y: 4,
      onPress: () => g.panelAc("dolap"),
      rozet: "dolabın",
    },
    {
      id: "kantin",
      ad: "Kantin",
      sprite: "kantinBina",
      olcek: 3,
      x: 60,
      y: 8,
      onPress: () => g.panelAc("kantin"),
    },
    {
      id: "ankesor",
      ad: "Ankesör",
      sprite: "ankesor",
      olcek: 3,
      x: 78,
      y: 65,
      onPress: () => g.panelAc("rehber"),
      rozet: telefonVar ? "telefonun var" : "kuyruk var",
    },
    {
      id: "oturma",
      ad: "Oturma alanı",
      sprite: "agac",
      olcek: 3,
      x: 2,
      y: 67,
      onPress: () => g.panelAc("oturma"),
      cizim: (
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <PixelSprite sprite={sprite("agac")} scale={3} />
          <View style={{ marginLeft: -6 }}>
            <PixelSprite sprite={sprite("bank")} scale={2} />
            <View
              style={{
                position: "absolute",
                bottom: 6,
                left: 2,
                flexDirection: "row",
                gap: 2,
              }}
            >
              {oturanlar.slice(0, 2).map((id) => (
                <PixelSprite
                  key={id}
                  sprite={sprite(OTURAN_SPRITE[id])}
                  scale={2}
                />
              ))}
            </View>
          </View>
        </View>
      ),
      rozet: oturanlar.length
        ? `${oturanlar.map((id) => arkadas(id).ad).join(", ")} orada`
        : "bank boş",
    },
  ];

  // Arkadaşlar avluda; yerleri gün numarasına göre kayıyor ki her akşam
  // aynı tabloya bakmayasın.
  // Orta bant boş: binalar üstte, bank ve ankesör altta, etiketler çakışmasın.
  const konumlar = [
    { x: 31, y: 38 },
    { x: 47, y: 45 },
    { x: 63, y: 38 },
  ];
  const kaydir = (g.gun - 1) % konumlar.length;

  return (
    <View style={{ gap: SP.md }}>
      <View
        style={{ flexDirection: "row", alignItems: "baseline", gap: SP.sm }}
      >
        <PixelText
          font="command"
          size="h3"
          color={C.canvas}
          style={{ flex: 1 }}
        >
          AVLU
        </PixelText>
        <PixelText size="micro" color={C.canvasFaint}>
          Bir yere dokun
        </PixelText>
      </View>

      <View
        onLayout={(e) => setEn(Math.round(e.nativeEvent.layout.width))}
        style={{
          height: HARITA_YUKSEKLIK,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: "#2A2719",
          overflow: "hidden",
        }}
      >
        {/* Avlu zemini: duvar, asfalt, ortada içtima alanı, köşede çim */}
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <AvluZemini en={en} />
          {/* Bayrak direği ve sıra çizgisi dokunun üstünde */}
          <Svg width="100%" height="100%" style={{ position: "absolute" }}>
            <Line
              x1="30%"
              y1="62%"
              x2="72%"
              y2="62%"
              stroke="#8A7F5C"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            <Rect x="47%" y="7%" width={2} height="20%" fill={C.canvasDim} />
            <Rect x="47%" y="7%" width={18} height={11} fill={C.rust} />
            <Rect x="46%" y="26%" width={10} height={3} fill="#5A5236" />
          </Svg>
        </View>

        {mekanlar.map((m) => (
          <Pressable
            key={m.id}
            accessibilityRole="button"
            accessibilityLabel={m.ad}
            onPress={m.onPress}
            style={{
              position: "absolute",
              left: `${m.x}%`,
              top: `${m.y}%`,
              alignItems: "center",
            }}
          >
            {m.cizim ?? (
              <PixelSprite sprite={sprite(m.sprite)} scale={m.olcek} />
            )}
            <View
              style={{
                backgroundColor: C.ink,
                paddingHorizontal: SP.xs,
                paddingVertical: 1,
                marginTop: 2,
              }}
            >
              <PixelText font="command" size="small" color={C.brass}>
                {m.ad.toLocaleUpperCase("tr-TR")}
              </PixelText>
            </View>
            {m.rozet && (
              <PixelText size="micro" color={C.canvasFaint}>
                {m.rozet}
              </PixelText>
            )}
          </Pressable>
        ))}

        {ayaktakiler.map((id, i) => {
          const a = arkadas(id);
          const yer = konumlar[(i + kaydir) % konumlar.length];
          const yakinlik = g.dostluk[id] ?? 0;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={`${a.ad} ile konuş`}
              onPress={() => g.arkadasaGit(id)}
              style={{
                position: "absolute",
                left: `${yer.x}%`,
                top: `${yer.y}%`,
                alignItems: "center",
              }}
            >
              <PixelSprite sprite={sprite(ARKADAS_SPRITE[id])} scale={2} />
              <View
                style={{
                  backgroundColor: C.ink,
                  paddingHorizontal: SP.xs,
                  marginTop: 2,
                  borderWidth: 1,
                  borderColor: yakinlik >= 25 ? C.olive : C.line,
                }}
              >
                <PixelText
                  font="bodySemi"
                  size="micro"
                  color={yakinlik >= 25 ? C.olive : C.canvasDim}
                >
                  {a.ad}
                </PixelText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Cep: telefon ve sigara üstünde, avluda bir yerde değil */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cebine bak"
        onPress={() => g.panelAc("cep")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: SP.md,
          borderWidth: BORDER,
          borderColor: C.ink,
          backgroundColor: C.surface,
          paddingVertical: SP.sm,
          paddingHorizontal: SP.md,
        }}
      >
        <PixelSprite
          sprite={sprite(telefonVar ? "telefon" : "sigara")}
          scale={2}
        />
        <View style={{ flex: 1 }}>
          <PixelText font="command" size="body" color={C.brass}>
            CEBİN
          </PixelText>
          <PixelText size="micro" color={C.canvasFaint}>
            {[
              telefonVar ? "telefon" : null,
              dal > 0 ? `${dal} dal sigara` : null,
              g.cepteIzmarit > 0 ? `${g.cepteIzmarit} izmarit` : null,
            ]
              .filter(Boolean)
              .join(" · ") || "boş"}
          </PixelText>
        </View>
        <PixelText font="command" size="lead" color={C.canvasDim}>
          {">"}
        </PixelText>
      </Pressable>
    </View>
  );
}
