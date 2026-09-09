#!/usr/bin/env python3
"""Sprite doğrulayıcı: satır uzunluklarını ve palet kapsamını kontrol eder,
her sprite'ı terminale basar. Yeni sprite çizdikten sonra çalıştır:

    python3 tools/sprite-onizle.py
"""
import re
import os
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = open(os.path.join(KOK, 'src/art/sprites.ts')).read()

# TS'teki P paletini ve her sprite'ın kendi palette override'ını gerçekten oku
pal_body = SRC.split('} as Record<string, string>;')[0].split('const P = {')[1]
BASE = set(re.findall(r"^\s*'?([A-Za-z.])'?:", pal_body, re.M))

blocks = re.findall(r'export const (\w+): SpriteDef = \{\n(.*?)\n\};', SRC, re.S)
bad = []
for name, body in blocks:
    head, rowspart = body.split('rows:')
    extra = set(re.findall(r"(\w+):\s*C\.", head))          # { ...P, h: C.rust }
    known = BASE | extra
    rows = re.findall(r"'([^']*)'", rowspart)
    lens = {len(r) for r in rows}
    unknown = sorted({c for r in rows for c in r if c not in known})
    status = []
    if len(lens) != 1: status.append(f"HIZASIZ {sorted(lens)}"); bad.append(name)
    if unknown:       status.append(f"PALETTE YOK: {unknown}"); bad.append(name)
    print(f"\n== {name}  {max(lens)}x{len(rows)}  {' | '.join(status) or 'ok'}")
    for i, r in enumerate(rows):
        mark = '<<' if len(r) != max(lens) else ''
        print('   ' + r.replace('.', ' ') + mark)
print(f"\n{'-'*30}\n{len(blocks)} sprite, sorunlu: {sorted(set(bad)) or 'yok'}")
