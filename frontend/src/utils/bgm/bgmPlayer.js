// BGM の再生。Web Audio API で曲データ（bgmTracks.js）から音を作り、ループさせる。
// AudioContext は引数で差し替えられる（テストでは音を出さない偽物を渡す）。

import { getTrack } from './bgmTracks';

// BGM 全体の音量。効果音（0.4〜0.5）より小さくする
export const MASTER_VOLUME = 0.25;

// 次のループを、終わりの何秒前に予約するか。タブが裏に回ってタイマーが遅れても途切れないようにする
const LOOKAHEAD_SECONDS = 2;
const CHECK_INTERVAL_MS = 500;
// 再生を始めるまでの余裕（秒）
const START_DELAY_SECONDS = 0.1;
// 止めるときに音量を下げる時間（秒）。プツッというノイズを防ぐ
const FADE_OUT_SECONDS = 0.15;

const createBrowserContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('このブラウザは AudioContext に対応していません');
  }
  return new AudioContextClass();
};

export const createBgmPlayer = ({ createContext = createBrowserContext } = {}) => {
  let ctx = null;
  let master = null;
  let timer = null;
  let currentId = null;
  let track = null;
  let nextLoopStart = 0;
  let muted = false;
  let oscillators = [];

  const scheduleNote = (voice, freq, start, duration) => {
    const osc = ctx.createOscillator();
    osc.type = voice.wave;
    osc.frequency.value = freq;

    // 音の出だしと終わりをなめらかにする（プツプツ切れる音を防ぐ）
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(voice.gain, start + 0.01);
    envelope.gain.linearRampToValueAtTime(0, start + duration * 0.95);

    osc.connect(envelope);
    envelope.connect(master);
    osc.start(start);
    osc.stop(start + duration);
    osc.onended = () => {
      oscillators = oscillators.filter((o) => o !== osc);
      osc.disconnect();
      envelope.disconnect();
    };
    oscillators.push(osc);
  };

  // 1ループぶんの音を予約する
  const scheduleLoop = () => {
    const secondsPerBeat = 60 / track.tempo;
    track.voices.forEach((voice) => {
      let time = nextLoopStart;
      voice.notes.forEach((note) => {
        const duration = note.beats * secondsPerBeat;
        if (note.freq !== null) scheduleNote(voice, note.freq, time, duration);
        time += duration;
      });
    });
    nextLoopStart += track.beats * secondsPerBeat;
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
    currentId = null;
    track = null;
    if (!ctx || !master) return;

    const fadingMaster = master;
    const stopAt = ctx.currentTime + FADE_OUT_SECONDS;
    fadingMaster.gain.setTargetAtTime(0, ctx.currentTime, FADE_OUT_SECONDS / 4);
    oscillators.forEach((osc) => {
      try {
        osc.stop(stopAt);
      } catch (error) {
        console.warn('BGM の音を止められませんでした:', error);
      }
    });
    oscillators = [];
    master = null;
    setTimeout(() => fadingMaster.disconnect(), FADE_OUT_SECONDS * 1000 + 50);
  };

  // 曲を再生する。再生できたら true。すでに同じ曲が流れていれば何もしない
  const play = (id) => {
    if (id === currentId) return true;
    const nextTrack = getTrack(id); // 知らない曲名はここで例外になる
    stop();

    try {
      if (!ctx) ctx = createContext();
    } catch (error) {
      console.warn('BGM を再生できません:', error);
      return false;
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch((error) => console.warn('BGM の再開に失敗しました:', error));
    }

    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_VOLUME;
    master.connect(ctx.destination);

    track = nextTrack;
    currentId = id;
    nextLoopStart = ctx.currentTime + START_DELAY_SECONDS;
    scheduleLoop();
    timer = setInterval(() => {
      while (nextLoopStart - ctx.currentTime < LOOKAHEAD_SECONDS) scheduleLoop();
    }, CHECK_INTERVAL_MS);
    return true;
  };

  const setMuted = (value) => {
    muted = value;
    if (master) master.gain.setTargetAtTime(muted ? 0 : MASTER_VOLUME, ctx.currentTime, 0.02);
  };

  const isMuted = () => muted;

  return { play, stop, setMuted, isMuted };
};

// アプリ全体で共有する1つのプレイヤー（AudioContext は使うときまで作らない）
export const bgm = createBgmPlayer();
