import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HiraganaDisplay from './components/HiraganaDisplay';
import KatakanaDisplay from './components/KatakanaDisplay';
import StartScreen from './components/StartScreen';
import AuthPage from './components/auth/AuthPage';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// 認証が必要なルート用コンポーネント
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const [selectedType, setSelectedType] = useState('hiragana');

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <div className="app-container">
              <Header currentType={selectedType} onTypeChange={setSelectedType} />
              <main className="main-content">
                {selectedType === 'hiragana' ? (
                  <HiraganaDisplay />
                ) : selectedType === 'katakana' ? (
                  <KatakanaDisplay />
                ) : (
                  <div className="coming-soon">
                    <h2>漢字モードは準備中です！</h2>
                    <p>もうしばらくお待ちください。</p>
                  </div>
                )}
              </main>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
