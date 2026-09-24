# Yayın planı

Bugünden (24 Eylül 2026, `main @ 30fcb45`) App Store ve Play Store yayınına kadar
yapılacak işler. Yol haritası artifact'ı bu belgeden besleniyor:
https://claude.ai/artifact/ARK7j9jh7vfbDzuoSG42MQ

Uygulama yalnızca mobil yayınlanıyor. Web (`expo start --web`) geliştirme
sırasında hızlı deneme için korunuyor ama yayın hedefi değil; web'de
çalışmayan bir özellik gerekirse web'i kırmadan atlanır.

İşleri Claude uyguluyor, Berke karar veriyor ve onaylıyor. Karar gerektiren
yerler §1'de toplandı; karar gelmeden o işe başlanmaz, onun dışındaki her iş
bu belgedeki tanımla yürür.

Durum işaretleri: ✅ bitti · 🟡 sürüyor · ⬜ bekliyor · ❓ karar bekliyor

---

## 0. Çalışma düzeni

### Bir işin yaşam döngüsü

1. **Başlamadan:** işin kartını (§3) oku, "Dosyalar" satırındaki dosyaları
   aç. Expo API'si kullanılacaksa https://docs.expo.dev/versions/v57.0.0/
   altındaki sayfayı oku (AGENTS.md kuralı). Web'de çalışmayan bir API'ye
   mecbur kalınırsa dur ve Berke'ye sor.
2. **Uygula:** kartın "Adımlar"ı. Kapsam dışına taşan bir şey görülürse
   düzeltme, bu belgeye yeni kart olarak ekle.
3. **Sına:** aşağıdaki "Bitti tanımı" sırayla.
4. **Commit:** iş başına bir commit, mesaj `S1: kalıcı anonim kimlik` gibi
   kart kimliğiyle başlar. Dalga (§2) bitince Berke'ye özet ve push onayı.
5. **Haritayı güncelle:** bu belgede kartı ✅ yap, artifact'taki `DONE` /
   `WIP` setlerini değiştirip aynı URL'ye yeniden yayınla.

### Bitti tanımı (her iş için)

| Kontrol | Komut | Ne zaman |
|---|---|---|
| Tip (test + araç) | `npm run typecheck` | her iş |
| Lint | `npm run lint` (0 hata) | her iş |
| Birim testleri | `npm test` | her iş |
| Telefon içeriği | `npm run telefon:dogrula` | içerik veya telefon motoruna dokunan iş |
| Web derlemesi (geliştirme önizlemesi kırılmasın) | `npx expo export -p web` | her iş |
| Native derlemesi | `npx expo export -p ios` | native modül eklenen veya platforma özel kod içeren iş |
| Tarayıcıda deneme | `npx expo start --web` + Chrome'da ilgili akış | ekran, akış ya da kayıt davranışına dokunan iş |
| Cihazda deneme | Expo Go / dev build | ses, haptik, IAP, geri tuşu, auth kalıcılığı |

Cihazda deneme gereken işlerde Claude kodu ve deneme adımlarını hazırlar,
Berke telefonda dener. Sonuç bu belgedeki karta yazılır.

### Git

- `main` üzerinde değil, dalga başına bir dal: `yayin/d1-zemin`,
  `yayin/d2-icerik-hazirlik`, …
- Dalga sonunda Berke gözden geçirir, `main`'e birleştirilir.
- `.env*.local` ve anahtar dosyaları repoya girmez (`.gitignore` hazır).

---

## 1. Berke'nin kararları

| # | Karar | Seçenekler | Öneri | Bekleyen iş |
|---|---|---|---|---|
| K1 | Para kazanma modeli | ücretsiz + tek seferlik kilit açma / peşin ücretli / reklamlı | Ücretsiz + kilit açma. Ölçüm verisi bununla toplanır, mağazada indirme bariyeri yok. | M1, M2, M3 |
| K2 | Kaç gün ücretsiz | 5 / 7 | **7.** Telefonun "bir hafta oldu" eşiği (g07) kilidin önünde kalır; oyuncu ilk duygusal geri dönüşü görüp duvara çarpar. | M2 |
| K3 | Kalkış saati | 05:00 (telefon g02) / 05:30 (menü, `ilkDurum.saat`, README) / 06:00 (gün dosyaları) | ✅ **05:30** (24 Eyl, öneriyle; Berke işi devretti). | I4 |
| ~~K4~~ | ~~Web'de satış~~ | — | Kapandı (24 Eyl): web yayınlanmıyor. | — |
| K5 | Yemin töreni günü | 21 / 26 / 28 | **28** (Berke, 24 Eyl): gerçekte tören son gün, törenden sonra aileyle çıkılıyor. Eskiden 26'ydı. | I7, I11 |
| K6 | Hesaplar | Apple Developer (99$/yıl), Google Play Console (25$ bir kez), Firebase projesi, Sentry | Hepsi Berke adına açılmalı; Claude kurulum adımlarını hazırlar. | M4, M6, Y1, Y5 |
| K7 | Fiyat | — | Rakip incelemesiyle M3 sırasında önerilecek. | M3 |

---

## 2. Dalgalar

Her dalga kendi içinde birleştirilebilir durumda biter; bir sonraki dalga
ondan sonra başlar. Süreler tek kişilik yoğun çalışma için kaba tahmin.

| Dalga | Amaç | İşler | Tahmin |
|---|---|---|---|
| **D1 · Zemin** | Veri kaybettiren hataları kapat, test altyapısını kur | S11, S9, S1, S2, S3, S4, S5, S6, S7 | 2–3 gün |
| **D2 · İçerik hazırlığı** | 23 gün yazılmadan önce çelişkileri, aracı ve şablonu hazırla | I4, S10, S13, I12, I13, S8, S12, I10, §4 takvimi | 3–4 gün |
| **D3 · İkinci hafta + ses** | Gün 6–12, ses, ayarlar, duraklatma | I5, C1, C2, C3 | 5–7 gün |
| **D4 · Görsel dil** | Ekranlar formdan oyuna: büyük sahne, diyalog kutusu, dünyaya ait menü/künye/çarşı, tepsi ve avlu, okunabilirlik, geçişler | G1–G8 (C4, C5 dahil) | 6–9 gün |
| **D5 · Üçüncü hafta** | Gün 13–19, öğreticiler | I6, C7 | 5–7 gün |
| **D6 · Son hafta + son** ✅ | Gün 20–28, yemin, karne, finaller, erişilebilirlik | I11, I7, I8, I9, C6 | 7–10 gün |
| **D7 · Ölçüm, uyum, altyapı** | Firebase, KVKK, crash raporlama, EAS, ikon, mağaza görselleri, cihaz testiyle S12b | M4, M5, M6, Y1, Y2, Y3, S12b | 4–6 gün |
| **D8 · Ücretlendirme** | Model, kilit yeri, IAP (Berke: en son) | M1, M2, M3 | 3–5 gün |
| **D9 · Yayın** | İç test, mağaza incelemesi, lansman | Y5, Y6, Y7 | 1–2 hafta (inceleme süresi dahil) |

Kritik yol içerik yazımıdır: I4 → I5 → I6 → I7 → I8 → I9 → Y5. Diğer her iş
bunun yanında paralel yürür.

---

## 3. İş kartları

### T · Temel (mevcut durum)

| Kart | Durum | Not |
|---|---|---|
| T1 Expo iskeleti + tema | ✅ | Expo 57, palet, 4px grid, Jersey 10 + Pixelify Sans |
| T2 Motor çekirdeği | ✅ | `src/engine/*` saf fonksiyonlar |
| T3 Sprite hattı | ✅ | SVG + Skia tek kaynaktan |
| T4 Kayıt v3 | ✅ | AsyncStorage, v2 → v3 taşıma |
| T5 11 mini oyun | ✅ | |
| T6 Web desteği | ✅ | `index.web.ts` Skia yükleme sırası |
| T7 Geliştirme alanı | ✅ | `__DEV__` ile yayından kapalı |
| T8 Firebase katmanı | 🟡 | Kod hazır, anahtar yok. S1–S3 bitmeden anahtar girilmez. |

---

### G · Görsel dil (D4)

İnceleme (telefon genişliğinde, 24 Eyl): palet, fontlar ve sprite'lar
tutarlı ama ekranlar oyun değil form gibi. Sahne ince bir şerit, ekranın
çoğu metin kutusu; menü, künye ve çarşı dünyanın dışında; tepsi ve avlu
taslak gibi; küçük soluk metin çok; hareket yok.

| Kart | İş | Kabul |
|---|---|---|
| G1 | **Oyun ekranı:** sahne ekranın ~%40'ı, sprite'lar büyük; anlatı altta RPG diyalog kutusu (konuşanın portresi ve adı sekmesi), seçimler kutunun içinde; stat şeridi sade | 1. ve 9. günün birer bloğu önce/sonra ekran görüntüsüyle Berke'ye gösterilir ✅ |
| G2 | **Menü:** nizamiye sahnesi ve saatine göre gökyüzü; seçenekler kışla tabelası/künye kartı gibi; çentik takvimi duvarda | ✅ |
| G3 | **Künye:** askerî form kâğıdı (kaput bezi zemin, damga, daktilo alanları) | ✅ |
| G4 | **Çarşı:** dükkân tezgâhı; ürün kartı sade, kalite seçimi tek sıra | ✅ |
| G5 | **Tepsi:** yemekler bölmelerde çizili (seçilmeyen soluk) | ✅ |
| G6 | **Avlu haritası:** etiket çakışması yok, daha büyük, zemin detayı | ✅ |
| G7 | **Okunabilirlik:** en küçük metin boyutu yükselir, soluk metin azalır, kontrast kontrolü | ✅ |
| G8 | **Hareket:** ekran geçişleri, stat değişiminde sayma, mini oyun sonucunda derece damgası (C4); geniş ekranda oyun alanı sınırlı (C5) | ✅ |

Yöntem: önce G1 (oyunun %80'i bu ekranda geçiyor) prototip olarak
yapılıp Berke'ye gösterilir; onayla yön oturunca diğer ekranlar aynı dile
geçer.

### S · Sağlamlaştırma

#### S11 · sprite-onizle hatası ✅ (D1)
- **Sorun:** `tools/sprite-onizle.py:28` boş bir sprite tanımında
  `max()` boş diziyle çağrılıyor ve script çöküyor.
- **Adımlar:** boş `rows` dizisi olan tanımı bul (`ASKER_ARKA_SAG` sonrası).
  Tanım gerçekten boşsa sprite'ı düzelt ya da sil. Script'e boş tanım için
  "⚠ boş" uyarısı ekle, çökmesin.
- **Kabul:** `python3 tools/sprite-onizle.py` sonuna kadar koşuyor, hatalı
  sprite varsa uyarıyla listeliyor.
- **Sonuç:** sprite bozuk değildi, araç türetilmiş tanımları (`...ARKA_GOVDE`,
  `rows: TISORT.rows`) göremiyordu. Araç tsx'e taşındı (`npm run sprite`),
  modülü doğrudan içe aktarıyor: 56 yerine 82 sprite doğrulanıyor, hepsi temiz.

#### S9 · test + lint + CI ✅ (D1, S11'den sonra)
- **Adımlar:**
  1. Test koşucusu olarak `node:test` + `tsx` (zaten kurulu, RN dönüşümü
     gerektirmiyor): `"test": "node --import tsx --test src/**/*.test.ts"`.
  2. İlk testler: `engine/stats.ts` (kazanç eğrisi, clamp, uç davranış),
     `engine/zaman.ts`, `engine/turkce.ts` (Serkan'a / Emre'ye / Tolga'ya),
     `engine/hava.ts` (determinizm), `content/index.ts` (her gün için
     `gunGetir` boş değil, blok kimlikleri tekil).
  3. ESLint: `npx expo lint` ile Expo'nun önerdiği yapılandırma
     (v57 dokümanından kontrol edilecek).
  4. `.github/workflows/kontrol.yml`: `npm ci` → `tsc` → `npm test` →
     `telefon:dogrula` → `sprite-onizle` → `expo export -p web`.
- **Kabul:** CI yeşil, `npm test` en az 20 test koşuyor.
- **Sonuç:** 48 test (stats, türkçe ekler, zaman, hava, içerik yapısı).
  `npm run typecheck` iki aşamalı: uygulama `tsconfig.json`, test ve araçlar
  `tsconfig.node.json` (TS 6 Node tiplerini kendiliğinden yüklemiyor; uygulama
  koduna sızmasınlar diye ayrıldı). Lint 0 hata, 100 uyarı: hepsi React
  Compiler kuralı, S12'ye bırakıldı. `.github/workflows/kontrol.yml`.

#### S1 · kalıcı anonim kimlik 🔴 ✅ kod · cihaz testi M4'te (D1)
- **Sorun:** `engine/bulut.ts:24` `getAuth(app)` React Native'de kalıcılık
  olmadan açılıyor. Her açılış yeni anonim uid alıyor, bulut kaydı hiç
  bulunmuyor, ölçüm verisi oturum başına bölünüyor.
- **Adımlar:**
  1. Native'de `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })`,
     web'de `getAuth(app)` (tarayıcıda kalıcılık varsayılan). Ayrım
     `Platform.OS` ya da `bulut.native.ts` / `bulut.web.ts` ile.
     `getReactNativePersistence` tip tanımı RN girişinde; import yolu
     Firebase 12 ile doğrulanacak.
  2. `initializeAuth` ikinci kez çağrılırsa hata veriyor; tek seferlik
     başlatmayı `hazirlik` promise'i zaten sağlıyor, korunacak.
  3. `baglan()` için 4 sn zaman aşımı: ağ yoksa `null` dön, açılış
     beklemesin (`App.tsx:44`'teki `ilkYukleme` splash'i tutuyor).
- **Kabul:** Firebase test projesiyle cihazda uygulamayı üç kez kapatıp aç:
  Firestore'da tek `oyuncular/{uid}` belgesi. Uçak modunda ilk açılış
  4 sn içinde menüye düşüyor.
- **Sonuç:** `engine/kimlik.native.ts` (AsyncStorage kalıcılığı) ve
  `engine/kimlik.ts` (web önizlemesi). Asıl yakalanan ikinci hata:
  kalıcılık açıkken bile `currentUser` ilk anda null; `authStateReady()`
  beklenmeden anonim giriş yine yeni kimlik açıyordu. Başarısız bağlantı
  artık önbelleğe alınmıyor (60 sn sonra yeniden deneniyor), açılıştaki
  bulut okuması 4 sn'lik `sureli` ile sınırlı. iOS paketinde `@firebase/auth`
  RN girişinin yüklendiği doğrulandı. Cihazda kabul testi Firebase projesi
  açılınca (K6, M4) yapılacak.

#### S2 · bulut kaydı birleşmesin 🔴 ✅ kod · cihaz testi M4'te (D1, S1'den sonra)
- **Sorun:** `engine/bulut.ts:45` `setDoc(..., { merge: true })` yerelde
  silinen alanları (son sigara, eski envanter) bulutta bırakıyor.
- **Adımlar:**
  1. `merge` kaldırılır; her yazma kaydın tamamını değiştirir.
  2. Çakışma kuralı: `yukle()` cihazda kayıt varsa onu kullanır; bulutta
     daha yeni `guncelleme` varsa (başka cihazdan oynanmış) yine cihazı
     seçer ama `olayYaz('kayit_cakismasi')` yazar. Birleştirme yapılmaz.
  3. Yazmalar arka arkaya gelirse sonuncusu kazansın: 1,5 sn'lik
     debounce (`persist` her küçük adımda çağrılıyor, Firestore yazım
     maliyeti de düşer).
- **Kabul:** birim testi: sigarası biten kayıt yazılıp okununca `sigara`
  anahtarı yok. Firestore konsolunda yazım sayısı sahne başına bir değil.
- **Sonuç:** `setDoc` birleştirmesiz. Yazmalar 1,5 sn'de bir en son hâliyle
  gidiyor; uygulama arka plana düşerken `App.tsx`'teki AppState dinleyicisi
  bekleyeni hemen gönderiyor. `bekleyenYazmayiIptalEt()` S3 için hazır.
  Ek koruma: Firestore `undefined` alanlı belgeyi reddettiği için kayıt
  yazmadan önce JSON'dan geçiriliyor. Çakışma: cihaz kazanır, bulut 1 dk'dan
  daha yeniyse `kayit_cakismasi` olayı yazılır. Birleştirmenin gerçek
  Firestore'da kabulü M4'te; `setDoc` davranışı belgeli olduğu için birim
  testi `firestoreIcin`'i sınıyor.

#### S3 · yeni oyun: onay + bulut silme 🔴 ✅ (D1, S2'den sonra)
- **Sorun:** `MenuEkrani.tsx:50` "Baştan başla" onaysız siliyor;
  `save.ts:91` `sil()` buluta dokunmadığı için eski oyun geri geliyor.
- **Adımlar:**
  1. Menüde iki adımlı onay: ilk dokunuşta buton "Emin misin? 3. gün
     silinir" metnine dönüşür, 3 sn içinde ikinci dokunuş siler. Kendi
     bileşeni olarak (`OnayliButon`), `confirm()` kullanılmaz (web'de de
     tutarlı olsun).
  2. `sil()` buluttaki belgeyi `deleteDoc` ile siler; ağ yoksa yerel
     kayda `silindi: true` bayrağı yazılır ve `yukle()` bayrak varken
     buluttan geri yükleme yapmaz.
  3. `sifirla()` (`gameStore.ts`) aynı yolu kullanır.
- **Kabul:** web'de: baştan başla → sayfayı yenile → profil ekranı, eski
  ad yok. Onay metni üç saniye sonra eski hâline dönüyor.
- **Sonuç:** `ui/OnayliButon.tsx`; menüde "3. gündeki kayıt silinecek. Emin
  misin?". `sil()` önce `bedelli.save.silindi` işaretini yazıyor, bulut
  silinince kaldırıyor; işaret varken `yukle()` buluttan geri yüklemiyor ve
  silmeyi yeniden deniyor. Yeni oyun kaydedilince işaret kalkıyor (yoksa
  ileride yeni oyunun yedeğini sildirebilirdi). `save.test.ts` AsyncStorage
  ve bulutu taklit ederek ağsız silme senaryosunu sınıyor; işaret kontrolü
  kapatılınca iki test düşüyor (doğrulandı). Tarayıcıda: tek dokunuş soru,
  3 sn sonra geri dönüş, çift dokunuş silme, yenilemede eski oyun yok.

#### S4 · kayıt doğrulama + sürüm zinciri ✅ (D1)
- **Sorun:** `save.ts:61` `JSON.parse(raw) as SaveData` dışında kontrol yok.
  Eksik `stats` alanı ekranda çökme yapar.
- **Adımlar:**
  1. `engine/kayitDogrula.ts`: bağımlılıksız, alan alan doğrulayan
     `kayitDogrula(ham: unknown): SaveData | null`. Zorunlu alanlar
     (profil, gun, stats'ın beş alanı sayı mı) bozuksa `null`; opsiyonel
     alanlar bozuksa varsayılana düşer.
  2. Taşıma zinciri: `TASIMALAR: Record<number, (k) => k>` — v2→v3 bugünkü
     mantık buraya taşınır. Store'daki `?? varsayılan` satırları
     (`gameStore.ts:300-346`) doğrulayıcıya iner, store sadeleşir.
  3. Bozuk kayıt bulunursa silinmez; `bedelli.save.bozuk` anahtarına
     kopyalanır (destek için) ve oyun menüden temiz başlar.
- **Kabul:** birim testleri: boş nesne, eksik stats, string gun, v2 kaydı,
  geçerli v3 kaydı.
- **Sonuç:** `engine/kayitDogrula.ts`, cihaz, v2 ve bulut kaydı aynı yoldan
  geçiyor. Zorunlu alan bozuksa kayıt `bedelli.save.bozuk`'a alınıp buluttaki
  yedeğe düşülüyor. Doğrulayıcının dönüş tipi SaveData'nın her anahtarını
  zorunlu tutuyor: yeni alan eklenip burada unutulursa tsc hata veriyor
  (denendi). **Sapma:** store'daki `?? varsayılan` satırları yerinde kaldı;
  varsayılan sabitleri (BASLANGIC_ILISKI vb.) store'da duruyor, taşınmaları
  S8'in store bölmesiyle birlikte yapılacak. Doğrulayıcı yanlış tipli alanı
  düşürüyor, store eksiği dolduruyor. 19 yeni test.

#### S5 · kaydedilmeyen durumlar + kontör iadesi ✅ (D1, S4'ten sonra)
- **Sorun:** `persist` (`gameStore.ts:1326`) şunları yazmıyor:
  `aktifGorusme`, `cepteIzmarit`, `bugunIsteyenler`, `bugunDinlenildi`,
  `gelenArama`, `bekleyenArama`. Görüşme ortasında kapatınca kontör ve
  arama hakkı yanıyor. `gorusmeAc` içinde "kimse açmadı" dalında kontör
  iade edilmiyor.
- **Adımlar:**
  1. Günlük alanlar (`cepteIzmarit`, `bugunIsteyenler`, `bugunDinlenildi`,
     `bekleyenArama`) kayda eklenir.
  2. `aktifGorusme` kaydedilmez; yerine açılışta yarım görüşme varsa
     biriken etkiler uygulanıp görüşme "hat kesildi" kapanışıyla kapatılır.
     Bunun için kayda sadece `yarimGorusme` özeti yazılır.
  3. Kontör, görüşme gerçekten açıldıktan sonra düşülür (`kisiAra` →
     `gorusmeAc` sırası değişir).
- **Kabul:** web'de görüşmenin ortasında sayfayı yenile: kontör bir kez
  düşmüş, ilişki etkisi uygulanmış, panel kapalı.
- **Sonuç:** günlük alanlar ve `gelenArama` kayda girdi. Açık görüşme
  `yarimGorusme` olarak yazılıyor (plandaki "özet" yerine görüşmenin tamamı;
  kapanış mantığı `gorusmeBitir` zaten ona ihtiyaç duyuyor). Açılışta
  "Hat kesildi. Konuşma yarım kaldı." ile kapanıyor; kart `acilistan`
  işaretiyle "Devam et"ten sağ çıkıyor (eskiden devamEt her kartı
  siliyordu). Kontör `gorusmeAc` true dönünce düşüyor. Tarayıcıda: yarım
  görüşmeli kayıt → ilişki ve moral uygulandı, kart göründü, sahne
  ilerlemedi, konsol temiz. "Kimse açmadı" dalı tarayıcıda tetiklenemedi,
  kod okumasıyla doğrulandı.

#### S6 · zamanlayıcı sızıntıları ✅ (D1)
- **Sorun:** `YolSahnesi.tsx:316` `setInterval` unmount'ta temizlenmiyor.
  Tur sonu `setTimeout`'ları `YatakToplama.tsx:63`, `Ictima.tsx:45`,
  `SilahSokme.tsx:54`, `Ceza.tsx:131` içinde temizlenmiyor.
  `GokyuzuGecisi.tsx:50` `onBitti`'yi setState updater içinden çağırıyor.
- **Adımlar:** `minigames/geriSayim.ts` yanına `useZamanlayici()` hook'u:
  bileşen ömrüne bağlı `sonra(ms, fn)` ve `aralik(ms, fn)`, unmount'ta
  hepsini temizler. Dört mini oyun ve yol sahnesi buna geçer.
  GokyuzuGecisi'nde `onBitti` ref'e alınır, updater dışında bir kez çağrılır.
- **Kabul:** geliştirme alanından mini oyunu açıp tur bitmeden çık:
  konsolda uyarı yok, sonraki ekrana çift geçiş yok.
- **Sonuç:** hook `ui/useZamanlayici.ts` (`sonra`, `aralik`, `durdur`).
  Taşınanlar: YolSahnesi varış karartması, YatakToplama, Ictima, SilahSokme,
  Ceza, Tiras, PostalParlatma, Nobet, YuruyusRitmi (plandaki dört dosyadan
  fazlası `onBitti` sızdırıyordu). GokyuzuGecisi: `onBitti` ref'te ve tek
  seferlik, güncelleyici dışından. **Ek hata:** nöbette bitiş zamanlayıcısı
  `ceza`yı açılıştaki değeriyle (0) okuyordu, devriyeye yakalanmak puanı hiç
  düşürmüyordu; ref'e alındı. Giyinme ve Gece'nin kendi `sonra` deseni
  çalışıyor, S12'de hook'a geçecek. Tarayıcıda: Yatak Toplama sonuna kadar
  oynandı (tek sonuç), İçtima tur ortasında kapatıldı (geç çağrı yok,
  konsol temiz). Lint uyarısı 100'de kaldı.

#### S7 · Android geri tuşu ✅ kod · cihaz testi bekliyor (D1)
- **Adımlar:** `App.tsx`'e `BackHandler` dinleyicisi. Sıra: panel açıksa
  paneli kapat → oyun ekranındaysa duraklatma menüsünü aç (C3 gelene
  kadar menüye dön) → menüdeyse varsayılan davranış (çıkış).
- **Kabul:** Android cihazda panel açıkken geri → panel kapanıyor.
- **Sonuç:** karar mantığı saf fonksiyon (`ui/geriTusu.ts`, 5 test),
  dinleyici `ui/useGeriTusu.ts`. Görüşme paneli `gorusmeKapat` ile kapanıyor
  (etkiler uygulansın); sigara isteği, izmarit kararı ve izmarit cezası geri
  tuşuyla atlanamıyor. Android paketi derleniyor. Cihazda deneme: Berke'nin
  Android telefonu ya da emülatör (Expo Go yeterli).

#### S8 · store bölme + seçiciler ✅ (D2)
- **Adımlar:**
  1. `gameStore.ts` zustand dilimlerine: `akis` (ekran, gün, blok, sahne),
     `ekonomi` (para, envanter, kantin), `sigara`, `telefon`, `sosyal`
     (dostluk, diyalog). Dışa açılan `useGame` API'si değişmez.
  2. `useGame()` tam abonelikleri (11 ekran) `useShallow` seçicilerine.
  3. Her karede setState yapanlar: `YatakToplama` rAF → shared value,
     `useGeriSayim` 100 ms → 250 ms + görüntü shared value ile.
- **Kabul:** davranış değişmez (testler + web'de bir tam gün). React
  DevTools'ta mini oyun sırasında `OyunEkrani` yeniden çizilmiyor.
- **Sonuç:** `gameStore.ts` 1420 → 54 satır. `store/tipler.ts`,
  `ilkDurum.ts`, `yardimcilar.ts` ve `dilimler/{akis,telefon,ekonomi,avlu}.ts`.
  Metot gövdeleri betikle, yorumlarıyla birlikte satır satır taşındı
  (yeniden birleştirme orijinale eşit doğrulandı); kullanılmayan importlar
  `tsc --noUnusedLocals` çıktısıyla ayıklandı. Dışarıya açık API aynı.
  `store/secici.ts` → `useSecili('gun', 'para', …)`: 32 bileşen artık yalnızca
  kullandığı alanlara abone; `Pick<Store, K>` döndüğü için seçilmemiş alan
  okunursa tsc hata veriyor. İkisi (`gelistirme` Durum ve Paneller) `g`'yi
  bütün olarak geçirdiği için dokunulmadı. Doğrulama: 97 test, tohumlu denge
  çıktısı bölme öncesiyle birebir aynı, tarayıcıda menü → künye → çarşı →
  gün başı → sahneler → Cep/Durum panelleri, konsol temiz.
  **Yapılmayan:** plandaki "her karede setState" dönüşümü (YatakToplama rAF,
  geri sayım) S12'ye kaldı; React DevTools ölçümü yapılmadı.

#### S12 · React Compiler lint uyarıları 🟡 100 → 36 (D2, S6 + S8 ile)
- **Durum:** `react-hooks/refs` (51), `immutability` (38),
  `set-state-in-effect` (6), `purity` (5) uyarı seviyesinde. Çoğu
  `useRef(new Animated.Value)` ve Reanimated shared value atamaları;
  bugün doğru çalışıyor ama React Compiler açılırsa bozulur.
- **Adımlar:** S6 ve S8 dosyalara dokunurken: RN `Animated` → Reanimated
  (`OyunEkrani`, `Tepsi`), shared value'da `.value =` yerine `.set()`,
  render sırasında `Date.now()` ve ref okuma → effect / olay işleyici.
- **Kabul:** `npm run lint` 0 uyarı; `eslint.config.js`'teki dört kural
  `error`'a çekilir.
- **Yapılan (mekanik, düşük riskli):**
  - Reanimated shared value atamaları `.value = x` → `.set(x)` (46 yer;
    parantez derinliği sayan dönüştürücüyle, çok satırlı ifadeler dahil),
  - `useRef(new Animated.Value(0)).current` → `useState(() => …)` (5 yer),
  - render içindeki `Date.now()` ilk değerleri effect'e (4 yer); sigara
    isteyen arkadaşın cümlesi artık panel açılınca bir kez seçiliyor
    (eskiden her yeniden çizimde değişebiliyordu).
- **Ek bulunan hata (önceden vardı):** yol sahnesinde yürümeye başlarken
  Skia `drawPicture` tanımsız resimle çöküyordu (web konsolu); askerin kare
  indeksi sınır dışına düşüyordu. İndeks 0–3'e sabitlendi, düzeldiği
  tarayıcıda doğrulandı. Yürüyüş ve Ceza çizimi çalışıyor; Ceza'nın basılı
  tut/bırak sayımı tarayıcı aracıyla sınanamadı → cihaz testine.
- **Kalan 36 → S12b.**

#### S12b · kalan React Compiler uyarıları ⬜ (D7, cihaz testiyle)
- `react-hooks/refs` (26): render sırasında ref okuma (Tiras, PostalParlatma,
  YatakToplama ekranda ref'ten türetilen değerler), `xRef.current = x`
  "son değer" kalıpları (React 19.2 `useEffectEvent` ile), jest
  kapanışlarındaki yanlış pozitifler.
- `react-hooks/set-state-in-effect` (6): prop değişince sıfırlanan state
  (Ictima, YatakToplama, OyunEkrani, Daktilo, GokyuzuGecisi, IzmaritToplama)
  → `key` ile yeniden kurma ya da render sırasında ayarlama.
- `react-hooks/immutability` (4): hook dönüş değerinde metot çağrısı
  (`sure.durdur()`), ref'e `+=`.
- Mini oyun mantığına dokunduğu için her dosya sonrası cihazda deneme şart.

#### S10 · denge simülasyonu tsx ✅ (D2)
- **Sorun:** `tools/denge-analizi.py`, `stats.ts`'i elle kopyalıyor, rutin /
  ceza / nöbet / telefon etkilerini görmüyor, tokluğu yanlış modelliyor.
- **Adımlar:** `tools/denge.ts` (tsx): `GUNLER`'i ve `stats.ts`'i doğrudan
  içe aktarır, her gün için zenginleştirilmiş blokları yürür; üç profil
  (en iyi / ortalama / en kötü) + tohumlu rastgele 200 oyuncu.
  Çıktı: gün gün stat bandı, uca yapışma uyarısı, gün sonu not dağılımı.
  Python scripti silinir.
- **Hedef eğri (§4 yazılırken kullanılacak):** iyi oyuncu disiplini 28.
  güne kadar 90'ı geçmez, kötü oyuncu hiçbir statta 3 günden uzun 0'da
  kalmaz (revir dalı, I6).
- **Kabul:** `npm run denge` çalışıyor; 1–5. günler için Python çıktısıyla
  yön olarak tutarlı, farklar açıklanmış.
- **Sonuç:** plandan daha iyi bir yol seçildi: `tools/oyuncu.ts` formülleri
  kopyalamıyor, gerçek store'u (AsyncStorage taklidiyle) oyuncu gibi sürüyor.
  Yeni gün ya da mekanik eklenince araç güncellenmiyor. `tools/denge.ts`
  rapor, `tools/oyuncu.test.ts` oynanış testi (her profil her yazılı günü
  bitirebilmeli; kilitlenen sahne test kırar). Python araçları silindi,
  kurulumda Python gerekmiyor.
- **Farklar (Python yanılıyordu):** ortalama oyuncu İDARE EDER'de takılı
  değil; 200 rastgele oyuncunun %83'ü 5. günde TAKDİR ALDI. İyi oyuncuda
  disiplin 4. günde 98. Kötü oyuncu 3. günde üç statta dipte. → S13.

#### S13 · denge ayarı ✅ (D2, S10'dan sonra, I5'ten önce)
- **Sorun:** 1–5. günler ortalama oyuncuyu bile tavana taşıyor; 23 gün için
  ilerleme payı kalmıyor. İçerik yazılmadan önce çözülmeli, çünkü yeni
  günlerin etki ölçeği (±3 / ±6 / ±12) buna göre seçilecek.
- **Hedef eğri** (`npm run denge`):
  - ortalama oyuncu: 5. günde çoğunluk TEMİZ İŞ, TAKDİR ALDI %20'nin altında;
    TAKDİR'e ancak son haftada çoğunluk ulaşsın;
  - iyi oyuncu: disiplin 28. güne kadar 95'e dayanmasın, 5. günde ≤ 85;
  - kötü oyuncu: dibe vurabilir ama bir stat 3 günden uzun 0'da kalmasın
    (toparlanma yolu I6'daki revir dalı).
- **Kaldıraçlar:** sabah rutini + denetim ödüllerinin büyüklüğü
  (`content/rutin.ts`), dolap etkisi, tepsi kalemlerinin kondisyon/moral
  katkısı, `kazanc()` üssü. Günlük etkiler toplamının dökümü için
  `npm run denge -- --ayrinti`.
- **Kabul:** hedef eğri tutuyor; oynanış testi geçiyor.
- **Sonuç:** `npm run denge` artık puan kaynaklarını döküyor. Asıl pasif
  kaynaklar ekipman (standart setle her sabah ham +8 kondisyon, +4 moral,
  +4 disiplin) ve uyku (+4 kondisyon/gece) idi. Değişenler:
  - ekipman günlük kazançları yarıya (eksik eşya cezası aynı),
  - dinç biten gecenin kondisyonu +4 → +2, orta enerji +1 → 0,
  - `kazanc()` üssü 0.85 → 1.3, "en az 1 puan" eşiği 92 → 80
    (grid: üs 0.85/1.2/1.3/1.5 × eşik 92/85/80 denendi).
  Denetim ödülünü küçültmek sonucu değiştirmedi, geri alındı; içerik
  dosyalarına dokunulmadı, ±3/±6/±12 ölçeği geçerli.
- **Ölçüm (5. gün):** ortalama oyuncu %90 TEMİZ İŞ, %10 İDARE EDER, %0
  TAKDİR (eskiden %83 TAKDİR). İyi oyuncu TAKDİR'i ilk kez 5. günde alıyor,
  disiplin 91 (hedef ≤85 tutmadı; tavana yakın her +12 ödül hâlâ +1 ekliyor,
  gün 6–12 yazılınca yeniden ölçülecek). Kötü oyuncu hâlâ dipte → I6.

---

### İ · İçerik

#### I4 · tutarlılık düzeltmesi ✅ (D2, K3 kararından sonra)
- **Çelişkiler:**
  - İlk nöbet: `day04.ts:226` "bu gece ilk nöbetiniz", motor 6. gün,
    telefon g10 "ilk gece nöbeti".
  - Kalkış saati üç farklı (K3).
  - Silah eğitimi `day03.ts:183`'te başlıyor, atış g09'da. Sorun değil
    (önce sökme-takma, sonra atış) ama metinler bunu söylemeli.
  - Telefon g05 "ilk uzun eğitim, gerçek yorgunluk" diyor, `day05.ts`
    sınıfta nezaket dersi.
- **Kural:** telefon gün sırası (`telefon/gunler/gNN.ts` başlıkları) ana
  takvim kabul edilir; gün dosyaları ona uyar. İstisna: 1–5. günler
  yazılı ve oynanmış, orada telefon metni düzeltilir.
- **Adımlar:**
  1. Görev takvimi gün numarası formülünden çıkıp tabloya iner:
     `content/gorevTakvimi.ts` → `{ [gun]: { nobet?: true; ceza?: true } }`.
     `gunlukGorevler()` tabloya bakar. İlk nöbet 10. gün. Tablo §4'te.
  2. `day04.ts:226` cümlesi "yakında nöbet listesi asılacak" olur.
  3. g05 başlık ve açılış replikleri ders gününe göre yeniden yazılır.
  4. Kalkış saati K3'e göre tek yerde (`rutin.ts` sabiti), menü metni ve
     g02 buna bağlanır.
- **Kabul:** `rg "05:00|05:30|06:00"` çıktısı tek bir kalkış saati
  gösteriyor; `telefon:dogrula` geçiyor.
- **Sonuç:** 2–5. günlerde zincir 05:30 kalkış → 06:00 içtima → 06:30
  mıntıka/denetim → 07:00 kahvaltı → 08:00 eğitim. Tanıtımdaki öğün saatleri
  07:00 / 12:00 / 17:30. Görev takvimi `content/gorevTakvimi.ts`'e indi;
  `Day.gorevler` ile gün dosyası ezebilir. 4. günde nöbet listesi yalnızca
  asılıyor (takas seçeneğinin anlık enerji etkisi kaldırıldı). g05
  görüşmesi ders + talim gününe uyduruldu. **Ek bulunan:** gün sayımları
  kaymıştı (2. gün "28 günün 1'i bitti", 4. gün "Üç gün bitiyor… Yarın
  dördüncü gün"); düzeltildi. 3. günden sonra her gün açılabilen Emre
  diyaloğundaki sabit "Yirmi beş gün kaldı" sayısız hâle getirildi.
  5 yeni test (takvim, ilk nöbet, kalkış saati). Tarayıcıda 2. gün
  05:30'da açılıyor.

#### I12 · kullanılmayan işaretler ✅ (D2)
- **Sorun:** `telefon:dogrula` 70 işaretin yazılıp hiç okunmadığını söylüyor.
- **Adımlar:** listeyi çıkar, her birini üç gruptan birine koy:
  (a) finalde / epilogda kullanılacak (I9'a not düş), (b) sonraki bir
  telefon gününde geri dönüş olacak (ilgili gNN'e ekle),
  (c) gereksiz, sil. Karar tablosu bu belgenin sonuna eklenir.
- **Kabul:** uyarı sayısı 0 ya da yalnızca (a) grubu, I9'da kapanacak.
- **Sonuç:** 70 işaret dört gruba ayrıldı:
  - **Epilog (21):** söz ve beyanlar (`anne_soz`, `randevu_sozu`, `son_soz`…)
    `EPILOG_METIN`'e "…demiştin" satırı olarak yazıldı. Doğrulayıcı epilog
    sözlüğünü artık okuyucu sayıyor (`en_cok_ozlenen` yanlış pozitifti).
    Epilog seçimi değişti: en eski satır + her biri öncekinden ≥6 gün sonra;
    yoksa birinci günün sözleri üç satırı da dolduruyordu.
  - **Final (17)** ve **gün (16):** `telefon/isaretPlani.ts`'e plan olarak
    yazıldı; doğrulayıcı bunları uyarı değil "PLANLI" listesi olarak basıyor
    (gün işaretleri hangi güne ait, notuyla). Plan gerçekleşince kayıttan
    silinmesi gerektiğini doğrulayıcı söylüyor.
  - **Silinen (16):** ilişki/gerilim sayısını tekrarlayan, karşılığı
    olmayanlar (`anlatan`, `dinleyen`, `yalniz_kaldi`, `sevgili_yakinlik`…).
  `telefon:dogrula`: 70 uyarı → 0; 33 planlı. 3 epilog testi.
- **Not:** gün işaretlerinin gün dosyalarında okunabilmesi için sahneye
  hafıza koşulu gerekiyor → I13.

#### I13 · gün sahnelerinde telefon hafızası ✅ (D2, I5'ten önce)
- **Neden:** telefonda anlatılan şey (bot olayı, atış sonucu, koli)
  ertesi gün koğuşta karşına çıkmalı; bugün gün sahneleri hafızayı okuyamıyor.
- **Adımlar:** `Scene`'e opsiyonel `kosul?: Kosul` (telefon motorunun
  `kosulTutar`'ı yeniden kullanılır); koşulu tutmayan sahne `ileri` ve
  `blokZenginlestir` sırasında atlanır. Metinlerde `{deger:isaret}`
  şablonu. `icerik.test.ts`: koşul başka türlü sahne sayısını sıfıra
  indirmesin (her blokta en az bir koşulsuz sahne).
- **Kabul:** örnek: 12. gün sahnesi `komik_olay` konmuşsa açılıyor; oynanış
  testi iki yolda da günü bitiriyor.
- **Sonuç:** `Scene` ortak `kosul?: Kosul` aldı; `content/index.ts`
  `acikSahne()` saf fonksiyonu, store `ileri`, blok geçişi ve gün başında
  koşulsuz ilk sahneye atlıyor. Şablon (`{deger:…}`) eklenmedi: işaret
  değerleri kimlik (`bot`), metin değil; koşullu sahne varyantları yeterli.
  3 test (açılır / atlanır / her blokta koşulsuz sahne). Gerçek içerikte
  ilk kullanım I5'te (gün 7, 10–12).

#### I10 · atış mini oyunu ✅ (D2)
- **Tasarım:** nişangâh dikey salınıyor (nefes), oyuncu basılı tutunca
  salınım yavaşlıyor ama "nefes" çubuğu tükeniyor; bırakınca atış.
  5 mermi, hedef tahtası halkalarından puan. `Date.now()` değil
  `performance.now()`. Hareket azaltma açıksa salınım genliği düşük.
- **Dosyalar:** `minigames/Atis.tsx`, `minigames/index.tsx` (`HARITA`,
  `MINI_BASLIK`), `engine/types.ts` (`MiniGameId`), `art/sprites.ts`
  (nişangâh, delik).
- **Kabul:** geliştirme alanında oynanıyor, web'de ve iOS export'ta
  derleniyor, 0–1 puan dönüyor.
- **Sonuç:** `minigames/Atis.tsx`. Hedef halkaları piksel ızgarası olarak
  üretilip PixelSprite ile çiziliyor (daire yok, palete ve 4px diline uygun).
  Nişangâh iki eksende nefesle salınıyor; basılı tutmak salınımı daraltıyor,
  nefes çubuğu biterse titreme. 5 mermi, halka puanı merkezde 1'den dışa
  0.18 azalıyor. Hareket azaltmada genlik düşük. Tarayıcıda bulunan hata:
  anlık dokunuşta pressIn/pressOut sırası garanti değildi ve atış
  kaçıyordu; basış başına bekleyen atış + onPress yedeği ile düzeldi.
  Sprite'larda görülen ince çizgiler yakalama aracının küçültmesiydi, oyunda
  yok. `performance.now` yerine `Date.now` (diğer oyunlarla aynı; tepki
  ölçümü değil, salınım fazı).

#### I5 · gün 6–12 ✅ (D3) · I6 · gün 13–19 ✅ (D5) · I7 · gün 20–27 ✅ (D6)
- **Şablon:** her gün `src/content/dayNN.ts`, 8–11 blok. Yazmadan önce
  §4'teki satır, ilgili `telefon/gunler/gNN.ts` ve bir önceki gün okunur.
- **Gün başına içerik:**
  - epigraf (telefon temasıyla aynı duygu),
  - günün olayı: 1–2 özel sahne (atış, bot, koli…),
  - 5–10 seçim, etki ölçeği README'deki gibi (±3 / ±6 / ±12),
  - en az bir Emre / Tolga / Serkan sahnesi,
  - rutin günlerde (8, 15, 19) blok sayısı az, metin kısa.
- **Her gün sonunda:** `npm run denge` hedef eğrisinde mi, `tsc`,
  web'de o günü baştan sona oyna.
- **I6 sonucu:** `day13`–`day19` (Ölçüm, Yarısı, Sayım, Yorgunluk, Koli,
  On Gün, Tek Hane). Revir dalı: 16. günde herkese ayak yarası seçimi, moral
  45 altındaysa Çavuş revire gönderiyor (enerji +24, kondisyon +9). Koli
  17. günde anne ilişkisine göre (75+ kurabiye+mektup, 45–74 normal, 44 altı
  sade); 18. günde koğuşta paylaşılıyor. Okunan işaretler: ev_yemegi,
  kanka_takvim, sevgili_surpriz, hasta_oldu, koli_yolda, koli_icerigi,
  ilk_azar. Günler üç paralel oturumda yazıldı, tek elden birleştirildi.
  Denge: ortalama oyuncu 13–19'da TEMİZ İŞ (%84–100).
- **Kabul (hafta başına):** hafta boyunca oynanan bir kayıtla gün sonu
  notları üç profilde farklı, telefonla gün dosyası aynı şeyi anlatıyor.
- **I5 sonucu:** `day06`–`day12` yazıldı (Hesap, Bir Hafta, Rutin, Atış,
  Gece, Koğuş, Hatırlama). Telefon hafızasına bağlı ilk sahneler:
  `para_durumu` (7, havale), `agri_sikayeti` + `atis_sonucu` (10),
  `nobet_gecesi` (11), `komik_olay` + `biriktiren` (12). Doğrulayıcı gün
  sahnelerindeki koşulları da okuyor. Hizalamalar: telefon g10 nöbet saati
  02:00'ye çekildi; koli 16–17. günde (telefonla uyumlu), 11. günde değil;
  `baba_bilgisi` finale, `kanka_takvim` 15. güne taşındı. Geliştirme
  derlemesinde bütün yazılı günler açık (`TAM_SURUM_ACIK = __DEV__`),
  yayın derlemesinde kilit BEDAVA_GUN'de; sanal oyuncu kilidi taklitle açıyor.
- **I5 denge notu (12 günlük ölçüm):** ortalama oyuncu 12. günde %100 TAKDİR
  alıyordu; yazılan seçimler değil (seçim ölçeği denendi, etkisiz) her gün
  tekrar eden pasif kaynaklar belirleyiciydi. Tepsi kalemlerinin kondisyon/
  moral katkısı yarıya, gölgede dinlenme moral 6 → 3, dinç gece +2 → +1,
  TAKDİR eşiği 78 → 80. Sonuç: ortalama oyuncu 5. gün %52 TEMİZ / %48
  İDARE, 10–11. gün %100 TEMİZ, 12. gün %21 TAKDİR; iyi oyuncu TAKDİR'i
  9. günde alıyor. Tarayıcıda 9. gün poligonu oyun akışında oynandı.

#### I11 · yemin töreni oyunu ✅ (D6)
- **Tasarım:** sıra ve ritim: komutla adım, selam, yemin metninin
  satırlarını doğru anda tekrar (daktilo ile gelen metinde boşluk doldurma
  değil, zamanlama). Arka sırada izleyici aile sprite'ları; rehberde kayıtlı
  rollere göre kim geldiği değişir.
- **Kabul:** I10 ile aynı.
- **Sonuç:** `minigames/Yemin.tsx`. Beş satır; kelime kelime okunuyor, düzensiz
  bir sessizlikten sonra "ŞİMDİ": 380 ms içinde tam puan, 1150 ms'de sıfır
  (zorlukla daralıyor). Erken dokunuş "tek başına bağırdın". Tribünde
  rehberdeki ev/sevgili/eş/kardeş kayıtları sivil sprite'la. **Cihazda
  denenecek:** tarayıcı sekmesi arkadayken zamanlayıcılar kısıldığı için
  pencere süreleri web'de ölçülemedi.

#### I8 · gün 28 + karne ✅ (D6)
- **Adımlar:** `day28.ts`: evrak kuyruğu, dolap boşaltma (dolap
  yerleşiminin tersi: teslim listesi), nizamiyeden çıkış yürüyüşü
  (`sivil: true`). Ardından yeni `KarneEkrani`: 28 çentik, gün notları,
  stat ortalamaları, en çok konuşulan kişi, arkadaşlarla yakınlık.
- **Kabul:** 28. gün bitince karne açılıyor, oradan finallere geçiliyor.
- **Sonuç:** `day20`–`day28` üç paralel oturumda yazıldı; süreklilik
  (Tolga'nın kızının takvimi 22'de açılıp 28'de kapanıyor, Emre'nin sofra
  sözü, Serkan'ın defteri) oturumlar arasında mesajla taşındı. `KarneEkrani`
  (hesap `engine/karne.ts`, testli), sevk belgesiyle ortak `ui/Kagit`.
  Gün 28'in "Yat" düğmesi "Karneni al"; menüde terhis olana "Karneyi gör" ve
  "Yeniden sevk ol". Oyuncu testi 28 günü bitirip karneye çıktığını sınıyor.

#### I9 · finalleri akışa bağla ✅ (D6)
- **Adımlar:** `telefon/finaller.ts`'teki `finalKartlari` ve `epilog`
  karne sonrası ekran olarak bağlanır. `IcerikSonuEkrani` artık yalnızca
  geliştirme için kalır (ya da silinir). I12'nin (a) grubu burada
  kullanılır. Oyun bitince menüde "Yeniden sevk ol" ve karne tekrar
  görülebilir.
- **Kabul:** baştan sona 28 günlük bir kayıtla (geliştirme alanından
  atlanarak) final kartları oyuncunun işaretlerine göre farklı çıkıyor.
- **Sonuç:** `FinalEkrani`: nizamiye şeridi, koşulu tutan kartlar sırayla
  (daktilo, "Geç"), ardından epilogun üç satırı. `IcerikSonuEkrani` artık
  yalnızca eksik gün için (geliştirme).

---

### C · Cila

#### C1 · ses + müzik ✅ (D3)
- **Kütüphane:** `expo-audio` (v57'de iOS, Android, web destekli;
  web'de HTTPS ister ve ilk dokunuştan önce çalmaz).
- **Adımlar:**
  1. `src/ses/` : `sesCal('duduk')` gibi tek giriş; oyuncular önceden
     yüklenir, ayarlar ses kapalıysa hiçbir şey yapmaz.
  2. İlk set (8–10 kısa efekt): düdük, adım, tepsi, düğme tıkı, telefon
     çalma, kontör düşme, nöbet devriye, gün sonu damgası. Gece ve avlu
     için iki döngü ambiyans. Kaynak: CC0 kütüphaneler ya da jsfxr ile
     8-bit üretim; lisanslar `assets/ses/LISANS.md`'ye.
  3. Sessiz modda çalma davranışı: iOS'ta sessiz anahtarı efektleri
     susturur (oyun beklentisi bu).
- **Kabul:** web'de ilk dokunuştan sonra ses var, telefonda sessiz modda
  yok, ayarlardan kapatılabiliyor.
- **Sonuç:** `expo-audio`. Sesler `tools/ses-uret.ts` ile sentezleniyor
  (`npm run ses`, tohumlu, 14 WAV, toplam ~540 KB; lisans notu
  `assets/ses/LISANS.md`). Efektler: düğme tıkı, sabah düdüğü, sağ/sol
  adım, tepsi, telefon zili / ankesör kartı, nöbette devriye, atış, mini
  oyun sonucu (başarı/başarısız), gün sonu damgası. Ambiyans: serbest
  zamanda avlu rüzgârı, son yoklamada cırcır böceği (döngü noktası çapraz
  geçişli). Sesler arayüzden tetikleniyor, store saf kalıyor.
  **Plugin varsayılanları kapatıldı:** expo-audio mikrofon izni
  (RECORD_AUDIO / NSMicrophoneUsageDescription) ve arka planda oynatma
  (UIBackgroundModes audio, ön plan servisi) ekliyordu; üçü de kapalı.
  Tarayıcıda: doğru ses doğru olayda çağrılıyor (play() sayacıyla), konsol
  temiz. Kulakla dinleme yapılamadı → Berke telefonda değerlendirecek;
  ses değişikliği üreticide.

#### C2 · ayarlar ekranı ✅ (D3, C1'den sonra)
- **Alanlar:** ses efektleri, ambiyans, titreşim, metin hızı (daktilo),
  hareket azaltma (sistem ayarına ek olarak oyun içi), analitik izni (M5),
  kaydı sil (S3'ün onaylı butonu).
- **Dosyalar:** `screens/AyarlarEkrani.tsx`, `store` içinde `ayarlar`
  dilimi, ayrı AsyncStorage anahtarı (`bedelli.ayarlar.v1`; oyun kaydından
  bağımsız, yeni oyunda silinmez). `ui/haptik.ts` ayara bakar.
- **Kabul:** her ayar uygulama yeniden açılınca korunuyor.
- **Sonuç:** `ayarlar/index.ts` (ayrı zustand deposu, `bedelli.ayarlar.v1`),
  `screens/AyarlarEkrani.tsx` her ekranın üstüne açılan katman (menüden ve
  moladan). Ses efektleri, ortam sesi, titreşim (`haptik.ts` bayrağı),
  hareketi azalt (`useHareketAzalt`: sistem ayarı ya da oyun içi, anında
  yansıyor; Daktilo, GokyuzuGecisi, YolSahnesi, Atis buna geçti, C6'nın bir
  kısmı), metin hızı (yavaş/normal/hızlı/anında), kullanım verisi, onaylı
  kaydı sil. **Kullanım verisi varsayılanı "sorulmadı" = gönderilmiyor**;
  `olayYaz` izin yoksa hiçbir şey yapmıyor (KVKK onay ekranı M5 açacak).
  Tarayıcıda: ayarlar yenilemeden sonra korunuyor, "anında" metni tek
  seferde gösteriyor, konsol temiz.

#### C3 · duraklatma menüsü ✅ (D3)
- Oyun ekranında köşede düğme: devam, ayarlar, ana menü. Mini oyun
  sırasında açılırsa `useGeriSayim` duruyor (S6'daki hook'a `durdur`).
  Android geri tuşu (S7) bunu açar.
- **Sonuç:** başlıkta CEP'in yanında "||" düğmesi → MOLA: Devam, Ayarlar,
  Ana menü. **Sapma:** mini oyun sırasında mola açılmıyor (düğme gizli,
  geri tuşu yok sayılıyor); 11 oyunun zamanlayıcısını durdurulabilir
  yapmak yerine yarım turun kaybolması engellendi. Geri tuşu sırası:
  ayarlar → panel → mola aç/kapat → ana menü/çıkış (9 test). Oyun ekranı
  kapanınca mola sıfırlanıyor. Tarayıcıda mola aç/devam/ana menü çalışıyor.

#### C4 · geçişler + stat animasyonu ✅ (D4)
- Üst düzey ekranlar arası 150 ms karartma (`App.tsx` ekran değişimi).
  `Cetele`'de stat değişince sayı sayma + renk yanıp sönmesi. Mini oyun
  sonunda derece damgası (MÜKEMMEL / TAMAM / ZAYIF). Hepsi hareket azaltma
  açıksa atlanır.

#### C5 · tablet genişliği ✅ (D4, G7 ile)
- Oyun alanı en fazla 480 pt genişlikte ortalanır, kenarlar zemin rengi.
- **Kabul:** iPad simülatöründe dikey düzen bozulmuyor.

#### C6 · erişilebilirlik ✅ (D6)
- `PixelText`'e `maxFontSizeMultiplier` (1.3). Harita, panel ve mini oyun
  dokunma alanlarına `accessibilityLabel` + `accessibilityRole`.
  Hareket azaltma tek bir hook'tan (`useHareketAzalt`) okunur ve değişimi
  dinler; `YolSahnesi.tsx:284`'teki ilk değer hatası bununla düzelir.

#### C7 · mini oyun öğreticileri ✅ (D5)
- Her mini oyunun ilk açılışında tek kartlık "nasıl oynanır" (bir cümle +
  animasyonlu el ikonu). Görülenler kayda yazılır.
- **Sonuç:** kart süre başlamadan çıkıyor (`OgreticiKarti`, metinler
  `minigames/ogretici.ts`). **Sapma:** görülenler oyun kaydına değil
  ayarlara yazılıyor; baştan başlayan oyuncu kartları yeniden görmüyor,
  ayarlardan sıfırlayabiliyor.

---

#### Berke'nin yapacakları (D7'nin kalanı, sırayla)
1. **Apple Developer** (yıllık 99 $) ve **Google Play Console** (tek sefer
   25 $) hesapları; `npx eas login`, `npx eas init` (proje kimliği app.json'a).
2. **Firebase** projesi: Web uygulaması ekle → değerleri `.env.local`'a ve
   `eas env:create` ile EAS'e; Firestore production mode; Authentication →
   Anonymous; `npx firebase deploy --only firestore:rules`.
3. **Sentry** projesi (ücretsiz katman yeter): `npx @sentry/wizard -i
   reactNative`, DSN `EXPO_PUBLIC_SENTRY_DSN`; Claude raporlayıcıyı bağlar.
4. **Gizlilik metni:** `docs/yasal/gizlilik-politikasi.md` köşeli
   parantezleri doldur, hukukçuya göster; yayın adresi (GitHub Pages ya da
   Firebase Hosting) Claude'da.
5. İlk derleme: `npx eas build -p ios --profile development` (ve android);
   cihazda yemin zamanlaması ve S12b denemesi, ekran görüntüleri.

### P · Para + ölçüm

#### M0 · kilit mantığı izole ✅
`src/monetization/entitlements.ts`.

#### M1 · model kararı ❓ (K1)

#### M2 · kilit yeri + kanca ⬜ (D4, K1 + K2'den sonra)
- `BEDAVA_GUN` K2'ye göre. Son ücretsiz günün gün sonu ekranına "yarın"
  kartı: ertesi günün epigrafı + tek cümle teaser. Kilit ekranı metni
  kalan günlerin gerçek olaylarını (§4) sayar. `kilit_gorundu` olayına
  hangi günden geldiği eklenir.

#### M3 · IAP + satın almayı geri yükle ⬜ (D4, Y1'den sonra)
- **Kütüphane:** `react-native-purchases` (RevenueCat). Sunucu tarafı
  makbuz doğrulama ve geri yükleme hazır geliyor; tek seferlik ürün
  (non-consumable `tam_surum`). Expo Go'da çalışmaz, dev build (Y1) şart.
- **Adımlar:**
  1. `entitlements.ts` → `satinAlindi` RevenueCat entitlement'ına bağlanır,
     sonuç yerelde de önbelleklenir (çevrimdışı oyuncu kilitte kalmasın).
  2. `KilitEkrani`: fiyat mağazadan okunur, "Tam sürümü aç" + "Satın
     almayı geri yükle".
  3. Web (yalnızca geliştirme): satın alma yok, `TAM_SURUM_ACIK` geliştirme
     alanından açılır.
  4. Olaylar: `satin_alma_basladi`, `satin_alindi`, `satin_alma_iptal`.
- **Kabul:** sandbox hesabıyla iOS ve Android'de satın al → uygulamayı
  sil, kur → geri yükle → 6. gün açık.

#### M4 · Firebase projesi + kurallar 🔶 (D7, kod hazır; proje Berke'de)
- Anahtarlar `EXPO_PUBLIC_FIREBASE_*` ortam değişkenlerinden
  (`firebaseConfig.ts` okur, `.env.local` repoya girmez, EAS secret).
- `firestore.rules` repoya: `oyuncular/{uid}` yalnız sahibi; `olaylar`
  için `request.resource.data.uid == request.auth.uid`, izin verilen
  `ad` listesi, belge boyutu sınırı. `firebase.json` ile deploy.
- **Kabul:** kurallar Firebase emülatöründe test ediliyor.
- **Sonuç:** `firebaseConfig.ts` `EXPO_PUBLIC_FIREBASE_*` okuyor (`.env.example`).
  `firestore.rules` + `firebase.json` repoda; olay adları `engine/olaylar.ts`,
  test kuraldaki listeyle eşitliği sınıyor. Emülatör testi proje açılınca.

#### M5 · KVKK onayı + gizlilik politikası 🔶 (D7, ekran hazır; metin hukukta)
- İlk açılışta tek ekran: ne toplandığı (anonim kimlik, ilerleme yedeği,
  oyun olayları), "Kabul" / "Yalnızca cihazda oyna". Reddedilirse bulut
  ve olaylar kapalı; ayarlardan değiştirilebilir.
- Gizlilik politikası sayfası (mağazaların istediği herkese açık bir adres:
  Firebase Hosting'de tek statik sayfa ya da GitHub Pages), iOS
  `PrivacyInfo` (app.json `ios.privacyManifests`), Play Data safety formu.
- Metin hukuki kontrolden geçmeli; Claude taslağı hazırlar.
- **Sonuç:** `OnayEkrani` ilk açılışta oyundan önce. **Bulgu:** bulut yedeği
  hiçbir izne bağlı değildi; kayıtta künyedeki ad ve rehberdeki gerçek adlar
  var. Artık `bulutIzni` ile açılıyor, ikisi de kapalıyken anonim oturum da
  açılmıyor; ayarlarda "Buluta yedek" kapatılınca buluttaki kopya siliniyor.
  Metin yurt dışı aktarımı (Firebase) açıkça söylüyor. Taslaklar:
  `docs/yasal/gizlilik-politikasi.md`, `docs/yasal/magaza-veri-beyanlari.md`;
  iOS privacy manifest `app.json`'da.

#### M6 · crash raporlama 🔶 (D7, katman hazır; Sentry hesabı Berke'de)
- `@sentry/react-native` Expo config plugin'iyle. Sessiz `catch`
  bloklarına `raporla(hata)` (Sentry'ye breadcrumb, oyuncuya hiçbir şey).
  Kaynak haritaları EAS build'de yüklenir. M5 onayına bağlı.
- **Sonuç:** `engine/rapor.ts`: `raporla(hata, yer)`; kayıt ve bulut
  catch'leri ile `HataSiniri` bağlı. Kullanım verisi izniyle açılıyor.
  Sentry hesabı açılınca `npx @sentry/wizard -i reactNative`, ardından
  `raporlayiciKur(...)` (Sentry.captureException). Hesap olmadan yerel eklenti
  ve Metro ayarı doğrulanamayacağı için kurulmadı.
---

### Y · Yayın

#### Y1 · eas.json + sürümleme 🔶 (D7, ayar hazır; ilk derleme hesapla)
- Expo varsayılan izinleri daraltılacak (`android.blockedPermissions`):
  READ/WRITE_EXTERNAL_STORAGE, SYSTEM_ALERT_WINDOW kullanılmıyor.
- `eas.json` profilleri: `development` (dev client), `preview` (iç
  dağıtım), `production`. `cli.appVersionSource: remote` ile buildNumber /
  versionCode EAS'te. `expo-dev-client` eklenir.
- `app.json`: üst seviyedeki `splash` anahtarı `expo-splash-screen`
  plugin yapılandırmasına taşınır (v57 dokümanı: üst seviye yöntem eski).
- **Kabul:** `eas build -p ios --profile development` ve Android karşılığı
  başarılı, dev build cihazda açılıyor.
- **Sonuç:** `eas.json` (development/preview/production, sürüm EAS'te),
  `expo-dev-client`, izin engeli, splash eklentide. **Bulgu:** `expo-doctor`
  eksik `expo-asset` (expo-audio'nun istediği; gerçek derlemede çökerdi) ve
  5 yama farkı buldu; düzeltildi, doktor CI'da.

#### Y2 · ikon + splash ✅ (D7)
- Mevcut ikonlar ilk commit'ten, şablon olabilir. Pixel-art ikon (künye
  ya da çentikli takvim), 1024 px, Android adaptive katmanları ve
  monokrom sürüm. Splash: koyu zemin + tek sprite.
- **Sonuç:** `tools/ikon-uret.py` (`npm run ikon`): 32x32 künye + çentik,
  ikon, adaptive ön/arka, tek renk, açılış, favicon aynı kaynaktan.

#### Y3 · mağaza görselleri + metin 🔶 (D7, metin hazır; görüntüler derlemeden)
- iPhone 6.9", iPad 13" ve Android ekran görüntüleri (geliştirme alanından
  sahneler), kısa ve uzun açıklama, anahtar kelimeler, yaş derecelendirme
  anketi. AI yalnızca burada serbest (README kuralı).
- **Sonuç:** `docs/magaza/metinler.md`: ad, alt başlık, açıklamalar, anahtar
  kelimeler, yaş anketi (tütün sık → 12+ / PEGI 12), ekran görüntüsü planı.

#### ~~Y4 · web hosting~~ (kaldırıldı, 24 Eyl: web yayınlanmıyor)

#### Y5 · iç test ⬜ (D6)
- TestFlight + Play internal testing, 5–10 kişi. Bir hafta: Firebase'de
  gün bazlı bırakma grafiği, Sentry'de çökme sayısı. Bulgular yeni kartlar
  olarak bu belgeye.

#### Y6 · mağaza incelemesi ⬜ (D6) · Y7 · yayın ⬜ (D6)

---

## 4. 28 günlük içerik takvimi

Tema sütunu `telefon/gunler/gNN.ts` başlıklarından. Nöbet ve ceza sütunları
I4 ile `gorevTakvimi.ts`'e taşınacak yeni takvim (bugünkü formülden farklı:
ilk nöbet 10. gün, tema günlerinde görev yok).

| Gün | Tema (telefon) | Günün olayı | Yeni mekanik | Nöbet | Ceza | Durum |
|---|---|---|---|---|---|---|
| 1 | Teslim | Sevk, künye, koğuş, bölge turu | — | | | ✅ |
| 2 | Yabancılık | İlk içtima, alıştırma | — | | | ✅ |
| 3 | Düzen | Yatak, ilk azar, silah sökme | — | | | ✅ |
| 4 | İsimler | Denetim | — | | | ✅ |
| 5 | Ritim → Ders | ANT-41 nezaket dersi | — | | | ✅ (g05 metni I4) |
| 6 | Hesap | Para ve kontör bitiyor, kantin borcu | — | | ✓ | ✅ |
| 7 | Bir hafta | İlk eşik; pazar düzeni, çamaşır, posta | havale (para_durumu) | | | ✅ |
| 8 | Rutin | Zilden önce uyanmak (kısa gün) | — | | | ✅ |
| 9 | Atış | İlk atış | **I10 atış** | | | ✅ |
| 10 | Gece | İlk nöbet | — | ✓ | | ✅ |
| 11 | Koğuş | Kaybolan bot | arama sahnesi (anlatı + seçim) | | | ✅ |
| 12 | Hatırlama | Callback günü, koğuşta hikâyeler | — | | | ✅ |
| 13 | Ölçüm | Kondisyon ölçümü, koşu | — | ✓ | | ✅ |
| 14 | Yarısı | İkinci eşik | — | | ✓ | ✅ |
| 15 | Sayım | Rutin (kısa gün) | — | | | ✅ |
| 16 | Yorgunluk | Ayak yarası, revir dalı | revir: kötü oyuncuya toparlanma | ✓ | | ✅ |
| 17 | Koli | Anneden koli | koli içeriği puana göre | | | ✅ |
| 18 | On gün | Üçüncü eşik | — | | ✓ | ✅ |
| 19 | Tek hane | Rutin (kısa gün) | — | ✓ | | ✅ |
| 20 | Söz | Uzun callback kapanıyor | — | | | ✅ |
| 21 | Yedi gün | Kanka itirafı; yemin provası | — | | | ✅ |
| 22 | Sessizlik | Kanka aramıyor | — | ✓ | | ✅ |
| 23 | Özür | — | — | | | ✅ |
| 24 | Evrak | Terhis işlemleri başlıyor | evrak kuyruğu | | | ✅ |
| 25 | Son serbest | Son uzun serbest zaman | — | ✓ | | ✅ |
| 26 | İki gün | Genel prova (tören kıyafetiyle), silah teslimi, teslim listesi | — | | | ✅ |
| 27 | Son gece | Koğuşta son gece | — | | | ✅ |
| 28 | Yemin | Dolap boşaltma, yemin töreni (K5), aileler, evrak ve künye, sivil, nizamiye, karne | **I11 yemin**, **I8 karne**, I9 finaller | | | ✅ |

---

## 5. Karar ve bulgu günlüğü

| Tarih | Kayıt |
|---|---|
| 2026-09-24 | Berke: yemin töreni son gün olmalı (gerçekte törenden sonra aileyle çıkılıyor); yemin 26 → 28, K5 güncellendi. 26 genel prova günü oldu; 28'de sıra: dolap, tören, aileler, evrak ve künye, sivil, veda, nizamiye. 20–27'deki gün sayısı atıfları düzeltildi. |
| 2026-09-24 | D7'nin kod tarafı bitti ve main'e birleşti: EAS ayarı, Firebase kuralları, KVKK onayı (bulut yedeği artık izne bağlı), hata raporlama katmanı, piksel ikon, mağaza metinleri. Kalanlar hesap ve hukuk: Firebase + Sentry + Apple/Play hesapları (K6), gizlilik metninin kontrolü, ilk derleme, ekran görüntüleri, cihazda S12b. |
| 2026-09-24 | D6 bitti ve main'e birleşti: gün 20–28 (I7, I8), yemin oyunu (I11), karne ve finaller akışta (I8, I9), erişilebilirlik (C6). Oyun baştan sona 28 gün oynanabilir. Denge: en az +1 kazanç garantisi 80 → 75 (son hafta ortalama oyuncu her gün TAKDİR alıyordu). S12b D7'ye, cihaz testiyle. |
| 2026-09-24 | D5 bitti ve main'e birleşti: gün 13–19 (I6) ve mini oyun öğreticileri (C7). Yazılı gün 19/28. Sıradaki: D6 gün 20–28, yemin, karne, finaller. |
| 2026-09-24 | D4 bitti ve main'e birleşti: G1 büyük sahne + diyalog kutusu (Berke onayladı), G2 nizamiye menüsü, G3 sevk belgesi, G4 alışveriş listesi, G5 tepsi, G6 avlu, G7 okunabilirlik + 480 genişlik (C5), G8 geçiş/sayaç/damga (C4). Sıradaki: D5 gün 13–19. |
| 2026-09-24 | Berke: ücretlendirme en sona; önce görsel tasarım (oyun "form gibi" görünüyor), sonra gün 13–28. Dalgalar yeniden sıralandı (D4 görsel dil … D8 ücretlendirme). |
| 2026-09-24 | D3 bitti ve main'e birleşti: gün 6–12, sentezlenmiş sesler, ayarlar, mola. |
| 2026-09-24 | I5: gün 6–12 yazıldı; 12 günlük denge ayarı (tepsi, dinlenme, gece, TAKDİR 80). |
| 2026-09-24 | D2 bitti ve main'e birleşti. Ek: denge ayarı (S13), hafıza koşullu sahneler (I13), yol sahnesi Skia çökmesi. S12'nin riskli kalanı S12b olarak D5'e. |
| 2026-09-24 | Berke işi devretti (commit/push serbest). K3 → 05:30 uygulandı. |
| 2026-09-24 | D1 kod olarak bitti. Ek bulunan hatalar: nöbet cezası puana hiç yansımıyordu (S6), yarım görüşme kartı "Devam et"te siliniyordu (S5). Cihaz testleri: S1/S2 Firebase projesiyle (M4), S7 Android'de. |
| 2026-09-24 | Web yayın hedefi değil (Berke): Y4 ve K4 kaldırıldı, web geliştirme önizlemesi olarak kalıyor. |
| 2026-09-24 | İlk inceleme: 3 kritik veri hatası (S1–S3), içerik 5/28, telefon 28/28. Plan yazıldı. |
