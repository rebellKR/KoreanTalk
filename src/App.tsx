import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Celebrations from './components/Celebrations'
import Layout from './components/Layout'
import Home from './pages/Home'
import Conversation from './pages/Conversation'
import Vocabulary from './pages/Vocabulary'
import Favorites from './pages/Favorites'
import MyPage from './pages/MyPage'
import Settings from './pages/Settings'
import Study from './pages/Study'
import Lesson from './pages/Lesson'

// 데이터가 큰 화면은 처음 열 때 불러옴 (앱 시작 속도 ↑)
const Hangul = lazy(() => import('./pages/Hangul'))
const Grammar = lazy(() => import('./pages/Grammar'))
const Topik = lazy(() => import('./pages/Topik'))
const TopikQuiz = lazy(() => import('./pages/TopikQuiz'))
const Games = lazy(() => import('./pages/Games'))
const SpeedGame = lazy(() => import('./pages/SpeedGame'))
const PairGame = lazy(() => import('./pages/PairGame'))

export default function App() {
  return (
    <>
    <Suspense fallback={null}>
    <Routes>
      {/* Layout 안에 각 탭 화면이 들어감 (하단 탭바는 항상 표시) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/conversation" element={<Conversation />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/settings" element={<Settings />} />
        <Route path="/hangul" element={<Hangul />} />
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/topik" element={<Topik />} />
        <Route path="/games" element={<Games />} />
      </Route>
      {/* 카드 학습은 탭바 없이 전체 화면 */}
      <Route path="/vocabulary/study" element={<Study />} />
      <Route path="/conversation/:sid" element={<Lesson />} />
      <Route path="/topik/quiz" element={<TopikQuiz />} />
      <Route path="/games/speed" element={<SpeedGame />} />
      <Route path="/games/pair" element={<PairGame />} />
    </Routes>
    </Suspense>
    {/* 레벨업·배지 축하 (모든 화면 공통) */}
    <Celebrations />
    </>
  )
}
