# Bedelli Simülatör · Gizlilik Politikası (TASLAK)

> **Taslak.** Yayından önce hukuki kontrolden geçmeli (yayin-plani.md · M5).
> Köşeli parantezli alanlar Berke tarafından doldurulacak. Yayınlandığı
> herkese açık adres mağaza kayıtlarına ve oyunun ayarlar ekranına girecek.

Son güncelleme: [tarih]

## Veri sorumlusu

[Ad Soyad / şirket unvanı], [adres], [e-posta]. 6698 sayılı Kişisel
Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusudur.

## Hangi veriler işleniyor

Oyun hesap açtırmaz ve internetsiz oynanabilir. İlk açılışta sorulan
onaya göre:

| Veri | Ne zaman | Neden | Nerede |
|---|---|---|---|
| Cihaza özgü rastgele kimlik (anonim oturum) | Yedek ya da kullanım verisi açıksa | Kaydı ve olayları cihaza bağlamak | Google Firebase Authentication |
| İlerleme kaydı: oyundaki gün, istatistikler, envanter; künyeye yazılan ad ve rehbere eklenen kişi adları | "Buluta yedek" açıksa | Telefon değişince oyunun geri yüklenmesi | Google Cloud Firestore |
| Oyun olayları: hangi gün bitti, not, çarşıda kalan para, sigara seçimi, kilit ekranının görülmesi | "Kullanım verisi" açıksa | Oyunun dengelenmesi, hangi günde bırakıldığının ölçülmesi | Google Cloud Firestore |
| Çökme raporları (hata türü, cihaz modeli, işletim sistemi sürümü) | "Kullanım verisi" açıksa | Hataların düzeltilmesi | Sentry |

Konum, rehber, kamera, mikrofon, reklam kimliği **kullanılmaz**. Oyundaki
"rehber" telefonun rehberi değildir; oyuncunun kendi yazdığı adlardır.
Oyuncu bu alanlara gerçek ad yazmak zorunda değildir.

## Hukuki sebep ve yurt dışına aktarım

Veriler oyuncunun açık rızasıyla işlenir (KVKK m. 5/1). Firebase (Google)
ve Sentry sunucuları yurt dışındadır; veriler yurt dışına aktarılır
(KVKK m. 9). Rıza ilk açılıştaki ekranda alınır ve ayarlardan her an geri
alınabilir.

## Saklama süresi

İlerleme yedeği, oyuncu "Buluta yedek" ayarını kapatana ya da oyun
içinden kaydı silene kadar saklanır; kapatınca buluttaki kopya silinir.
Oyun olayları [süre, ör. 24 ay] sonra silinir.

## Paylaşım

Veriler satılmaz, reklam için kullanılmaz, yukarıdaki hizmet
sağlayıcılar (Google Firebase, Sentry) dışında kimseyle paylaşılmaz.

## Haklarınız

KVKK m. 11 kapsamındaki haklarınız (bilgi talep etme, düzeltme, silme,
itiraz) için [e-posta] adresine yazabilirsiniz. Ayarlar ekranındaki
"Buluta yedek" ve "Kullanım verisi" anahtarları ile "Kaydı sil" düğmesi
bu hakların çoğunu oyun içinden kullanmanızı sağlar.

## Çocuklar

Oyun 13 yaş altına yönelik değildir. [Mağaza yaş derecelendirmesi]

## Değişiklikler

Bu metin değişirse oyun içinde duyurulur.
