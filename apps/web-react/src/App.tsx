import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

// Pages
import HomePage from './pages/HomePage'
import DebugPage from './pages/DebugPage'
import CreateRoomPage from './pages/CreateRoomPage'
import JoinRoomPage from './pages/JoinRoomPage'
import LocalGamePage from './pages/LocalGamePage'
import GameBoardPage from './pages/GameBoardPage'
import GameRoomPage from './pages/GameRoomPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/rooms/create" element={<CreateRoomPage />} />
        <Route path="/rooms/join" element={<JoinRoomPage />} />
        <Route path="/game/local" element={<LocalGamePage />} />
        <Route path="/game/board" element={<GameBoardPage />} />
        <Route path="/game/room/:roomCode" element={<GameRoomPage />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

export default App