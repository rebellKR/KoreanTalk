// 이 앱이 쓰는 저장 데이터는 모두 'kt-'로 시작
const PREFIX = 'kt-'

function collect() {
  const data: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!
    if (key.startsWith(PREFIX)) data[key] = localStorage.getItem(key)!
  }
  return { app: 'KoreanTalk', version: 1, exportedAt: new Date().toISOString(), data }
}

// バックアップ: iPhone은 공유 시트(ファイルに保存), 안 되면 일반 다운로드
export async function exportBackup() {
  const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' }) // 2026-11-24 형식
  const file = new File([JSON.stringify(collect(), null, 2)], `koreantalk-backup-${date}.json`, {
    type: 'application/json',
  })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return true
    } catch {
      return false // 사용자가 공유 창을 닫음
    }
  }
  const url = URL.createObjectURL(file)
  const a = Object.assign(document.createElement('a'), { href: url, download: file.name })
  a.click()
  URL.revokeObjectURL(url)
  return true
}

// 復元: 선택한 JSON 파일의 내용을 저장소에 되돌림
export async function importBackup(file: File) {
  const json = JSON.parse(await file.text())
  if (json?.app !== 'KoreanTalk' || typeof json.data !== 'object') throw new Error('invalid')
  resetAll()
  for (const [k, v] of Object.entries(json.data)) {
    if (k.startsWith(PREFIX)) localStorage.setItem(k, String(v))
  }
}

// リセット: 이 앱의 데이터만 삭제 (다른 사이트 데이터는 건드리지 않음)
export function resetAll() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k))
}
