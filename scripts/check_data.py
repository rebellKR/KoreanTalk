"""학습 데이터 자동 검사: 형식 오류·중복을 찾아냅니다.
사용법: python3 scripts/check_data.py
"""
import glob, json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'src', 'data')
errors = []

topik = []
for f in sorted(glob.glob(os.path.join(D, 'topik*.json'))):
    topik += json.load(open(f, encoding='utf-8'))
ids, texts = set(), set()
for q in topik:
    if q['id'] in ids: errors.append(f"TOPIK id 중복: {q['id']}")
    ids.add(q['id'])
    if len(q['choices']) != 4 or len(set(q['choices'])) != 4: errors.append(f"보기 4개/중복 문제: {q['id']}")
    if not 0 <= q['answer'] < 4: errors.append(f"정답 번호 오류: {q['id']}")
    key = (q['question'], q.get('passage', ''))
    if key in texts: errors.append(f"같은 문제 중복: {q['id']}")
    texts.add(key)
    if not q.get('explanationJa'): errors.append(f"해설 없음: {q['id']}")

grammar = json.load(open(os.path.join(D, 'grammar.json'), encoding='utf-8'))
pats = [g['pattern'] for g in grammar]
for p in set(pats):
    if pats.count(p) > 1: errors.append(f"문법 중복: {p}")
for g in grammar:
    if len(g['examples']) < 3: errors.append(f"예문 3개 미만: {g['pattern']}")

lv = lambda l: sum(1 for q in topik if q['level'] == l)
print(f"TOPIK {len(topik)}問 (Ⅰ {lv('I')} / Ⅱ {lv('II')}) · 文法 {len(grammar)}")
if errors:
    print('\n'.join('❌ ' + e for e in errors)); sys.exit(1)
print('✅ 문제 없음')
