# メール送信設定ガイド

## Gmail SMTPの設定方法

### 1. Gmailアカウントで2段階認証を有効化

1. [Googleアカウント](https://myaccount.google.com/)にアクセス
2. 「セキュリティ」タブを選択
3. 「2段階認証プロセス」を有効化

### 2. アプリパスワードを生成

1. [アプリパスワード](https://myaccount.google.com/apppasswords)にアクセス
2. 「アプリを選択」→「メール」を選択
3. 「デバイスを選択」→「その他（名前を入力）」→「ひらがなアプリ」と入力
4. 「生成」をクリック
5. 表示された16文字のパスワードをコピー（例: `abcd efgh ijkl mnop`）

### 3. 環境変数を設定

#### 開発環境（ローカル）

`backend`ディレクトリに`.env`ファイルを作成（またはシェル環境変数として設定）:

```bash
export GMAIL_USERNAME=your-email@gmail.com
export GMAIL_APP_PASSWORD=abcdefghijklmnop
export FRONTEND_URL=http://localhost:5173
```

#### 本番環境

環境変数を設定:

```bash
GMAIL_USERNAME=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
FRONTEND_URL=https://your-app-domain.com
```

### 4. 動作確認

1. バックエンドを起動: `cd backend && ./mvnw spring-boot:run`
2. ユーザー登録を行う
3. 登録したメールアドレスに確認メールが届くことを確認

## トラブルシューティング

### メールが届かない

- Gmailアプリパスワードが正しいか確認
- 2段階認証が有効になっているか確認
- スパムフォルダをチェック
- ログでエラーメッセージを確認: `logging.level.org.springframework.mail=DEBUG`

### 認証エラー

- GMAIL_USERNAMEとGMAIL_APP_PASSWORDが環境変数として正しく設定されているか確認
- アプリパスワードにスペースが含まれていないか確認（スペースを削除）

## セキュリティ注意事項

- アプリパスワードは`.env`ファイルに保存し、`.gitignore`に追加
- 本番環境では環境変数として安全に管理
- アプリパスワードは定期的に再生成
