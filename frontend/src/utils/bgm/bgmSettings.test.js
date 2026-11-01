import { describe, it, expect, vi } from 'vitest';
import { createMuteStore } from './bgmSettings';

const createFakeStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
  };
};

const createBrokenStorage = () => ({
  getItem: () => { throw new Error('保存領域が使えません'); },
  setItem: () => { throw new Error('保存領域が使えません'); },
});

describe('createMuteStore', () => {
  it('何も保存されていなければ、ミュートしていない', () => {
    expect(createMuteStore(createFakeStorage()).get()).toBe(false);
  });

  it('保存したミュート設定を、あとから読み出せる', () => {
    const storage = createFakeStorage();
    createMuteStore(storage).set(true);
    expect(createMuteStore(storage).get()).toBe(true);
  });

  it('ミュートを解除した設定も保存される', () => {
    const storage = createFakeStorage();
    const store = createMuteStore(storage);
    store.set(true);
    store.set(false);
    expect(store.get()).toBe(false);
  });

  it('保存領域が使えなくても、読み出しは例外にせず、ミュートしていない扱いにする', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(createMuteStore(createBrokenStorage()).get()).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('保存領域が使えなくても、書き込みは例外にせず警告を出す', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => createMuteStore(createBrokenStorage()).set(true)).not.toThrow();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
