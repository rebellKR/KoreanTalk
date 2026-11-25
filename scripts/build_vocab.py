"""data-src/krdict_cache.jsonl → 앱용 JSON (src/data/vocab/level1~3.json)

사용법: python3 scripts/build_vocab.py
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kana import to_kana  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'data-src', 'krdict_cache.jsonl')
OUT_DIR = os.path.join(ROOT, 'src', 'data', 'vocab')
GRADE = {'A': 1, 'B': 2, 'C': 3}
POS_JA = {'명사': '名詞', '동사': '動詞', '형용사': '形容詞', '부사': '副詞', '대명사': '代名詞', '수사': '数詞',
          '관형사': '冠形詞', '감탄사': '感嘆詞', '의존 명사': '依存名詞', '보조 동사': '補助動詞', '보조 형용사': '補助形容詞',
          '조사': '助詞', '어미': '語尾', '접사': '接辞'}
POS_KEY = {'명': '명사', '동': '동사', '형': '형용사', '부': '부사', '대': '대명사', '수': '수사', '관': '관형사',
           '감': '감탄사', '의': '의존 명사', '보': '보조'}


def pick(items, pos, gloss=''):
    want = POS_KEY.get(pos, '')
    return sorted(items, key=lambda i: (0 if gloss and gloss in i.get('origin', '') else 1,
                                        0 if want and i['pos'].startswith(want) else 1,
                                        0 if i['word_grade'] else 1, int(i['sup_no'] or 0)))[0]


def short_ja(trans_word):
    """'みせ【店】。しょうてん【商店】' → '店・商店' (한자가 있으면 한자, 최대 2개)"""
    out = []
    for p in re.split(r'[;,；、。\n]', trans_word):
        p = p.strip()
        if not p:
            continue
        m = re.search(r'【(.+?)】', p)
        word = m.group(1).split('・')[0] if m else p
        if word not in out:
            out.append(word)
    return '・'.join(out[:2])


def reading_ja(trans_word):
    """첫 번째 뜻의 읽는 법: 'みせ【店】…' → 'みせ' (한자가 없으면 빈 문자열)"""
    first = re.split(r'[;,；、。\n]', trans_word.strip())[0].strip()
    return first.split('【')[0].strip() if '【' in first else ''


def main():
    if not os.path.exists(CACHE):
        sys.exit('❌ data-src/krdict_cache.jsonl 이 없습니다. 먼저 fetch_krdict.py 를 실행하세요.')
    words, missing, seen = {1: [], 2: [], 3: []}, 0, set()
    with open(CACHE, encoding='utf-8') as f:
        for line in f:
            d = json.loads(line)
            row, items = d['input'], d['items']
            if not items:
                missing += 1
                continue
            it = pick(items, row['pos'], row.get('gloss', ''))
            sense = next((s for s in it['senses'] if s['trans_word'] or s['trans_dfn']), None)
            if not sense:
                missing += 1
                continue
            if it['target_code'] in seen:  # 같은 사전 항목이 두 번 나오면 하나만
                continue
            seen.add(it['target_code'])
            pron = re.split(r'[/,]', it['pronunciation'])[0].replace('ː', '').strip() or it['word']
            level = GRADE.get(row['grade'], 3)
            words[level].append({
                'id': f"kr-{it['target_code']}",
                'ko': it['word'],
                'ja': short_ja(sense['trans_word']) or sense['trans_dfn'][:30],
                **({'jaRead': reading_ja(sense['trans_word'])} if reading_ja(sense['trans_word']) else {}),
                'jaDef': sense['trans_dfn'].strip(),
                'kana': to_kana(pron),
                'pos': POS_JA.get(it['pos'], it['pos']),
                'category': f'level{level}',
                'level': level,
                **({'example': {'ko': d['examples'][0]}} if d['examples'] else {}),
            })
    os.makedirs(OUT_DIR, exist_ok=True)
    for lv, ws in words.items():
        with open(os.path.join(OUT_DIR, f'level{lv}.json'), 'w', encoding='utf-8') as f:
            json.dump(ws, f, ensure_ascii=False, separators=(',', ':'))
        print(f'  level{lv}.json : {len(ws)}語')
    print(f'✅ 완료 (뜻을 찾지 못한 단어 {missing}개는 제외)')


if __name__ == '__main__':
    main()
