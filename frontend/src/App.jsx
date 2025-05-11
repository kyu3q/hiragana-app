import React, { useState } from 'react';
import HiraganaDisplay from './components/HiraganaDisplay';
import KatakanaDisplay from './components/KatakanaDisplay';
import StartScreen from './components/StartScreen';
import './App.css';

function App() {
  const [selectedType, setSelectedType] = useState(null);

  if (!selectedType) {
    return <StartScreen onSelect={setSelectedType} />;
  }

  switch (selectedType) {
    case 'hiragana':
      return <HiraganaDisplay />;
    case 'katakana':
      return <KatakanaDisplay />;
    default:
      return null;
  }
}

export default App;
