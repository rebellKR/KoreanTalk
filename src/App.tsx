import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Conversation from './pages/Conversation'
import Vocabulary from './pages/Vocabulary'
import Favorites from './pages/Favorites'
import MyPage from './pages/MyPage'

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
      </Route>
    </Routes>
  )
}
