import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createBgmPlayer, MASTER_VOLUME } from './bgmPlayer';
import { getTrack } from './bgmTracks';

// 音を出さずに、呼び出しだけを記録する偽の AudioContext
class FakeParam {
  constructor(value = 0) { this.value = value; }
  setValueAtTime() {}
  linearRampToValueAtTime() {}
  setTargetAtTime(target) { this.value = target; }
}
class FakeNode {
  constructor(kind) { this.kind = kind; this.connections = []; this.stopCalls = 0; this.startTime = null; }
  connect(node) { this.connections.push(node); }
  disconnect() {}
  start(time) { this.startTime = time; }
  stop() { this.stopCalls += 1; }
}
class FakeContext {
  constructor() {
    this.currentTime = 0;
    this.state = 'running';
    this.destination = new FakeNode('destination');
    this.oscillators = [];
    this.gains = [];
    this.resumeCalls = 0;
  }
  createOscillator() {
    const node = new FakeNode('oscillator');
    node.type = 'sine';
    node.frequency = new FakeParam();
    this.oscillators.push(node);
    return node;
  }
  createGain() {
    const node = new FakeNode('gain');
    node.gain = new FakeParam(1);
    this.gains.push(node);
    return node;
  }
  resume() { this.resumeCalls += 1; return Promise.resolve(); }
}

describe('createBgmPlayer', () => {
  let ctx;
  let player;

  beforeEach(() => {
    vi.useFakeTimers();
    ctx = new FakeContext();
    player = createBgmPlayer({ createContext: () => ctx });
  });

  afterEach(() => {
    player.stop();
    vi.useRealTimers();
  });

  it('曲を再生すると、その曲のパートの音を予約する', () => {
    player.play('jump');
    const track = getTrack('jump');
    const expected = track.voices.reduce((sum, v) => sum + v.notes.filter((n) => n.freq !== null).length, 0);
    expect(ctx.oscillators).toHaveLength(expected);
  });

  it('パートの音色（波形）が曲の定義どおりになる', () => {
    player.play('jump');
    const waves = new Set(ctx.oscillators.map((o) => o.type));
    expect(waves).toEqual(new Set(getTrack('jump').voices.map((v) => v.wave)));
  });

  it('同じ曲を続けて再生しても、音を重ねない', () => {
    player.play('jump');
    const count = ctx.oscillators.length;
    player.play('jump');
    expect(ctx.oscillators).toHaveLength(count);
  });

  it('別の曲に切り替えると、前の曲の音を止める', () => {
    player.play('jump');
    const before = [...ctx.oscillators];
    player.play('snake');
    expect(before.every((o) => o.stopCalls > 0)).toBe(true);
    expect(ctx.oscillators.length).toBeGreaterThan(before.length);
  });

  it('止めると、すべての音を止める', () => {
    player.play('battle');
    player.stop();
    expect(ctx.oscillators.every((o) => o.stopCalls > 0)).toBe(true);
  });

  it('止めたあとに、同じ曲をもう一度再生できる', () => {
    player.play('catch');
    player.stop();
    const count = ctx.oscillators.length;
    player.play('catch');
    expect(ctx.oscillators.length).toBeGreaterThan(count);
  });

  it('ループの終わりが近づいたら、次のループを予約する', () => {
    player.play('jump');
    const first = ctx.oscillators.length;
    const loopSeconds = (getTrack('jump').beats * 60) / getTrack('jump').tempo;
    ctx.currentTime = loopSeconds - 1;
    vi.advanceTimersByTime(600);
    expect(ctx.oscillators.length).toBe(first * 2);
  });

  it('ループの途中では、次のループを予約しない', () => {
    player.play('jump');
    const first = ctx.oscillators.length;
    ctx.currentTime = 1;
    vi.advanceTimersByTime(600);
    expect(ctx.oscillators).toHaveLength(first);
  });

  it('次のループの音は、前のループの終わりに続けて始まる', () => {
    player.play('jump');
    const first = ctx.oscillators.length;
    const loopSeconds = (getTrack('jump').beats * 60) / getTrack('jump').tempo;
    ctx.currentTime = loopSeconds - 1;
    vi.advanceTimersByTime(600);
    const firstStart = Math.min(...ctx.oscillators.slice(0, first).map((o) => o.startTime));
    const secondStart = Math.min(...ctx.oscillators.slice(first).map((o) => o.startTime));
    expect(secondStart - firstStart).toBeCloseTo(loopSeconds, 5);
  });

  it('ミュートすると音量が0になり、解除すると元の音量に戻る', () => {
    player.play('jump');
    const master = ctx.gains[0];
    expect(master.gain.value).toBe(MASTER_VOLUME);
    player.setMuted(true);
    expect(master.gain.value).toBe(0);
    player.setMuted(false);
    expect(master.gain.value).toBe(MASTER_VOLUME);
  });

  it('再生前にミュートを設定しておくと、再生しても無音のまま', () => {
    player.setMuted(true);
    player.play('jump');
    expect(ctx.gains[0].gain.value).toBe(0);
  });

  it('ブラウザの自動再生の制限で止まっていたら、再開を要求する', () => {
    ctx.state = 'suspended';
    player.play('jump');
    expect(ctx.resumeCalls).toBe(1);
  });

  it('AudioContext が作れない環境では、例外にせず警告を出して false を返す', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const broken = createBgmPlayer({ createContext: () => { throw new Error('非対応'); } });
    expect(broken.play('jump')).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('知らない曲名は、例外にする', () => {
    expect(() => player.play('unknown')).toThrow('unknown');
  });
});
