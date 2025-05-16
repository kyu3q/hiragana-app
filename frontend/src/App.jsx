import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HiraganaDisplay from './components/HiraganaDisplay';
import KatakanaDisplay from './components/KatakanaDisplay';
import StartScreen from './components/StartScreen';
import AuthPage from './components/auth/AuthPage';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import GameMode from './components/Games/GameMode';
import './components/Games/GameModeModal.css';
import './App.css';
import ShiritoriGame from './components/Games/ShiritoriGame';

// 認証が必要なルート用コンポーネント
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const [selectedType, setSelectedType] = useState('hiragana');
  const [showGameMode, setShowGameMode] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <div className="app-container">
              <Header
                currentType={selectedType}
                onTypeChange={setSelectedType}
              />
              <main className="main-content">
                {activeGame === 'shiritori' ? (
                  <ShiritoriGame onClose={() => setActiveGame(null)} />
                ) : selectedType === 'hiragana' ? (
                  <HiraganaDisplay showGameMode={showGameMode} setShowGameMode={setShowGameMode} />
                ) : selectedType === 'katakana' ? (
                  <KatakanaDisplay />
                ) : (
                  <div className="coming-soon">
                    <h2>漢字モードは準備中です！</h2>
                    <p>もうしばらくお待ちください。</p>
                  </div>
                )}
              </main>
              {showGameMode && (
                <div className="game-modal-overlay">
                  <div className="game-modal-content">
                    <GameMode
                      onSelectGame={game => {
                        setActiveGame(game);
                        setShowGameMode(false);
                      }}
                      onClose={() => setShowGameMode(false)}
                      type={selectedType}
                    />
                  </div>
                </div>
              )}
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
