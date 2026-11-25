"""국립국어원 「한국어 학습용 어휘 목록」 파일 → data-src/wordlist.tsv

사용법: 내려받은 파일(엑셀 .xlsx / 텍스트 .txt / .csv)을 data-src/ 폴더에 넣고
  python3 scripts/prepare_wordlist.py
출력: data-src/wordlist.tsv  (id, word, pos, grade)
"""
import csv
import glob
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'data-src')
OUT = os.path.join(SRC, 'wordlist.tsv')


def read_xlsx(path):
    """엑셀 파일을 외부 라이브러리 없이 읽기 (첫 번째 시트)"""
    ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    with zipfile.ZipFile(path) as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', ns):
                shared.append(''.join(t.text or '' for t in si.iter('{%s}t' % ns['m'])))
        sheet = sorted(n for n in z.namelist() if n.startswith('xl/worksheets/sheet'))[0]
        rows = []
        for r in ET.fromstring(z.read(sheet)).iter('{%s}row' % ns['m']):
            row = []
            for c in r.findall('m:c', ns):
                col = re.sub(r'\d', '', c.get('r'))
                idx = sum((ord(ch) - 64) * 26 ** i for i, ch in enumerate(reversed(col))) - 1
                while len(row) < idx:
                    row.append('')
                v = c.findtext('m:v', '', ns)
                if c.get('t') == 's':
                    v = shared[int(v)]
                elif c.get('t') == 'inlineStr':
                    v = ''.join(t.text or '' for t in c.iter('{%s}t' % ns['m']))
                row.append(v)
            rows.append(row)
        return rows


def read_text(path):
    raw = open(path, 'rb').read()
    for enc in ('utf-8-sig', 'cp949', 'euc-kr', 'utf-16'):
        try:
            text = raw.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    delim = '\t' if '\t' in text else ','
    return list(csv.reader(text.splitlines(), delimiter=delim))


def main():
    files = [f for f in glob.glob(os.path.join(SRC, '*')) if f.lower().endswith(('.xlsx', '.txt', '.csv'))
             and not f.endswith('wordlist.tsv')]
    if not files:
        sys.exit('❌ data-src/ 폴더에 어휘 목록 파일(.xlsx / .txt / .csv)을 넣어 주세요.')
    path = files[0]
    rows = read_xlsx(path) if path.lower().endswith('.xlsx') else read_text(path)
    print(f'📄 {os.path.basename(path)} : {len(rows)}줄')

    # 머리글 줄 찾기: '단어'와 '등급'이 들어 있는 줄
    head_i = next(i for i, r in enumerate(rows[:20]) if any('단어' in c for c in r) and any('등급' in c for c in r))
    head = [c.strip() for c in rows[head_i]]
    col = lambda name: next(i for i, c in enumerate(head) if name in c)
    wi, gi = col('단어'), col('등급')
    pi = next((i for i, c in enumerate(head) if '품사' in c), None)

    out, seen = [], set()
    for r in rows[head_i + 1:]:
        if len(r) <= max(wi, gi):
            continue
        word = re.sub(r'\d+$', '', r[wi].strip())  # '가다01' → '가다' (동음이의어 번호 제거)
        grade = r[gi].strip().upper()
        pos = r[pi].strip() if pi is not None and pi < len(r) else ''
        if not word or grade not in ('A', 'B', 'C'):
            continue
        if (word, pos) in seen:
            continue
        seen.add((word, pos))
        out.append((f'w{len(out) + 1:05d}', word, pos, grade))

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('id\tword\tpos\tgrade\n')
        for row in out:
            f.write('\t'.join(row) + '\n')
    by = {g: sum(1 for o in out if o[3] == g) for g in 'ABC'}
    print(f'✅ {len(out)}개 → data-src/wordlist.tsv  (A {by["A"]} / B {by["B"]} / C {by["C"]})')
    print('   예시:', ', '.join(o[1] for o in out[:8]))


if __name__ == '__main__':
    main()
