// 브라우저 내장 음성(Web Speech API)으로 한국어 읽기 — 무료, 오프라인에서도 동작

// 기기에 설치된 한국어 음성 목록 (iPhone은 처음에 빈 목록 → 잠시 후 채워짐)
export function getKoreanVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve([])
    const pick = () => window.speechSynthesis.getVoices().filter((v) => v.lang.replace('_', '-').startsWith('ko'))
    const list = pick()
    if (list.length) return resolve(sortVoices(list))
    // 목록이 아직 없으면 준비될 때까지 기다림 (최대 1.5초)
    const done = () => resolve(sortVoices(pick()))
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true })
    setTimeout(done, 1500)
  })
}

// 음질 점수: Premium(고음질) > Enhanced(향상) > Google 등 온라인 음성 > 기본
function score(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase()
  if (n.includes('premium') || n.includes('프리미엄')) return 3
  if (n.includes('enhanced') || n.includes('향상') || n.includes('고품질')) return 2
  if (n.includes('google') || n.includes('natural') || n.includes('online')) return 1
  return 0
}
const sortVoices = (list: SpeechSynthesisVoice[]) => [...list].sort((a, b) => score(b) - score(a))

// 설정에서 고른 음성 (없으면 '' = 自動: 가장 좋은 음성)
function savedVoiceURI(): string {
  try {
    return JSON.parse(localStorage.getItem('kt-settings') || '{}').voiceURI ?? ''
  } catch {
    return ''
  }
}

let cache: SpeechSynthesisVoice[] = []
getKoreanVoices().then((v) => (cache = v)) // 앱 시작 시 미리 불러두기

export function speakKorean(text: string, rate = 1) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel() // 이전 음성이 재생 중이면 멈춤
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ko-KR'
  u.rate = rate * 0.95 // 기본 속도가 약간 빨라서 조금 늦춤
  const uri = savedVoiceURI()
  const voice = cache.find((v) => v.voiceURI === uri) ?? cache[0] // 고른 음성 → 없으면 최고 음질
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
  return true
}
