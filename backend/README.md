# ひらがなアプリ - バックエンド

Spring Boot 2.7.18で構築されたRESTful APIバックエンド。

## 技術スタック

- Java 11
- Spring Boot 2.7.18
- Spring Security（JWT認証）
- Spring Mail（メール認証）
- H2 Database（開発環境）
- Maven

## 必要条件

- Java 11以上
- Maven 3.6以上
- Gmail アカウント（メール認証機能を使用する場合）

## セットアップ

### 1. 環境変数の設定

メール認証機能を使用するには、Gmailアプリパスワードの設定が必要です。

```bash
# .envファイルを作成
cp .env.example .env
```

`.env`ファイルを編集して以下の値を設定:

```bash
# Gmailアドレス
GMAIL_USERNAME=your-email@gmail.com

# Gmailアプリパスワード（スペースなし16文字）
GMAIL_APP_PASSWORD=abcdefghijklmnop

# フロントエンドURL
FRONTEND_URL=http://localhost:5173
```

#### Gmailアプリパスワードの取得方法

1. **2段階認証を有効化**
   - https://myaccount.google.com/security にアクセス
   - 2段階認証プロセスを有効にする

2. **アプリパスワードを生成**
   - https://myaccount.google.com/apppasswords にアクセス
   - アプリ名を入力（例: "Hiragana App"）
   - 「生成」をクリック

3. **パスワードをコピー**
   - 表示された16文字のパスワードをコピー（`abcd efgh ijkl mnop`形式）
   - **重要**: スペースを除去して.envに設定（`abcdefghijklmnop`）

### 2. アプリケーションの起動

#### 方法1: run-dev.sh を使用（推奨）

`.env`ファイルを自動的に読み込んで起動します。

```bash
./run-dev.sh
```

起動時に以下の情報が表示されます:

```
📧 .envファイルから環境変数を読み込んでいます...
✅ 環境変数を読み込みました
📧 GMAIL_USERNAME: your-email@gmail.com
🌐 FRONTEND_URL: http://localhost:5173

🚀 Spring Bootを起動しています...

================================================================================
📧 メール設定の診断情報
================================================================================
spring.mail.host:     smtp.gmail.com
spring.mail.port:     587
spring.mail.username: ✓ your-email@gmail.com
spring.mail.password: ✓ 設定されています（16文字）
app.frontend.url:     http://localhost:5173
================================================================================
```

#### 方法2: Maven で直接起動（環境変数の手動設定が必要）

```bash
# 環境変数を読み込む
export $(cat .env | grep -v '^#' | xargs)

# Mavenで起動
./mvnw spring-boot:run
```

**注意**: `./mvnw spring-boot:run`だけで起動すると、`.env`ファイルが読み込まれず、メール認証機能が動作しません。

## API エンドポイント

起動後、以下のURLでアクセスできます:

- **API**: http://localhost:8080
- **H2コンソール**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: （空）

### 主要なエンドポイント

#### 認証
- `POST /api/auth/register` - ユーザー登録（メール確認メールを送信）
- `POST /api/auth/login` - ログイン
- `GET /api/auth/verify?token=xxx` - メールアドレス確認

#### ユーザー
- `GET /api/users/me` - 現在のユーザー情報
- `PUT /api/users/me` - ユーザー情報更新

#### 文字
- `GET /api/characters` - 文字一覧取得
- `GET /api/characters/{id}` - 文字詳細取得

#### 進捗
- `GET /api/progress` - 学習進捗取得
- `POST /api/progress` - 学習進捗記録

## トラブルシューティング

### メール認証エラー: "failed to connect, no password specified"

**原因**: 環境変数が正しく読み込まれていません。

**解決方法**:

1. `.env`ファイルが存在し、正しく設定されているか確認
   ```bash
   cat .env
   ```

2. アプリパスワードのスペースが除去されているか確認
   - ❌ `GMAIL_APP_PASSWORD=abcd efgh ijkl mnop`（スペースあり）
   - ✅ `GMAIL_APP_PASSWORD=abcdefghijklmnop`（スペースなし）

3. `./run-dev.sh`で起動しているか確認
   - ❌ `./mvnw spring-boot:run`（.env読み込まない）
   - ✅ `./run-dev.sh`（.env自動読み込み）

4. 起動時の診断情報を確認
   - `spring.mail.username: ✓` になっているか
   - `spring.mail.password: ✓` になっているか

### H2 コンソールにアクセスできない

**解決方法**: `application.properties`で`spring.h2.console.enabled=true`が設定されているか確認してください。

### ポート8080が既に使用されている

**解決方法**:
```bash
# 使用中のプロセスを確認
lsof -i :8080

# プロセスを終了
kill -9 <PID>
```

## 開発

### コードの整形

```bash
./mvnw spring-boot:format
```

### テストの実行

```bash
./mvnw test
```

### ビルド

```bash
./mvnw clean package
```

## 設定ファイル

- `application.properties` - アプリケーション設定
- `.env` - 環境変数（Gitにコミットしない）
- `.env.example` - 環境変数のテンプレート

## セキュリティ

- JWT トークンによる認証
- パスワードはBCryptでハッシュ化
- CORS設定によるフロントエンドからのアクセス制限
- メール認証による本人確認

## ライセンス

このプロジェクトはオープンソースです。
