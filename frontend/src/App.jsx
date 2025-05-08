import React, { useState } from 'react';
import HiraganaDisplay from './components/HiraganaDisplay';
import StartScreen from './components/StartScreen';
import './App.css';

function App() {
  const [selectedType, setSelectedType] = useState(null);

  if (!selectedType) {
    return <StartScreen onSelect={setSelectedType} />;
  }

  // ひらがな以外の分岐は今後追加予定
  if (selectedType === 'hiragana') {
    return <HiraganaDisplay />;
  }

  return null;
}

export default App;
