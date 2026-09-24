# Mağaza veri beyanları (M5)

Oyunun davranışı: `src/engine/bulut.ts`, onay `src/screens/OnayEkrani.tsx`.
Gizlilik politikası taslağı: `gizlilik-politikasi.md`.

## Google Play · Data safety

- Veri toplanıyor mu: **Evet** (isteğe bağlı, ilk açılışta onayla).
- Paylaşılıyor mu (üçüncü tarafa aktarım): **Hayır** (Firebase ve Sentry
  hizmet sağlayıcı; Play tanımında paylaşım sayılmıyor).
- Aktarımda şifreli: **Evet** (HTTPS).
- Silme talebi: **Evet** (ayarlar → Buluta yedek kapat / Kaydı sil).

| Play kategorisi | Tür | Zorunlu mu | Amaç |
|---|---|---|---|
| App activity → App interactions | Oyun olayları | İsteğe bağlı | Analytics |
| App activity → Other user-generated content | Kayıttaki ad ve rehber adları | İsteğe bağlı | App functionality |
| Device or other IDs | Anonim Firebase kimliği | İsteğe bağlı | App functionality, Analytics |
| App info and performance → Crash logs | Sentry | İsteğe bağlı | App functionality |

## App Store · App Privacy

app.json `ios.privacyManifests` ile aynı: User ID (linked, tracking yok),
Gameplay Content (linked), Product Interaction (linked, analytics), Crash
Data (not linked). "Data Used to Track You": yok.
