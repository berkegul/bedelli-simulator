"""
Uygulama ikonu, Android adaptive katmanları, açılış ve favicon (Y2).

32x32 piksel ızgarada çizilip tam sayı katıyla büyütülüyor: oyunun piksel
dili ikonda da aynı. Konu künye ve üstüne kazınmış çentikler: oyunun iki
simgesi, sevk belgesi ve duvardaki 28 gün.

    python3 tools/ikon-uret.py      # assets/ altına yazar
"""
from PIL import Image

N = 32
ZEMIN = (36, 34, 26)        # C.bg ailesi, koyu haki
ZEMIN_AC = (46, 43, 31)
PIRINC = (201, 165, 72)
PIRINC_AC = (232, 206, 128)
PIRINC_KOYU = (122, 96, 38)
KENAR = (22, 20, 14)
ZINCIR = (150, 146, 128)
ZINCIR_KOYU = (92, 89, 76)
CENTIK = (58, 46, 20)
PAS = (178, 80, 52)


def bos():
    return [[None] * N for _ in range(N)]


def kunye(g, renkli=True):
    """Künye: 22x14, köşeleri kırık, solda delik, üstünde çentikler."""
    x0, y0, w, h = 3, 12, 26, 16
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            kose = (x in (x0, x0 + w - 1)) and (y in (y0, y0 + h - 1))
            if kose:
                continue
            kenar = x in (x0, x0 + w - 1) or y in (y0, y0 + h - 1) or (
                (x in (x0 + 1, x0 + w - 2)) and (y in (y0, y0 + h - 1)))
            if kenar:
                g[y][x] = KENAR
            elif not renkli:
                g[y][x] = (255, 255, 255)
            elif y == y0 + 1 or x == x0 + 1:
                g[y][x] = PIRINC_AC
            elif y == y0 + h - 2 or x == x0 + w - 2:
                g[y][x] = PIRINC_KOYU
            else:
                g[y][x] = PIRINC
    # Delik (zincirin geçtiği)
    for dy in (0, 1):
        for dx in (0, 1):
            g[y0 + 2 + dy][x0 + 2 + dx] = None if not renkli else ZEMIN
    # Delik kenarı
    if renkli:
        g[y0 + 4][x0 + 2] = PIRINC_KOYU
        g[y0 + 4][x0 + 3] = PIRINC_KOYU
    # Çentikler: dört dik, bir çapraz (beşli sayım). İki piksel kalınlık:
    # küçük ikonda da okunsun.
    iz = CENTIK if renkli else None
    for i in range(4):
        cx = x0 + 8 + i * 4
        for y in range(y0 + 3, y0 + 13):
            g[y][cx] = iz
            g[y][cx + 1] = iz
    for k in range(17):
        x = x0 + 6 + k
        y = y0 + 12 - (k * 9) // 16
        g[y][x] = PAS if renkli else None
        g[y - 1][x] = PAS if renkli else None


def zincir(g, renkli=True):
    """Delikten sol üste giden boncuk zincir."""
    # Delikten (5,15) yukarı çıkıp sağa, çerçevenin dışına kıvrılıyor.
    noktalar = [(5, 13), (5, 11), (5, 9), (6, 7), (7, 5), (9, 4), (11, 3), (13, 2), (15, 2), (17, 1), (19, 1)]
    for x, y in noktalar:
        g[y][x] = ZINCIR if renkli else (255, 255, 255)
        if renkli and y + 1 < N and g[y + 1][x] in (None, ZEMIN):
            g[y + 1][x] = ZINCIR_KOYU


def zemin(g):
    for y in range(N):
        for x in range(N):
            if g[y][x] is None:
                g[y][x] = ZEMIN


def resim(g, olcek, kenar_bosluk=0, arka=None):
    boyut = N * olcek + 2 * kenar_bosluk
    im = Image.new('RGBA', (boyut, boyut), arka or (0, 0, 0, 0))
    px = im.load()
    for y in range(N):
        for x in range(N):
            c = g[y][x]
            if c is None:
                continue
            for yy in range(olcek):
                for xx in range(olcek):
                    px[kenar_bosluk + x * olcek + xx, kenar_bosluk + y * olcek + yy] = (*c, 255)
    return im


def main():
    # iOS / genel ikon: tam dolu kare
    g = bos()
    kunye(g)
    zincir(g)
    zemin(g)
    resim(g, 32).save('assets/icon.png')

    # Android adaptive: ön plan güvenli alanda (1024'ün ortadaki ~%60'ı)
    on = bos()
    kunye(on)
    zincir(on)
    ic = resim(on, 20)  # 640 px
    tuval = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    tuval.paste(ic, (192, 192), ic)
    tuval.save('assets/android-icon-foreground.png')

    arka = Image.new('RGBA', (1024, 1024), (*ZEMIN_AC, 255))
    arka.save('assets/android-icon-background.png')

    mono = bos()
    kunye(mono, renkli=False)
    zincir(mono, renkli=False)
    ic = resim(mono, 20)
    tuval = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    tuval.paste(ic, (192, 192), ic)
    tuval.save('assets/android-icon-monochrome.png')

    # Açılış: saydam zeminde künye (arka plan rengi app.json'da)
    resim(on, 16).save('assets/splash-icon.png')

    # Favicon (web önizleme)
    resim(g, 2).save('assets/favicon.png')


if __name__ == '__main__':
    main()
