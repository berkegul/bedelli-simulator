# Windows'ta Kurulum

Bu proje macOS'ta geliştirildi ama Windows'ta sorunsuz çalışır. Aşağıdaki
adımları sırayla uygula; her adımın sonunda ne görmen gerektiği yazıyor.

## 1. Gerekli programlar

### Node.js (zorunlu)

[nodejs.org](https://nodejs.org) → **LTS** sürümünü indir, kur. Kurulumda
"Automatically install the necessary tools" kutusunu **işaretleme**, gerek yok.

Kurduktan sonra **PowerShell'i yeniden aç** ve doğrula:

```powershell
node -v
npm -v
```

`v20`, `v22` ya da üstü bir sürüm görmelisin. Proje Node 25 ile geliştirildi
ama LTS sürümlerde de çalışır.

### Git (zorunlu)

[git-scm.com](https://git-scm.com/download/win) → indir, kur. Varsayılan
ayarlar yeterli.

```powershell
git --version
```

### Python (isteğe bağlı)

Yalnızca `tools/denge-analizi.py` için gerekli (denge analizi). Oyunu çalıştırmak için gerekmez.
[python.org](https://www.python.org/downloads/) → indirirken **"Add Python to
PATH"** kutusunu işaretle.

### Telefonuna Expo Go

Oyunu telefonda görmek için:
- **Android**: Play Store → "Expo Go"
- **iPhone**: App Store → "Expo Go"

## 2. Projeyi indir

PowerShell aç, projeyi koymak istediğin klasöre git ve klonla:

```powershell
cd C:\Users\%USERNAME%\Desktop
git clone https://github.com/berkegul/bedelli-simulator.git
cd bedelli-simulator
```

## 3. Bağımlılıkları kur

```powershell
npm install
```

Birkaç dakika sürer. Sonunda "added ~500 packages" gibi bir satır görürsün.
`npm warn deprecated ...` uyarıları normaldir, görmezden gel.

## 4. Çalıştır

### Telefonda (önerilen)

```powershell
npx expo start
```

Terminalde bir **QR kod** çıkar.

- **Android**: Expo Go uygulamasını aç → "Scan QR code" → kodu okut
- **iPhone**: Kamera uygulamasıyla QR'ı okut → çıkan bildirime dokun

> **Önemli:** Bilgisayar ve telefon **aynı Wi-Fi ağında** olmalı. Şirket veya
> okul ağlarında cihazlar birbirini göremeyebilir; o durumda telefonun
> hotspot'unu açıp bilgisayarı ona bağla.

### Tarayıcıda (hızlı bakış)

```powershell
npx expo start --web
```

Tarayıcıda `http://localhost:8081` açılır. Dokunmatik hisler ve titreşim
olmaz ama arayüzü ve akışı görmek için yeterli.

## 5. Kod düzenleme

Herhangi bir editör olur; [VS Code](https://code.visualstudio.com/) öneririm.
Dosyayı kaydettiğin anda telefondaki/tarayıcıdaki oyun kendini yeniler
(hot reload). Yeniden başlatmana gerek yok.

Tip hatalarını görmek için:

```powershell
npx tsc --noEmit
```

Hiçbir çıktı vermezse her şey temiz demektir.

## 6. Yardımcı scriptler

```powershell
npm run sprite
python tools\denge-analizi.py
```

Birincisi sprite'ları terminale çizip hizasızlık ve eksik palet karakteri
arar; ikincisi oyun dengesini üç oyuncu profiliyle simüle eder. İkisinin de
ne işe yaradığı `README.md`'de anlatılıyor.

---

## Windows'a özel sorunlar

### "npx : bu sistemde betik çalıştırma devre dışı"

PowerShell varsayılan olarak script çalıştırmayı engelliyor olabilir.
PowerShell'i **yönetici olarak** açıp bir kez şunu çalıştır:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Sorulan onaya `Y` de. Sonra normal PowerShell'e dön.

### QR kodu okuttum ama telefonda açılmıyor

1. Bilgisayar ve telefon aynı ağda mı?
2. Windows Güvenlik Duvarı Node.js'i engelliyor olabilir. İlk çalıştırmada
   çıkan "Windows Defender Güvenlik Duvarı bu uygulamayı engelledi" penceresinde
   **"Erişime izin ver"** demeyi unutma. Kaçırdıysan tünel modunu dene:

```powershell
npx expo start --tunnel
```

Tünel daha yavaştır ama ağ sorunlarını atlar.

### Port 8081 kullanımda

```powershell
npx expo start --port 8090
```

### `npm install` çok uzun sürüyor / hata veriyor

Klasörü Windows Defender taramasından muaf tutmak ciddi hızlandırır:
**Windows Güvenliği → Virüs ve tehdit koruması → Ayarları yönet → Dışlamalar
ekle → Klasör** → proje klasörünü seç.

Takılırsa temiz kurulum:

```powershell
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Uzun dosya yolu hatası

Projeyi `C:\Users\...\Desktop\...\...\...` gibi çok derin bir yere koyduysan
Windows'un 260 karakter sınırına takılabilirsin. `C:\dev\bedelli-simulator`
gibi kısa bir yol kullan.

---

## Sonraki adım

`README.md` dosyası oyunun nasıl kurulduğunu anlatıyor: gün yapısı, sahne
türleri, ekonomi, mini oyunlar, sprite çizimi ve yeni gün ekleme. Kod yazmaya
başlamadan önce onu bir oku.

Yeni gün eklemek için özetle: `src/content/day06.ts` oluştur, `day05.ts`'i
şablon al, `src/content/index.ts` içindeki `GUNLER` dizisine ekle. Tepsi,
serbest zaman, yürüyüş ve günlük görev sahneleri kendiliğinden eklenir.
