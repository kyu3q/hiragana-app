// BGM のミュート設定を、ブラウザに覚えておく。
// 保存領域（localStorage）は、プライベートウィンドウなどで使えないことがあるので、失敗しても動き続ける。

const KEY = 'bgmMuted';

export const createMuteStore = (storage) => ({
  get() {
    try {
      return storage.getItem(KEY) === 'true';
    } catch (error) {
      console.warn('BGM のミュート設定を読み出せませんでした:', error);
      return false;
    }
  },
  set(muted) {
    try {
      storage.setItem(KEY, String(muted));
    } catch (error) {
      console.warn('BGM のミュート設定を保存できませんでした:', error);
    }
  },
});

// ブラウザの localStorage を使うミュート設定。localStorage 自体にさわれない場合は、覚えずに動く
export const createBrowserMuteStore = () => {
  try {
    return createMuteStore(window.localStorage);
  } catch (error) {
    console.warn('localStorage を使えないため、BGM のミュート設定は覚えられません:', error);
    return createMuteStore({ getItem: () => null, setItem: () => {} });
  }
};
