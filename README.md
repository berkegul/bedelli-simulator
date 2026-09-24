# Bedelli Simülatör

28 günlük bedelli askerlik temel eğitimini gün gün, saat dilimi saat dilimi
oynatan pixel-art mobil oyun. Expo (React Native), TypeScript.

Şu an **1–5. günler oynanabilir**. Motor 28 güne hazır: kalan günler içerik
dosyası yazılarak eklenir, kod değişmez.

Oyun kışlaya girmeden başlıyor: künye (ad, sigara içiyor musun, arayacağın
kişiler) → çarşıdan hazırlık alışverişi → 28 gün.

### Gün yapısı

| Gün | İçerik |
|-----|--------|
| 1 | **Sevk günü.** Otobüs 11:00'de nizamiyede. Teslim, künye, koğuş yerleşimi, bölge turu. Eğitim yok. |
| 2–3 | **Alıştırma.** Düzen oturuyor; bölük işi, ceza ve nöbet yok. |
| 4 | Denetim. Görev rotasyonu başlıyor. |
| 5 | **ANT-41 nezaket dersi.** Sahaya çıkılmıyor, sınıfta geçiyor. |
| 6+ | Yazılacak. Takvim: `docs/plans/yayin-plani.md` §4. İlk nöbet 10. gece. |

Sevk günü bilerek gündüz başlıyor — asker kışlaya gece varmaz. İlk üç günün
alıştırma olması da `gunlukGorevler()` içinde gün numarasına bağlı.

### ANT-41

Askerî nezaket ve protokol kuralları, yedi bölüm ve 41 madde
(`src/content/ant41.ts`). 5. günde sınıfta işleniyor.

**Sınavı yok** — bu ekran öğretir, sorgulamaz. Oyuncu bölümleri istediği
sırada açıp okur, baskı yoktur. Ders bittikten sonra kâğıt dolapta kalır;
serbest zamanda dolabı açıp istediği an tekrar bakabilir.

Maddeler oyunun içine de sızıyor: 5. günün uygulama sahnesinde "Tamam
komutanım" demek disiplin kaybettiriyor, "Arz ederim" kazandırıyor.

## Çalıştırma

```bash
npm install
npx expo start          # QR kodu Expo Go ile okut
npx expo start --ios    # iOS simülatörü
npx expo start --web    # tarayıcı (hızlı bakış için)
```

**Windows'ta kuruyorsan** adım adım anlatım için [KURULUM.md](KURULUM.md).

## Kontroller

```bash
npm run typecheck        # uygulama + testler/araçlar
npm run lint
npm test                 # motor ve içerik yapısı (node:test + tsx)
npm run telefon:dogrula
npm run sprite
```

Hepsi `.github/workflows/kontrol.yml` içinde her push'ta koşuyor. Yayına
giden iş listesi: `docs/plans/yayin-plani.md`.

## Oyun nasıl kurulu

Bir **gün**, kullanıcının verdiği gerçek programa karşılık gelen **zaman
bloklarından** oluşur (05:30 kalkış, 06:00 içtima, ...). Her blok bir veya
daha fazla **sahne** içerir. İki tür sahne var:

- `anlati` — metin, opsiyonel konuşan kişi, opsiyonel seçenekler.
  Her seçeneğin istatistik etkisi ve bir sonuç cümlesi var.
- `mini` — mini oyun. 0–1 arası puan döner; `reward` onu etkiye,
  `verdict` sonuç cümlesine çevirir.

Beş istatistik gün boyunca oynar: **Kondisyon, Disiplin, Moral, Enerji,
Tokluk**. Tokluğun bir **ideal bandı** var (`TOKLUK_BANT`, 55–88): altında
açlık kondisyon ve morali sızdırır, üstünde tıka basa dolu mideyle eğitime
çıkmak fazladan enerji yakar. Tepsi ekranı bunu gizlemez — bir sonraki öğüne
kaç saat dilimi olduğunu, o süre boyunca ne kadar yakacağını ve seçtiğin
kalemlerle oraya kaç tokluğla varacağını doğrudan yazar. "Ne kadar yemeliyim"
sorusunun cevabı ekranda duruyor. Gün sonunda ilk üçünün ortalaması askerî sicil diliyle bir nota
dönüşür: `TAKDİR ALDI` → `CEZALI`. Enerji ve tokluk not hesabına girmez;
ikisi de gün içinde tükenen kaynak.

İki sahne türü daha var ve bunlar içerik dosyasına yazılmaz — blok kimliğinden
tanınıp `src/content/index.ts` içinde otomatik eklenir:

- **Tepsi** (`-kahvalti`, `-ogle`, `-aksam-yemek` ile biten bloklar): haftalık
  menüden o günün öğünü çıkar, oyuncu her kalemi tek tek seçer. Zeytini bırak,
  peyniri ye.
- **Serbest zaman** (`-serbest` ile biten bloklar): kışla avlusunun küçük
  haritası açılır: koğuş dolabı, kantin, ankesör, oturma alanı ve **cep**.
  Arkadaşların bir kısmı avluda ayakta, bir kısmı oturma alanında bankta —
  kimin nerede olduğu günden türetilir (`oturmaAlanindakiler`).

  **Oturma alanı**: ağacın altındaki bank. Girince orada oturanları görürsün;
  oturup dinlenebilir (günde bir kez), konuşabilir ya da sigara yakabilirsin.

  **Cep**: telefon ve sigara avluda bir yerde değil, üstünde. Dolap koğuşta
  kalır, cep seninle gelir.

### Telefon

Kendi kamerasız telefonun varsa **kontör gerekmiyor** — hat sende, cepten
ararsın. Kontör (ankesör kartı) yalnızca telefonu olmayanın işine yarıyor:
avludaki ankesöre gidip kart yakarsın, kırk dakika kuyruk ve parası var.
Çarşıda telefon almamanın 28 günlük bedeli burada çıkıyor.

Konuşmanın kendisi kiminle konuştuğuna göre değişiyor. Rehbere kişi
eklerken bir **yakınlık türü** seçiliyor (ebeveyn, sevgili, eş, kardeş,
arkadaş) ve `src/content/telefon.ts` her tür için ayrı diyalog havuzu
tutuyor:

- **Ebeveyn** yemek ve üşüme sorar, baban telefonda rahat değildir
- **Sevgili** özler, aramadığın gün kırılır
- **Eş** evden haber verir, çocuk kapıya bakar
- **Kardeş** dalga geçer
- **Arkadaş** "lan" der

Her konuşmada 2–3 cevap seçeneği var ve seçtiğin cevap morali değiştiriyor;
aynı konuşma üst üste çıkmıyor. Açılış cümlesinde oyuncunun adı geçiyor.
- **Tanıtım** (yalnızca sevk günü): bölge turu. Koğuş, yemekhane, kantin,
  revir, içtima alanı ve nizamiye haritada gezilir, her biri ne işe yaradığını
  anlatır. Hepsi gezilmeden tur bitmez.
- **Ders**: ANT-41 gibi bilgi ekranları. Bölüm bölüm okunur, sorusu yoktur.
- **Yol** (içtima, eğitim, talim, akşam içtiması bloklarının başında):
  iki blok arası yürüyüş. Asker ekranın ortasında sabit, manzara sola kayar;
  her dokunuş bir adım. Gökyüzü bloğun saatine göre renk alır, hedef mekan
  yürüdükçe sağdan yaklaşıp ortada belirir. Hızlı dokunan hızlı varır.

### Işık ve mekan

`src/ui/Gokyuzu.tsx` günün saatinden gökyüzünü türetiyor: gece (yıldızlı),
şafak, sabah, öğle, ikindi, akşam. Renkler bilerek soluk ve kirli — oyunun
haki paletine parlak bir mavi hiç oturmuyordu, bu yüzden gökyüzü de kumaş
boyası gibi duruyor. Yumuşak degrade yok, yatay bant var.

`GokyuzuGecisi` gün açılışında güneşi ufuktan doğuruyor, gün kapanışında
batırıp yerini yıldızlara bırakıyor. Hareket azaltma açıksa animasyon
atlanıp doğrudan bitiş durumu gösteriliyor.

`src/ui/MekanSeridi.tsx` her bloğun geçtiği yerin kesitini çiziyor:
yemekhane, içtima alanı, koğuş, eğitim sahası, talim alanı, avlu, nizamiye.
Sahneler tek parça resim değil — **katmanlı kompozisyon**: arkada soluk
öğeler (dolap sırası, pencere, tepsi bandı, sıradaki bölük), önde net
öğeler (ranzalar, masalar, askerler, çavuş). Böylece derinlik var ama
sahne dinamik kalıyor: hangi arkadaşın nerede durduğu koddan geliyor.

İç mekanlarda gökyüzü yerine duvar ve süpürgelik var.

Yeni mekan eklemek: `MEKANLAR` sözlüğüne blok kimliğiyle bir giriş yaz,
öğeleri yüzde konumla diz, arka plandakilere `arka: true` ver.

### Günlük görevler

Aynı düzen 28 gün tekrar etmesin diye günlere dağıtılmış görevler var.
Hangi gün ne olduğu `src/content/gorevTakvimi.ts` içinde, telefonun gün
temalarıyla hizalı; bir gün dosyası `gorevler` alanıyla kendi gününü
değiştirebilir:

- **Mıntıka**: 2. günden itibaren her sabah avlu temizliği (`izmarit`).
- **Akşam içtimasında ceza şınavı** (`ceza`): 6, 14 ve 18. günler.
- **Gece nöbeti** (`nobet`): liste 4. gün asılır, ilk nöbet 10. gece;
  sonra 13, 16, 19, 22 ve 25. geceler. Uyanıklık çubuğu sürekli düşer,
  dokunarak ayakta tutarsın. Arada devriye geçer — o an ayağa kalkmazsan
  ceza yazılır. İki iş aynı anda: uykuyla ve devriyeyle uğraşmak.

### Ekonomi

Tek bütçe: oyun 2800 TL ile başlar, çarşıda harcadığın kantinde kalmaz.
Hazırlık malzemeleri üç kalitede satılıyor (`src/content/esyalar.ts`) ve
kalite 28 gün boyunca her sabah fark ettiriyor — `gunlukEsyaEtkisi()` dolaptaki
her kalemi tarayıp o günün açılış etkisini üretir. Eksik gittiğin kalemin
`yokluk` cezası da aynı yerden gelir.

### Sigara

Künyede "içiyorum" diyen oyuncuda her blokta nikotin krizi birikir; 55'in
üstünde moral ve disiplin sızdırmaya başlar. Kriz göstergesi alt şeritte
`CANIN ÇEKTİ → ÇOK İSTİYOR → KRİZDE` diye ilerler.

Sigara **pakette satılır, dal dal harcanır**: bir alışveriş 20 dal ekler
(`birimAdet` alanı). Kantinden alınır, avluda içilir.

**Sigara içmek tek adım değil.** Bitince elinde izmarit kalır ve onu ne
yapacağın ayrı bir karar:

- **Yere at**: hızlı, ama **%15 ihtimalle devriyeye yakalanırsın**. Yakalanınca
  izmariti toplar ve bölüğün önünde *yerden özür dilersin* — dört adımlık bir
  ceza sahnesi, disiplin −9 ve moral −12.
- **Cebe koy**: güvenli. Ama izmaritler cepte birikir; sonra çöpe atman gerekir
  (attığında disiplin ve moral geri gelir).

Asıl mesele paylaşmak. Emre ve Serkan içer, Tolga içmez. Avluda içen bir
arkadaşa gittiğinde — cebinde dal varsa ve o gün senden istememişse —
bir dal isteyebilir. Verirsen yakınlık ciddi artar, vermezsen düşer; aynı
kişi aynı gün ikinci kez istemez.

Bu yüzden sigara **içmeyen oyuncuya da satılıyor**: koğuşta dal dağıtmak
dostluğun en hızlı yolu ve bilinçli bir strateji.

### Arkadaşlar

Emre, Tolga ve Serkan'ın ayrı yakınlık puanları var. Serbest zamanda koğuş
muhabbeti bir diyalog havuzundan rastgele seçer; aynı diyalog iki kez çıkmaz
ve bazıları belirli bir yakınlığın altında hiç açılmaz
(`src/content/arkadaslar.ts`).

## Dosya haritası

```
src/
  theme/         palet, tipografi ölçeği, 4px grid
  art/           sprite tanımları (karakter haritası) + kayıt
  ui/            PixelSprite, PixelText, PixelPanel, PixelButton,
                 StatBar, CentikTakvim, Daktilo, haptik
  engine/        tipler, istatistik mantığı, kayıt (AsyncStorage),
                 turkce.ts (isim ekleri: Serkan'a, Emre'ye, Tolga'ya)
  content/       day01.ts … — oyunun tüm metni burada
                 esyalar.ts (katalog), menu.ts (haftalık yemek),
                 arkadaslar.ts (diyalog havuzu)
  minigames/     dört mini oyun + kayıt
  screens/       menü, künye, çarşı, gün başı, oyun, gün sonu, kilit,
                 KislaHaritasi (avlu), Paneller (kantin/dolap/rehber/muhabbet)
  store/         zustand: tüm oyun akışı
  monetization/  kilit mantığı — model seçilince değişecek TEK dosya
  firebaseConfig.ts  bulut ayarları (boşken oyun tamamen cihazda çalışır)
tools/
  sprite-onizle.ts   sprite doğrulayıcı ve terminal önizleyici (npm run sprite)
  oyuncu.ts          sanal oyuncu: gerçek store'u bir oyuncu gibi sürer
  denge.ts           denge raporu (npm run denge)
```

## Yeni gün ekleme

1. `src/content/day04.ts` oluştur, `day01.ts`'i şablon al.
2. `src/content/index.ts` içindeki `GUNLER` dizisine ekle.

Hepsi bu. Çentik takvimi, ilerleme, kayıt ve gün sonu notu kendiliğinden
çalışır. Etki değerleri için ölçek: küçük tercih ±3, normal ±6, günü
belirleyen tercih ±12. Enerji gün içinde tükenir, uykuda dolar.

Yazdıktan sonra dengeyi ölç:

```bash
npm run denge
```

En iyi, ortalama ve en kötü oynayanı gün gün simüle eder, ardından 200
rastgele ortalama oyuncunun gün sonu not dağılımını basar. Simülasyon
oyunun gerçek store'unu sürüyor: rutin, denetim, dolap, tepsi, nöbet ve
ceza dahil oyunda ne varsa hesaba giriyor, formül kopyası yok. Aranan tablo:
üç profil farklı notlar alıyor, hiçbir istatistik 0 veya 100'e yapışmıyor,
28 güne yayılacak ilerleme payı kalıyor. Bir istatistik uca çakılıyorsa
`⚠ uçta` uyarısı basar.

Not: istatistikler tavana yaklaştıkça kazanç azalır (`kazanc()` içinde),
kayıp da tabana yaklaşırken hafifçe yavaşlar — ama kaybetmek kazanmaktan
kolay kalır. Uçlarda (92 üstü, 8 altı) "en az 1 puan" garantisi kalkıyor;
yoksa günde +1 birikip beşinci günde tavan görülüyordu.

Analizdeki "en kötü oynayan" profili her seçimde en kötüyü seçen, her mini
oyunda sıfır alan, hiç yemeyen ve hiç hazırlık yapmayan bir oyuncu — dibe
vurması tasarım gereği, gerçek bir oyuncunun yörüngesi değil.

Aynı sanal oyuncu `npm test` içinde de koşuyor: her profil yazılı bütün
günleri baştan sona bitirebilmeli. Yeni günde ilerlemeyen bir sahne varsa
test kırılır.

## Yeni sprite çizme

`src/art/sprites.ts` içinde sprite'lar okunabilir karakter haritası olarak
durur; `PixelSprite` bunu SVG'ye derler ve yatay ardışık aynı renkleri tek
dikdörtgende birleştirir.

```ts
export const KUPA: SpriteDef = {
  palette: P,          // '.' saydam, 'k' koyu hat, 'm' pirinç, ...
  rows: ['.kkkk.', 'kmmmmk', 'kmmmmk', '.kkkk.'],
};
```

Çizdikten sonra doğrula — satır uzunlukları eşit mi, palette olmayan
karakter var mı:

```bash
npm run sprite                        # sorunlar ve özet
npm run sprite -- --goster KUPA       # adında KUPA geçenleri terminale çiz
```

Araç `sprites.ts`'i doğrudan içe aktardığı için yardımcı fonksiyonlarla
türetilen sprite'lar (sivil kareler, giyinme kareleri) da doğrulanır.

## Mini oyun ekleme

`src/minigames/` altına `{ onBitti(score: 0..1), zorluk?: 0..1 }` alan bir
bileşen yaz, `minigames/index.tsx` içindeki `HARITA` ve `MINI_BASLIK`'a
kaydet, `engine/types.ts` içindeki `MiniGameId` birleşimine ekle.

Zamanlamalı oyunlarda konumu animasyondan değil `Date.now()`'dan oku —
dokunma anıyla ekrandaki kare arasında kayma olmasın.

Mevcut oyunlar: `yatak` (hiza tutturma), `ictima` (reaksiyon), `yurumek`
(ritim), `silah` (sıralama), `nobet` (dayanma + tepki), `izmarit` (hızlı
toplama), `ceza` (tempolu tekrar).

## Türkçe metin yazarken

Oyuncunun ve arkadaşların adları cümlelerin içine giriyor. Ek getirirken
`src/engine/turkce.ts` içindeki `yonelme()` ve `belirtme()` yardımcılarını
kullan — elle `'ye` yazmak "Serkan'ye" gibi hatalar üretiyor.

## Firebase

Oyun varsayılan olarak **tamamen cihazda** çalışır. `src/firebaseConfig.ts`
boş olduğu sürece bulut kodu hiç yüklenmez.

Anahtarları girdiğinde iki şey açılır:

1. **Bulut yedeği** — her kayıt önce cihaza yazılır, buluta arka planda
   gönderilir. Cihazda kayıt yoksa buluttan geri yüklenir; telefon değiştiren
   oyuncu ilerlemesini kaybetmez. Ağ yoksa oyun aynen çalışmaya devam eder.
2. **Ölçüm** — `gun_bitti`, `kilit_gorundu`, `carsi_bitti` olayları
   `olaylar` koleksiyonuna yazılır. Satış kararının dayanağı bu olacak:
   oyuncular hangi günde bırakıyor, kilit ekranına kaç kişi geliyor.

Kurulum adımları ve gereken Firestore güvenlik kuralı `firebaseConfig.ts`
dosyasının başında yazılı.

## Para kazanma modeli

Henüz seçilmedi. Tüm kilit mantığı `src/monetization/entitlements.ts`
içinde; oyun kodu kilit bilmiyor. Bugün ilk 3 gün açık, sonrası
`KilitEkrani`'na düşüyor.

- **Ücretsiz + kilit açma:** `TAM_SURUM_ACIK` yerine IAP durumunu bağla,
  `KilitEkrani`'ndaki butonu satın alma çağrısına çevir.
- **Peşin ücretli:** `TAM_SURUM_ACIK = true` — kilit ekranı devre dışı kalır.
- **Reklamlı:** `BEDAVA_GUN = 28` yap, reklam kancasını buraya ekle.

## Görsel üretim hakkında

Oyun içindeki her görsel pixel: `src/art/sprites.ts` içinde karakter
haritası olarak duruyor, tek bir palet kullanıyor ve tam sayı ölçeklerde
çiziliyor. **Oyun içine AI ile üretilmiş raster görsel konmuyor** — palete
ve piksel gridine oturmadığı, ölçeklenince bulanıklaştığı ve kompozisyonu
dinamik tutmayı imkânsız kıldığı için. Sahne zenginliği katman ekleyerek
sağlanıyor, çözünürlük artırarak değil.

AI'nın yeri mağaza tarafı: uygulama ikonu, App Store / Play Store ekran
görselleri, tanıtım grafikleri. Orada oyun içi tutarlılık kaygısı yok.

## Tasarım notları

- Palet askerî malzemeden türetildi: üniforma kumaşı hakisi, kaput bezi
  beji, pirinç düğme sarısı. Saf siyah ve saf beyaz bilerek yok.
- İki yazı tipi: **Jersey 10** (sert bitmap — komut, saat, sayaç) ve
  **Pixelify Sans** (okunabilir — anlatı). Silkscreen denendi ve elendi:
  `Ğ ğ İ ı Ş ş` glyph'leri yok, "İÇTİMA" bozuk çıkıyordu.
- Yuvarlatma yok, her ölçü 4px gridine oturuyor.
- İmza görsel: 28 kutuluk **çentik takvimi** — askerin duvara gün çentiği
  atması. Bitirilen günün üstü, o günün notunun rengiyle çizilir.
