# 데이터 만들기 (단어 약 6,000개)

Mac 터미널에서 `koreantalk` 폴더로 이동한 뒤 순서대로 실행합니다. 추가 설치는 필요 없습니다 (Python 3 기본 기능만 사용).

## 0. 준비 (한 번만)
1. **인증키**: https://krdict.korean.go.kr → 오픈 API → 인증키 신청
   - 받은 키를 `scripts/.krdict_key` 파일에 한 줄로 저장 (이 파일은 깃허브에 올라가지 않음)
   ```bash
   echo "여기에_인증키" > scripts/.krdict_key
   ```
2. **어휘 목록**: 국립국어원 「한국어 학습용 어휘 목록」(엑셀 또는 텍스트)을 내려받아 `data-src/` 폴더에 넣기

## 1. 어휘 목록 정리
```bash
python3 scripts/prepare_wordlist.py      # → data-src/wordlist.tsv
```

## 2-A. 사전 전체 파일에서 한 번에 찾기 (추천, 약 10초)
API 대신 한국어기초사전 전체 XML(약 400MB)을 받아서 찾습니다.
```bash
git clone --depth 1 https://github.com/changwoo/krdict-converted ../krdict-xml
python3 scripts/xml_to_cache.py ../krdict-xml/upstream   # → data-src/krdict_cache.jsonl
```

## 2-B. 사전 API에서 받기 (느림, 서버가 자주 끊김)
```bash
python3 scripts/fetch_krdict.py --limit 20   # 먼저 20개만 시험
python3 scripts/fetch_krdict.py              # 전체 (끊기면 다시 실행 → 이어서 받음)
```

## 3. 앱용 JSON 만들기
```bash
python3 scripts/build_vocab.py           # → src/data/vocab/level1~3.json
```

## 출처
- 한국어기초사전(국립국어원) — CC BY-SA 2.0 KR
- 한국어 학습용 어휘 목록(국립국어원) — 공공누리 제1유형
