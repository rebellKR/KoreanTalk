import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Palette, Type, Languages, Gauge, Volume2, Target, Download, Upload, Trash2, Info, Heart, Mic, ChevronDown,
} from 'lucide-react'
import PageContainer from '../components/PageContainer'
import Segmented from '../components/Segmented'
import Toggle from '../components/Toggle'
import { SettingsGroup, SettingsRow } from '../components/SettingsGroup'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { useTheme, type ThemeMode } from '../context/ThemeContext'
import { useSettings, type Settings as S } from '../context/SettingsContext'
import { speakKorean, getKoreanVoices } from '../utils/speak'
import { exportBackup, importBackup, resetAll } from '../utils/backup'

const APP_VERSION = '0.2.0'

export default function Settings() {
  const navigate = useNavigate()
  const { mode, setMode } = useTheme()
  const { settings, update } = useSettings()
  const fileRef = useRef<HTMLInputElement>(null)          // 숨겨진 파일 선택 창
  const [toast, setToast] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<null | 'reset' | 'restore'>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // 기기의 한국어 음성 목록 불러오기
  useEffect(() => { getKoreanVoices().then(setVoices) }, [])

  // 복원 파일을 고르면 → 확인 창 띄우기
  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = '' // 같은 파일을 다시 골라도 반응하도록 초기화
    if (f) { setPendingFile(f); setConfirm('restore') }
  }

  const doRestore = async () => {
    setConfirm(null)
    try {
      await importBackup(pendingFile!)
      location.reload() // 불러온 설정을 화면에 반영
    } catch {
      setToast('ファイルを読み込めませんでした')
    }
  }

  const doReset = () => {
    resetAll()
    location.reload()
  }

  return (
    <PageContainer>
      {/* 상단: 뒤로가기 + 제목 */}
      <header className="mb-6 flex items-center gap-1">
        <button onClick={() => navigate(-1)} aria-label="戻る"
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full transition active:bg-surface">
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[24px] font-bold tracking-[-0.02em]">設定</h1>
      </header>

      <SettingsGroup title="表示">
        <SettingsRow icon={Palette} label="テーマ" below={
          <Segmented<ThemeMode> value={mode} onChange={setMode}
            options={[{ value: 'light', label: 'ライト' }, { value: 'dark', label: 'ダーク' }, { value: 'system', label: '自動' }]} />
        } />
        <SettingsRow icon={Type} label="文字サイズ" below={
          <Segmented<S['fontSize']> value={settings.fontSize} onChange={(v) => update('fontSize', v)}
            options={[{ value: 'sm', label: '小' }, { value: 'md', label: '中' }, { value: 'lg', label: '大' }]} />
        } />
        <SettingsRow icon={Languages} label="カタカナ発音" description="韓国語の下に読み方を表示"
          right={<Toggle label="カタカナ発音" checked={settings.showKana} onChange={(v) => update('showKana', v)} />} />
      </SettingsGroup>

      <SettingsGroup title="音声">
        <SettingsRow icon={Gauge} label="読み上げ速度" below={
          <Segmented<S['ttsRate']> value={settings.ttsRate} onChange={(v) => update('ttsRate', v)}
            options={[{ value: 0.7, label: 'ゆっくり' }, { value: 1, label: 'ふつう' }]} />
        } />
        <SettingsRow icon={Mic} label="音声の種類" description="Premium・Enhanced と付いた音声が自然です" below={
          // 기기에 설치된 한국어 음성 중에서 선택
          <div>
            <div className="relative">
            <select value={settings.voiceURI} onChange={(e) => update('voiceURI', e.target.value)}
              className="h-11 w-full appearance-none rounded-xl bg-background px-4 pr-10 text-[16px] ring-1 ring-border/60 outline-none dark:bg-border">
              <option value="">自動（一番自然な音声）</option>
              {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary" />
            </div>
            {/* 고음질 음성 다운로드 안내 */}
            <p className="mt-3 text-[12px] leading-relaxed text-text-secondary">
              もっと自然な声にするには：iPhoneの「設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 韓国語」で
              「Yuna（プレミアム）」などをダウンロードしてください。
            </p>
          </div>
        } />
        <SettingsRow icon={Volume2} label="音声テスト" description="안녕하세요! 만나서 반가워요."
          onClick={() => {
            if (!speakKorean('안녕하세요! 만나서 반가워요.', settings.ttsRate)) setToast('このブラウザは音声に対応していません')
          }} />
      </SettingsGroup>

      <SettingsGroup title="学習">
        <SettingsRow icon={Target} label="1日の目標（単語）" below={
          <Segmented<S['dailyGoal']> value={settings.dailyGoal} onChange={(v) => update('dailyGoal', v)}
            options={[{ value: 10, label: '10語' }, { value: 20, label: '20語' }, { value: 30, label: '30語' }]} />
        } />
      </SettingsGroup>

      <SettingsGroup title="データ">
        <SettingsRow icon={Download} label="バックアップ" description="学習記録をファイルに保存"
          onClick={async () => { if (await exportBackup()) setToast('バックアップしました') }} />
        <SettingsRow icon={Upload} label="復元" description="バックアップファイルから読み込む"
          onClick={() => fileRef.current?.click()} />
        <SettingsRow icon={Trash2} label="データをリセット" danger onClick={() => setConfirm('reset')} />
      </SettingsGroup>

      <SettingsGroup title="アプリについて">
        <SettingsRow icon={Info} label="バージョン" right={<span className="text-[14px] text-text-secondary tabular-nums">{APP_VERSION}</span>} />
        <SettingsRow icon={Heart} label="Korean Talk" description="毎日すこしずつ、韓国語を楽しく。" />
      </SettingsGroup>

      <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onPickFile} />

      <ConfirmDialog open={confirm === 'reset'} danger
        title="データをリセットしますか？" message="学習記録と設定がすべて削除されます。この操作は元に戻せません。"
        confirmLabel="リセットする" onConfirm={doReset} onCancel={() => setConfirm(null)} />
      <ConfirmDialog open={confirm === 'restore'}
        title="復元しますか？" message="現在の学習記録と設定は、バックアップの内容で上書きされます。"
        confirmLabel="復元する" onConfirm={doRestore} onCancel={() => setConfirm(null)} />
      <Toast message={toast} onClose={() => setToast(null)} />
    </PageContainer>
  )
}
