// 경험치 → 레벨 계산
// Lv.1→2: 100XP, Lv.2→3: 150XP, Lv.3→4: 200XP … (레벨이 오를수록 조금씩 어려워짐)
export function levelInfo(xp: number) {
  let level = 1
  let need = 100
  let rest = xp
  while (rest >= need) {
    rest -= need
    level++
    need += 50
  }
  return { level, cur: rest, need } // cur = 현재 레벨에서 모은 XP, need = 다음 레벨까지 필요한 XP
}

// 레벨 칭호 (재미 요소)
export function levelTitle(level: number) {
  if (level >= 20) return '韓国語マスター'
  if (level >= 12) return '上級者'
  if (level >= 7) return '中級者'
  if (level >= 3) return '初級者'
  return 'ビギナー'
}
