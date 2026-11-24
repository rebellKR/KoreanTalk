// 브라우저 내장 음성(Web Speech API)으로 한국어 읽기 — 무료, 오프라인에서도 동작
export function speakKorean(text: string, rate = 1) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel() // 이전 음성이 재생 중이면 멈춤
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ko-KR'
  u.rate = rate
  // iPhone에 설치된 한국어 음성(예: Yuna)이 있으면 사용
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('ko'))
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
  return true
}
