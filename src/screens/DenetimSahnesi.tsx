import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../theme';
import { denetimSatirlari, hataSayisi, sinavAdi, sinavSayisi } from '../content/denetim';
import type { Kusur } from '../engine/types';
import { Ceza } from '../minigames/Ceza';
import { Bildirim, Siddet, bildir, titret } from '../ui/haptik';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';

/** Onbaşı her askerin önünde bu kadar duruyor; satırlar bu aralıkla beliriyor. */
const ADIM_MS = 700;

/**
 * İçtima (ya da yoklama) denetimi. Onbaşı sırayı dolaşıyor; sabah yapılan
 * işler tek tek kontrol ediliyor. Hepsi tamamsa geçip gidiyor, kusur
 * varsa öne çağırıyor ve şınav orada çekiliyor.
 */
export function DenetimSahnesi({
  kusurlar,
  onBitti,
}: {
  kusurlar: Kusur[];
  onBitti: (cezaSkoru: number | null) => void;
}) {
  const satirlar = useMemo(() => denetimSatirlari(kusurlar), [kusurlar]);
  const hatalar = hataSayisi(kusurlar);
  const sinav = sinavSayisi(kusurlar);
  const [gorunen, setGorunen] = useState(0);
  const [cezada, setCezada] = useState(false);

  useEffect(() => {
    if (gorunen >= satirlar.length) return;
    const t = setTimeout(() => {
      const satir = satirlar[gorunen];
      if (satir.tamam) titret(Siddet.Light);
      else bildir(Bildirim.Warning);
      setGorunen((n) => n + 1);
    }, ADIM_MS);
    return () => clearTimeout(t);
  }, [gorunen, satirlar]);

  const bitti = gorunen >= satirlar.length;

  if (cezada) {
    return (
      <View style={{ gap: SP.md }}>
        <PixelText font="command" size="h3" color={C.rust}>
          {`${sinav} ŞINAV`}
        </PixelText>
        <Ceza hedef={sinav} onBitti={onBitti} />
      </View>
    );
  }

  return (
    <View style={{ gap: SP.md }}>
      <PixelText font="command" size="h3" color={C.canvas}>
        ONBAŞI SIRAYI DOLAŞIYOR
      </PixelText>

      {satirlar.length === 0 ? (
        <PixelText size="lead" color={C.canvasDim} line="body">
          Onbaşı önünden geçti. Bugün bakacağı bir şey yoktu.
        </PixelText>
      ) : (
        <View style={{ gap: SP.sm }}>
          {satirlar.slice(0, gorunen).map((s) => (
            <View
              key={s.kaynak}
              style={{
                flexDirection: 'row',
                gap: SP.sm,
                borderLeftWidth: 4,
                borderLeftColor: s.tamam ? C.olive : C.rust,
                paddingLeft: SP.md,
                paddingVertical: SP.xs,
              }}
            >
              <PixelText font="command" size="lead" color={s.tamam ? C.olive : C.rust}>
                {s.tamam ? '✓' : '✗'}
              </PixelText>
              <PixelText size="lead" color={s.tamam ? C.canvas : C.rust}>
                {s.metin}
              </PixelText>
            </View>
          ))}
          {!bitti && (
            <PixelText size="small" color={C.canvasFaint}>
              Onbaşı yaklaşıyor…
            </PixelText>
          )}
        </View>
      )}

      {bitti &&
        (hatalar > 0 ? (
          <>
            <View style={{ borderLeftWidth: 4, borderLeftColor: C.rust, paddingLeft: SP.lg, gap: SP.xs }}>
              <PixelText font="command" size="body" color={C.brass}>
                ONBAŞI RECEP
              </PixelText>
              <PixelText size="lead" color={C.canvas} line="body">
                {`Sen. Çık öne. ${sinavAdi(sinav)} şınav, sayıyorum.`}
              </PixelText>
            </View>
            <PixelButton label="Yere!" onPress={() => setCezada(true)} />
          </>
        ) : (
          <PixelButton label="Devam" onPress={() => onBitti(null)} />
        ))}
    </View>
  );
}
