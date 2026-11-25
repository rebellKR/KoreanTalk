"""한글 → 카타카나 발음 표기 (대략적인 읽기용)
한국어기초사전의 '발음' 정보(예: [마싣따])를 넣으면 소리 나는 대로 바뀐 형태라 더 정확해집니다.
"""

# 초성 → 일본어 행 (a, i, u, e, o 순서)
ROWS = {
    'k': 'カキクケコ', 'n': 'ナニヌネノ', 't': ['タ', 'ティ', 'トゥ', 'テ', 'ト'], 'r': 'ラリルレロ', 'm': 'マミムメモ',
    'p': 'パピプペポ', 's': 'サシスセソ', '': 'アイウエオ', 'ch': ['チャ', 'チ', 'チュ', 'チェ', 'チョ'], 'h': 'ハヒフヘホ',
    # 단어 중간의 ㄱ·ㄷ·ㅂ·ㅈ은 탁음으로 (예: 감사합니다 → カムサハムニダ)
    'g': 'ガギグゲゴ', 'd': ['ダ', 'ディ', 'ドゥ', 'デ', 'ド'], 'b': 'バビブベボ', 'j': ['ジャ', 'ジ', 'ジュ', 'ジェ', 'ジョ'],
}
VOICED = {0: 'g', 3: 'd', 7: 'b', 12: 'j'}  # 초성 번호 → 탁음 행 (예사소리 ㄱ ㄷ ㅂ ㅈ)
SONORANT_JONG = {0, 4, 8, 16, 21}           # 받침 없음, ㄴ, ㄹ, ㅁ, ㅇ 뒤에서만 탁음
# 초성 19개 (가나다 순서) → 행
CHO = ['k', 'k', 'n', 't', 't', 'r', 'm', 'p', 'p', 's', 's', '', 'ch', 'ch', 'ch', 'k', 't', 'p', 'h']
# 중성 21개 → (종류, 모음)  종류: 'v'=기본, 'y'=야/유/요, 'w'=와/워, 'ye', 'ui'
JUNG = [('v', 'a'), ('v', 'e'), ('y', 'a'), ('ye', ''), ('v', 'o'), ('v', 'e'), ('y', 'o'), ('ye', ''), ('v', 'o'),
        ('w', 'a'), ('w', 'e'), ('w', 'e'), ('y', 'o'), ('v', 'u'), ('w', 'o'), ('w', 'e'), ('w', 'i'), ('y', 'u'),
        ('v', 'u'), ('ui', ''), ('v', 'i')]
# 종성 28개 (0 = 받침 없음) → 카타카나
JONG = ['', 'ク', 'ク', 'ク', 'ン', 'ン', 'ン', 'ッ', 'ル', 'ク', 'ム', 'プ', 'ル', 'ル', 'プ', 'ル', 'ム', 'プ', 'プ',
        'ッ', 'ッ', 'ン', 'ッ', 'ッ', 'ク', 'ッ', 'プ', 'ッ']
IDX = {'a': 0, 'i': 1, 'u': 2, 'e': 3, 'o': 4}
SMALL_Y = {'a': 'ャ', 'u': 'ュ', 'o': 'ョ'}
SMALL_W = {'a': 'ァ', 'e': 'ェ', 'o': 'ォ', 'i': 'ィ'}


def kana(row: str, v: str) -> str:
    return ROWS[row][IDX[v]]


def syllable(ch: str, prev_jong: int | None = None) -> str:
    code = ord(ch) - 0xAC00
    if not 0 <= code < 11172:
        return ch  # 한글이 아니면 그대로
    cho, jung, jong = code // 588, (code % 588) // 28, code % 28
    row = CHO[cho]
    if prev_jong is not None and prev_jong in SONORANT_JONG and cho in VOICED:
        row = VOICED[cho]
    kind, v = JUNG[jung]
    if kind == 'v':
        s = kana(row, v)
    elif kind == 'y':
        if row == '':
            s = {'a': 'ヤ', 'u': 'ユ', 'o': 'ヨ'}[v]
        elif row in ('ch', 'j'):
            s = kana(row, v)
        else:
            s = kana(row, 'i') + SMALL_Y[v]
    elif kind == 'w':
        s = ({'a': 'ワ', 'e': 'ウェ', 'o': 'ウォ', 'i': 'ウィ'}[v] if row == '' else kana(row, 'u') + SMALL_W[v])
    elif kind == 'ye':
        s = 'イェ' if row == '' else kana(row, 'e')
    else:  # ui
        s = 'ウィ' if row == '' else kana(row, 'i')
    return s + JONG[jong]


def to_kana(text: str) -> str:
    """'안녕하세요' → 'アンニョンハセヨ' / 공백은 그대로 유지"""
    out, prev = [], None
    for c in text:
        out.append(syllable(c, prev))
        code = ord(c) - 0xAC00
        prev = code % 28 if 0 <= code < 11172 else None  # 띄어쓰기 뒤는 단어 첫 글자로 취급
    return ''.join(out)


if __name__ == '__main__':
    for w in ['안녕하세요', '마싣따', '감사함니다', '사랑해', '커피', '괜차나요', '의사', '화이팅']:
        print(w, to_kana(w))
