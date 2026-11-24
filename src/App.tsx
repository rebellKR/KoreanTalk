import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Conversation from './pages/Conversation'
import Vocabulary from './pages/Vocabulary'
import Favorites from './pages/Favorites'
import MyPage from './pages/MyPage'
import Settings from './pages/Settings'
import Study from './pages/Study'
import Lesson from './pages/Lesson'

export default function App() {
  return (
    <Routes>
      {/* Layout 안에 각 탭 화면이 들어감 (하단 탭바는 항상 표시) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/conversation" element={<Conversation />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/settings" element={<Settings />} />
      </Route>
      {/* 카드 학습은 탭바 없이 전체 화면 */}
      <Route path="/vocabulary/study" element={<Study />} />
      <Route path="/conversation/:sid" element={<Lesson />} />
    </Routes>
  )
}
