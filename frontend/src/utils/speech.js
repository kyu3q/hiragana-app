// Web Speech API の薄いラッパー
const LANG = 'ja-JP';
const RATE = 0.8; // 子ども向けにゆっくり読み上げる

const isSupported = () =>
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  typeof SpeechSynthesisUtterance !== 'undefined';

// 日本語の音声が無い環境は、非対応と同じ扱いにする
export const isSpeechAvailable = () =>
  isSupported() && window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith('ja'));

// Chrome は音声一覧を非同期で読み込むため、先に呼んで読み込みを始めておく
export const warmUpVoices = () => {
  if (isSupported()) {
    window.speechSynthesis.getVoices();
  }
};

// 音声一覧の読み込み完了を購読する。戻り値は解除関数
export const onVoicesChanged = (callback) => {
  if (!isSupported()) return () => {};
  window.speechSynthesis.addEventListener('voiceschanged', callback);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', callback);
};

// 読み上げを開始できたら true。失敗時は理由をログに残し、onError を呼ぶ
export const speak = (text, onError) => {
  if (!isSpeechAvailable()) {
    console.warn('音声読み上げが利用できません（日本語の音声が見つかりません）');
    if (onError) onError();
    return false;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG;
  utterance.rate = RATE;
  utterance.onerror = (event) => {
    // cancel() による中断は故障ではないので無視する
    if (event.error === 'interrupted' || event.error === 'canceled') return;
    console.warn(`音声読み上げに失敗しました: ${event.error}`);
    if (onError) onError();
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
};
