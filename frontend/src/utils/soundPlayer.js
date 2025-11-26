// グローバル変数で現在再生中かどうかを追跡
let isCurrentlyPlaying = false;

// 音声を再生する関数（Web Speech API使用バージョン）
export const playSound = (character, forcePlay = false) => {
  try {
    // 現在再生中なら何もしない（ただし、強制再生フラグがある場合は再生）
    if (isCurrentlyPlaying && !forcePlay) {
      console.log('別の音声が再生中のため、再生をスキップします');
      return;
    }
    
    // 現在再生中の音声をすべて停止
    window.speechSynthesis.cancel();
    
    // 再生中フラグを設定
    isCurrentlyPlaying = true;
    
    // Web Speech APIを使用して音声合成
    const utterance = new SpeechSynthesisUtterance(character);
    utterance.lang = 'ja-JP'; // 日本語に設定
    utterance.volume = 1.0;   // 音量（0.0〜1.0）
    utterance.rate = 0.8;     // 速度（0.1〜10.0、デフォルトは1）
    utterance.pitch = 1.2;    // 音程（0〜2、デフォルトは1）
    
    // 再生終了時のコールバック
    utterance.onend = () => {
      console.log(`「${character}」の音声再生が終了しました`);
      isCurrentlyPlaying = false;
    };
    
    // エラー時のコールバック
    utterance.onerror = (event) => {
      console.error('音声再生エラー:', event);
      isCurrentlyPlaying = false;
    };
    
    // 音声合成を実行
    window.speechSynthesis.speak(utterance);
    
    // コンソールにも表示
    console.log(`「${character}」の音声を再生します`);
    
    // 万が一コールバックが呼ばれない場合のフォールバック
    setTimeout(() => {
      if (isCurrentlyPlaying) {
        console.log('タイムアウトによる再生状態リセット');
        isCurrentlyPlaying = false;
      }
    }, 5000);
  } catch (error) {
    console.error('音声の再生に失敗しました:', error);
    isCurrentlyPlaying = false;
  }
};

// --- MP3 Audio Functions ---

const playAudioFile = (filename, volume = 0.5) => {
    try {
        const audio = new Audio(`/music/${filename}`);
        audio.volume = volume;
        audio.play().catch(e => console.error(`Failed to play ${filename}:`, e));
    } catch (e) {
        console.error(`Error playing ${filename}:`, e);
    }
};

export const playOK1Sound = () => {
    playAudioFile('OK_1.mp3');
};

export const playOK2Sound = () => {
    playAudioFile('OK_2.mp3');
};

export const playOK3Sound = () => {
    playAudioFile('OK_3.mp3');
};

export const playHappy1Sound = () => {
    playAudioFile('Happy_1.mp3');
};

export const playHappy2Sound = () => {
    playAudioFile('Happy_2.mp3');
};

export const playNGSound = () => {
    playAudioFile('NG.mp3');
};

export const playJumpSound = () => {
    playAudioFile('Jump.mp3', 0.4);
};

export const playCollisionSound = () => {
    playAudioFile('Collision.mp3');
};

export const playFinishSound = () => {
    playAudioFile('Finish.mp3');
};

export const playOtherSound = () => {
    playAudioFile('Other.mp3');
};

// Memory Game Dedicated Sounds
export const playMemoryOKSound = () => {
    playAudioFile('OK_Memory.mp3');
};

export const playMemoryNGSound = () => {
    playAudioFile('NG_Memory.mp3');
};

// --- Legacy Wrapper Functions (Updated to use MP3s) ---

// 正解時の音声と効果音を再生
export const playCorrectSound = () => {
  playOK1Sound();
};

// 達成時の音声を再生
export const playCheerSound = () => {
  playHappy1Sound();
};

// 星獲得時の音声を再生
export const playStarSound = () => {
  // Use Other or Happy for Star/Bonus
  playHappy2Sound();
};

// 不正解時の音声を再生
export const playWrongSound = () => {
  playNGSound();
};

// 効果音を再生する関数（代替バージョン - Backward Compatibility）
export const playEffect = (effectName) => {
  switch (effectName) {
      case 'click':
          playOtherSound();
          break;
      case 'correct':
          playCorrectSound();
          break;
      case 'cheer':
          playCheerSound();
          break;
      case 'star':
          playStarSound();
          break;
      default:
          console.log(`Effect ${effectName} requested`);
  }
};
