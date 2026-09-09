/**
 * ANT-41 — Askerî nezaket, hitap ve protokol kuralları.
 * Oyunda sınav yok: bu ekran öğretir, sorgulamaz. Oyuncu istediği zaman
 * dönüp bakabilsin diye maddeler başlık başlık ayrıldı.
 */
export type AntBolum = {
  id: string;
  baslik: string;
  /** Bölümün ne işe yaradığını bir cümlede söyleyen giriş. */
  giris: string;
  maddeler: string[];
};

export const ANT41: AntBolum[] = [
  {
    id: 'hitap',
    baslik: 'Hitap ve yanıt',
    giris: 'Kim ne der, karşılığı nedir. Askerî dilin en çok kullanılan kısmı.',
    maddeler: [
      'Üst "Teşekkür Eder" der; ast "Sağ Ol" der.',
      'Üst "Rica Eder" dediğinde ast "İstirham Eder" der.',
      'Üst "Rica Ederim" der; ast "Arz Ederim" der.',
      'Üst "Günaydın, Merhaba, Nasılsınız" der; ast "Sağ Ol" diye karşılık verir. Ast önce selam vermez.',
      'Ast sözünü "Arz Ederim" diyerek bitirir; "Bitti" demez.',
      'Emir alındığında ast "Emredersiniz" der; "Tamam" demez.',
      'Askerî personel kendini rütbe ve ismiyle tanıtır; örneğin "Üsteğmen Erdoğan".',
      'Askerî personel birbirine "Ağabey" veya "Hocam" diye hitap etmez.',
    ],
  },
  {
    id: 'selamlama',
    baslik: 'Selamlama ve karşılama',
    giris: 'Nerede, ne zaman selam verilir; kapıdan nasıl girilir.',
    maddeler: [
      'Selamlama her zaman ve her yerde içten sevgi ve saygıyla yapılır.',
      'Yemekhane ve kantin gibi ortak alanlara girip çıkarken selamlama yapılır.',
      'El sıkışmalarda personel arasında göz teması sağlanır.',
      'Ast, amirin odasına girmeden önce kapıyı çalar; "Gel" sesini duyduktan sonra kısa bir beklemenin ardından girer.',
      'Ast, amirin odasına her girişte ve çıkışta selam verir.',
      'Üst odaya girdiğinde astlar ayağa kalkar; "Otur" denilmeden oturulmaz.',
      'Rütbeli üstler geldiğinde veya ayrıldığında, kıdemli personel "Dikkat" komutunu verir.',
    ],
  },
  {
    id: 'davranis',
    baslik: 'Üst yanında davranış',
    giris: 'Amirin karşısında duruş, mesafe, söz alma.',
    maddeler: [
      'Ast, amirin masasının üç adım gerisinde durur.',
      'Ast, konuşma sırasında amirin masasına yaslanmaz.',
      'Üst "Otur" demeden ast oturmaz; amirin yanında bacak bacak üstüne atmaz.',
      'Rütbece üst olan kişi odaya girdiğinde ayağa kalkılır; rütbece alt kişinin girişinde ayağa kalkılmaz.',
      'Ast, aksi emredilmediği sürece hazır ol vaziyetinde durur.',
      'Kıdemli bir subay varken üste söz almadan önce o subaydan izin istenir.',
      'Ast, üstün solunda yürür; birden fazla ast ise kıdem sırasına göre sol ve sağ taraflarda yer alır.',
      'Üstler konuşurken astlar dikkatle dinler; sözünü kesmez, başka işle ilgilenmez; yalnızca izinle konuşur; bir anda tek kişi konuşur.',
      'Komutan ve üstlerin yanında el, kol ve vücut hareketleri asgari düzeyde tutulur.',
      'Üstün yanından ayrılmak için izin istenir.',
    ],
  },
  {
    id: 'iletisim',
    baslik: 'Toplantı ve iletişim',
    giris: 'Görüşme, telefon ve emir akışının kuralları.',
    maddeler: [
      'Astlar, diğer amirlerin önünde azarlanmaz; emirler yalnızca izinle verilir.',
      'Komutanlarla yapılan görüşmelere her zaman defter ve kalemle gidilir; not tutulur.',
      'Astlar görüşlerini askerî disiplin çerçevesinde ifade eder; komutan karar verdiğinde ast "Emredersiniz" der ve kararı tam destek vererek uygular.',
      'Üst telefona cevap verdiğinde ast odayı terk eder.',
      'Telefon görüşmesinde üst kapatmadan önce kapatılmaz; üst telefonda bekletilmez.',
      'Ast, aynı bina içinde üstünü telefonla aramaz; yanına gider.',
    ],
  },
  {
    id: 'kisla',
    baslik: 'Kışla ve günlük hayat',
    giris: 'Bildirim yükümlülükleri, sofra ve randevu adabı.',
    maddeler: [
      'Personel; izin, kurs veya sevk öncesinde ve sonrasında birinci ve ikinci komutanlarına bilgi verir.',
      'Nişan, evlilik, doğum, ölüm, kaza gibi önemli olaylar zamanında komutanlara ve ilgili üstlere bildirilir.',
      'Üstler genel olarak alkışlanmaz; önemli konferanslarda siviller de varsa kıdemliler alkışlamaya başladığında astlar takip eder.',
      'Randevulara makul süre öncesinde gelinir; çok erken gelmek de uygunsuz sayılır.',
      'Ast, üst yemeğe başlamadan yemeğe başlamaz.',
      'Komutanlar masayı terk etmeden masadan kalkılmaz; acil durumlarda izin istenir.',
    ],
  },
  {
    id: 'kiyafet',
    baslik: 'Kıyafet ve kamuya açık alanlar',
    giris: 'Üniformayla ve sivil kıyafetle dışarıda nasıl davranılır.',
    maddeler: [
      'Askerî personel sokakta sigara içmez, sakız çiğnemez, yüksek sesle konuşmaz, laubali hareket etmez.',
      'Üniforma ile uygunsuz paket veya çanta taşınmaz.',
      'Sivil kıyafetle de askerî nezaket ve terbiye kurallarına uyulur; kurallar sivil kıyafete uyarlanarak uygulanır.',
    ],
  },
  {
    id: 'ilke',
    baslik: 'Genel ilke',
    giris: 'Bütün maddelerin arkasındaki tek cümle.',
    maddeler: [
      'Her faaliyette takım ruhu esas alınır; "Ben Değil, Biz" prensibiyle hareket edilir.',
    ],
  },
];

export const TOPLAM_MADDE = ANT41.reduce((t, b) => t + b.maddeler.length, 0);

export const bolumBul = (id: string) => ANT41.find((b) => b.id === id);
