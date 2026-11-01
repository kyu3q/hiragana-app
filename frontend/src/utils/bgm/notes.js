// 音符の記述（"C5:1 R:0.5 E5:2"）を、再生用のデータにする純粋関数。

const SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// "A4" や "F#4"、"Bb3" の周波数（Hz）。休符 "R" は null
export const noteToFrequency = (note) => {
  if (note === 'R') return null;
  const match = /^([A-G])([#b]?)(-?\d)$/.exec(note);
  if (!match) {
    throw new Error(`読めない音名です: ${note}`);
  }
  const [, letter, accidental, octave] = match;
  const accidentalOffset = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
  // A4 (440Hz) を基準に、半音ごとに 2^(1/12) 倍する
  const semitonesFromA4 = SEMITONES[letter] + accidentalOffset + (Number(octave) - 4) * 12 - 9;
  return 440 * 2 ** (semitonesFromA4 / 12);
};

// "音名:拍数" を空白で区切った文字列を、{ note, beats, freq } の配列にする
export const parseNotes = (text) =>
  text
    .trim()
    .split(/\s+/)
    .map((token) => {
      const [note, beatsText] = token.split(':');
      const beats = Number(beatsText);
      if (!beatsText || !(beats > 0)) {
        throw new Error(`拍数が読めません: ${token}`);
      }
      return { note, beats, freq: noteToFrequency(note) };
    });

export const totalBeats = (notes) => notes.reduce((sum, n) => sum + n.beats, 0);
