import type { Day } from '../engine/types';

/**
 * Sevk günü. Otobüs öğleden önce varıyor, gün eğitimle değil yerleşmeyle
 * geçiyor: teslim, künye, koğuş, bölge tanıtımı. Asıl düzen yarın başlıyor.
 */
export const gun01: Day = {
  day: 1,
  title: 'Sevk Günü',
  epigraph: 'Sivil hayatın son birkaç saati.',
  blocks: [
    {
      id: 'd1-nizamiye',
      from: '11:00',
      to: '12:00',
      title: 'Nizamiye',
      sprite: 'kisla',
      scenes: [
        {
          kind: 'anlati',
          id: 'd1-n1',
          sprite: 'kisla',
          text: 'Otobüs nizamiyenin önünde durdu. Saat on bir. Kapıda "DİSİPLİN GÜCÜN KAYNAĞIDIR" yazan bir tabela var. Yanındaki adam telefonunu son kez kontrol ediyor.',
        },
        {
          kind: 'anlati',
          id: 'd1-n2',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'TELEFONLAR KUTUYA! Sivil eşyalar torbaya! Beyler, 28 gün sonra hepsini geri alacaksınız. Kaybolan olursa benden bilmeyin.',
          choices: [
            {
              id: 'telefon-ver',
              label: 'Telefonu uzat, sesini çıkarma',
              effect: { disiplin: 5, moral: -4 },
              outcome: 'Telefonu kutuya bıraktın. Ekran kapanırken içinde tuhaf bir boşluk oluştu.',
            },
            {
              id: 'telefon-son',
              label: 'Son bir mesaj atmaya çalış',
              effect: { disiplin: -6, moral: 6 },
              outcome: 'Çavuş görmezden geldi ama not aldığı belli. "Geldim" yazıp gönderdin. Değdi mi? Değdi.',
            },
            {
              id: 'telefon-kamerasiz',
              label: 'Kamerasız telefonunu göster, "bu kalabilir mi?"',
              effect: { disiplin: 3, moral: 5 },
              gerekliEsya: 'kamerasizTelefon',
              outcome:
                'Çavuş telefonu eline aldı, çevirdi, kamera aradı. "Bu kalır." Çarşıda doğru şeyi almışsın.',
            },
          ],
        },
        {
          kind: 'anlati',
          id: 'd1-n3',
          sprite: 'kunye',
          text: 'Sıraya girdin. Künyeni, üniformanı, iki çift postalını aldın. Artık bir numaran var. Adın hâlâ duruyor ama bugünden sonra daha az kullanılacak.',
        },
      ],
    },
    {
      id: 'd1-ogle',
      from: '12:00',
      to: '13:30',
      title: 'İlk Yemek',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd1-o1',
          sprite: 'tepsi',
          text: 'Yemekhane. Tepsi, sıra, kaşık şıngırtısı. Yanına oturan adam elini uzattı: "Emre. Müteahhitim. Yani sivilde. Burada neysem oyum artık."',
          choices: [
            {
              id: 'd1-emre-tanis',
              label: 'Sen de kendini tanıt',
              effect: { moral: 8, dostluk: { kim: 'emre', puan: 10 } },
              outcome: 'Emre güldü. "Bu 28 gün senin için biraz daha kolay geçecek." Koğuşta bir tanıdığın oldu.',
            },
            {
              id: 'd1-emre-sessiz',
              label: 'Başını salla, yemeğine dön',
              effect: { moral: -3, disiplin: 2 },
              outcome: 'Emre omuz silkti ve başka birine döndü. İlk gün herkes bir şeye tutunuyor, sen tutunmadın.',
            },
          ],
        },
      ],
    },
    {
      id: 'd1-kogus',
      from: '13:30',
      to: '15:00',
      title: 'Koğuş Yerleşimi',
      sprite: 'ranzaDaginik',
      scenes: [
        {
          kind: 'anlati',
          id: 'd1-y1',
          sprite: 'ranzaDaginik',
          speaker: 'Onbaşı Recep',
          text: 'Bu koğuş yirmi sekiz kişilik. Ranzanız, dolabınız, askınız numaralı. Bugün yerleşeceksiniz, yarın sabah 05:30’da bu koğuş bambaşka görünecek.',
        },
        {
          kind: 'anlati',
          id: 'd1-y2',
          sprite: 'postal',
          text: 'Ranzanı buldun. Alt kat. Dolabın dar ve derin. Çarşıda ne aldıysan buraya sığacak, almadıklarını da yirmi sekiz gün boyunca arayacaksın.',
          choices: [
            {
              id: 'd1-yerlesim-duzenli',
              label: 'Dolabı baştan düzenli yerleştir',
              effect: { disiplin: 8, enerji: -6 },
              outcome: 'Yarın sabahki telaşta bunu kendine teşekkür edeceksin.',
            },
            {
              id: 'd1-yerlesim-hizli',
              label: 'Çabuk tık, sonra bakarsın',
              effect: { disiplin: -4, enerji: 4, moral: 3 },
              outcome: 'Torbayı dolaba boşalttın. Yarın sabah bu dolabı açmak istemeyeceksin.',
            },
          ],
        },
      ],
    },
    {
      id: 'd1-tanitim',
      from: '15:00',
      to: '17:00',
      title: 'Bölge Tanıtımı',
      sprite: 'kisla',
      scenes: [
        {
          kind: 'anlati',
          id: 'd1-t1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Şimdi bölgeyi gezdireceğim. Bir daha anlatmayacağım, kaybolan kendi başının çaresine bakar. Sorusu olan şimdi sorsun.',
        },
        {
          kind: 'tanitim',
          id: 'd1-t2',
          brief: 'Onbaşı önde, bölük arkada. Gezilecek yerlere sırayla dokun.',
        },
        {
          kind: 'anlati',
          id: 'd1-t3',
          text: 'Tur bitti. Kışla haritası kafanda oturmaya başladı: koğuş, yemekhane, kantin, revir, içtima alanı, nizamiye. Yirmi sekiz gün bu altı yerin arasında geçecek.',
        },
      ],
    },
    {
      id: 'd1-aksam-ictima',
      from: '17:00',
      to: '18:00',
      title: 'İlk İçtima',
      sprite: 'asker',
      scenes: [
        {
          kind: 'anlati',
          id: 'd1-ai1',
          sprite: 'cavus',
          speaker: 'Çavuş Kaya',
          text: 'İlk içtimanız. Hizayı öğreneceksiniz. Omuz omza, göz öne, ses yok. Bugün öğretiyorum, yarın soruyorum.',
        },
        {
          kind: 'mini',
          id: 'd1-ai2',
          game: 'ictima',
          sprite: 'asker',
          brief: 'İlk deneme. Komut geldiği anda dokun; bugün ceza yok, alışma günü.',
          reward: (s) => ({ disiplin: Math.round(-2 + s * 10), enerji: -3 }),
          verdict: (s) =>
            s > 0.8
              ? 'İlk seferde tutturdun. Çavuş kaşını kaldırdı.'
              : s > 0.4
                ? 'Yarım saniye geç. Bugün sorun değil, yarın olacak.'
                : 'Hizadan çıktın. Çavuş "yarın böyle olmayacak" dedi ve geçti.',
        },
      ],
    },
    {
      id: 'd1-aksam-yemek',
      from: '18:00',
      to: '19:00',
      title: 'Akşam Yemeği',
      sprite: 'tepsi',
      scenes: [
        {
          kind: 'anlati',
          id: 'd1-ay1',
          sprite: 'tepsi',
          text: 'İkinci kez aynı yemekhane, aynı sıra. Karşına bu sefer sessiz biri oturdu ve adını söylemedi. Sonradan öğreneceksin: Tolga.',
        },
      ],
    },
    {
      id: 'd1-serbest',
      from: '19:00',
      to: '21:00',
      title: 'İlk Akşam',
      sprite: 'kunye',
      scenes: [
        {
          kind: 'anlati',
          id: 'd1-s1',
          text: 'İlk akşamın. Kantin açık, ankesörün önünde kuyruk var, koğuşta herkes birbirini tanımaya çalışıyor.',
        },
      ],
    },
    {
      id: 'd1-son-yoklama',
      from: '21:00',
      to: '22:00',
      title: 'Son Yoklama',
      sprite: 'ay',
      scenes: [
        {
          kind: 'anlati',
          id: 'd1-sy1',
          sprite: 'cavus',
          speaker: 'Onbaşı Recep',
          text: 'Ranza başı! Mevcut sayılacak. Yarın sabah 05:30 kalkış. Bugün misafirdiniz, yarından itibaren askersiniz.',
        },
        {
          kind: 'anlati',
          id: 'd1-sy2',
          sprite: 'ay',
          text: 'Ranzana uzandın. Tavan çok yakın. Bu sabah evdeydin, şimdi 28 günün 1’i bitti. Yirmi yedi tane daha var.',
        },
      ],
    },
  ],
};
