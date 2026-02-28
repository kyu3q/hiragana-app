# 漢字手書き保存機能 設計書

**作成日**: 2026-02-28
**対象機能**: 漢字9マスなぞり書きの保存と漢字表への表示

## 概要

9マスのなぞり書き練習で、ユーザーが気に入った1つの手書き文字を保存し、漢字表に表示する機能。

## 要件

### 機能要件

1. **保存機能**
   - 9マスそれぞれに「保存」ボタンを配置
   - ユーザーが気に入った1マスを選択して保存
   - 同じ漢字で再度保存する場合は上書き確認ダイアログを表示

2. **表示機能**
   - 漢字表の各セルの下部に保存した手書き文字を表示
   - 手書き文字はセル幅の60%程度の小さいサイズで表示
   - 保存していない漢字は空欄

3. **データ管理**
   - ユーザーごとに保存データを管理
   - 学年別にフィルタリング可能

## データベース設計

### 新規テーブル: saved_handwriting

```sql
CREATE TABLE saved_handwriting (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    position INT NOT NULL,
    strokes TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_character (user_id, character_id)
);
```

### フィールド説明

- `id`: プライマリキー
- `user_id`: ユーザーID（外部キー）
- `character_id`: 漢字ID（外部キー）
- `position`: 保存元の9マス位置（0-8）
- `strokes`: 手書きデータ（JSON形式）
- `created_at`: 作成日時
- `updated_at`: 更新日時
- `UNIQUE KEY`: 1ユーザーにつき1漢字1つまで保存

### strokes データ形式

```json
[
  {
    "points": [
      {"x": 100, "y": 150},
      {"x": 102, "y": 152}
    ]
  }
]
```

## API設計

### 1. 手書き保存

**エンドポイント**: `POST /api/handwriting`

**リクエストボディ**:
```json
{
  "userId": 1,
  "characterId": 123,
  "position": 5,
  "strokes": [...]
}
```

**レスポンス**:
```json
{
  "id": 456,
  "message": "保存しました"
}
```

### 2. 既存データチェック

**エンドポイント**: `GET /api/handwriting/check?userId={userId}&characterId={characterId}`

**レスポンス**:
```json
{
  "exists": true,
  "handwritingId": 456
}
```

### 3. ユーザーの保存データ取得

**エンドポイント**: `GET /api/handwriting/user/{userId}?grade={grade}`

**パラメータ**:
- `userId`: ユーザーID（必須）
- `grade`: 学年（オプション）

**レスポンス**:
```json
[
  {
    "id": 456,
    "characterId": 123,
    "character": "山",
    "grade": 1,
    "position": 5,
    "strokes": [...],
    "createdAt": "2026-02-28T12:00:00"
  }
]
```

### 4. 手書き更新

**エンドポイント**: `PUT /api/handwriting/{id}`

**リクエストボディ**: POST と同じ形式

### 5. 手書き削除

**エンドポイント**: `DELETE /api/handwriting/{id}`

## UI設計

### 9マスグリッド（WritingGrid）

#### 変更前
```
┌──────────────────┐
│  [手書きプレビュー]  │
└──────────────────┘
```

#### 変更後
```
┌──────────────────┐
│  [手書きプレビュー]  │
│                  │
│   📌 保存する     │
└──────────────────┘
```

**仕様**:
- 手書きデータがある場合のみ「保存」ボタンを表示
- 既に保存済みの場合は「保存済み ✓」と表示（クリック不可）
- ボタンはマス下部に配置、ホバー時に色変化

### 漢字表（KanjiChart）

#### 変更前
```
┌──────────────┐
│  🌸（花丸）   │
│      山       │
│    やま       │
│    ⭐⭐⭐    │
└──────────────┘
```

#### 変更後
```
┌──────────────┐
│  🌸（花丸）   │
│      山       │
│    やま       │
│ [手書き文字]  │
└──────────────┘
```

**仕様**:
- 進捗（⭐）を削除し、保存した手書き文字に置き換え
- 手書きサイズはセル幅の60%程度
- 保存データがない場合は空欄

## 処理フロー

### 保存処理

```
ユーザーが「保存」ボタンクリック
    ↓
既存データチェック（GET /api/handwriting/check）
    ↓
    ├─ 既存なし → 保存（POST）
    │              ↓
    │            成功メッセージ
    │
    └─ 既存あり → 確認ダイアログ
                  「この漢字は既に保存されています。上書きしますか？」
                  [キャンセル] [上書き]
                    ↓
                  上書き（PUT）
                    ↓
                  成功メッセージ
```

### 表示処理

```
漢字表を開く
    ↓
学年を選択（例: 1年生）
    ↓
保存データ取得（GET /api/handwriting/user/{userId}?grade=1）
    ↓
各漢字セルに手書きデータをマッピング
    ↓
手書きがあれば表示
```

## エラーハンドリング

| エラー種類 | メッセージ | 処理 |
|-----------|-----------|------|
| ネットワークエラー | 保存に失敗しました。もう一度お試しください | リトライ可能 |
| 認証エラー | ログインしてください | ログイン画面へリダイレクト |
| サーバーエラー | サーバーエラーが発生しました | エラー表示 |

## 実装ファイル

### バックエンド

- `backend/src/main/java/com/hiragana/model/SavedHandwriting.java` - エンティティ
- `backend/src/main/java/com/hiragana/repository/SavedHandwritingRepository.java` - リポジトリ
- `backend/src/main/java/com/hiragana/service/HandwritingService.java` - サービス
- `backend/src/main/java/com/hiragana/controller/HandwritingController.java` - コントローラー
- `backend/src/main/java/com/hiragana/dto/SaveHandwritingRequest.java` - DTO

### フロントエンド

- `frontend/src/components/WritingGrid/WritingGrid.jsx` - 保存ボタン追加
- `frontend/src/components/KanjiChart/KanjiChart.jsx` - 手書き表示追加
- `frontend/src/api/handwritingService.js` - API通信
- `frontend/src/components/WritingGrid/WritingGrid.css` - スタイル更新
- `frontend/src/components/KanjiChart/KanjiChart.css` - スタイル更新

## 実装順序

1. **バックエンド実装**
   - エンティティ・リポジトリ作成
   - サービス層実装
   - コントローラー実装
   - テスト

2. **フロントエンド実装**
   - API通信サービス作成
   - WritingGridに保存ボタン追加
   - KanjiChartに手書き表示追加
   - スタイル調整

3. **統合テスト**
   - 保存機能の動作確認
   - 上書き確認ダイアログの動作確認
   - 漢字表での表示確認

## セキュリティ考慮事項

- すべてのAPIエンドポイントで認証チェック実施
- ユーザーIDは JWT トークンから取得（リクエストボディのuserIdは参考値）
- 他ユーザーのデータへのアクセスを防止

## パフォーマンス考慮事項

- 学年別にデータ取得することでデータ量を削減
- 手書きデータはJSONでテキスト保存（圧縮可能）
- インデックス: `user_id`, `character_id`, `(user_id, character_id)`
