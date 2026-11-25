# 데이터 만들기 (단어 약 6,000개)

Mac 터미널에서 `koreantalk` 폴더로 이동한 뒤 순서대로 실행합니다. 추가 설치는 필요 없습니다 (Python 3 기본 기능만 사용).

## 0. 준비 (한 번만)
- **어휘 목록**: 국립국어원 「한국어 학습용 어휘 목록」(텍스트)을 `data-src/` 폴더에 넣기 (이미 들어 있음)

## 1. 어휘 목록 정리
```bash
python3 scripts/prepare_wordlist.py      # → data-src/wordlist.tsv
```

## 2. 사전 전체 파일에서 단어 찾기 (약 10초)
한국어기초사전 전체 XML(약 400MB)을 받아서 한 번에 찾습니다.
```bash
git clone --depth 1 https://github.com/changwoo/krdict-converted ../krdict-xml
python3 scripts/xml_to_cache.py ../krdict-xml/upstream   # → data-src/krdict_cache.jsonl
```

## 3. 앱용 JSON 만들기
```bash
python3 scripts/build_vocab.py           # → src/data/vocab/level1~3.json
python3 scripts/check_data.py            # 데이터 검사
```

## 출처
- 한국어기초사전(국립국어원) — CC BY-SA 2.0 KR
- 한국어 학습용 어휘 목록(국립국어원) — 공공누리 제1유형
