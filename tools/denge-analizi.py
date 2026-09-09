#!/usr/bin/env python3
"""Denge analizi: içerik dosyalarındaki seçim etkilerini ve mini oyun
ödüllerini okuyup üç oyuncu profilini gün gün simüle eder.

    python3 tools/denge-analizi.py

Amaç, yeni gün yazdıktan sonra şunları görmek: istatistikler tavana/tabana
yapışıyor mu, iyi ve kötü oyun farklı notlar alıyor mu, 28 güne yayılacak
ilerleme payı kalıyor mu. src/engine/stats.ts içindeki formülleri yansıtır —
orayı değiştirirsen burayı da güncelle.
"""
import re, glob, os

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAT = ['kondisyon', 'disiplin', 'moral', 'enerji', 'tokluk']
BASLA = {'kondisyon': 50, 'disiplin': 50, 'moral': 65, 'enerji': 80, 'tokluk': 70}
DIRENCLI = {'kondisyon': True, 'disiplin': True, 'moral': True, 'enerji': False, 'tokluk': False}
BLOK_SAYISI = 12          # bir günün zaman dilimi sayısı
BLOK_BASINA_ACLIK = 8
ESIK = [(78, 'TAKDİR ALDI'), (64, 'TEMİZ İŞ'), (50, 'İDARE EDER'), (36, 'GAZ YEDİ'), (0, 'CEZALI')]

clamp = lambda n: max(0, min(100, round(n)))

def kazanc(mevcut, degisim, direncli):
    if not direncli:
        return degisim
    if degisim > 0:
        o = degisim * (1 - mevcut / 100) ** 0.85
        return o if mevcut >= 92 else max(1, o)
    d = -degisim * (mevcut / 100) ** 0.35
    return -d if mevcut <= 8 else -max(1, d)

def uygula(s, etki):
    for k, v in etki.items():
        if k in s:
            s[k] = clamp(s[k] + kazanc(s[k], v, DIRENCLI[k]))

def gun_ici_aclik(s):
    """Blok geçişlerinde biriken açlık ve aç geçen saatlerin cezası."""
    for _ in range(BLOK_SAYISI):
        s['tokluk'] = clamp(s['tokluk'] - BLOK_BASINA_ACLIK)
        if s['tokluk'] <= 20:
            s['kondisyon'] = clamp(s['kondisyon'] - 1)
            s['moral'] = clamp(s['moral'] - 1)


def uykudan_sonra(s):
    aclik = 0.25 if s['tokluk'] < 30 else 0.1 if s['tokluk'] < 50 else 0
    s['tokluk'] = clamp(s['tokluk'] - 18)
    kalite = max(0.35, 0.6 + (s['moral'] / 100) * 0.4 - aclik)
    yipranma = -7 if s['enerji'] < 20 else -3 if s['enerji'] < 40 else 4 if s['enerji'] > 65 else 1
    s['enerji'] = clamp(s['enerji'] + 70 * kalite)
    s['kondisyon'] = clamp(s['kondisyon'] + yipranma)

def gun_oku(yol):
    src = open(yol).read()
    gruplar = []
    for blok in re.findall(r'choices:\s*\[(.*?)\n\s{10}\],', src, re.S):
        secenekler = [{k: int(v) for k, v in re.findall(r'(\w+):\s*(-?\d+)', eff)}
                      for eff in re.findall(r'effect:\s*\{([^}]*)\}', blok)]
        if secenekler:
            gruplar.append(secenekler)
    mini = []
    for r in re.findall(r'reward:\s*\(s\)\s*=>\s*\(\{(.*?)\}\),', src, re.S):
        alt, ust = {}, {}
        for k, ifade in re.findall(r'(\w+):\s*([^,\n]+)', r):
            ifade = ifade.strip()
            m = re.match(r'Math\.round\((-?\d+)\s*\+\s*s\s*\*\s*(\d+)\)', ifade)
            if m:
                alt[k], ust[k] = int(m.group(1)), int(m.group(1)) + int(m.group(2))
            elif re.fullmatch(r'-?\d+', ifade):
                alt[k] = ust[k] = int(ifade)
        if alt:
            mini.append((alt, ust))
    return gruplar, mini

def puanla(secenek):
    return sum(secenek.get(k, 0) for k in ['kondisyon', 'disiplin', 'moral'])

PROFIL = {
    'en iyi': lambda g: max(g, key=puanla),
    'ortalama': lambda g: sorted(g, key=puanla)[len(g) // 2],
    'en kötü': lambda g: min(g, key=puanla),
}

gunler = sorted(glob.glob(os.path.join(KOK, 'src/content/day*.ts')))
for ad, sec in PROFIL.items():
    s = dict(BASLA)
    # Çarşıdan ne aldığı da profilin parçası: iyi oynayan tam donanımlı gelir.
    dolap = {'en iyi': {'kondisyon': 11, 'disiplin': 14, 'moral': 7},
             'ortalama': {'kondisyon': 2, 'disiplin': 3, 'moral': 1},
             'en kötü': {'kondisyon': -9, 'disiplin': -9, 'moral': -6, 'para': -14}}[ad]
    print(f"\n=== {ad.upper()} OYNAYAN ===")
    for yol in gunler:
        gruplar, mini = gun_oku(yol)
        uygula(s, dolap)
        for g in gruplar:
            uygula(s, sec(g))
        for alt, ust in mini:
            uygula(s, ust if ad == 'en iyi' else alt if ad == 'en kötü'
                   else {k: round((alt[k] + ust[k]) / 2) for k in alt})
        # Üç öğün: iyi oynayan tabağı bitirir, kötü oynayan yarısını bırakır.
        ogun_payi = {'en iyi': 46, 'ortalama': 34, 'en kötü': 16}[ad]
        gun_ici_aclik(s)
        uygula(s, {'tokluk': ogun_payi * 3})
        ort = round((s['kondisyon'] + s['disiplin'] + s['moral']) / 3)
        notu = next(a for e, a in ESIK if ort >= e)
        uyari = [k for k in STAT if DIRENCLI[k] and s[k] in (0, 100)]
        print(f"  {os.path.basename(yol):9} " +
              ' '.join(f"{k[:4]}={s[k]:3}" for k in STAT) +
              f"  ort={ort:3} {notu:12}" + (f" ⚠ uçta: {uyari}" if uyari else ""))
        uykudan_sonra(s)
