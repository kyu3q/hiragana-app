// 漢字カードの各ゲームのBGM（曲データ）。音符は「音名:拍数」を空白で区切って書く。
// 1ループは8小節（32拍）。メロディは4小節を2回くり返し、2回目は1オクターブ上げて変化をつける。

import { parseNotes, totalBeats } from './notes';

// 音名のオクターブ番号を上げる（"C5:1 R:1" → "C6:1 R:1"）
const octaveUp = (text) => text.replace(/\b([A-G][#b]?)(\d)(?=:)/g, (_, name, octave) => `${name}${Number(octave) + 1}`);

// 4小節をくり返し、2回目は1オクターブ上げる
const lead = (bars) => `${bars} ${octaveUp(bars)}`;
// 4小節をそのままくり返す
const twice = (bars) => `${bars} ${bars}`;

// ベースの小節（根音と5度を、休符をはさんで交互に鳴らす）
const hop = (root, fifth) => `${root}:0.5 R:0.5 ${fifth}:0.5 R:0.5 ${root}:0.5 R:0.5 ${fifth}:0.5 R:0.5`;
// 同じ音の8分音符を n 個
const eighths = (note, n) => Array(n).fill(`${note}:0.5`).join(' ');

const DEFINITIONS = {
  // 漢字ランナー: 軽快なC長調
  jump: {
    tempo: 150,
    voices: [
      {
        wave: 'square',
        gain: 0.14,
        notes: lead(
          [
            'E5:0.5 G5:0.5 C6:1 G5:0.5 E5:0.5 G5:1',
            'D5:0.5 F5:0.5 A5:1 F5:0.5 D5:0.5 F5:1',
            'E5:0.5 G5:0.5 C6:1 B5:0.5 G5:0.5 E5:1',
            'D5:1 G5:1 C5:1 R:1',
          ].join(' ')
        ),
      },
      {
        wave: 'triangle',
        gain: 0.28,
        notes: twice([hop('C3', 'G3'), hop('D3', 'A3'), hop('C3', 'G3'), 'G2:0.5 R:0.5 D3:0.5 R:0.5 G2:1 R:1'].join(' ')),
      },
    ],
  },

  // スネーク: 忍び足のAマイナー
  snake: {
    tempo: 110,
    voices: [
      {
        wave: 'triangle',
        gain: 0.18,
        notes: lead(
          [
            'A4:0.5 R:0.5 C5:0.5 R:0.5 E5:0.5 R:0.5 C5:0.5 R:0.5',
            'G4:0.5 R:0.5 B4:0.5 R:0.5 D5:0.5 R:0.5 B4:0.5 R:0.5',
            'F4:0.5 R:0.5 A4:0.5 R:0.5 C5:0.5 R:0.5 A4:0.5 R:0.5',
            'E4:1 G#4:1 A4:1 R:1',
          ].join(' ')
        ),
      },
      {
        wave: 'sine',
        gain: 0.25,
        notes: twice('A2:2 E3:2 G2:2 D3:2 F2:2 C3:2 E2:2 E3:1 R:1'),
      },
    ],
  },

  // キャッチ: 明るいG長調
  catch: {
    tempo: 130,
    voices: [
      {
        wave: 'triangle',
        gain: 0.2,
        notes: lead(
          [
            'G5:1 B5:1 D6:1 B5:1',
            'C6:1 A5:1 E5:1 A5:1',
            'B5:1 G5:1 D5:1 G5:1',
            'A5:1 F#5:1 D5:1 R:1',
          ].join(' ')
        ),
      },
      {
        wave: 'sine',
        gain: 0.25,
        notes: twice('G3:1 D4:1 G3:1 D4:1 C3:1 G3:1 C3:1 G3:1 G3:1 D4:1 G3:1 D4:1 D3:1 A3:1 D3:1 R:1'),
      },
    ],
  },

  // ブロック: 一定のリズムのDマイナー
  block: {
    tempo: 120,
    voices: [
      {
        wave: 'square',
        gain: 0.09,
        notes: lead(
          [
            'A5:1 F5:0.5 G5:0.5 A5:1 G5:0.5 F5:0.5',
            'E5:1 E5:0.5 G5:0.5 C6:1 B5:0.5 A5:0.5',
            'G5:1.5 A5:0.5 B5:1 G5:1',
            'F5:1 E5:1 D5:2',
          ].join(' ')
        ),
      },
      {
        wave: 'triangle',
        gain: 0.22,
        notes: twice('D3:1 A3:1 D3:1 A3:1 C3:1 G3:1 C3:1 G3:1 Bb2:1 F3:1 Bb2:1 F3:1 A2:1 E3:1 A2:2'),
      },
    ],
  },

  // 飛行機: 流れるFメジャー
  airplane: {
    tempo: 140,
    voices: [
      {
        wave: 'sawtooth',
        gain: 0.06,
        notes: lead(
          [
            'F5:0.5 A5:0.5 C6:0.5 A5:0.5 F5:0.5 A5:0.5 C6:0.5 A5:0.5',
            'Bb4:0.5 D5:0.5 F5:0.5 D5:0.5 Bb4:0.5 D5:0.5 F5:0.5 D5:0.5',
            'C5:0.5 E5:0.5 G5:0.5 E5:0.5 C5:0.5 E5:0.5 G5:0.5 E5:0.5',
            'C5:0.5 F5:0.5 A5:0.5 F5:0.5 C6:2',
          ].join(' ')
        ),
      },
      {
        wave: 'sine',
        gain: 0.28,
        notes: twice('F2:4 Bb2:4 C3:4 F2:2 C3:2'),
      },
    ],
  },

  // バトル: 速いEマイナー
  battle: {
    tempo: 165,
    voices: [
      {
        wave: 'sawtooth',
        gain: 0.13,
        notes: lead(
          [
            'E5:0.5 E5:0.5 G5:0.5 E5:0.5 B5:1 A5:0.5 G5:0.5',
            'E5:0.5 E5:0.5 G5:0.5 E5:0.5 C6:1 B5:0.5 A5:0.5',
            'D5:0.5 D5:0.5 F#5:0.5 D5:0.5 A5:1 G5:0.5 F#5:0.5',
            'B4:0.5 E5:0.5 G5:0.5 B5:0.5 E6:2',
          ].join(' ')
        ),
      },
      {
        wave: 'square',
        gain: 0.14,
        notes: twice([eighths('E2', 8), eighths('E2', 8), eighths('D2', 8), `${eighths('B1', 4)} ${eighths('E2', 4)}`].join(' ')),
      },
    ],
  },
};

export const BGM_TRACK_IDS = Object.keys(DEFINITIONS);

// 曲を再生用のデータにする: { tempo, beats, voices: [{ wave, gain, notes: [{ note, beats, freq }], beats }] }
export const getTrack = (id) => {
  const definition = DEFINITIONS[id];
  if (!definition) {
    throw new Error(`BGM の曲が見つかりません: ${id}`);
  }
  const voices = definition.voices.map((voice) => {
    const notes = parseNotes(voice.notes);
    return { wave: voice.wave, gain: voice.gain, notes, beats: totalBeats(notes) };
  });
  return { tempo: definition.tempo, beats: voices[0].beats, voices };
};
