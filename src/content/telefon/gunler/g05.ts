import type { Gorusme } from '../tipler';

/**
 * GÜN 5 — RİTİM. Sabah ANT-41 dersi, öğleden sonra talim; ilk gerçek yorgunluk.
 * Bugünün asıl işi `cikis_plani` ve `ilk_gorecek` işaretlerini koymak:
 * ikisi de 20. ve 22. günlerde geri dönüyor. Aynı soruyu iki karakter
 * kendi ağzıyla soruyor, cevaplar ayrı saklanıyor.
 */
export const GUN_05: Gorusme[] = [
  {
    id: 'g05-anne',
    kayit: 'ev',
    rol: 'anne',
    tur: 'omurga',
    gunler: [5],
    kok: 'a',
    kapanis: 'Kısa bir konuşmaydı. İkiniz de yorgundunuz.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Sesin bitik. Hasta mısın sen?"',
        secenekler: [
          {
            id: 'yorgun',
            label: '"Hasta değilim, yorgunum. Sabah ders, öğleden sonra talim."',
            cevap: '"Ders mi? Askerde ders mi olur?" "Olurmuş anne." "Ne dersi?" "Nezaket." Uzun bir sessizlik.',
            etki: { iliski: 4, moral: 2 },
            sonraki: 'b',
          },
          {
            id: 'iyiyim',
            label: '"İyiyim anne."',
            cevap: '"Değilsin. Ben senin sesinden anlarım." Anlıyor gerçekten.',
            etki: { iliski: 2, gerilim: 4 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin: '"Bugün erken yat. Duydun mu? Erken yat."',
        secenekler: [
          {
            id: 'yatarim',
            label: '"Yatarım. Zaten saat onda ışıklar sönüyor."',
            cevap: '"Onda mı? İyi be." Bunu duymak onu nedense rahatlattı.',
            etki: { iliski: 4, enerji: 2 },
          },
          {
            id: 'nobet',
            label: '"Yarın nöbetim var. Gece kalkacağım."',
            cevap: '"Gece mi? Tek başına mı?" Yeni bir endişe konusu buldu.',
            etki: { iliski: 3, moral: -1 },
            isaret: { ad: 'nobet_haberi', deger: 'verdi' },
          },
        ],
      },
    },
  },

  {
    id: 'g05-sevgili',
    kayit: 'sevgili',
    rol: 'sevgili',
    tur: 'omurga',
    gunler: [5],
    oncelik: 120,
    kok: 'a',
    kapanis: 'Kapattın. Söylediğin şey kulağında kaldı.',
    ankesorKapanis: '"Kapatmam lazım." "Dur, cevap ver ama." Cevabını verdin, sonra kapattın.',
    replikler: {
      a: {
        id: 'a',
        metin: '"Bugün beş gün oldu. Farkında mısın? Beş."',
        secenekler: [
          {
            id: 'saydim',
            label: '"Farkındayım. Ben de sayıyorum."',
            cevap: '"İyi. Yalnız saymıyormuşum demek." Rahatladı.',
            etki: { iliski: 5, moral: 4 },
            sonraki: 'b',
          },
          {
            id: 'saymadim',
            label: '"Saymıyorum. Sayınca uzuyor."',
            cevap: '"Ben sayıyorum. Senin yerine de sayarım." Bunu bir görev gibi söyledi.',
            etki: { iliski: 6, moral: 5 },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Bir şey soracağım ve ciddi cevap vermeni istiyorum. Çıkınca ilk kimi göreceksin?"',
        secenekler: [
          {
            id: 'seni',
            label: '"Seni. Başka bir cevabı yok bunun."',
            cevap:
              '"Bak söz verdin." Sesinde bir gülümseme var ama not aldı. Gerçekten not aldı.',
            etki: { iliski: 10, moral: 8 },
            isaret: { ad: 'ilk_gorecek', deger: 'sevgili' },
            sonraki: 'c',
          },
          {
            id: 'aile',
            label: '"Önce eve uğrarım herhalde. Annem beni kapıda bekler."',
            cevap: '"Tabii, tabii." Kısa durdu. "Doğru olan da o zaten." İnandırıcı değildi.',
            etki: { iliski: 2, gerilim: 6 },
            isaret: { ad: 'ilk_gorecek', deger: 'aile' },
            sonraki: 'c',
          },
          {
            id: 'uyku',
            label: '"Kimseyi. İki gün uyuyacağım önce."',
            cevap: '"UYKU MU?" Güldü. "Tamam, uyandığında ilk beni gör o zaman."',
            etki: { iliski: 4, moral: 6 },
            isaret: { ad: 'ilk_gorecek', deger: 'uyku' },
            sonraki: 'c',
          },
          {
            id: 'bilmiyorum',
            label: '"Bilmiyorum. O kadar uzak geliyor ki düşünemiyorum."',
            cevap: '"Uzak değil." Kendini de ikna ediyor. "Yakın. Çok yakın."',
            etki: { iliski: 3, moral: -2, ozlem: 6 },
            isaret: { ad: 'ilk_gorecek', deger: 'bilmiyorum' },
            sonraki: 'c',
          },
        ],
      },
      c: {
        id: 'c',
        metin: '"Peki nerede? Nerede görüşeceğiz, onu da söyle."',
        secenekler: [
          {
            id: 'eski',
            label: '"O eski yerde. Nerede olduğunu biliyorsun."',
            cevap: '"Biliyorum." Sesi çok yumuşadı. "Tamam. Orada olacağım."',
            etki: { iliski: 8, moral: 7 },
            isaret: { ad: 'bulusma_yeri', deger: 'eski' },
          },
          {
            id: 'kapida',
            label: '"Kışlanın kapısına gel. Direkt oradan."',
            cevap: '"Kapıya mı geleyim?" Bunu hiç düşünmemişti. "Gelirim."',
            etki: { iliski: 9, moral: 8 },
            isaret: { ad: 'bulusma_yeri', deger: 'kapi' },
          },
          {
            id: 'sonra',
            label: '"Onu sonra konuşuruz, daha çok var."',
            cevap: '"Var." Kısa cevap verdi. Konuyu kapattı.',
            etki: { iliski: 1, gerilim: 5 },
            isaret: { ad: 'bulusma_yeri', deger: 'belirsiz' },
          },
        ],
      },
    },
  },

  {
    id: 'g05-kanka',
    kayit: 'kanka',
    rol: 'kanka',
    tur: 'omurga',
    gunler: [5],
    oncelik: 120,
    kok: 'a',
    kapanis: '"Hadi, plan hazır. Sen sadece çık." Kapattı.',
    ankesorKapanis: '"Kapatıyorum lan." "Dur, cevabını duymadım — neyse, yazdım bir yere."',
    replikler: {
      a: {
        id: 'a',
        metin: '"Eee, çıkınca ilk ne yapacaksın lan? Plan var mı? Ben plan yapıyorum burada."',
        secenekler: [
          {
            id: 'uyku',
            label: '"Uyuyacağım. İki gün kimse beni aramasın."',
            cevap: '"Uyku mu?" Hayal kırıklığına uğradı. "Tamam, iki gün veriyorum. Sonra benimsin."',
            etki: { iliski: 4, moral: 5 },
            isaret: { ad: 'cikis_plani', deger: 'uyku' },
            sonraki: 'b',
          },
          {
            id: 'size',
            label: '"Doğru size gelirim. Ne varsa oradayım."',
            cevap: '"HA ŞÖYLE!" Bağırdı. "Tamam, ben ayarlarım her şeyi."',
            etki: { iliski: 9, moral: 8 },
            isaret: { ad: 'cikis_plani', deger: 'kanka' },
            sonraki: 'b',
          },
          {
            id: 'yemek',
            label: '"Doğru düzgün bir şey yiyeceğim. Bir tane."',
            cevap: '"Nereye gidelim? Söyle, şimdiden rezervasyon yapayım." Yapmayacak ama sevindi.',
            etki: { iliski: 7, moral: 7 },
            isaret: { ad: 'cikis_plani', deger: 'yemek' },
            sonraki: 'b',
          },
          {
            id: 'dusunmuyorum',
            label: '"Onu düşünmüyorum bile şu an."',
            cevap:
              '"Niye düşünmüyorsun?" Bir sessizlik. "Düşün lan. Düşünecek başka neyin var ki orada?"',
            etki: { iliski: 2, moral: -2 },
            isaret: { ad: 'cikis_plani', deger: 'yok' },
            sonraki: 'b',
          },
        ],
      },
      b: {
        id: 'b',
        metin:
          '"Ben de bir şey ayarlıyorum. Çıktığın gün için. Söylemeyeceğim, sürpriz olsun."',
        secenekler: [
          {
            id: 'soyle',
            label: '"Söyle lan. Merak ettim şimdi."',
            cevap: '"Söylemem." Söyleyecek. "Tamam söylerim ama yirmi yedinci günde."',
            etki: { iliski: 5, moral: 6 },
            isaret: { ad: 'kanka_surpriz', deger: 'var' },
          },
          {
            id: 'abartma',
            label: '"Abartma ya. Gelip beni alman yeter."',
            cevap: '"Alırım zaten. O ayrı." Sürprizden vazgeçmedi.',
            etki: { iliski: 6, moral: 5 },
            isaret: { ad: 'kanka_surpriz', deger: 'var' },
          },
        ],
      },
    },
  },
];
