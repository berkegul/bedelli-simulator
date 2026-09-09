import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Haptik geri bildirim tüm platformlarda yok — web'de çağrı reddedilen bir
 * promise döndürüyor. Oyun dokunuş hissi olmadan da oynanmalı, o yüzden
 * sessizce yutuyoruz.
 */
const destekli = Platform.OS === 'ios' || Platform.OS === 'android';

export const titret = (
  siddet: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
) => {
  if (destekli) void Haptics.impactAsync(siddet).catch(() => {});
};

export const bildir = (tip: Haptics.NotificationFeedbackType) => {
  if (destekli) void Haptics.notificationAsync(tip).catch(() => {});
};

export const secim = () => {
  if (destekli) void Haptics.selectionAsync().catch(() => {});
};

export const Siddet = Haptics.ImpactFeedbackStyle;
export const Bildirim = Haptics.NotificationFeedbackType;
