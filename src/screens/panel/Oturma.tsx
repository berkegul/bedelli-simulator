import React from 'react';
import { View } from 'react-native';
import { BORDER, C, SP } from '../../theme';
import { sprite } from '../../art';
import { arkadas, oturmaAlanindakiler } from '../../content/arkadaslar';
import type { ArkadasId } from '../../engine/types';
import { useSecili } from '../../store/secici';
import { PixelButton } from '../../ui/PixelButton';
import { PixelSprite } from '../../ui/PixelSprite';
import { PixelText } from '../../ui/PixelText';
import { PanelKabuk } from './ortak';

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
  const g = useSecili(
    'arkadasaGit',
    'bugunDinlenildi',
    'envanter',
    'golgedeDinlen',
    'gun',
    'profil',
    'sigaraIc',
  );
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
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 26,
            backgroundColor: '#3A3421',
          }}
        />
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

/**
 * Telefon görüşmesi. Karşı taraf kim olduğuna göre başka konuşuyor:
 * anneyle yemek ve üşüme, sevgiliyle özlem, kankayla dalga. Ne cevap
 * verdiğin de morali değiştiriyor.
 */
