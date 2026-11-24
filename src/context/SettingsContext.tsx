import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// 앱 설정 항목 (테마는 ThemeContext에서 따로 관리)
export type Settings = {
  fontSize: 'sm' | 'md' | 'lg' // 文字サイズ
  showKana: boolean            // カタカナ発音 표시
  ttsRate: 0.7 | 1             // 読み上げ速度
  dailyGoal: 10 | 20 | 30      // 1日の単語目標
}

const DEFAULTS: Settings = { fontSize: 'md', showKana: true, ttsRate: 1, dailyGoal: 10 }
const STORAGE_KEY = 'kt-settings'

type Ctx = { settings: Settings; update: <K extends keyof Settings>(key: K, value: Settings[K]) => void }
const SettingsContext = createContext<Ctx | null>(null)

// 저장된 설정 불러오기 (깨진 값이면 기본값)
function load(): Settings {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return DEFAULTS
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)

  // 설정이 바뀔 때마다 자동 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const update: Ctx['update'] = (key, value) => setSettings((s) => ({ ...s, [key]: value }))

  return <SettingsContext.Provider value={{ settings, update }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings는 SettingsProvider 안에서만 사용')
  return ctx
}
