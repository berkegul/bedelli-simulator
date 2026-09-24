/**
 * Palet, askerî malzemeden türetildi: üniforma kumaşı hakisi, kaput bezi beji,
 * pirinç düğme sarısı. Saf siyah / saf beyaz bilerek yok — her şey boyalı bez
 * ve eskimiş metal tonunda.
 */
export const C = {
  // Zemin katmanları (koyudan açığa)
  ink: '#16150E',       // en dip — gölge, dış kenarlık
  bg: '#24221A',        // ana zemin, üniforma kumaşı
  surface: '#32301F',   // panel
  surfaceHi: '#413C28', // basılı/seçili yüzey
  line: '#5D5539',      // kenarlık

  // Metin
  canvas: '#E6DCC0',    // kaput bezi beji — ana metin
  // Kontrast (#24221A zemin): ana 11.6, ikincil 6.6, soluk 4.8. Soluk eskiden
  // #6E664E'ydi (2.8:1) ve küçük metinde telefonda okunmuyordu.
  canvasDim: '#B3A889', // ikincil metin
  canvasFaint: '#968C70',

  // Anlam renkleri
  olive: '#8FA05A',     // asker yeşili — kondisyon, olumlu
  brass: '#D9A521',     // pirinç — disiplin, rütbe, vurgu, seçili
  tea: '#C97B3A',       // kantin çayı — moral
  steel: '#6E8290',     // metal — enerji, uyku, gece
  ekmek: '#B08D57',     // ekmek kabuğu — tokluk
  rust: '#A8442E',      // pas — ceza, uyarı, kayıp

  // Yardımcılar
  shadow: '#0F0E09',
} as const;

export const STAT_COLOR = {
  kondisyon: C.olive,
  disiplin: C.brass,
  moral: C.tea,
  enerji: C.steel,
  tokluk: C.ekmek,
} as const;
