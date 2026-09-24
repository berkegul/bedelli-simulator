import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER, C, SP } from '../theme';
import { useAyarlar, type Ayarlar, type MetinHizi } from '../ayarlar';
import { useGame } from '../store/gameStore';
import { OnayliButon } from '../ui/OnayliButon';
import { PixelButton } from '../ui/PixelButton';
import { PixelText } from '../ui/PixelText';
import { sesCal } from '../ses';
import { bulutuSil } from '../engine/bulut';

const HIZLAR: { id: MetinHizi; ad: string }[] = [
  { id: 'yavas', ad: 'Yavaş' },
  { id: 'normal', ad: 'Normal' },
  { id: 'hizli', ad: 'Hızlı' },
  { id: 'aninda', ad: 'Anında' },
];

type AcKapa = 'efekt' | 'ambiyans' | 'titresim' | 'hareketAzalt';

function Satir({
  baslik,
  aciklama,
  children,
}: {
  baslik: string;
  aciklama?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        borderBottomWidth: BORDER,
        borderColor: C.line,
        paddingVertical: SP.md,
        gap: SP.sm,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SP.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          <PixelText font="bodyMed" size="body" color={C.canvas}>
            {baslik}
          </PixelText>
          {aciklama && (
            <PixelText size="small" color={C.canvasDim}>
              {aciklama}
            </PixelText>
          )}
        </View>
        {children}
      </View>
    </View>
  );
}

/** Açık/kapalı düğmesi; pixel dilinde bir anahtar. */
function Anahtar({ acik, onDegis, etiket }: { acik: boolean; onDegis: () => void; etiket: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={etiket}
      accessibilityState={{ checked: acik }}
      onPress={onDegis}
      style={{
        borderWidth: BORDER,
        borderColor: C.ink,
        backgroundColor: acik ? '#4A4327' : C.surface,
        paddingVertical: SP.sm,
        paddingHorizontal: SP.md,
        minWidth: 84,
        alignItems: 'center',
      }}
    >
      <PixelText font="command" size="lead" color={acik ? C.brass : C.canvasFaint}>
        {acik ? 'AÇIK' : 'KAPALI'}
      </PixelText>
    </Pressable>
  );
}

/**
 * Ayarlar her ekranın üstüne açılan bir katman: menüden de oyunun içinden
 * de açılıyor, kapanınca oyuncu kaldığı yerde. Oyun kaydına dokunmuyor
 * (kaydı sil hariç).
 */
export function AyarlarEkrani() {
  const a = useAyarlar();
  const inset = useSafeAreaInsets();
  const kayitVar = useGame((s) => s.kayitVar || s.bitenGunler.length > 0 || !!s.profil.ad);

  const cevir = (k: AcKapa) => {
    a.degistir({ [k]: !a[k] } as Partial<Ayarlar>);
    // Efekt sesi açıldıysa duyulsun ki neyin açıldığı anlaşılsın.
    if (k === 'efekt' && !a.efekt) sesCal('tik');
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: C.bg,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: inset.top + SP.xl,
          paddingBottom: inset.bottom + SP.xl,
          paddingHorizontal: SP.xl,
          gap: SP.lg,
        }}
      >
        <PixelText font="command" size="h2" color={C.brass} tracking={2}>
          AYARLAR
        </PixelText>

        <View>
          <Satir baslik="Ses efektleri" aciklama="Düdük, adım, tepsi, telefon">
            <Anahtar etiket="Ses efektleri" acik={a.efekt} onDegis={() => cevir('efekt')} />
          </Satir>
          <Satir baslik="Ortam sesi" aciklama="Avluda rüzgâr, gece cırcır böcekleri">
            <Anahtar etiket="Ortam sesi" acik={a.ambiyans} onDegis={() => cevir('ambiyans')} />
          </Satir>
          <Satir baslik="Titreşim">
            <Anahtar etiket="Titreşim" acik={a.titresim} onDegis={() => cevir('titresim')} />
          </Satir>
          <Satir baslik="Hareketi azalt" aciklama="Gökyüzü geçişi, yürüyüş, nişangâh salınımı sade">
            <Anahtar etiket="Hareketi azalt" acik={a.hareketAzalt} onDegis={() => cevir('hareketAzalt')} />
          </Satir>
          <Satir baslik="Metin hızı" aciklama="Anlatının harf harf yazılma hızı">
            <View />
          </Satir>
          <View style={{ flexDirection: 'row', gap: SP.sm, paddingVertical: SP.sm, flexWrap: 'wrap' }}>
            {HIZLAR.map((h) => (
              <Pressable
                key={h.id}
                accessibilityRole="radio"
                accessibilityLabel={`Metin hızı: ${h.ad}`}
                accessibilityState={{ selected: a.metinHizi === h.id }}
                onPress={() => a.degistir({ metinHizi: h.id })}
                style={{
                  flexGrow: 1,
                  borderWidth: BORDER,
                  borderColor: a.metinHizi === h.id ? C.brass : C.ink,
                  backgroundColor: a.metinHizi === h.id ? '#4A4327' : C.surface,
                  paddingVertical: SP.sm,
                  alignItems: 'center',
                }}
              >
                <PixelText font="bodyMed" size="body" color={a.metinHizi === h.id ? C.brass : C.canvasDim}>
                  {h.ad}
                </PixelText>
              </Pressable>
            ))}
          </View>
          <Satir
            baslik="Buluta yedek"
            aciklama="Kayıt dosyan (künyedeki ad ve rehberdeki adlar dahil) Firebase'de saklanır; telefon değişince geri gelir. Kapatınca buluttaki kopya silinir."
          >
            <Anahtar
              etiket="Buluta yedek"
              acik={a.bulutIzni === true}
              onDegis={() => {
                if (a.bulutIzni === true) {
                  // Önce sil, sonra kapat: izin kapanınca bulut artık açılmıyor.
                  void bulutuSil().finally(() => a.degistir({ bulutIzni: false }));
                } else {
                  a.degistir({ bulutIzni: true });
                }
              }}
            />
          </Satir>
          <Satir
            baslik="Kullanım verisi"
            aciklama="Hangi günde bırakıldığı gibi anonim oyun olayları. Kişisel bilgi yok. Kapalıyken hiçbir şey gönderilmez."
          >
            <Anahtar
              etiket="Kullanım verisi"
              acik={a.olcumIzni === true}
              onDegis={() => a.degistir({ olcumIzni: a.olcumIzni !== true })}
            />
          </Satir>
          <Satir
            baslik="Nasıl oynanır kartları"
            aciklama={
              a.gorulenOgreticiler.length
                ? `${a.gorulenOgreticiler.length} oyunun kartı görüldü. Sıfırlarsan her oyunda bir kez daha çıkar.`
                : 'Her mini oyunun ilk açılışında bir kez çıkar.'
            }
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Nasıl oynanır kartlarını sıfırla"
              disabled={!a.gorulenOgreticiler.length}
              onPress={() => a.degistir({ gorulenOgreticiler: [] })}
              style={{
                borderWidth: BORDER,
                borderColor: C.ink,
                backgroundColor: C.surface,
                paddingHorizontal: SP.md,
                paddingVertical: SP.xs,
                opacity: a.gorulenOgreticiler.length ? 1 : 0.4,
              }}
            >
              <PixelText font="command" size="body" color={C.canvasDim}>
                SIFIRLA
              </PixelText>
            </Pressable>
          </Satir>
        </View>

        {kayitVar && (
          <View style={{ gap: SP.xs }}>
            <OnayliButon
              label="Kaydı sil"
              onayLabel="Bütün ilerleme silinecek. Emin misin?"
              onPress={() => {
                void useGame.getState().sifirla();
                a.kapat();
              }}
            />
            <PixelText size="micro" color={C.canvasFaint}>
              Ayarlar silinmez, yalnızca oyun kaydı.
            </PixelText>
          </View>
        )}

        <PixelButton label="Kapat" onPress={a.kapat} />
      </ScrollView>
    </View>
  );
}
