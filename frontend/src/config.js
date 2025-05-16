// APIのベースURL
const isDevelopment = process.env.NODE_ENV === 'development';
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8080'
  : 'http://192.168.50.201:8080';

// その他の設定値
export const APP_CONFIG = {
  // アプリケーションの設定値
  APP_NAME: 'ひらがな練習',
  VERSION: '1.0.0',
  
  // キャンバスの設定
  CANVAS: {
    WIDTH: 200,
    HEIGHT: 200,
    LINE_WIDTH: 4,
    LINE_COLOR: '#FF6B6B'
  }
}; 