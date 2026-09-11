import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { MINI_BASLIK, MiniOyun } from '../../minigames';
import { GUNLER } from '../../content';
import type { MiniGameId, Scene } from '../../engine/types';
import { applyEffect } from '../../engine/stats';
import { useGame } from '../../store/gameStore';
import { PixelButton } from '../../ui/PixelButton';
import { PixelText } from '../../ui/PixelText';
import { Baslik, Cikti, Kart, Kutu, Satir, Sayi } from '../parcalar';

const MINILER: MiniGameId[] = [
  'yatak',
  'ictima',
  'yurumek',
  'silah',
  'nobet',
  'izmarit',
  'ceza',
];

const NE_YAPAR: Record<MiniGameId, string> = {
  yatak: 'Battaniyenin kenarlarını hizala; onbaşı geçerken bozulmasın.',
  ictima: 'Rahat / hazır ol komutlarını doğru anda uygula.',
  yurumek: 'Sol ayak temposunu tutturarak yürü.',
  silah: 'Tüfeği sırayla sök, parçaları doğru yerleştir.',
  nobet: 'Gece nöbetinde uyanık kal, hareketi yakala.',
  izmarit: 'Mıntıkadaki izmaritleri süre dolmadan topla.',
  ceza: 'Cezayı çek; ne kadar dayanırsan o kadar.',
};

/** Oyundaki bu mini oyuna bağlı gerçek sahneleri bulur — ödül eğrisi orada. */
function sahneleriBul(id: MiniGameId) {
  const bulunan: { gun: number; blok: string; sahne: Extract<Scene, { kind: 'mini' }> }[] = [];
  for (const g of GUNLER) {
    for (const b of g.blocks) {
      for (const s of b.scenes) {
        if (s.kind === 'mini' && s.game === id) {
          bulunan.push({ gun: g.day, blok: b.id, sahne: s });
        }
      }
    }
  }
  return bulunan;
}

/**
 * Mini oyunlar: yedi görev. Her biri 0–1 arası bir skor döndürüyor,
 * içerik onu etkiye çeviriyor. Burada oyunu oynayıp skorun hangi ödüle ve
 * hangi sonuç cümlesine dönüştüğünü aynı ekranda görüyorsun.
 */
export function BolumMiniOyunlar() {
  const g = useGame();
  const [secili, setSecili] = useState<MiniGameId | null>(null);
  const [zorluk, setZorluk] = useState(50);
  const [oynaniyor, setOynaniyor] = useState(false);
  const [skor, setSkor] = useState<number | null>(null);
  const [tur, setTur] = useState(0);

  if (!secili) {
    return (
      <View style={{ gap: SP.lg }}>
        <Baslik
          ust="Bölüm 02"
          ad="Mini oyunlar"
          alt="Yedi görev. Hepsi ortak arayüzü paylaşıyor: zorluk girer, 0–1 arası skor çıkar. Ödüle çevirme işi içerik dosyalarında."
        />
        <View style={{ gap: SP.sm }}>
          {MINILER.map((id) => {
            const sahneler = sahneleriBul(id);
            return (
              <Kart
                key={id}
                ad={MINI_BASLIK[id]}
                alt={`${NE_YAPAR[id]}`}
                saglik={sahneler.length ? `${sahneler.length} sahne` : 'bağlı sahne yok'}
                renk={C.olive}
                onPress={() => {
                  setSecili(id);
                  setSkor(null);
                  setOynaniyor(false);
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  const sahneler = sahneleriBul(secili);
  const ornek = sahneler[0]?.sahne;
  const odul = skor !== null && ornek ? ornek.reward(skor) : null;
  const hukum = skor !== null && ornek ? ornek.verdict(skor) : null;
  const sonrasi = odul ? applyEffect(g.stats, g.para, odul) : null;

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik ust={secili} ad={MINI_BASLIK[secili]} alt={NE_YAPAR[secili]} />

      {oynaniyor ? (
        <View
          style={{
            borderWidth: 2,
            borderColor: C.olive,
            backgroundColor: C.bg,
            padding: SP.lg,
            minHeight: 320,
            justifyContent: 'center',
          }}
        >
          <MiniOyun
            key={`${secili}-${tur}`}
            id={secili}
            zorluk={zorluk / 100}
            onBitti={(s) => {
              setSkor(s);
              setOynaniyor(false);
            }}
          />
        </View>
      ) : (
        <>
          <Kutu baslik="Ayar" renk={C.olive}>
            <Sayi ad="zorluk (%)" deger={zorluk} onDegis={setZorluk} adim={10} />
            <PixelText size="micro" color={C.canvasFaint} line="snug">
              Oyunda zorluk gün numarasından türüyor: min(1, (gün − 1) / 8). Yani 9. günden
              sonra hep tavan.
            </PixelText>
          </Kutu>

          <PixelButton
            label={skor === null ? 'Oyunu başlat' : 'Tekrar oyna'}
            onPress={() => {
              setTur((t) => t + 1);
              setSkor(null);
              setOynaniyor(true);
            }}
          />
        </>
      )}

      {skor !== null && (
        <Cikti
          satirlar={[
            `SKOR ${skor.toFixed(3)}`,
            hukum ? `Hüküm: ${hukum}` : 'Bu mini oyuna bağlı yazılı sahne yok, hüküm cümlesi türetilemedi.',
            odul
              ? `Ödül: ${Object.entries(odul)
                  .map(([k, v]) => `${k} ${(v as number) > 0 ? '+' : ''}${v}`)
                  .join(' · ')}`
              : '',
            sonrasi
              ? `Gerçekleşen: ${Object.entries(sonrasi.delta)
                  .map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`)
                  .join(' · ') || 'hiçbir şey değişmedi (direnç eğrisi)'}`
              : '',
          ].filter(Boolean)}
        />
      )}

      {sahneler.length > 0 && (
        <Kutu baslik={`Oyunda nerede geçiyor (${sahneler.length})`} renk={C.line}>
          {sahneler.map((s, i) => (
            <View key={i} style={{ gap: 2, paddingVertical: SP.xs }}>
              <Satir ad={`gün ${s.gun}`} deger={s.blok} renk={C.canvasDim} />
              <PixelText size="micro" color={C.canvasFaint} line="snug">
                {s.sahne.brief}
              </PixelText>
              <View style={{ flexDirection: 'row', gap: SP.md, flexWrap: 'wrap' }}>
                {[0, 0.5, 1].map((p) => (
                  <PixelText key={p} size="micro" color={C.olive}>
                    {`${p}: ${Object.entries(s.sahne.reward(p))
                      .map(([k, v]) => `${k}${(v as number) > 0 ? '+' : ''}${v}`)
                      .join(' ')}`}
                  </PixelText>
                ))}
              </View>
            </View>
          ))}
        </Kutu>
      )}

      <View style={{ gap: SP.sm }}>
        {sahneler[0] && (
          <PixelButton
            label="Oyunda bu sahneye atla"
            tur="sessiz"
            onPress={() => {
              const hedef = sahneler[0];
              const gun = GUNLER.find((d) => d.day === hedef.gun)!;
              const bi = gun.blocks.findIndex((b) => b.id === hedef.blok);
              const si = gun.blocks[bi].scenes.findIndex((s) => s.id === hedef.sahne.id);
              g.gelistirmeAtla({
                ekran: 'oyun',
                gun: hedef.gun,
                blokIndex: bi,
                sahneIndex: Math.max(0, si),
              });
            }}
          />
        )}
        <PixelButton label="‹ Mini oyun listesi" tur="sessiz" onPress={() => setSecili(null)} />
      </View>
    </View>
  );
}
