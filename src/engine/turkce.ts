const KALIN = 'aıou';
const INCE = 'eiöü';

/**
 * Yönelme hâli eki: Serkan'a, Emre'ye, Tolga'ya.
 * Oyuncu kendi adını ve arkadaş adlarını her cümlede görüyor; "Serkan'ye"
 * gibi bir ek hatası metnin bütün ciddiyetini götürüyor.
 */
export function yonelme(ad: string) {
  const kucuk = ad.toLocaleLowerCase('tr-TR');
  const sonUnlu = [...kucuk].reverse().find((h) => KALIN.includes(h) || INCE.includes(h));
  const kalinMi = sonUnlu ? KALIN.includes(sonUnlu) : true;
  const sonHarf = kucuk[kucuk.length - 1] ?? '';
  const unluyleBitiyor = KALIN.includes(sonHarf) || INCE.includes(sonHarf);
  const ek = unluyleBitiyor ? (kalinMi ? 'ya' : 'ye') : kalinMi ? 'a' : 'e';
  return `${ad}'${ek}`;
}

/** Belirtme hâli eki: Serkan'ı, Emre'yi, Tolga'yı. */
export function belirtme(ad: string) {
  const kucuk = ad.toLocaleLowerCase('tr-TR');
  const sonUnlu = [...kucuk].reverse().find((h) => KALIN.includes(h) || INCE.includes(h)) ?? 'a';
  const sonHarf = kucuk[kucuk.length - 1] ?? '';
  const unluyleBitiyor = KALIN.includes(sonHarf) || INCE.includes(sonHarf);
  const dar = { a: 'ı', ı: 'ı', o: 'u', u: 'u', e: 'i', i: 'i', ö: 'ü', ü: 'ü' }[sonUnlu] ?? 'ı';
  return `${ad}'${unluyleBitiyor ? 'y' : ''}${dar}`;
}
