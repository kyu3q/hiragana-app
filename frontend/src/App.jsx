import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HiraganaDisplay from './components/HiraganaDisplay';
import KatakanaDisplay from './components/KatakanaDisplay';
import StartScreen from './components/StartScreen';
import AuthPage from './components/auth/AuthPage';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import GameMode from './components/Games/Kana/GameMode';
import KanjiDisplay from './components/KanjiDisplay';
import './App.css';
import ShiritoriGame from './components/Games/Kana/ShiritoriGame';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RegisterSuccess from './pages/RegisterSuccess';

// 認証が必要なルート用コンポーネント
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const [selectedType, setSelectedType] = useState('hiragana');
  const [showGameMode, setShowGameMode] = useState(false);

  useEffect(() => {
    if (showGameMode) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showGameMode]);

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register-success" element={<RegisterSuccess />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
                {selectedType === 'hiragana' ? (
                  <HiraganaDisplay showGameMode={showGameMode} setShowGameMode={setShowGameMode} />
                ) : selectedType === 'katakana' ? (
                  <KatakanaDisplay showGameMode={showGameMode} setShowGameMode={setShowGameMode} />
                ) : (
                  <KanjiDisplay />
                )}
              </main>
              {console.log('showGameMode:', showGameMode)}
              {showGameMode && (
                <div className="game-mode-overlay">
                  <div className="game-mode-content">
                    <GameMode
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
