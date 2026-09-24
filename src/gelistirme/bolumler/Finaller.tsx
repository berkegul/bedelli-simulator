import React, { useState } from 'react';
import { View } from 'react-native';
import { C, SP } from '../../theme';
import { epilog, finalKartlari } from '../../content/telefon';
import { telefonDurumuOku } from '../../store/gameStore';
import { useSecili } from '../../store/secici';
import { PixelText } from '../../ui/PixelText';
import { Baslik, Cikti, Kutu, Satir, Sayi } from '../parcalar';

/**
 * Finaller: 28. gün tek sahne değil, koşulu tutan kartların toplamı.
 * Burada sayıları oynatıp hangi kartların açıldığını anında görüyorsun —
 * bir oyuncu aynı anda hem kavuşma hem tükenme kartı alabilir.
 */
export function BolumFinaller() {
  const g = useSecili('hafiza');
  const canli = telefonDurumuOku();

  const [anne, setAnne] = useState(canli.iliski.anne);
  const [baba, setBaba] = useState(canli.iliski.baba);
  const [sevgili, setSevgili] = useState(canli.iliski.sevgili);
  const [kanka, setKanka] = useState(canli.iliski.kanka);
  const [gerilim, setGerilim] = useState(canli.gerilim.sevgili);
  const [ozlem, setOzlem] = useState(canli.ozlem);
  const [moral, setMoral] = useState(canli.moral);
  const [disiplin, setDisiplin] = useState(canli.disiplin);
  const [sevgiliVar, setSevgiliVar] = useState(canli.sevgiliVar);

  const durum = {
    ...canli,
    gun: 28,
    iliski: { ...canli.iliski, anne, baba, sevgili, kanka },
    gerilim: { ...canli.gerilim, sevgili: gerilim },
    ozlem,
    moral,
    disiplin,
    sevgiliVar,
  };

  const kartlar = finalKartlari(durum);
  const satirlar = epilog(g.hafiza, 28);

  return (
    <View style={{ gap: SP.lg }}>
      <Baslik
        ust="Bölüm 08"
        ad="Finaller"
        alt="On üç kart, sıraya göre oynuyor. Aşağıdaki sayıları değiştir, hangilerinin açıldığını izle."
      />

      <Kutu baslik="İlişkiler" renk={C.brass}>
        <Sayi ad="anne" deger={anne} onDegis={setAnne} adim={5} />
        <Sayi ad="baba" deger={baba} onDegis={setBaba} adim={5} />
        <Sayi ad="sevgili" deger={sevgili} onDegis={setSevgili} adim={5} />
        <Sayi ad="kanka" deger={kanka} onDegis={setKanka} adim={5} />
      </Kutu>

      <Kutu baslik="Sayaçlar" renk={C.rust}>
        <Sayi ad="sevgili gerilimi" deger={gerilim} onDegis={setGerilim} adim={5} />
        <Sayi ad="özlem" deger={ozlem} onDegis={setOzlem} adim={5} />
        <Sayi ad="moral" deger={moral} onDegis={setMoral} adim={5} />
        <Sayi ad="disiplin" deger={disiplin} onDegis={setDisiplin} adim={5} />
        <Satir ad="sevgili var mı" deger={sevgiliVar ? 'evet' : 'hayır'} />
        <PixelText
          size="micro"
          color={C.brass}
          onPress={() => setSevgiliVar((v) => !v)}
          style={{ paddingVertical: SP.xs }}
        >
          › değiştir
        </PixelText>
      </Kutu>

      <Cikti
        satirlar={[
          `AÇILAN KART: ${kartlar.length}`,
          ...kartlar.map((k) => `${k.sira}. ${k.baslik} — ${k.id}`),
        ]}
      />

      {kartlar.map((k) => (
        <Kutu key={k.id} baslik={k.baslik} renk={C.canvasDim}>
          <PixelText size="small" color={C.canvas} line="body">
            {k.metin}
          </PixelText>
        </Kutu>
      ))}

      <Baslik ad="Epilog" alt="Elle yazılmıyor; oyuncunun kendi cümleleri hafızadan geri okunuyor." />
      {satirlar.length ? (
        <Kutu baslik="28. gün · epilog" renk={C.brass}>
          <PixelText size="small" color={C.canvasDim} line="body">
            Yirmi sekiz çentik. Hepsi senin.
          </PixelText>
          {satirlar.map((s, i) => (
            <PixelText key={i} size="small" color={C.canvas} line="body">
              {`${s.gun}. gün: ${s.metin} (${s.gunFarki} gün önce)`}
            </PixelText>
          ))}
        </Kutu>
      ) : (
        <Kutu baslik="Epilog boş" renk={C.line}>
          <PixelText size="small" color={C.canvasDim} line="snug">
            Hafızada epilogun okuyabileceği işaret yok. Telefon bölümünden birkaç görüşme oyna
            ya da Durum bölümünden örnek hafıza yükle.
          </PixelText>
        </Kutu>
      )}
    </View>
  );
}
