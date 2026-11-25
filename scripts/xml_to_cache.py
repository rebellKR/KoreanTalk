"""한국어기초사전 전체 XML(통째 다운로드본) → data-src/krdict_cache.jsonl

API를 한 단어씩 부르지 않고, 사전 전체 파일에서 한 번에 찾아내는 방법입니다.
(비유: 도서관에 6000번 전화해서 묻는 대신, 사전 한 권을 통째로 빌려와서 찾기)

사용법: python3 scripts/xml_to_cache.py <XML 폴더>
  XML 폴더 = github.com/changwoo/krdict-converted 의 upstream/ (0.xml ~ 10.xml)
다음 단계로 build_vocab.py 를 실행하면 앱용 JSON 이 만들어집니다.
"""
import glob
import io
import re
import json
import os
import sys
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORDLIST = os.path.join(ROOT, 'data-src', 'wordlist.tsv')
CACHE = os.path.join(ROOT, 'data-src', 'krdict_cache.jsonl')
LEVEL = {'초급': '초급', '중급': '중급', '고급': '고급'}  # '없음'은 등급 없음


def feats(el):
    """<feat att=".." val=".."/> 들을 dict 로 (바로 아래 자식만)"""
    return {f.get('att'): f.get('val', '') for f in el.findall('feat')}


def norm(w):
    return w.replace('-', '').replace('^', '').replace(' ', '')  # '가-다', '가^보다' 같은 표기 정리


def parse_entry(e):
    """LexicalEntry 하나 → build_vocab.py 가 읽는 모양"""
    f = feats(e)
    lemma = e.find('Lemma')
    word = feats(lemma).get('writtenForm', '') if lemma is not None else ''
    wf = e.find('WordForm')
    pron = feats(wf).get('pronunciation', '') if wf is not None else ''
    senses, examples = [], []
    for i, s in enumerate(e.findall('Sense')):
        ja = next((feats(q) for q in s.findall('Equivalent') if feats(q).get('language') == '일본어'), {})
        senses.append({
            'definition': feats(s).get('definition', ''),
            'trans_word': ja.get('lemma', ''),
            'trans_dfn': ja.get('definition', ''),
        })
        if i == 0:  # 첫 번째 뜻의 예문 (문장 → 구 순서, 대화는 제외)
            exs = [(feats(x).get('type', ''), feats(x).get('example', '')) for x in s.findall('SenseExample')]
            exs.sort(key=lambda x: 0 if x[0] == '문장' else 1 if x[0] == '구' else 2)
            examples = [t for k, t in exs if t and k != '대화'][:2]
    return {
        'target_code': e.get('val', ''),
        'word': word,
        'sup_no': f.get('homonym_number', '0'),
        'pronunciation': pron,
        'origin': f.get('origin', ''),
        'word_grade': LEVEL.get(f.get('vocabularyLevel', ''), ''),
        'pos': f.get('partOfSpeech', ''),
        'senses': senses,
    }, examples


def main():
    if len(sys.argv) < 2:
        sys.exit('사용법: python3 scripts/xml_to_cache.py <XML 폴더>')
    rows = []
    with open(WORDLIST, encoding='utf-8') as f:
        header = f.readline().rstrip('\n').split('\t')
        rows = [dict(zip(header, line.rstrip('\n').split('\t'))) for line in f if line.strip()]
    want = {norm(r['word']) for r in rows}

    index = {}  # 단어 → [(item, examples), ...]
    files = sorted(glob.glob(os.path.join(sys.argv[1], '*.xml')))
    for path in files:
        text = open(path, encoding='utf-8').read()
        # 원본 버그 대응: 속성값 안의 '<' '>' 를 안전한 글자로 바꿈
        text = re.sub(r'val="([^"]*)"', lambda m: 'val="' + m.group(1).replace('<', '&lt;').replace('>', '&gt;') + '"', text)
        for _, el in ET.iterparse(io.BytesIO(text.encode('utf-8'))):  # 한 항목씩 읽고 버림
            if el.tag != 'LexicalEntry':
                continue
            lemma = el.find('Lemma')
            w = norm(feats(lemma).get('writtenForm', '')) if lemma is not None else ''
            if w in want:
                index.setdefault(w, []).append(parse_entry(el))
            el.clear()
        print(f'  {os.path.basename(path)} 읽음 (찾은 단어 {len(index)}개)', flush=True)

    found = 0
    with open(CACHE, 'w', encoding='utf-8') as out:
        for r in rows:
            hits = index.get(norm(r['word']), [])
            items = [h[0] for h in hits]
            ex = {h[0]['target_code']: h[1] for h in hits}
            # build_vocab.py 와 같은 기준으로 고른 항목의 예문을 붙임
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            from build_vocab import pick  # noqa: E402
            examples = ex[pick(items, r['pos'], r.get('gloss', ''))['target_code']] if items else []
            found += bool(items)
            out.write(json.dumps({'input': r, 'items': items, 'examples': examples}, ensure_ascii=False) + '\n')
    print(f'✅ {found}/{len(rows)}개 찾음 → data-src/krdict_cache.jsonl')


if __name__ == '__main__':
    main()
