import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Haptik geri bildirim tüm platformlarda yok — web'de çağrı reddedilen bir
 * promise döndürüyor. Oyun dokunuş hissi olmadan da oynanmalı, o yüzden
 * sessizce yutuyoruz.
 */
const destekli = Platform.OS === 'ios' || Platform.OS === 'android';

/** Ayarlardan kapatılabiliyor (ayarlar/index.ts). */
let acik = true;
export const titresimAyarla = (v: boolean) => {
  acik = v;
};

export const titret = (
  siddet: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
) => {
  if (destekli && acik) void Haptics.impactAsync(siddet).catch(() => {});
};

export const bildir = (tip: Haptics.NotificationFeedbackType) => {
  if (destekli && acik) void Haptics.notificationAsync(tip).catch(() => {});
};

export const secim = () => {
  if (destekli && acik) void Haptics.selectionAsync().catch(() => {});
};

export const Siddet = Haptics.ImpactFeedbackStyle;
export const Bildirim = Haptics.NotificationFeedbackType;
