# ひらがな学習アプリケーション

日本語のひらがな、カタカナ、漢字を学習するためのWebアプリケーションです。

## 技術スタック

### フロントエンド
- React
- Vite
- TypeScript

### バックエンド
- Spring Boot 2.7.18
- Java 11
- PostgreSQL（本番環境）
- H2 Database（開発環境）

## プロジェクト構成

```
.
├── frontend/          # Reactフロントエンド
└── backend/           # Spring Bootバックエンド
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── com/
    │   │   │       └── hiragana/
    │   │   │           ├── controller/    # REST APIコントローラー
    │   │   │           ├── model/         # エンティティクラス
    │   │   │           ├── repository/    # データアクセス層
    │   │   │           └── service/       # ビジネスロジック層
    │   │   └── resources/
    │   │       └── application.properties # アプリケーション設定
    │   └── test/      # テストコード
    └── pom.xml        # Maven設定
```

## 開発環境のセットアップ

### 必要条件
- Java 11以上
- Node.js 18以上
- PostgreSQL 14以上（本番環境用）
- Maven

### フロントエンドのセットアップ
```bash
cd frontend
npm install
npm run dev
```

### バックエンドのセットアップ

#### 開発環境（H2 Database）
```bash
cd backend
./mvnw spring-boot:run
```

#### 本番環境（PostgreSQL）
1. PostgreSQLのインストール
```bash
# macOSの場合
brew install postgresql@14
```

2. データベースの作成
```bash
createdb hiragana_db
```

3. 環境変数の設定
```bash
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
```

4. アプリケーションの起動
```bash
cd backend
./mvnw spring-boot:run -Dspring.profiles.active=prod
```

## アプリケーションへのアクセス

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8080
- H2コンソール（開発環境）: http://localhost:8080/h2-console

## データベース設計

### ユーザー（users）
- ユーザー情報の管理
- 認証情報の保持

### 文字（characters）
- ひらがな、カタカナ、漢字の基本情報
- 読み方、意味、例文
- 難易度、筆順データ

### 進捗（progress）
- ユーザーの学習進捗
- 練習回数、正解率
- 習熟度レベル

### 描画データ（drawings）
- ユーザーの描画データ
- 正確性スコア
- AIフィードバック

## 環境設定

### 開発環境（dev）
- H2 Database
- インメモリ/ファイルベース
- H2コンソール有効

### 本番環境（prod）
- PostgreSQL
- 環境変数による認証情報の管理
- 本番用の最適化設定

## ライセンス
MIT License
