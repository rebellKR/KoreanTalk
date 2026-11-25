import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { X, Check, Flame, RotateCcw } from 'lucide-react'
import Button from '../components/Button'
import Confetti from '../components/Confetti'
import { TOPIK, SECTION_LABEL } from '../data/study'
import type { TopikQuestion } from '../types'
import { useProgress } from '../context/ProgressContext'

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)
const PRAISE = ['正解！', 'すごい！', 'いいね！', 'その調子！', 'パーフェクト！']

// 결과 점수 원형 그래프
function ScoreRing({ percent }: { percent: number }) {
  const r = 52, c = 2 * Math.PI * r
  const [shown, setShown] = useState(0)
  useEffect(() => { const t = setTimeout(() => setShown(percent), 100); return () => clearTimeout(t) }, [percent]) // 0%에서 차오르는 애니메이션
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
      <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeWidth="12" className="text-primary/10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round"
        className={percent >= 80 ? 'text-success' : 'text-primary'}
        strokeDasharray={c} strokeDashoffset={c * (1 - shown / 100)} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
    </svg>
  )
}

// 문제 문장 표시: <...> 부분은 밑줄로, "밑줄 친 부분…:" 머리말은 숨김
function QuestionText({ text }: { text: string }) {
  const body = text.replace(/^밑줄 친 부분과 의미가 비슷한 것:\s*/, '').replace(/^밑줄 친 부분의 반대말을 고르십시오\.\s*/, '')
  return (
    <p className="mt-4 font-ko text-[19px] leading-snug font-bold">
      {body.split(/<(.+?)>/).map((part, i) =>
        i % 2 ? <u key={i} className="decoration-primary decoration-2 underline-offset-4">{part}</u> : part)}
    </p>
  )
}

export default function TopikQuiz() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const level = params.get('level') as 'I' | 'II' | null
  const section = params.get('section')
  const mode = params.get('mode') // 'wrong' = 오답 노트
  const { progress, recordTopik, saveTopikScore } = useProgress()

  // 처음 한 번만 문제 고르기 (최대 10문제)
  const [questions] = useState<TopikQuestion[]>(() => {
    const pool = mode === 'wrong'
      ? TOPIK.filter((q) => progress.wrongNotes.includes(q.id))
      : TOPIK.filter((q) => q.level === level && (!section || q.section === section))
    return shuffle(pool).slice(0, 10)
  })
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null) // 고른 보기
  const [results, setResults] = useState<boolean[]>([])
  const [combo, setCombo] = useState(0)                     // 연속 정답 수

  const q = questions[index]
  const done = index >= questions.length
  const correctCount = results.filter(Boolean).length
  const percent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0
  const title = mode === 'wrong' ? '間違いノート' : `TOPIK ${level === 'II' ? 'Ⅱ' : 'Ⅰ'}${section ? ' · ' + SECTION_LABEL[section as 'vocab'] : ' · ランダム'}`

  // 끝나면 최고 점수 저장
  useEffect(() => {
    if (done && questions.length && mode !== 'wrong') saveTopikScore(`${level}-${section ?? 'mix'}`, percent)
  }, [done]) // eslint-disable-line

  const choose = (i: number) => {
    if (picked !== null) return // 이미 고름
    const ok = i === q.answer
    setPicked(i)
    setResults((r) => [...r, ok])
    setCombo((c) => (ok ? c + 1 : 0))
    recordTopik(q.id, ok)
    navigator.vibrate?.(ok ? 30 : [40, 40, 40]) // 진동 지원 기기만
  }
  const next = () => { setPicked(null); setIndex((i) => i + 1) }

  if (questions.length === 0) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface px-8 text-center">
        <p className="text-[16px] font-semibold">問題がありません</p>
        <Button variant="ghost" onClick={() => navigate(-1)}>戻る</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-surface"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
      {/* 상단 */}
      <header className="flex items-center gap-3 px-4">
        <button onClick={() => navigate(-1)} aria-label="閉じる" className="flex h-11 w-11 items-center justify-center rounded-full transition active:bg-background">
          <X size={24} />
        </button>
        <div className="flex flex-1 gap-1">
          {questions.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < results.length ? (results[i] ? 'bg-success' : 'bg-error') : i === index ? 'bg-primary/40' : 'bg-primary/10'}`} />
          ))}
        </div>
        {/* 연속 정답 콤보 */}
        <span key={combo} className={`flex w-14 items-center justify-end gap-0.5 text-[13px] font-bold tabular-nums ${combo >= 2 ? 'animate-[pop_0.4s_ease-out] text-warning' : 'text-text-secondary'}`}>
          {combo >= 2 ? <><Flame size={15} />{combo}</> : `${Math.min(index + 1, questions.length)}/${questions.length}`}
        </span>
      </header>

      {done ? (
        // ===== 결과 =====
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-8">
          {percent >= 80 && <Confetti />}
          <p className="text-center text-[13px] font-semibold text-text-secondary">{title}</p>
          <div className="relative mx-auto mt-4">
            <ScoreRing percent={percent} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[34px] font-bold tabular-nums">{percent}<span className="text-[16px]">%</span></span>
              <span className="text-[12px] text-text-secondary">{correctCount}/{questions.length}問正解</span>
            </div>
          </div>
          <h2 className="mt-4 text-center text-[22px] font-bold">
            {percent === 100 ? '満点！天才！🎉' : percent >= 80 ? 'すばらしい！' : percent >= 50 ? 'あと少し！' : '復習してまた挑戦しよう'}
          </h2>

          {/* 틀린 문제 다시 보기 */}
          {results.some((r) => !r) && (
            <section className="mt-6">
              <h3 className="mb-2 text-[12px] font-semibold tracking-[0.08em] text-text-secondary">間違えた問題（間違いノートに保存済み）</h3>
              <ul className="space-y-2">
                {questions.map((qq, i) => !results[i] && (
                  <li key={qq.id} className="rounded-card bg-background p-4 dark:bg-border/40">
                    <p className="font-ko text-[14px]">{qq.question}</p>
                    <p className="mt-1.5 flex items-center gap-1 font-ko text-[14px] font-bold text-success"><Check size={15} />{qq.choices[qq.answer]}</p>
                    <p className="mt-1 text-[12px] text-text-secondary">{qq.explanationJa}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="mt-auto flex flex-col gap-2 pt-6">
            <Button full onClick={() => navigate(0)}><RotateCcw size={18} /> もう一度</Button>
            <Button full variant="ghost" onClick={() => navigate(-1)}>TOPIKトップへ</Button>
          </div>
        </div>
      ) : (
        <>
          {/* ===== 문제 ===== */}
          <div key={q.id} className="flex-1 animate-[slide-up_0.25s_ease-out] overflow-y-auto px-6 pt-6">
            <p className="text-[12px] font-semibold text-primary">{SECTION_LABEL[q.section]} · TOPIK {q.level === 'II' ? 'Ⅱ' : 'Ⅰ'}</p>
            {q.passage && (
              <p className="mt-3 rounded-card bg-background p-4 font-ko text-[15px] leading-[1.8] whitespace-pre-line dark:bg-border/40">{q.passage}</p>
            )}
            <QuestionText text={q.question} />
            {!q.passage && (
              <p className="mt-1 text-[12px] text-text-secondary">
                {q.question.includes('반대말') ? '下線部と反対の意味のものを選んでください。'
                  : q.question.includes('밑줄') ? '下線部と意味が最も近いものを選んでください。'
                  : '（ ）に入る最も適切なものを選んでください。'}
              </p>
            )}

            {/* 보기 4개 */}
            <ul className="mt-5 space-y-2.5">
              {q.choices.map((c, i) => {
                const isAnswer = i === q.answer
                const isPicked = i === picked
                const state = picked === null ? 'idle' : isAnswer ? 'correct' : isPicked ? 'wrong' : 'dim'
                return (
                  <li key={c}>
                    <button onClick={() => choose(i)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left ring-1 transition ${
                        state === 'idle' ? 'ring-border active:scale-[0.98] active:bg-background'
                        : state === 'correct' ? 'animate-[bounce-in_0.4s_ease-out] bg-success/12 ring-2 ring-success'
                        : state === 'wrong' ? 'animate-[shake_0.4s_ease-out] bg-error/10 ring-2 ring-error'
                        : 'opacity-40 ring-border'}`}>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                        state === 'correct' ? 'bg-success text-white' : state === 'wrong' ? 'bg-error text-white' : 'bg-background text-text-secondary dark:bg-border'}`}>
                        {state === 'correct' ? <Check size={15} /> : state === 'wrong' ? <X size={15} /> : i + 1}
                      </span>
                      <span className="font-ko text-[16px]">{c}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* 해설 */}
            {picked !== null && (
              <div className={`mt-4 animate-[slide-up_0.25s_ease-out] rounded-card p-4 ${picked === q.answer ? 'bg-success/10' : 'bg-error/10'}`}>
                <p className={`text-[15px] font-bold ${picked === q.answer ? 'text-success' : 'text-error'}`}>
                  {picked === q.answer ? PRAISE[Math.min(combo - 1, PRAISE.length - 1)] : '残念…'}
                  {picked === q.answer && combo >= 3 && ` ${combo}問連続！`}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed">{q.explanationJa}</p>
              </div>
            )}
            <div className="h-4" />
          </div>
          <div className="px-6 pt-3">
            <Button full disabled={picked === null} onClick={next}>
              {index === questions.length - 1 ? '結果を見る' : '次の問題へ'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
