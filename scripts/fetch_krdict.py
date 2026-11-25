"""한국어기초사전 오픈 API에서 단어 정보(일본어 뜻·발음·예문)를 받아 캐시에 저장합니다.

사용법 (Mac 터미널, koreantalk 폴더에서):
  python3 scripts/fetch_krdict.py            # 전체 받기 (중간에 끊겨도 다시 실행하면 이어서)
  python3 scripts/fetch_krdict.py --limit 20 # 시험 삼아 20개만

필요한 것:
  - scripts/.krdict_key 파일에 인증키 한 줄 (깃허브에 안 올라가게 .gitignore 처리됨)
  - data-src/wordlist.tsv (scripts/prepare_wordlist.py 가 만듦)
결과:
  - data-src/krdict_cache.jsonl  (한 줄 = 단어 하나)
"""
import argparse
import json
import os
import sys
import threading
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY_FILE = os.path.join(ROOT, 'scripts', '.krdict_key')
WORDLIST = os.path.join(ROOT, 'data-src', 'wordlist.tsv')
CACHE = os.path.join(ROOT, 'data-src', 'krdict_cache.jsonl')
SEARCH_URL = 'https://krdict.korean.go.kr/api/search'
VIEW_URL = 'https://krdict.korean.go.kr/api/view'
JAPANESE = '2'  # trans_lang: 2 = 일본어

lock = threading.Lock()


def load_key():
    key = os.environ.get('KRDICT_KEY') or (open(KEY_FILE).read().strip() if os.path.exists(KEY_FILE) else '')
    if not key:
        sys.exit('❌ 인증키가 없습니다. scripts/.krdict_key 파일에 키를 한 줄로 넣어 주세요.')
    return key


def get_xml(url, params, retries=3):
    """API 호출 → XML. 실패하면 잠깐 쉬고 다시 시도"""
    q = urllib.parse.urlencode(params)
    for i in range(retries):
        try:
            with urllib.request.urlopen(f'{url}?{q}', timeout=10) as r:
                root = ET.fromstring(r.read())
            if root.tag == 'error':
                raise RuntimeError(f"API 오류 {root.findtext('error_code')}: {root.findtext('message')}")
            return root
        except RuntimeError:
            raise
        except Exception as e:
            reason = getattr(e, 'reason', '') or getattr(e, 'code', '') or e
            print(f'   ⚠️ 응답 지연/오류 → 재시도 {i + 1}/{retries} ({type(e).__name__}: {reason})', flush=True)
            time.sleep(2 * (i + 1))
    raise RuntimeError('네트워크 오류 (3번 실패)')


def parse_item(item):
    """검색 결과 item 하나 → dict"""
    senses = []
    for s in item.findall('sense'):
        tr = s.find('translation')
        senses.append({
            'definition': s.findtext('definition', ''),
            'trans_word': tr.findtext('trans_word', '') if tr is not None else '',
            'trans_dfn': tr.findtext('trans_dfn', '') if tr is not None else '',
        })
    return {
        'target_code': item.findtext('target_code', ''),
        'word': item.findtext('word', ''),
        'sup_no': item.findtext('sup_no', '0'),
        'pronunciation': item.findtext('pronunciation', ''),
        'origin': item.findtext('origin', ''),
        'word_grade': item.findtext('word_grade', ''),
        'pos': item.findtext('pos', ''),
        'senses': senses,
    }


def fetch_examples(key, target_code):
    """상세 보기 API → 첫 번째 뜻의 예문 (문장 우선, 최대 2개)"""
    root = get_xml(VIEW_URL, {'key': key, 'q': target_code, 'method': 'target_code'})
    sense = root.find('.//sense_info')
    if sense is None:
        return []
    exs = [(e.findtext('type', ''), e.findtext('example', '')) for e in sense.findall('example_info')]
    exs.sort(key=lambda x: 0 if x[0] == '문장' else 1 if x[0] == '구' else 2)  # 문장 → 구 → 대화
    return [t for _, t in exs if t][:2]


def fetch_one(key, row):
    time.sleep(0.8)  # 서버에 부담 주지 않게 쉬기 (너무 빠르면 접속이 차단됨)
    word, pos, grade = row['word'], row['pos'], row['grade']
    root = get_xml(SEARCH_URL, {
        'key': key, 'q': word, 'part': 'word', 'translated': 'y', 'trans_lang': JAPANESE,
        'advanced': 'y', 'method': 'exact', 'num': '10',
    })
    items = [parse_item(i) for i in root.findall('item')]
    time.sleep(0.5)
    examples = fetch_examples(key, pick(items, pos, row.get('gloss', ''))['target_code']) if items else []
    return {'input': row, 'items': items, 'examples': examples}


POS_MAP = {'명': '명사', '동': '동사', '형': '형용사', '부': '부사', '대': '대명사', '수': '수사', '관': '관형사',
           '감': '감탄사', '의': '의존 명사', '보': '보조'}


def pick(items, pos, gloss=''):
    """같은 철자 단어가 여러 개면: 품사 일치 → 등급 있음 → 번호 작은 순"""
    want = POS_MAP.get(pos, '')
    return sorted(items, key=lambda i: (
        0 if gloss and gloss in i.get('origin', '') else 1,  # 한자가 같으면 같은 단어
        0 if want and i['pos'].startswith(want) else 1,
        0 if i['word_grade'] else 1,
        int(i['sup_no'] or 0),
    ))[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0, help='시험용: 앞에서부터 N개만')
    ap.add_argument('--workers', type=int, default=1, help='동시에 보낼 요청 수 (기본 1. 서버가 느려지면 1로)')
    args = ap.parse_args()

    key = load_key()
    if not os.path.exists(WORDLIST):
        sys.exit('❌ data-src/wordlist.tsv 가 없습니다. 먼저 python3 scripts/prepare_wordlist.py 를 실행하세요.')
    rows = []
    with open(WORDLIST, encoding='utf-8') as f:
        header = f.readline().rstrip('\n').split('\t')
        for line in f:
            rows.append(dict(zip(header, line.rstrip('\n').split('\t'))))

    done = set()
    if os.path.exists(CACHE):  # 이미 받은 단어는 건너뜀 (이어 받기)
        with open(CACHE, encoding='utf-8') as f:
            for line in f:
                try:
                    done.add(json.loads(line)['input']['id'])
                except Exception:
                    pass
    todo = [r for r in rows if r['id'] not in done]
    if args.limit:
        todo = todo[:args.limit]
    print(f'📚 전체 {len(rows)}개 / 이미 받음 {len(done)}개 / 이번에 받을 것 {len(todo)}개')

    start, ok, fail, streak = time.time(), 0, 0, 0  # streak = 연속 실패 수
    with open(CACHE, 'a', encoding='utf-8') as out, ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(fetch_one, key, r): r for r in todo}
        for n, fu in enumerate(as_completed(futures), 1):
            r = futures[fu]
            try:
                res = fu.result()
                with lock:
                    out.write(json.dumps(res, ensure_ascii=False) + '\n')
                    out.flush()
                ok += 1
                streak = 0
            except RuntimeError as e:
                fail += 1
                streak += 1
                if streak >= 2:  # 연속으로 실패 → 서버가 막은 것 같으니 쉬었다가 계속
                    print(f'\n⏸  연속 실패 → 5분 쉬고 다시 시도합니다 ({time.strftime("%H:%M")} 기준)', flush=True)
                    time.sleep(300)
                    streak = 0
                if 'API 오류' in str(e):
                    print(f'\n❌ {e}\n   (인증키가 맞는지, 하루 한도를 넘지 않았는지 확인하세요)')
                    ex.shutdown(cancel_futures=True)
                    break
            if n % 10 == 0 or n == len(todo):  # 10개마다 진행 상황 표시
                el = time.time() - start
                eta = el / n * (len(todo) - n)
                print(f'  {n}/{len(todo)}  성공 {ok}  실패 {fail}  남은 시간 약 {eta / 60:.0f}분', flush=True)
    print(f'✅ 끝! 성공 {ok}개, 실패 {fail}개 → {os.path.relpath(CACHE, ROOT)}')
    if fail:
        print('   실패한 단어는 다시 실행하면 재시도합니다.')


if __name__ == '__main__':
    main()
