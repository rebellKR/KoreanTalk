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
        if row == '':
            s = {'a': 'ワ', 'e': 'ウェ', 'o': 'ウォ', 'i': 'ウィ'}[v]
        elif v == 'e':
            s = 'フェ' if row == 'h' else kana(row, 'e')  # 최고 → チェゴ, 뵙다 → ペプタ, 회사 → フェサ
        else:
            s = kana(row, 'u') + SMALL_W[v]
    elif kind == 'ye':
        s = 'イェ' if row == '' else kana(row, 'e')
    else:  # ui
        s = 'ウィ' if row == '' else kana(row, 'i')
    return s + JONG[jong]


# ===== 발음 규칙 (소리 나는 대로 바꾸기) =====
# 받침 → 다음 글자 첫소리로 옮길 때의 초성 번호
J2C = {1: 0, 2: 1, 4: 2, 7: 3, 8: 5, 16: 6, 17: 7, 19: 9, 20: 10, 22: 12, 23: 14, 24: 15, 25: 16, 26: 17}
# 겹받침: (남는 받침, 넘어가는 초성)  None = ㅎ처럼 사라짐
DOUBLE = {3: (1, 10), 5: (4, 12), 6: (4, None), 9: (8, 0), 10: (8, 6), 11: (8, 7), 12: (8, 9), 13: (8, 16), 14: (8, 17),
          15: (8, None), 18: (17, 10)}
# 끝소리 규칙 (받침 7개 대표음으로)
NEUTRAL = {2: 1, 24: 1, 3: 1, 9: 1, 19: 7, 20: 7, 22: 7, 23: 7, 25: 7, 27: 7, 26: 17, 14: 17, 18: 17, 5: 4, 6: 4,
           11: 8, 12: 8, 13: 8, 15: 8, 10: 16}
ASPIRATE = {0: 15, 3: 16, 7: 17, 12: 14}   # ㄱㄷㅂㅈ + ㅎ → ㅋㅌㅍㅊ
TENSE = {0: 1, 3: 4, 7: 8, 9: 10, 12: 13}  # 된소리


def pronounce(text: str) -> str:
    """'감사합니다' → '감사함니다', '맛있어요' → '마시써요' (자주 쓰는 발음 규칙만 적용한 근사치)"""
    syl = []  # [초, 중, 종] 또는 글자 그대로(str)
    for c in text:
        code = ord(c) - 0xAC00
        syl.append([code // 588, (code % 588) // 28, code % 28] if 0 <= code < 11172 else c)
    for i in range(1, len(syl)):  # 단어 중간의 '예'는 '에'로 (얼마예요 → 얼마에요)
        x, prev_x = syl[i], syl[i - 1]
        if not isinstance(x, str) and not isinstance(prev_x, str) and x[0] == 11 and x[1] == 7:
            x[1] = 5
    for i in range(len(syl) - 1):
        a, b = syl[i], syl[i + 1]
        if isinstance(a, str) or isinstance(b, str):
            continue
        j, c = a[2], b[0]
        if j == 0:
            continue
        if c == 11 and b[1] == 20 and j in (7, 25):  # 구개음화: 같이 → 가치, 굳이 → 구지
            a[2], b[0] = 0, (12 if j == 7 else 14)
            continue
        if c == 11:  # 다음 글자가 ㅇ으로 시작 → 연음
            if j == 27:
                a[2] = 0
            elif j in DOUBLE:
                keep, move = DOUBLE[j]
                if move is None:
                    a[2], b[0] = 0, J2C[keep]
                else:
                    a[2], b[0] = keep, move
            elif j in J2C:
                a[2], b[0] = 0, J2C[j]
            continue
        if c == 18 and j in (1, 7, 17, 22):  # 축하 → 추카
            a[2], b[0] = 0, ASPIRATE[{1: 0, 7: 3, 17: 7, 22: 12}[j]]
            continue
        if c == 18 and j in (4, 8, 16):  # 전화 → 저놔
            a[2], b[0] = 0, J2C[j]
            continue
        if j in (27, 6, 15):  # ㅎ 받침: 좋다 → 조타, 좋습니다 → 조씀니다
            rest = {27: 0, 6: 4, 15: 8}[j]
            if c in ASPIRATE:
                a[2], b[0] = rest, ASPIRATE[c]
                continue
            if c == 9:
                a[2], b[0] = rest, 10
                continue
            if c == 2:
                a[2] = 4 if j == 27 else rest
                continue
        a[2] = NEUTRAL.get(a[2], a[2])
        j = a[2]
        if c in (2, 6):  # 비음화: 합니다 → 함니다, 먹는 → 멍는
            a[2] = {1: 21, 7: 4, 17: 16}.get(j, j)
        elif j in (1, 7, 17) and c in TENSE:  # 된소리: 학교 → 학꾜
            b[0] = TENSE[c]
    last = syl[-1] if syl else None
    if last and not isinstance(last, str):
        last[2] = NEUTRAL.get(last[2], last[2])
    return ''.join(x if isinstance(x, str) else chr(0xAC00 + x[0] * 588 + x[1] * 28 + x[2]) for x in syl)


TENSE_CHO = {1, 4, 8, 10, 13}  # ㄲ ㄸ ㅃ ㅆ ㅉ


def to_kana(text: str) -> str:
    """'안녕하세요' → 'アンニョンハセヨ' / 공백은 그대로 유지"""
    out, prev = [], None
    for idx, c in enumerate(text):
        code = ord(c) - 0xAC00
        k = syllable(c, prev)
        if 0 <= code < 11172 and code // 588 in TENSE_CHO and prev == 0:
            k = 'ッ' + k  # 아빠 → アッパ, 마시써요 → マシッソヨ
        nxt = ord(text[idx + 1]) - 0xAC00 if idx + 1 < len(text) else -1
        if 0 <= code < 11172 and 0 <= nxt < 11172:
            j, nc = code % 28, nxt // 588
            if (j == 1 and nc in (1, 15)) or (j == 17 and nc in (8, 17)):
                k = k[:-1] + 'ッ'  # 학꾜 → ハッキョ
        out.append(k)
        code = ord(c) - 0xAC00
        prev = code % 28 if 0 <= code < 11172 else None  # 띄어쓰기 뒤는 단어 첫 글자로 취급
    return ''.join(out)


def kana_of(text: str) -> str:
    """보통 한국어 문장 → 발음 규칙 적용 → 카타카나"""
    return to_kana(pronounce(text))


if __name__ == '__main__':
    for w in ['안녕하세요', '감사합니다', '맛있어요', '괜찮아요', '축하해', '좋아해요', '먹었어요', '읽어요', '없어요',
              '학교', '전화', '오빠', '좋습니다', '만나서 반가워요', '같이 갈래요?', '한국어', '몇 시에 만날까?']:
        print(w, '→', pronounce(w), '→', kana_of(w))
